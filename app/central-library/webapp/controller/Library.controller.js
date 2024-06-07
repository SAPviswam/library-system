sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("com.app.centrallibrary.controller.Library", {
        onInit: function() {
        },
        onPressLogin: function () {
          debugger
            // get router instance
            var oRouter = this.getOwnerComponent().getRouter()
            // navigate to RouteAuthenticate
            oRouter.navTo("RouteAuthenticate");
          },
          onBtnSignup: function () {
            // get router instance
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // navigate to RouteSignup
            oRouter.navTo("RouteSignup");
          },
      });
    }
  );
  