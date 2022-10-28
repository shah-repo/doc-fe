// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { FormOperatorsType } from "../../utils/constants/documentTypes/form";
import { LotHistoryRecordOperators } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginSecond;
let employeeLoginThird;
let employeeLoginFourth;
let employeeLoginSeventh;

context("Document Field Owners Test", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4], USERS[7]],
            documentTypes: [
              FormOperatorsType,
              LotHistoryRecordOperators,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginSecond = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          employeeLoginThird = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          employeeLoginFourth = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          employeeLoginSeventh = createdCompany.employees.find((employee) => employee.user.email === USERS[7].email);
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLoginSecond.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Select 'Form Operators' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form Operators" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot Hisotry Record Operators" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "Text Field for " + USERS[3].name });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field for " + USERS[4].name });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
      cy.wait(5000);
    });

    it("Click on sidebar permission icon to add Operators", () => {
      cy.drSelectPermissionTab();
    });

    it(`Select '${USERS[3].name}' to Assign document to`, () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drAssignDocumentTo({ username: USERS[3].name });
      });
    });

    it("Click on sidebar permission icon to add Operators", () => {
      cy.drSelectPermissionTab();
    });

    it(`Select '${USERS[4].name}' to Assign document to`, () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drAssignDocumentTo({ username: USERS[4].name });
      });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: employeeLoginThird.id });
    });
  });

  context(`Open created document and check for operators restrictions`, () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by id and status, and select it", () => {
      cy.recFilterRecordListByIdAndStatus({ id: "LHRO-00003", status: "Draft" });
    });

    it("Check if Document Type input field is disabled", () => {
      cy.get("[id='documentType']input").should("have.attr", "type", "hidden");
    });

    it("Check if Document ID field is disabled", () => {
      cy.get("[id='document.docId']input").should("be.disabled");
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='text-field-for']").arrowType("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: employeeLoginFourth.id });
    });
  });

  context(`Add new textbox field for operator '${USERS[4].name}'`, () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by id and status, and select it", () => {
      cy.recFilterRecordListByIdAndStatus({ id: "LHRO-00003", status: "Draft" });
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='new-text-field-for']").arrowType("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Check field from other colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.be.disabled");
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLoginSecond.id });
    });
  });

  context("Check fields are disabled for user that is not field owner, and change owner of document", () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by id and status, and select it", () => {
      cy.recFilterRecordListByIdAndStatus({ id: "LHRO-00003", status: "Draft" });
    });

    it("Check field from first colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.be.disabled");
    });

    it("Check field from second colaborator is disabled", () => {
      cy.get("[name^='new-text-field-for']").should("be.be.disabled");
    });

    it(`Change owner to '${USERS[7].name}'`, () => {
      cy.drChangeOwnerFromMenu({ employee: USERS[7].name });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Log in with another user and approve document", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[7], employeeId: employeeLoginSeventh.id });
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by id and status, and select it", () => {
      cy.recFilterRecordListByIdAndStatus({ id: "LHRO-00003", status: "Draft" });
    });

    it("Check field from first colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.disabled");
    });

    it("Check field from second colaborator is disabled", () => {
      cy.get("[name^='new-text-field-for']").should("be.disabled");
    });

    it("Add Approver on document", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[7].name });
    });

    it("Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify status is 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });
});

export { };


