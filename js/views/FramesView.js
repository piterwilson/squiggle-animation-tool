define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        RectangleView = squiggle.views.primitives.Rectangle,
        AppSettings = squiggle.models.AppSettings,
        FramesView = View.extend({
          positions : [],
          frameIndex : 0,
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
            this.frameIndex = index;
            var frames = []; // frames to draw ...
            _.each(this.subviews,function(view){
              view.setHidden(true);
            });
            if(this.model){
              if(this.model.models[index-1]){
                this.subviews[0].hidden = false;
              }
              if(this.model.models[index]){
                this.subviews[1].hidden = false;
              }
              if(this.model.models[index+1]){
                this.subviews[2].hidden = false;
              }
            }
          },
          onModelChange : function(model){
            this.model = model;
            this.onFrameIndexUpdate(this.frameIndex);
          }
        });
        return FramesView;
      }
    );