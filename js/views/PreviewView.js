define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        Button = squiggle.views.ui.Button,
        AppSettings = squiggle.models.AppSettings,
        Path = squiggle.views.primitives.Path,
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
          
          /**
          * Reference to a download button
          */
          downloadButton : undefined,
          
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            var DownloadPath, msgBackground, closeButton, _s = AppSettings.ButtonHeight, _m = _s/8;
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
            this.animationRender = new AnimationRenderView().setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2, window.innerHeight/2 - AppSettings.AnimationSize.height/2)
                                                            .setFrameDelay(3);
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
                              this.closeButton.jerkIt({
                                amount:10,
                                complete:function(){
                                  if(this.delegate['onClosePreview'] !== undefined){
                                    this.delegate['onClosePreview']();
                                  }
                                }.bind(this)
                              });
                            }.bind(this));
            this.closeButton.getBackgroundRectangle().setRoundedCorners(_s);
            this.closeButton.getWord().setStrokeWeight(_s/6).setPosition(25,25);
            this.addSubview(this.closeButton);
            this.downloadButton = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(this.animationRender.x + AppSettings.AnimationSize.width - (_s/2), this.closeButton.y + _s + AppSettings.UIMargin/2)
                            .setBackgroundColorForState(AppSettings.ButtonColorNormalGreen,Button.states.NORMAL)
                            .setBackgroundColorForState(AppSettings.ButtonColorHoverGreen,Button.states.HOVER)
                            .setBackgroundColorForState(AppSettings.ButtonColorDownGreen,Button.states.DOWN)
                            .on(Button.events.CLICKED,function(){
                              this.downloadButton.jerkIt({
                                amount:10,
                                complete:function(){
                                  if(this.delegate['onDownloadRequest'] !== undefined){
                                    this.delegate['onDownloadRequest']();
                                  }
                                }.bind(this)
                              });
                            }.bind(this));
            this.downloadButton.getBackgroundRectangle().setRoundedCorners(_s);
            
            DownloadPath = new Path().setStrokeWeight(_s/6)
                                         .setStrokeColor('White')
                                         .addPoint(_m*2, _m*4)
                                         .addPoint(_m*4, _m*6)
                                         .addPoint(_m*6, _m*4)
                                         .setFill(false)
                                         .setClosed(false);
            this.downloadButton.addSubview(DownloadPath);
            DownloadPath = new Path().setStrokeWeight(_s/6)
                                         .setStrokeColor('White')
                                         .addPoint(_m*4, _m*2)
                                         .addPoint(_m*4, _m*6)
                                         .setFill(false)
                                         .setClosed(false);
            this.downloadButton.addSubview(DownloadPath);
            this.addSubview(this.downloadButton);
            this.userInteractionEnabled = true;
          },
          onScreenResize : function(){
            var _s = AppSettings.ButtonHeight, _m = _s/8;
            this.curtain.setWidth(window.innerWidth).setHeight(window.innerHeight);
            this.curtain.subviews[0].setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2, window.innerHeight/2 - AppSettings.AnimationSize.height/2);
            this.animationRender.setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2, window.innerHeight/2 - AppSettings.AnimationSize.height/2);                                          
            this.closeButton.setPosition(this.animationRender.x + AppSettings.AnimationSize.width - (_s/2), this.animationRender.y - (_s/2));
            this.downloadButton.setPosition(this.animationRender.x + AppSettings.AnimationSize.width - (_s/2), this.closeButton.y + _s + AppSettings.UIMargin/2);
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