define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        DashboardView = require("views/ui/DashboardView"),
        Screen = squiggle.views.screens.Screen,
        AnimationModel = squiggle.models.Animation,
        RectangleView = squiggle.views.primitives.Rectangle,
        AnimationToolScreen = Screen.extend({
      curtain : undefined,
      /**
      * Animation tool options
      */
      options : {
        width : 400,
        height : 300
      },
      /**
      * Master Animation model
      */
      model : new AnimationModel(),
      /**
      * Setup function
      */
      setup : function(){
        this.curtain = new RectangleView().setStrokeWeight(0)
                                          .setJerkiness(0)
                                          .setWidth(window.innerWidth)
                                          .setHeight(window.innerHeight)
                                          .setFillColor('rgba(0,0,0,0.5)');
        var d = new DashboardView();
        d.setPosition(window.innerWidth/2 - d.width/2, window.innerHeight - 120).setDelegate(this);
        this.addSubview(d);
        //this.addSubview(this.curtain);
      },
      onPlayPressed : function(){
        
      }
    });
    return AnimationToolScreen;
  }
);