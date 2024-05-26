sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.app.centrallibrary.controller.Admin", {
        onInit: function () {
            // Initialization logic if any
        },
        
        onPressback: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteAuthenticate");
        },

        onPressFullScreen: function () {
            var oView = this.getView();
            var oPage = oView.byId("idAdminVBox");

            if (oPage.hasStyleClass("fullscreen")) {
                oPage.removeStyleClass("fullscreen");
            } else {
                oPage.addStyleClass("fullscreen");
            }
        },

        onPressNotification: function () {
            // Handle notification button press
        },

        onPressProfile: function () {
            // Handle profile button press
        },

        onPressAdd: function () {
            // Handle add button press
        },

        onPressDelete: function () {
            // Handle delete button press
        },

        onPressEdit: function () {
            // Handle edit button press
        },

        onSelectBook: function (oEvent) {
            // Handle book selection
        }
    });
});
