var shaderText = require("./text.js") ;
module.exports = {

	selector: "*"

	, shader: function(uiobject,context,model){

		context.buff.write("<") ;

		if(uiobject.tail){
			context.buff.write("/") ;
		}

		context.buff.write(uiobject.tagName) ;

		// 属性
		for(var i=0; i<uiobject.attributes.length; i++ )
		{
			// 属性前的空格
			context.buff.write( uiobject.attributes[i].whitespace ) ;

			// 名称
			if( uiobject.attributes[i].name )
			{
				context.buff.write(uiobject.attributes[i].name) ;
				context.buff.write("=") ;
			}

			// 属性值
			context.buff.write(uiobject.attributes[i].boundaryChar) ;
			shaderText.shader(uiobject.attributes[i].text,context,model) ;
			context.buff.write(uiobject.attributes[i].boundaryChar) ;
		}

		// 标签结束
		context.buff.write(uiobject.rawSlash) ;	// 斜线
		context.buff.write(">") ;

	}

} ;