define(
  function(require, exports, module) {
    var squiggle = require("squiggle"),
        DashboardView = require("views/ui/DashboardView"),
        Screen = squiggle.views.screens.Screen,
        AnimationModel = squiggle.models.Animation,
        RectangleView = squiggle.views.primitives.Rectangle,
        AppSettings = squiggle.models.AppSettings,
        ModalView = require("views/modal/ModalView"),
        AnimationToolScreen = Screen.extend({
      /**
      * Animation tool options
      */
      options : {
        width : 400,
        height : 300
      },
      /**
      * Master Animation model
      */
      model : new AnimationModel(),
      
      /**
      * Dashboard view contains play/pause button, add/remove frame buttons
      */
      dashBoardView : undefined,
      
      /**
      * A modal view 
      */
      modalView : undefined,
      
      /**
      * Setup function
      */
      setup : function(){
        // setup app colors and other app-wide settings
        AppSettings.ButtonHeight = 80;
        AppSettings.UIMargin = 40;
        // disabled button color
        AppSettings.ButtonColorDisabled = "#CCCCCC";
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
        // create and add the dashboard
        this.dashBoardView = new DashboardView();
        this.dashBoardView.setPosition(window.innerWidth/2 - this.dashBoardView.width/2, window.innerHeight - 120).setDelegate(this);
        this.addSubview(this.dashBoardView);
        // setup the modal view for messages
        this.modalView = new ModalView();
        this.addSubview(this.modalView);
        this.modalView.showMessage("test","yes","no",function(){
          console.log('test');
          this.modalView.showMessage("test","yes");
        }.bind(this));
        
      },
      onPlayPressed : function(){
        
      }
    });
    return AnimationToolScreen;
  }
);