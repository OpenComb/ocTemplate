
var stackTrace = require('stack-trace') ;
var path = require('path') ;
var Parser = require("./Parser.js") ;
var fs = require("fs") ;
var RenderContext = require("./RenderContext.js") ;

var Template = module.exports = function Template(path)
{
	this.filePath = path ;
	this.fileContent = null ;
	this.document = null ;
	this.uiroot = null ;
	this.shaders = {} ;
	this.parser = null ;
	// this.uiObjectShaders = new UIObjectShaders(this.uiObjectPool) ;

	this.loaded = false ;
	this.loading = false ;
	this.loadCallbacks = [] ;

	this._id = Template._assigned_id ++ ;
}

Template._assigned_id = 0 ;

Template.resolve = function(filename,from)
{
	if( filename && filename[0]=="." )
	{
		if(typeof from=="number"){
			from = stackTrace.get()[from].getFileName() ;
		}

		return path.resolve(from,filename) ;
	}

	else
	{
		return require.resolve(filename) ;
	}
}

Template.prototype.load = function(callback,parser)
{
	// 加载、分析 模板
	if(!this.loaded)
	{
		var tpl = this ;

		if(callback)
		{
			this.loadCallbacks.push(callback) ;
		}

		if(!this.loading)
		{
			this.loading = true ;

			fs.readFile(this.filePath,function(err,buff){

				if(err)
				{
					tpl._loadDone(err) ;
					return ;
				}

				tpl.fileContent = buff ;

				try{
					tpl.parser = parser||Parser.singleton ;
					tpl.parser.parseSync(tpl) ;
				} catch(e) {
					tpl._loadDone(e) ;
				}

				tpl._loadDone(null) ;
			}) ;
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
} ;


Template.prototype.display = function(model,callback,parser)
{
	this.load(function(err,ctx){
		if(err)
		{
			callback(err) ;
			return ;
		}
		ctx.render(callback,model) ;
	},parser||Parser.singleton) ;
}


Template.prototype._loadDone = function(err){

	var tpl = this ;

	this.loaded = true ;
	this.loading = false ;

	for(var i=0;i<this.loadCallbacks.length;i++)
	{
		(function(callback){

			// 异步回调
			setTimeout(function(){
				callback(err,tpl) ;
			},0);

		})(this.loadCallbacks[i]) ;
	}

	// 清理回调函数
	this.loadCallbacks = [] ;
}

Template.prototype.hasLoaded = function() {
	return this.loaded ;
};

Template.prototype.applyShader = function(shader,shaderCache){

	shaderCache = shaderCache || this.shaders ;

	var eleLst = this.Sizzle(shader.selector,this.document) ;
	for(var l=0;l<eleLst.length;l++){
		var uiobj = eleLst[l].rawObj ;
		if( uiobj.id!==null )
		{
			if( typeof shaderCache[uiobj.id]!=="array" )
			{
				shaderCache[uiobj.id] = [] ;
			}
			shaderCache[uiobj.id].push(shader.shader) ;
		}
	}
}

Template.prototype.hasParsed = function() {
	return this.uitree!==null ;
};

Template.prototype.createRenderContext = function() {
	return new RenderContext(this) ;
} ;


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

