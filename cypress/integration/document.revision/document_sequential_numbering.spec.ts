// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginSecond;


context("Document sequential numbering test", () => {
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
    it("[API]Creates company - document types, start number, prefix of document", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440", "REQ-0460", "REQ-3610");
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
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Part",
                documentTypeAcronym: "CP-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Testing",
                documentTypeAcronym: "CT-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
              {
                documentTypeName: "Clinical Report",
                documentTypeAcronym: "CR-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginSecond = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });
});

