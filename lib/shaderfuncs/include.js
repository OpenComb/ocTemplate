var text = new require("./text.js") ;

module.exports = {

	selector: "include"

	, shader: function(node,buff,next,generator,tpl){

		if(!node.attributes.file)
		{
			throw new Error("include 标签缺少必须的file属性") ;
		}
		var file = text.attrToExpr(node,'file') ;

		var model = text.attrToExpr(node,'model','{}') ;

		// 结束到此为止的内容，开始一个新的 render tick 过程函数
		buff.closeStep(true) ;

		buff.write("var TemplateCache = requ"+"ire('octemplate/lib/TemplateCaches.js') ;") ;
		buff.write("TemplateCache.singleton.template("+file+",function(err,tpl){") ;
		buff.indent(1) ;
		buff.write("if(err)") ;
		buff.write("{") ;
		buff.indent(1) ;
		buff.write("_$step_last(err);") ;
		buff.indent(-1) ;
		buff.write("}else{") ;
		buff.indent(1) ;
		buff.write("var _model="+model+"||{}") ;
		
		for(var i=0;i<node.attributes.length;i++)
		{
			var attrName = node.attributes[i].name ;
			var res = /^model\.(.+)$/i.exec(attrName) ;
			console.log(attrName,res)
			if( res )
			{
				buff.write('_model["'+res[1]+'"] = '+text.attrToExpr(node,attrName)+" ;" ) ;
			}
		}
		
		buff.write("tpl.render(_model,$nextstep,buff) ;") ;
		buff.indent(-1) ;
		buff.write("}") ;
		buff.indent(-1) ;
		buff.write("}) ;") ;

		// 结束上面的内容，为后面的内容开始一个新的 render tick 过程函数
		buff.closeStep(false) ;
	}

}