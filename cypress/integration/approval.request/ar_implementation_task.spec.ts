// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request implementation tasks", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Create new AR form with implementation task", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Approval request form template'", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description 'New form template for approval request'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for approval request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add 'Implementation Task' to AR", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
      cy.get("[data-cy=\"label\"]").arrowType("Implementation Task");
      cy.fbAddField();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0680");
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      SystemRequirement("REQ-0690", "REQ-0700");
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    // TODO: data-cy=\"fb-approvers-approvers\"]").should(be.disabled");

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[2].email });
    });
  });

  context("Add implementation task and continue AR creation flow", () => {
    it("Fill all fields and add 'Implementation Task'", () => {
      SystemRequirement("REQ-0710");
      cy.get("[data-cy=\"fb-control-btn\"]").arrowClick();
      cy.get("[data-cy=\"title\"]").arrowType("Task One");
      cy.get("[data-cy=\"description\"]").next().arrowType("Task Description");
      cy.get("[data-cy=\"assigned\"]").autocompleteSelect(`${USERS[2].email}`);
      cy.poAddDateRequired();
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTasks, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).arrowClick();
      });
    });

    it("Add description 'Test' to trigger autosave", () => {
      cy.arEnterApprovalRequestDescription({ description: "Test" });
    });

    it("Check 'Implementation task' status is 'Draft'", () => {
      SystemRequirement("REQ-0710");
      cy.arCheckImplementationTaskStatus({ status: "DRAFT" });
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Approve AR", () => {
      SystemRequirement("REQ-0920");
      cy.arApproveAR();
    });

    it("Check approval request status is 'Implementation'", () => {
      SystemRequirement("REQ-0020", "REQ-0730");
      cy.arVerifyStatus({ status: "IMPLEMENTATION" });
    });

    it("Verify export", () => {
      SystemRequirement("REQ-3800");
      cy.exportVerifyEmail({
        status: STATUS_TYPES_LABEL.IMPLEMENTATION, filename: "-Approval-request-from-newly-created-form",
        pdfStatus: STATUS_TYPES_LABEL.IMPLEMENTATION, type: "approval request",
      });
    });

    it("Check 'Implementation task' status is 'Pending'", () => {
      SystemRequirement("REQ-0710");
      cy.arCheckImplementationTaskStatus({ status: "PENDING" });
    });

    it("Complete Implementation Task'", () => {
      SystemRequirement("REQ-0710");
      cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Done$", "g")).arrowClick();
      cy.get("[data-cy=\"description\"]").next().arrowType("Task is done");
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTaskDone, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).arrowClick();
      });
    });

    it("Check 'Implementation task' status is 'Done'", () => {
      SystemRequirement("REQ-0710");
      cy.arCheckImplementationTaskStatus({ status: "DONE" });
    });

    it("Navigate to AR list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "APPROVED" });
    });

    it("Check approval request status is 'Approved'", () => {
      SystemRequirement("REQ-0020", "REQ-0730");
      cy.arVerifyStatus({ status: "APPROVED" });
    });
  });
});

export { };

