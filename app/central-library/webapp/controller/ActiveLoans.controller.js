sap.ui.define(
    ["sap/ui/core/mvc/Controller"
  ],
    function (Controller ) {
      "use strict";
      return Controller.extend("com.app.centrallibrary.controller.ActiveLoans", {
        onInit: function () { },
        onCloseActiveLoans: function () {
            debugger
              // get router instance
              var oRouter = this.getOwnerComponent().getRouter();
            var userId = "yourUserIdValue"; // Replace "yourUserIdValue" with the actual user ID value
            oRouter.navTo("RouteAdmin", { userId: userId });
            },
      })
    })