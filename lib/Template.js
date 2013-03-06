require('seajs') ;
define(function(require){

	var fs = require("fs") ;
	var RenderContext = require("./RenderContext.js") ;

	var Template = function(filePath)
	{
		this.filePath = filePath;
		this.fileContent = null ;
		this.document = null ;
		this.uiroot = null ;
		this.shaders = {} ;
		// this.uiObjectShaders = new UIObjectShaders(this.uiObjectPool) ;

		this.loaded = false ;
		this.loading = false ;
		this.loadCallbacks = [] ;
	}

	Template.prototype.load = function(callback,parser)
	{
		// 加载、分析 模板
		if(!this.loaded)
		{
			var tpl = this ;

			if(callback)
			{
				this.loadCallbacks.push(callback) ;
			}

			if(!this.loading)
			{
				this.loading = true ;

				fs.readFile(this.filePath,function(err,buff){

					if(err)
					{
						tpl._loadDone(err) ;
						return ;
					}

					tpl.fileContent = buff ;

					try{
						parser.parseSync(tpl) ;
					} catch(e) {
						tpl._loadDone(e) ;
					}

					tpl._loadDone(null) ;
				}) ;
			}
		}

		// 
		else
		{
			if(callback)
			{
				callback(null,this) ;
			}
		}
	} ;

//	Template.prototype._buildTree = function(ele){
//
//		var obj = (ele.nodeName=='#text')?
//						new _TemplateElementText(ele) :
//						new _TemplateElementNode(ele) ;
//
//		obj.poolIdx = ele.poolIdx = this.uiObjectPool.length ;
//		this.uiObjectPool.push(obj) ;
//
//		// 递归处理下级
//		if( ele.childNodes.length )
//		{
//			for(var i=0;i<ele.childNodes.length;i++)
//			{
//				obj.children.push( this._buildTree( ele.childNodes[i] ) ) ;
//			}
//		}
//
//		return obj ;
//	}


	Template.prototype._loadDone = function(err){

		var tpl = this ;

		this.loaded = true ;
		this.loading = false ;

		for(var i=0;i<this.loadCallbacks.length;i++)
		{
			(function(callback){

				// 异步回调
				setTimeout(function(){
					callback(err,tpl.createRenderContext()) ;
				},0);

			})(this.loadCallbacks[i]) ;
		}

		// 清理回调函数
		this.loadCallbacks = [] ;
	}

	Template.prototype.hasLoaded = function() {
		return this.loaded ;
	};

	Template.prototype.applyShader = function(shader,shaderCache){

		shaderCache = shaderCache || this.shaders ;

		var eleLst = this.Sizzle(shader.selector) ;
		for(var l=0;l<eleLst.length;l++){
			if( eleLst[l].id!==null )
			{
				if( typeof shaderCache[eleLst[l].id]!=="array" )
				{
					shaderCache[eleLst[l].id] = [] ;
				}
				shaderCache[eleLst[l].id].push(shader) ;
			}
		}
	}

	Template.prototype.hasParsed = function() {
		return this.uitree!==null ;
	};

	Template.prototype.createRenderContext = function() {
		return new RenderContext(this) ;
	} ;


	////////
	var _TemplateElementNode = function (ele){
		this.tagName = ele._tagName ;
		//this.single = single || false ;
		this.attributes = {} ;
		this.children = [] ;

		// attribute

		for(var i=0;i<ele._attributes.length;i++)
		{
			this.attributes[ele.attributes[i].name] = ele.attributes[i].value
		}
	}

	var _TemplateElementText = function (ele){
		this.text = ele.nodeValue ;
	}


	return Template ;
}) ;