// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let initialArDocument;
let createdCompany;
let loginResponse;
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
            companyAdminEmail: USERS[2].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[1], USERS[3], USERS[4]],
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
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
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
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });
  });

  context("Verify 'Administrative Change' is not shown on document list", () => {
    it("Navigate to created document", () => {
      cy.navigToDocumentList();
      cy.drClickOnSpecificDocFromList({ item: documentRevisionName });
    });

    it("Revise document with 'Administrative Change' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Administrative Change" });
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify 'Test document for revising' revision is set to 1.1", () => {
      SystemRequirement("REQ-0580", "REQ-0370");
      cy.dlFilterByDocTitle({ docTitle: documentRevisionName });

      cy.dlVerifyFilterByRev({ revision: "1.1" });
    });
  });

  context("Verify 'Next Revision' change is shown on document list", () => {
    it("Navigate to created document", () => {
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Revise document with 'Next Revision' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Next Revision" });
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify 'Test document for revising' revision is set to 2", () => {
      SystemRequirement("REQ-0580", "REQ-0370");
      cy.dlClearFilters();

      cy.dlFilterByStatus({ status: "Released" });

      cy.dlFilterByDocTitle({ docTitle: documentRevisionName });

      cy.dlVerifyFilterByRev({ revision: "2" });
    });
  });

  context("Verify 'Upgrade to Next Revision Level' change is shown on document list", () => {
    context("Revise document to 'Upgrade to Next Revision Level'", () => {
      it("Navigate to created document", () => {
        cy.dlSelectFirstDocumentWithoutApi();
      });

      it("Revise document with 'Next Revision' option", () => {
        cy.drClickReviseDocument();
        cy.drChooseTypeOfRevisionChangeOption({ option: "Upgrade to Next Revision Level" });
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Create AR for reviseed document to 'Upgrade to Next Revision Level'", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click Create a Approval Request button", () => {
        cy.cmpClickCreateApprovalRequestWithoutApi();
      });

      it("Enter title AR title: 'AR for Upgrade to Next Revision Level'", () => {
        cy.arEnterApprovalRequestTitle({ title: "AR for Upgrade to Next Revision Level" });
      });

      it("Enter description 'AR from New form template for approval request'", () => {
        cy.arEnterApprovalRequestDescription(
          { description: "AR for testing document that has been revised to 'Upgrade to Next Revision Level'" });
      });

      it("Add created document revision", () => {
        cy.arSelectItemsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.arAddItems();
        cy.arSelectItem({ name: documentRevisionName });
        cy.arEnterItemDescription({ description: "added document description" });
        cy.arEnterItemJustification({ justification: "justification for added document" });
        cy.arClickAddItemDone();
      });

      it("Click Save button", () => {
        cy.arSaveApiCallWithoutApi();
      });

      // TODO: data-cy=\"fb-approvers-approvers\"]").should(be.disabled");

      it("Add first approver to approval request on approver list", () => {
        cy.arSelectApprovalTab();
        cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email });
      });

      it("Click Save button", () => {
        cy.arSaveApiCallWithoutApi();
      });

      it("Click send to review", () => {
        cy.arClickSendToReviewWithoutApi();
      });
    });

    context("Approve submission and close AR", () => {
      it("Click approve submission", () => {
        cy.arApproveARWithoutApi();
      });

      it("Click close AR", () => {
        cy.arCloseAR();
      });
    });

    context("Verify 'Upgrade to Next Revision Level' revision is shown on document list", () => {
      it("Verify 'Test document for revising' revision is set to '1A'", () => {
        SystemRequirement("REQ-0580", "REQ-0370");
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
        cy.dlSelectFirstDocumentWithoutApi();
      });

      it("Revise document with 'Obsolete' option", () => {
        cy.drClickReviseDocument();
        cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Create AR for reviseed document to 'Obsolete'", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
      });

      it("Enter title AR title: 'AR for Upgrade to Obsolete'", () => {
        cy.arEnterApprovalRequestTitle({ title: "AR for Upgrade to Obsolete" });
      });

      it("Enter description 'AR from New form template for approval request'", () => {
        cy.arEnterApprovalRequestDescription(
          { description: "AR for testing document that has been revised to 'Obsolete'" });
      });

      it("Add created document revision", () => {
        cy.arSelectItemsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.arAddItems();
        cy.arChoseSpecificProposedDocument({ name: documentRevisionName });
        cy.arEnterItemDescription({ description: "added document description" });
        cy.arEnterItemJustification({ justification: "justification for added document" });
        cy.arClickAddItemDone();
      });

      it("Click Save button", () => {
        cy.arSaveApiCallWithoutApi();
      });

      it("Add first approver to approval request on approver list", () => {
        cy.arSelectApprovalTab();
        cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email });
      });

      it("Click Save button", () => {
        cy.arSaveApiCallWithoutApi();
      });

      it("Click send to review", () => {
        cy.arClickSendToReviewWithoutApi();
      });
    });

    context("Approve submission and close AR", () => {
      it("Click approve submission", () => {
        cy.arApproveARWithoutApi();
      });

      it("Click close AR", () => {
        cy.arCloseAR();
      });
    });

    context("Verify 'Upgrade to Next Revision Level' revision is shown on document list", () => {
      it("Verify 'Test document for revising' revision is set to 'OBS'", () => {
        SystemRequirement("REQ-0580", "REQ-0370");
        cy.navigToDocumentList();

        cy.dlClearFilters();

        cy.dlFilterByStatus({ status: "Obsolete" });

        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });

        cy.dlVerifyFilterByRev({ revision: "OBS" });
      });
    });
  });
});
