
var Parser = require("./Parser.js") ;
var RenderBuffer = require("./RenderBuffer.js") ;
var RenderQueue = require("./RenderQueue.js") ;
var Class = require("ocClass/lib/Class.js") ;

var RenderContext = module.exports = Class.extend({
	ctor: function(tpl)
	{
		this.tpl = tpl ;
		this.model = {} ;
		this.buff = null ;
		this.queue = null ;
		this.shaders = {} ;
		this._enable = true ;
	}

	, attr: function(selector,name,val){
	}

	, remove: function(selector){
	}

	, addClass: function(selector,className){
	}

	, removeClass: function(selector,className){
	}

	, css: function(selector,cssName,val){
	}

	, disable: function(){
		this._enable = false ;
	}
	, enable: function(){
		this._enable = true ;
	}

	, render: function(callback,tmpModel,buff,queue){

		if( !this.tpl || !this._enable )
		{
			callback(null,this.buff) ;
			return ;
		}

		this.buff = buff || this.buff || new RenderBuffer() ;
		if( typeof(this.buff.write)!=="function" ){
			throw new Error("RenderContext::render() 的参数 buff 对象必须提供 write() 方法。") ;
		}

		var ctx = this ;
		this.queue = queue || new RenderQueue(function(err){
			if(callback)
			{
				callback(err,ctx.buff) ;
			}
		}) ;
		this.queue.putinChldren(this.tpl.uiroot,this,tmpModel||{}) ;

		this.queue.do() ;
	}


	, renderObject: function(uiobject,tmpModel){

		try{

			if( typeof uiobject.id!=="undefined" )
			{
				// context shader
				if( typeof this.shaders[uiobject.id]!="undefined" )
				{
					this.processShaderSeq(uiobject,tmpModel,this.shaders[ uiobject.id ]) ;
				}

				// ui object 上的内置 shader
				if( typeof this.tpl.shaders[uiobject.id]!="undefined" )
				{
					this.processShaderSeq(uiobject,tmpModel,this.tpl.shaders[ uiobject.id ]) ;
				}
			}

			if( typeof uiobject.type!=="undefined" )
			{
				// ui object 类型上的内置 shader
				if( typeof Parser.uiobjectClassShaders[uiobject.type]!="undefined" )
				{
					this.processShaderSeq( uiobject, tmpModel, Parser.uiobjectClassShaders[uiobject.type] ) ;
				}
			}

		} catch (e){
			if(e.constructor!==SignStopShaderSeq)
			{
				throw e ;
			}
		}

	}

	, processShaderSeq: function (uiobject,tmpModel,shaders)
	{
		for(var i=0;i<shaders.length;i++)
		{
			shaders[i] (uiobject,this,tmpModel) ;
		}
	}

	, stopShaderSeq: function(){
		throw new SignStopShaderSeq() ;
	}
}) ;

module.exports.className = "RenderContext" ;

var SignStopShaderSeq = function SignStopShaderSeq(){}