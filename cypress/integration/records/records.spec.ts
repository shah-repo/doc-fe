// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();
const currentDate = moment(new Date().toLocaleDateString("en-US")).format("MMMM DD, YYYY");
let createdCompany;
let loginResponse;
let multipleCompanies;

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
            companyAcronym: `T1${runId}`,
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
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
                category: "Record",
                group: "RECORD",
                isQms: true,
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

  context("Create first Record with form", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
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

      context("Add Approvals fileds", () => {
        it("Adds Approvals field", () => {
          SystemRequirement("REQ-0980");
          cy.fbAddNewFieldOption();
          cy.fbSelectItemFromNewFieldList({ field: "Approvals" }).wait(2000);
        });

        it("Click 'Add' button", () => {
          cy.fbAddField().wait(3000);
        });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocument();
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

      context("Add Approvals fileds", () => {
        it("Adds Approvals field", () => {
          SystemRequirement("REQ-0980");
          cy.fbAddNewFieldOption();
          cy.fbSelectItemFromNewFieldList({ field: "Approvals" }).wait(2000);
        });

        it("Click 'Add' button", () => {
          cy.fbAddField().wait(3000);
        });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocument();
        });
      });
    });
  });

  context("Check if there are multiple record forms to select", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Check if multiple record forms exist", () => {
      SystemRequirement("REQ-0970");
      cy.recCheckIfMultilpeFormsAreAvailable( "Approval Record", "Lot History Record" );
    });
  });

  context("Create new record without inline approval form and check if they are in alpha revision", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Approval Record' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordForm: "Approval Record" });
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
      cy.get("[data-cy*=fb-approvals-approvals-]").type(USERS[2].name + "{downarrow}{enter}");
    });

    it("Finalize and release button click'", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
      cy.wait(1000);
    });
  });

  context("Approve form and close it", () => {
    it("Approve record button click", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
    });

    it("Reload document", () => {
      cy.reload();
    });

    it("Check if approved date exists", () => {
      SystemRequirement("REQ-1010");
      cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
    });
  });
});


export { };
