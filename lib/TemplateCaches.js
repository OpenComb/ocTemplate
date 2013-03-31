
var Template = require("./Template.js") ;
var Parser = require("./Parser.js") ;
var Generator = require("./Generator.js") ;
var Class = require("ocClass/lib/Class.js") ;




module.exports = function(templateClass,parser,generator)
{
	this._caches = {} ;
	this._tempateclass = templateClass || Template ;
	this._parser = parser || Parser.singleton ;
	this._generator = generator || Generator.singleton ;
}

module.exports.prototype.template = function(filename,callback,from)
{
	var filepath = this.resolve(filename,from||2) ;

	// 建立 template 对象缓存
	if( !(filepath in this._caches) || !this._caches[filepath] )
	{
		this._caches[filepath] = new this._tempateclass( filepath, this._parser, this._generator ) ;
	}

	this._caches[filepath].load(callback) ;

	return this._caches[filepath] ;
}

module.exports.prototype.resolve = function(filename,from)
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


module.exports.singleton = new module.exports ;

