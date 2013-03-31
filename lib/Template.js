var RenderBuffer = require("./RenderBuffer.js") ;
var Generator = require("./Generator.js") ;
var Parser = require("./Parser.js") ;
var Class = require("ocClass/lib/Class.js") ;

var Template = module.exports = Class.extend({

	ctor: function(path,parser,generator)
	{
		this.filePath = path ;
		this.fileContent = null ;
		this.document = null ;
		this.uiroot = null ;
		this.parser = parser || Parser.singleton ;
		this.generator = generator || Generator.singleton ;
		this.renderer = null ;
		// this.uiObjectShaders = new UIObjectShaders(this.uiObjectPool) ;

		this.loaded = false ;
		this.loading = false ;
		this.loadCallbacks = [] ;

		this._id = Template._assigned_id ++ ;
	}

	, load: function(callback,parser)
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

				this._readTemplateFile(function(err,buff){

					if(err)
					{
						tpl._loadDone(err) ;
						return ;
					}

					tpl.fileContent = buff ;

					try{
						(parser||tpl.parser).parseSync(tpl) ;
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
	}

	, _readTemplateFile: function(callback){
		var fs = require("fs") ;
		fs.readFile(this.filePath,callback);
	}

	, _loadDone: function(err){

		var tpl = this ;

		this.loaded = true ;
		this.loading = false ;

		for(var i=0;i<this.loadCallbacks.length;i++)
		{
			(function(callback){

				// 异步回调
				setTimeout(function(){
					callback(err,tpl) ;
				},0);

			})(this.loadCallbacks[i]) ;
		}

		// 清理回调函数
		this.loadCallbacks = [] ;
	}

	, hasLoaded: function() {
		return this.loaded ;
	}

	, compile: function(recompile,generator)
	{
		if( !this.renderer || recompile )
		{
			this.renderer = (generator || this.generator).makeSync(this) ;
		}
	}

	, render: function(model,callback,buff)
	{
		this.compile(false,null) ;

		this.renderer( model, buff||new RenderBuffer, callback, require ) ;
	}

	, hasParsed: function() {
		return this.uitree!==null ;
	}
	, hasCompiled: function() {
		return this.renderer!==null ;
	}

	, exportRenderer: function()
	{
		return this.renderer? this.renderer.toString(): '' ;
	}

}) ;


Template._assigned_id = 0 ;




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

