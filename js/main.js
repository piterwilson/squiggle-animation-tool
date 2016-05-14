require.config({
		paths: {
        jquery: 'vendor/jquery-2.2.3.min',
        underscore: 'vendor/underscore-min',
        backbone: 'vendor/backbone-min',
				p5 : "vendor/p5.min",
				squiggle: 'squiggle',
				randomColor : "vendor/randomColor.min",
				Tween : "vendor/Tween",
				saveAs : "vendor/FileSaver.min"
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
