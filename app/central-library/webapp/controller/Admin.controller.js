

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Fragment, UIComponent, History, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.app.centrallibrary.controller.Admin", {
        onInit: function () {
            const oEditModel = new JSONModel({
                ISBN: "",
                title: "",
                author: "",
                quantity: "",
                availableQuantity: "",
                genre: ""
            })
            this.getView().setModel(oEditModel, "oEditModel")
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
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
        onCurrentUserDetails: function (oEvent) {
            const { userId } = oEvent.getParameter("arguments");
            this.ID = userId;
            const sRouterName = oEvent.getParameter("name");
            const oForm = this.getView().byId("idAdminPage");
            oForm.bindElement(`/User(${userId})`, {
                expand: ''
            });
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
        onCloseProfileDialog: function () {
            if (this.oDialogProfile) {
                this.oDialogProfile.close();
            }
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
            var oTable = this.byId("idBookTable");
            var oBinding = oTable.getBinding("items");
            // Apply the filters to the binding
            oBinding.filter(aFilters);
          },
      
      

        async onPressAdd() {
            this.oDialogAdd ??= await this.loadFragment({
                name: "com.app.centrallibrary.fragments.Adddata"
            });

            this.oDialogAdd.open();
        },

        onAddNewBook: function () {
            var oView = this.getView();
            var oDialog = this.byId("addUpDialog");
        
            if (!oDialog) {
                sap.m.MessageToast.show("Dialog not found.");
                return;
            }
        
            // Access controls within the dialog
            var sISBNInput = oView.byId("ISBNInput");
            var sTitleInput = oView.byId("BookInput");
            var sAuthorInput = oView.byId("AuthorInput");
            var sQuantityInput = oView.byId("quantityInput");
            var sGenreInput = oView.byId("userTypeInput");
        
            // Check if all controls are found
            if (!sISBNInput || !sTitleInput || !sAuthorInput || !sQuantityInput || !sGenreInput) {
                sap.m.MessageToast.show("One or more input fields are not found.");
                return;
            }
        
            // Capture the input values
            var sISBN = sISBNInput.getValue();
            var sTitle = sTitleInput.getValue();
            var sAuthor = sAuthorInput.getValue();
            var sQuantity = parseInt(sQuantityInput.getValue());
            var sGenre = sGenreInput.getSelectedKey(); // Correct method for Select
        
            // Validate the input values
            if (!sISBN || !sTitle || !sAuthor || !sQuantity || !sGenre) {
                // Show a message if any input value is empty
                sap.m.MessageToast.show("Please fill all the input values.");
                return; // Exit the function if validation fails
            }
        
            // Validate ISBN length
            if (sISBN.length !== 17) {
                sap.m.MessageToast.show("ISBN must be exactly 17 characters long.");
                return; // Exit the function if ISBN validation fails
            }
        
            // Check for duplicate ISBN
            var oTable = this.byId("idBookTable");
            var aItems = oTable.getItems();
            for (var i = 0; i < aItems.length; i++) {
                var oItem = aItems[i];
                var oContext = oItem.getBindingContext();
                var oBook = oContext.getObject();
                if (oBook.ISBN === sISBN) {
                    sap.m.MessageToast.show("ISBN already exists in the records.");
                    return; // Exit the function if ISBN is duplicated
                }
            }
        
            // Set available quantity equal to quantity
            var sAvailableQuantity = sQuantity;
        
            // Create a new book object
            var oNewBook = {
                ISBN: sISBN,
                title: sTitle,
                author: sAuthor,
                quantity: sQuantity,
                availableQuantity: sAvailableQuantity,
                genre: sGenre
            };
        
            // Create a new entry in the model
            var oContext = this.getView().byId("idBookTable").getBinding("items").create(oNewBook);
            sap.m.MessageToast.show("Successfully Added");
        
            // Clear input fields
            sISBNInput.setValue("");
            sTitleInput.setValue("");
            sAuthorInput.setValue("");
            sQuantityInput.setValue("");
            sGenreInput.setSelectedKey(""); // Correct method for Select
        
            // Close the dialog
            oDialog.close();
        },

        onCancelNewBook: function(){
            if (this.oDialogAdd) {
                this.oDialogAdd.close();
            }
        },

        onPressDelete: async function () {
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
                sap.m.MessageToast.show("Please Select a title to Delete");
            }
        },

        onPressEdit: function () {
            var oSelectedBook = this.byId("idBookTable").getSelectedItem();
            if (oSelectedBook) {
                var oBookData = oSelectedBook.getBindingContext().getObject();
                var oEditModel = this.getView().getModel("oEditModel");
                oEditModel.setData(oBookData);

                if (!this.oEditDialog) {
                    this.loadFragment({
                        name: "com.app.centrallibrary.fragments.EditBook"
                    }).then(function (oDialog) {
                        this.oEditDialog = oDialog;
                        this.oEditDialog.setModel(oEditModel, "oEditModel");
                        this.oEditDialog.open();
                    }.bind(this));
                } else {
                    this.oEditDialog.setModel(oEditModel, "oEditModel");
                    this.oEditDialog.open();
                }
            } else {
                sap.m.MessageToast.show("Please select a title to edit.");
            }
        },

        onModifyBook: function () {
            var oEditModel = this.getView().getModel("oEditModel");
            var oEditedBook = oEditModel.getData();
            var oBookBinding = this.byId("idBookTable").getBinding("items");

            var oContext = oBookBinding.getContexts().find(function (context) {
                return context.getObject().ISBN === oEditedBook.ISBN;
            });

            if (oContext) {
                oContext.setProperty("title", oEditedBook.title);
                oContext.setProperty("author", oEditedBook.author);
                oContext.setProperty("quantity", oEditedBook.quantity);
                oContext.setProperty("availableQuantity", oEditedBook.availableQuantity);
                oContext.setProperty("genre", oEditedBook.genre);

                this.oEditDialog.close();
                sap.m.MessageToast.show("Book details updated successfully.");
            } else {
                sap.m.MessageToast.show("Error: Book not found.");
            }
        },

        onCancelEditBook: function () {
            if (this.oEditDialog) {
                this.oEditDialog.close();
            }
        },
        onPressActiveloans: function () {
            // get router instance
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // navigate to RouteSignup
            oRouter.navTo("RouteActiveLoans");
          },
          async onPressIssuetitle() {
            if (!this.oIssuetitle) {
                this.oIssuetitle = await this.loadFragment({
                    name: "com.app.centrallibrary.fragments.Issuetitle"
                });
                this.getView().addDependent(this.oIssuetitle);
            }

            this.oIssuetitle.open();
        },
        

        onCloseIssuetitle:function () {
            this.oIssuetitle.close();
        }, 

         onIssuetitle: async function() {

        },

        onCancel: function () {
            this.oIssuetitle.close();
        },



        onClearLoan: function () {
            var oTable = this.byId("idActiveLoanTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageBox.warning("Please select at least one record to delete.");
                return;
            }

            // Create an array to hold promises for delete operations
            var aDeletePromises = aSelectedItems.map(function (oItem) {
                var oContext = oItem.getBindingContext();
                return oContext.delete();
            });

            // Execute all delete operations
            Promise.all(aDeletePromises)
                .then(function () {
                    MessageToast.show("Selected records deleted successfully.");
                    // Refresh the table binding after deletion
                    oTable.getBinding("items").refresh();
                })
                .catch(function (oError) {
                    MessageBox.error("Error deleting records: " + oError.message);
                });
        },
        onCloseActiveLoans: function () {
                        // Your logic to close the dialog
                        this.byId("idActiveLoansDailogBox").close();
                    },
    });
});


