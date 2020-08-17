// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;
const inlineApprovalError = "cannot be released without every InlineApproval approved";

context("Record Control Flow", () => {
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
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
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
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Record Document",
                documentTypeAcronym: "RD-",
                group: "RECORD",
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
        email: "enlil.testmail+cy2@gmail.com",
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
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("FORM document creation flow", () => {

    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Inline Form Document Revision" });
      });

      it("Enters description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      context("Add Inline Approval fileds", () => {
        it("Adds inline approval field with approvers", () => {
          SystemRequirement("REQ-0980");
          cy.fbAddNewFieldOption();
          cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" }).wait(2000);
          cy.get("[data-cy=\"approvers\"]").wait(2000).type("enlil.testmail+cy2{downarrow}{enter}");
          cy.fbAddField().wait(5000);
        });

        it("Adds inline approval field with approver groups", () => {
          SystemRequirement("REQ-0980");
          cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" }).wait(2000);
          cy.get("[data-cy=\"approverGroups\"]").wait(2000).type("Everyone{downarrow}{enter}");
          cy.fbAddField();
        });
      });

      context("Creates document", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });
  });

  context("FORM document in DRAFT", () => {
    it("Approves and releases document", () => {
      cy.drApproveAndReleaseDocument();
    });

    it("Clicks on create new", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill in document attributes", () => {
      it("Enters title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
      });

      it("Enters description 'Record Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Record Document Revision description" }).wait(1000);
      });

      it("Saves Document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    it("Check inline approvals", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").should("not.be.disabled");
    });

    context("Approve Inline Approval", () => {
      it("Approves first Inline Approval", () => {
        cy.wait(5000).get("[data-cy=\"fb-control-btn\"]").first().click().wait(10000);
      });

      it("Reloads", () => {
        cy.reload();
      });

      it("Clicks on new version of document", () => {
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
      });

      context("Tries to Approve and Release document", () => {
        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocument();
        });

        it("Checks for inline approval error", () => {
          cy.get("[class=\"Toastify__toast-body\"]").contains(inlineApprovalError).should("exist");
        });

        it("Closes Approve and Release dialog", () => {
          cy.drCloseApproveAndReleaseDialog();
        });
      });

      context("Second Inline Approval", () => {
        it("Approves second Inline Approval", () => {
          cy.wait(5000).get("[data-cy=\"fb-control-btn\"]").last().click().wait(10000);
        });

        it("Reloads", () => {
          cy.reload();
        });

        it("Clicks on new version of document", () => {
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").first().click();
        });
      });

      context("Approve and Release document", () => {
        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocument();
        });
      });
    });
  });
});

export { };

