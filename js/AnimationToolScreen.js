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
        saveAs = require("saveAs"),
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
        // create and add the dashboard
        this.dashBoardView = new DashboardView();
        this.dashBoardView.setPosition(window.innerWidth/2 - this.dashBoardView.width/2, window.innerHeight - 120).setDelegate(this);
        this.addSubview(this.dashBoardView);
        // frames view
        this.framesView = new FramesView();
        this.addSubview(this.framesView);
        // frame counter view
        this.frameCounterView = new FrameCounterView();
        this.addSubview(this.frameCounterView);
        // setup the modal view for messages
        this.modalView = new ModalView();
        this.addSubview(this.modalView);
        // start animation
        this.model.add(new FrameModel()).on('add remove',function(){
          this.__broadcastModelChange();
        }.bind(this));
        // add listeners
        this.addFrameIndexChangeListener(this.framesView, this.frameCounterView);
        this.addModelChangelistener(this.framesView, this.frameCounterView, this.dashBoardView);
        this.__broadcastModelChange();
        this.__broadcastFrameIndexUpdate();
        
      },
      
      keyPressed : function(){
        if (this.sketch.keyCode === this.sketch.LEFT_ARROW) {
          if(this.currentFrameIndex > 0) this.setCurrentFrameIndex(this.currentFrameIndex - 1);
        } else if (this.sketch.keyCode === this.sketch.RIGHT_ARROW) {
          if(this.currentFrameIndex < this.model.models.length - 1) this.setCurrentFrameIndex(this.currentFrameIndex + 1);
        }
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
        }.bind(this));
      },
      
      // DashboardView delegate methods
      onPlayPressed : function(){
        if(this.previewView === undefined) this.previewView = new PreviewView();
        this.previewView.delegate = this;
        this.previewView.start(this.model);
        this.addSubview(this.previewView);
      },
      onAddFramePressed: function(){
        if(this.model.models.length < AppSettings.maxFrames){
          //this.model.add(new FrameModel());
          
          //test
          var f = new FrameModel();
          var l;
          for(var i=0;i<10;i++){
            l = new squiggle.models.Line();
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            f.addLine(l);
            l = new squiggle.models.Line();
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            l.addPoint(Math.random() * AppSettings.AnimationSize.width, Math.random() * AppSettings.AnimationSize.height);
            f.addLine(l);
          }
          this.model.add(f);
          
          this.setCurrentFrameIndex(this.currentFrameIndex+1);
        }
      },
      onRemoveFramePressed: function(){
        if(this.model.models.length > 1){
          this.modalView.showMessage("delete frame?","yes","no",function(){
            this.model.remove(this.model.models[this.currentFrameIndex]);
            if(this.currentFrameIndex !== 0){
              this.setCurrentFrameIndex(this.currentFrameIndex-1);
            }else{
              this.setCurrentFrameIndex(0);
            }
            
          }.bind(this));
        }
      },
      // PreviewView delegate methods
      onClosePreview : function(){
        this.previewView.stop();
        this.removeSubview(this.previewView);
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