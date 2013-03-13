
var UIExpression = new require("../UIExpression.js") ;
var shaderText = new require("./text.js") ;

var ResCtx = function(model){
	this.model = model ;
	this.buff = {
		write: function(res) {
			if( typeof this.res=="undefined" )
			{
				this.res = res ;
			}
			else
			{
				this.res+= res ;
			}
		}
	}
}


module.exports = {

	evalAttrExp: function(attr,context,model){

		// 属性值为表达式
		if( attr.text.constructor === UIExpression )
		{
			return attr.text.run(context.model,model) ;
		}

		// 属性值为可能夹带表达式(<%...%>)的字符串
		else
		{
			var resCtx = new ResCtx(context.model) ;
			shaderText.shader(attr.text, resCtx, model ) ;
			return resCtx.buff.res ;
		}
	}

	, evalAttrExpEx: function(tag,attrName,defaultValue,context,model){
		if( typeof tag.namedAttributes[attrName]=="undefined" )
		{
			return defaultValue ;
		}
		else
		{
			return module.exports.evalAttrExp(tag.namedAttributes[attrName],context,model) ;
		}
	}

}