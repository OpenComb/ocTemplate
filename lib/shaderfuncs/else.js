module.exports = {

	selector: "else"

	, shader: function(node,buff,next,generator,tpl)
	{
		buff.write("\r\n}else{" ) ;
	}

} ;