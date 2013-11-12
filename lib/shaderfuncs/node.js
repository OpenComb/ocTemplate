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

    , statusAttrs: {
	disabled: 1
	, checked: 1
	, selected: 1
    }

    , shader: function(node,buff,next,generator,tpl){

	module.exports.tagShader(node,buff) ;

	// 处理子元素
	generator.makeChildrenSync(node,buff,tpl) ;

	module.exports.tailTagShader(node,buff) ;

	next() ;
    }


    , tailTagShader: function(node,buff)
    {
	if( !module.exports.emptyTags[ node.tagName.toLowerCase() ] )
	{
	    buff.output("</"+node._tagName+">") ;
	}
    }

    , tagShader: function(node,buff)
    {
	buff.output("<") ;

	buff.output(node._tagName) ;

	// 属性
	for(var i=0; i<node.attributes.length; i++ )
	{
	    var contents = shaderText.joinAsString( node.attributes[i], true ) ;

	    if(node.attributes[i].name && module.exports.statusAttrs[ node.attributes[i].name.toLowerCase() ] ) {
		buff.write( "var _$attributvalu = "+(contents||'""')+" ;" ) ;
		buff.write( "if(_$attributvalu){" ) ;
		buff.indent(1) ;

		buff.output(' ') ;
		buff.output(node.attributes[i].name) ;
		buff.indent(-1) ;
		buff.write( "}" ) ;
	    }

	    else if(node.attributes[i].name=='__shaders')
		continue ;

	    else
	    {
		var name = node.attributes[i].name? 
		    node.attributes[i].name.toString().trim(): "" ;

		if(name.substr(-1)=='?'){
		    buff.write( "var _$attributvalu = "+(contents||'""')+" ;" ) ;
		    buff.write( "if(_$attributvalu){" ) ;
		    buff.indent(1) ;

		    buff.output(' ') ;
		    buff.output(name.substr(0,name.length-1)) ;
		    buff.output("=") ;
		    buff.output('"') ;
		    buff.write( "buff.write(_$attributvalu) ;" ) ;
		    buff.output('"') ;

		    buff.indent(-1) ;
		    buff.write( "}" ) ;
		}
		else {

		    buff.output(' ') ;

		    // 名称
		    if( node.attributes[i].name )
		    {
			buff.output(node.attributes[i].name) ;
			buff.output("=") ;
		    }

		    buff.output('"') ;
		    buff.write( "buff.write("+ contents +") ;" ) ;
		    buff.output('"') ;
		}
	    }

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
