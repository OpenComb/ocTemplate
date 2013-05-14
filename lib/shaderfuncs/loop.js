var text = new require("./text.js") ;

var loopvarid = 0 ;

module.exports = {

	selector: "loop"

	, shader: function(node,buff,next,generator,tpl){

		var start = text.attrToExpr(node,'start','1') ;
		var step = text.attrToExpr(node,'step','1') ;
		var varname = node.attributes["var"]? node.attributes["var"].nodeValue: 'loop_var_'+loopvarid++ ;
		varname = "$variables."+varname ;

		if(!node.attributes.end)
		{
			throw new Error("loop 标签缺少必须的end属性") ;
		}
		var end = text.attrToExpr(node,'end') ;

		buff.write("") ;
		buff.write("// loop") ;
		buff.write("for( "+varname+"=("+start+");"+varname+"<=("+end+");"+varname+"+=("+step+") )") ;
		buff.write("{") ;
		buff.indent(1) ;

		// loop body
		generator.makeChildrenSync(node,buff,tpl) ;

		buff.indent(-1) ;
		buff.write("}") ;
	}
} ;