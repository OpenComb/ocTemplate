var should = require("should") ;

describe("Template",function(){
	
	var tplcache = require("../") ;

	it("use tempate",function(done){
		
		tplcache.template(__dirname+"/templates/simple.html",function(err,tpl){
			
			tpl.render({name:"world"},function(err,buff){
				
				console.log(buff.toString())
				buff.toString().should.match(/hello\, world/) ;
				
				
				done() ;
			}) ;
			
		}) ;
		
	}) ;
	
}) ;