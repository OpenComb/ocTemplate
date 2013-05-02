var RenderBuffer = require("./RenderBuffer.js") ;
var Generator = require("./Generator.js") ;
var RenderHelper = require("./RenderHelper.js") ;
var Class = require("occlass/lib/Class.js") ;
var initjquery = require("./jquery.js") ;

// only backend
if(typeof window=='undefined')
{
	// 将 require函数名拆开，避免被 ship down
	var jsdom = module["requir"+"e"]("jsdom") ;
}

var Template = module.exports = Class.extend({

	ctor: function(path,generator)
	{
		this.filePath = path ;
		this.window = null ;
		this.generator = generator || Generator.singleton ;
		this.renderer = null ;
		this.helper = RenderHelper.singleton() ;

		this.loaded = false ;
		this.loading = false ;
		this.loadCallbacks = [] ;

		this._id = Template._assigned_id ++ ;

		this._signedEleId = 0 ;
		this._eleShaders = null ;
	}

	, load: function(callback)
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
				this.reset() ;

				this.loading = true ;

				this._readTemplateFile(function(err,buff){

					if(err)
					{
						tpl._loadDone(err) ;
						return ;
					}
					tpl._buildDom(buff,tpl._loadDone.bind(tpl)) ;
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

		return this ;
	}

	, _buildDom: function(content,callback)
	{
		if(typeof window!='undefined' || typeof jsdom=='undefined')
		{
			throw new Error("目前的版本，仅支持在node环境下调用 Template.parse() 方法") ;
			return ;
		}

		var tpl = this ;
		try{
			jsdom.env(

				"<html jsdom><head></head><body jsdom>" + (typeof content=='string'? content: content.toString()) + "</body></html>"
				//typeof content=='string'? content: content.toString()

				,function(err,window){

					window.document.documentElement ;

					//console.log('after jsdom.env()',(new Date).toISOString()) ;
					if(!err)
					{
						initjquery(window) ;
						//console.log('before initjquery',(new Date).toISOString()) ;

						tpl.window = window ;
						tpl.$ = tpl.window.$ ;
						tpl.root = window.$("[jsdom]").last()[0] || window.document ;
					}
					else
					{
						console.log(err) ;
					}

					callback && callback(err,tpl) ;
				}
			) ;
		}catch(err){
			callback && callback(err,this) ;
		}
	}

	, _readTemplateFile: function(callback){
		var fs = require("fs") ;
		var tpl = this ;
		fs.stat(this.filePath,function(err,stat){
			if(err)
			{
				callback(err) ;
				return ;
			}
			tpl.mtime = stat.mtime ;
			fs.readFile(tpl.filePath,callback);
		}) ;
	}

	, _loadDone: function(err){

		var tpl = this ;

		this.loaded = true ;
		this.loading = false ;

		for(var i=0;i<this.loadCallbacks.length;i++)
		{
			(function(callback){

				// 异步回调
				process.nextTick(function(){
					callback(err,tpl) ;
				});

			})(this.loadCallbacks[i]) ;
		}

		// 清理回调函数
		this.loadCallbacks = [] ;
	}

	, hasLoaded: function() {
		return this.loaded ;
	}

	, compile: function(generator)
	{
		generator || (generator=this.generator) ;

		generator.parse(this) ;

		try{
			this.renderer = generator.makeSync(this) ;
		}catch(e){
			var error = new Error("在编译模板时，模板中的表达式出现错误。file:"+this.filePath) ;
			error.cause = e ;
			throw error ;
		}
	}

	, render: function(model,callback,buff)
	{
		if( !this.renderer )
		{
			this.compile(null) ;
		}

		try{
			this.renderer( model, buff||new RenderBuffer, callback, require ) ;
		}catch(e){
			var error = new Error("在渲染模板时，模板中的表达式出现错误。file:"+this.filePath) ;
			error.cause = e ;
			throw error ;
		}
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

	, reset: function()
	{
		// 不能在 loading 的时候 调用reset()
		if(this.loading)
		{
			return this ;
		}

		this.renderer = null ;
		this._eleShaders = null ;

		return this ;
	}

	, watching: function()
	{
		if(this._watcher)
		{
			return ;
		}
		this.load((function(){

			var fs = require("fs") ;
			this._watcher = fs.watchFile(this.filePath,(function(){
				console.log('['+(new Date).toISOString()+"] Template file has changed,auto reload it:") ;
				console.log('    '+this.filePath) ;
				this.reset().load() ;
			}).bind(this)) ;

		}).bind(this)) ;
	}

	, checkModify: function()
	{
		var fs = require("fs") ;
		var stat = fs.statSync(this.filePath) ;
		return new Date(stat.mtime()) > new Date(this.mtime) ;
	}

	, eleId: function(ele)
	{
		if( ele._eleid===undefined )
		{
			ele._eleid = this._signedEleId ++ ;
		}
		return ele._eleid ;
	}
	, eleShaders: function(ele,create)
	{
		this._eleShaders || (this._eleShaders={}) ;
		var eleId = this.eleId(ele) ;
		return this._eleShaders[eleId] || (create && (this._eleShaders[eleId]=[])) ;
	}
	, applyShader: function (ele,shader)
	{
		this.eleShaders(ele,true).push(shader) ;
		return this ;
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

