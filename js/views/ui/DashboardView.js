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
          width : 0,
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            this.initProperties(
              [{name:"delegate", value:1}]
            );
            this.userInteractionEnabled = true;
            var _s = AppSettings.ButtonHeight, t, r1, r2, b1, b2, b3, xpos;
            xpos = 0;
            b1 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s);
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
                            .setPosition(xpos, 0);
            b2.getBackgroundRectangle().setRoundedCorners(_s);
            r1 = new RectangleView().setWidth(_s/2).setHeight(_s/6).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/4,_s/2 - (_s/12));
            b2.addSubview(r1);
            this.addSubview(b2);
            this.removeFrameButton = b2;
            xpos += _s + AppSettings.UIMargin;
            b3 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(xpos, 0);
            b3.getBackgroundRectangle().setRoundedCorners(_s);
            r2 = new RectangleView().setWidth(_s/2).setHeight(_s/6).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/4,_s/2 - (_s/12));
            r3 = new RectangleView().setWidth(_s/6).setHeight(_s/2).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/2 - (_s/12), _s/4);
            b3.addSubview(r2);
            b3.addSubview(r3);
            this.addSubview(b3);
            this.addFrameButton = b3;
            this.width = xpos + _s;
            b1.on(Button.events.CLICKED,function(){
              if(this.delegate['onPlayPressed'] !== undefined){
                this.delegate['onPlayPressed']();
              }
            }.bind(this));
            b2.on(Button.events.CLICKED,function(){
              if(this.delegate['onRemoveFramePressed'] !== undefined){
                this.delegate['onRemoveFramePressed']();
              }
            }.bind(this));
            b3.on(Button.events.CLICKED,function(){
              if(this.delegate['onAddFramePressed'] !== undefined){
                this.delegate['onAddFramePressed']();
              }
            }.bind(this));
            this.enableUI();
          },
          enablePlayButton : function(){
            this.playButton.userInteractionEnabled = true;
            this.playButton.setBackgroundColorForState(AppSettings.ButtonColorNormalBlue,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverBlue,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownBlue,Button.states.DOWN);
          },
          disablePlayButton : function(){
            this.playButton.userInteractionEnabled = false;
            this.playButton.setBackgroundColorForState(AppSettings.ButtonColorDisabled,Button.states.NORMAL);
          },
          enableAddFrameButton : function(){
            this.addFrameButton.userInteractionEnabled = true;
            this.addFrameButton.setBackgroundColorForState(AppSettings.ButtonColorNormalGreen,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverGreen,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownGreen,Button.states.DOWN);
          },
          disableAddFrameButton : function(){
            this.addFrameButton.userInteractionEnabled = false;
            this.addFrameButton.setBackgroundColorForState(AppSettings.ButtonColorDisabled,Button.states.NORMAL);
          },
          enableRemoveFrameButton : function(){
            this.removeFrameButton.userInteractionEnabled = true;
            this.removeFrameButton.setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.NORMAL)
                           .setBackgroundColorForState(AppSettings.ButtonColorHoverRed,Button.states.HOVER)
                           .setBackgroundColorForState(AppSettings.ButtonColorDownRed,Button.states.DOWN);
          },
          disableRemoveFrameButton : function(){
            this.removeFrameButton.userInteractionEnabled = false;
            this.removeFrameButton.setBackgroundColorForState(AppSettings.ButtonColorDisabled,Button.states.NORMAL);
          },
          disableUI : function(){
            this.disablePlayButton();
            this.disableRemoveFrameButton();
            this.disableAddFrameButton();
          },
          enableUI : function(){
            this.enablePlayButton();
            this.enableRemoveFrameButton();
            this.enableAddFrameButton();
          }
        });
        return DashboardView;
  }
);