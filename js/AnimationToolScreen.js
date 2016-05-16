define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
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
        saveAs = require("saveAs"),
        Word = squiggle.views.text.Word,
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
      
      instructionsWord : undefined,
      
      instructionsTimeout : undefined,
      
      ftu : true,
      
      /**
      * Setup function
      */
      setup : function(){
        this.backgroundColor = "#EBF8FF";
        // setup app colors and other app-wide settings
        AppSettings.ButtonHeight = 80;
        AppSettings.UIMargin = 40;
        // disabled button color
        AppSettings.ButtonColorDisabled = "#CCCCCC";
        AppSettings.DarkBlueColor = "rgba(65,189,253,0.75)";
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
        AppSettings.AnimationSize = {width:480,height:320};
        // max amount of frames allowed
        AppSettings.maxFrames = 50;
        
        // frames view
        this.framesView = new FramesView();
        this.framesView.delegate = this;
        this.addSubview(this.framesView);
        // frame capture
        this.captureView = new FrameCaptureView().setPosition((window.innerWidth/2) - (AppSettings.AnimationSize.width/2), (window.innerHeight/2) - (AppSettings.AnimationSize.height/2))
                                                 .setWidth(AppSettings.AnimationSize.width)
                                                 .setHeight(AppSettings.AnimationSize.height);
        this.addSubview(this.captureView);
        // frame counter view
        this.frameCounterView = new FrameCounterView();
        this.addSubview(this.frameCounterView);
        // create and add the dashboard
        this.dashBoardView = new DashboardView();
        this.dashBoardView.setDelegate(this);
        this.addSubview(this.dashBoardView);
        // instructions
        this.instructionsWord = new Word().setText('Squiggle here')
                                          .setFontSize(18)
                                          .setFontColor(AppSettings.ButtonColorDisabled)
                                          .centerOnWindow();
        this.showInstuctionsView();
        // setup the modal view for messages
        this.modalView = new ModalView();
        this.addSubview(this.modalView);
        // start animation
        var ff = new FrameModel();
        ff.on('change',function(){
          this.dashBoardView.setFtu(false);
          this.model.models[0].off('change');
        }.bind(this));
        this.model.add(ff);
        this.model.on('add remove',function(){
          this.__broadcastModelChange();
        }.bind(this));
        // add listeners
        this.addFrameIndexChangeListener(this.framesView, this.frameCounterView, this.dashBoardView);
        this.addModelChangelistener(this.framesView, this.frameCounterView, this.dashBoardView);
        this.__broadcastModelChange();
        this.__broadcastFrameIndexUpdate();
      },
      
      jerkItCallback : function(){
        this.instructionsTimeout = setTimeout(
          function(){
            this.instructionsWord.jerkIt();
            this.jerkItCallback();
          }.bind(this),
          3000
        );
      },
      
      hideInstructionsView : function(){
        this.instructionsWord.hidden = true;
        clearTimeout(this.instructionsTimeout);
      },
      
      showInstuctionsView : function(){
        this.addSubview(this.instructionsWord);
        this.instructionsWord.hidden = false;
        setTimeout(
          function(){
            this.instructionsWord.jerkIt();
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
      },
      
      /**
      *Broadcasts model change to the subscribed listeners
      */
      __broadcastModelChange : function(){
        _.each(this.__modelChangeListeners,function(listener){
          listener.onModelChange(this.model);
          this.captureView.frameRender = this.framesView.getCurrentFrameRender();
        }.bind(this));
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
          this.model.models.splice(this.currentFrameIndex + 1, 0, new FrameModel());
          this.model.trigger('add');
          this.setCurrentFrameIndex(this.currentFrameIndex+1);
          if(this.ftu){
            this.showInstuctionsView();
            this.ftu = false;
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
      },
      // PreviewView delegate methods
      onClosePreview : function(){
        this.previewView.stop();
        this.removeSubview(this.previewView);
        this.captureView.hidden = false;
      },
      onDownloadRequest : function(){
        this.onClosePreview();
        this.modalView.showProgress('Making a .gif');
        var renderer = new AnimationRenderView().setModel(this.model)
                                                .setWidth(AppSettings.AnimationSize.width)
                                                .setHeight(AppSettings.AnimationSize.height)
                                                .setWorkerScript('js/vendor/gif.worker.js')
                                                .setExportFrameDelay(100)
                                                .export(function(blob){
                                                  // open the animated gif on a new window
                                                  this.modalView.cancel();
                                                  saveAs(blob,'animation.gif');
                                                  //window.open(URL.createObjectURL(blob));
                                                }.bind(this));
      }
    });
    return AnimationToolScreen;
  }
);