/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let createdPartDocument;
let approvalRequestDocumentType;
let partDocumentType;
let initialArDocument;

context("supplier_and_paperLHR", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
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
              { ...LotHistoryRecordTest },
              MPITest,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "CS-00005",
                documentType: {
                  id: partDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [],
                },
              },
              name: "Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });
  });

  context("verify default tabs are displayed", () => {
    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });

    it("Click 'Preview Layout' button", () => {
      cy.intPageClickPreviewLayout();
    });

    it("Verify 'Overview' tab is displayed", () => {
      cy.intPageVerifyOverviewTabExist();
    });

    it("Verify 'Details' tab is displayed", () => {
      cy.intPageVerifyDetailsTabExist();
    });
  });

  context("verify default fields are displayed", () => {
    it("Verify Document type is displayed", () => {
      cy.intPageVerifyDocTypeExist();
    });

    it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Document ID");
    });

    it("Verify 'Revision Stage' field is displayed", () => {
      cy.intPageVerifyRevisionStageExist();
    });

    it("Verify 'Training required' field is displayed", () => {
      cy.intPageVerifyTrainingRequiredExist();
    });

    it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Training Required");
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.intPageVerifyAttachmentExist();
    });

    it("Verify Output document type is displayed", () => {
      cy.intPageVerifyOutputDocTypeExist();
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
    });

    it("verify form preview button in Details Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
    });
  });

  context("click on form preview button", () => {
    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("click on form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
    });

    it("Approval is editable", () => {
      cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").then(($el) => {
        $el.trigger("click");
        cy.unClick();
      });
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });
  });

  context("Add fields", () => {
    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("A", "B");
      cy.fbOpenValidation();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add section field", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterLabel({ label: "fb-section" });
      cy.fbAddNewFieldButton();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbGroupOptions("X");
      cy.fbOpenValidation();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get("[data-cy='fb-control-required_if:anotherfield,value']").arrowClick();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-radiobutton-group");
      cy.get("input[value^='A']").eq(0).arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Click on Form Preview and verify the fields", () => {
    it("Click 'Preview Layout' button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
    });

    it("Verify Approval tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("Approvals").should("exist");
    });

    it("Verify fb-radiobutton-group", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-radiobutton-group").should("exist");
    });

    it("Verify fb-section ", () => {
      cy.get(`[data-cy="Fb Section"]`).should("exist");
    });

    it("Verify fb-textfield tab", () => {
      cy.get("input[value^='A']").eq(1).arrowClick();
    });

    it("Verify fb-text-editor tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-text-editor").should("exist");
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });
  });

  context("Edit the fields ", () => {
    it("Edit radio button field ", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(1).arrowClick({ force: true });
      cy.get("[data-cy='options']").clear();
      cy.fbGroupOptions("X", "Y");
      cy.fbAddField();
    });

    it("Edit text editor field ", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().arrowClick({ force: true });
      cy.fbOpenValidation();
      cy.get("input[value^=\"default\"]").check();
      cy.get("[data-cy='fb-control-required_if:anotherfield,value']").arrowClick();
      cy.fbAddField();
    });

    it("move component", () => {
      cy.get("[class*='fb-text-editor-']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(3)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(2)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });
  });

  context("Click on Form Preview and verify the fields", () => {
    it("Click 'Preview Layout' button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
    });

    it("Verify Approval tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("Approvals").should("exist");
    });

    it("Verify fb-radiobutton-group", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-radiobutton-group").should("exist");
    });

    it("Verify fb-section ", () => {
      cy.get(`[data-cy="Fb Section"]`).should("exist");
    });

    it("Verify fb-text-editor tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-text-editor").should("exist");
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });
  });

  context("Create 'Paper LHR' form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "paper LHR" });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("verify default tabs are displayed", () => {
    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });

    it("Click 'Preview Layout' button", () => {
      cy.intPageClickPreviewLayout();
    });

    it("Verify 'Details' tab is displayed", () => {
      cy.intPageVerifyDetailsTabExist();
    });
  });

  context("verify default fields are displayed", () => {
    it("Verify Document type is displayed", () => {
      cy.intPageVerifyDocTypeExist();
    });

    it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Document ID");
    });

    it("Verify 'Revision Stage' field is displayed", () => {
      cy.intPageVerifyRevisionStageExist();
    });

    it("Verify 'Training required' field is displayed", () => {
      cy.intPageVerifyTrainingRequiredExist();
    });

    it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Training Required");
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.intPageVerifyAttachmentExist();
    });

    it("Verify Output document type is displayed", () => {
      cy.intPageVerifyOutputDocTypeExist();
    });
  });

  context("verify predefined fields are displayed", () => {
    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.intPageVerifyPartToBeManufacturedExist();
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.intPageVerifyEndQuantityExist();
    });

    it("Check 'Build Type' is displayed", () => {
      cy.intPageVerifyBuildTypeExist();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
    });

    it("verify form preview button in Details Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
    });
  });

  context("Add fields", () => {
    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add TextField", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
      cy.fbOpenValidation();
      cy.fbFieldRequiredIf({ name: "End Quantity", value: "1" });
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbOpenValidation();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });
  });

  context("verify predefined fields are displayed", () => {
    it("Click 'Preview Layout' button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
    });

    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.intPageVerifyPartToBeManufacturedExist();
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.intPageVerifyEndQuantityExist();
    });

    it("Check 'Build Type' is displayed", () => {
      cy.intPageVerifyBuildTypeExist();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
    });

    it("Verify fb-fileupload tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-fileupload").should("exist");
    });

    it("Verify fb-fileupload validation tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("The fb-fileupload is a required field.")
        .should("exist");
    });

    it("Enter End Quantity field value", () => {
      cy.get("[data-cy='lhr-end-quantity']").eq(1).arrowType("1");
    });

    it("Verify fb-text-editor validation tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("The fb-textfield field is required when End Quantity is 1.")
        .should("exist");
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });
  });

  context("Edit fields", () => {
    it("Edit text field ", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(5).arrowClick({ force: true });
      cy.fbOpenValidation();
      cy.get("[data-cy='fb-control-required_if:anotherfield,value']").arrowClick();
      cy.fbFieldRequiredIf({ name: "End Quantity", value: "2" });
      cy.fbAddNewFieldButton();
    });
  });

  context("verify predefined fields are displayed", () => {
    it("Click 'Preview Layout' button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
    });

    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.intPageVerifyPartToBeManufacturedExist();
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.intPageVerifyEndQuantityExist();
    });

    it("Check 'Build Type' is displayed", () => {
      cy.intPageVerifyBuildTypeExist();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
    });

    it("Verify fb-fileupload tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("fb-fileupload").should("exist");
    });

    it("Verify fb-fileupload validation tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("The fb-fileupload is a required field.")
        .should("exist");
    });

    it("Enter End Quantity field value", () => {
      cy.get("[data-cy='lhr-end-quantity']").eq(1).arrowType("2");
    });

    it("Verify fb-text-editor validation tab", () => {
      cy.get("[class='MuiDialogContent-root']").contains("The fb-textfield field is required when End Quantity is 2.")
        .should("exist");
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
    });
  });
});

