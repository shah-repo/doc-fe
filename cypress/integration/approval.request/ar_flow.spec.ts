import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
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

context("Approval request form", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
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
              docId: "CS-00004",
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

  context("Create new AR form", () => {
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocument();
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CS-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[2].email });
    });

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Click send to review", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status", () => {
      SystemRequirement("REQ-0730");
      SystemRequirement("REQ-0740");
      SystemRequirement("REQ-0020");
      cy.arVerifyStatus({ status: "In Review" });
    });
  });

  context("Check document revision is in review", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "In Review" });
    });

    it("Check document revision status", () => {
      cy.drCheckDocumentStatus({ status: "In Review" });
    });
  });

  context("Approve created AR", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "In Review" });
    });

    it("Approve AR", () => {
      SystemRequirement("REQ-0920");
      cy.arApproveAR();
    });

    it("Check approval request status is approved", () => {
      SystemRequirement("REQ-0730");
      SystemRequirement("REQ-0020");
      cy.arVerifyStatus({ status: "Approved" });
    });
  });

  context("Check document revision is Released", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Released" });
    });

    it("Check document revision status is released", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

});

export { };

