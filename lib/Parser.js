require('seajs') ;

define(function(require){

	var util = require("util") ;


	var Parser = function(){}

	Parser.prototype._shaderFuncs = [] ;

	Parser.prototype.registerShaderFunction = function(selector,shaderFunc){
		this._shaderFuncs.push({
			selector: selector
			, shader: shaderFunc
		}) ;
	}

	Parser.prototype.registerBuildinShaderFunctions = function() {

		var shaderNames = ["if"] ;

		for(var i=0;i<shaderNames.length;i++)
		{
			var shader = require("./shaderfuncs/"+shaderNames[i]+".js") ;
			this.registerShaderFunction(shader.selector,shader.shader) ;
		}

	};

	Parser.prototype.parseSync = function(tpl) {

		for(var i=0;i<this._shaderFuncs.length;i++)
		{
			var shader = this._shaderFuncs[i] ;

			tpl.jsenv.jQuery(shader.selector).each(function(ele){
				uiObjShaders.attach(ele.poolIdx,shader.shader) ;
			})
		}

	};

	Parser.prototype.attachShader = function (jsdom,shader,uiObjShaders){

	}

	return Parser ;

});