// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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
let lhrs1DocUrl;
let dateOfStep1Completion;
let dateOfStep1CompletionOneMinuteLater;
let dateOfStep2Completion;
let dateOfStep2CompletionOneMinuteLater;
let dateOfStep2CompletionOneMinuteBefore;
let developersGroup;
let secondEmployee;
let createdLotsFormDocument;
let formDocumentType;
let CSLDocumentType;

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
                  D: {
                    visible: false,
                  },
                  E: {
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
                    deleteInFormDisabled: false,
                    applicableValidationSchema: true,
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
                    editorProperties: [],
                    validationAttribute: "Start quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
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
                    editorProperties: [],
                    validationAttribute: "Accepted quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-rejected-quantity",
                    type: "quantity",
                    index: 4,
                    label: "Rejected quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Rejected quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Subassembly");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specifications Lot");
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

    it("[API]Create unreleased part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>unreleased part document</p>",
          document: {
            docId: "CS-00010",
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
          name: "Unreleased part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
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
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
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

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
          document: {
            docId: "FM-00008",
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
          name: "Lots form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: CSLDocumentType[0].id,
            }],
            schema: [
              {
                name: "lot_quantity",
                type: "quantity",
                index: 0,
                label: "Quantity Received",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [

                ],
                validationAttribute: "Quantity Received",
                applicableValidationSchema: true,
              },
              {
                name: "expiry-date",
                type: "datepicker",
                index: 1,
                label: "Expiry Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [],
                validationAttribute: "Expiry Date",
                applicableValidationSchema: true,
              },
              {
                name: "100-inspection-override",
                type: "checkboxgroup",
                index: 2,
                label: "100% Inspection Override",
                options: [
                  {
                    text: "100% Inspection Override",
                    value: "100% Inspection Override",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                editorProperties: [],
                validationAttribute: "100% Inspection Override",
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ki5yh7ba",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLotsFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLotsFormDocument.id,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]API request for updating page details", (done: any) => {
      cy.cmpUpdatePageDetails({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          category: "Lhr",
          addNewBtnLabel: "Create New Lhr",
          columns: [
            {
              fn: "LHR_SUBTITLE",
              label: "LSHS subtitle",
              fieldName: "irrelevant",
              showOnWeb: false,
              valuePath: "precalc.lshs_subtitle",
              sourcePath: "irrelevant",
              showOnAndroid: false,
            },
            {
              label: "LOT #",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.lshs_subtitle.lot.label",
              sourcePath: "irrelevant",
              showOnAndroid: false,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "status",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Part Number/Rev",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.lshs_subtitle.part.label",
              showOnAndroid: true,
            },
            {
              label: "Completion Date",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "releasedAt",
              showOnAndroid: true,
            },
            {
              label: "Start Quantity",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "formInput.lhr_initial_quantity",
              showOnAndroid: true,
            },
            {
              fn: "LHR_END_QUANTITY",
              label: "End Quantity",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.lhr_end_accepted_quantity",
              sourcePath: "irrelevant",
              showOnAndroid: true,
            },
            {
              fn: "FORM_DOC_ID",
              label: "Template",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.formDocId",
              sourcePath: "irrelevant",
              showOnAndroid: true,
            },
            {
              label: "ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
          ],
        },
      }).then(() => {
        done();
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

  context("Create lot document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Component Specifications Lot' from the dropdown", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
      cy.wait(500);
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.GetAvailableApprovers], () => {
        cy.get("div[id^=react-select]").contains("Component Specifications Lot").click();
      });
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Select 'Part document' in references", () => {
      cy.drSelectReferences( "Material one" );
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").type("12");
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
      cy.wait(5000);
    });

    it("Add an Approval'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      cy.unClick();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
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
        SystemRequirement("REQ-0560");
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

        it("Add attachment", () => {
          SystemRequirement("REQ-3090");
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").click();
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });

        it("Add 'Material one' to step #1", () => {
          SystemRequirement("REQ-3100");
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Material parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Parameter for material three" });
        });


        it("Add 'Equipment one' to step #1", () => {
          SystemRequirement("REQ-3130");
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });

        it("Add 'Equipment parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
        });
      });

      context("Fill step #2", () => {
        it("Add step #2", () => {
          SystemRequirement("REQ-3060");
          cy.mpiAddStep();
        });

        it("Add attachment", () => {
          SystemRequirement("REQ-3090");
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").click();
          cy.elUploadAttachment({
            fileName: "test_image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });

        it("Fill step #2 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
        });

        it("Add 'Material two' to step #2", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "5", unit: "Day(s)" });
        });

        it("Add 'Equipment two' to step #2", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
        });
      });

      context("Verify clone Step #1", () => {
        it("Clone Step #1", () => {
          SystemRequirement("REQ-3070");
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
            CyRoutes.GetAttachmentsAttached ], () => {
            cy.get("[data-cy=\"form.builder.clone.step\"]").eq(0).click();
          });
          cy.wait(6000);
        });

        it("Verify description of clone of Step #1", () => {
          cy.xpath("//div[contains(@data-cy, 'description')]/../div[2]")
            .eq(2)
            .should("have.text", "Description of step one");
        });

        it("Verify image of clone of Step #1", () => {
          cy.get(" [data-cy=\"mediaUploadField\"]").eq(1).find("svg").eq(0).click();
          cy.get("[data-cy=\"mediaUploadField\"] ul>li div[title]").each(($el) => {
            const attachName = $el.text();
            expect(attachName).to.be.oneOf(["image", "test_image"]);
          });
        });

        it("Verify materials of clone of Step #1", () => {
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.materials.title\"]")
            .should("have.text", "MT-00004 - Material one | Qty: 3 each");
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
            .should("have.text", "A: Parameter for material three | Qty: None ");
        });

        it("Verify equipments of clone of Step #1", () => {
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.equipment.title\"]")
            .should("have.text", "ET-00003 - Equipment one");
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
            .should("have.text", "B: Equipment parameter ");
        });
      });

      context("Verify remove Step", () => {
        it("Check step count before remove", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]").should("have.length", 3);
        });

        it("remove Step #2", () => {
          SystemRequirement("REQ-3080");
          cy.contains("Step #2").parentsUntil("li").find("[data-cy=\"remove-schema-item\"]").click({ force: true });
        });

        it("Check step count after remove", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]").should("have.length", 2);
        });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

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

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        SystemRequirement("REQ-3140");
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        SystemRequirement("REQ-3140");
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        SystemRequirement("REQ-3131");
        cy.get("[data-cy=\"lhr-selected-part\"]").type("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("ul[role=listbox]>li").contains("Part document").click();
        });
      });

      context("Enable notes in LHR step", () => {
        it("Click edit on LHR step", () => {
          cy.get("[data-cy=\"edit-schema-item\"]").eq(2).click({ force: true });
        });

        it("Check 'Include Notes' checkbox", () => {
          cy.get("input[value=\"includeNotes\"]").check();
        });

        it("Save changes made to field", () => {
          cy.get("[data-cy=\"common.add\"]").click();
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
          SystemRequirement("REQ-3150");
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).click({ force: true });
          cy.fbSelectItemFromNewFieldList({ field: "LHR Step" });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.DocRevPreview], () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Select MPI document created with API for step #2 in LHRt", () => {
          cy.get("input[data-cy^=\"lhr-step\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.DocRevPreview], () => {
            cy.get("input[data-cy^=\"lhr-step\"]").type("MPI created with API{downarrow}{enter}", { force: true });
          });
        });

        it("Verify indicator for parametrized Material", () => {
          SystemRequirement("REQ-3630");
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
            .should("have.text", "A: Parameter for material three | Qty: None ");
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]").parent().parent()
            .should("have.css", "background-color", "rgb(252, 222, 222)");
        });

        it("Verify indicator for parametrized Equipment", () => {
          SystemRequirement("REQ-3630");
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
            .should("have.text", "B: Equipment parameter ");
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]").parent().parent()
            .should("have.css", "background-color", "rgb(252, 222, 222)");
        });
      });

      context("Try to release LHRt without parameters expecting validation error", () => {
        it("Approve and release LHRt document", () => {
          SystemRequirement("REQ-3640");
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
          cy.get("ul[role=listbox]>li").contains("Day(s)").click();
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
          SystemRequirement("REQ-3640");
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      SystemRequirement("REQ-3170");
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Verify LHR title", () => {
      SystemRequirement("REQ-3310");
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "02");
      cy.get("#HeaderInfo-docId").should("have.text", "LHR-00004");
    });

    it("Verify current released part is 'rev 1'", () => {
      SystemRequirement("REQ-3820");
      cy.get("[data-cy=\"lhr-selected-part\"]")
        .should("have.attr", "value", "CS-00005 - rev 1 - Part document");
    });

    it("Check lot number", () => {
      SystemRequirement("REQ-3180");
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "02");
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").type("10");
    });

    it("Select 'R&D' build type", () => {
      SystemRequirement("REQ-3190");
      cy.unClick();
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

    it("Add note to'End Quantity'", () => {
      SystemRequirement("REQ-3290");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetNotes, () => {
        cy.get("#fb-notes").click();
      });
      cy.get("[name=\"noteText\"]").type("Quantity will be auto populated");
      cy.wrapWithWaitOnApiCall(CyRoutes.PostNotes, () => {
        cy.get("#send-icon").click();
      });
      cy.get("[data-cy=\"dialog-close\"]").click();
    });

    it("Check lot number", () => {
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      SystemRequirement("REQ-3180");
      cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "02RD");
    });

    context("Complete first step in LHR", () => {
      context("Add operator and login it for work on LHRs", () => {
        it("Click on sidebar permission icon to add Operators", () => {
          cy.get("[data-cy='permission-icon']").click();
        });

        it(`Assign operator '${USERS[2].name}'`, () => {
          SystemRequirement("REQ-3200");
          cy.drAssignDocumentTo({ username: USERS[2].name });
        });

        it(`Logout user '${USERS[1].name}'`, () => {
          cy.authLogout();
        });

        it(`Login user '${USERS[2].name}'`, () => {
          cy.authLogin({ email: USERS[2].email, password: "Tester1!" });
        });

        it("Selects company", () => {
          cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
        });

        it("Navigate to LHR landing page", () => {
          SystemRequirement("REQ-3350");
          cy.navigToLHR();
        });

        it("Select created LHR record", () => {
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.DocPreview,
            CyRoutes.DocRevPreview,
            CyRoutes.GetAutocompleteOptions], () => {
            cy.dlSelectFirstDocument();
          });
        });
      });

      context("Start LHRs #1", () => {
        it("Click 'START MPI'", () => {
          SystemRequirement("REQ-3210");
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"form.builder.start.mpi\"]").eq(0).click();
          });
          cy.wait(500);
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Verify LHRs title", () => {
          SystemRequirement("REQ-3320");
          cy.get("#HeaderInfo-subtitle")
            .should("have.text", "LOT #" + lotDateSuffix + "02RD | LHR-00004 | CS-00005.1 Part document");
        });

        it("Enter 'Start quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-start-quantity\"]").type("10");
        });

        it("Enter 'Accepted quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-accepted-quantity\"]").type("8");
        });

        it("Enter 'Rejected quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-rejected-quantity\"]").type("2");
        });

        it("Click 'SELECT' for 'Material One' ", () => {
          cy.get("[data-cy=\"form.builder.select\"]")
            .eq(0)
            .click({ force: true });
        });

        it(`Select lot 'LOT #${lotDateSuffix}01'`, () => {
          cy.get("input[data-cy=usedOverride]").click();
          cy.get("ul[role=listbox]>li").contains(`LOT #${lotDateSuffix}01`).click();
        });

        it("Select quantity in lot dialog", () => {
          cy.get("input[name=\"quantity\"]").type("5");
        });

        it("Click 'SAVE' on select lot dialog", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
            cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
              .eq(0)
              .click();
          });
        });

        it("Click 'SELECT' for 'Equipment one' ", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.get("[data-cy=\"form.builder.select\"]")
              .eq(2)
              .click({ force: true });
          });
        });

        it("Select 'Equipment one'", () => {
          cy.get("[data-cy=\"usedOverride\"]").click();
          cy.get("ul[role=listbox]>li").contains("Equipment one").click();
        });

        it("Click 'SAVE' on select equipment dialog", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
            cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
              .eq(0)
              .click();
          });
        });

        it("Verify LOT is selected for 'Material One'", () => {
          SystemRequirement("REQ-3340", "REQ-3660");
          cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
            .should("contain.text", `LOT #${lotDateSuffix}01`);
        });

        it("Verify Equipment is selected for 'Equipment one'", () => {
          SystemRequirement("REQ-3660");
          cy.get("div[data-cy=\"form.builder.mpi.part.selection.equipment\"]")
            .should("have.text", "ET-00003");
        });

        it("Add an Approval", () => {
          SystemRequirement("REQ-3220");
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").click();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).click();
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
          SystemRequirement("REQ-3230");
          cy.ebApprove();
        });

        context("Check equipment and materials from MPI are present", () => {
          it("Check description step #1", () => {
            cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
              .should("have.text", "Description of step one");
          });

          it("Check materials step #1", () => {
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(0)
              .should("have.text", "MT-00004 - Material one - rev 1 | Qty: 30 each");
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(1)
              .should("have.text", "MT-00007 - Material three - rev 1 | Qty: 30 days");
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
              .should("have.text", "MT-00006 - Material two - rev 1 | Qty: 50 days");
          });

          it("Check equipment step #2", () => {
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(2)
              .should("have.text", "ET-00007 - Equipment two - rev 1");
          });

          it("Verify status is completed", () => {
            cy.url().then((url: any) => {
              lhrs1DocUrl = url;
            });
            cy.drCheckDocumentStatus({ status: "Completed" });
          });

          it("Verify user who completed LHRs", () => {
            SystemRequirement("REQ-3240");
            cy.get("div[id=Presenter-FBWorkspace]>div").eq(-2).find("div>div:nth-child(5)")
              .should("contain.text", USERS[2].name);
          });
        });
      });
    });

    context("Verify anyone can make corrections to the LHRs after completing", () => {
      context("Login second user", () => {
        it(`Logout user '${USERS[2].name}'`, () => {
          cy.authLogout();
        });

        it(`Login user '${USERS[3].name}'`, () => {
          cy.authLogin({ email: USERS[3].email, password: "Tester1!" });
        });

        it("Selects company", () => {
          cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
        });
      });

      context("Navigate to LHRs #1 and revise it", () => {
        it("Navig to LHRs #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.visit(lhrs1DocUrl);
          });
        });

        it("Click Revise on LHRs #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"updateRecord\"]").click();
          });
        });

        it("Click on redline", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("#Redline").click();
          });
        });

        it("Update step #1 description", () => {
          cy.get("div[contenteditable]").eq(0).click({ force: true }).type(" updated!");
          cy.wait(500);
          cy.get("div[data-cy=\"form.builder.step.number\"]").eq(0).click();
        });

        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });

        it("Add an Approval", () => {
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").click();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul[role=\"listbox\"]>li").contains(USERS[3].name).click();
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
          SystemRequirement("REQ-3250");
          cy.ebApprove();
          dateOfStep1Completion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
          dateOfStep1CompletionOneMinuteLater = moment().add(1, "minutes")
            .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        });
      });
    });

    context("Login admin user", () => {
      it(`Logout user '${USERS[3].name}'`, () => {
        cy.authLogout();
      });

      it(`Login user '${USERS[1].name}'`, () => {
        cy.authLogin({ email: USERS[1].email, password: "Tester1!" });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Navigate back to LHR to start second LHRs", () => {
      it("Navigate to LHR landing page", () => {
        SystemRequirement("REQ-3350");
        cy.navigToLHR();
      });

      it("Select created LHR record", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocPreview,
          CyRoutes.DocRevPreview,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.dlSelectFirstDocument();
        });
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

      it("Verify LHRs #1 redline indicator", () => {
        SystemRequirement("REQ-3280");
        cy.get("input[data-cy=\"lhrstep-built-in\"]")
          .should("have.css", "background-color", "rgb(252, 222, 222)");
      });

      it("Verify Owner is required approver on LHR", () => {
        cy.get("[data-cy=\"fb-approvals-Giovanni Reynolds (enlil.testmail+cy1@gmail.com)-check-disabled\"]")
          .should("exist");
      });

      it("Select 'Production' build type", () => {
        SystemRequirement("REQ-3190");
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
        cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "02");
      });

      it("Verify owner is added as approver", () => {
        cy.get("[data-cy=\"fb-approvals-Giovanni Reynolds (enlil.testmail+cy1@gmail.com)-check-marked\"]")
          .should("exist");
      });

      it("Try submitting for approval with uncompleted LHRs #2", () => {
        SystemRequirement("REQ-3300");
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        cy.checkToastMessageContains({ message: "Every LHR step needs to be completed" });
      });
    });

    context("Complete LHRs #2 in LHR", () => {
      it("Click 'START MPI'", () => {
        SystemRequirement("REQ-3210");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"form.builder.start.mpi\"]").eq(1).click();
        });
        cy.wait(500);
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").type("8");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").type("5");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").type("3");
      });

      context("Redline LHRs after it is stated and not completed", () => {
        it("Click on redline", () => {
          SystemRequirement("REQ-3650");
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("#Redline").click();
          });
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Update step #1 description", () => {
          SystemRequirement("REQ-3270");
          cy.get("div[contenteditable]").eq(0).click({ force: true }).type(" updated!");
          cy.wait(500);
          cy.get("div[data-cy=\"form.builder.step.number\"]").eq(0).click();
        });

        it("Add attachment 'image.jpg'", () => {
          SystemRequirement("REQ-3270");
          cy.elUploadAttachment({
            fileName: "image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
        });

        it("Add 'Material three' to materials", () => {
          SystemRequirement("REQ-3270");
          cy.lhrsAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material three", quntity: "3", unit: "Each" });
        });

        it("Add 'Equipment three' to equipments", () => {
          SystemRequirement("REQ-3270");
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment three" });
        });

        it("Remove attachment from step #1", () => {
          SystemRequirement("REQ-3270");
          cy.get("[data-cy=\"mediaUploadField\"] svg").eq(3).click({ force: true });
        });

        it("Remove 'Material one' from materials", () => {
          SystemRequirement("REQ-3270");
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(1).parent().parent().find("svg").eq(1)
            .click();
        });

        it("Remove 'Equipment three' from equipments", () => {
          SystemRequirement("REQ-3270");
          cy.get("[data-cy=\"form.builder.lhrs.procedure.equipment.title\"]")
            .eq(1).parent().parent().find("svg").eq(1)
            .click();
        });

        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });
        });
      });

      context("Complete LHRs #2", () => {
        it("Add an Approval", () => {
          SystemRequirement("REQ-3220");
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
      });

      context("Check equipment and materials from MPI created with API are present", () => {
        it("Check description of step #1 in LHRs", () => {
          cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
            .should("have.text", "Description of MPI step created with API updated!");
        });

        it("Check materials of step #1 in LHRs #2", () => {
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(0)
            .should("have.text", "MT-00006 - Material two - rev 1 | Qty: 16 boxes");
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(1)
            .should("have.text", "MT-00007 - Material three - rev 1 | Qty: 24 each");
        });

        it("Check equipment of step #1 in LHRs #2", () => {
          cy.get("[data-cy$=\"equipment.title\"]")
            .eq(0)
            .should("have.text", "ET-00007 - Equipment two - rev 1");
          cy.get("[data-cy$=\"equipment.title\"]")
            .eq(1)
            .should("have.text", "ET-00008 - Equipment three - rev 1");
        });

        it("Verify status is completed", () => {
          cy.drCheckDocumentStatus({ status: "Completed" });
        });
      });
    });

    context("Navigate to LHR to release it", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
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

      it("Verify end quantity", () => {
        cy.get("[name=\"lhr-end-quantity\"]").should("have.attr", "value", "5");
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Release LHR", () => {
      it("Submit LHR for approval", () => {
        SystemRequirement("REQ-3300");
        cy.pmSubmitForApproval();
      });

      it("Approve LHR", () => {
        cy.ebApprove();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });

      it("Verify revision is specified on conneted Part document", () => {
        SystemRequirement("REQ-3330");
        cy.get("[data-cy=\"lhr-selected-part\"]")
          .should("have.attr", "value", "CS-00005 - rev 1 - Part document");
      });
    });

    context("Verify anyone can revise completed LHR", () => {
      context("Login admin user", () => {
        it(`Logout user '${USERS[1].name}'`, () => {
          cy.authLogout();
        });

        it(`Login user '${USERS[3].name}'`, () => {
          cy.authLogin({ email: USERS[3].email, password: "Tester1!" });
        });

        it("Selects company", () => {
          cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
        });
      });

      context("Revise LHR", () => {
        it("Navigate to LHR", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.visit(lhrDocUrl);
          });
        });

        it("Click Revise on LHR", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"updateRecord\"]").click();
          });
        });

        it("Change Build Type to 'R&D'", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.get("[value=\"R&D\"]").check();
          });
        });

        it("Check lot number", () => {
          cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "02RD");
        });
      });

      context("Release LHR", () => {
        it("Add owner to approver list", () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
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
          SystemRequirement("REQ-3260");
          cy.ebApprove();
        });
      });
    });

    context("Verify LHRt is on document list", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter document list by title 'LHRt document'", () => {
        cy.dlFilterByDocTitle({ docTitle: "LHRt document" });
      });

      it("Verify LHRt document is present on list", () => {
        SystemRequirement("REQ-3360");
        cy.get("div[title]").eq(0).should("have.text", "LHRt document");
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });
  });
});

export { };
