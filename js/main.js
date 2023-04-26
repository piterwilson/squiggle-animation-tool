require.config({
		paths: {
        jquery: 'vendor/jquery-3.6.4.slim.min',
        underscore: 'vendor/underscore-umd-min',
        backbone: 'vendor/backbone-min',
				p5 : "vendor/p5.min",
				squiggle: 'squiggle',
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
  require(["squiggle","AnimationToolScreen","underscore"], function (squiggle, AnimationToolScreen) {
		squiggle.init();
		var screen = new AnimationToolScreen();
		squiggle.screen = screen;
  });
});

requirejs.onError = function (err) {
    console.log("REQUIRE-JS: [ERROR] " , err);
    throw err;
};

window.addEventListener("beforeunload", function (e) {
		if(window.clean) return;
    var confirmationMessage = 'Careful! '
                            + 'If you leave before downloading your animation,it will be lost forever!';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

document.ontouchmove = function(event){
    event.preventDefault();
}
