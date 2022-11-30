// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];
const id = "ID";
const rev = "REVISION";
const state = "STATE";
const title = "TITLE";
const eftOwner = "EFT OWNER";
const calDueDate = "CAL DUE DATE";
const pmDueDate = "PM DUE DATE";
const eqStatus = "EQ STATUS";

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let adminEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let createdPMForm;
let createdCalibrationForm;
let createdEquipmentDocument;
let createdPMRecord;
let createdCalibrationRecord;
let createdEquipmentNumericRevision;
let group;

context("Equipment maintenance for checking History in all states", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
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
                    tabId: "overview",
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
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    index: 1,
                    label: "Primary Owner",
                    tabId: "specification",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    index: 2,
                    label: "Coordinator",
                    tabId: "specification",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
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
                    tabId: "specification",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
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
                    tabId: "specification",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
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
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                tabId: "details",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                tabId: "details",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                tabId: "details",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                tabId: "details",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "overview",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
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
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                tabId: "details",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                tabId: "details",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                tabId: "details",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                tabId: "details",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "overview",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
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

    it("[API]Create Equipment document with Numeric revision", (done: any) => {
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

    it("[API]Create PM record for equipment in numeric version", (done: any) => {
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

    it("[API]Create Calibration record for equipment in numeric version", (done: any) => {
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

    it("[API]Create Equipment document with Alpha numeric revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
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
          name: "Equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 2,
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
        createdEquipmentDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentDocument.id,
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

    it("[API]Create PM record for equipment in alpha numeric version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentDocument.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentDocument.id,
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

    it("[API]Create Calibration record for equipment in alpha numeric version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentDocument.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentDocument.id,
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

    it("[API]Create Equipment document with Alpha revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
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
          name: "Equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 3,
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
        createdEquipmentDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentDocument.id,
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

    it("[API]Create PM record for equipment in alpha version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentDocument.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentDocument.id,
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

    it("[API]Create Calibration record for equipment in alpha version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentDocument.id,
            "equipment_maintainer": adminEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentDocument.id,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Navigate to Equipment Landing page", () => {
    it("Equipment Landing page", () => {
      cy.navigToEquipment();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${id}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${state}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${title}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${eftOwner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${calDueDate}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${pmDueDate}`);
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${eqStatus}`);
    });

    it("Insert filter", () => {
      cy.get(`[aria-colindex="1"] input`).arrowType("EQ-").wait(500);
    });

    it("Verify that the number of documents displayed match filter settings", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 3 });
      cy.grpClearFilter();
    });

    it(`Verify that Button 'Clear Filter', 'Export List' and 'Add New Equipment' are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get("[id=DocumentByTypeListPresenter-openDocRev]").should("exist");
    });

    it(`drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "EQ-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "EQ-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it("Column grouping", () => {
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Verify that data is sorted based on that column grouping", () => {
      cy.get(".k-grouping-row").eq(0).should("have.text", "1").arrowClick();
      cy.get(".k-grouping-row").eq(1).should("have.text", "1A").arrowClick();
      cy.get(".k-grouping-row").eq(2).should("have.text", "A").arrowClick();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", "Revision");
    });

    it("User should be able to remove it", () => {
      cy.get(".k-i-group-delete").click();
    });
  });

  context("Create Equipment document", () => {
    it("Click add new Equipment", () => {
      cy.equipClickCreateNew();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[1].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it("Navigate to 'cal/pm history' tab", () => {
      cy.drSelectCalPmHistoryTab();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"No\"]").eq(0).arrowClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"No\"]").eq(1).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Verify that the system displays only Equipment in the Equipment Landing page with corresponding data", () => {
      cy.navigToEquipment();
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "EQ-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(1).should("contain.text", "EQ-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(2).should("contain.text", "EQ-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(3).should("contain.text", "EQ-" );
    });

    it("Click one of the Equipment from landing page", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context(`Sort ${id}`, () => {
    it("ID should be in ascending order", () => {
      cy.navigToEquipment();
      cy.contains(`${id}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${id}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 0, colLength: 8 });
    });

    it("ID should be in descending order", () => {
      cy.contains(`${id}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${id}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 0, colLength: 8 });
    });

    it("Revision should be in ascending order", () => {
      cy.contains(`${rev}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 1, colLength: 8 });
    });

    it("Revision should be in descending order", () => {
      cy.contains(`${rev}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 1, colLength: 8 });
    });

    it("State should be in ascending order", () => {
      cy.contains(`${state}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 2, colLength: 8 });
    });

    it("State should be in descending order", () => {
      cy.contains(`${state}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 2, colLength: 8 });
    });

    it("Title should be in ascending order", () => {
      cy.contains(`${title}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${title}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 3, colLength: 8 });
    });

    it("Title should be in descending order", () => {
      cy.contains(`${title}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${title}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 3, colLength: 8 });
    });

    it("EFT Owner should be in ascending order", () => {
      cy.contains(`${eftOwner}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${eftOwner}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 4, colLength: 8 });
    });

    it("EFT Owner should be in descending order", () => {
      cy.contains(`${eftOwner}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${eftOwner}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 4, colLength: 8 });
    });

    it("Cal Due Date should be in ascending order", () => {
      cy.contains(`${calDueDate}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${calDueDate}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 5, colLength: 8 });
    });

    it("Cal Due Date should be in descending order", () => {
      cy.contains(`${calDueDate}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${calDueDate}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 5, colLength: 8 });
    });

    it("PM Due Date should be in ascending order", () => {
      cy.contains(`${pmDueDate}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${pmDueDate}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 6, colLength: 8 });
    });

    it("PM Due Date should be in descending order", () => {
      cy.contains(`${pmDueDate}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${pmDueDate}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 6, colLength: 8 });
    });

    it("EQ Status should be in ascending order", () => {
      cy.contains(`${eqStatus}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${eqStatus}`).eq(0).parent().find("span.k-i-sort-asc-sm")
        .should("be.exist");
      cy.verifyAscSort({ index: 7, colLength: 8 });
    });

    it("EQ Status should be in descending order", () => {
      cy.contains(`${eqStatus}`).eq(0).click();
      cy.landingPageLoadingElementShouldNotExist();
      cy.contains(`${eqStatus}`).eq(0).parent().find("span.k-i-sort-desc-sm")
        .should("be.exist");
      cy.verifyDesSort({ index: 7, colLength: 8 });
    });
  });

  context("Verify that user is able to insert filter in every column", () => {
    it("Verify filter for ID", () => {
      cy.get(`[aria-colindex="1"] input`).arrowType("EQ-00001").wait(500);
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for Revision", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="2"] input`).arrowType("1A").wait(500);
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for State", () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Draft").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      cy.wait(500);
    });

    it("Verify filter for Title", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="4"] input`).arrowType("Equipment document").wait(500);
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocCounter({ docCounterNumber: 4 });
    });

    it("Verify filter for Owner", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="5"] input`).arrowType("Giovanni Reynolds").wait(500);
      cy.dlVerifyDocCounter({ docCounterNumber: 4 });
      cy.wait(500);
    });

    it("Verify filter for Cal Due Date", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="6"] input`).arrowType("N/A").wait(2000);
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      cy.wait(500);
    });

    it("Verify filter for PM Due Date", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="7"] input`).arrowType("N/A").wait(500);
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      cy.wait(500);
    });

    it("Verify filter for EQ Status", () => {
      cy.dlClearFilters();
      cy.get(`[aria-colindex="8"] input`).arrowType("Inactive").wait(500);
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      cy.wait(500);
    });

    it("Verify that user is able to click button 'Clear Filters' and all filters should be cleared'", () => {
      cy.grpClearFilter();
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="3"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
    });

    it("Verify that 'Export List' button is visible and enabled", () => {
      cy.get(`button[data-cy="document.revision.export.list"]`).should("be.visible");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("be.enabled");
    });
  });

  context("Verify hide and freeze", () => {
    it("Verify hide on Document Title", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${title}`);
      cy.get(`th[aria-colindex="4"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${title}`);
    });

    it("Verify unhide on Document Title", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${title}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains(`${title}`).parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${title}`);
    });

    it("Verify freeze on Document Title", () => {
      cy.get(`th[aria-colindex="4"] span.k-column-title`).should("have.text", `${title}`);
      cy.get(`th[aria-colindex="4"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="4"] span.k-column-title`).should("not.have.text", `${title}`);
    });

    it("Verify un-freeze on Document Title", () => {
      cy.get(`th[aria-colindex="4"] span.k-column-title`).should("not.have.text", `${title}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="2"] span.k-column-title`).should("have.text", `${title}`);
    });
  });

  context("Click on the three dots on the column that have Select option and click", () => {
    it("Group column, Hide and Freeze column should be invoked", () => {
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Group Column");
      cy.get("div.k-columnmenu-item").contains("Hide Column");
      cy.get("div.k-columnmenu-item").contains("Freeze Column");
    });

    it("User should be able to insert filter in input field and icon of the filter", () => {
      cy.get(".k-i-filter.k-icon").should("be.visible");
    });
  });

  context("Verify dropdown filters", () => {
    it("Verify dropdown filters", () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      cy.dlClearFilters();
    });

    it(`Verify "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00004");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00004");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00004");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00004");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00004");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it("Insert filter", () => {
      cy.get(`th[aria-colindex="1"] input`).arrowType("EQ-00003").wait(500);
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button.k-clear-button-visible").should("be.visible").wait(500);
    });

    it(`Select option Contains and verify that the filter is functional`, () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Contains").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it("Navigate to column with option Select field", () => {
      cy.grpClearFilter();
      cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
      cy.get("li").contains("Released").arrowClick().wait(500);
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that column with Select field have disabled crossed filter", () => {
      cy.get(".k-button-icon.k-clear-button-visible").should("exist");
    });

    it("Select option from dropdown list", () => {
      cy.get(`th[aria-colindex="2"] span.k-select`).arrowClick().wait(500);
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
    });

    it("Verify that filter is enabled and functional", () => {
      cy.get(`th[aria-colindex="4"] span.k-i-filter-clear`).should("be.visible").arrowClick();
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button-icon.k-clear-button-visible").should("exist");
    });
  });
});


