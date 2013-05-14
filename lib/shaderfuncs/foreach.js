var text = new require("./text.js") ;

var uiforindex = 0 ;

module.exports = {

	selector: "foreach"

	, shader: function(node,buff,next,generator,tpl){

		var thisforidx = ++ uiforindex ;

		if( !node.attributes["for"]  )
		{
			throw new Error("foreach 标签缺少 for 属性") ;
		}
		var forvar = text.attrToExpr(node,'for') ;
		var forvarname = "foreach_" + thisforidx ;

		var varname = node.attributes["var"]? node.attributes["var"].nodeValue: 'foreach_var_'+thisforidx ;
		var keyname = node.attributes["key"]? node.attributes["key"].nodeValue: 'foreach_key_'+thisforidx ;

		forvarname = "$variables." + forvarname ;
		varname = "$variables." + varname ;
		keyname = "$variables." + keyname ;

		buff.write( "" ) ;
		buff.write( "// foreach loop's body ----------------------------------------" ) ;

		buff.write( forvarname+" = "+forvar+" ;" ) ;
		buff.write( "if("+forvarname+")" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;

		// loop body
		buff.write( "// for each body" ) ;
		buff.write( "function foreach_body_"+thisforidx+"($variables)" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;
		buff.write( "with($model){" ) ;
		buff.write( "with($variables){" ) ;
		buff.indent(1) ;
		generator.makeChildrenSync(node,buff,tpl) ;
		buff.indent(-1) ;
		buff.write("}}") ; // end of $model, $variables
		buff.indent(-1) ;
		buff.write("}") ;

		// as array or string
		buff.write( "" ) ;
		buff.write( "// for each as array or string" ) ;
		buff.write( "if("+forvarname+".constructor===Array || "+forvarname+".constructor===String)" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;
		buff.write( "for("+keyname+"=0;"+keyname+"<"+forvarname+".length;"+keyname+"++)" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;
		buff.write( varname+" = "+forvarname+"["+keyname+"] ;" ) ;
		buff.write( "foreach_body_"+thisforidx+" ($variables) ;" ) ;
		buff.indent(-1) ;
		buff.write( "}" ) ;
		buff.indent(-1) ;
		buff.write( "}" ) ;

		// as object
		buff.write( "" ) ;
		buff.write( "// for each as object" ) ;
		buff.write( "else" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;
		buff.write( "for("+keyname+" in "+forvarname+")" ) ;
		buff.write( "{" ) ;
		buff.indent(1) ;
		buff.write( varname+" = "+forvarname+"["+keyname+"] ;" ) ;
		buff.write( "foreach_body_"+thisforidx+" ($variables) ;" ) ;
		buff.indent(-1) ;
		buff.write( "}" ) ;
		buff.indent(-1) ;
		buff.write( "}" ) ;

		buff.indent(-1) ;
		buff.write( "}" ) ;

	}

} ;