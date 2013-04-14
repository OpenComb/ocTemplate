var ui = require("octemplate").singleton ;

var tpl = ui.template("octemplate/example/templates/test.html",function(err,tpl){

	console.log(new Date) ;

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
		, arr: [1,2,3]
		, obj: {a:1,b:2,c:3}
	} ;

	tpl.render(model,function(err,buff){
		if(err)
		{
			console.log(err.message) ;
			console.log(err.stack) ;
		}
		console.log(buff.toString()) ;
	}) ;

//	test(model,new RenderBuffer,function(err,buff){
//		console.log(buff.toString()) ;
//	}) ;

}) ;

