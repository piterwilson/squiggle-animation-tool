define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        Button = squiggle.views.ui.Button,
        Word = squiggle.views.text.Word,
        AppSettings = squiggle.models.AppSettings,
        ModalView = View.extend({
          
          /**
          * Word instance with the message
          */
          messageWord : undefined,
          
          /**
          *  Button instance for 'Ok'
          */
          okButton : undefined,
          
          /**
          * Button instance for 'Cancel'
          */
          cancelButton : undefined,
          
          /**
          * Cover the entire screen to draw attention to the message
          */
          curtain : undefined,
          /**
          * Delegate that will respond to events in the modal button interactions
          */
          delegate : undefined,
          
          __msgWindowWidth : 600,
          
          __progressm : false,
          __progressj : 1,
          __progressi : 0.5,
          
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            // a 'curtain' to cover the screen when there are modals
            this.curtain = new RectangleView().setStrokeWeight(0)
                                              .setJerkiness(0)
                                              .setWidth(window.innerWidth)
                                              .setHeight(window.innerHeight)
                                              .setFillColor(AppSettings.DarkBlueColor);
            var fs = 18, msgw = this.__msgWindowWidth, msgh = 400, msgBackground = new RectangleView().setStrokeWeight(0)
                                              .setJerkiness(1)
                                              .setWidth(msgw)
                                              .setHeight(msgh)
                                              .setRoundedCorners(AppSettings.ButtonHeight/2)
                                              .setPosition(window.innerWidth/2 - msgw/2, window.innerHeight/2 - msgh/2)
                                              .setFillColor('White');
            this.curtain.addSubview(msgBackground);
            this.curtain.userInteractionEnabled = true;
            this.okButton = new Button()
                            .setAutoAdjustSize(false)
                            .setFontSize(fs)
                            .setText('OK')
                            .setWidth((msgw - (AppSettings.UIMargin * 3))/2)
                            .setHeight(AppSettings.ButtonHeight)
                            .setFontColorForState('#ffffff',Button.states.NORMAL)
                            .setFontColorForState('#ffffff',Button.states.HOVER)
                            .setPosition(AppSettings.UIMargin, msgh - AppSettings.UIMargin - AppSettings.ButtonHeight)
                            .setBackgroundColorForState(AppSettings.ButtonColorNormalBlue,Button.states.NORMAL)
                            .setBackgroundColorForState(AppSettings.ButtonColorHoverBlue,Button.states.HOVER)
                            .setBackgroundColorForState(AppSettings.ButtonColorDownBlue,Button.states.DOWN)
                            .setShowUnderline(false);
            this.okButton.getBackgroundRectangle().setRoundedCorners(AppSettings.ButtonHeight);
            this.okButton.getWord().setStrokeWeight(4);
            msgBackground.addSubview(this.okButton);
            this.cancelButton = new Button()
                            .setAutoAdjustSize(false)
                            .setFontSize(fs)
                            .setText('Cancel')
                            .setWidth((msgw - (AppSettings.UIMargin * 3))/2)
                            .setHeight(AppSettings.ButtonHeight)
                            .setFontColorForState('#ffffff',Button.states.NORMAL)
                            .setFontColorForState('#ffffff',Button.states.HOVER)
                            .setPosition(msgw - AppSettings.UIMargin - this.okButton.getBackgroundRectangle().width, msgh - AppSettings.UIMargin - AppSettings.ButtonHeight)
                            .setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.NORMAL)
                            .setBackgroundColorForState(AppSettings.ButtonColorHoverRed,Button.states.HOVER)
                            .setBackgroundColorForState(AppSettings.ButtonColorDownRed,Button.states.DOWN)
                            .setShowUnderline(false)
                            .on(Button.events.CLICKED,function(){
                                                        this.messageWord.jerkIt();
                                                        this.cancelButton.jerkIt({
                                                          amount:5,
                                                          complete:function(){
                                                            this.cancel();
                                                          }.bind(this)
                                                        })
                                                      }.bind(this));
            this.cancelButton.getBackgroundRectangle().setRoundedCorners(AppSettings.ButtonHeight);
            this.cancelButton.getWord().setStrokeWeight(4);
            msgBackground.addSubview(this.cancelButton);
            msgBackground.userInteractionEnabled = true;
            this.userInteractionEnabled = true;
            this.messageWord = new Word().setFontSize(fs)
                                  .setText('This is a test?')
                                  .setJerkiness(1)
                                  .setStrokeWeight(4)
                                  .setFontColor(AppSettings.ButtonColorNormalBlue);
            msgBackground.addSubview(this.messageWord);
            this.__centerTextMessage();    
          },
          
          windowResized : function(){
            var msgw = this.__msgWindowWidth, msgh = 400;
            this.curtain.setWidth(window.innerWidth)
                        .setHeight(window.innerHeight)
                        .subviews[0].setPosition(window.innerWidth/2 - msgw/2, window.innerHeight/2 - msgh/2);
          },
          
          __centerTextMessage : function(){
            this.messageWord.setPosition(this.__msgWindowWidth/2 - this.messageWord.getWidth()/2, 150);
          },
          
          __centerTextProgress :function(){
            this.messageWord.setPosition(this.__msgWindowWidth/2 - this.messageWord.getWidth()/2, 200);
          },
          
          showMessage : function (msg, okButtonText, cancelButtonText, callback){
            this.addSubview(this.curtain);
            this.messageWord.setText(msg).setJerkiness(1);
            this.__centerTextMessage();
            this.okButton.setText(okButtonText);
            this.okButton.setHidden(false);
            
            if(cancelButtonText === undefined && callback === undefined){
              this.okButton.on(Button.events.CLICKED,function(){
                this.messageWord.jerkIt();
                this.okButton.jerkIt({
                  amount:10,
                  complete:function(){
                    this.cancel();
                  }.bind(this)
                })
              }.bind(this));
              this.okButton.setX(this.__msgWindowWidth/2 - this.okButton.width/2);
              this.cancelButton.setHidden(true);
            }else{
              this.okButton.setX(AppSettings.UIMargin);
              this.cancelButton.setHidden(false);
              this.cancelButton.setText(cancelButtonText);
              this.okButton.on(Button.events.CLICKED,function(){
                this.messageWord.jerkIt();
                this.okButton.jerkIt({
                  amount:10,
                  complete:function(){
                    this.cancel();
                    callback();
                  }.bind(this)
                })
              }.bind(this));
            }
          },
          
          showProgress : function (msg){
            this.addSubview(this.curtain);
            this.messageWord.setText(msg);
            this.__centerTextProgress();
            this.cancelButton.setHidden(true);
            this.okButton.setHidden(true);
            this.__progressm = true;
          },
          
          cancel : function(){
            this.removeSubview(this.curtain);
            this.okButton.off(Button.events.CLICKED);
            this.__progressm = false;
          },
          
          draw : function(){
            View.prototype.draw.apply(this,arguments);
            if(this.__progressm){
              this.messageWord.setJerkiness(this.__progressj);
              this.__progressj += this.__progressi;
              if(this.__progressj > 10 || this.__progressj < 1){
                this.__progressi *= -1;
              }
            }
          },

        }
      );
    return ModalView;
  }
);