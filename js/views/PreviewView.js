define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        Button = squiggle.views.ui.Button,
        AppSettings = squiggle.models.AppSettings,
        AnimationRenderView = squiggle.views.animation.AnimationRender,
        PreviewView = View.extend({
          /**
          * Cover the entire screen to draw attention to the message
          */
          curtain : undefined,
          /**
          * Delegate that will respond to events in the preview close button interactions
          */
          delegate : undefined,
          
          /**
          * Reference to an AnimationRender class
          */
          animationRender: undefined,
          
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            var msgBackground;
            // a 'curtain' to cover the screen when there are modals
            this.curtain = new RectangleView().setStrokeWeight(0)
                                              .setJerkiness(0)
                                              .setWidth(window.innerWidth)
                                              .setHeight(window.innerHeight)
                                              .setFillColor(AppSettings.DarkBlueColor);
            this.addSubview(this.curtain);
            msgBackground = new RectangleView().setStrokeWeight(0)
                                              .setJerkiness(1)
                                              .setWidth(AppSettings.AnimationSize.width)
                                              .setHeight(AppSettings.AnimationSize.height)
                                              .setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2, window.innerHeight/2 - AppSettings.AnimationSize.height/2)
                                              .setFillColor('White');
            this.curtain.addSubview(msgBackground);
            this.animationRender = new AnimationRenderView().setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2, window.innerHeight/2 - AppSettings.AnimationSize.height/2);
            this.addSubview(this.animationRender);
          },
          start : function(model){
            console.log(this.animationRender.x);
            this.animationRender.setModel(model).play();
          }
        });
        return PreviewView;
      }
    )