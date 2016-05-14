define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        Button = squiggle.views.ui.Button,
        PathView = squiggle.views.primitives.Path,
        AppSettings = squiggle.models.AppSettings,
        DashboardView = View.extend({
          delegate : undefined,
          playButton : undefined,
          addFrameButton : undefined,
          removeFrameButton : undefined,
          nextFrameButton : undefined,
          previousFrameButton : undefined,
          numFrames : 0,
          currentFrameIndex : 0,
          width : 0,
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            this.initProperties(
              [{name:"delegate", value:1}]
            );
            this.userInteractionEnabled = true;
            var _s = AppSettings.ButtonHeight, t, r1, r2, b1, b2, b3, xpos, ypos;
            this.previousFrameButton = new Button().setText('')
                                               .setWidth(_s)
                                               .setHeight(_s)
                                               .setPosition(AppSettings.UIMargin,window.innerHeight/2 - _s/2);
            this.previousFrameButton.getBackgroundRectangle().setRoundedCorners(_s);
            this.addSubview(this.previousFrameButton);
            this.nextFrameButton = new Button().setText('')
                                               .setWidth(_s)
                                               .setHeight(_s)
                                               .setPosition(window.innerWidth - AppSettings.UIMargin - _s,window.innerHeight/2 - _s/2);
            this.nextFrameButton.getBackgroundRectangle().setRoundedCorners(_s);
            this.addSubview(this.nextFrameButton);
            xpos = window.innerWidth/2 - 160;
            ypos = window.innerHeight - 120;
            b1 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(window.innerWidth/2 - AppSettings.AnimationSize.width/2,ypos);
            b1.getBackgroundRectangle().setRoundedCorners(_s);
            t = new PathView()
              .addPoint(0,0)
              .addPoint(_s/3,_s/4)
              .addPoint(0,_s/2)
              .setStrokeWeight(0)
              .setPosition(_s/2.5,_s/4)
              .setFillColor("#ffffff");
            b1.addSubview(t);
            this.addSubview(b1);
            this.playButton = b1;
            xpos += _s + _s + AppSettings.UIMargin;
            b2 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(xpos, ypos);
            b2.getBackgroundRectangle().setRoundedCorners(_s);
            r1 = new RectangleView().setWidth(_s/2).setHeight(_s/6).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/4,_s/2 - (_s/12));
            b2.addSubview(r1);
            this.addSubview(b2);
            this.removeFrameButton = b2;
            xpos += _s + AppSettings.UIMargin;
            b3 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(xpos, ypos);
            b3.getBackgroundRectangle().setRoundedCorners(_s);
            r2 = new RectangleView().setWidth(_s/2).setHeight(_s/6).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/4,_s/2 - (_s/12));
            r3 = new RectangleView().setWidth(_s/6).setHeight(_s/2).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/2 - (_s/12), _s/4);
            b3.addSubview(r2);
            b3.addSubview(r3);
            this.addSubview(b3);
            this.addFrameButton = b3;
            this.width = xpos + _s;
            b1.on(Button.events.CLICKED,function(){
              b1.jerkIt({
                amount:10,
                complete:function(){
                  if(this.delegate['onPlayPressed'] !== undefined){
                    this.delegate['onPlayPressed']();
                  }
                }.bind(this)
              });
            }.bind(this));
            b2.on(Button.events.CLICKED,function(){
              b2.jerkIt({
                amount:10,
                complete:function(){
                  if(this.delegate['onRemoveFramePressed'] !== undefined){
                    this.delegate['onRemoveFramePressed']();
                  }
                }.bind(this)
              });
            }.bind(this));
            b3.on(Button.events.CLICKED,function(){
              b3.jerkIt({
                amount:10,
                complete:function(){
                  if(this.delegate['onAddFramePressed'] !== undefined){
                    this.delegate['onAddFramePressed']();
                  }
                }.bind(this)
              });
            }.bind(this));
            this.enableUI();
          },
          enableBlueButton : function(button){
            button.userInteractionEnabled = true;
            button.setBackgroundColorForState(AppSettings.ButtonColorNormalBlue,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverBlue,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownBlue,Button.states.DOWN);
          },
          disableButton : function(button){
            button.userInteractionEnabled = false;
            button.setBackgroundColorForState(AppSettings.ButtonColorDisabled,Button.states.NORMAL);
          },
          enablePreviousFrameButton(){
            this.enableBlueButton(this.previousFrameButton);
          },
          disablePreviousFrameButton(){
            this.disableButton(this.previousFrameButton);
          },
          enableNextFrameButton:function(){
            this.enableBlueButton(this.nextFrameButton);
          },
          disableNextFrameButton:function(){
            this.disableButton(this.nextFrameButton);
          },
          enablePlayButton : function(){
            this.enableBlueButton(this.playButton);
          },
          disablePlayButton : function(){
            this.disableButton(this.playButton);
          },
          enableAddFrameButton : function(){
            this.addFrameButton.userInteractionEnabled = true;
            this.addFrameButton.setBackgroundColorForState(AppSettings.ButtonColorNormalGreen,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverGreen,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownGreen,Button.states.DOWN);
          },
          disableAddFrameButton : function(){
            this.disableButton(this.addFrameButton);
          },
          enableRemoveFrameButton : function(){
            this.removeFrameButton.userInteractionEnabled = true;
            this.removeFrameButton.setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverRed,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownRed,Button.states.DOWN);
          },
          disableRemoveFrameButton : function(){
            this.disableButton(this.removeFrameButton);
          },
          disableUI : function(){
            this.disablePlayButton();
            this.disableRemoveFrameButton();
            this.disableAddFrameButton();
            this.disablePreviousFrameButton();
            this.disableNextFrameButton();
          },
          enableUI : function(){
            this.enablePlayButton();
            this.enableRemoveFrameButton();
            this.enableAddFrameButton();
            this.enablePreviousFrameButton();
            this.enableNextFrameButton();
          },
          onModelChange: function(model){
            this.numFrames = model.models.length;
            if(model.models.length > 1){
              this.enablePlayButton();
              this.enableRemoveFrameButton();
              this.removeFrameButton.hidden = false;
            }else{
              this.disablePlayButton();
              this.disableRemoveFrameButton();
              this.removeFrameButton.hidden = true;
            }
            if(model.models.length === AppSettings.maxFrames){
              this.disableAddFrameButton();
            }else{
              this.enableAddFrameButton();
            }
          },
          onFrameIndexUpdate : function(index){
            this.currentFrameIndex = index;
            this.evaluateStateNextPrevButtons();
          },
          evaluateStateNextPrevButtons(){
            console.log(this.numFrames);
            console.log(this.currentFrameIndex);
            if(this.numFrames > 1){
              if(this.currentFrameIndex !== this.numFrames - 1){
                this.enableNextFrameButton();
              }
              if(this.currentFrameIndex === 0){
                this.disablePreviousFrameButton();
              }else{
                this.enablePreviousFrameButton();
              }
            }else{
              this.disablePreviousFrameButton();
              this.disableNextFrameButton();
            }
          }
        });
        return DashboardView;
  }
);