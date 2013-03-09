var DomElements = require("./DOM.js") ;
var HtmlParserFactory = require("ocHtmlParser/lib/Factory.js") ;
var UIObjects = require("ocHtmlParser/lib/ElementObjs.js") ;
var initSizzle = require("./sizzle.js") ;
var shaderNode = require("./shaderfuncs/node.js").shader ;
var shaderTag = require("./shaderfuncs/tag.js").shader ;
var shaderText = require("./shaderfuncs/text.js").shader ;
var HtmlSource = require("ocHtmlParser/lib/HtmlSource.js") ;
var UIExpression = require("./UIExpression.js") ;
var Class = require("ocClass/lib/Class.js") ;

var Parser = module.exports = function Parser(){

	this.htmlParser = HtmlParserFactory.create(Parser.htmlParserFactoryConfig) ;
	this._shaderFuncs = [] ;

	var shaderNames = ["if","include"] ;
	for(var i=0;i<shaderNames.length;i++)
	{
		var shader = require("./shaderfuncs/"+shaderNames[i]+".js") ;
		this.registerShaderFunction(shader.selector,shader.shader) ;
	}
}

Parser.uiobjectClassShaders = {
	"ElementNode": [ shaderNode ]
	, "ElementTag": [ shaderTag ]
	, "ElementText": [ shaderText ]
	, "ElementScript": [ shaderText ]
	, "ElementComment": [ shaderText ]
}

Parser.htmlParserFactoryConfig = {} ;
Class.cloneObject(Parser.htmlParserFactoryConfig,HtmlParserFactory.configs.html) ;
Parser.htmlParserFactoryConfig.stateMachines.StateTag.properties.emptyTags.else = 1 ;
Parser.htmlParserFactoryConfig.stateMachines.StateTag.properties.emptyTags.elseif = 1 ;


Parser.prototype._shaderFuncs = [] ;

Parser.prototype.registerShaderFunction = function(selector,shaderFunc)
{
	this._shaderFuncs.push({
		selector: selector
		, shader: shaderFunc
	}) ;
}

Parser.prototype.parseSync = function(tpl)
{

	tpl.document = new DomElements.Document() ;

	// 置换模板中的表达式
	var fileContent = this._stripExpression(tpl.fileContent) ;

	// 分析模板内容
	tpl.uiroot = tpl.document.rawObj = this.htmlParser.parseSync(fileContent.text) ;

	// 还原表达式
	this._rebuildExpression(tpl.uiroot,fileContent.expressions) ;

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

	var ProcessText = function ProcessText(uiobject)
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
		var hasExpression = false ;

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

			hasExpression = true ;
		}

		// 最后一段
		if( hasExpression )
		{
			var string = uiobject.text.substr(lastIndex,uiobject.text.length-lastIndex) ;
			children(uiobject).push(string||"") ;
		}
	}

	// 遍历属性
	if( typeof uiobject.headTag!=="undefined" && uiobject.headTag!==null )
	{
		for(var i=0; i<uiobject.headTag.attributes.length; i++)
		{
			var attr = uiobject.headTag.attributes[i] ;

			// 属性值以 @ 开头
			var res = /^\s*@(.+)$/.exec(attr.text.raw) ;
			if( res )
			{
				uiobject.headTag.attributes[i].text
				attr.text = new UIExpression(attr.text.start,attr.text.raw,res[1]) ;
			}
			else
			{
				ProcessText(uiobject.headTag.attributes[i].text) ;
			}
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
				ProcessText(child) ;
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
							var name = attr.name||attr.text.toString() ;
							if(name)
							{
								DomElements.Element.prototype.setAttribute.apply( ele, [name, attr.text.toString()] ) ;
							}
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

Parser.singleton = new Parser ;
