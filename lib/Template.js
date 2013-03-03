require('seajs') ;

define(function(require){

	var jsdom = require("jsdom") ;
	var htmlparser = require("htmlparser") ;
	var fs = require("fs") ;
	var UIObjectShaders = require("./UIObjectShaders") ;

	var Template = function(filePath)
	{
		this.filePath = filePath;
		this.fileContent = null ;
		this.jsenv = null ;
		this.dom = null ;
		this.tree = null ;
		this.uiObjectPool = [] ;
		this.uiObjectShaders = new UIObjectShaders(this.uiObjectPool) ;

		this.loaded = false ;
		this.loading = false ;
		this.loadCallbacks = [] ;
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
						this._loadDone(err) ;
						return ;
					}

					(new htmlparser.Parser(new htmlparser.DomUtils(function(err,xml){
						if(err) {
							tpl._loadDone(err) ;
						}

						this.jsdomDocument = jsdom.jsdom("") ;
						this.jsdomWindow = this.jsdomDocument.createWindow() ;

						jsdom.jQueryify(this.jsdomWindow, __dirname+"/jquery/jquery-1.9.0.min.js" , function (window) {
							window.$("body").append('<div class="testing">Hello World, It works</div>');
							console.log(window.$(".testing").text());

							console.log(window.$(window.$("span")[0]).text());
						});


					}))).parseComplete(buff);



//					jsdom.env({
//						html: buff
//						, scripts: [ __dirname+"/jquery/jquery-1.9.0.min.js" ]
//						, done: function(err,window){
//
//							if(!err)
//							{
//								tpl.jsenv = window ;
//								tpl.dom = window.document ;
//
//								// 建立节点的数据
//								tpl.tree = tpl._buildTree(tpl.dom) ;
//
//								// 分析
//								var UI = require("./UI") ;
//								(parser || UI.instance.parser).parseSync( tpl ) ;
//							}
//
//							// 完成事件回调
//							tpl._loadDone(err) ;
//						}
//					}) ;

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

	Template.prototype._buildTree = function(ele){

		var obj = (ele.nodeName=='#text')?
						new _TemplateElementText(ele) :
						new _TemplateElementNode(ele) ;

		obj.poolIdx = ele.poolIdx = this.uiObjectPool.length ;
		this.uiObjectPool.push(obj) ;

		// 递归处理下级
		if( ele.childNodes.length )
		{
			for(var i=0;i<ele.childNodes.length;i++)
			{
				obj.children.push( this._buildTree( ele.childNodes[i] ) ) ;
			}
		}

		return obj ;
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

	Template.prototype.hasParsed = function() {
		return this.tree!==null ;
	};

	Template.prototype.render = function(buffer,model,cusShaders) {

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


	return Template ;
}) ;