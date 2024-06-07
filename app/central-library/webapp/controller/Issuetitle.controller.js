

sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  function (Controller) {
    "use strict";
    return Controller.extend("com.app.centrallibrary.controller.Issuetitle", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("RouteIssuetitle").attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function () {
        this.getView().getModel().refresh(true);
      },

      onCloseIssuetitle: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        var userId = "yourUserIdValue"; // Replace with the actual user ID value
        oRouter.navTo("RouteAdmin", { userId: userId });
      }
    });
  }
);
