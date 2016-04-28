define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        Button = squiggle.views.ui.Button,
        PathView = squiggle.views.primitives.Path,
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
            var _s = 80, t, r1, r2, b1, b2, b3, xpos;
            xpos = 0;
            b1 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s);
            this.enablePlayButton();
            b1.getBackgroundRectangle().setRoundedCorners([_s,_s,_s,_s]);
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
            xpos += _s + 40;
            b2 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(xpos, 0)
                            .setBackgroundColorForState('#FD4141',Button.states.NORMAL)
                            .setBackgroundColorForState('#D95050',Button.states.HOVER)
                            .setBackgroundColorForState('#582323',Button.states.DOWN);
            b2.getBackgroundRectangle().setRoundedCorners([_s,_s,_s,_s]);
            r1 = new RectangleView().setWidth(_s/2).setHeight(_s/6).setStrokeWeight(0).setFillColor("#ffffff").setPosition(_s/4,_s/2 - (_s/12));
            b2.addSubview(r1);
            this.addSubview(b2);
            this.removeFrameButton = b2;
            xpos += _s + 20
            b3 = new Button().setText('')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setPosition(xpos, 0)
                            .setBackgroundColorForState('#41FD72',Button.states.NORMAL)
                            .setBackgroundColorForState('#50D974',Button.states.HOVER)
                            .setBackgroundColorForState('#2A703C',Button.states.DOWN);
            b3.getBackgroundRectangle().setRoundedCorners([_s,_s,_s,_s]);
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
          },
          enablePlayButton : function(){
            this.playButton.userInteractionEnabled = false;
            this.playButton.setBackgroundColorForState('#41BDFD',Button.states.NORMAL)
            .setBackgroundColorForState('#50A9D9',Button.states.HOVER)
            .setBackgroundColorForState('#285269',Button.states.DOWN);
          },
          enableAddFrameButton : function(){},
          enableRemoveButton : function(){},
          disalePlayButton : function(){},
          disaleAddFrameButton : function(){},
          disaleRemoveButton : function(){},
          mouseMoved : function(){
            for(var index in this.subviews) {
              var child = this.subviews[index];
              if(child.userInteractionEnabled){
                if(typeof(child['mouseMoved']) === "function"){
                  child['mouseMoved'].call(this.subviews[index])
                }
              }
            }
          },
          mousePressed : function(){
            for(var index in this.subviews) {
              var child = this.subviews[index];
              if(child.userInteractionEnabled){
                if(typeof(child['mousePressed']) === "function"){
                  child['mousePressed'].call(this.subviews[index])
                }
              }
            }
          },
          mouseReleased : function(){
            for(var index in this.subviews) {
              var child = this.subviews[index];
              if(child.userInteractionEnabled){
                if(typeof(child['mouseReleased']) === "function"){
                  child['mouseReleased'].call(this.subviews[index])
                }
              }
            }
          },
        });
        return DashboardView;
  }
);