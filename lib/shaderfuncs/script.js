var text = new require("./text.js") ;

module.exports = {

	selector: "script"

	, shader: function(node,buff,next,generator,tpl)
	{
		// 普通 <script> 标签
		if( !node.attributes.type || node.attributes.type.nodeValue!="template/script" )
		{
			next() ;
			return ;
		}

		var code = tpl.$(node).text() ;
		buff.write(code) ;
	}

} ;


