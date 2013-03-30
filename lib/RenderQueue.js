var Class = require("ocClass/lib/Class.js") ;

var RenderQueue = module.exports = function RenderQueue(callback){

	this._tasks = [] ;
	this.callback = callback ;
	this._doing = false ;

	this.insert = function(uiobject,ctx,tmpModel)
	{
		if( !uiobject || typeof uiobject.type=="undefined" )
		{
			throw new Error("RenderQueue::insert()传入的参数 uiobject 类型错误") ;
		}
//		var RenderContext = require("./RenderContext.js") ;
//		if( !Class.isA(ctx.constructor,RenderContext) )
//		{
//			throw new Error("RenderQueue::insert()传入的参数 uiobject 类型错误") ;
//		}

		this._tasks.unshift({
			uiobject:uiobject
			, ctx:ctx
			, tmpModel: tmpModel
		}) ;
	}

	this.append = function(uiobject,ctx,tmpModel)
	{
		if( !uiobject || typeof uiobject.type=="undefined" )
		{
			throw new Error("RenderQueue::insert()传入的参数 uiobject 类型错误") ;
		}
//		var RenderContext = require("./RenderContext.js") ;
//		if( !Class.isA(ctx.constructor,RenderContext) )
//		{
//			throw new Error("RenderQueue::insert()传入的参数 uiobject 类型错误") ;
//		}

		this._tasks.push({
			uiobject:uiobject
			, ctx:ctx
			, tmpModel: tmpModel
		}) ;
	}

	this.putinChldren = function(uiobject,ctx,tmpModel)
	{
		if( !uiobject || typeof uiobject.type=="undefined" )
		{
			throw new Error("RenderQueue::insert()传入的参数 uiobject 类型错误") ;
		}
//		var RenderContext = require("./RenderContext.js") ;
//		if( !Class.isA(ctx.constructor,RenderContext) )
//		{
//			throw new Error("RenderQueue::insert()传入的参数 ctx  类型错误") ;
//		}

		if( typeof uiobject.children!=="undefined" && uiobject.children.constructor===Array )
		{
			for(var i=uiobject.children.length-1;i>=0;i--)
			{
				this.insert(uiobject.children[i],ctx,tmpModel) ;
			}
		}
	}


	this.pause = function()
	{
		this._doing = false ;
	}

	this.do = function()
	{
		this._doing = true ;
		this._step() ;
	}

	this._step = function()
	{
		if( !this._doing )
		{
			return ;
		}
		if( this._tasks.length<=0 )
		{
			if(this.callback)
			{
				this.callback(null) ;
			}
			return ;
		}

		var task = this._tasks.shift() ;
		task.ctx.renderObject(task.uiobject,task.tmpModel) ;

		// next token
		var queue = this ;
		setTimeout(function(){
			queue._step() ;
		},0) ;
	}
}