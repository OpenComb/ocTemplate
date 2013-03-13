var util = new require("./util.js") ;

module.exports = {

	selector: "loop"

	, shader: function(uiobject,context,model){

		var start = util.evalAttrExpEx(uiobject.headTag,"start",1,context,model) ;
		var step = util.evalAttrExpEx(uiobject.headTag,"step",1,context,model) ;
		var varname = null ;
		if( uiobject.headTag.namedAttributes["var"] )
		{
			varname = uiobject.headTag.namedAttributes["var"].text ;
		}

		var end = util.evalAttrExpEx(uiobject.headTag,"end",null,context,model) ;
		if(end===null)
		{
			context.buff.write("loop 标签缺少属性end") ;
		}
		else
		{
			// 逆向循环
			for(var i=end; i>=start; i--)
			{
				if(varname!==null)
				{
					var _model = {}
					for(var name in model)
					{
						_model[name] = model[name] ;
					}

					_model[varname] = i ;

					model = _model ;
				}

				// 倒装
				context.queue.putinChldren(uiobject,context,model) ;
			}
		}

		context.stopShaderSeq() ;
	}

} ;