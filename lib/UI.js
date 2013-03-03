require('seajs') ;

define(function(require){

	var Parser = require("./Parser.js") ;
	var TemplateCaches = require("./TemplateCaches.js") ;

	var UI = function(){
		this._templateCaches = new TemplateCaches ;
		this.parser = new Parser ;
	}

	UI.prototype.display = function(tplFilepath,model) {
		
	} ;

	UI.prototype.template = function(tplFilepath,callback) {

		//var filePath = require.resolve(tplFilename) ;

		if( tplFilepath in this._templateCaches )
		{
			return this._templateCaches[tplFilepath] ;
		}

		var tpl = this._templateCaches.template(tplFilepath) ;

		tpl.load(callback,this.parser) ;

		return tpl ;
	};

	// create singleton
	UI.instance = new UI ;
	UI.instance.parser.registerBuildinShaderFunctions() ;

	return UI ;

}) ;