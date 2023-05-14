define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        _ = require("underscore"),
        DashboardView = require("views/ui/DashboardView"),
        Screen = squiggle.views.screens.Screen,
        AnimationModel = squiggle.models.Animation,
        FrameModel = squiggle.models.Frame,
        RectangleView = squiggle.views.primitives.Rectangle,
        AppSettings = squiggle.models.AppSettings,
        ModalView = require("views/modal/ModalView"),
        FramesView = require("views/FramesView"),
        FrameCounterView = require("views/FrameCounterView"),
        PreviewView = require("views/PreviewView"),
        AnimationRenderView = squiggle.views.animation.AnimationRender,
        FrameCaptureView = squiggle.views.animation.FrameCapture,
        FrameRenderView = squiggle.views.animation.FrameRender,
        saveAs = require("saveAs"),
        Word = squiggle.views.text.Word,
        CookieUtils = require("utils/CookieUtils"),
        Button = squiggle.views.ui.Button,
        AnimationToolScreen = Screen.extend({
      
      /**
      * Array of Objects that will listen for onModelChange()
      */
      __modelChangeListeners : [],
      /**
      * Array of Objects that will listen for onFrameIndexChange()
      */
      __frameIndexListeners : [],
      /**
      * Current frame index
      */
      currentFrameIndex : 0,
      
      /**
      * Master Animation model
      */
      model : new AnimationModel(),
      
      /**
      * A FrameCapture instance to draw on
      */
      captureView : undefined,
      
      /**
      * Dashboard view contains play/pause button, add/remove frame buttons
      */
      dashBoardView : undefined,
      
      /**
      * View at the top that displays the current frame numebr
      */
      frameCounterView : undefined,
      
      /**
      * A modal view 
      */
      modalView : undefined,
      
      /**
      * View that shows the frames being drawn
      */
      framesView : undefined,
      
      /**
      * A View for the animation Preview
      */
      previewView : undefined,
      
      /**
      * A Word instance with instructions for the user
      */
      instructionsWord : undefined,
      
      /**
      * A Timeout to jerkIt() with the instructions word
      */
      instructionsTimeout : undefined,
      
      /**
      * A view that shows a guide with the contents of the previous frame
      */
      onionSkinView : undefined,
      
      /**
      * first time use flag
      */
      ftu : true,
      
      /**
      * Setup function
      */
      setup : function(){
        
        // background
        this.backgroundColor = "#EBF8FF";
        // setup app colors and other app-wide settings
        AppSettings.ButtonHeight = 60;
        AppSettings.UIMargin = 20;
        // disabled button color
        AppSettings.ButtonColorDisabled = "#CCCCCC";
        AppSettings.DarkBlueColor = "rgba(65,189,253,0.85)";
        // blue buttons
        AppSettings.ButtonColorNormalBlue = "#41BDFD";
        AppSettings.ButtonColorHoverBlue = "#50A9D9";
        AppSettings.ButtonColorDownBlue = "#285269";
        // red buttons
        AppSettings.ButtonColorNormalRed = "#FD4141";
        AppSettings.ButtonColorHoverRed = "#D95050";
        AppSettings.ButtonColorDownRed = "#582323";
        // green buttons
        AppSettings.ButtonColorNormalGreen = "#41FD72";
        AppSettings.ButtonColorHoverGreen = "#50D974";
        AppSettings.ButtonColorDownGreen = "#2A703C";
        // size for the animation frames
        var size = this.getAnimationSize(window.innerWidth, window.innerHeight);
        console.log(size);
        AppSettings.AnimationSize = {
          width: size.width,
          height: size.height
        };
        // max amount of frames allowed
        AppSettings.maxFrames = 50;
        
        // frames view
        this.framesView = new FramesView();
        this.framesView.delegate = this;
        this.addSubview(this.framesView);
        // onion skin
        this.onionSkinView = new FrameRenderView()
                                                 .setWidth(AppSettings.AnimationSize.width)
                                                 .setHeight(AppSettings.AnimationSize.height)
                                                 .setStrokeColor('rgba(65,189,253,0.5)')
                                                 .setStrokeWeight(4)
                                                 .setOverrideLineStrokeProperties(true);
        this.addSubview(this.onionSkinView);
        
        // frame capture
        this.captureView = new FrameCaptureView()
                                                 .setWidth(AppSettings.AnimationSize.width)
                                                 .setHeight(AppSettings.AnimationSize.height);
        this.addSubview(this.captureView);
        // frame counter view
        this.frameCounterView = new FrameCounterView();
        this.addSubview(this.frameCounterView);
        // create and add the dashboard
        this.dashBoardView = new DashboardView();
        this.dashBoardView.hideAllButtons = true;
        this.dashBoardView.setDelegate(this);
        this.addSubview(this.dashBoardView);
        // instructions
        this.instructionsWord = new Word().setText('Squiggle here')
                                          .setFontSize(18)
                                          .setFontColor(AppSettings.ButtonColorDisabled)
                                          .setDefaultJerkinessBumpIncrease(0.5)
                                          .centerOnWindow();
                                          
        this.showInstuctionsView();
        // setup the modal view for messages
        this.modalView = new ModalView();
        this.addSubview(this.modalView);
        // read ftu cookie
        var ftucookie = CookieUtils.getCookie('ftu');
        if(ftucookie === undefined){
          this.ftu = true;
          this.dashBoardView.ftu = true;
          this.frameCounterView.ftu = true;
        }else{
          this.ftu = false;
          this.dashBoardView.ftu = false;
          this.frameCounterView.ftu = false;
          this.removeSubview(this.instructionsWord);
          this.instructionsWord = undefined;
        }
        // start animation
        var ff = new FrameModel();
        if(this.ftu){
          ff.on('change',function(){
            this.model.models[0].off('change');
            this.dashBoardView.showAddFrameButton = true;
            this.dashBoardView.showPreviewButton = false;
            this.dashBoardView.evaluateButtonsVisibility();
            window.clean = false;
          }.bind(this));
        }else{
          ff.on('change',function(){
            window.clean = false;
          }.bind(this));
        }
        this.model.add(ff);
        this.model.on('add remove',function(){
          this.__broadcastModelChange();
        }.bind(this));
        // add listeners
        this.addFrameIndexChangeListener(
          this.framesView, 
          this.frameCounterView, 
          this.dashBoardView
        );
        this.addModelChangelistener(
          this.framesView, 
          this.frameCounterView, 
          this.dashBoardView
        );
        this.__broadcastModelChange();
        this.__broadcastFrameIndexUpdate();
    
        this.windowResized();
        window.clean = true;
      },
      
      windowResized : function(){
        Screen.prototype.windowResized.apply(this,arguments);
        this.captureView.setPosition((window.innerWidth/2) - (AppSettings.AnimationSize.width/2), (window.innerHeight/2) - (AppSettings.AnimationSize.height/2));
        this.onionSkinView.setPosition((window.innerWidth/2) - (AppSettings.AnimationSize.width/2), (window.innerHeight/2) - (AppSettings.AnimationSize.height/2));
        if(this.instructionsWord) this.instructionsWord.centerOnWindow();
      },

      getAnimationSize: function(screenWidth, screenHeight) {
        var screenSize = { width: screenWidth, height: screenHeight };
        var isLandscape = screenWidth > screenHeight;
        var sizesLandscape = [
          { width: 800, height: 600 },
          { width: 640, height: 480 },
          { width: 320, height: 240 }
        ];
        var sizesPortrait = [
          { width: 600, height: 800 },
          { width: 240, height: 320 },
          { width: 480, height: 640 }
        ];
        if (isLandscape) {
          sizes = sizesLandscape;
        }
        else {
          sizes = sizesPortrait;
        }
        var found = true;
        var i = 0;
        var size = sizes[i];
        do {
          if (size.width > screenSize.width || size.height > screen.height) {
            i += 1;
            size = sizes[i];
          }
          else {
            found = false;
          }
        } while (found)
        return size;
      },
      
      jerkItCallback : function(){
        if(!this.instructionsWord) return;
        this.instructionsTimeout = setTimeout(
          function(){
            if(this.instructionsWord) this.instructionsWord.jerkIt();
            this.jerkItCallback();
          }.bind(this),
          3000
        );
      },
      
      hideInstructionsView : function(){
        if(this.instructionsWord) this.instructionsWord.hidden = true;
        clearTimeout(this.instructionsTimeout);
      },
      
      showInstuctionsView : function(){
        this.addSubview(this.instructionsWord);
        this.instructionsWord.hidden = false;
        setTimeout(
          function(){
            if(this.instructionsWord) this.instructionsWord.jerkIt();
            this.jerkItCallback();
          }.bind(this),
          1000
        );
      },
      
      mouseDragged : function(){
        Screen.prototype.mouseDragged.apply(this,arguments);
        if(this.captureView.isMouseInBounds()){
          this.hideInstructionsView();
        }
      },

      touchMoved: function() {
        Screen.prototype.mouseDragged.apply(this,arguments);
        if(this.captureView.isMouseInBounds()){
          this.hideInstructionsView();
        }
      },
      
      keyPressed : function(){
        this.dashBoardView.keyPressed();
      },
      
      setCurrentFrameIndex : function(num){
        this.currentFrameIndex = num;
        this.__broadcastFrameIndexUpdate();
      },
      
      addFrameIndexChangeListener : function(){
        _.each(arguments, function(listener){
          this.__frameIndexListeners.push(listener);
        }.bind(this));
      },
      
      addModelChangelistener :function(){
        _.each(arguments, function(listener){
          this.__modelChangeListeners.push(listener);
        }.bind(this));
      },
      
      /**
      *Broadcasts frame index updates to the subscribed listeners
      */
      __broadcastFrameIndexUpdate : function(){
        _.each(this.__frameIndexListeners,function(listener){
          listener.onFrameIndexUpdate(this.currentFrameIndex);
        }.bind(this));
        this.onionSkinView.hidden = true;
      },
      
      /**
      *Broadcasts model change to the subscribed listeners
      */
      __broadcastModelChange : function(){
        _.each(this.__modelChangeListeners,function(listener){
          listener.onModelChange(this.model);
          window.clean = false;
        }.bind(this));
        this.captureView.frameRender = this.framesView.getCurrentFrameRender();
      },
      
      // DashboardView delegate methods
      onPlayPressed : function(){
        if(this.previewView === undefined) this.previewView = new PreviewView();
        this.previewView.delegate = this;
        this.previewView.start(this.model);
        this.addSubview(this.previewView);
        this.captureView.hidden = true;
      },
      onAddFramePressed: function(){
        if(this.model.models.length < AppSettings.maxFrames){
          var f = new FrameModel()
          this.model.models.splice(this.currentFrameIndex + 1, 0, f);
          this.model.trigger('add');
          this.setCurrentFrameIndex(this.currentFrameIndex+1);
          if(this.ftu){
            this.dashBoardView.showAddFrameButton = false;
            this.dashBoardView.evaluateButtonsVisibility();
            f.on('change',function(){
              f.off('change');
              this.dashBoardView.showPreviewButton = true;
              this.dashBoardView.evaluateButtonsVisibility();
            }.bind(this));
          }else{
            f.on('change',function(){
              f.off('change');
              window.clean = false;
            }.bind(this));
          }
        }
      },

      onRemoveFramePressed: function(){
        if(this.model.models.length > 1){
          this.modalView.showMessage("delete frame?","yes","no",function(){
            this.model.models.splice(this.currentFrameIndex, 1);
            this.model.trigger('remove');
            if(this.currentFrameIndex !== 0){
              this.setCurrentFrameIndex(this.currentFrameIndex-1);
            }else{
              this.setCurrentFrameIndex(0);
            }
          }.bind(this));
        }
      },

      onNextFramePressed : function(){
        if(this.currentFrameIndex < this.model.models.length - 1) this.setCurrentFrameIndex(this.currentFrameIndex + 1);
      },

      onPreviousFramePressed : function(){
        if(this.currentFrameIndex > 0) this.setCurrentFrameIndex(this.currentFrameIndex - 1);
      },

      onFrameTransitionComplete : function(){
        this.captureView.model = this.model.models[this.currentFrameIndex];
        if(this.currentFrameIndex > 0){
          this.onionSkinView.hidden = false;
          this.onionSkinView.model = this.model.models[this.currentFrameIndex-1];
        }
        if(this.ftu && this.currentFrameIndex !== 0){
          this.showInstuctionsView();
          this.ftu = false;
          CookieUtils.setCookie('ftu',false,365);
        }
      },

      // PreviewView delegate methods
      onClosePreview : function(){
        this.previewView.stop();
        this.removeSubview(this.previewView);
        this.captureView.hidden = false;
        this.removeSubview(this.instructionsWord);
        this.instructionsWord = undefined;
        this.dashBoardView.ftu = false;
        this.dashBoardView.evaluateButtonsVisibility();
      },

      onDownloadRequest : function(){
        this.onClosePreview();
        this.modalView.showProgress('Making a .gif');
        var renderer = new AnimationRenderView().setModel(this.model)
                                                .setWidth(AppSettings.AnimationSize.width*window.devicePixelRatio)
                                                .setHeight(AppSettings.AnimationSize.height*window.devicePixelRatio)
                                                .setWorkerScript('js/vendor/gif.worker.js')
                                                .setExportFrameDelay(100)
                                                .export(function(blob){
                                                  // open the animated gif on a new window
                                                  this.modalView.cancel();
                                                  saveAs(blob,'animation.gif');
                                                  //window.open(URL.createObjectURL(blob));
                                                }.bind(this));
        window.clean = true;
      }
    });
    return AnimationToolScreen;
  }
);
