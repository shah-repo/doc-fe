// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { BulkImport } from "../../utils/constants/documentTypes/bulkImport";
import { Calibration } from "../../utils/constants/documentTypes/calibration";
import { PurchaseOrderDocDTM } from "../../utils/constants/documentTypes/purchaseOrderDoc";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let adminEmployee;
let developersGroup;
let createdCompany;
let loginResponse;
let multipleCompanies;

context("document type management error validations", () => {
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
              BulkImport, OneTimeTrainingTest, TrainingCurriculum, Calibration, PurchaseOrderDocDTM,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Get group", () => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Navigation", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });
  });

  context("Error Validation for One time training", () => {
    it("Filter Document Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("one-Time Training").wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    context("Check validation after removing key and value pair", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema1.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Click on edit button", () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageContains({
          message: `An instance of SchemaItems has failed the validation`,
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing key", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema2.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing value", () => {
      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema3.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing some commas", () => {
      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema4.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation for duplicate Index", () => {
      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema5.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Click on edit button", () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "The details tab has elements with the following indices reused: 1",
        });
        cy.closeAllAlertMessages();
      });
    });
  });

  context("Error Validation for one-Time Training random text", () => {
    it("Filter Document Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("one-Time Training").wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    context("Check validation after adding random text", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/one_time_training/schema6.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Click on edit button", () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageContains({
          message: `each value in editorProperties must be one of the following values:`,
        });
        cy.closeAllAlertMessages();
      });
    });
  });

  context("Error Validation for Component Specifications lot random text", () => {
    it("Filter Document Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("Component Specification lot").wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    context("Check validation after removing key and value pair", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/lot/schema5.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Click on edit button", () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageContains({
          message: `An instance of SchemaItems has failed the validation`,
        });
        cy.closeAllAlertMessages();
      });
    });
  });

  context("Error Validation for LOT", () => {
    it("Filter Document Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("LOTS").wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    context("Check validation after removing key and value pair", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/lot/schema1.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Click on edit button", () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageContains({
          message: `An instance of SchemaItems has failed the validation`,
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing key", () => {
      it("Click on edit", () => {
        cy.dtmEditSchema({ index: 0 });
      });

      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/lot/schema2.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing value", () => {
      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/lot/schema3.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Check validation after removing some commas", () => {
      it("Update Text field", () => {
        cy.dtmUpdateTextField({ FilePath: "invalid_schemas/lot/schema4.txt" });
      });

      it("Click on Add", () => {
        cy.get("[type=submit]").eq(0).arrowClick();
        cy.wait(1000);
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "Please Enter Valid Schema",
        });
        cy.closeAllAlertMessages();
      });

      it("Click on close button", () => {
        cy.get("[role=\"presentation\"]").eq(23).arrowClick();
        cy.wait(1000);
      });
    });
  });
});

export { };
