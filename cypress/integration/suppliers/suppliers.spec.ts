/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Create company via API and create Suppliers document", () => {
  it("[API] Creates company", (done: any) => {
    cy.authApiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;

      cy.cmpCreateCompany({
        payload: {
          companyAdminEmail: "enlil.testmail+cy1@gmail.com",
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: "enlil.testmail+cy5@gmail.com",
          maxRevisionStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [
            {
              name: "Second Tester",
              email: "enlil.testmail+cy2@gmail.com",
            },
            {
              name: "Third Tester",
              email: "enlil.testmail+cy3@gmail.com",
            },
            {
              name: "Fourth Tester",
              email: "enlil.testmail+cy4@gmail.com",
            }],
          documentTypes: [
            {
              documentTypeName: "Clinical Protocol",
              documentTypeAcronym: "CP",
              group: "OTHER",
              isQms: true,
            },
          ],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        done();
      });
    });
  });

  it("[API] Login second tester", (done: any) => {
    cy.authApiLogin({
      email: "enlil.testmail+cy1@gmail.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      multipleCompanies = loginResponse.employees.length > 1 ? true : false;
      done();
    });
  });

  it("Logs user in", () => {
    cy.authLogin({
      email: "enlil.testmail+cy1@gmail.com",
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
    cy.drSelectOutputDocumentType({ documentType: "Supplier" }).wait(500);
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });

  it("Navigate to supplier list", () => {
    SystemRequirement("REQ-2230");
    cy.navigToSuppliers();
  });

  it("Create supplier from Form document", () => {
    SystemRequirement("REQ-2330");
    cy.supCreateNew().wait(1000);
  });

  it("Enter 'Supplier Address/Phone'", () => {
    SystemRequirement("REQ-2360");
    cy.supEnterSuppAddressPhone({ address: "Test Supplier address" });
  });

  it("Enter 'Supplier Name'", () => {
    SystemRequirement("REQ-2360");
    cy.supEnterSuppName({ name: "Test Supplier" });
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });

  it("Navigate to supplier list", () => {
    SystemRequirement("REQ-2230");
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

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });

  it("Navigate to supplier list", () => {
    SystemRequirement("REQ-2230");
    cy.navigToSuppliers();
  });

  it("Click on create supplier to prompt option of which supplier form we should use", () => {
    SystemRequirement("REQ-2350");
    cy.supCreateNew().wait(1000);
  });

  it("Check if forms are suggested on creating new supplier", () => {
    SystemRequirement("REQ-2350");
    cy.supCheckForSuggestedForms("New Supplier Form", "New Supplier Form 2");
  });
});

export { };

