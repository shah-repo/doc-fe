// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let group;
let initialArDocument;
let partDocumentType;
let approvalRequestDocumentType;
let createdPartFormDocument;
let formDocumentType;
const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");

const NOT_RELEASED_TOAST_ERROR_MESSAGE = "Last docRev for Part linked to EB after copying is not in RELEASED status.";
const PART_DOCUMENT_TYPE_NAME = "Parts";
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    it("[API]Create Part form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part form</p>",
              document: {
                docId: "FM-00003",
                documentType: {
                  id: formDocumentType[0].id,
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
              name: "Part form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: partDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Log user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create EB form", () => {
    context("Start document creation flow", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

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
        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Navigate to parts", () => {
          cy.navigToParts();
        });

        it("Clicks on 'Add new part' button", () => {
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.GetRequiredApprovers,
            CyRoutes.DocPreview], () => {
            cy.ptClickCreateNewPart();
          });
        });
      });

      context("Fill in the part attributes", () => {
        it(`Enter title '${EXISTING_PART_NAME}'`, () => {
          cy.drEnterDocumentTitle({ name: EXISTING_PART_NAME });
        });

        it("Enter description 'Test Part description'", () => {
          cy.drEnterDocumentDescription({ description: "Test Part description" });
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
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
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Save the EB", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Choose a part and submit for approval", () => {
      it("Verify 'Existing Revision' and 'New Revision' options exist", () => {
        SystemRequirement("REQ-2960");
        cy.get("input[value=\"documentRevision\"]").parentsUntil("div").should("have.text", "Existing Revision");
        cy.get("input[value=\"document\"]").parentsUntil("div").should("have.text", "New Revision");
      });

      it("Choose an existing part from the list of available parts", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=\"childrenParts\"]").type(EXISTING_PART_NAME + "{downarrow}{enter}");
        });
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
        SystemRequirement("REQ-4320");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the Part is displayed in summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: EXISTING_PART_NAME });
      });
    });
  });

  context("Create an EB with a new part", () => {
    context("Create an EB", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

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
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Save the EB", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add a new part via EB", () => {
      it("Open Create a New Part dialog", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.create.new.part\"]").click();
        });
      });

      context("Fill in the required attributes and create the part", () => {
        it("Enter part name", () => {
          cy.ebEnterPartName({ name: NEW_PART_NAME });
        });

        it("Enter part description", () => {
          cy.ebEnterPartDescription({ description: NEW_PART_NAME });
        });

        it("Choose a document type", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetProposedDocId, CyRoutes.GetSpecificDocumentType], () => {
            cy.ebChoosePartType({ partName: PART_DOCUMENT_TYPE_NAME });
          });
        });

        it("Create the part", () => {
          SystemRequirement("REQ-2950");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });
      });
    });

    context("Submit for Approval", () =>  {
      it("Save EB", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
          });
        cy.wait(500);
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
        SystemRequirement("REQ-4320");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });
    });
  });

  context("Clone EB", () => {
    context("Create the next build of EB", () => {
      it("Click Clone EB button", () => {
        SystemRequirement("REQ-3000");
        cy.ebClickClone();
      });

      it("Verify that the selected part is copied to the new build", () => {
        SystemRequirement("REQ-3000");
        cy.get("[data-cy=\"childForRevise\"]").should("contains.attr", "value", "PRT-00005 - " + NEW_PART_NAME);
      });
    });

    context("Submit for Approval", () => {
      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
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
        cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
          const link = $el.attr("href");
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApprovers], () => {
            cy.visit(CONFIG.FE_URL + link);
          });
        });
      });

      it("Approve and release the part", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Approve and release the EB", () => {
      it("Navigate to the EB", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.part.of\"]").then(($el) => {
          const link = $el.attr("href");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.GetRequiredApproversDocRev,
            CyRoutes.GetAvailableApprovers,
            CyRoutes.DocPreview], () =>
          {
            cy.visit(CONFIG.FE_URL + link);
          });
        });

        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]").then(($el) => {
          const link = $el.attr("href");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.GetRequiredApproversDocRev,
            CyRoutes.GetAvailableApprovers,
            CyRoutes.DocPreview], () =>
          {
            cy.visit(CONFIG.FE_URL + link);
          });
        });
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });

      it("Check if Approved date exists", () => {
        SystemRequirement("REQ-1010");
        SystemRequirement("REQ-4320");
        cy.get("[id=\"Presenter-FBWorkspace\"]").contains(currentDate);
      });

      it("Check if the part is displayed in the document summary", () => {
        cy.ebCheckIfPartIsInSummary({ partName: NEW_PART_NAME });
      });
    });

    context("Check if a new revision of part has been created", () => {
      it("Navigate to the part document", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-form.builder.part\"]").then(($el) => {
          const link = $el.attr("href");
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetRequiredApprovers], () => {
            cy.visit(CONFIG.FE_URL + link);
          });
        });
      });

      it("Verify that a new revision has been created", () => {
        cy.ebVerifyNewRevisionCreated();
      });
    });
  });
});

export { };
