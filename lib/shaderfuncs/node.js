var shaderText = require("./text.js") ;
module.exports = {

	selector: "*"

	, shader: function(uiobject,context,model){

		// 放入尾标签
		if( uiobject.tailTag ){
			context.queue.insert(uiobject.tailTag,context,model) ;
		}

		// putin children elements
		context.queue.putinChldren(uiobject,context,model) ;

		// 放入头标签
		if( uiobject.headTag ){
			context.queue.insert(uiobject.headTag,context,model) ;
		}
	}

} ;