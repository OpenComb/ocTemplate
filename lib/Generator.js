var GenerateBuffer = require("./GenerateBuffer.js") ;

module.exports = function()
{
	this.parsers = [
		// build in parser
		function applyRegisteredShaders(tpl,generator)
		{
			for(var i=0;i<generator._shaderFuncs.length;i++)
			{
				var shader = generator._shaderFuncs[i] ;

				var eleLst = tpl.window.$(shader.selector,tpl.document) ;
				for(var l=0;l<eleLst.length;l++)
				{
					tpl.applyShader(eleLst[l],shader.shader) ;
				}
			}
		}
	] ;

	this._shaderFuncs = [] ;

	// 内置 shader
	this.registerShaderDefine(require("./shaderfuncs/if.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/elseif.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/else.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/continue.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/break.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/include.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/loop.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/foreach.js")) ;
	this.registerShaderDefine(require("./shaderfuncs/script.js")) ;
}

module.exports.prototype.registerShaderFunction = function(selector,shaderFunc)
{
	if(selector.constructor===Array)
	{
		for(var i=0;i<selector.length;i++)
		{
			this._shaderFuncs.push({
				selector: selector[i]
				, shader: shaderFunc
			}) ;
		}
	}
	else
	{
		this._shaderFuncs.push({
			selector: selector
			, shader: shaderFunc
		}) ;
	}
}

module.exports.prototype.registerShaderDefine = function(define)
{
	this.registerShaderFunction(define.selector,define.shader) ;
}

module.exports.prototype.parse = function(tpl)
{
	for(var i=0;i<this.parsers.length;i++)
	{
		this.parsers[i](tpl,this) ;
	}
}

module.exports.prototype.makeSync = function(tpl,callback,buff)
{
	//
	buff = buff || new GenerateBuffer() ;
	buff.predefine = "// defines\r\n"
		+ "var $variables = {};\r\n"
		+ "var $helper = this.helper ;\r\n" ;

	if( typeof(buff.write)!=="function" || typeof(buff.toString)!=="function" ){
		throw new Error("RenderContext::render() 的参数 buff 对象必须提供 write() 和 toString() 方法。") ;
	}

	if(tpl.root)
	{
		this.makeChildrenSync(tpl.root,buff,tpl) ;
	}

	var funcbody = "try{\r\n"
					+ buff.predefine
					+ "\r\n"
					+ buff.toString()
					+ "\r\n\r\n}catch(e){\r\n"
					+ "\tvar err = new Error('模板文件中的表达式在渲染过程中抛出了异常，渲染过程终端') ;\r\n"
					+ "\terr.cause = e ;\r\n"
					+ "\tthrow err ;\r\n"
					+"}" ;

	try{
		return new Function('$model','buff','callback','require',funcbody) ;
	}catch(e){
		console.log(funcbody) ;
		throw e ;
	}
}

module.exports.prototype.makeChildrenSync = function(node,buff,tpl)
{
	if( node.childNodes )
	{
		for(var i=0;i<node.childNodes.length;i++)
		{
			this.makeObjectSync(node.childNodes[i],buff,tpl) ;
		}
	}
}


module.exports.prototype.makeObjectSync = function(node,buff,tpl)
{
	var shader, shaderLst = [] ;

	// 按类型找shader
	if( this.constructor.nodeTypeShaders[node.nodeType] )
	{
		shaderLst = shaderLst.concat( this.constructor.nodeTypeShaders[node.nodeType] ) ;
	}

	// element 上的 shader
	var shaders = tpl.eleShaders(node) ;
	if(shaders)
	{
		shaderLst = shaderLst.concat(shaders) ;
	}

	(function (){

		if(! (shader=shaderLst.pop()) )
		{
			// 结束
			return ;
		}

		shader(node,buff,arguments.callee.bind(this),this,tpl) ;

	}).bind(this) () ;
}


var nodeTypes = {
	ELEMENT_NODE: 1
	, ATTRIBUTE_NODE: 2
	, TEXT_NODE: 3
	, CDATA_SECTION_NODE: 4
	, ENTITY_SECTION_NODE: 5
	, ENTITY_NODE: 6
	, PROCESSING_INSTRUCTION_NODE: 7
	, COMMENT_NODE: 8
	, DOCUMENT_NODE: 9
	, DOCUMENT_TYPE_NODE: 10
	, DOCUMENT_FRAGMENT_NODE: 11
}

var shaderNode = require("./shaderfuncs/node.js").shader ;
var shaderComment = require("./shaderfuncs/comment.js").shader ;
var shaderText = require("./shaderfuncs/text.js").shader ;

module.exports.nodeTypeShaders = {} ;
module.exports.nodeTypeShaders[nodeTypes.ELEMENT_NODE] = [shaderNode] ;
module.exports.nodeTypeShaders[nodeTypes.COMMENT_NODE] = [shaderComment] ;
module.exports.nodeTypeShaders[nodeTypes.TEXT_NODE] = [shaderText] ;

module.exports.singleton = new module.exports ;
