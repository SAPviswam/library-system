
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("com.app.centrallibrary.controller.User", {

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

    onPressUserProfile: function () {
      this.loadProfileDialog().then(function (oDialog) {
        // Bind user data to dialog
        var oViewModel = this.getView().getModel();
        oDialog.setModel(oViewModel);
        oDialog.bindElement({
          path: `/User(${this.ID})`,
          parameters: {
            expand: 'loans' // Ensure the loans data is expanded
          }
        });
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


    onReserveBook: async function () {
      debugger;
      const oView = this.getView();
      var userId = this.ID;
      var oTable = this.getView().byId("bookDetailsTable");
      var oSelectedItems = oTable.getSelectedItems();

      // Check if no book is selected
      if (oSelectedItems.length === 0) {
        MessageToast.show("Please select a book to reserve");
        return;
      }

      // Check if more than one book is selected
      if (oSelectedItems.length > 1) {
        MessageToast.show("Please select only one book to reserve");
        return;
      }

      var oSelected = oSelectedItems[0];
      var oAvailStock = oSelected.getBindingContext().getObject().availableQuantity;

      if (oSelected) {
        var oAvailStock = oSelected.getBindingContext().getObject().availableQuantity,
          oBookName = oSelected.getBindingContext().getObject().title,
          oISBN = oSelected.getBindingContext().getObject().ISBN,
          oavailableQty = oSelected.getBindingContext().getObject().availableQuantity,
          oCurrentDate = new Date();
        let day = oCurrentDate.getDate(),
          month = oCurrentDate.getMonth() + 1,
          year = oCurrentDate.getFullYear();
        let currentDate = `${day}-${month}-${year}`;

        if (parseInt(oAvailStock) > 0) {
          const oBinding = oView.getModel().bindList("/Issuebooks");
          oBinding.create({
            ISBNno: oISBN,
            users: userId,
            titles: oBookName,
            reservedDate: currentDate,
            AvailableQuantity: oavailableQty

          });

          MessageToast.show("Reservation Sent to Admin");
        } else {
          MessageToast.show("Book is available; you don't need to reserve");
        }
      }
    },

   
    
  });
});
