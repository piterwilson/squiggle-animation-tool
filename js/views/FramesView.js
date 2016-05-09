define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        FrameRenderView = squiggle.views.animation.FrameRender,
        AppSettings = squiggle.models.AppSettings,
        TWEEN = require("Tween"),
        FramesView = View.extend({
          positions : [],
          renders : [],
          backs : [],
          frameIndex : 0,
          tween : undefined,
          doTween : false,
          initialize: function() {
            var render, h = window.innerHeight, w = window.innerWidth, ypos = h/2 - AppSettings.AnimationSize.height/2, rect;
            View.prototype.initialize.apply(this, arguments);
            _.each([0,1,2],function(i){
              rect = new RectangleView().setWidth(AppSettings.AnimationSize.width)
                                        .setHeight(AppSettings.AnimationSize.height)
                                        .setStrokeWeight(2)
                                        .setJerkiness(0.5)
                                        .setRoundedCorners(2)
                                        .setStrokeColor('rgba(0,0,0,0.0)')
                                        .setFillColor('White');
              render = new FrameRenderView();
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
              render.setPosition(this.positions[i].x,this.positions[i].y);
              rect.setPosition(this.positions[i].x,this.positions[i].y);
              this.backs.push(rect);
              this.renders.push(render);
              this.addSubview(rect);
              rect.addSubview(render);
            }.bind(this));
          },
          onFrameIndexUpdate: function(index){
            if(index > this.frameIndex){
              this.tweenTo(-(this.backs[1].x - this.backs[0].x));
            }else if(index < this.frameIndex){
              this.tweenTo(this.backs[1].x - this.backs[0].x);
            }else{
              this.frameIndex = index;
              this.reassingFrames();
            }
            this.frameIndex = index;
          },
          tweenTo:function(__x){
            if(!this.doTween){
              if(this.tween){
                this.tween.stop();
              }
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
            this.x = 0;
            var frames = []; // frames to draw ...
            for(var i = 0; i < this.backs.length; i++){
              this.backs[i].setHidden(true);
              this.renders[i].setModel(undefined);
            }
            if(this.model){
              if(this.model.models[this.frameIndex-1]){
                this.backs[0].hidden = false;
                this.renders[0].setModel(this.model.models[this.frameIndex-1]);
              }
              if(this.model.models[this.frameIndex]){
                this.backs[1].hidden = false;
                this.renders[1].setModel(this.model.models[this.frameIndex]);
              }
              if(this.model.models[this.frameIndex+1]){
                this.backs[2].hidden = false;
                this.renders[2].setModel(this.model.models[this.frameIndex+1]);
              }
            }
          },
          update:function(){
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