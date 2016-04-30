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
          
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            // a 'curtain' to cover the screen when there are modals
            this.curtain = new RectangleView().setStrokeWeight(0)
                                              .setJerkiness(0)
                                              .setWidth(window.innerWidth)
                                              .setHeight(window.innerHeight)
                                              .setFillColor('rgba(65,189,253,0.75)');
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
                                                        this.cancel();
                                                      }.bind(this));
            this.cancelButton.getBackgroundRectangle().setRoundedCorners(AppSettings.ButtonHeight);
            this.cancelButton.getWord().setStrokeWeight(4);
            msgBackground.addSubview(this.cancelButton);
            msgBackground.userInteractionEnabled = true;
            this.userInteractionEnabled = true;
            this.messageWord = new Word().setFontSize(fs)
                                  .setText('This is a test?')
                                  .setJerkiness(1)
                                  .setStrokeWeight(4);
            msgBackground.addSubview(this.messageWord);
            this.__centerText();    
          },
          
          __centerText : function(){
            this.messageWord.setPosition(this.__msgWindowWidth/2 - this.messageWord.getWidth()/2, 150);
          },
          
          showMessage : function (msg, okButtonText, cancelButtonText, callback){
            this.addSubview(this.curtain);
            this.messageWord.setText(msg);
            this.__centerText();
            this.okButton.setText(okButtonText);
            if(cancelButtonText === undefined && callback === undefined){
              this.okButton.on(Button.events.CLICKED,function(){
                this.cancel();
              }.bind(this));
              this.okButton.setX(this.__msgWindowWidth/2 - this.okButton.width/2);
              if(this.cancelButton.parent !== undefined) this.cancelButton.parent.removeSubview(this.cancelButton);
            }else{
              this.okButton.setX(AppSettings.UIMargin);
              if(this.okButton.parent !== undefined) this.okButton.parent.addSubview(this.cancelButton);
              this.cancelButton.setText(cancelButtonText);
              this.okButton.on(Button.events.CLICKED,function(){
                this.cancel();
                callback();
              }.bind(this));
            }
          },
          
          cancel : function(){
            this.removeSubview(this.curtain);
            this.okButton.off(Button.events.CLICKED);
          },
          
          draw : function(){
            View.prototype.draw.apply(this,arguments);
          },
          
          
          
        }
      );
    return ModalView;
  }
);