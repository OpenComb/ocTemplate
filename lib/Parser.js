require('seajs') ;
define(function(require){

	var HtmlParserFactory = require("ocHtmlParser.js/lib/Factory.js") ;
	var UIObjects = require("ocHtmlParser.js/lib/ElementObjs.js") ;
	var DomElements = require("./DOM.js") ;
	var initSizzle = require("./sizzle.js") ;
	var shaderNode = require("./shaderfuncs/node.js").shader ;
	var shaderText = require("./shaderfuncs/text.js").shader ;
	var HtmlSource = require("ocHtmlParser.js/lib/HtmlSource.js") ;
	var UIExpression = require("./UIExpression.js") ;


	var Parser = function(){
		this.htmlParser = HtmlParserFactory.htmlParser() ;
	}

	Parser.uiobjectClassShaders = {
		"ElementNode": [ shaderNode ]
		, "ElementText": [ shaderText ]
		, "ElementScript": [ shaderText ]
		, "ElementComment": [ shaderText ]
	}


	Parser.prototype._shaderFuncs = [] ;

	Parser.prototype.registerShaderFunction = function(selector,shaderFunc)
	{
		this._shaderFuncs.push({
			selector: selector
			, shader: shaderFunc
		}) ;
	}

	Parser.prototype.registerBuildinShaderFunctions = function()
	{

		var shaderNames = ["if"] ;

		for(var i=0;i<shaderNames.length;i++)
		{
			var shader = require("./shaderfuncs/"+shaderNames[i]+".js") ;
			this.registerShaderFunction(shader.selector,shader.shader) ;
		}

	};

	Parser.prototype.parseSync = function(tpl)
	{

		tpl.document = new DomElements.Document() ;

		// 置换模板中的表达式
		var fileContent = this._stripExpression(tpl.fileContent) ;

		// 分析模板内容
		tpl.uiroot = tpl.document.rawObj = this.htmlParser.parseSync(fileContent.text) ;

		// 还原表达式
		//this._rebuildExpression(tpl.uiroot,fileContent.expressions) ;

		// 建立 DOM
		this._buildDomElement(tpl.uiroot,tpl.document) ;

		// 初始化 sizzle 选择器
		initSizzle(tpl) ;

		// 连接内置 shader
		for(var i=0;i<this._shaderFuncs.length;i++)
		{
			tpl.applyShader(this._shaderFuncs[i]) ;
		}
	};

	Parser.prototype._stripExpression = function(contents)
	{
		var source = new HtmlSource(contents.toString()) ;
		var lastIndex = 0 ;

		var contents = {
			expressions: []
			, text: ""
		}

		while( !source.isEnd() )
		{
			var open = source.untilReturnMatch(/[<\{]%/g) ;
			if(!open)
			{
				break ;
			}

			var start = source.seek ;
			var close = source.untilReturnMatch(/%[>\}]/g) ;
			if(!close)
			{
				throw new Error("模板遇到没有结束的表达式标记 <%") ;
			}

			source.seek+= 2 ;
			var raw = source.substr(start,source.seek-start) ;

			try{
				var exp = new UIExpression(start,raw) ;
			}catch (e){
				if( e.constructor===SyntaxError )
				{
					throw new Error("模板中的表达式存在语法错误："+raw) ;
				}
				else
				{
					throw e ;
				}
			}
			exp.index = contents.expressions.length ;
			contents.expressions.push(exp) ;

			contents.text+= source.substr( lastIndex, start-lastIndex ) ;
			lastIndex = source.seek ;

			contents.text+= "--~~{EXPRESSION[@" + exp.index + "]}~~--" ;
		}

		contents.text+= source.substr( lastIndex, source.seek-lastIndex ) ;

		return contents ;
	}

	Parser.prototype._rebuildExpression = function(uiobject,exprs){

		var ProcessTest = function ProcessTest(uiobject)
		{
			var children = function(uiobject)
			{
				if( typeof uiobject.children=="undefined" )
				{
					uiobject.children = [] ;
				}
				return uiobject.children ;
			}

			var regexp = /\-\-~~\{EXPRESSION\[@([\d]+)\]\}~~\-\-/g ;
			var res ;

			for( var lastIndex=0 ;
				 res=regexp.exec(uiobject.text) ;
				 lastIndex = res.index + res[0].length
			){
				var idx = parseInt( res[1] ) ;

				var string = uiobject.text.substr(lastIndex,res.index-lastIndex) ;
				if(string){
					children(uiobject).push(string) ;
				}
				children(uiobject).push(exprs[idx]) ;
			}

			var string = uiobject.text.substr(lastIndex,uiobject.text.length-lastIndex-1) ;
			if(string){
				children(uiobject).push(string) ;
			}
		}

		// 遍历属性
		if( typeof uiobject.headTag!=="undefined" && uiobject.headTag!==null )
		{
			for(var i=0; i<uiobject.headTag.attributes.length; i++)
			{
				ProcessTest(uiobject.headTag.attributes[i].text) ;
			}
		}

		// 遍历文本类型
		if( typeof uiobject.children!=="undefined" )
		{
			for(var i=0; i<uiobject.children.length; i++)
			{
				var child = uiobject.children[i] ;
				if( child.constructor===UIObjects.ElementText )
				{
					ProcessTest(child) ;
				}
				else if(child.constructor===UIObjects.ElementNode)
				{
					// 递归下级
					this._rebuildExpression(child,exprs) ;
				}
			}
		}
	}

	Parser.prototype._buildDomElement = function(uiObj,domEle)
	{
		for(var i=0;i<uiObj.children.length;i++)
		{
			var child = uiObj.children[i] ;
			if(!child)
			{
				throw new Error("child 无效："+typeof(uiObj)) ;
			}

			var childEle = this._createDomElement(child,domEle) ;
			// domEle.appendChild(childEle) ;

			if(child.constructor===UIObjects.ElementNode)
			{
				this._buildDomElement(child,childEle) ;
			}
		}
	}
	Parser.prototype._createDomElement = function(uiObj,parent) {

		var document = parent.ownerDocument || parent ;

		switch(uiObj.constructor){

			case UIObjects.ElementNode :

				switch(uiObj.tagName.toLowerCase())
				{
					// <!DOCTYPE ...>
					case "!doctype" :
						var ele = new DomElements.DocumentType(document,uiObj.tagName) ;
						parent.appendChild(ele) ;

						if(!document._doctype)
						{
							document._doctype = ele ;
						}
						break ;

					// 普通Node
					default :

						var ele = new DomElements.Element(document,uiObj.tagName) ;
						parent.appendChild(ele) ;

						// 节点属性
						if(uiObj.headTag)
						{
							for(var i=0;i<uiObj.headTag.attributes.length;i++)
							{
								var attr = uiObj.headTag.attributes[i] ;
								DomElements.Element.prototype.setAttribute.apply( ele, [attr.name||attr.text.toString(), attr.text.toString()] ) ;
							}
						}
						break ;
				}

				break ;

			case UIObjects.ElementScript :
			case UIObjects.ElementText :
				var ele = new DomElements.Text(document,uiObj.text,false) ;
				parent.appendChild(ele) ;
				break ;

			// 注释
			case UIObjects.ElementComment :
				var ele = new DomElements.Comment(document,uiObj.raw) ;
				parent.appendChild(ele) ;
				break ;

			default :
				throw new Error("遇到意外的UI对象类型："+uiObj.constructor.name) ;
				break ;
		}

		ele.rawObj = uiObj ;
		return ele ;
	}

	return Parser ;

});