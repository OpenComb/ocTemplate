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
	this.generator = generator || Generator && Generator.singleton ;
	this.renderHelper = require("./RenderHelper.js").singleton() ;

    this.compiledFolder ;
    this.enableCompile = false ;
    this._frontMode = typeof window!='undefined' ;
	this._tplid = 0 ;
}

module.exports.prototype.cache = function(filename,from)
{
	var filepath = this.resolve(filename,from||2) ;
	return this._caches[filepath];
}

module.exports.prototype.removeCache = function(filename,from)
{
	var filepath = this.resolve(filename,from||2) ;
	delete this._caches[filepath];
	return this ;
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
		this._caches[filepath] = this.createTemplate(filepath,filename) ;
	}

	return this._caches[filepath].load(callback) ;
}

module.exports.prototype.createTemplate = function(filepath,pathname)
{
	var tpl = new this._tempateclass( filepath, this.generator, this.renderHelper ) ;
	tpl.pathname = pathname ;
	tpl._tplid = this._tplid++ ;
	return tpl ;
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