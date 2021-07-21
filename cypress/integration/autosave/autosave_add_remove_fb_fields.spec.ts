// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Autosave on add and remove FB fields", () => {
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
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
      cy.wait(2000);
    });

    it("Add Text Editor", () => {
      SystemRequirement("FB-0550");
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Verify you can't enter data to Text Editor", () => {
      SystemRequirement("FB-0590");
      cy.xpath("//div[starts-with(@data-cy, \"fb-text-editor-\")]/../div[2]/div")
        .should("not.have.attr", "contenteditable");
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Hyperlink", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "Hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Select Field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbGroupOptions("option1", "option2");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Paragraph", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().type("fb-paragraph");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Timer", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
      cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Receive Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add PO Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Procedure", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Equipment", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
      cy.get("input[value=\"preventativeMaintenance\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Text field with range", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
      cy.fbEnterNameValue({ name: "label", value: "fb-range" });
      cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Section", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Subsection", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Step", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Approvals", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Approvals" });
      cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Inline Approval", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
      cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
      cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Request Approval", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Request Approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-request-approval" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Checkpoint", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Create a Label", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
      cy.fbEnterNameValue({ name: "label", value: "fb-create-label" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Implementation Task", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
      cy.fbEnterNameValue({ name: "label", value: "fb-task" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Instructions 'MPI'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.get(`[data-cy="form.builder.instructionsdocument"]`).eq(-1).click();
      cy.fbEnterNameValue({ name: "label", value: "fb-mpi" });
      cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Instructions 'Select Document(s)'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
      cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Actions 'Action Button'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Remove Checkbox group", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Autocomplete", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Text Editor", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Date picker", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Hyperlink", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Select Field", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Radio Button group", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Paragraph", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove File Upload", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Blank Template Form", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Quantity", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Timer", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Purchase Order", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Receive Purchase Order", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove PO Approval Matrix", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Instructions Media upload", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Evidence Media upload", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Procedure", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Equipment", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Text field with range", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Section", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Subsection", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Step", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Step", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Approvals", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Inline Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Request Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Checkpoint", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Create a Label", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Implementation Task", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Instructions 'MPI'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove Instructions 'Select Document(s)'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove 'Action Button'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });

    it("Remove TextField", () => {
      SystemRequirement("FB-0200");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbRemoveLastAddedItem();
      });
    });
  });
});


export { };

