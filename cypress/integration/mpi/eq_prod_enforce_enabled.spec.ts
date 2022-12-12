/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let createdPartDocument;
let MPIDocumentType;
let createdMPIDocument;
let LHRtDocumentType;
let LHRDocumentType;
let createdLHRtDocument;
let developersGroup;
let secondEmployee;
let formDocumentType;
let createdEquipmentFormDocument;
let maintenanceRecordDocumentType;
let createdPMForm;
let createdCalibrationForm;
let createdEquipmentNumericRevision;
let createdPMRecord;
let createdCalibrationRecord;
const calDueDate = moment().tz("America/Los_Angeles").add(5, "days").format("ll");
const pmDueDate = moment().tz("America/Los_Angeles").add(10, "days").format("ll");

context("Verify Equipment Prod Enforce enabled on LHR with owner and operator", () => {
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
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
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

    it("[API]Create Equipment form", (done: any) => {
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
              description: "<p>Maintenance and Calibration form</p>",
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
              name: "Maintenance and calibration form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: equipmentDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-default-eq-status",
                    type: "radiogroup",
                    index: 0,
                    label: "EQ Status",
                    rules: "required",
                    options: [
                      {
                        text: "Active",
                        value: "Active",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                    tabId: "overview",
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    index: 1,
                    label: "Primary Owner",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "specification",
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    index: 2,
                    label: "Coordinator",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "specification",
                  },
                  {
                    index: 3,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5l",
                    editorConfig: {
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "Preventative Maintenance",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
                    tabId: "specification",
                  },
                  {
                    index: 4,
                    type: "eqmaintenance",
                    name: "calibration-ki5wtyj0",
                    editorConfig: {
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                    tabId: "specification",
                  },
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-kycyk1n8",
                    uniqueSchemaItem: true,
                    index: 5,
                    tabId: "overview",
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEquipmentFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEquipmentFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create PM form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PM form</p>",
          document: {
            docId: "FM-00004",
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
          name: "Preventative Maintenance form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType[0].id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                tabId: "overview",
                index: 5,
              },
            ],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Calibration form</p>",
          document: {
            docId: "FM-00005",
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
          name: "Calibration form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType[0].id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
                tabId: "overview",
              },
            ],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "EQ-00001",
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
          name: "Equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": adminEmployee.id,
            "fb-coordinator-eq": adminEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create PM record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "pm-ki5wtk5l",
          description: "",
          name: "Preventative maintenance document",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00001",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "calibration-ki5wtyj0",
          description: "",
          name: "Calibration record",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00002",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document with expired due date</p>",
          document: {
            docId: "EQ-00002",
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
          name: "Equipment document expired due date",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": adminEmployee.id,
            "fb-coordinator-eq": adminEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create PM record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles").subtract(11, "days"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "pm-ki5wtk5l",
          description: "",
          name: "Preventative maintenance document",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00003",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles").subtract(10, "days"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "calibration-ki5wtyj0",
          description: "",
          name: "Calibration record",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00004",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Inactive Equipment document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Inactive equipment document</p>",
          document: {
            docId: "EQ-00003",
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
          name: "Inactive equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Inactive",
            "fb-primary-owner-eq": adminEmployee.id,
            "fb-coordinator-eq": adminEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create PM record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "pm-ki5wtk5l",
          description: "",
          name: "Preventative maintenance document",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00005",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration record for equipment", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "calibration-ki5wtyj0",
          description: "",
          name: "Calibration record",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00006",
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
              id: maintenanceRecordDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
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
                      title: createdEquipmentNumericRevision.id,
                    },
                  ],
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
                tabId: "details",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                tabId: "overview",
                index: 6,
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

    it("[API]Get group Developers", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group Developers", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
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
            {
              icon: "/navigation_icons/document-menu.svg",
              label: "Async Tasks",
              path: "/async_tasks",
              restrictedToUsersWithTags: [GroupTag.ASYNC_TASKS_UI],
              type: "LINK",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Verify that default value for Equipment Prod Enforce is unchecked and check it", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocTypeManagement();
    });

    it("Verify Equipment Enforce Prod is unchecked", () => {
      cy.get(`th[aria-colindex="2"] input`).arrowType("Lot History Record");
      cy.get(`td[role="gridcell"][aria-colindex="2"]`).contains(/^Lot History Record$/)
        .parents("tr").find(`td[data-grid-col-index="12"] input`).should("not.be.checked");
    });

    it("Expand information for Equipment doc type", () => {
      cy.get(`td[role="gridcell"][aria-colindex="2"]`).contains(/^Lot History Record$/)
        .eq(0).parent().find("button").eq(0).arrowClick();
    });

    it("Check Equipment Enforce Prod Enforce", () => {
      cy.get(` td[role="gridcell"][aria-colindex="2"]>input[value="Lot History Record"]`)
        .parents("tr").find(`td[data-grid-col-index="12"] input`).scrollIntoView().arrowClick();
    });

    it("Save document type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get(`td input[value="Lot History Record"]`)
          .parents("tr").find("button").eq(0).arrowClick().wait(200);
      });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify Equipment Enforce Prod is checked", () => {
      SystemRequirement("REQ-4950");
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`td[role="gridcell"][aria-colindex="2"]`).contains(/^Lot History Record$/)
        .parents("tr").find(`td[data-grid-col-index="12"] input`).should("be.checked");
    });
  });

  context("Create LHR after enabling LHR equipment_prod_enforce", () => {
    it("[API]Create LHR document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API</p>",
          document: {
            docId: "LHR-00004",
            documentType: {
              id: LHRDocumentType[0].id,
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
          name: "API LHR document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdLHRtDocument.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API]Create LHR document 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API</p>",
          document: {
            docId: "LHR-00005",
            documentType: {
              id: LHRDocumentType[0].id,
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
          name: "API LHR document 2",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdLHRtDocument.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });
  });

  context("Verify user can select EQ if due date is past when Equipment Enforce Prod is unchecked", () => {
    it("Navigate to LHR", () => {
      cy.navigToLHR();
    });

    it("Enter LHR document 2", () => {
      cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00005");
      cy.dlSelectFirstDocument();
    });

    context("Fill LHR document and start LHRs", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get(`[value="Production"]`).check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Save LHR", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill LHRs", () => {
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });
    });

    context("Verify equipment select dialog on LHRs", () => {
      it("Click 'SELECT' for 'Equipment document - rev 1'", () => {
        cy.get("[data-cy=\"form.builder.select\"]")
          .eq(1)
          .click({ force: true });
      });

      it("Open dropdown", () => {
        cy.wait(1000);
        cy.get(`div[role=dialog] button[title="Open"]`).should("be.visible").arrowClick({ force: true });
      });

      it("Verify list item should have cal and pm ", () => {
        cy.get(`ul>li[role=option]`).contains("EQ-00001").parents("li")
          .should("have.text", `EQ-00001 ▪rev 1 - Equipment document Cal Due: ${calDueDate} ▪ PM Due: ${pmDueDate} `);
      });

      it("Verify user can select only active equipment", () => {
        cy.get(`ul>li[role=option]`).contains("EQ-00001").parents("li")
          .should("have.attr", "aria-disabled", "false");
        cy.get(`ul>li[role=option]`).contains("EQ-00002").parents("li")
          .should("have.attr", "aria-disabled", "true");
        cy.get(`ul>li[role=option]`).contains("EQ-00003").parents("li")
          .should("have.attr", "aria-disabled", "true");
      });

      it("Select Equipment from dropdown", () => {
        cy.get(`ul>li[role=option]`).contains("EQ-00001").arrowClick();
      });

      it("Verify selected EQ information is displayed", () => {
        cy.get("div[role=dialog]")
          .should("have.text",
            `SelectEquipment\u200bStatus:ActiveCalibration:Next: ${calDueDate}Preventative Maintenance:Next: ` +
            `${pmDueDate}SaveCancel`);
      });

      it("Click save", () => {
        cy.get(`div[data-cy="form.builder.save"]`).arrowClick();
      });

      it("Verify dialog is closed", () => {
        cy.get(`div[role=dialog]`).should("not.exist");
      });

      it("Verify selected equipment and its information", () => {
        SystemRequirement("REQ-4940");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).should("have.text", "EQ-00001");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).parent().then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.be.equal(`EQ-00001Next Cal Due: ${calDueDate}Next PM Due: ${pmDueDate}`);
        });
      });

      it("Verify background color is gray because it due is not expired", () => {
        SystemRequirement("REQ-4930");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).parent()
          .should("have.css", "background-color", "rgb(235, 237, 242)");
      });

      it("Verify Change button is present on hover", { scrollBehavior: false }, () => {
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).realHover().wait(1000);
        cy.get(`div[data-cy="form.builder.change"]`).should("be.visible");
      });

      it("Click change button to switch to expired equipment", () => {
        cy.get(`div[data-cy="form.builder.change"]`).arrowClick({ force: true });
      });

      it("Verify user can not select overdue equipment", () => {
        SystemRequirement("REQ-4920");
        cy.get(`div[role=dialog] button[title="Open"]`).arrowClick();
        cy.get(`ul>li[role=option]`).contains("EQ-00002").parents("li")
          .should("have.attr", "aria-disabled", "true");
      });

      it("Cancel eq dialog selection", () => {
        cy.unClick();
        cy.get(`div[data-cy="form.builder.cancel"]`).arrowClick();
      });
    });

    context("Finish LHRs", () => {
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });
      it("Add approver", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.wait(3000);
        cy.ebApprove();
      });
    });

    context("Revise LHRs", () => {
      it("Click Revise on LHRs #1", () => {
        cy.drClickReviseDocument();
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.wait(3000);
        cy.ebApprove();
      });
    });
  });

  context("Verify operator can select EQ if due date is past when Equipment Enforce Prod is unchecked", () => {
    it("Navigate to LHR", () => {
      cy.navigToLHR();
    });

    it("Enter LHR document 1", () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00004");
      cy.dlSelectFirstDocument();
    });

    context("Fill LHR document and assign operator", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get(`[value="Production"]`).check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it("Save LHR", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it(`Add operator ${USERS[2].name}`, () => {
        cy.drAssignDocumentTo({ username: USERS[2].name });
      });
    });

    context("Login operator and start LHRs", () => {
      it("Logout current user", () => {
        cy.authLogout();
      });

      it("Login operator", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      });

      it("Navigate to LHR", () => {
        cy.navigToLHR();
        cy.wait(5000);
      });

      it("Enter LHR document 1", () => {
        cy.dlClearFilters();
        cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00004");
        cy.wait(5000);
        cy.dlSelectFirstDocument();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill LHRs", () => {
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });
    });

    context("Verify equipment select dialog on LHRs", () => {
      it("Click 'SELECT' for 'Equipment document - rev 1'", () => {
        cy.get("[data-cy=\"form.builder.select\"]")
          .eq(1)
          .click({ force: true });
      });

      it("Open dropdown", () => {
        cy.wait(1000);
        cy.get(`div[role=dialog] button[title="Open"]`).should("be.visible").arrowClick({ force: true });
      });

      it("Verify list item should have cal and pm ", () => {
        cy.get(`ul>li[role=option]`).contains("EQ-00001").parents("li")
          .should("have.text", `EQ-00001 ▪rev 1 - Equipment document Cal Due: ${calDueDate} ▪ PM Due: ${pmDueDate} `);
      });

      it("Verify user can select only active equipment", () => {
        SystemRequirement("REQ-5100");
        cy.get(`ul>li[role=option]`).contains("EQ-00001").parents("li")
          .should("have.attr", "aria-disabled", "false");
        cy.get(`ul>li[role=option]`).contains("EQ-00002").parents("li")
          .should("have.attr", "aria-disabled", "true");
        cy.get(`ul>li[role=option]`).contains("EQ-00003").parents("li")
          .should("have.attr", "aria-disabled", "true");
      });

      it("Select Equipment from dropdown", () => {
        cy.get(`ul>li[role=option]`).contains("EQ-00001").arrowClick();
      });

      it("Verify selected EQ information is displayed", () => {
        cy.get("div[role=dialog]")
          .should("have.text",
            `SelectEquipment\u200bStatus:ActiveCalibration:Next: ${calDueDate}Preventative Maintenance:Next: ` +
            `${pmDueDate}SaveCancel`);
      });

      it("Click save", () => {
        cy.get(`div[data-cy="form.builder.save"]`).arrowClick();
      });

      it("Verify dialog is closed", () => {
        cy.get(`div[role=dialog]`).should("not.exist");
      });

      it("Verify selected equipment and its information", () => {
        SystemRequirement("REQ-4940");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).should("have.text", "EQ-00001");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).parent().then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.be.equal(`EQ-00001Next Cal Due: ${calDueDate}Next PM Due: ${pmDueDate}`);
        });
      });

      it("Verify background color is gray because it due is not expired", () => {
        SystemRequirement("REQ-4930");
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).parent()
          .should("have.css", "background-color", "rgb(235, 237, 242)");
      });

      it("Verify Change button is present on hover", { scrollBehavior: false }, () => {
        cy.get(`div[data-cy="form.builder.mpi.part.selection.equipment"]`).realHover().wait(1000);
        cy.get(`div[data-cy="form.builder.change"]`).should("be.visible");
      });

      it("Click change button to switch to expired equipment", () => {
        cy.get(`div[data-cy="form.builder.change"]`).arrowClick({ force: true });
      });

      it("Verify user can not select overdue equipment", () => {
        SystemRequirement("REQ-4920");
        cy.get(`div[role=dialog] button[title="Open"]`).arrowClick();
        cy.get(`ul>li[role=option]`).contains("EQ-00002").parents("li")
          .should("have.attr", "aria-disabled", "true");
      });

      it("Cancel eq dialog selection", () => {
        cy.unClick();
        cy.get(`div[data-cy="form.builder.cancel"]`).arrowClick();
      });
    });

    context("Finish LHRs", () => {
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approver", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.wait(3000);
        cy.ebApprove();
      });
    });

    context("Revise LHRs", () => {
      it("Click Revise on LHRs #1", () => {
        cy.drClickReviseDocument();
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.wait(3000);
        cy.ebApprove();
      });
    });
  });
});

export { };

