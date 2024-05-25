sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.app.centrallibrary.controller.Authenticate", {
        onInit: function () {

        },
        onClearFilterPress: function () {
            this.byId("user").setValue("");
            this.byId("pwd").setValue("");
        },

    });
});
