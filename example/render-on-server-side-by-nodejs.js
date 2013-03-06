require('seajs') ;


define(function(require){

	var ui = require("../index.js") ;



	ui.template(__dirname+"/templates/css-zen-garden.html",function(err,ctx){



		if(err)
		{
			console.log(err.stack) ;
			console.log(err.toString()) ;
			return ;
		}



		var startTime = new Date();
		console.log( ctx.render({
			a: "a"
			, b: 'b'
			, c: 'c'
			, d: 'd'
			, x: 1000
		}) ) ;
		console.log( new Date() - startTime + " ms" ) ;

	}) ;



}) ;


