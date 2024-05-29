

// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/core/Fragment",
//     "sap/ui/core/UIComponent",
//     "sap/ui/core/routing/History",
//     "sap/m/MessageToast"
// ], function (Controller, JSONModel, Fragment, UIComponent, History, MessageToast) {
//     "use strict";

//     return Controller.extend("com.app.centrallibrary.controller.Admin", {
//         onInit: function () {
//             var oBookModel = new JSONModel({
//                 Book: []
//             });
//             this.getView().setModel(oBookModel, "bookModel");

//             this._loadCSVData();
//         },

//         _loadCSVData: function () {
//             var oModel = this.getView().getModel("bookModel");

//         //     jQuery.ajax({
//         //         url: "model/books.csv",
//         //         dataType: "text",
//         //         success: function (data) {
//         //             var parsedData = Papa.parse(data, {
//         //                 header: true,
//         //                 dynamicTyping: true
//         //             });

//         //             if (parsedData.errors.length === 0) {
//         //                 oModel.setProperty("/Book", parsedData.data);
//         //             } else {
//         //                 MessageToast.show("Error parsing CSV file");
//         //             }
//         //         },
//             // });
//         },

//         onPressback: function () {
//             var oRouter = UIComponent.getRouterFor(this);
//             oRouter.navTo("RouteAuthenticate");
//         },

//         onPressFullScreen: function () {
//             var oView = this.getView();
//             var oPage = oView.byId("idAdminVBox");

//             if (oPage.hasStyleClass("fullscreen")) {
//                 oPage.removeStyleClass("fullscreen");
//             } else {
//                 oPage.addStyleClass("fullscreen");
//             }
//         },

//         onPressNotification: function () {
//             // Handle notification button press
//         },

//         onPressProfile: function () {
//             // Handle profile button press
//         },

//         async onPressAdd(){
//             this.oDialogAdd ??= await this.loadFragment({
//                 name: "com.app.centrallibrary.fragments.Adddata"
//             });

//             this.oDialogAdd.open();
//         },


//         onAddNewBook: function () {
//             var oView = this.getView();

//             // Capture the input values
//             var sISBN = oView.byId("ISBNInput").getValue();
//             var sTitle = oView.byId("BookInput").getValue();
//             var sAuthor = oView.byId("AuthorInput").getValue();
//             var sQuantity = oView.byId("quantityInput").getValue();
//             var sGenre = oView.byId("genreInput").getValue();

//             // // Create a new book object
//             var oNewBook = {
//                 ISBN: sISBN,
//                 title: sTitle,
//                 author: sAuthor,
//                 quantity: sQuantity,
//                 genre: sGenre
//             };

//             // new v4
//                 var oContext = this.getView().byId("idBookTable").getBinding("items")
//                 .create(oNewBook);
//             // Close the dialog
//             this.oDialogAdd.close();
//         },

//         onCancel: function(){
//             this.oDialogAdd.close();
//         },

//         onPressDelete : async function(){
 
//             var oSelected = this.byId("idBookTable").getSelectedItem();
//             if (oSelected) {
//                 var oISBN = oSelected.getBindingContext().getObject().isbn;
     
//                 oSelected.getBindingContext().delete("$auto").then(function () {
//                     sap.m.MessageToast.show(" SuccessFully Deleted");
//                 },
//                     function (oError) {
//                         sap.m.MessageToast.show("Deletion Error: ", oError);
//                     });
//                 this.getView().byId("idBooksTable").getBinding("items").refresh();
     
//             } else {
//                 sap.m.MessageToast.show("Please Select a Row to Delete");
//             }
//         },
        
        
//         onPressEdit: function () {
//             // Handle edit button press
//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Fragment, UIComponent, History, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.app.centrallibrary.controller.Admin", {
        onInit: function () {
            var oBookModel = new JSONModel({
                Book: [],
                searchValue: ""
            });
            this.getView().setModel(oBookModel, "bookModel");

            this._loadCSVData();
        },

        _loadCSVData: function () {
            var oModel = this.getView().getModel("bookModel");

            jQuery.ajax({
                url: "model/books.csv",
                dataType: "text",
                success: function (data) {
                    var parsedData = Papa.parse(data, {
                        header: true,
                        dynamicTyping: true
                    });

                    if (parsedData.errors.length === 0) {
                        oModel.setProperty("/Book", parsedData.data);
                    } else {
                        MessageToast.show("Error parsing CSV file");
                    }
                }
            });
        },

        onPressback: function () {
            var oRouter = UIComponent.getRouterFor(this);
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

        async onPressAdd(){
            this.oDialogAdd ??= await this.loadFragment({
                name: "com.app.centrallibrary.fragments.Adddata"
            });

            this.oDialogAdd.open();
        },

        onAddNewBook: function () {
            var oView = this.getView();

            // Capture the input values
            var sISBN = oView.byId("ISBNInput").getValue();
            var sTitle = oView.byId("BookInput").getValue();
            var sAuthor = oView.byId("AuthorInput").getValue();
            var sQuantity = oView.byId("quantityInput").getValue();
            var sGenre = oView.byId("genreInput").getValue();

            // // Create a new book object
            var oNewBook = {
                ISBN: sISBN,
                title: sTitle,
                author: sAuthor,
                quantity: sQuantity,
                genre: sGenre
            };

            // new v4
            var oContext = this.getView().byId("idBookTable").getBinding("items")
                .create(oNewBook);
            // Close the dialog
            this.oDialogAdd.close();
        },

        onCancel: function(){
            this.oDialogAdd.close();
        },

        onPressDelete: async function() {
            var oSelected = this.byId("idBookTable").getSelectedItem();
            if (oSelected) {
                var oISBN = oSelected.getBindingContext().getObject().isbn;

                oSelected.getBindingContext().delete("$auto").then(function () {
                    sap.m.MessageToast.show(" Successfully Deleted");
                },
                function (oError) {
                    sap.m.MessageToast.show("Deletion Error: ", oError);
                });
                this.getView().byId("idBooksTable").getBinding("items").refresh();

            } else {
                sap.m.MessageToast.show("Please Select a Row to Delete");
            }
        },

        onPressEdit: function () {
            // Handle edit button press
        },

        onSearch: function (oEvent) {
            // Get the search value
            var sQuery = oEvent.getParameter("query");
            if (!sQuery) {
                sQuery = this.getView().getModel("bookModel").getProperty("/searchValue");
            }

            // Create a filter for each searchable field
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                var oFilter1 = new Filter("title", FilterOperator.Contains, sQuery);
                var oFilter2 = new Filter("author", FilterOperator.Contains, sQuery);
                var oFilter3 = new Filter("genre", FilterOperator.Contains, sQuery);
                aFilters.push(new Filter({
                    filters: [oFilter1, oFilter2, oFilter3],
                    and: false
                }));
            }

            // Get the binding for the table and apply the filters
            var oTable = this.byId("idBookTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },
       
        async onPressActiveloans(){
            this.oDialogLoan ??= await this.loadFragment({
                name: "com.app.centrallibrary.fragments.ActiveLoans"
            });

            this.oDialogLoan.open();
        },

        onCloseActiveLoans: function () {
            debugger
            if (this.oDialogLoan.isOpen()) {
                this.oDialogLoan.close();
            }

        },
        onPressProfile: function () {
            this.loadProfileDialog().then(function (oDialog) {
                oDialog.open();
            });
        },

        loadProfileDialog: async function () {
            if (!this.oDialogProfile) {
                this.oDialogProfile = await this.loadFragment({
                    name: "com.app.centrallibrary.fragments.Admindetails"
                });
            }
            return this.oDialogProfile;
        },

        onCloseProfileDialog: function () {
            if (this.oDialogProfile) {
                this.oDialogProfile.close();
            }
        },

        onAddNewLoanPress: async function () {
            if (!this.oNewLoanDailog) {
                this.oNewLoanDailog = await this.loadFragment({
                    name: "com.app.centrallibrary.fragments.loancreate"
                })
            }
            this.oNewLoanDailog.open()
        },
        onNewLoanDailogClose: function () {
            if (this.oNewLoanDailog.isOpen()) {
                this.oNewLoanDailog.close();
            }
        },
    });
});
