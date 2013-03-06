require("seajs");
define(function (require)
{
//----------------------------------------------------

	var Parser = require("./Parser.js") ;
	var RenderBuffer = require("./RenderBuffer.js") ;

	var RenderContext = function RenderContext(tpl){
		this.tpl = tpl ;
		this.model = {} ;
		this.shaders = {} ;
	}

	RenderContext.prototype.attr = function(selector,name,val){
	}

	RenderContext.prototype.remove = function(selector){
	}

	RenderContext.prototype.addClass = function(selector,className){
	}

	RenderContext.prototype.removeClass = function(selector,className){
	}

	RenderContext.prototype.css = function(selector,cssName,val){
	}

	RenderContext.prototype.render = function(tmpModel,buff){

		buff = buff || new RenderBuffer() ;
		if( typeof(buff.write)!=="function" ){
			throw new Error("RenderContext::render() 的参数 buff 对象必须提供 write() 方法。") ;
		}

		this.renderChildObjects(buff,tmpModel||{},this.tpl.uiroot) ;

		return buff ;
	}

	RenderContext.prototype.renderChildObjects = function(buff,tmpModel,parentObj){
		var a = typeof parentObj.children ;
		if( typeof parentObj.children!=="undefined" )
		{
			for(var i=0;i<parentObj.children.length;i++)
			{
				this.renderObject(buff,tmpModel,parentObj.children[i]) ;
			}
		}
	}

	var SignStopShaderSeq = function SignStopShaderSeq(){}

	RenderContext.prototype.renderObject = function(buff,tmpModel,uiobject){

		try{
			if( typeof uiobject.type!=="undefined" )
			{
				// ui object 类型上的内置 shader
				if( typeof Parser.uiobjectClassShaders[uiobject.type]!="undefined" )
				{
					this.processShaderSeq( buff, uiobject, tmpModel, Parser.uiobjectClassShaders[uiobject.type] ) ;
				}
			}

			if( typeof uiobject.id!=="undefined" )
			{
				// ui object 上的内置 shader
				if( typeof this.tpl.shaders[uiobject.id]!="undefined" )
				{
					this.processShaderSeq(buff,uiobject,tmpModel,this.tpl.shaders[ uiobject.id ]) ;
				}

				// context shader
				if( typeof this.shaders[uiobject.id]!="undefined" )
				{
					this.processShaderSeq(buff,uiobject,tmpModel,this.shaders[ uiobject.id ]) ;
				}
			}
		} catch (e){
			if(e.constructor!==SignStopShaderSeq)
			{
				throw e ;
			}
		}

	}

	RenderContext.prototype.processShaderSeq = function (buff,uiobject,tmpModel,shaders)
	{
		for(var i=0;i<shaders.length;i++)
		{
			shaders[i] (buff,uiobject,this,tmpModel) ;
		}
	}


	RenderContext.prototype.stopShaderSeq = function(){
		throw new SignStopShaderSeq() ;
	}


	return RenderContext ;
//----------------------------------------------------
});