require('seajs') ;
var UIExpression = require("../UIExpression.js") ;
define({

	selector: "#text"

	, shader: function(buff,uiobject,context,model){

		if( typeof uiobject.children=="undefined" )
		{
			buff.write( uiobject.raw ) ;
		}
		else
		{
			for(var i=0;i<uiobject.children.length;i++)
			{
				if( uiobject.children[i].constructor===UIExpression )
				{
					buff.write( uiobject.children[i].run(context.model, model) ) ;
				}
				else
				{
					buff.write( uiobject.children[i] ) ;
				}
			}
		}
	}

}) ;