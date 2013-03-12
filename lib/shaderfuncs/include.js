
var UIExpression = require("../UIExpression.js") ;
var util = require("./util.js") ;
var path = require("path") ;

module.exports = {

	selector: "include"

	, shader: function(uiobject,context,model){
		var file = util.evalAttrExp(uiobject.headTag.namedAttributes["file"],context,model) ;

		var TemplateCaches = require("../TemplateCaches.js") ;
		var tpl = TemplateCaches.singleton.template(file,path.dirname(context.tpl.filePath)) ;

		// 暂停渲染队列，等待子模板 load
		var queue = context.queue ;
		queue.pause() ;

		tpl.load(function(err,subTpl){

			// 子模板出现语法错误
			if(err)
			{
				if( queue.callback )
				{
					queue.callback(err) ;
				}
				return ;
			}

			// 继续渲染队列
			subTpl.createRenderContext().render( queue.callback, model, context.buff, queue ) ;

		},context.tpl.parser) ;


		context.stopShaderSeq() ;
	}

}