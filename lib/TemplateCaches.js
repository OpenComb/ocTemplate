
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
		var filepath = Template.resolve(filename,from||2) ;

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
}) ;


TemplateCaches.singleton = new TemplateCaches ;

