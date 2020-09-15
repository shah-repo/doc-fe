/* eslint-disable max-classes-per-file */
// / <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;


context("Document list test", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440", "REQ-0460");
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
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Part",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Testing",
                documentTypeAcronym: "CT-",
                group: "OTHER",
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Report",
                documentTypeAcronym: "CR-",
                group: "OTHER",
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
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

  context("Create first document", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision 1'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision 1" });
    });

    it("Enters description 'New Document Revision description 1'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description 1" });
    });

    it("Selects 'Clinical Protocol' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Checks if document type id is 'CP-00001'", () => {
      SystemRequirement("REQ-0320", "REQ-0460");
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00001" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create second document with same document prefix", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision 2'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision 2" });
    });

    it("Enters description 'New Document Revision description 2'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description 2" });
    });

    it("Selects 'Clinical Part' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Part" });
    });

    it("Checks if document type id is 'CP-00002'", () => {
      SystemRequirement("REQ-0320", "REQ-0460");
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00002" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create third document with same document prefix", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision 3'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision 3" });
    });

    it("Enters description 'New Document Revision description 3'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description 3" });
    });

    it("Selects 'Clinical Protocol' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Checks if document type id is 'CP-00003'", () => {
      SystemRequirement("REQ-0320", "REQ-0460");
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00003" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create fourth document with different document prefix", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision 4'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision 4" });
    });

    it("Enters description 'New Document Revision description 4'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description 4" });
    });

    it("Selects 'Clinical Testing' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Testing" });
    });

    it("Checks if document type id is 'CT-00001'", () => {
      SystemRequirement("REQ-0320", "REQ-0450");
      cy.drCheckIfDocumentIdMatches({ docId: "CT-00001" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create fifth document with different document prefix", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Document Revision 5'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision 5" });
    });

    it("Enters description 'New Document Revision description 5'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description 5" });
    });

    it("Selects 'Clinical Report' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Clinical Report" });
    });

    it("Checks if document type id is 'CR-00001'", () => {
      SystemRequirement("REQ-0320", "REQ-0450");
      cy.drCheckIfDocumentIdMatches({ docId: "CR-00001" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });
});

