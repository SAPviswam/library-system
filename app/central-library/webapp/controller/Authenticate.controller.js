sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast","sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"],
  function (Controller, MessageToast,Filter,FilterOperator) {
    "use strict";
    return Controller.extend("com.app.centrallibrary.controller.Authenticate", {
      onInit: function () { },
      // onBtnClick: function () {
      //   var sUsername = this.byId("user").getValue();
      //   var sPassword = this.byId("pwd").getValue();
      //   if (sUsername && sPassword) {
      //     this._validateUser(sUsername, sPassword);
      //   } else {
      //     MessageToast.show("Please enter both username and password.");
      //   }
      // },
      // _validateUser: function (sUsername, sPassword) {
      //   var oModel = this.getOwnerComponent().getModel();
      //   var oController = this;
      //   var aFilters = [
      //     new sap.ui.model.Filter(
      //       "email",
      //       sap.ui.model.FilterOperator.EQ,
      //       sUsername
      //     ),
      //     new sap.ui.model.Filter(
      //       "password",
      //       sap.ui.model.FilterOperator.EQ,
      //       sPassword
      //     ),
      //   ];
      //   // Create list binding for the /User entity set with the specified filters
      //   var oListBinding = oModel.bindList(
      //     "/User",
      //     undefined,
      //     undefined,
      //     aFilters
      //   );
      //   oListBinding
      //     .requestContexts()
      //     .then(function (aContexts) {
      //       if (aContexts.length > 0) {
      //         var oUser = aContexts[0].getObject();
      //         oController._navigateToRolePage(oUser.role, sUsername);
      //       } else {
      //         MessageToast.show("Invalid credentials. Please try again.");
      //       }
      //     })
      //     .catch(function (oError) {
      //       MessageToast.show(
      //         "Error while validating credentials. Please try again later."
      //       );
      //       console.error("Error while validating user credentials:", oError);
      //     });
      // },
      // _navigateToRolePage: function (sRole, sUsername) {
      //   debugger;
      //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //   if (sRole === "Admin") {
      //     oRouter.navTo("RouteAdmin");
      //   } else if (sRole === "User") {
      //     oRouter.navTo("RouteUser", {
      //       username: sUsername,
      //     });
      //   } else {
      //     MessageToast.show("Unknown user role. Please contact support.");
      //   }
      // },

      onBtnClick: function () {
        debugger
        var oView = this.getView();
        var sUserID = oView.byId("user").getValue();
        var sPassword = oView.byId("pwd").getValue();

        if (!sUserID || !sPassword) {
          MessageToast.show("please enter required Credentials");
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
              debugger;
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
