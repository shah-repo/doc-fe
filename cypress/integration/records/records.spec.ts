// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");
let createdCompany;
let loginResponse;
let multipleCompanies;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;

context("Records flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
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
                documentTypeName: "Record Document",
                documentTypeAcronym: "RD-",
                category: "Record",
                group: "RECORD",
                isQms: true,
              },
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create first Record with form", () => {
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
      it("Enters title 'Lot History Record'", () => {
        cy.drEnterDocumentTitle({ name: "Lot History Record" });
      });

      it("Enters description 'Lot History Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Lot History Record description" });
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

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create second Record with form", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title 'Approval Record'", () => {
        cy.drEnterDocumentTitle({ name: "Approval Record" });
      });

      it("Enters description 'Approval Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Approval Record description" });
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

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Check if there are multiple record forms to select", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Create new record button click", () => {
      SystemRequirement("REQ-2770");
      cy.recCreateRecordFromLandingPage();
    });

    it("Check if multiple record forms exist", () => {
      SystemRequirement("REQ-0970");
      cy.recCheckIfMultilpeFormsAreAvailable({
        recordType: "Record Document",
        recordForms: ["Approval Record", "Lot History Record"],
      });
    });
  });

  context("Create new record without inline approval form and check if they are in alpha revision", () => {
    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Approval Record' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record Document", recordForm: "Approval Record" });
    });

    it("Check if revision is in alpha revision stage", () => {
      SystemRequirement("REQ-1030");
      cy.recCheckRevisionStage({ stage: "Revision A" });
    });
  });

  context("Fill in record attributes and release", () => {
    it("Enters title 'Approval Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Approval Record title" });
    });

    it("Enters description 'Approval Record description'", () => {
      cy.drEnterDocumentDescription({ description: "Approval Record description" });
    });

    it("Select approver'", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
        cy.get("[data-cy*=fb-approvals-]").type(USERS[2].name + "{downarrow}{enter}");
      });
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Finalize and release button click'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });
  });

  context("Approve form and close it", () => {
    it("Approve record button click", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
      cy.checkToastMessage({ exists: false });
    });

    it("Check if approved date exists", () => {
      SystemRequirement("REQ-1010");
      cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
    });

    context("Check for Landing page columns and values", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Check if most recent added item is fist on list", () => {
        cy.filterGetFirstValueFromList({ value: "RD-00004" });
      });

      it("Check for Landing page default columns", () => {
        SystemRequirement("REQ-2740");
        cy.filterCheckHeaderValues("ID",
          "Revision", "State",
          "Title",
          "Owner",
          "Released Date",
          "Form ID");
      });
    });

    context("Test the filter inside Records landing page", () => {
      it("Enter all fields to check if all filter fields are working", () => {
        SystemRequirement("REQ-2750");
        cy.filterRecords({
          docId: "RD-00004", revision: "A", state: "Released", title: "Approval", owner: USERS[2].name,
          releasedDate: "Last 7 days", formId: "FM-00003",
        }).wait(2000);
      });

      it("Navigate to Document List", () => {
        cy.wait(1000).navigToDocumentList();
      });

      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Check if all filter values persist after changing landing page", () => {
        cy.filterCheckIfRecordsFilterPersists({
          docId: "RD-00004", revision: "A", state: "Released", title: "Approval", owner: USERS[2].name,
          releasedDate: "Last 7 days", formId: "FM-00003",
        });
      });

      it("Clear filter", () => {
        cy.filterClear();
      });
    });
  });
});


export { };

