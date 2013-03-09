var UIExpression = require("../UIExpression.js") ;
module.exports = {

	selector: "#text"

	, shader: function(uiobject,context,model){

		if( typeof uiobject.children=="undefined" )
		{
			if( uiobject.constructor===UIExpression )
			{
				context.buff.write( uiobject.run(context.model, model) ) ;
			}
			else
			{
				context.buff.write( uiobject.raw ) ;
			}
		}
		else
		{
			for(var i=0;i<uiobject.children.length;i++)
			{
				if( uiobject.children[i].constructor===UIExpression )
				{
					context.buff.write( uiobject.children[i].run(context.model, model) ) ;
				}
				else
				{
					context.buff.write( uiobject.children[i] ) ;
				}
			}
		}
	}

} ;