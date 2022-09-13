// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
//

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

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

const documentType = "Form";
const outputDocumentType = "Document Approval Matrix";

const documentName = "ENC-12612 Scenario 1";
const recordName = "Record 1";
const testName = "Verify Internal Type for LHR Template is LHRT";

context(testName, () => {
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

  context("Create document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: documentName });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`Select document type: ${documentType}`, () => {
      cy.drSelectDocumentType({ documentType });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select '${outputDocumentType}' output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocumentType });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
    });
  });

  context("Release document", () => {
    it("Add 'Approval Matrix' field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "Approval Matrix" });
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
    });
  });

  context(`Create ${recordName}`, () => {
    it("Create new", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: recordName });
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
    });

    it("Create Approval Role", () => {
      cy.drSelectApprovalRolesTab();
      cy.get("[data-cy=\"form.builder.add.another.role\"] > .MuiBox-root").click();
      cy.get("[data-cy=\"name\"]").arrowType("Role 1").wait(1000);
      cy.drEnterApprovingGroups("Groups Management");
      cy.drAddApprovalRole();
    });
  });

  context(`Verify ${recordName}`, () => {
    it("Verify matrix details", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get(".MuiTableBody-root")
        .should("contain", "LHRT-")
        .and("contain", "LHRT")
        .and("contain", "LHR Template");
    });
  });

  context("Verify in document type management", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Filter items", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("LHR Template").wait(1000);
      cy.get(`[aria-colindex="12"] [class="k-input"]`).arrowClick({ force: true });
      cy.get("li").contains("LHRT").arrowClick().wait(500);
      cy.get(`[data-grid-col-index="0"]`).should("exist");
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify Group for LHR Template in Document list", () => {
    it("Navigate to Document list", () => {
      cy.unClick();
      cy.navigToDocumentList();
    });

    it("Reload page", () => {
      cy.reload();
    });

    it("Verify Group for LHR Template", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          const item = res.body.find((item) => item.documentTypeName === "LHR Template");
          expect(item.group).to.equal("LHRT");
        });
      }).as("response");
    });
  });
});
