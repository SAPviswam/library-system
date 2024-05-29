
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel",
  "sap/m/MessageToast",
], function (Controller, JSONModel, ResourceModel, MessageToast) {
  "use strict";

  return Controller.extend("com.app.centrallibrary.controller.User", {
    // onInit: function() {
    //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    //     oRouter.getRoute("RouteUser").attachMatched(this._onRouteMatched, this);
    // },
    // _onRouteMatched: function(oEvent) {
    //     var {userID} = oEvent.getParameter("arguments");
    //     var sUsername = oArgs.username;
    //     var oViewModel = new JSONModel({
    //         username: sUsername
    //     });
    //     this.getView().setModel(oViewModel, "viewModel");
    //     //  Fetch the username from the model and set it to the view
    //   // var oViewModel = this.getView().getModel("viewModel");
    //   // if (oViewModel) {
    //   //     oViewModel.setProperty("/username", sUsername);
    //   // } else {
    //   //     oViewModel = new JSONModel({
    //   //         username: sUsername
    //   //     });
    //   //     this.getView().setModel(oViewModel, "viewModel");
    //   // }
    // },
    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
    },
    onCurrentUserDetails: function (oEvent) {
      const { userId } = oEvent.getParameter("arguments");
      this.ID = userId;
      const sRouterName = oEvent.getParameter("name");
      const oForm = this.getView().byId("_IDGenPage1");
      oForm.bindElement(`/User(${userId})`, {
        expand: ''
      });
    },
    // onPressUserProfile: function () {
    //   this.loadProfileDialog().then(function (oDialog) {
    //     oDialog.open();
    //   });
    // },

    onPressUserProfile: function () {
      this.loadProfileDialog().then(function (oDialog) {
          // Bind user data to dialog
          var oViewModel = this.getView().getModel();
          oDialog.setModel(oViewModel);
          oDialog.bindElement(`/User(${this.ID})`); // Assuming ID is the user ID stored in the controller
          oDialog.open();
      }.bind(this));
  },

    loadProfileDialog: async function () {
      if (!this.oDialogProfile) {
        this.oDialogProfile = await this.loadFragment({
          name: "com.app.centrallibrary.fragments.Userdetails"
        });
      }
      return this.oDialogProfile;
    },


    onSearch: function (oEvent) {
      // Get the search query
      var sQuery = oEvent.getParameter("query");

      // Build filters based on the search query
      var aFilters = [];
      if (sQuery) {
        aFilters.push(new sap.ui.model.Filter({
          filters: [
            new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("author", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("genre", sap.ui.model.FilterOperator.Contains, sQuery)
          ],
          and: false
        }));
      }

      // Get the table and binding
      var oTable = this.byId("bookDetailsTable");
      var oBinding = oTable.getBinding("items");

      // Apply the filters to the binding
      oBinding.filter(aFilters);
    },

    onCloseProfileDialog: function () {
      if (this.oDialogProfile) {
        this.oDialogProfile.close();
      }
    },

    onReserveBook: function () {
      sap.m.MessageToast.show("Your request was sended to the Admin");
    }
  });
});
