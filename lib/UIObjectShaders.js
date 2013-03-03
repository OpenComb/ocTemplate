require('seajs') ;

define(function(require){

	var UIObjectShaders = function(objPool){

		this.objPool = objPool ;

		this._lnks = {}

	}

	UIObjectShaders.prototype.attache = function(uiObjIdx,shaderFunc){
		if( !(uiObjIdx in this._lnks) )
		{
			this._lnks[uiObjIdx] = [] ;
		}

		this._lnks[uiObjIdx].push(shaderFunc) ;
	}

	return UIObjectShaders ;

}) ;