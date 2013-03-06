require('seajs') ;
var shaderText = require("./text.js") ;
define({

	selector: "*"

	, shader: function(buff,uiobject,context,model){


		var shaderTag = function(buff,tag,context,model){
			buff.write("<") ;

			if(tag.tail){
				buff.write("/") ;
			}

			buff.write(tag.tagName) ;

			// 属性
			for(var i=0; i<tag.attributes.length; i++ )
			{
				// 属性前的空格
				buff.write( tag.attributes[i].whitespace ) ;

				// 名称
				if( tag.attributes[i].name )
				{
					buff.write(tag.attributes[i].name) ;
					buff.write("=") ;
				}

				// 属性值
				buff.write(tag.attributes[i].boundaryChar) ;
				shaderText.shader(buff,tag.attributes[i].text,context,model) ;
				buff.write(tag.attributes[i].boundaryChar) ;
			}

			// 标签结束
			buff.write(tag.rawSlash) ;	// 斜线
			buff.write(">") ;
		}

		if( uiobject.headTag ){
			shaderTag(buff,uiobject.headTag,context,model) ;
		}

		context.renderChildObjects(buff,model,uiobject) ;

		if( uiobject.tailTag ){
			shaderTag(buff,uiobject.tailTag,context,model) ;
		}
	}

}) ;