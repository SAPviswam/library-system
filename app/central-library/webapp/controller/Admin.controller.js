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
        // onInit: function () {
        //     var oBookModel = new JSONModel({
        //         Book: [],
        //         searchValue: ""
        //     });
        //     this.getView().setModel(oBookModel, "bookModel");

        //     this._loadCSVData();
        //     const oRouter = this.getOwnerComponent().getRouter();
        //     oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
        // },
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
          },
        onCurrentUserDetails: function (oEvent) {
            debugger
            const { userId } = oEvent.getParameter("arguments");
            this.ID = userId;
            const sRouterName = oEvent.getParameter("name");
            const oForm = this.getView().byId("idAdminPage");
            oForm.bindElement(`/User(${userId})`, {
                expand: ''
            });
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
            var oPage = oView.byId("idAdminPage");

            if (oPage.hasStyleClass("fullscreen")) {
                oPage.removeStyleClass("fullscreen");
            } else {
                oPage.addStyleClass("fullscreen");
            }
        },

        onPressNotification: function () {
            // Handle notification button press
        },

        onPressAdmin: function () {
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
                name: "com.app.centrallibrary.fragments.Admindetails"
              });
            }
            return this.oDialogProfile;
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
                sap.m.MessageToast.show(" Successfully Added");
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

        onPressEdit: async function () {
            var oSelected = this.byId("idBookTable").getSelectedItem();
            if (oSelected) {
                var oContext = oSelected.getBindingContext("bookModel");
                if (!this.oEditDialog) {
                    this.oEditDialog = await Fragment.load({
                        id: this.getView().getId(),
                        name: "com.app.centrallibrary.fragments.EditBook",
                        controller: this
                    });
                    this.getView().addDependent(this.oEditDialog);
                }
                this.oEditDialog.setBindingContext(oContext, "bookModel");
                this.oEditDialog.open();
            } else {
                MessageToast.show("Please select a book to edit.");
            }
        },

        onModifyBook: function () {
            var oModel = this.getView().getModel("bookModel");
            var oDialog = this.byId("editBookDialog");
            var oContext = oDialog.getBindingContext("bookModel");

            oModel.refresh();
            MessageToast.show("Book details updated successfully.");
            oDialog.close();
        },
        
        onCancelEdit: function () {
            if (this.oEditDialog.isOpen()) {
                this.oEditDialog.close();
            }
        },

        onSearch: function (oEvent) {
            // Get the search value
            var sQuery = oEvent.getParameter("query");
            // if (!sQuery) {
            //     sQuery = this.getView().getModel("bookModel").getProperty("/searchValue");
            // }
            // Create a filter for each searchable field
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

            // Get the binding for the table and apply the filters
            var oTable = this.byId("idBookTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onSearch: function (oEvent) {
            // Get the search query
            var sQuery = oEvent.getParameter("query");
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
            var oTable = this.byId("idBookTable");
            var oBinding = oTable.getBinding("items");
      
            // Apply the filters to the binding
            oBinding.filter(aFilters);
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
        onPressAdminProfile: function () {
            this.loadProfileDialog().then(function (oDialog) {
                oDialog.open();
            var oViewModel = this.getView().getModel();
        oDialog.setModel(oViewModel);
        oDialog.bindElement(`/User(${this.ID})`);
        oDialog.open();
      }.bind(this));
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







