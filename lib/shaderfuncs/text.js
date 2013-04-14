var GenerateBuffer = require("../GenerateBuffer.js") ;

module.exports = {

	reg: /(\\*)\{@(.+?)\}/g

	, selector: "#text"

	, shader: function(node,buff,next,generator,tpl){

		var contents = module.exports.parseExprs(node.nodeValue) ;

		for(var i=0;i<contents.length;i++)
		{
			if( typeof contents[i]=='string' )
			{
				buff.output(contents[i]) ;
			}
			else
			{
				buff.write("buff.write( "+contents[i].expression+" ) ;") ;
			}
		}
	}

	, parseExprs: function(text)
	{
		var contents = [] ;

		// 处理文本中的表达式
		var res ;
		var lastIndex = module.exports.reg.lastIndex = 0 ;

		while( res=module.exports.reg.exec(text) )
		{
			// 前文
			contents.push( text.substr(lastIndex, res.index-lastIndex) ) ;

			// 无转义斜线
			if( res[1]%2==0 )
			{
				// 前面的斜线
				if(res[1])
				{
					contents.push(res[1]) ;
				}

				contents.push({
					expression: res[2]
				}) ;
			}


			else
			{
				contents.push(res[0]) ;
			}

			var lastIndex = module.exports.reg.lastIndex = res.index + res[0].length ;
		}

		// 最后一段
		contents.push( text.substr(lastIndex, text.length-lastIndex) ) ;

		return contents ;
	}

	, joinAsString: function(text,attr)
	{
		if(typeof text!='string')
		{
			text = text.nodeValue ;
		}

		// @ 开头的属性视作表达式
		if(attr && text.match(/^\s*@/))
		{
			var contents = [{ expression: text.substr(1) }] ;
		}
		// 切开表达式和文版
		else
		{
			var contents = module.exports.parseExprs(text) ;
		}

		var code = "" ;

		for(var i=0;i<contents.length;i++)
		{
			if( typeof contents[i]=='string' )
			{
				if(contents[i])
				{
					if(code)
					{
						code+= " + " ;
					}
					code+= '"'+GenerateBuffer.prototype.escape( contents[i] )+'"' ;
				}
			}
			else
			{
				if(code)
				{
					code+= " + " ;
				}
				code+= "("+contents[i].expression+")" ;
			}
		}

		return code ;
	}

	, attrToExpr: function(node,attrName,defaultValue)
	{
		return node.attributes[attrName]?
			module.exports.joinAsString(node.attributes[attrName].nodeValue,true): defaultValue ;
	}
} ;