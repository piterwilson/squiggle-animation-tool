define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        View = squiggle.views.View,
        Word = squiggle.views.text.Word,
        AppSettings = squiggle.models.AppSettings,
        Button = squiggle.views.ui.Button,
        Rectangle = squiggle.views.primitives.Rectangle,
        TWEEN = require("Tween"),
        AboutView =  View.extend({
          /**
          * Reference to a rectangle view for the background
          */
          backgroundRectangle : undefined,
          /**
          * Array to hold all the text lines. Used for the 'wave' animation
          */
          lines   : undefined,
          /**
          * Reference to a 'close' button (closes the view)
          */
          closeButton : undefined,
          /**
          * Reference to 'open source' button (opens github link)
          */
          osButton : undefined,
          /**
          * Reference to 'read more' button
          */
          moreButton : undefined,
          /**
          * Lines member being animated, used for the 'wave' animation
          */
          lineCounter : 0,
          /**
          * Flag to know whether or not we are antimating the wave, used for the 'wave' animation
          */
          waving : false,
          /**
          * Used for the 'wave' animation
          */
          delay : 150,
          doTween : false,
          tween : undefined,
          initialize: function() {
            var fontSize = 12, sw = 2,  _s = AppSettings.ButtonHeight;
            View.prototype.initialize.apply(this, arguments);
            this.backgroundRectangle = new Rectangle().setFillColor('rgba(65,189,253,1)').setStrokeWeight(0);
            this.addSubview(this.backgroundRectangle);
            this.addSubview(new Word().setText("//").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// Squiggle (1)").setFontColor('white').setFontSize(fontSize).setStrokeWeight(sw+1));
            this.addSubview(new Word().setText("//").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// educational animation tool.").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// frame x frame day x day").setFontColor("white").setFontSize(fontSize).setStrokeWeight(1));
            this.addSubview(new Word().setText("//").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// source code available").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// in github.").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("//").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// click here to read").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("// more about SQUIGGLE (1)").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            this.addSubview(new Word().setText("//").setFontColor("white").setFontSize(fontSize).setStrokeWeight(sw));
            

            this.lines = this.subviews.slice(0);
            this.lines.splice(0,1);
            // 
            // Squiggle 1
            //
            // Educational animation tool.
            // Source code available in github.
            // To read more about SQUIGGLE 1 click here.
            //
            // Squiggle
            // Frame by frame, by per day.
            //
            this.osButton = new Button().setText("")
                                        .setBackgroundColorForState('rgba(0,0,0,0.05)',Button.states.NORMAL)
                                        .setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.HOVER)
                                        .setBackgroundColorForState('rgba(0,0,0,0.3)',Button.states.DOWN)
                                        .setPosition(200,262 + 32)
                                        .setWidth(220).setHeight(30)
                                        .on(Button.events.CLICKED,function(){
                                          window.open("https://github.com/piterwilson/squiggle-animation-tool", "_blank");
                                        }.bind(this));
            this.osButton.getBackgroundRectangle().setWidth(220).setHeight(30).setRoundedCorners(5);
            this.moreButton = new Button().setText("")
                                        .setBackgroundColorForState('rgba(0,0,0,0.05)',Button.states.NORMAL)
                                        .setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.HOVER)
                                        .setBackgroundColorForState('rgba(0,0,0,0.3)',Button.states.DOWN)
                                        .setPosition(110,325 + 32)
                                        .setWidth(332).setHeight(30).on(Button.events.CLICKED,function(){
                                          window.open("http://www.mrsquiggles.com/about", "_blank");
                                        }.bind(this));;
            this.moreButton.getBackgroundRectangle().setWidth(326).setHeight(30).setRoundedCorners(5);
            this.subviews.splice(1,0,this.moreButton);
            this.subviews.splice(1,0,this.osButton);
            this.closeButton = new Button().setText('x')
                            .setWidth(_s)
                            .setHeight(_s)
                            .setBackgroundColorForState(AppSettings.ButtonColorNormalRed,Button.states.NORMAL)
                            .setBackgroundColorForState(AppSettings.ButtonColorHoverRed,Button.states.HOVER)
                            .setBackgroundColorForState(AppSettings.ButtonColorDownRed,Button.states.DOWN)
                            .setFontColorForState('White',Button.states.NORMAL)
                            .setFontColorForState('White',Button.states.HOVER)
                            .setFontColorForState('White',Button.states.DOWN)
                            .setFontSize(40)
                            .on(Button.events.CLICKED,function(){
                              this.closeButton.jerkIt();
                              this.slideOut();
                            }.bind(this));
            this.closeButton.getBackgroundRectangle().setRoundedCorners(_s);
            this.closeButton.getWord().setStrokeWeight(_s/6).setPosition(25,25);
            this.addSubview(this.closeButton);
            this.userInteractionEnabled = true;
            this.onScreenResize();
            this.wave();
          },
          onScreenResize : function(){
            var ypos = AppSettings.UIMargin * 2;
            this.backgroundRectangle.setWidth(window.innerWidth).setHeight(window.innerHeight);
            for(var i = 0 ; i < this.lines.length; i++){
              this.lines[i].setPosition(AppSettings.UIMargin, ypos);
              ypos += this.lines[0].fontSize + AppSettings.UIMargin/2 ;
            }
            this.closeButton.setPosition(window.innerWidth - this.closeButton.width - AppSettings.UIMargin, AppSettings.UIMargin);
          },
          wave : function(){
            if(this.hidden) return;
            this.waving = true;
            this.lines[this.lineCounter].jerkIt();
            this.delay = this.lineCounter === this.lines.length - 1? 3000 : 150;
            this.lineCounter = this.lineCounter === this.lines.length - 1? 0 : this.lineCounter + 1;
            setTimeout(
              this.wave.bind(this),
              this.delay
            );
          },
          draw : function(){
            if(this.hidden) this.waving = false;
            View.prototype.draw.apply(this,arguments);
          },
          tweenTo:function(__y, callback){
            if(!this.doTween){
              if(this.tween){
                this.tween.stop();
              }
            }
            var coords = { y: this.y}, __self = this;
            this.doTween = true;
            this.tween = new TWEEN.Tween(coords)
                .to({ y: __y}, 250)
                .interpolation(TWEEN.Easing.Elastic.Out)
                .onUpdate(function() {
                  __self.y = this.y;
                })
                .onComplete(function(){
                  this.doTween = false;
                  if(callback){
                    callback()
                  }
                }.bind(this)).start();
            window.requestAnimationFrame(this.update.bind(this));
          },
          update : function(){
            if(this.doTween){
              TWEEN.update();
              window.requestAnimationFrame(this.update.bind(this));
            }
          },
          slideIn : function(){
            this.y = window.innerHeight;
            this.tweenTo(0, function(){
              this.waving = true;
            });
          },
          slideOut : function(){
            this.waving = false;
            this.tweenTo(window.innerHeight, function(){
              if(this.parent !== undefined) this.parent.removeSubview(this);
            }.bind(this));
          },
        });
        return AboutView;
    }
  );