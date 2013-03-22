
var Template = require("./Template.js") ;
var Parser = require("./Parser.js") ;
var Class = require("ocClass/lib/Class.js") ;




var TemplateCaches = module.exports = Class.extend({
	ctor: function()
	{
		this._caches = {} ;
		this._tempateclass = Template ;
	}

	, template: function(filename,from)
	{
		var filepath = this.constructor.resolve(filename,from||2) ;

		// 建立 template 对象缓存
		if( !(filepath in this._caches) || !this._caches[filepath] )
		{
			this._caches[filepath] = new this._tempateclass( filepath ) ;
		}

		return this._caches[filepath] ;
	}

	, load: function(filename,from,callback,parser)
	{
		var tpl = this.template(filename,from) ;

		tpl.load(callback,parser||Parser.singleton) ;

		return tpl ;
	}
},{
	resolve: function(filename,from)
	{
		if( filename && filename[0]=="." )
		{
			if(typeof from=="number"){
				var stackTrace = require('stack-trace') ;
				from = stackTrace.get()[from].getFileName() ;
			}

			var path = require('path') ;
			return path.resolve(from,filename) ;
		}

		else
		{
			return require.resolve(filename) ;
		}
	}
}) ;


TemplateCaches.singleton = new TemplateCaches ;

