// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let lhrUrl;
let lhrsUrl;
let createdCompany;
let adminEmployee;
let loginResponse;
let multipleCompanies;
let approvalRequestDocumentType;
let equipmentDocumentType;
let partDocumentType;
let MPIDocumentType;
let LHRtDocumentType;
let LHRDocumentType;
let group;
let initialArDocument;
let equipmentDocument;
let createdPartDocument;
let createdMPIDocument;
let createdLHRtDocument;

context("Export for LHR", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR Template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record Test");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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

    it("[API]Create MPI document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>MPI created through API</p>",
          document: {
            docId: "PI-00001",
            documentType: {
              id: MPIDocumentType[0].id,
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
          name: "API MPI",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                tabId: "procedure",
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                stepIndex: 1,
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: [
                  "includeNotes",
                ],
                includeNotes: true,
                editorConfig: {
                  description: "<p>Description for step 1</p>",
                  materials: [
                    {
                      id: "kvasuama",
                      title: createdPartDocument.id,
                      quantity: 3,
                      unit: "each",
                    },
                  ],
                  equipment: [
                    {
                      id: "kvasulmm",
                      title: equipmentDocument.id,
                    },
                  ],
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
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
                tabId: "procedure",
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
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
                tabId: "procedure",
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                tabId: "procedure",
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "overview",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMPIDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMPIDocument.id,
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

    it("[API]Create LHRt document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRt created with API</p>",
          document: {
            docId: "LHRT-00003",
            documentType: {
              id: LHRtDocumentType[0].id,
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
          name: "API LHRt document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [
              { id: LHRDocumentType[0].id },
            ],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
                tabId: "overview",
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                label: "Initial Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "overview",
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                label: "End Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "overview",
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                label: "Build Type",
                options: [
                  {
                    text: "R&D",
                    value: "R&D",
                  },
                  {
                    text: "Production",
                    value: "Production",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                tabId: "overview",
              },
              {
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                label: "Due Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
                tabId: "overview",
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                label: "LHR Step",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
                tabId: "overview",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLHRtDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLHRtDocument.id,
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
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create new LHR", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Record inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "API LHRt document" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").should("be.exist");
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.url().then((url: any) => {
        lhrUrl = url;
      });
    });

    it("Add approver", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.WIP}`, () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
    it("Select 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiClickNotStarted({ stepNumber: 1 });
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
      cy.url().then((url: any) => {
        lhrsUrl = url;
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Select 'Procedure' tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Complete step", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.COMPLETED}`, () => {
    it("Open LHRS", () => {
      cy.visit(lhrsUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Approve step", () => {
      cy.lhrApproveWithoutApi();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.CANCELED}`, () => {
    it("Open LHRS", () => {
      cy.visit(lhrsUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click Update record", () => {
      cy.drClickReviseDocument();
    });

    it("Click Save button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Click Cancel draft", () => {
      cy.drCancelDraftButton();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.CANCELED });
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.IN_REVIEW} and LHRS with ${STATUS_TYPES_LABEL.COMPLETED}`, () => {
    it("Submit for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.IN_REVIEW, filename: "-A", pdfStatus: "In Review" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.RELEASED} and LHRS with ${STATUS_TYPES_LABEL.COMPLETED}`, () => {
    it("Click Approve button", () => {
      cy.lhrApproveWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.RELEASED, filename: "-A", pdfStatus: "Released" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.RELEASED} and LHRS with ${STATUS_TYPES_LABEL.WIP}`, () => {
    it("Open LHRS", () => {
      cy.visit(lhrsUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click Update record", () => {
      cy.drClickReviseDocument();
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.RELEASED, filename: "-A", pdfStatus: "Released" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.SUPERSEDED}`, () => {
    it("Open LHRS", () => {
      cy.visit(lhrsUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select LHRS with WIP", () => {
      cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).contains("WIP").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.saveBarShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Complete step", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Approve step", () => {
      cy.lhrApproveWithoutApi();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Click Update record", () => {
      cy.lhrClickReviseDocument();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it(`Select LHRS with ${STATUS_TYPES_LABEL.WIP}`, () => {
      cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).contains("WIP").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.saveBarShouldNotExist();
    });

    it("Add approver", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Approve button", () => {
      cy.lhrApproveWithoutApi();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Superseded' record", () => {
      cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.saveBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.SUPERSEDED, filename: "-A", pdfStatus: "Superseded" });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.VOIDED}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Record inline form", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: "API LHRt document" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Click Void button", () => {
      cy.arVoidAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.VOIDED, filename: "-A-Void", pdfStatus: "Voided" });
    });
  });
});
