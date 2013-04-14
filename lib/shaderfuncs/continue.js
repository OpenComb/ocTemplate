module.exports = {

	selector: "continue"

	, shader: function(node,buff,next,generator,tpl)
	{
		buff.write("continue ;" ) ;
	}

} ;


