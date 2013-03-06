require('seajs') ;
define(function(require){
//----------------------------------------------------

	var HtmlParser = require("ocHtmlParser/lib/Parser.js") ;

	var parser = {
		factoryConfig: HtmlParser.cloneFactoryConfig(HtmlParser.factoryConfigs.html)
		, instance: null
	}

	parser.factoryConfig ;
	parser.instance = new HtmlParser.create(parser.factoryConfig) ;

	return parser ;

//----------------------------------------------------
}) ;