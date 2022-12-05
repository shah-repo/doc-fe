// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let materialsDocumentType;
let materialsDocument;
let mpiDocumentType;
let mpiDocument;
let lhrtUrl;
let arUrl;
let secondEmployee;

context("LHRt using regular AR test", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });


    it("[API]Create equipment one", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
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
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create MPI document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                tabId: "details",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                tabId: "details",
                index: 1,
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorConfig: {
                  materials: [
                    {
                      id: "kolg5zka",
                      title: materialsDocument.id,
                      quantity: 1,
                      unit: "sets",
                    },
                  ],
                  equipment: [
                    {
                      id: "kolg6pz4",
                      title: equipmentDocument.id,
                    },
                  ],
                  description: "<p>Description of MPI step created with API</p>",
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
            ],
          },
          description: "<p>MPI created with API description</p>",
          name: "MPI created with API",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "PI-00008",
            securityList: {
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
              operators: [],
            },
            documentType: {
              id: mpiDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        mpiDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: mpiDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create LHRT document", () => {
    it("Navigate to Document list", () => {
      cy.unClick();
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'LHRt document'", () => {
      cy.drEnterDocumentTitle({ name: "LHRt document" });
    });

    it("Fill LHRt document description", () => {
      cy.drEnterDocumentDescription({ description: "LHRt document description" });
    });

    it("Select 'LHRt' document type", () => {
      cy.drSelectDocumentType({ documentType: "LHR template" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Lot History Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it(`Verify LHRT is in ${STATUS_TYPES_LABEL.DRAFT} status`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.url().then((url: any) => { lhrtUrl = url; });
    });

    it("Part to be Manufactured field should have text in red", () => {
      cy.get("[name=\"lhr-selected-part\"]").parent().parent()
        .find(".Mui-error").eq(1)
        .should("have.text", "The Part to be Manufactured is a required field.")
        .and("have.css", "color", "rgb(244, 67, 54)");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step\"]").arrowClick({ force: true });
      cy.wait(2000);
    });

    it("LHR step should also display text in red", () => {
      cy.get("[name=\"lhrstep-built-in\"]").parent().parent()
        .find(".Mui-error").eq(1)
        .should("have.text", "The LHR Step is a required field.")
        .and("have.css", "color", "rgb(244, 67, 54)");
    });
  });

  context("Create AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "LHRT AR" });
      cy.unClick();
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "LHRT AR" });
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "LHRT-00002" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Capture current url", () => {
      cy.url().then((url: any) => { arUrl = url; });
    });

    it("Click 'Send To Review'", () => {
      cy.get("[data-cy=\"transitionButton\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Field Part to be Manufactured is required.\n" +
        "Field LHR Step #1 is required.",
      });
      cy.closeAllAlertMessages();
    });
  });

  context("Update LHRT", () => {
    it("Open LHRT", () => {
      cy.visit(lhrtUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select 'Part document' for Part to be Manufactured", () => {
      cy.get("[data-cy='field-renderHTML']").scrollIntoView();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("[name=\"lhr-selected-part\"]").find("button").last().arrowClick({ force: true });
      });
      cy.get("[data-cy=\"lhr-selected-part\"]").focus().arrowType("Part document");
      cy.get("ul>li[role=option]").contains("Part document").arrowClick({ force: true });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Update AR and check error message", () => {
    it("Open AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.get("[data-cy=\"transitionButton\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Field LHR Step #1 is required.",
      });
      cy.closeAllAlertMessages();
    });
  });

  context("Update LHRT for Step 1", () => {
    it("Open LHRT", () => {
      cy.visit(lhrtUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick({ force: true });
      cy.wait(2000);
    });

    it("Select MPI document for step #1 in LHRt", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI created with API");
      });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Update AR to send to review", () => {
    it("Open AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });
  });

  context("Approve AR", () => {
    it("Login as second user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Approve AR", () => {
      cy.arApproveARFromDashboard();
    });

    it("Login as owner to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Revise LHRT", () => {
    it("Visit AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Close AR", () => {
      cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCloseAR], () => {
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Open LHRT", () => {
      cy.visit(lhrtUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`LHRT should be ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Click Revise button", () => {
      cy.drClickReviseDocument();
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click Add Step button", () => {
      cy.mpiAddStep();
      cy.wait(2000);
    });

    it("Click 'LHR Step 2'", () => {
      cy.get("[data-cy=\"LHR Step 2\"]").arrowClick({ force: true });
    });

    it("LHR step 2 should also display text in red", () => {
      cy.get("[name^=\"lhr-step-\"]").parent().parent()
        .find(".Mui-error").eq(1)
        .should("have.text", "The LHR Step is a required field.")
        .and("have.css", "color", "rgb(244, 67, 54)");
      cy.wait(2000);
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release LHRt document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Field LHR Step #2 is required.",
      });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
    });
  });

  context("Create new AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "LHRT AR 2" });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "LHRT AR" });
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "LHRT-00002" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Click on Save", () => {
      cy.url().then((url: any) => { arUrl = url; });
    });

    it("Click 'Send To Review'", () => {
      cy.get("[data-cy=\"transitionButton\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Field LHR Step #2 is required.",
      });
      cy.closeAllAlertMessages();
    });
  });

  context("Update LHRT for Step 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filter list by status", () => {
      cy.dlFilterByStatus({ status: "Pending Change" });
    });

    it("Open LHRT", () => {
      cy.dlSelectFirstDocument();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.url().then((url: any) => { lhrtUrl = url; });
    });

    it("Select MPI document for step #2 in LHRt", () => {
      cy.get("[data-cy=\"LHR Step 2\"]").arrowClick({ force: true });
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("[name^=\"lhr-step-\"]").autocompleteSelect("MPI created with API");
        cy.unClick();
      });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Update AR to send to review", () => {
    it("Open AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });
  });

  context("Approve AR", () => {
    it("Login as second user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Approve AR", () => {
      cy.arApproveARFromDashboard();
    });

    it("Login as owner to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create LHR", () => {
    it("Visit AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Close AR", () => {
      cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCloseAR], () => {
          cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Open LHRT", () => {
      cy.visit(lhrtUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`LHRT should be ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Click Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it(`LHR is in ${STATUS_TYPES_LABEL.WIP}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Verify 'Part to be manufactured'", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]").should("have.attr", "value", "PRT-00005 - rev 1 - Part document");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify 'LHR step#1 and LHR step#2'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick({ force: true });
      cy.get("[data-cy=\"lhrstep-built-in\"]").should("have.attr", "value", "PI-00008 - MPI created with API");
      cy.get("[data-cy=\"LHR Step 2\"]").arrowClick({ force: true });
      cy.get("[data-cy^=\"lhr-step-\"]").should("have.attr", "value", "PI-00008 - MPI created with API");
    });
  });
});
