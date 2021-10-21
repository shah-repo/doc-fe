// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

context("Bulk create flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
                group: "OTHER",
                isQms: true,
                canRedLine: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create form for bulk create", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Bulk create form", () => {
      cy.drEnterDocumentTitle({ name: "Bulk create form" });
    });

    it("Enter description 'Bulk create form description'", () => {
      cy.drEnterDocumentDescription({ description: "Bulk create form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
    });

    it("Button should have text 'Download Excel Template'", () => {
      cy.get("[data-cy=\"Download Excel Template\"]").should("have.text", "Download Excel Template");
    });

    it("The section component where the excel spreadsheet will be added is labeled 'Excel for Import'", () => {
      cy.get("[id=\"fb-spreadsheet-for-import\"]").should("have.text", "EXCEL FOR IMPORT");
    });

    it("The Paragraph component with the instructions is labeled 'Upload excel with data for import'", () => {
      cy.get("[data-cy=\"Upload excel with data for import\"]")
        .should("have.text", "Upload excel with data for import");
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create form document for bulk creation", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Document for bulk creation", () => {
      cy.drEnterDocumentTitle({ name: "Document for bulk creation" });
    });

    it("Enter description 'Document for bulk creation description'", () => {
      cy.drEnterDocumentDescription({ description: "Document for bulk creation description" });
    });

    it("Select 'Test Document Type' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    context("Add form fields that will be used in bulk creation", () => {
      context("Add text field", () => {
        it("Click add button", () => {
          cy.fbAddNewField();
        });

        it("Select text field", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC text field" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Checkbox group", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Checkbox group", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Checkbox group" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Select", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Select", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Select" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC select field" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Radio button group", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Radio button group", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC radio button group" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Date Picker", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Date picker", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Date picker" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Text Editor", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Text Editor", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Text Editor" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Paragraph", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Paragraph", () => {
          cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
        });

        it("Enter text to present in paragraph", () => {
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().arrowType("BLC paragraph text").wait(500);
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Start bulk creation flow", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select bulk creation form document", () => {
      cy.drFilterDocListByNameAndStatus({ title: "Bulk create form", status: "Released" });
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation document description" });
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").click();
          cy.unClick();
        });
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").click();
        cy.get("ul[role=listbox]>li").contains("Document for bulk creation").click();
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").click();
        cy.get("ul[role=listbox]>li").contains("Test Document Type").click();
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      context("Test downloaded excel", () => {
        it("Download excel template file", () => {
          cy.excelDownloadTemplate({ saveFileName: "Test1.xlsx" });
        });
      });
    });
  });
});

export { };

