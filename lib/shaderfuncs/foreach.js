var util = new require("./util.js") ;

var makeModel = function (model,varname,value,keyname,keyval)
{
	if( !varname && !keyname )
	{
		return model ;
	}

	var newModel = {} ;
	for(var key in model)
	{
		newModel[key] = model[key] ;
	}

	if(varname)
	{
		newModel[varname] = value ;
	}
	if(keyname)
	{
		newModel[keyname] = keyval ;
	}

	return newModel ;
}

module.exports = {

	selector: "foreach"

	, shader: function(uiobject,context,model){

		var forvar = util.evalAttrExpEx(uiobject.headTag,"for",null,context,model) ;
		var varname = uiobject.headTag.namedAttributes["var"]?
			uiobject.headTag.namedAttributes["var"].text: null ;
		var keyname = uiobject.headTag.namedAttributes["key"]?
			uiobject.headTag.namedAttributes["key"].text: null ;

		if( typeof forvar=="object" )
		{
			//
			if( forvar.constructor === Array )
			{
				// 逆向循环
				for(var i=forvar.length-1; i>=0; i--)
				{
					context.queue.putinChldren( uiobject, context, makeModel(model,varname,forvar[i],keyname,i) ) ;
				}
			}
			else
			{
				var rkeys = [] ;
				for(var key in forvar)
				{
					rkeys.unshift(key) ;
				}

				for(var i=0;i<rkeys.length; i++)
				{
					var key = rkeys[i] ;
					context.queue.putinChldren( uiobject, context, makeModel(model,varname,forvar[key],keyname,key) ) ;
				}
			}
		}

		context.stopShaderSeq() ;
	}

} ;