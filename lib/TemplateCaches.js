var Template = require("./Template.js") ;
// only backend
if(typeof window=='undefined')
{
    var Generator = (require||0)("./Generator.js") ;
}

module.exports =function(templateClass,generator)
{
	this._caches = {} ;
	this._tempateclass = templateClass || Template ;
	this._generator = generator || Generator && Generator.singleton ;

    this.compiledFolder ;
    this.enableCompile = false ;
    this._frontMode = typeof window!='undefined' ;
}

module.exports.prototype.cache = function(filename,from)
{
	var filepath = this.resolve(filename,from||2) ;
	return this._caches[filepath];
}

module.exports.prototype.template = function(filename,callback,from)
{
	try{
		var filepath = this.resolve(filename,from||2) ;
	}catch(err){
		callback && callback(err) ;
		return ;
	}

	// 建立 template 对象缓存
	if( !this._caches[filepath] )
	{
        var caches = this ;
		this._caches[filepath] = new this._tempateclass( filepath, this._generator ) ;
        var cache = false ;
	}
	else
	{
		var cache = true ;
	}

	this._caches[filepath].load(function(err,tpl){
		callback && callback(err,tpl,cache) ;
	}) ;

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