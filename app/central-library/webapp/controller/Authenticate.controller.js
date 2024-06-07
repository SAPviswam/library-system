sap.ui.define(
  ["sap/ui/core/mvc/Controller", 
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"],
  function (Controller, MessageToast,Filter,FilterOperator) {
    "use strict";
    return Controller.extend("com.app.centrallibrary.controller.Authenticate", {
      onInit: function () { },
    
      onBtnClick: function () {
        debugger
        var oView = this.getView();
        var sUserID = oView.byId("user").getValue();
        var sPassword = oView.byId("pwd").getValue();

        if (!sUserID || !sPassword) {
          MessageToast.show("please enter valid Credentials");
          return;
        }

        var oModel = this.getView().getModel();
        var oBinding = oModel.bindList("/User");

        oBinding.filter([
          new Filter("email", FilterOperator.EQ, sUserID),
          new Filter("password", FilterOperator.EQ, sPassword),
        ]);

        oBinding
          .requestContexts()
          .then(
            function (aContexts) {
              //requestContexts is called to get the contexts (matching records) from the backend.
              if (aContexts.length > 0) {
                var ID = aContexts[0].getObject().ID;
                var userType = aContexts[0].getObject().role;
                var oRouter = this.getOwnerComponent().getRouter();
                if (userType === "Admin") {
                  MessageToast.show("Login Successful");
                  oRouter.navTo("RouteAdmin", { userId: ID });
                } else {
                  MessageToast.show("Login Successful");
                  var oRouter = this.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteUser", { userId: ID });
                }
                oView.byId("user").setValue("");
                oView.byId("pwd").setValue("");
              } else {
                MessageToast.show("Invalid username or password.");
              }
            }.bind(this)
          )
          .catch(function () {
            MessageToast.show("An error occurred during login.");
          });
      },

      onClearFilterPress: function () {
        this.byId("user").setValue("");
        this.byId("pwd").setValue("");
      },
    });
  }
);
