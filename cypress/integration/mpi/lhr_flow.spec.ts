// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
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
let equipmentDocument3;
let materialsDocument2;
let materialsDocument3;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;
let lhrDocUrl;
let dateOfStep1Completion;
let dateOfStep1CompletionOneMinuteLater;
let dateOfStep2Completion;
let dateOfStep2CompletionOneMinuteLater;
let dateOfStep2CompletionOneMinuteBefore;

const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");


context("LHR flow", () => {
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
              {
                documentTypeName: "LHR Step Test",
                documentTypeAcronym: "LHRS-",
                group: "PI_INSTANCE",
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                  D: {
                    visible: false,
                    required: false,
                  },
                  E: {
                    visible: false,
                    required: false,
                  },
                  F: {
                    visible: false,
                    required: false,
                  },
                  N: {
                    label: "Complete Step",
                    visible: true,
                  },
                  U: {
                    label: "Operators",
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                  A4: {
                    label: "Completed",
                    visible: true,
                  },
                },
              },
              {
                documentTypeName: "Lot History Record Test",
                documentTypeAcronym: "LHR-",
                group: "LHR",
                privateNumberPool: false,
                needsSignature: true,
                category: "Lhr",
                fieldsConfig: {
                  C: {
                    visible: false,
                  },
                  E: {
                    visible: false,
                  },
                  D: {
                    visible: false,
                  },
                  U: {
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                },
                schema: [
                  {
                    name: "lhr-selected-part",
                    type: "partsselection",
                    index: 0,
                    label: "Part to be Manufactured",
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
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
                  },
                  {
                    name: "lhr-build-type",
                    type: "radiogroup",
                    index: 2,
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
                  },
                  {
                    name: "lhr-due-date",
                    type: "datepicker",
                    index: 3,
                    label: "Due Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Due Date",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-lhrstep-section-built-in",
                    type: "stepsection",
                    index: 4,
                    label: "form.builder.step",
                    stepIndex: 1,
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "lhrstep-built-in",
                    type: "lhrstep",
                    index: 5,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    applicableValidationSchema: true,
                  },
                ],
              },
              {
                documentTypeName: "Manufacturing Process Instructions Test",
                documentTypeAcronym: "PI-",
                group: "PI",
                schema: [
                  {
                    name: "fb-mpi-procedure-section-built-in",
                    type: "section",
                    index: 0,
                    label: "form.builder.mpiprocedure",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "mpi-procedure-built-in",
                    type: "mpiprocedure",
                    index: 1,
                    stepIndex: 1,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approvals-built-in",
                    type: "approvals",
                    index: 2,
                    label: "Approvals",
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
              {
                documentTypeName: "LHR template",
                documentTypeAcronym: "LHRT-",
                group: "FORM",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Subassembly");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
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

    it("[API]Create equipment three", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "ET-00008",
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
          name: "Equipment three",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        equipmentDocument3 = response;
        cy.drAPIApproveAndRelease({
          documentId: equipmentDocument3.id,
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
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
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
                name: "approvals-built-in",
                type: "approvals",
                index: 2,
                label: "Approvals",
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Material three' to step #1", () => {
          cy.mpiAddMaterialToStep({
            checkParameter: true, numbOfStep: 1,
            material: "Material three", quntity: "3", unit: "Each",
          });
        });


        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });

        it("Add 'Equipment three' to step #1", () => {
          cy.mpiAddEquipmentToStep({ checkParameter: true, numbOfStep: 1, equipment: "Equipment three" });
        });
      });

      context("Fill step #2", () => {
        it("Add step #2", () => {
          cy.mpiAddStep();
        });

        it("Fill step #2 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
        });

        it("Add 'Material two' to step #2", () => {
          cy.mpiAddMaterialToStep({ numbOfStep: 2, material: "Material two", quntity: "5", unit: "Days" });
        });

        it("Add 'Equipment two' to step #2", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
        });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
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
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").click();
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul[role=listbox]>li").contains("Part document").click();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.get("input[data-cy=\"lhrstep-built-in\"]").type("MPI document{downarrow}{enter}", { force: true });
          });
        });
      });

      context("Add another step with different MPI on document ", () => {
        it("Add LHR step", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "LHR Step" });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Select MPI document created with API for step #2 in LHRt", () => {
          cy.get("input[data-cy^=\"lhr-step\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.get("input[data-cy^=\"lhr-step\"]").type("MPI created with API{downarrow}{enter}", { force: true });
          });
        });
      });

      context("Try to release LHRt without parameters expecting validation error", () => {
        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
          cy.checkToastMessageContains({ message: "Parameters from MPI are not defined" });
          cy.get("[data-cy=ApproveAndRelease-cancelButton]").click();
        });
      });

      context("Add parameter materials and equipment", () => {
        it("Add material parameter", () => {
          cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
            .eq(0).click();
          cy.get("[data-cy=\"title\"]").click();
          cy.get("ul[role=listbox]>li").contains("Material three").click();
          cy.get("[name=\"quantity\"]").type("3");
          cy.get("[data-cy=\"unit\"]").click();
          cy.get("ul[role=listbox]>li").contains("Days").click();
          cy.get("[data-cy=\"form.builder.save\"]").click();
        });

        it("Add equipment parameter", () => {
          cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
            .eq(1).click();
          cy.get("[data-cy=\"title\"]").click();
          cy.get("ul[role=listbox]>li").contains("Equipment three").click();
          cy.get("[data-cy=\"form.builder.save\"]").click();
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.EmployeesGet,
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Check lot number", () => {
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "01");
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").type("10");
    });

    it("Select 'R&D' build type", () => {
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    it("Check lot number", () => {
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "01RD");
    });

    context("Complete first step in LHR", () => {
      context("Start LHRs #1", () => {
        it("Click 'START MPI'", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"form.builder.start.mpi\"]").eq(0).click();
          });
          cy.wait(500);
        });

        it("Add an Approval", () => {
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").click();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
          });
        });

        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Complete step", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve step", () => {
          cy.ebApprove();
          dateOfStep1Completion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
          dateOfStep1CompletionOneMinuteLater = moment().add(1, "minutes")
            .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        });

        context("Check equipment and materials from MPI are present", () => {
          it("Check description step #1", () => {
            cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
              .should("have.text", "Description of step one");
          });

          it("Check materials step #1", () => {
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(0)
              .should("have.text", "MT-00004 - Material one - rev 1 | Qty: 3 each");
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(1)
              .should("have.text", "MT-00007 - Material three - rev 1 | Qty: 3 days");
          });

          it("Check equipment step #1", () => {
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(0)
              .should("have.text", "ET-00003 - Equipment one");
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(1)
              .should("have.text", "ET-00008 - Equipment three");
          });

          it("Check description step #2", () => {
            cy.xpath("//div[contains(@data-cy, 'description')]/../div[2]")
              .eq(1)
              .should("have.text", "Description of step two");
          });

          it("Check materials step #2", () => {
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(2)
              .should("have.text", "MT-00006 - Material two - rev 1 | Qty: 5 days");
          });

          it("Check equipment step #2", () => {
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(2)
              .should("have.text", "ET-00007 - Equipment two - rev 1");
          });

          it("Verify status is completed", () => {
            cy.drCheckDocumentStatus({ status: "Completed" });
          });
        });
      });
    });

    context("Navigate back to LHR to start second LHRs", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
        cy.wait(500);
      });

      it("Verify date of completion LHRs #1", () => {
        cy.get("[data-cy=\"form.builder.step.completed\"]")
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Step completed | " + dateOfStep1Completion,
                "Step completed | " + dateOfStep1CompletionOneMinuteLater]);
          });
      });

      it("Verify Owner is required approver on LHR", () => {
        cy.get("[data-cy=\"fb-approvals-Giovanni Reynolds (enlil.testmail+cy1@gmail.com)-check-disabled\"]")
          .should("exist");
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[data-cy=\"fb-lhrs-start-quantity-lhrstep-built-in\"]").type("10");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[data-cy=\"fb-lhrs-accepted-quantity-lhrstep-built-in\"]").type("8");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[data-cy=\"fb-lhrs-rejected-quantity-lhrstep-built-in\"]").type("2");
      });

      it("Select 'Production' build type", () => {
        cy.get("[value=\"Production\"]").check();
      });

      it("Add owner to approver list", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      it("Check lot number", () => {
        cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "01");
      });

      it("Verify owner is added as approver", () => {
        cy.get("[data-cy=\"fb-approvals-Giovanni Reynolds (enlil.testmail+cy1@gmail.com)-check-marked\"]")
          .should("exist");
      });

      it("Try submitting for approval with uncompleted LHRs #2", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        cy.checkToastMessageContains({ message: "Every LHR step needs to be completed" });
      });
    });

    context("Complete LHRs #2 in LHR", () => {
      it("Click 'START MPI'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"form.builder.start.mpi\"]").eq(1).click();
        });
        cy.wait(500);
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-approvals-approvals\"]").click();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
        });
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
        dateOfStep2Completion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfStep2CompletionOneMinuteLater = moment().add(1, "minutes")
          .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfStep2CompletionOneMinuteBefore = moment().subtract(1, "minutes")
          .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
      });

      context("Check equipment and materials from MPI created with API are present", () => {
        it("Check description of step #1 in LHRs", () => {
          cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
            .should("have.text", "Description of MPI step created with API");
        });

        it("Check materials of step #1 in LHRs #2", () => {
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(0)
            .should("have.text", "MT-00004 - Material one - rev 1 | Qty: 1 sets");
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(1)
            .should("have.text", "MT-00006 - Material two - rev 1 | Qty: 2 boxes");
        });

        it("Check equipment of step #1 in LHRs #2", () => {
          cy.get("[data-cy$=\"equipment.title\"]")
            .eq(0)
            .should("have.text", "ET-00003 - Equipment one - rev 1");
          cy.get("[data-cy$=\"equipment.title\"]")
            .eq(1)
            .should("have.text", "ET-00007 - Equipment two - rev 1");
        });

        it("Verify status is completed", () => {
          cy.drCheckDocumentStatus({ status: "Completed" });
        });
      });
    });

    context("Navigate to LHR to release it", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Verify completion date of LHRs #1 in LHR", () => {
        cy.get("[data-cy=\"form.builder.step.completed\"]").eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Step completed | " + dateOfStep2Completion,
                "Step completed | " + dateOfStep2CompletionOneMinuteLater,
                "Step completed | " + dateOfStep2CompletionOneMinuteBefore]);
          });
      });

      it("Verify completion date of LHRs #2 in LHR", () => {
        cy.get("[data-cy=\"form.builder.step.completed\"]").eq(1)
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Step completed | " + dateOfStep2Completion,
                "Step completed | " + dateOfStep2CompletionOneMinuteLater,
                "Step completed | " + dateOfStep2CompletionOneMinuteBefore]);
          });
      });

      it("Enter 'Start quntity' for LHRs #2", () => {
        cy.get("[name^=\"fb-lhrs-start-quantity-lhr-step\"]").type("8");
      });

      it("Enter 'Accepted quntity' for LHRs #2", () => {
        cy.get("[name^=\"fb-lhrs-accepted-quantity-lhr-step\"]").type("5");
      });

      it("Enter 'Rejected quntity' for LHRs #2", () => {
        cy.get("[name^=\"fb-lhrs-rejected-quantity-lhr-step\"]").type("3");
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Release LHR", () => {
      it("Submit LHR for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve LHR", () => {
        cy.ebApprove();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });
  });
});

export { };
