// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;

context("Regular Records test", () => {
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
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });
  });

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeToDevs.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create Record with form", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "first record title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context("Creates document and releases it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Verify approvals field is automatically added", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create new Record", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Record title" });
    });

    it("Enters description 'Record description'", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
    });

    it("Save Record'", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Created Record appear in Recent tab", () => {
    it("Goto dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Record should appear in Recent", () => {
      SystemRequirement("REQ-5030");
      cy.dashNavigRecentTab();
      cy.get(`[id="scrollable-auto-tabpanel-recent"] .MuiListItem-root`).eq(0)
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title");
    });
  });

  context("Add approvers to Record", () => {
    it("Open Record", () => {
      cy.contains("RD-00003").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approver'", () => {
      cy.contains("Approvals").should("exist");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");

      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Save Record'", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Check notifications on dashboard", () => {
    it("Goto dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Owner should get a notification that Record is in review and pending approval from 2 users", () => {
      cy.dashNavigMyFeedTab();
      cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[1].name}`)
        .and("contain.text", `${USERS[2].name}`);
    });
  });

  context("User 2 approve the Record", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Click approve for the Record", () => {
      cy.dashNavigToDoTab();
      cy.dashApproverFirstFromListWithoutApi();
    });
  });

  context("Check notifications on owner dashboard", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Owner should get a notification that Record is in review and pending approval from 1 user", () => {
      cy.dashNavigMyFeedTab();
      cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[1].name}`);
    });

    it("Click approve for the Record", () => {
      cy.dashNavigToDoTab();
      cy.dashApproverFirstFromListWithoutApi();
    });

    it("Record notification should change to Released", () => {
      cy.dashNavigMyFeedTab();
      cy.contains("RELEASED").parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", "Record title");
    });
  });
});

export { };

