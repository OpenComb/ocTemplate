var GenerateBuffer = require("../GenerateBuffer.js") ;

module.exports = {

	selector: "#text"

	, shader: function(node,buff,next,generator,tpl){
		buff.output( '<!-- '+node.nodeValue +' -->' ) ;
	}

	, joinAsString: function(uiobject)
	{
		if( typeof uiobject.children=="undefined" )
		{
			if( uiobject.constructor===UIExpression )
			{
				return uiobject.toString() ;
			}
			else
			{
				return '"'+GenerateBuffer.prototype.escape( uiobject.raw )+'"' ;
			}
		}
		else
		{
			var code = "" ;

			for(var i=0;i<uiobject.children.length;i++)
			{
				if(code)
				{
					code+= " + " ;
				}
				if( uiobject.children[i].constructor===UIExpression )
				{
					code+= "("+uiobject.children[i].toString()+")" ;
				}
				else
				{
					code+= '"'+GenerateBuffer.prototype.escape( uiobject.raw )+'"' ;
				}
			}
		}
	}

} ;