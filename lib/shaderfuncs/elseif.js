var text = new require("./text.js") ;

module.exports = {

	selector: "elseif"

	, shader: function(node,buff,next,generator,tpl)
	{
		var condition = text.attrToExpr(node,'condition',"(function(){ throw new Error('elseif 节点缺少条件属性') ;})()") ;
		buff.write("\r\n}else if( " + condition + " ){" ) ;
	}

} ;


