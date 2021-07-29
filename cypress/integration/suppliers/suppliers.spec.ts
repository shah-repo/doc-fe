
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let supplierDocumentType;
let adminEmployee;
let group;

context("Create company via API and create Suppliers document", () => {
  it("[API] Creates company", (done: any) => {
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
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: IMPORTER_USER.email,
          numOfRevStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [USERS[2], USERS[3], USERS[4]],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        done();
      });
    });
  });

  it("[API] Login admin tester", (done: any) => {
    cy.authApiLogin({
      email: USERS[1].email,
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      multipleCompanies = loginResponse.employees.length > 1 ? true : false;
      done();
    });
  });

  it("[API]Creates suplier document", (done: any) => {
    cy.grpGetGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: adminEmployee.id,
      groupName: "Everyone",
    }).then((response) => {
      group = response;
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Supplier Document</p>",
          document: {
            docId: "SUP-00004",
            documentType: {
              id: supplierDocumentType[0].id,
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
          name: "API supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });

  it("Logs user in", () => {
    cy.authLogin({
      email: USERS[1].email,
      password: "Tester1!",
    });
  });

  it("Selects company", () => {
    cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
  });

  it("Navigate to document list", () => {
    cy.navigToDocumentList();
  });

  it("Click on 'Create a document'", () => {
    cy.cmpClickCreateNewDocument();
  });

  it("Enter title 'New Supplier Form'", () => {
    cy.drEnterDocumentTitle({ name: "New Supplier Form" });
  });

  it("Enter description 'New Supplier Form description'", () => {
    cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
  });

  it("Click on 'Form' document type", () => {
    cy.drSelectDocumentType({ documentType: "Form" }).wait(500);
  });

  it("Click on 'Supplier' document type", () => {
    SystemRequirement("REQ-2400");
    cy.drSelectOutputDocumentType({ documentType: "Supplier" }).wait(500);
  });

  it("Select 'Numeric' revision stage", () => {
    cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateDocumentWithApiCall();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocumentWithoutSelectingForm();
  });

  it("Navigate to supplier list", () => {
    SystemRequirement("REQ-2230");
    cy.navigToSuppliers();
  });

  it("Create supplier from Form document", () => {
    SystemRequirement("REQ-2330");
    cy.supCreateNew();
  });

  it("Enter 'Supplier Address/Phone'", () => {
    SystemRequirement("REQ-2360");
    cy.drEnterDocumentDescription({ description: "Test Supplier address" });
  });

  it("Enter 'Supplier Name'", () => {
    SystemRequirement("REQ-2360");
    cy.supEnterSuppName({ name: "Test Supplier" });
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateSupplierWithApiCall();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocumentWithoutSelectingForm();
  });

  it("Navigate to supplier list", () => {
    cy.navigToSuppliers();
  });

  it("Filter supplier Title/Name", () => {
    cy.filterSupplierTitle({ name: "Test" }).wait(300);
  });

  it("Check for filtered values", () => {
    SystemRequirement("REQ-2320");
    cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
  });

  it("Clear filter", () => {
    SystemRequirement("REQ-2310");
    cy.filterClear().wait(300);
    cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
  });

  it("Click on existing supplier file from list", () => {
    SystemRequirement("REQ-2340");
    cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00001" });
  });

  it("Navigate to document list", () => {
    cy.navigToDocumentList();
  });

  it("Click on 'Create a document'", () => {
    cy.cmpClickCreateNewDocument();
  });

  it("Enter title 'New Supplier Form'", () => {
    cy.drEnterDocumentTitle({ name: "New Supplier Form 2" });
  });

  it("Enter description 'New Supplier Form description'", () => {
    cy.drEnterDocumentDescription({ description: "New Supplier Form description 2" });
  });

  it("Click on 'Form' document type", () => {
    cy.drSelectDocumentType({ documentType: "Form" }).wait(500);
  });

  it("Click on 'Supplier' document type", () => {
    cy.drSelectOutputDocumentType({ documentType: "Supplier" }).wait(500);
  });

  it("Select 'Numeric' revision stage", () => {
    cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateDocumentWithApiCall();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocumentWithoutSelectingForm();
  });

  it("Navigate to supplier list", () => {
    cy.navigToSuppliers();
  });

  it("Click on create supplier to prompt option of which supplier form we should use", () => {
    SystemRequirement("REQ-2350");
    cy.supCreateNew();
  });

  it("Check if forms are suggested on creating new supplier", () => {
    SystemRequirement("REQ-2350");
    cy.supCheckForSuggestedForms("New Supplier Form", "New Supplier Form 2");
  });
});

export { };

