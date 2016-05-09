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
          
          /**
          * Reference to a close button
          */
          closeButton : undefined,
          
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            var msgBackground, closeButton, _s = AppSettings.ButtonHeight;
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
            this.closeButton = new Button().setText('x')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(this.animationRender.x + AppSettings.AnimationSize.width - (_s/2), this.animationRender.y - (_s/2))
                            .setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.NORMAL)
                            .setBackgroundColorForState(AppSettings.ButtonColorHoverRed,Button.states.HOVER)
                            .setBackgroundColorForState(AppSettings.ButtonColorDownRed,Button.states.DOWN)
                            .setFontColorForState('White',Button.states.NORMAL)
                            .setFontColorForState('White',Button.states.HOVER)
                            .setFontColorForState('White',Button.states.DOWN)
                            .setFontSize(40)
                            .on(Button.events.CLICKED,function(){
                              if(this.delegate['onClosePreview'] !== undefined){
                                this.delegate['onClosePreview']();
                              }
                            }.bind(this));
            this.closeButton.getBackgroundRectangle().setRoundedCorners(_s);
            this.closeButton.getWord().setStrokeWeight(_s/6).setPosition(25,25);
            this.addSubview(this.closeButton);
            this.userInteractionEnabled = true;
          },
          start : function(model){
            this.animationRender.setModel(model).play();
          },
          stop : function(){
            this.animationRender.stop();
          }
        });
        return PreviewView;
      }
    )