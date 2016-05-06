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
          initialize: function() {
            View.prototype.initialize.apply(this, arguments);
            this.word = new Word().setFontSize(AppSettings.ButtonHeight/2)
                                  .setStrokeWeight(4)
                                  .setText("1/1");
            this.addSubview(this.word);
          },
          onFrameIndexUpdate: function(index){
            this.currentFrame = index + 1;
            this.updateCounter();
            },
          onModelChange : function(model){
            this.totalFrames = model.models.length;
            this.updateCounter();
          },
          updateCounter : function(){
            this.word.setText(this.currentFrame+" / "+this.totalFrames)
                      .setFontColor(AppSettings.maxFrames === this.totalFrames ? AppSettings.ButtonColorNormalRed : '#000000')
                      .setPosition(window.innerWidth/2 - this.word.getWidth()/2,AppSettings.UIMargin * 1.5);
          }
        });
        return FrameCounterView;
      }
    );
        