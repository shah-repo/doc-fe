// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request implementation tasks", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
              },
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
        cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
      });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Add 'Implementation Task' to AR", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
      cy.get("[data-cy=\"label\"]").type("Implementation Task");
      cy.fbAddField();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
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
      cy.cmpClickCreateApprovalRequest();
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
      cy.arClickAddDocument().wait(500);
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

    it("Save changes", () => {
      cy.arSaveApiCall();
    });
  });

  context("Add implementation task and continue AR creation flow", () => {
    it("Fill all fields and add 'Implementation Task'", () => {
      SystemRequirement("REQ-0710");
      cy.get("[data-cy=\"fb-control-btn\"]").click();
      cy.get("[data-cy=\"title\"]").type("Task One");
      cy.get("[data-cy=\"description\"]").next().type("Task Description");
      cy.get("[data-cy=\"assigned\"]").type(`${USERS[2].email}{downarrow}{enter}`);
      cy.poAddDateRequired();
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTasks, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).click();
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
      cy.arVerifyStatus({ status: "Implementation" });
    });

    it("Check 'Implementation task' status is 'Pending'", () => {
      SystemRequirement("REQ-0710");
      cy.arCheckImplementationTaskStatus({ status: "PENDING" });
    });

    it("Complete Implementation Task'", () => {
      SystemRequirement("REQ-0710");
      cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Done$", "g")).click();
      cy.get("[data-cy=\"description\"]").next().type("Task is done");
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTaskDone, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).click();
      });
      // cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).click();
    });

    it("Check 'Implementation task' status is 'Done'", () => {
      SystemRequirement("REQ-0710");
      cy.arCheckImplementationTaskStatus({ status: "DONE" });
    });

    it("Navigate to AR list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "Closed" });
    });

    it("Check approval request status is 'Closed'", () => {
      SystemRequirement("REQ-0020", "REQ-0730");
      cy.arVerifyStatus({ status: "Closed" });
    });
  });
});

export { };

