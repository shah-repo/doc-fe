// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let initialArDocument;
let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let approvalRequestDocumentType;
let createdDocument;

const documentRevisionName = "Test document for revising";

context("Document revise test", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });
  });

  context("Login user", () => {
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

  context("[API]Create document for revising", () => {
    it("[API]Create document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
        }).then(() => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Test Doc Rev Description1</p>",
              document: {
                docId: "CP-00003",
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
          }).then((response) => {
            createdDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("Navigate to created document", () => {
      cy.navigToDocumentList();
      cy.drClickOnSpecificDocFromList({ item: documentRevisionName });
    });
  });

  context("Verify 'Administrative Change' is not shown on document list", () => {
    it("Revise document with 'Administrative Change' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Administrative Change" });
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify 'Test document for revising' revision is set to 1.1", () => {
      SystemRequirement("REQ-0580", "REQ-0620", "REQ-0370");
      cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
      cy.dlVerifyFilterByRev({ revision: "1.1" });
    });
  });

  context("Verify 'Next Revision' change is shown on document list", () => {
    it("Navigate to created document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Revise document with 'Next Revision' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Next Revision" });
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify 'Test document for revising' revision is set to 2", () => {
      SystemRequirement("REQ-0580", "REQ-0620", "REQ-0370");
      cy.dlClearFilters();
      cy.dlFilterByStatus({ status: "Released" });
      cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
      cy.dlVerifyFilterByRev({ revision: "2" });
    });
  });

  context("Verify 'Upgrade to Next Revision Level' change is shown on document list", () => {
    context("Revise document to 'Upgrade to Next Revision Level'", () => {
      it("Navigate to created document", () => {
        cy.dlSelectFirstDocument();
      });

      it("Revise document with 'Next Revision' option", () => {
        cy.drClickReviseDocument();
        cy.drChooseTypeOfRevisionChangeOption({ option: "Upgrade to Next Revision Level" });
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Create AR for reviseed document to 'Upgrade to Next Revision Level'", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.cmpClickCreateApprovalRequest();
      });

      it("Enter title AR title: 'AR for Upgrade to Next Revision Level'", () => {
        cy.arEnterApprovalRequestTitle({ title: "AR for Upgrade to Next Revision Level" });
      });

      it("Enter description 'AR from New form template for approval request'", () => {
        cy.arEnterApprovalRequestDescription(
          { description: "AR for testing document that has been revised to 'Upgrade to Next Revision Level'" });
      });

      it("Add created document revision", () => {
        cy.arClickAddDocument().wait(500);
        cy.arChoseSpecificProposedDocument({ name: documentRevisionName });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Add first approver to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Click Create Approval Request", () => {
        cy.arClickCreateApprovalRequestAfterCompletingForm();
      });

      it("Click send to review", () => {
        cy.arClickSendToReview();
      });
    });

    context("Approve submission and close AR", () => {
      it("Click approve submission", () => {
        cy.arApproveAR();
      });

      it("Click close AR", () => {
        cy.arCloseAR();
      });
    });

    context("Verify 'Upgrade to Next Revision Level' revision is shown on document list", () => {
      it("Verify 'Test document for revising' revision is set to '1A'", () => {
        SystemRequirement("REQ-0580", "REQ-0620", "REQ-0370");
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlFilterByStatus({ status: "Released" });
        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
        cy.dlVerifyFilterByRev({ revision: "1A" });
      });
    });
  });

  context("Verify 'Obsolete' change is shown on document list", () => {
    context("Revise document to 'Obsolete'", () => {
      it("Navigate to created document", () => {
        cy.dlSelectFirstDocument();
      });

      it("Revise document with 'Obsolete' option", () => {
        cy.drClickReviseDocument();
        cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Create AR for reviseed document to 'Obsolete'", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.cmpClickCreateApprovalRequest();
      });

      it("Enter title AR title: 'AR for Upgrade to Obsolete'", () => {
        cy.arEnterApprovalRequestTitle({ title: "AR for Upgrade to Obsolete" });
      });

      it("Enter description 'AR from New form template for approval request'", () => {
        cy.arEnterApprovalRequestDescription(
          { description: "AR for testing document that has been revised to 'Obsolete'" });
      });

      it("Add created document revision", () => {
        cy.arClickAddDocument().wait(500);
        cy.arChoseSpecificProposedDocument({ name: documentRevisionName });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Add first approver to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Click Create Approval Request", () => {
        cy.arClickCreateApprovalRequestAfterCompletingForm();
      });

      it("Click send to review", () => {
        cy.arClickSendToReview();
      });
    });

    context("Approve submission and close AR", () => {
      it("Click approve submission", () => {
        cy.arApproveAR();
      });

      it("Click close AR", () => {
        cy.arCloseAR();
      });
    });

    context("Verify 'Upgrade to Next Revision Level' revision is shown on document list", () => {
      it("Verify 'Test document for revising' revision is set to 'OBS'", () => {
        SystemRequirement("REQ-0580", "REQ-0620", "REQ-0370");
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlFilterByStatus({ status: "Obsolete" });
        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
        cy.dlVerifyFilterByRev({ revision: "OBS" });
      });
    });
  });
});
