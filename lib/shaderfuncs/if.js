var ElementObjs = new require("ocHtmlParser/lib/ElementObjs.js") ;
var util = new require("./util.js") ;

var T_ELSE = 1 ;
var T_ELSEIF = 2 ;
var T_ELSE_ELSEIF = 3 ;

module.exports = {

	selector: "if"

	, shader: function(uiobject,context,model){

		if( typeof uiobject.children=="undefined" || !uiobject.children.length ){
			context.stopShaderSeq() ;
		}

		var waitingrenders = [] ;

		var ifnode = uiobject ;
		for( childIdx=0; childIdx<uiobject.children.length; childIdx++ )
		{
			if( evalNode(ifnode,context,model) )
			{
				// 找到下一个 elseif, else
				for( ;childIdx<uiobject.children.length;childIdx++)
				{
					if( T_ELSE_ELSEIF & childType(uiobject.children[childIdx]) )
					{
						break ;
					}

					// 等待渲染的子元素
					waitingrenders.unshift(uiobject.children[childIdx]) ;
				}

				// 结束
				break ;
			}

			// 找到下一个 elseif, else
			for( ;childIdx<uiobject.children.length;childIdx++)
			{
				if( T_ELSE_ELSEIF & childType(uiobject.children[childIdx]) )
				{
					ifnode = uiobject.children[childIdx] ;
					break ;
				}
			}
		}


		// 渲染这些子元素
		for(var i=0;i<waitingrenders.length;i++)
		{
			context.renderObject(waitingrenders[i],model) ;
		}


		context.stopShaderSeq() ;
	}

} ;



var evalNode = function(uiobject,context,model)
{
	if( typeof uiobject.headTag=="undefined" || typeof uiobject.headTag.unamedAttributes=="undefined" )
	{
		return ;
	}

	if(uiobject.headTag.tagName.toLowerCase() == "else")
	{
		return true ;
	}

	if(!uiobject.headTag.unamedAttributes.length)
	{
		return false ;
	}

	return util.evalAttrExp(uiobject.headTag.unamedAttributes[0],context,model) ;
}

var childType = function(uiobject){
	if( uiobject.constructor===ElementObjs.ElementNode)
	{
		if( uiobject.tagName.toLowerCase() == "else" )
		{
			return T_ELSE ;
		}
		else if( uiobject.tagName.toLowerCase() == "elseif" )
		{
			return T_ELSEIF ;
		}
	}

	return 0 ;
}