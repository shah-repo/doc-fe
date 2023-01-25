// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { LINE_ITEMS_STATUS_TYPES, STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let approvalRequestDocumentType;
let initialArDocument;
let createdDocumentRevResponse;
let createdDocumentRevResponse2;
const documentRevisionName = "New document for testing approval request list";
const documentRevisionName2 = "New document for testing approval request list two";
const approvalRequestName = "Approval request for testing 1";
const approvalRequestName2 = "Approval request for testing 2";

context("Approval request landing page test", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

    it("[API]Create document revisions for approval request list test", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description1</p>",
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
        }).then((response) => {
          createdDocumentRevResponse = response;
        });
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description2</p>",
            document: {
              docId: "CP-00005",
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
            name: documentRevisionName2,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdDocumentRevResponse2 = response;
          done();
        });
      });
    });

    it("[API]Create approval requests for created document revisions", () => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.arCreateApprovalRequest({
          payload: {
            title: approvalRequestName,
            description: "Description for first approval request",
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            formInput: {
              documentRevisions: [{
                proposedDocumentRevision: { id: createdDocumentRevResponse.id },
                descriptionOfChange: "ar test",
                justificationOfChange: "ar test",
                id: faker.random.uuid(),
              }],
            },
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        });
        cy.arCreateApprovalRequest({
          payload: {
            title: approvalRequestName2,
            description: "Description for second approval request",
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            formInput: {
              documentRevisions: [{
                proposedDocumentRevision: { id: createdDocumentRevResponse2.id },
                descriptionOfChange: "ar test",
                justificationOfChange: "ar test",
                id: faker.random.uuid(),
              }],
            },
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Check approval list defaults to draft and in review status for AR at start of session", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
    });
  });

  context("Prepare approval request", () => {
    it("Filter ar by name and status, and select it", () => {
      SystemRequirement("REQ-0830");
      cy.arFilterARListByNameAndStatusWithoutApi({ title: approvalRequestName, status: STATUS_TYPES_LABEL.DRAFT  });
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email });
      cy.arSaveApiCallWithoutApi();
    });

    it("Send to review", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestListWithoutApi();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });
  });

  context("Verify most recent edited AR is first on list", () => {
    it("Verify first AR is: " + approvalRequestName, () => {
      SystemRequirement("REQ-0800");
      cy.alVerifyFilterByTitle({ title: approvalRequestName });
    });
  });

  context("Check for AR-s only on approval list", () => {
    it("Check only approval requests are shown on approval list", () => {
      SystemRequirement("REQ-0760");
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
    });
  });

  context("Check for filters on approver request list", () => {
    context("Check AR ID filter", () => {
      it("Filter list by AR ID", () => {
        cy.alFilterByArId({ arId: "AR99999" });
      });

      it("Verify filter by AR ID", () => {
        SystemRequirement("REQ-0770", "REQ-0750", "REQ-4640", "REQ-3390");
        cy.alVerifyFilterByArId({ arId: "AR99999" });
      });

      it("Verify approval counter on document list", () => {
        SystemRequirement("REQ-0820");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check AR title filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by TITLE", () => {
        cy.alFilterByTitle({ title: approvalRequestName2 });
      });

      it("Verify filter by TITLE", () => {
        SystemRequirement("REQ-0770", "REQ-0750");
        cy.alVerifyFilterByTitle({ title: approvalRequestName2 });
      });

      it("Verify approval counter on document list", () => {
        SystemRequirement("REQ-0820");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check OWNER filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by OWNER", () => {
        cy.alFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify filter by OWNER", () => {
        SystemRequirement("REQ-0770", "REQ-0750");
        cy.alVerifyFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify approval counter on document list", () => {
        SystemRequirement("REQ-0820");
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check STATUS filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by STATUS", () => {
        cy.alFilterByStatus({ status: STATUS_TYPES_LABEL.CLOSED });
      });

      it("Verify filter by STATUS", () => {
        SystemRequirement("REQ-0770", "REQ-0750");
        cy.alVerifyFilterByStatus({ status: STATUS_TYPES_LABEL.CLOSED });
      });

      it("Verify approval counter on document list", () => {
        SystemRequirement("REQ-0820", "REQ-4670");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check for maintaining approval request list filter options", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by status", () => {
        cy.alFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.IN_REVIEW });
      });

      it("Filter list by approval request title", () => {
        cy.alFilterByTitle({ title: approvalRequestName });
      });

      it("Navigate to Dashboard", () => {
        cy.navigToDashboardWithoutApi();
      });

      it("Navigate back to approval request list", () => {
        cy.navigToApprovalRequestListWithoutApi();
      });

      it("Verify filter by status", () => {
        SystemRequirement("REQ-0790");
        cy.alVerifyFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.IN_REVIEW });
      });

      it("Verify filter by document title", () => {
        SystemRequirement("REQ-0790", "REQ-2290", "REQ-4650");
        cy.alVerifyFilterByTitle({ title: approvalRequestName });
      });
    });

    context("Check clear button is clearing all filters", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Verify filters are cleared", () => {
        SystemRequirement("REQ-0810", "REQ-4660", "REQ-3400");
        cy.alVerifyFilterClear();
      });
    });
  });
  context("Verify description is shown on hover", () => {
    it("Verify description", () => {
      SystemRequirement("REQ-0840");
      cy.alVerifyDescriptionOnHover({ description: "Description for first approval request" });
    });
  });
});
