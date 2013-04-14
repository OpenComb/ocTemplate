var shaderText = require("./text.js") ;

module.exports = {

	selector: "*"

	, emptyTags:{
		area: 1
		, base: 1
		, basefont: 1
		, br: 1
		, col: 1
		, frame: 1
		, hr: 1
		, img: 1
		, input: 1
		, isindex: 1
		, link: 1
		, meta: 1
		, param: 1
		, embed: 1
	}

	, shader: function(node,buff,next,generator,tpl){

		module.exports.tagShader(node,buff) ;

		// 处理子元素
		generator.makeChildrenSync(node,buff,tpl) ;

		if( !module.exports.emptyTags[ node.tagName.toLowerCase() ] )
		{
			buff.output("</"+node._tagName+">") ;
		}

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

		// 单行标签 结尾的斜线
		if( module.exports.emptyTags[ node.tagName.toLowerCase() ] )
		{
			buff.output(" /") ;
		}

		// 标签结束
		buff.output(">") ;

	}

} ;