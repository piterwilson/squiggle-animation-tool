define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        Word = squiggle.views.text.Word,
        AppSettings = squiggle.models.AppSettings,
        FrameCounterView = View.extend({
          word : undefined,
          totalFrames : 0,
          currentFrame : 0,
          ftu : true,
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            this.word = new Word().setFontSize(AppSettings.ButtonHeight/2)
                                  .setStrokeWeight(4)
                                  .setText("1/1");
            this.addSubview(this.word);
          },
          onFrameIndexUpdate: function(index){
            if(index > 0){
              this.ftu = false;
            }
            this.currentFrame = index + 1;
            this.updateCounter();
            this.word.jerkIt(20);
            },
          onModelChange : function(model){
            this.totalFrames = model.models.length;
            this.updateCounter();
          },
          updateCounter : function(){
            if(this.ftu && this.totalFrames === 1){
              this.word.hidden = true;
              return;
            }
            this.word.hidden = false;
            this.word.setText(this.currentFrame+" / "+this.totalFrames)
                      .setFontColor(AppSettings.maxFrames === this.totalFrames ? AppSettings.ButtonColorNormalRed : AppSettings.ButtonColorNormalBlue)
                      .setPosition(window.innerWidth/2 - this.word.getWidth()/2,AppSettings.UIMargin * 1.5);
            
          },
          windowResized : function(){
            this.word.setPosition(window.innerWidth/2 - this.word.getWidth()/2,AppSettings.UIMargin * 1.5);
          }
        });
        return FrameCounterView;
      }
    );
        