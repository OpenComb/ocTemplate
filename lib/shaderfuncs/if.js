var text = new require("./text.js") ;

module.exports = {

	selector: "if"

	, shader: function(node,buff,next,generator,tpl)
	{
		if( !node.attributes.condition )
		{
			throw new Error("if 节点缺少条件属性") ;
		}
		var condition = text.attrToExpr(node,'condition',null) ;

		buff.write("if( " + condition + " ){" ) ;

		// 处理子元素
		buff.indent(1) ;
		generator.makeChildrenSync(node,buff,tpl) ;
		buff.indent(-1) ;

		buff.write("}") ;
	}

} ;


