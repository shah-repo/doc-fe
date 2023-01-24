
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

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
let group;
let calDocId;
let eqLowerFrequencyURL;
let eqHigherFrequencyURL;

context("Equipment due date calculation while changing frequency", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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
                    tabId: "overview",
                    deleteInFormDisabled: true,
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
                    tabId: "specification",
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                tabId: "details",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                tabId: "details",
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
                rules: "required",
                optionId: "13",
                tabId: "details",
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
                rules: "required",
                tabId: "details",
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
                rules: "required",
                tabId: "details",
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
                type: "approvals",
                deleteDisabled: true,
                tabId: "overview",
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                tabId: "details",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                tabId: "details",
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
                rules: "required",
                tabId: "details",
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
                type: "approvals",
                deleteDisabled: true,
                tabId: "overview",
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

    it("[API]Create Equipment document with Alpha revision for lower frequency", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document for lower frequency</p>",
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
          name: "Equipment document lower frequency",
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
              frequency: 365,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 365,
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

    it("[API]Create Equipment document in Alpha revision for change to higher frequency", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document for higher frequency</p>",
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
          name: "Equipment document higher frequency",
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
              frequency: 5,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Verify changing to lower frequency", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Filter EQ-00001", () => {
      cy.dlFilterByDocId({ docId: "EQ-00001" });
    });

    it("Select first Equipment on list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to CalPmHistoryTab ", () => {
      cy.drSelectCalPmHistoryTab();
    });

    context("Verify due date before lowering frequency", () => {
      it("Check PM due date calculation is 365 days from now", () => {
        const PMComplianceDate = moment().tz("America/Los_Angeles")
          .add(365, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy=\"maintenance.status\"]")
          .eq(0).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`PMDone - Due date: ${PMComplianceDate}`);
          });
      });

      it("Check calibration due date calculation is 365 days from now", () => {
        const calibrationComplianceDate = moment().tz("America/Los_Angeles")
          .add(365, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy=\"maintenance.status\"]")
          .eq(1).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
          });
      });
    });

    context("Lower frequency on EQ-00001", () => {
      it("Navigate to CalPmHistoryTab ", () => {
        cy.drSelectCalPmHistoryTab();
      });

      it("Click revise on maintenance record", () => {
        cy.drClickReviseDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click save to confirm revise", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to CalPmHistoryTab ", () => {
        cy.drSelectCalPmHistoryTab();
      });

      it("Change frequency on PM from 365 to 60", () => {
        cy.get(`input[name$="frequency"]`).eq(0).clear().arrowType("60");
      });

      it("Change frequency on Calibration from 365 to 60", () => {
        cy.get(`input[name$="frequency"]`).eq(1).clear().arrowType("60");
      });

      it("Click save to confirm revise", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      context("Approve EQ to revision B with AR", () => {
        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });

        it("Navigate to approval request list", () => {
          cy.navigToApprovalRequestList();
        });

        it("Click Create a Approval Request button", () => {
          cy.arClickCreateAnAR();
        });

        it("Enter title AR title", () => {
          cy.arEnterApprovalRequestTitle({ title: "AR for EQ revision B" });
        });

        it("Enter description 'AR for EQ-00001'", () => {
          cy.arEnterApprovalRequestDescription({ description: "AR for EQ-00001" });
        });

        it("Add first created document revision", () => {
          cy.arClickAddDocument();
          cy.arChoseSpecificProposedDocument({ name: "EQ-00001" });
          cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
          cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
          cy.arClickAddBtnOnAddDocumentsDialog();
        });

        it("Click Create Approval Request", () => {
          cy.arSaveApiCall();
        });

        it("Add approvers to approval request on approver list", () => {
          cy.arAddApproverOnApproverList({ approver: ADMIN_USER.email });
        });

        it("Click 'Send To Review'", () => {
          cy.arClickSendToReview();
        });

        it("Approve AR", () => {
          cy.arApproveAR();
        });

        it("Close AR", () => {
          cy.arCloseAR();
        });
      });

      context("Navigate to EQ-00001", () => {
        it("Equipment list", () => {
          cy.navigToEquipment();
        });

        it("Open EQ-00001", () => {
          cy.dlSelectFirstDocument();
          cy.url().then((url: any) => {
            eqLowerFrequencyURL = url;
          });
        });

        it("Navigate to specification tab", () => {
          cy.drSelectSpecificationTab();
        });
      });

      context("Create new PM for EQ-00001", () => {
        it("Click 'NEW PM' on preventative maintenace section", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
          cy.get("[data-cy='form.builder.new.pm']").arrowClick();
          cy.wait("@response").then((res) => {
            if (res.response) {
              const response = res.response.body;
              calDocId = response.documentId;
              const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
              cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
                CyRoutes.GetAvailableApprovers], () => {
                cy.visit(newUrl);
              });
            }
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Enter title 'Preventative maintenance after lowering frequency'", () => {
          cy.drEnterDocumentTitle({ name: "Preventative maintenance after lowering frequency" });
        });

        it("navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it(`Select maintainer '${ADMIN_USER.name}'`, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
          cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
        });

        it("Fill 'Completion Date'", () => {
          const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
          cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
          cy.get("button.MuiPickersDay-day")
            .not(".MuiPickersDay-hidden")
            .each(($el) => {
              const dayNumber = $el.text();
              if (dayOfTheMonth.toString() === dayNumber) {
                cy.wrap($el).arrowClick();
              }
            });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Create 'Preventative maintenance document'", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("navigate to overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve record", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
            cy.ebApprove();
          });
        });

        it("Verify status is 'Released'", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });

      context("Navigate to EQ-00001 and verify due dates", () => {
        it("Navigate to Equipment document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
            cy.visit(eqLowerFrequencyURL);
          });
          cy.listLoadingElementShouldNotExist();
        });

        it("Navigate to CalPmHistoryTab ", () => {
          cy.drSelectCalPmHistoryTab();
        });

        it("Check PM due date calculation is 60 days from now", () => {
          const PMComplianceDate = moment().tz("America/Los_Angeles")
            .add(60, "days")
            .format("ddd, MMMM D, YYYY");
          cy.get("[data-cy=\"maintenance.status\"]")
            .eq(0).then(($el) => {
              const text = $el.text().replace(/\u00a0/g, "");
              expect(text).to.contain(`PMDone - Due date: ${PMComplianceDate}`);
            });
        });

        it("Check calibration due date calculation is 60 days from now", () => {
          const calibrationComplianceDate = moment().tz("America/Los_Angeles")
            .add(60, "days")
            .format("ddd, MMMM D, YYYY");
          cy.get("[data-cy=\"maintenance.status\"]")
            .eq(1).then(($el) => {
              const text = $el.text().replace(/\u00a0/g, "");
              expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
            });
        });
      });
    });

    context("Verify changing to increased frequency", () => {
      it("Navig to equipment", () => {
        cy.navigToEquipment();
      });

      it("Filter EQ-00002", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EQ-00002" });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Navigate to CalPmHistoryTab ", () => {
        cy.drSelectCalPmHistoryTab();
      });

      context("Verify due date before lowering frequency", () => {
        it("Check PM due date calculation is 5 days from now", () => {
          const PMComplianceDate = moment().tz("America/Los_Angeles")
            .add(5, "days")
            .format("ddd, MMMM D, YYYY");
          cy.get("[data-cy=\"maintenance.status\"]")
            .eq(0).then(($el) => {
              const text = $el.text().replace(/\u00a0/g, "");
              expect(text).to.contain(`PMDone - Due date: ${PMComplianceDate}`);
            });
        });

        it("Check calibration due date calculation is 20 days from now", () => {
          const calibrationComplianceDate = moment().tz("America/Los_Angeles")
            .add(5, "days")
            .format("ddd, MMMM D, YYYY");
          cy.get("[data-cy=\"maintenance.status\"]")
            .eq(1).then(($el) => {
              const text = $el.text().replace(/\u00a0/g, "");
              expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
            });
        });
      });

      context("Increase frequency on EQ-00002 and verify it updates on EQ", () => {
        it("Click revise on maintenance record", () => {
          cy.drClickReviseDocument();
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Click save to confirm revise", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Navigate to CalPmHistoryTab ", () => {
          cy.drSelectCalPmHistoryTab();
        });

        it("Change frequency on PM from 5 to 20", () => {
          cy.get(`input[name$="frequency"]`).eq(0).clear().arrowType("20");
        });

        it("Change frequency on Calibration from 5 to 20", () => {
          cy.get(`input[name$="frequency"]`).eq(1).clear().arrowType("20");
        });

        it("Click save to confirm revise", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        context("Approve EQ to revision B with AR", () => {
          it("Turn on autosave", () => {
            cy.cmpTurnOnAutosave();
          });

          it("Navigate to approval request list", () => {
            cy.navigToApprovalRequestList();
          });

          it("Click Create a Approval Request button", () => {
            cy.arClickCreateAnAR();
          });

          it("Enter title AR title", () => {
            cy.arEnterApprovalRequestTitle({ title: "AR for EQ revision B" });
          });

          it("Enter description 'AR for EQ-00002'", () => {
            cy.arEnterApprovalRequestDescription({ description: "AR for EQ-00002" });
          });

          it("Add first created document revision", () => {
            cy.arClickAddDocument();
            cy.arChoseSpecificProposedDocument({ name: "EQ-00002" });
            cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
            cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
            cy.arClickAddBtnOnAddDocumentsDialog();
          });

          it("Click Create Approval Request", () => {
            cy.arSaveApiCall();
          });

          it("Add approvers to approval request on approver list", () => {
            cy.arAddApproverOnApproverList({ approver: ADMIN_USER.email });
          });

          it("Click 'Send To Review'", () => {
            cy.arClickSendToReview();
          });

          it("Approve AR", () => {
            cy.arApproveAR();
          });

          it("Close AR", () => {
            cy.arCloseAR();
          });
        });

        context("Navigate to EQ-00002", () => {
          it("Equipment list", () => {
            cy.navigToEquipment();
          });

          it("Open EQ-00002", () => {
            cy.dlSelectFirstDocument();
            cy.url().then((url: any) => {
              eqHigherFrequencyURL = url;
            });
          });

          it("Navigate to specification tab", () => {
            cy.drSelectSpecificationTab();
          });
        });

        context("Create new PM for EQ-00002", () => {
          it("Click 'NEW PM' on preventative maintenace section", () => {
            cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
            cy.get("[data-cy='form.builder.new.pm']").arrowClick();
            cy.wait("@response").then((res) => {
              if (res.response) {
                const response = res.response.body;
                calDocId = response.documentId;
                const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
                cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
                  CyRoutes.GetAvailableApprovers], () => {
                  cy.visit(newUrl);
                });
              }
            });
            cy.checkToastMessage({ exists: false });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Turn off autosave", () => {
            cy.cmpTurnOffAutosave();
          });

          it("Enter title 'Preventative maintenance after increasing frequency'", () => {
            cy.drEnterDocumentTitle({ name: "Preventative maintenance after increasing frequency" });
          });

          it("navigate to Details tab", () => {
            cy.drSelectDetailsTab();
          });

          it(`Select maintainer '${ADMIN_USER.name}'`, () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
            cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
          });

          it("Fill 'Completion Date'", () => {
            const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
            cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
            cy.get("button.MuiPickersDay-day")
              .not(".MuiPickersDay-hidden")
              .each(($el) => {
                const dayNumber = $el.text();
                if (dayOfTheMonth.toString() === dayNumber) {
                  cy.wrap($el).arrowClick();
                }
              });
          });

          it("Click save document", () => {
            cy.drClickCreateDocumentWithApiCallForForms();
          });

          it("Create 'Preventative maintenance document'", () => {
            cy.drClickCreateDocumentWithApiCall();
          });

          it("navigate to overview tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Add an Approval", () => {
            cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
          });

          it("Submit for approval", () => {
            cy.pmSubmitForApproval();
          });

          it("Approve record", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
              cy.ebApprove();
            });
          });

          it("Verify status is 'Released'", () => {
            cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
          });
        });

        context("Navigate to EQ-00002 and verify due dates", () => {
          it("Navigate to Equipment document", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
              cy.visit(eqHigherFrequencyURL);
            });
            cy.listLoadingElementShouldNotExist();
          });

          it("Navigate to CalPmHistoryTab ", () => {
            cy.drSelectCalPmHistoryTab();
          });

          it("Check PM due date calculation is 20 days from now", () => {
            const PMComplianceDate = moment().tz("America/Los_Angeles")
              .add(20, "days")
              .format("ddd, MMMM D, YYYY");
            cy.get("[data-cy=\"maintenance.status\"]")
              .eq(0).then(($el) => {
                const text = $el.text().replace(/\u00a0/g, "");
                expect(text).to.contain(`PMDone - Due date: ${PMComplianceDate}`);
              });
          });

          it("Check calibration due date calculation is 20 days from now", () => {
            const calibrationComplianceDate = moment().tz("America/Los_Angeles")
              .add(20, "days")
              .format("ddd, MMMM D, YYYY");
            cy.get("[data-cy=\"maintenance.status\"]")
              .eq(1).then(($el) => {
                const text = $el.text().replace(/\u00a0/g, "");
                expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
              });
          });
        });
      });
    });
  });
});
