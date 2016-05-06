define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        AppSettings = squiggle.models.AppSettings,
        TWEEN = require("Tween"),
        FramesView = View.extend({
          positions : [],
          frameIndex : 0,
          tween : undefined,
          doTween : false,
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            _.each([0,1,2],function(i){
              var h = window.innerHeight, w = window.innerWidth, ypos = 0, rect = new RectangleView().setWidth(AppSettings.AnimationSize.width)
                                        .setHeight(AppSettings.AnimationSize.height)
                                        .setStrokeWeight(2)
                                        .setJerkiness(0.5)
                                        .setRoundedCorners(2)
                                        .setStrokeColor('rgba(0,0,0,0.05)')
                                        .setFillColor('White');
              ypos = h/2 - AppSettings.AnimationSize.height/2;         
              switch(i){
                case 0:
                  this.positions[i] = {x: Math.min(-AppSettings.AnimationSize.width/2, (w/2 - AppSettings.AnimationSize.width/2) - AppSettings.UIMargin - AppSettings.AnimationSize.width), y:ypos};
                  break;
                case 1:
                  this.positions[i] = {x:w/2 - AppSettings.AnimationSize.width/2,y:ypos};
                  break;
                case 2:
                  this.positions[i] = {x:Math.max(w - AppSettings.AnimationSize.width/2, (w/2 - AppSettings.AnimationSize.width/2) + AppSettings.UIMargin + AppSettings.AnimationSize.width),y:ypos};
              }
              rect.setPosition(this.positions[i].x,this.positions[i].y);
              this.addSubview(rect);
            }.bind(this));
          },
          onFrameIndexUpdate: function(index){
            if(index > this.frameIndex){
              console.log('move left');
              this.tweenTo(-(this.subviews[1].x - this.subviews[0].x));
            }else if(index < this.frameIndex){
              console.log('move right');
              this.tweenTo(this.subviews[1].x - this.subviews[0].x);
            }else{
              this.frameIndex = index;
              this.reassingFrames();
            }
            this.frameIndex = index;
          },
          tweenTo:function(__x){
            if(this.doTween){
              this.tween.stop();
            }
            var coords = { x: this.x}, __self = this;
            this.doTween = true;
            this.tween = new TWEEN.Tween(coords)
                .to({ x: __x}, 150)
                .interpolation(TWEEN.Easing.Elastic.In)
                .onUpdate(function() {
                  __self.x = this.x;
                })
                .onComplete(function(){
                  this.doTween = false;
                  this.reassingFrames();
                }.bind(this)).start();
            window.requestAnimationFrame(this.update.bind(this));
          },
          reassingFrames : function(){
            console.log("reassignFrames");
            this.x = 0;
            var frames = []; // frames to draw ...
            _.each(this.subviews,function(view){
              view.setHidden(true);
            });
            if(this.model){
              if(this.model.models[this.frameIndex-1]){
                this.subviews[0].hidden = false;
              }
              if(this.model.models[this.frameIndex]){
                this.subviews[1].hidden = false;
              }
              if(this.model.models[this.frameIndex+1]){
                this.subviews[2].hidden = false;
              }
            }
          },
          update:function(){
            console.log("this.doTween : "+this.doTween);
            if(this.doTween){
              TWEEN.update();
              window.requestAnimationFrame(this.update.bind(this));
            }
          },
          onModelChange : function(model){
            this.model = model;
          }
        });
        return FramesView;
      }
    );