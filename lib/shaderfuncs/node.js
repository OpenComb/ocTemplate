var shaderText = require("./text.js") ;
var GenerateBuffer = require("../GenerateBuffer.js") ;

module.exports = {

	selector: "*"

	, shader: function(node,buff,next,generator,tpl){

		module.exports.tagShader(node,buff) ;

		// 处理子元素
		generator.makeChildrenSync(node,buff,tpl) ;

		buff.output("</"+node._tagName+">") ;

//		// 处理头标签
//		if( uiobject.headTag ){
//			generator.makeObjectSync(uiobject.headTag,buff,tpl)
//		}
//
//		// 处理子元素
//		generator.makeChildrenSync(uiobject,buff,tpl) ;
//
//		// 处理尾标签
//		if( uiobject.tailTag ){
//			generator.makeObjectSync(uiobject.tailTag,buff,tpl) ;
//		}

		next() ;
	}

	, tagShader: function(node,buff)
	{
		buff.output("<") ;

		buff.output(node._tagName) ;

		// 属性
		for(var i=0; i<node.attributes.length; i++ )
		{
			buff.output(' ') ;

			// 名称
			if( node.attributes[i].name )
			{
				buff.output(node.attributes[i].name) ;
				buff.output("=") ;
			}

			buff.output('"') ;

			var contents = shaderText.joinAsString( node.attributes[i], true ) ;
			buff.write( "buff.write("+ contents +") ;" ) ;

			buff.output('"') ;
		}

		// 标签结束
		buff.output(">") ;

	}

} ;