
var Class = require("ocClass/lib/Class.js") ;

var UIExpression = module.exports = Class.extend({
	ctor: function(start,raw,code){
		this.raw = raw ;
		this._start = start ;
		this._code = code || raw.substr(2,raw.length-4) ;
		this.length = raw.length ;

		var funcCode = " with($model){ with($tmpModel){ return " + this._code + " ; } } " ;

		this._func = new Function('$model','$tmpModel',funcCode) ;
	}
	, _start: 0
	, _code: ""
	, _raw: ""
	, _func: function(){}

	, run: function(tplModel,tmpModel){
		return this._func(tplModel,tmpModel) ;
	}

	, toString: function(){
		return this._raw ;
	}
}) ;


