module.exports = {

	selector: "break"

	, shader: function(node,buff,next,generator,tpl)
	{
		buff.write("break ;" ) ;
	}

} ;


