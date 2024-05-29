
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel"
], function(Controller, JSONModel, ResourceModel) {
  "use strict";

  return Controller.extend("com.app.centrallibrary.controller.User", {
    onInit: function() {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("RouteUser").attachMatched(this._onRouteMatched, this);
  },
  _onRouteMatched: function(oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      var sUsername = oArgs.username;
      var oViewModel = new JSONModel({
          username: sUsername
      });
      this.getView().setModel(oViewModel, "viewModel");
      //  Fetch the username from the model and set it to the view
    // var oViewModel = this.getView().getModel("viewModel");
    // if (oViewModel) {
    //     oViewModel.setProperty("/username", sUsername);
    // } else {
    //     oViewModel = new JSONModel({
    //         username: sUsername
    //     });
    //     this.getView().setModel(oViewModel, "viewModel");
    // }
  },

    onSearch: function(oEvent) {
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
    }
  });
});
