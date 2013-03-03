require('seajs') ;


define(function(require){

	var ui = require("../index.js") ;

	ui.template(__dirname+"/templates/css-zen-garden.html",function(err,tpl){



		if(err)
		{
			console.log(err) ;
			return ;
		}

		var dom = tpl.dom ;
		var meta = dom.childNodes[1].childNodes[1].childNodes[0] ;
		console.log(meta.nodeValue) ;
		console.log(dom.childNodes[0].nodeValue) ;
//		console.log(dom.childNodes[1].nodeValue) ;
//		console.log(dom.childNodes[2].tagName) ;

		var body = dom.body ;
		console.log(body.raw) ;

		tpl.render() ;

	}) ;



}) ;


