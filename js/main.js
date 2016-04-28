require.config({
		paths: {
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
				p5 : "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.24/p5.min",
				squiggle: 'squiggle',
				randomColor : "https://cdnjs.cloudflare.com/ajax/libs/randomcolor/0.4.4/randomColor.min"
    },
    shim: {
        backbone: {
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
				p5:{
					exports : 'p5'
				}
    },
	 waitSeconds: 5
});

function windowLoaded(callback){
  if(document.readyState == "complete"){
    callback();
  }else{
    window.addEventListener("load", function(){
      callback();
    });
  }
}

windowLoaded(function() {
  require(["squiggle","AnimationToolScreen"], function (squiggle, AnimationToolScreen) {
		$('#splash').remove();
		squiggle.init();
		var screen = new AnimationToolScreen();
		squiggle.screen = screen;
  });
});

requirejs.onError = function (err) {
    console.log("REQUIRE-JS: [ERROR] " , err);
    throw err;
};
