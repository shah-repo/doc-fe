/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let createdCompany;
let loginResponse;
let adminEmployee;

context("PO and parts ", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("Create company", () => {
    it("[API] Creates company", (done: any) => {
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
                documentTypeName: "PO Part",
                documentTypeAcronym: "PRT-",
                group: DOC_TYPE_GROUP.PART,
                isQms: true,
              },
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API] Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Purchase Order Form" });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Predefined fields are displayed", () => {
    it("Button should have check title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Purchase Order Form")
        .should("exist");
    });

    it("Button should have check Description", () => {
      cy.get("[data-cy=\"description\"]").contains( "New Purchase Order Form description")
        .should("exist");
    });

    it("Button should have text Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Button should have text Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Button should have text Numeric", () => {
      cy.get("[data-cy=\"common.Numeric\"]").contains("Numeric")
        .should("exist");
    });

    it("Button should have text Selected Users", () => {
      cy.get("[data-cy=\"field-securityEmployees\"]").contains("Selected Users")
        .should("exist");
    });

    it("Button should have text Selected Groups", () => {
      cy.get("[data-cy=\"field-securityGroups\"]").contains("Selected Groups")
        .should("exist");
    });

    it("Button should have text Attachments", () => {
      cy.get("div[id^=\"attachmentHeader\"]").contains("Attachments")
        .should("exist");
    });

    it("Button should have text Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Button should have text Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify that the top left of the page displays docId", () => {
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("FM-00002")
        .should("exist");
    });

    it("Verify that the top left of the page displays Rev", () => {
      cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev 1")
        .should("exist");
    });

    it("Verify that the top left of the page displays status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains("DRAFT")
        .should("exist");
    });

    it("Verify Form opens to the Details tab by default", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });

    it("Verify the page displays Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

    it("Button should have text PO Status", () => {
      cy.get("[data-cy=\"PO Status\"]")
        .should("have.text", "PO Status");
    });

    it("Button should have text General Information", () => {
      cy.get("[data-cy=\"General Information\"]")
        .should("have.text", "General Information");
    });

    it("Button should have text Requestor", () => {
      cy.get("[data-cy=\"Requestor\"]")
        .should("have.text", "Requestor");
    });

    it("Button should have text Supplier ", () => {
      cy.get("[data-cy=\"Supplier \"]")
        .should("have.text", "Supplier ");
    });

    it("Button should have text Order Date", () => {
      cy.get("[data-cy=\"Order Date\"]")
        .should("have.text", "Order Date");
    });

    it("Button should have text Summary of totals", () => {
      cy.get("[data-cy=\"common.summary.total\"]")
        .should("have.text", "Summary of totals");
    });

    it("Verify the page displays", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });
  });

  context("Verify Add Field section", () => {
    it("Verify Add Field section", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.get(`input[placeholder^="Search"]`).should("exist");
      cy.fbVerifySectionsOnAddField("Section", "Inputs", "Approvals", "Custom Controls",
        "Instructions", "Buttons", "Actions");
      cy.fbCheckFieldsExistSectionList("Section", "Subsection", "Step");
      cy.fbCheckFieldsExistInputsList("Text field", "Checkbox group", "Autocomplete", "Text Editor",
        "Date picker", "Hyperlink", "Select", "Radio Button group", "Paragraph", "File Upload",
        "Blank Template Form", "Quantity", "Timer", "Purchase Order", "Receive Purchase Order",
        "PO Approval Matrix", "Instructions Media upload", "Evidence Media upload", "EB Procedure",
        "PI Procedure", "Equipment", "Text field with range", "Supplier");
      cy.fbCheckFieldsDoesntExistOnInputsList("LHR Step");
      cy.fbCheckFieldsExistApprovalsList("Approvals", "Inline Approval", "Request Approval");
      cy.fbCheckFieldsExistInstructionsList("MPI", "Select Document(s)");
      cy.fbCheckFieldsExistButtonsList("Checkpoint", "Create a Label", "Implementation Task");
      cy.fbCheckFieldsExistActionsList("Action Button");
      cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
    });
    it("Verify Search Field for `text`", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("text").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="Text field"]`).should("exist");
      cy.get(`[data-cy="Text Editor"]`).should("exist");
      cy.get(`[data-cy="Text field with range"]`).should("exist");
    });
    it("Verify Search Field for `upload`", () => {
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("upload").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="File Upload"]`).should("exist");
      cy.get(`[data-cy="Instructions Media upload"]`).should("exist");
      cy.get(`[data-cy="Evidence Media upload"]`).should("exist");
    });
    it("Verify Search Field for `inline`", () => {
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("inline").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="Inline Approval"]`).should("exist");
      cy.get(`[data-cy="Inline Approval"]`).parent()
        .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
      cy.get(`input[placeholder^="Search"]`).clear();
    });
    it("Verify Favorites", () => {
      cy.fbVerifySectionsOnAddField("Favorites");
      cy.fbCheckFieldsExistFavoritesList("Inline Approval");
      cy.get(`[data-cy="Inline Approval"]`).parent()
        .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
      cy.fbVerifySectionsNotOnAddField("Favorites");
    });
  });

  context("Add components in the form", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for purchase order test" });
      cy.fbAddField();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify the highlighted Items", () => {
    it("Verify the remove button", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().should("exist");
    });

    it("Verify the Edit button", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().should("exist");
    });

    it("Verify the presentation button", () => {
      cy.get("[class=\"MuiSvgIcon-root\"]").eq(18).should("exist");
    });

    it("Verify the drag & drop button", () => {
      cy.get("[class=\"drag-handle\"]").last().should("exist");
    });
  });

  // context("drag & drop", () => {
  //   it("Verify the Edit button", () => {
  //     cy.get(`[class="drag-handle"]`).last()
  //       .realMouseDown({ position: "center", button: "left" });
  //     cy.wait(3000);
  //     cy.get(`[class="drag-handle"]`).eq(-1)
  //       .realMouseMove(0, 0, { position: "center" })
  //       .realMouseUp();
  //   });
  // });

  context("Move & Edit & Remove component", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Po  " });
      cy.fbAddField();
    });

    it("Verify move component", () => {
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Verify move component", () => {
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for Po Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify that the Form contains Details and Line Items tab", () => {
    it("navigate to Line Items", () => {
      cy.drSelectDetailsTab();
    });

    it("Button should have text Details", () => {
      cy.get("[data-cy=\"tabId.details\"]")
        .should("have.text", "Details");
    });

    it("Button should have text Line Items", () => {
      cy.get("[data-cy=\"tabId.lineitems\"]")
        .should("have.text", "Line Items");
    });
  });

  context("Verify Form opens to the Details tab by default and it contains", () => {
    it("Verify Form opens to the Details tab by default", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Purchase Order Form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("New Purchase Order Form description")
        .should("exist");
    });

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] div[class^=\"MuiTypography-root makeStyles-title- MuiTypography-h6\"]").contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Purchase Order", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Purchase Order")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

  });
});

