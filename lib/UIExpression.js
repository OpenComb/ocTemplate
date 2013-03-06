require("seajs");
define(function (require)
{
//----------------------------------------------------

	var Class = require("ocClass.js/lib/Class.js") ;

	var UIExpression = Class.extend({
		ctor: function(start,raw){
			this.raw = raw ;
			this._start = start ;
			this._code = raw.substr(2,raw.length-4) ;
			this.length = raw.length ;

			var funcCode = " with(tplModel){ with(tmpModel){ return " + this._code + " ; } } " ;

			this._func = new Function('tplModel','tmpModel',funcCode) ;
		}
		, _start: 0
		, _code: ""
		, _raw: ""
		, _func: function(){}

		, run: function(tplModel,tmpModel){
			return this._func(tplModel,tmpModel) ;
		}
	}) ;



	return UIExpression ;

//----------------------------------------------------
});