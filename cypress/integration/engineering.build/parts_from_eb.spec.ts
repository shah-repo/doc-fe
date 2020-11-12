// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;
const currentDate = moment().startOf("day").tz("America/Los_Angeles").format("MMMM D, YYYY");

const NO_PART_TOAST_ERROR_MESSAGE = "can't be RELEASED without linked Parts";
const NOT_RELEASED_TOAST_ERROR_MESSAGE = "Last docRev for Part linked to EB after copying is not in RELEASED status.";
const PART_DOCUMENT_TYPE_NAME = "Part";
const EXISTING_PART_NAME = "Test Part";
const NEW_PART_NAME = "New Part";

context("Parts from EB flow test", () => {
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
    it("[API]Create company", (done: any) => {
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
                documentTypeName: PART_DOCUMENT_TYPE_NAME,
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
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
    it("Log user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create EB form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the form attributes", () => {
      it("Enter title 'Engineering Build Form", () => {
        cy.drEnterDocumentTitle({ name: "Engineering Build Form" });
      });

      it("Enter description 'Engineering Build Form description'", () => {
        cy.drEnterDocumentDescription({ description: "Engineering Build Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });

      it("Verify that Approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Create the form and release it", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create an EB with an existing part", () => {
    context("Create a part", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in the part attributes", () => {
        it(`Enter title '${EXISTING_PART_NAME}'`, () => {
          cy.drEnterDocumentTitle({ name: EXISTING_PART_NAME });
        });

        it("Enter description 'Test Part description'", () => {
          cy.drEnterDocumentDescription({ description: "Test Part description" });
        });

        it(`Select '${PART_DOCUMENT_TYPE_NAME}' document type from dropdown`, () => {
          cy.drSelectDocumentType({ documentType: PART_DOCUMENT_TYPE_NAME });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });
      });

      context("Create part", () => {
        it("Click Create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Create an EB", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Click on Create new", () => {
        cy.poClickCreatePO();
      });

      it("Select 'Engineering Build' from the dropdown", () => {
        cy.recSelectRecordFormFromMultiSelect({
          recordType: "Engineering Build",
        });
      });
    });

    context("Fill in the EB attributes", () => {
      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Add an Approval'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("[data-cy*=fb-approvals-]").type(USERS[2].name + "{downarrow}{enter}");
        });
      });

      it("Save the EB", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });
    });

    context("Verify that EB cannot be sent to review without a children part", () => {
      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });

      it("Check for the toast error", () => {
        cy.checkToastMessageContains({ message: NO_PART_TOAST_ERROR_MESSAGE });
      });
    });

    context("Choose a part and submit for approval", () => {
      it("Choose an existing part from the list of available parts", () => {
        cy.get("[data-cy=\"childrenParts\"]").type(EXISTING_PART_NAME + "{downarrow}{enter}");
      });

      it("Save EB", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });

      it("Submit for Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: EXISTING_PART_NAME });
      });
    });

    context("Approve and release the EB", () => {
      it("Approve record button click", () => {
        cy.ebApprove();
      });

      it("Check if Approved date exists", () => {
        SystemRequirement("REQ-1010");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the Part is displayed in summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: EXISTING_PART_NAME });
      });
    });
  });

  context("Create an EB with a new part", () => {
    context("Create an EB", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Click on Create new", () => {
        cy.poClickCreatePO();
      });

      it("Select 'Engineering Build' from the dropdown", () => {
        cy.recSelectRecordFormFromMultiSelect({
          recordType: "Engineering Build",
        });
      });
    });

    context("Fill in the EB attributes", () => {
      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Add an Approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("[data-cy*=fb-approvals-]").type(USERS[2].name + "{downarrow}{enter}");
        });
      });

      it("Save the EB", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });
    });

    context("Add a new part via EB", () => {
      it("Open Create a New Part dialog", () => {
        cy.get("[data-cy=\"form.builder.create.new.part\"]").click();
      });

      context("Fill in the required attributes and create the part", () => {
        it("Enter part name", () => {
          cy.ebEnterPartName({ name: NEW_PART_NAME });
        });

        it("Enter part description", () => {
          cy.ebEnterPartDescription({ description: NEW_PART_NAME });
        });

        it("Choose a document type", () => {
          cy.ebChoosePartType({ partName: PART_DOCUMENT_TYPE_NAME });
        });

        it("Create the part", () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

    });

    context("Submit for Approval", () =>  {
      it("Save EB", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });

      it("Submit for Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Check if Part is displayed in summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });

    });

    context("Approve and release the EB", () => {
      it("Click on the Approve button", () => {
        cy.ebApprove();
      });

      it("Check if Approved date exists", () => {
        SystemRequirement("REQ-1010");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });
    });
  });

  context("Copy to EB", () => {
    context("Create the next build of EB", () => {
      it("Click Copy to EB button", () => {
        cy.get("[data-cy=\"PreviewControlsContainer-copy-to\"]").click();
      });

      it("Verify that the selected part is copied to the new build", () => {
        cy.get("[data-cy=\"childrenParts\"]").should("contain.text", NEW_PART_NAME);
      });
    });

    context("Submit for Approval", () => {
      it("Save the EB", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });

      it("Add an Approval", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("[data-cy*=fb-approvals-]").type(USERS[2].name + "{downarrow}{enter}");
        });
      });

      it("Submit for Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });
    });

    context("Verify that EB cannot be released unless 1st revision of part is released", () => {
      it("Try approving the EB", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.get("[data-cy=\"common.confirm\"]").click();
      });

      it("Check for a toast error", () => {
        cy.checkToastMessageContains({ message: NOT_RELEASED_TOAST_ERROR_MESSAGE });
      });
    });

    context("Release the part", () => {
      it("Navigate to the part document", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").click();
      });

      it("Approve and release the part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Approve and release the EB", () => {
      it("Navigate to the EB", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").click();
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").click();
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });

      it("Check if Approved date exists", () => {
        SystemRequirement("REQ-1010");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });
    });

    context("Check if a new revision of part has been created", () => {
      it("Navigate to the part document", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").click();
      });

      it("Verify that a new revision has been created", () => {
        cy.ebVerifyNewRevisionCreated();
      });
    });
  });
});

export { };
