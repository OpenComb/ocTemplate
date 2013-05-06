

var ui = require("../") ;

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

var tpl = ui.template("octemplate/example/templates/template-a.html",function(err,tpl){
	if(err)
	{
		console.log(err.stack) ;
		console.log(err.toString()) ;
	}


	tpl.render(model,function(err,buff){
		if(err)
		{
			console.log(err.message) ;
			console.log(err.stack) ;
		}
		console.log(buff.toString()) ;
	}) ;


}) ;


//test(model,new RenderBuffer,function(err,buff){
//	if(err)
//	{
//		console.log(err.message) ;
//		console.log(err.stack) ;
//	}
//	console.log(buff.toString()) ;
//}) ;


function test($model,buff,callback){

	try{
		var $variables = {};
		$helper = this.helper ;
		function _$step_0(err)
		{
			if(err){ _$step_last(err) ; return ;}
			var $nextstep = _$step_1 ;
			with($model){
				with($variables){
					try{
						buff.write( "<div>a</div>\n\n<div>\n    " );


						$nextstep(null) ;
					}catch(err){
						callback && callback(err) ;
						return ;
					}}}
		}

		function _$step_1(err)
		{
			if(err){ _$step_last(err) ; return ;}
			var $nextstep = _$step_2 ;
			with($model){
				with($variables){
					try{
						var TemplateCache = require('octemplate/lib/TemplateCaches.js') ;
						TemplateCache.singleton.template("octemplate/example/templates/template-b.html",function(err,tpl){
							if(err)
							{
								_$step_last(err);
							}else{
								tpl.render({},$nextstep,buff) ;
							}
						}) ;
					}catch(err){
						callback && callback(err) ;
						return ;
					}}}
		}

		function _$step_2(err)
		{
			if(err){ _$step_last(err) ; return ;}
			var $nextstep = _$step_last ;
			with($model){
				with($variables){
					try{
						buff.write( "\n</div>\n\n        " );
						if( (i) ){
							buff.write( "\n            hi\n        " );
						}
						buff.write( "\n\n<div title=\"" );
						buff.write(( l)) ;
						buff.write( "\" i=\"" );
						buff.write("i") ;
						buff.write( "\">ccc</div>\n    " );
						buff.write(  i  ) ;
						buff.write( "\n<div>dddd</div>\n\n" );

						// loop
						for( $variables.i=(1);$variables.i<=("10");$variables.i+=(1) )
						{
							buff.write( "\n    " );
							buff.write(  i  ) ;
							buff.write( "\n" );
						}
						buff.write( "\n\n------------\n" );

						// foreach loop's body ----------------------------------------
						$variables.foreach_1 = (arr) ;
						if($variables.foreach_1)
						{
							// for each body
							function foreach_body_1($variables)
							{
								with($variables){
									buff.write( "\n    " );

									// foreach loop's body ----------------------------------------
									$variables.foreach_2 = (obj) ;
									if($variables.foreach_2)
									{
										// for each body
										function foreach_body_2($variables)
										{
											with($variables){
												buff.write( "\n        - " );
												buff.write(  i  ) ;
												buff.write( " : " );
												buff.write(  v  ) ;
												buff.write( "\n        - " );
												buff.write(  k  ) ;
												buff.write( " : " );
												buff.write(  vv  ) ;
												buff.write( "\n    " );
											}
										}

										// for each as array or string
										if($variables.foreach_2.constructor===Array || $variables.foreach_2.constructor===String)
										{
											for($variables.k=0;$variables.k<$variables.foreach_2.length;$variables.k++)
											{
												$variables.vv = $variables.foreach_2[$variables.k] ;
												foreach_body_2 ($variables) ;
											}
										}

										// for each as object
										else
										{
											for($variables.k in $variables.foreach_2)
											{
												$variables.vv = $variables.foreach_2[$variables.k] ;
												foreach_body_2 ($variables) ;
											}
										}
									}
									buff.write( "\n" );
								}
							}

							// for each as array or string
							if($variables.foreach_1.constructor===Array || $variables.foreach_1.constructor===String)
							{
								for($variables.i=0;$variables.i<$variables.foreach_1.length;$variables.i++)
								{
									$variables.v = $variables.foreach_1[$variables.i] ;
									foreach_body_1 ($variables) ;
								}
							}

							// for each as object
							else
							{
								for($variables.i in $variables.foreach_1)
								{
									$variables.v = $variables.foreach_1[$variables.i] ;
									foreach_body_1 ($variables) ;
								}
							}
						}
						buff.write( "\n------------" );


						$nextstep(null) ;
					}catch(err){
						callback && callback(err) ;
						return ;
					}}}
		}

		function _$step_last(err)
		{
			callback && callback(err,buff) ;
		}
		_$step_0(null) ;


	}catch(e){
		var err = new Error('模板文件中的表达式在渲染过程中抛出了异常，渲染过程终端') ;
		err.cause = e ;
		throw err ;
	}
}


