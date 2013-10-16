var Steps = require("ocsteps") ;
var RenderBuffer = require("./RenderBuffer") ;

// only backend
if(typeof window=='undefined')
{
    var Generator = (require||0)("./Generator.js") ;
    var initjquery = (require||0)("./jquery.js") ;
	var jsdom = (require||0)("../jsdom/lib/jsdom.js") ;
    var fs = (require||0)("fs") ;
}

function callback(func,args)
{
<<<<<<< HEAD
    // node env
    if(typeof process!='undefined')
    {
	process.nextTick(function(){
	    func.apply(null,args) ;
	});
    }
    // frontend
    else
    {
	setTimeout(function(){
	    func.apply(null,args) ;
	},0) ;
    }
=======
	// node env
	if(typeof process!='undefined')
	{
		process.nextTick(function(){
			func.apply(null,args) ;
		});
	}
	// frontend
	else
	{
		setTimeout(function(){
			func.apply(null,args) ;
		},0)
	}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058
}

module.exports = function(path,generator,helper)
{
	this.filePath = path ;
	this.window = null ;
	this.generator = generator || Generator && Generator.singleton ;
	this.renderer = null ;
	this.helper = helper || (require||0)("./RenderHelper.js").singleton() ;

	this.loaded = false ;
	this.loading = false ;

	this._id = module.exports._assigned_id ++ ;

	this._signedEleId = 0 ;
	this._eleShaders = null ;

	this._arrEventHandles = {} ;
	this._arrOnceHandles = {} ;
}

module.exports.prototype.on = function(name,func)
{
<<<<<<< HEAD
    this._arrEventHandles[name] || (this._arrEventHandles[name] = []) ;
    this._arrEventHandles[name].push(func) ;
    return this ;
} ;
module.exports.prototype.once = function(name,func)
{
    this._arrOnceHandles[name] || (this._arrOnceHandles[name] = []) ;
    this._arrOnceHandles[name].push(func) ;
    return this ;
} ;
module.exports.prototype.emit = function(name)
=======
	this._arrEventHandles[name] || (this._arrEventHandles[name] = []) ;
	this._arrEventHandles[name].push(func) ;
	return this ;
}
module.exports.prototype.once= function(name,func)
{
	this._arrOnceHandles[name] || (this._arrOnceHandles[name] = []) ;
	this._arrOnceHandles[name].push(func) ;
	return this
}
module.exports.prototype.emit= function(name)
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058
{
	var args = [] ;
	for(var i=1;i<arguments.length;i++)
	{
		args.push(arguments[i]) ;
	}

    var steps = Steps() ;

	// 事件
	if(this._arrEventHandles[name])
	{
		for(var i=0;i<this._arrEventHandles[name].length;i++)
		{
            steps.step(args,this._arrEventHandles[name][i]) ;
		}
	}
	// once
	if(this._arrOnceHandles[name])
	{
		var func ;
		while(func=this._arrOnceHandles[name].shift())
		{
            steps.step(args,func) ;
		}
	}

    // 执行
    steps() ;

<<<<<<< HEAD
    return steps ;
} ;
=======
	return steps ;
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype.load = function(callback)
{
	// 加载、分析 模板
	if(!this.loaded)
	{
		var tpl = this ;

		if(callback)
		{
			this.once("loaded",callback) ;
		}

		if(!this.loading)
		{
			this.reset() ;

			this.loading = true ;

			this._readTemplateFile(function(err,buff){

<<<<<<< HEAD
		if(err)
		{
		    tpl.emit("loaded",err,tpl) ;
 		    return ;
=======
				tpl.loaded = true ;
				tpl.loading = false ;

				if(err)
				{
					tpl.emit("loaded",err,tpl) ;
					return ;
				}
				tpl._buildDom(buff,function(err){

					// 编译模板
					try{
						tpl.compile() ;
					} catch(e) {
						err = e ;
					}

					tpl.emit("loaded",err,tpl) ;
				}) ;
			}) ;
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058
		}
	}

	//
	else
	{
		if(callback)
		{
			callback(null,this) ;
		}
	}

<<<<<<< HEAD
    return this ;
} ;
=======
	return this ;
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype._buildDom = function(content,callback)
{
	if(typeof window!='undefined' || typeof jsdom=='undefined')
	{
		throw new Error("目前的版本，仅支持在node环境下调用 Template.parse() 方法") ;
		return ;
	}

<<<<<<< HEAD
		callback && callback(err,tpl) ;
	    }
	) ;
    }catch(err){
	callback && callback(err,this) ;
    }
} ;

module.exports.prototype._readTemplateFile = function(callback){
    var tpl = this ;
    fs.stat(this.filePath,function(err,stat){
	if(err)
	{
	    callback(err) ;
	    return ;
	}
	tpl.mtime = stat.mtime ;
	fs.readFile(tpl.filePath,callback);
    }) ;
} ;

module.exports.prototype.hasLoaded = function() {
    return this.loaded ;
} ;
=======
	var tpl = this ;
	try{
		jsdom.env(

			"<html jsdom><head></head><body jsdom>" + (typeof content=='string'? content: content.toString()) + "</body></html>"
			//typeof content=='string'? content: content.toString()

			,function(err,window){

				//console.log('after jsdom.env()',(new Date).toISOString()) ;
				if(!err)
				{
					initjquery(window) ;
					//console.log('before initjquery',(new Date).toISOString()) ;

					tpl.window = window ;
					tpl.$ = tpl.window.$ ;
					tpl.root = window.$("[jsdom]").last()[0] || window.document ;
				}
				else
				{
					console.log(err) ;
				}

				callback && callback(err,tpl) ;
			}
		) ;
	}catch(err){
		callback && callback(err,this) ;
	}
}

module.exports.prototype._readTemplateFile= function(callback){
	var tpl = this ;
	fs.stat(this.filePath,function(err,stat){
		if(err)
		{
			callback(err) ;
			return ;
		}
		tpl.mtime = stat.mtime ;
		fs.readFile(tpl.filePath,callback);
	}) ;
}

module.exports.prototype.hasLoaded= function() {
	return this.loaded ;
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype.compile = function(generator)
{
	generator || (generator=this.generator) ;

	generator.parse(this) ;

	try{
		this.renderer = generator.makeSync(this) ;
        this.emit("compiled",this) ;
	}catch(e){
		var error = new Error("在编译模板时，模板中的表达式出现错误。file:"+this.filePath) ;
		error.cause = e ;
        if(callback)
            callback(error) ;
        else
<<<<<<< HEAD
	    throw error ;
    }
} ;
=======
		    throw error ;
	}
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype.render = function(model,callback,buff)
{
    var tpl = this ;
    Steps(
       function(){
            try{
	            tpl.renderer && tpl.renderer( model, buff||new RenderBuffer, this.hold(), require ) ;
            }catch(e){
                var error = new Error("在渲染模板时，模板中的表达式出现错误。file:"+tpl.filePath) ;
                error.cause = e ;
                throw error ;
            }
        }
        , function(err,buff){
            callback && callback(err,buff) ;
        }
    ).uncatch(function(err){
<<<<<<< HEAD
	callback && callback(err) ;
    }) () ;
} ;

module.exports.prototype.hasParsed = function() {
    return this.uitree!==null ;
} ;
module.exports.prototype.hasCompiled = function() {
    return this.renderer!==null ;
} ;
=======
		callback && callback(err) ;
	}) () ;
}

module.exports.prototype.hasParsed= function() {
	return this.uitree!==null ;
}
module.exports.prototype.hasCompiled= function() {
	return this.renderer!==null ;
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype.exportRenderer = function()
{
<<<<<<< HEAD
    return this.renderer? this.renderer.toString(): '' ;
} ;
=======
	return this.renderer? this.renderer.toString(): '' ;
}
>>>>>>> fbca034340f8e005a63452ff17a08a7ac838e058

module.exports.prototype.reset = function()
{
	// 不能在 loading 的时候 调用reset()
	if(this.loading)
	{
		return this ;
	}

	this.renderer = null ;
	this._eleShaders = null ;
	this.loaded = false ;
	this.loading = false ;

    return this ;
} ;

module.exports.prototype.watching = function()
{
    if(this._watcher)
    {
	return ;
    }
    
    this.load((function(){

	this._watcher = fs.watchFile(this.filePath,(function(){
	    console.log('['+(new Date).toISOString()+"] Template file has changed,auto reload it:") ;
	    console.log('    '+this.filePath) ;
	    this.reset().load() ;
	}).bind(this)) ;
} ;

module.exports.prototype.checkModify = function()
{
    var stat = fs.statSync(this.filePath) ;
    return new Date(stat.mtime()) > new Date(this.mtime) ;
} ;

module.exports.prototype.eleId = function(ele)
{
    if( ele._eleid===undefined )
    {
	ele._eleid = this._signedEleId ++ ;
    }
    return ele._eleid ;
} ;
module.exports.prototype.eleShaders = function(ele,create)
{
    this._eleShaders || (this._eleShaders={}) ;
    var eleId = this.eleId(ele) ;
    return this._eleShaders[eleId] || (create && (this._eleShaders[eleId]=[])) ;
} ;
module.exports.prototype.clearShaders = function(ele)
{
	var shaders = this.eleShaders(ele) ;
	shaders && shaders.splice(0,shaders.length) ;

	this.$(ele).attr('__shaders',0) ;

} ;
module.exports.prototype.applyShader = function (ele,shader)
{
    this.eleShaders(ele,true).push(shader) ;
    this.$(ele).attr('__shaders', (this.$(ele).attr('__shaders')||0) + 1 ) ;
    return this ;
} ;



module.exports._assigned_id = 0 ;


////////
var _TemplateElementNode = function (ele){
	this.tagName = ele._tagName ;
	//this.single = single || false ;
	this.attributes = {} ;
	this.children = [] ;

	// attribute
	for(var i=0;i<ele._attributes.length;i++)
	{
		this.attributes[ele.attributes[i].name] = ele.attributes[i].value
	}
}

var _TemplateElementText = function (ele){
	this.text = ele.nodeValue ;
}

