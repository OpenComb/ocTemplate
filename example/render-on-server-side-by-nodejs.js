

var TemplateCaches = require("ocTemplate") ;
var ui = require("ocTemplate").singleton ;



var tpl = ui.template("ocTemplate/example/templates/template-a.html",__filename) ;

tpl.load(function(err,tpl){
	if(err)
	{
		console.log(err.stack) ;
		console.log(err.toString()) ;
	}

	var model = {
		a: "a"
		, b: 'b'
		, c: 'c'
		, d: 'd'
		, x: 1000
		, i: 1
		, l: 0
	} ;

	tpl.createRenderContext().render(function(err,buff){
		if(err)
		{
			console.log(err.stack) ;
			console.log(err.toString()) ;
		}
		console.log(buff.toString()) ;
	},model) ;
}) ;

//
//tpl.display({
//		a: "a"
//		, b: 'b'
//		, c: 'c'
//		, d: 'd'
//		, x: 1000
//		, i: 0
//		, l: 1
//	},function(err,buff){
//
//		if(err)
//		{
//			console.log(err.stack) ;
//			console.log(err.toString()) ;
//		}
//
//		console.log(buff.toString()) ;
//	}) ;




