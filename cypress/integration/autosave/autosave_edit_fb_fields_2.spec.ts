// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Autosave on add and edit FB fields", () => {
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
            importerEmail: USERS[5].email,
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
      // SystemRequirement("REQ-0490");
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

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Test Requirement", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
      cy.fbEnterNameValue({ name: "label", value: "fb-test-req" });
      cy.get("[data-cy=\"testRequirement\"]")
        .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
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

    it("Add Instructions 'Select Requirement(s)'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-req" });
      cy.get("[data-cy=\"options\"]")
        .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Actions 'Action Button'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
      cy.fbSelectCheckboxValue("SendEmailWithFormToFill");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Evidence Media upload", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-evidence" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Test Requirement", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-test-req" });
      cy.fbEnterNameValue({ name: "label", value: "fb-test-req1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Equipment", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-equipment" });
      cy.fbEnterNameValue({ name: "label", value: "fb-equipment1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Text field with range", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-range" });
      cy.fbEnterNameValue({ name: "label", value: "fb-range1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Section", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Subsection", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Step", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Approvals", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-approvals" });
      cy.fbEnterNameValue({ name: "label", value: "fb-approvals1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Inline Approval", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Request Approval", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-request-approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-request-approval1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Checkpoint", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-checkpoint" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Create a Label", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-create-label" });
      cy.fbEnterNameValue({ name: "label", value: "fb-create-label1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Implementation Task", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-task" });
      cy.fbEnterNameValue({ name: "label", value: "fb-task1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Instructions 'MPI'", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-mpi" });
      cy.fbEnterNameValue({ name: "label", value: "fb-mpi1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit Instructions 'Select Document(s)'", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-select-doc" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-doc1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit 'Select Requirement(s)'", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-select-req" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-req1" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Edit 'Action Button'", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "Send Email" });
      cy.fbSelectCheckboxValue("SendSurveyEmailWithFormToFill");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });
  });

  context("Verify Updation of Fields on reload page", () => {
    it("reload page", () => {
      cy.navigToDocumentList();
      cy.drFilterDocListByNameAndStatus({ title: "New Document Revision", status: "Draft" });
    });

    it("Verify Evidence Media upload", () => {
      cy.contains("fb-evidence1").should("exist");
    });

    it("Verify Test Requirement", () => {
      cy.contains("fb-test-req1").should("exist");
    });

    it("Verify Equipment", () => {
      cy.contains("fb-equipment1").should("exist");
    });

    it("Verify Text field with range", () => {
      cy.contains("fb-range1").should("exist");
    });

    it("Verify Section", () => {
      cy.contains("fb-section1").should("exist");
    });

    it("Verify Subsection", () => {
      cy.contains("FB-SUBSECTION1").should("exist");
    });

    it("Verify Step", () => {
      cy.contains("fb-step1").should("exist");
    });

    it("Verify Approvals", () => {
      cy.contains("fb-approvals1").should("exist");
    });

    it("Verify Inline Approval", () => {
      cy.contains("fb-inline-approval1").should("exist");
    });

    it("Verify Request Approval", () => {
      cy.contains("fb-request-approval1").should("exist");
    });

    it("Verify Checkpoint", () => {
      cy.contains("fb-checkpoint1").should("exist");
    });

    it("Verify Create a Label", () => {
      cy.contains("fb-create-label1").should("exist");
    });

    it("Verify Implementation Task", () => {
      cy.contains("fb-task1").should("exist");
    });

    it("Verify Instructions 'MPI'", () => {
      cy.contains("fb-mpi1").should("exist");
    });

    it("Verify Instructions 'Select Document(s)'", () => {
      cy.contains("fb-select-doc1").should("exist");
    });

    it("Verify Instructions 'Select Requirement(s)'", () => {
      cy.contains("fb-select-req1").should("exist");
    });

    it("Verify Actions 'Action Button'", () => {
      cy.contains("Send Email").should("exist");
    });
  });
});

export { };

