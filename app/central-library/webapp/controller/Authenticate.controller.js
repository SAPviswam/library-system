// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.app.centrallibrary.controller.Authenticate", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, MessageToast) {
    "use strict";
    return Controller.extend("com.app.centrallibrary.controller.Authenticate", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
        },
        onClearFilterPress: function () {
            this.byId("user").setValue("");
            this.byId("pwd").setValue("");
        },
        onBtnClick: function () {
            var sUsername = this.byId("user").getValue();
            var sPassword = this.byId("pwd").getValue();
            if (sUsername && sPassword) {
                this._validateUser(sUsername, sPassword);
            } else {
                MessageToast.show("Please enter both username and password.");
            }
        },
        _validateUser: function (sUsername, sPassword) {
            var oModel = this.oModel;
            var oController = this;
            var aFilters = [
                new Filter("email", FilterOperator.EQ, sUsername),
                new Filter("password", FilterOperator.EQ, sPassword)
            ];
            // Create list binding for the /User entity set with the specified filters
            var oListBinding = oModel.bindList("/User", undefined, undefined, aFilters);
            oListBinding.requestContexts().then(function (aContexts) {
                if (aContexts.length > 0) {
                    var oUser = aContexts[0].getObject();
                    oController._navigateToRolePage(oUser.role);
                } else {
                    MessageToast.show("Invalid credentials. Please try again.");
                }
            }).catch(function (oError) {
                MessageToast.show("Error while validating credentials. Please try again later.");
                console.error("Error while validating user credentials:", oError);
            });
        },
        _navigateToRolePage: function (sRole) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (sRole === "Admin") {
                oRouter.navTo("RouteAdmin");
            } else if (sRole === "User") {
                oRouter.navTo("RouteUser");
            } else {
                MessageToast.show("Unknown user role. Please contact support.");
            }
        }
    });
});
