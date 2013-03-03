require('seajs') ;

define(function(require){

	var Template = require("./Template.js") ;

	var TemplateCache = function(){
		this._caches = {} ;
	}

	TemplateCache.prototype.template = function(path,callback){

		// 建立 template 对象缓存
		if( !(path in this._caches) || !this._caches[path] )
		{
			this._caches[path] = new Template(path) ;
		}

		return this._caches[path] ;
	}

	return TemplateCache ;
});