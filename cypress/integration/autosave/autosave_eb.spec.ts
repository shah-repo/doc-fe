// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let group;
let partDocumentType;
let createdPartDocument;
let approvalRequestDocumentType;
let initialArDocument;

context("Autosave EB test", () => {
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
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create part document", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document1</p>",
              document: {
                docId: "PRT-00001",
                documentType: {
                  id: partDocumentType[0].id,
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
              name: "Part document1",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
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
    });

    context("Create the form and release it", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add EB Procedure", () => {
        cy.drSelectProcedureTab();
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.fbAddNewFieldButton();
        });
      });

      it("Verify that Approvals field is automatically added", () => {
        cy.drSelectOverviewTab();
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create an EB document", () => {
    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title 'Test Engineering Build'", () => {
      cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
    });

    it("Enter description 'Test Engineering Build description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
    });

    it("Fill step #1 description and check autosave", () => {
      cy.drSelectProcedureTab();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      });
    });

    it("Add attachment and check autosave", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.elUploadAttachment({
          fileName: "image.jpg",
          el: "fb-mediaalbum-upload-",
        });
      });
    });

    it("While autosaving fill step #1 description and check autosave", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });

    it("Add 'Material' to step #1 and check autosave", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
        cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
      });
      cy.get("[data-cy=\"title\"]").autocompleteSelect("Part document");
      cy.get("[data-cy=\"partLot\"]").arrowType("test");
      cy.get("[name=\"quantity\"]").arrowType("2");
      cy.get("[data-cy=\"unit\"]").autocompleteSelect("Day");
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("While autosaving add 'Equipment' to step #1 and check autosave", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");
      cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
      cy.get("[data-cy=\"title\"]").arrowType("Equipment");
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });

    it("While autosaving, delete Material and check for autosave", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").parent()
        .find("button").last().arrowClick();
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });

    it("Delete attachment and check autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[id^=\"fb-mediaalbum-upload-\"]").parent()
          .find("button").eq(3).arrowClick({ force: true });
      });
    });
  });

  context("Add/remove approver and check autosave", () => {
    it("Add first Approver'", () => {
      cy.drSelectOverviewTab();
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
      cy.reload();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("check approvers after reload page", () => {
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[2].name} - ${USERS[2].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.unClick();
    });

    it("Remove second Approver'", () => {
      cy.get(`[class*="MuiChip-root MuiAutocomplete-tag MuiChip-deletable"] div`).contains(USERS[2].email)
        .parent().parent().find("svg").arrowClick({ force: true });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.reload();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("check approvers after reload page", () => {
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
    });
  });

  context("Submit EB for approval", () => {
    it("Click 'Submit for Approval' button", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostDocRevInReview, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });
  });
});
