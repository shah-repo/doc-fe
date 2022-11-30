/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let equipmentDocument2;
let materialsDocument2;
let materialsDocument3;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;


context("LHRT Pending Change", () => {
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
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
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
            docId: "CS-00005",
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
    it("[API]Create material two", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00006",
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
          name: "Material two",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument2.id,
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

    it("[API]Create material three", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00007",
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
          name: "Material three",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument3 = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument3.id,
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

    it("[API]Create equipment two", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "ET-00007",
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
          name: "Equipment two",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        equipmentDocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: equipmentDocument2.id,
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
                tabId: "procedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                tabId: "procedure",
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
                    {
                      id: "kolg6eqp",
                      title: materialsDocument2.id,
                      quantity: 2,
                      unit: "boxes",
                    },
                  ],
                  equipment: [
                    {
                      id: "kolg6pz4",
                      title: equipmentDocument.id,
                    },
                    {
                      id: "kolg6tnb",
                      title: equipmentDocument2.id,
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
                tabId: "procedure",
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
                tabId: "procedure",
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
                tabId: "procedure",
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
                tabId: "overview",
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

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Add 'Material one' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Material parameter' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Parameter for material three" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });


        it("Add 'Equipment one' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Equipment parameter' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });
      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });
  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });
  context("Fill LHRt document attributes", () => {
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

    it("Select 'Lot History Record Test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });
  context("Create an AR", () => {
    it("Navigates to Change Order list", () => {
      cy.navigToApprovalRequestList();
    });
    it("Click Create a Change Order button", () => {
      cy.arClickCreateAnAR();
    });
    it("Enter AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "LHRT" });
    });
    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "test" });
    });

    it("select the created LHRT", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "LHRT-00003 - rev 1 - LHRt document" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Save AR", () => {
      cy.arSaveApiCall();
    });
  });
  context("Go back to LHRT", () => {
    it("Navigate to Document list", () => {
      cy.unClick();
      cy.navigToDocumentList();
    });

    it("Click on Clear Filters", () => {
      cy.dlClearFilters();
    });
    it("LHRT status should change to Pending Change", () => {
      cy.get(".k-master-row").eq(0).click();
    });
    it("Select 'Part document' for Part to be Manufactured", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("CS-00005 - Part document").arrowClick();
    });
    context("Select a different MPI", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });


      it("Select MPI document for step #1 in LHRt", () => {
        cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
          $el.trigger("click");
        });
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev], () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("input[data-cy=\"lhrstep-built-in\"]").arrowType("MPI document{downarrow}{enter}", { force: true });
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Click on Add Field and add another LHR step ", () => {
      it("Add LHR step", () => {
        cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
      it("Added LHR Step should be editable, select MPI", () => {
        cy.get("input[data-cy^=\"lhr-step\"]").then(($el) => {
          $el.trigger("click");
        });
      });
      it("When the MPI/QPI has parameterized materials and EQ, the user should be able to select for both", () => {
        cy.get("input[data-cy^=\"lhr-step\"]").then(($el) => {
          $el.trigger("click");
        });
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions,
          CyRoutes.GetAutocompleteOptions,
          CyRoutes.PatchDocRev], () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("input[data-cy^=\"lhr-step\"]").arrowType("MPI created with API{downarrow}{enter}", { force: true });
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify indicator for parametrized Material", () => {
        cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
          .should("have.text", "A: Parameter for material three | Qty: None ");
        cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]").parent().parent()
          .should("have.css", "background-color", "rgb(252, 222, 222)");
      });

      it("Verify indicator for parametrized Equipment", () => {
        cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
          .should("have.text", "B: Equipment parameter ");
        cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]").parent().parent()
          .should("have.css", "background-color", "rgb(252, 222, 222)");
      });
    });
  });
});

export { };
