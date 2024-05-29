sap.ui.define(["sap/ui/core/mvc/Controller"], function (BaseController) {
  "use strict";

  return BaseController.extend("com.app.centrallibrary.controller.Signup", {
    onInit: function () {},
    onSignCancel: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteLibrary");
    },
    onSignClear: function () {
    this.byId("userTypeInput").setValue("");
    this.byId("idInput").setValue("");
    this.byId("emailInput").setValue("");
    this.byId("passwordInput").setValue("");
    this.byId("confirmPasswordInput").setValue("");
    },
  });
});
