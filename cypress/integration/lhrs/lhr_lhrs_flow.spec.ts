// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let formDocumentType;
let createdPMRecord;
let createdCalibrationRecord;
let createdEquipmentFormDocument;
let maintenanceRecordDocumentType;
let createdEquipmentNumericRevision;
let createdLotsFormDocument;
let CSLDocumentType;
let createdLot;
let createdPMForm;
let createdCalibrationForm;
let materialsDocumentType;
let createdPartDocument;
let equipmentDocument;
let materialsDocument;
let secondEmployee;
let thirdEmployee;
let lhrs1DocUrl;
let lhr1DocUrl;
const LHR_TYPE = "Lot History Record";
const lotNumber = "LOT #22041301";
const groupTwo = "Developers";
const history = [
  {
    owner: USERS[1].name,
    actions: [{ key: "Access granted to group", value: `Developers` }],
  },
  {
    owner: USERS[1].name,
    actions: [{ key: "Access granted to user", value: `${USERS[3].name}` }],
  },
];

context("LHR & LHRS Flow", () => {
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
            documentTypes: [MPITest, QPITest, LHRTTest],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[1].email
          );
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            "Approval Request"
          );
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            "Equipment"
          );
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            "Parts"
          );
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
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
                effectiveDate: new Date().toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [
                  { approver: { id: adminEmployee.id } },
                ],
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
            effectiveDate: new Date().toISOString(),
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
                label: "Initial Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_usable_quantity",
                type: "quantity",
                index: 1,
                label: "Usable Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Usable Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_expiry_date",
                type: "datepicker",
                index: 2,
                label: "Expiration Date",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Expiration Date",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_part",
                type: "autocomplete",
                index: 3,
                label: "Part Selection",
                tabId: "details",
                optionId: "21",
                placeholder: "Select the appropriate part for this lot",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "100-inspection-override",
                type: "checkboxgroup",
                index: 4,
                label: "100% Inspection Override",
                tabId: "details",
                options: [
                  {
                    text: "100% Inspection Override",
                    value: "100% Inspection Override",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                editorProperties: [],
                validationAttribute: "100% Inspection Override",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "details",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-",
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

    it("[API]Create Lot record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdLotsFormDocument.id,
          },
          formInput: {
            "fb-approvals-": [],
            "lot_quantity": 5,
            "lot_usable_quantity": 3,
            "lot_expiry_date": new Date(),
            "lot_part": createdPartDocument.id,
            "100-inspection-override": [
              "100% Inspection Override",
            ],
          },
          description: "",
          name: "API LOT 1",
          attachments: [],
          referenceTo: [],
          revisionStage: 3,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: lotNumber,
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
              id: CSLDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLot = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLot.id,
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
            effectiveDate: new Date().toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });
    it("[API] API request for updating company navigation", (done: any) => {
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
              restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [GroupTag.DOCUMENT_TYPE_MANAGEMENT],
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
  });

  context("Create and Release MPI document", () => {
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
        cy.drEnterDocumentDescription({
          description: "MPI document description",
        });
      });

      it("Select 'Manufacturing Process Instructions' document type from dropdown", () => {
        cy.drSelectDocumentType({
          documentType: "Manufacturing Process Instructions",
        });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });
    });

    context("Fill step #1", () => {
      it("Fill step #1 description", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.mpiEnterDescriptionToStep({
            numbOfStep: 1,
            description: "Description of step one",
          });
        });
      });

      it("Add 'Part document' to step #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.mpiAddMaterialDocumentToStep({
            numbOfStep: 1,
            material: "Part document",
            quntity: "3",
            unit: "Each",
          });
        });
      });

      it("Add 'Equipment one' to step #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.mpiAddEquipmentToStep({
            numbOfStep: 1,
            equipment: "Equipment one",
          });
        });
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

  context("Create and Release QPI Document", () => {
    context("Create QPI document", () => {
      context("Start document creation flow", () => {
        it("Navigate to Document list", () => {
          cy.navigToDocumentList();
        });

        it("Click on 'Create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in the QPI attributes and verify state", () => {
        it("Enter title 'QPI document", () => {
          cy.drEnterDocumentTitle({ name: "QPI document1" });
        });

        it("Enter description 'QPI document description'", () => {
          cy.drEnterDocumentDescription({
            description: "QPI document description",
          });
        });

        it("Select 'Quantity Process Instructions Test' document type from dropdown", () => {
          cy.drSelectDocumentType({
            documentType: "Quantity Process Instructions Test",
          });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });
    context("Release QPI", () => {
      it("Approve and release QPI document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
        cy.drEnterDocumentDescription({
          description: "LHRt document description",
        });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: LHR_TYPE });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy='lhr-selected-part']").arrowType("Part document");
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev],
          () => {
            cy.get("ul>li[role=option]").contains("Part document").arrowClick();
          }
        );
      });

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("[data-cy='LHR Step 1']").arrowClick();
          cy.get("input[data-cy='lhrstep-built-in']").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev],
            () => {
              cy.get("input[data-cy='lhrstep-built-in']").autocompleteSelect(
                "MPI document", { force: true }
              );
            }
          );
        });
      });

      context("Add another step with different QPI on document ", () => {
        it("Add LHR step", () => {
          cy.get("[data-cy='form.builder.add.step']").last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select MPI document created with API for step #2 in LHRt", () => {
          cy.get("[data-cy='LHR Step 2']").arrowClick();
          cy.get("input[data-cy^='lhr-step']").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls(
            [
              CyRoutes.GetAutocompleteOptions,
              CyRoutes.GetAutocompleteOptions,
              CyRoutes.PatchDocRev,
            ],
            () => {
              cy.listLoadingElementShouldNotExist();
              cy.get("input[data-cy^='lhr-step']").autocompleteSelect(
                "QPI document1", { force: true }
              );
            }
          );
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });
  context("Create LHR document", () => {
    context("Start document creation flow", () => {
      it("Navigate to LHR list", () => {
        cy.navigToLHR();
      });

      it("Click on 'Initiate New LHR' button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select 'Lot History Record' form", () => {
        cy.get("[data-cy=\"field-selectType\"]").arrowClick().wait(1000);
        cy.contains(new RegExp("^Lot History Record$", "g")).arrowClick();
      });

      it("Verify LHR is in DRAFT status", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      });
    });
  });
  context(
    "Check that all fields defined in the LHRT are displayed in the correct tabs",
    () => {
      context("verify fields in Overview Tab", () => {
        it("LHR step should be expandable/collapsible", () => {
          cy.get("[data-cy=AttachmentFieldPresenter-field").should(
            "be.visible"
          );
        });
        it("Verify Part to be manufactured is exists", () => {
          cy.get("[data-cy=lhr-selected-part").should("be.visible");
        });
        it("Verify Initial Quantity is exists", () => {
          cy.get("[data-cy=lhr_initial_quantity").should("be.visible");
        });
        it("Verify End Quantity is exists", () => {
          cy.get("[data-cy=lhr-end-quantity").should("be.visible");
        });
        it("Verify Build type is exists", () => {
          cy.get("[data-cy='Build Type'").should("be.visible");
        });
        it("Verify Due Date is exists", () => {
          cy.get("[data-cy='Due Date'").should("be.visible");
        });
        it("Verify Approval Block is exists", () => {
          cy.get("[data-cy='form.builder.approvals']").eq(0).scrollIntoView().should("be.visible");
        });
      });
      context("verify fields in Details Tab", () => {
        it("Navigate to Detail Tab", () => {
          cy.drSelectDetailsTab();
        });

        context("LHR Step -", () => {
          it("LHR step should be expandable/collapsable", () => {
            cy.get("div[class^='MuiExpansionPanelSummary']").eq(0).arrowClick();
            cy.wait(300);
            cy.get("div[class^='MuiExpansionPanelSummary']").eq(0).arrowClick();
          });
          context(
            "LHR step should display all the steps defined in the LHRT",
            () => {
              it("verify LHR step 1 exists", () => {
                cy.get("[data-cy='LHR Step 1']").should("be.visible");
              });
              it("verify LHR step 2 exists", () => {
                cy.get("[data-cy='LHR Step 2']").should("be.visible");
              });
            }
          );
          it("LHR step should display all the steps defined in the LHRT", () => {
            cy.get("[data-cy='LHR Step 1']").should("be.visible");
            cy.get("[data-cy='LHR Step 2']").should("be.visible");
          });
          it("LHR Step # and LHRS status of Not Started", () => {
            cy.get("[data-cy='form.builder.step.noStarted']").should(
              "have.length",
              "2"
            );
          });
          context(
            "Expand each LHR step - the following fields should be displayed",
            () => {
              context("verify the following fields for LHR Step1", () => {
                it("verify MPI/QPI Doc ID and Title", () => {
                  cy.get("input[value='MPI-00001 - MPI document']").should(
                    "exist"
                  );
                });
                it("verify Start Step button exists", () => {
                  cy.get("[data-cy='form.builder.start.step']")
                    .eq(0)
                    .should("exist");
                });
                it("verify Start quantity exists", () => {
                  cy.get("[data-cy='start-quantity-1']").should("exist");
                  cy.get("[data-cy='start-quantity-value-1']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify Accepted quantity exists", () => {
                  cy.get("[data-cy='accepted-quantity-1']").should("exist");
                  cy.get("[data-cy='accepted-quantity-value-1']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify Rejected quantity exists", () => {
                  cy.get("[data-cy='rejected-quantity-1']").should("exist");
                  cy.get("[data-cy='rejected-quantity-value-1']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify operators field exists", () => {
                  cy.get("[data-cy='operators-1']").should("exist");
                });
                context(`If LHR step has not been started yet,the operators will be fetched from 
                the Operators field in Access Permissions`, () => {
                  it("Click on sidebar permission icon to add Operators", () => {
                    cy.drSelectPermissionTab();
                  });
                  it(`Select '${USERS[2].name}' to Assign document to`, () => {
                    cy.drAssignDocumentTo({ username: USERS[2].name });
                  });
                  it("Navigate to Detail Tab", () => {
                    cy.wait(3000);
                    cy.drSelectDetailsTab();
                  });
                  it(`verify operators should have '${USERS[2].name}'`, () => {
                    cy.wait(2000);
                    cy.get("[data-cy='LHR Step 1']").arrowClick();
                    cy.get("[data-cy='operator-name-1-0']").should("have.text", USERS[2].name);
                  });
                  it("Click on sidebar permission icon to add Operators", () => {
                    cy.drSelectPermissionTab();
                  });
                  it(`remove operator '${USERS[2].name}'`, () => {
                    cy.get("[data-cy^='operator-ac-']").find("svg").arrowClick({ force: true });
                  });
                  it("Navigate to Detail Tab", () => {
                    cy.wait(3000);
                    cy.drSelectDetailsTab();
                  });
                  it(`verify operators should have '${USERS[2].name}'`, () => {
                    cy.get("[data-cy='LHR Step 1']").arrowClick();
                    cy.get("[data-cy='operator-name-1-0']").should("not.exist");
                  });
                });
              });
              context("verify the following fields for LHR Step2", () => {
                it("verify QPI Doc ID and Title", () => {
                  cy.get("input[value='QPI-00002 - QPI document1']").should(
                    "exist"
                  );
                });
                it("verify Start Step button exists", () => {
                  cy.get("[data-cy='form.builder.start.step']")
                    .eq(1)
                    .should("exist");
                });
                it("verify Start quantity exists", () => {
                  cy.get("[data-cy='start-quantity-2']").should("exist");
                  cy.get("[data-cy='start-quantity-value-2']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify Accepted quantity exists", () => {
                  cy.get("[data-cy='accepted-quantity-2']").should("exist");
                  cy.get("[data-cy='accepted-quantity-value-2']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify Rejected quantity exists", () => {
                  cy.get("[data-cy='rejected-quantity-2']").should("exist");
                  cy.get("[data-cy='rejected-quantity-value-2']").should(
                    "have.value",
                    ""
                  );
                });
                it("verify operators field exists", () => {
                  cy.get("[data-cy=operators-2]").should("exist");
                });
                context(`If LHR step has not been started yet,the operators will be fetched from 
                the Operators field in Access Permissions`, () => {
                  it("Click on sidebar permission icon to add Operators", () => {
                    cy.drSelectPermissionTab();
                  });
                  it(`Select '${USERS[2].name}' to Assign document to`, () => {
                    cy.drAssignDocumentTo({ username: USERS[2].name });
                  });
                  it("Navigate to Detail Tab", () => {
                    cy.listLoadingElementShouldNotExist();
                    cy.progressBarShouldNotExist();
                    cy.wait(2000);
                    cy.drSelectDetailsTab();
                  });
                  it(`verify operators should have '${USERS[2].name}'`, () => {
                    cy.wait(2000);
                    cy.get("[data-cy='LHR Step 2']").arrowClick();
                    cy.get("[data-cy='operator-name-2-0']").should("have.text", USERS[2].name);
                  });
                  it("Click on sidebar permission icon to add Operators", () => {
                    cy.drSelectPermissionTab();
                  });
                  it(`remove operator '${USERS[2].name}'`, () => {
                    cy.get("[data-cy^='operator-ac-']").find("svg").arrowClick({ force: true });
                  });
                  it("Navigate to Detail Tab", () => {
                    cy.wait(3000);
                    cy.drSelectDetailsTab();
                  });
                  it(`verify operators should have '${USERS[2].name}'`, () => {
                    cy.get("[data-cy='LHR Step 2']").arrowClick();
                    cy.get("[data-cy='operator-name-2-0']").should("not.exist");
                    cy.get("[data-cy=references-icon]").arrowClick();
                  });
                });
              });
            }
          );
        });
      });
      context("Materials & Equipment tab", () => {
        it("Navigate to Materials and Equipment Tab", () => {
          cy.drSelectMaterialsAndEquipmentTab();
        });
        it("should display aggregate materials/EQ from all the LHR steps", () => {
          cy.get(`[data-cy="form.builder.materials"]`).eq(0).parent().find("div").contains("1 items").should("exist");
        });
      });
    });

  context("Verify Right panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });
    it("Navigate to Materials and Equipment Tab", () => {
      cy.verifyExpandCollpase();
    });
    it("All tabs are fixed as the user scrolls up or down", () => {
      cy.verifyFixedTab();
    });
    context("verify All right panel tabs ", () => {
      context("verify reference tab ", () => {
        it("Reference Tab info", () => {
          cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
        });
        it("Verify References selection Add Remove", () => {
          cy.verifyAddRemoveReference({ formId: "FM-00001" });
        });
        it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
          cy.verifyReferenceInfo();
          cy.get("[data-cy='common.revision']").should(
            "contain.text",
            "Revision"
          );
          cy.get("[data-cy='common.revision']")
            .parent()
            .should("contain.text", "LHRT-0000");
          cy.get("[data-cy='common.revision']")
            .parent()
            .should(
              "contain.text",
              moment().tz("America/Los_Angeles").format("MM/DD/YYYY")
            );
        });
        it("verify migrate form button should exists or not", () => {
          cy.get("[data-cy='common.form.migration']").should("exist");
        });
      });
      context("Verify Revision", () => {
        it("open revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });
        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy='DocumentRevisionList-item']")
            .eq(0)
            .arrowClick();
          cy.wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should(
            "contain.text",
            "Rev A"
          );
        });
      });

      context(
        "Verify User able to add Groups or other user permissions",
        () => {
          it("Open permissions tab", () => {
            cy.drSelectPermissionTab();
          });

          it("Add another user permission", () => {
            cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
              cy.drAddUserFromPermissionTab(USERS[3].name);
            });
          });

          it("Add another group permission", () => {
            cy.wrapWithWaitOnApiCalls(
              [CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity],
              () => {
                cy.drAddGroupFromPermissionTab("Developers");
              }
            );
          });
        }
      );

      context("Check document history", () => {
        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });
        verifyHistoryContent(history, groupTwo);
      });

      context("Verify Book Mark Exist or not", () => {
        it("Verify Book", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });
      });
    });
  });

  context(
    "navigate to Access Permission Tab and assign 2 operators: User 1 and User 2",
    () => {
      it("Click on sidebar permission icon to add Operators", () => {
        cy.drSelectPermissionTab();
      });

      it(`Select '${USERS[2].name}' to Assign document to`, () => {
        cy.drAssignDocumentTo({ username: USERS[2].name });
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.drSelectPermissionTab();
      });

      it(`Select '${USERS[3].name}' to Assign document to`, () => {
        cy.drAssignDocumentTo({ username: USERS[3].name });
      });
    }
  );
  context("Select Build type: Production", () => {
    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value='Production']").check();
    });
  });

  context("Start LHR step #1.", () => {
    it("Navigate to Detail Tab", () => {
      cy.url().then((url: any) => {
        lhr1DocUrl = url;
      });
      cy.drSelectDetailsTab();
    });

    it("Click 'START MPI'", () => {
      cy.get("[data-cy='LHR Step 1']").arrowClick();
      cy.mpiStartStep({ stepNumber: 1 });
      cy.wait(3000);
    });
  });

  context("verify LHRS header content", () => {
    it("verify LHRS header should be displayed as as: LHR > LHR-number Rev > Step #n.", () => {
      cy.reload();
      cy.get("#HeaderInfo-subtitle > .MuiTypography-root").contains("LHR-00001");
      cy.verifyHeaderInfoContent({
        docId: "Step #1",
        title: "LHR",
        status: STATUS_TYPES_LABEL.WIP,
        revision: "Rev A",
      });
    });
  });

  context("Verify LHRS tabs", () => {
    it("LHRS should have 2 tabs - Overview and Procedure tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.procedure']").should("exist");
    });
    context("verify fields in overview tab ", () => {
      context("Overview Tab - should have the attachments and approval block", () => {

        it("Verify Attachments exists or not", () => {
          cy.get("[data-cy='AttachmentFieldPresenter-field'").should(
            "be.visible"
          );
        });
        it("Verify Approval Block is exists or not", () => {
          cy.get("[data-cy^='fb-approvals'").should("be.visible");
        });
      });
    });
    context("verify fields in procedure tab ", () => {
      context("Procedure Tab - should have the PI procedure: Steps, Attachments, Materials and Equipment, " +
               "Start/Accepted/Rejected Quantities and all other FB fields defined in the MPI/QPI ", () => {
        it("Navigate to Procedure Tab", () => {
          cy.drSelectProcedureTab();
        });
        it("Verify Steps exists or not", () => {
          cy.get("[data-cy='form.builder.step.number'").should(
            "be.visible"
          );
        });
        it("Verify Attachment field is exists or not", () => {
          cy.get("[data-cy='form.builder.attachments'").should("exist");
        });
        it("Verify Materials is exists or not", () => {
          cy.get("[data-cy='form.builder.materials'").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Equipment is exists or not", () => {
          cy.get("[data-cy='form.builder.equipment'").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Start Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-start-quantity']").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Rejected Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-rejected-quantity']").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Accepted Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-accepted-quantity']").scrollIntoView()
            .should("be.visible");
        });

      });
    });
  });
  context("verify All right panel tabs ", () => {
    context("verify reference tab ", () => {
      it("Reference Tab info", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });
      it("Verify References selection Add Remove", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });
      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should(
          "contain.text",
          "Revision"
        );
        cy.get("[data-cy='common.revision']")
          .parent()
          .should("contain.text", "MPI-00001");
        cy.get("[data-cy='common.revision']")
          .parent()
          .should(
            "contain.text",
            moment().tz("America/Los_Angeles").format("MM/DD/YYYY")
          );
      });
      it("verify migrate form button should exists or not", () => {
        cy.get("[data-cy='common.form.migration']").should("exist");
      });
    });
    context("Verify Revision", () => {
      it("open revision tab", () => {
        cy.get("[data-cy='note-icon']").arrowClick();
      });
      it("Verify revision Rev Document open or not", () => {
        cy.get("[data-cy='DocumentRevisionList-item']")
          .eq(0)
          .arrowClick();
        cy.wait(2000);
        cy.get("[data-cy='HeaderInfo-Rev']").should(
          "contain.text",
          "Rev A"
        );
      });
    });

    context(
      "Verify User able to add Groups or other user permissions",
      () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(USERS[3].name);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity],
            () => {
              cy.drAddGroupFromPermissionTab("Developers");
            }
          );
        });
      }
    );

    context("Check document history", () => {
      it("Verify history tab", () => {
        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });
        verifyHistoryContent(history, groupTwo);
      });
    });

    context("Verify Book Mark Exist or not", () => {
      it("Verify Book", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        cy.get("[data-cy=references-icon]").arrowClick();
      });
    });
  });
  context("User should be able to:", () => {
    it("Navigate to Procedure Tab", () => {
      cy.drSelectProcedureTab();
    });
    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[name='lhrs-start-quantity']").arrowType("10");
        cy.unClick();
      });
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[name='lhrs-accepted-quantity']").arrowType("8");
        cy.unClick();
      });
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[name='lhrs-rejected-quantity']").arrowType("2");
        cy.unClick();
      });
    });

    it("Click 'SELECT' for 'Material One' ", () => {
      cy.get("[data-cy='form.builder.select']")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("ul>li[role=option]").contains(lotNumber).arrowClick();
    });

    it("Select quantity in lot dialog", () => {
      cy.get("input[name='quantity']").arrowType("0.5");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy='fb-control-btn']")
          .eq(0)
          .click();
      });
      cy.wait(5000);
    });

    it("Click 'SELECT' for 'Equipment one' ", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("button[data-cy='fb-control-btn']")
          .eq(1)
          .click({ force: true });
      });
    });

    it("Select CAL/PM 'Equipment document'", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy='usedOverride']").arrowClick();
      cy.get("ul>li[role='option']").contains("Equipment document").arrowClick();
    });

    it("Click 'SAVE' on select equipment dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy='fb-control-btn']")
          .eq(0)
          .click();
      });
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval User1", () => {
      cy.get("[data-cy^='fb-approvals-approvals']").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
      });
    });
    it("Add an Approval User2", () => {
      cy.get("[data-cy^='fb-approvals-approvals']").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
      });
      cy.wait(5000);
      cy.url().then((url: any) => {
        lhrs1DocUrl = url;
      });
    });
    it("Click complete step", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

  });

  context("Click LHR link.:", () => {
    it("navigate to LHR", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhr1DocUrl);
      });
    });
  });

  context("The loader and steps progres status", () => {
    it("verify loader is present", () => {
      cy.get("[data-cy='LHR-Step-Progress-Bar']").should("be.visible");
    });
    it("verify Step 1 is in progress or not", () => {
      cy.get("[data-cy='inprogress-steps']").contains("1").should("exist");
    });
    it("verify Step 2 is in not in progress", () => {
      cy.get("[data-cy='inprogress-steps']").contains("2").should("not.exist");
    });
  });

  context("verify in Details tab: LHR Step# 2 should remain with Not Started status", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("Check Step 2 status in Not Started or not", () => {
      cy.get("[data-cy='form.builder.step.noStarted']").should(
        "have.length",
        "1"
      );
    });
  });
  context("verify LHR Step# 1 status and info", () => {
    it("LHR Step #1 should have status of In Progress", () => {
      cy.get("[data-cy='form.builder.step.inprogress']").should(
        "have.length",
        "1"
      );
    });

    context(`Expand LHR step - User1 and User2 should be displayed in the Operators list with Pending
    approval status`, () => {
      it(`verify operator '${USERS[2].name}' and Pending status`, () => {
        cy.get("[data-cy='operator-name-1-0']").should("have.text", USERS[2].name);
        cy.get("[data-cy='operator-status-1-0']").should("have.text", "Pending");
      });
      it(`verify operator '${USERS[3].name}' and Pending status`, () => {
        cy.get("[data-cy='operator-name-1-1']").should("have.text", USERS[3].name);
        cy.get("[data-cy='operator-status-1-1']").should("have.text", "Pending");
      });
    });
    it("verify MPI/QPI Doc ID, Rev and Title", () => {
      cy.get("div[class^='MuiExpansionPanelSummary']").eq(0).arrowClick();
      cy.get("[data-cy='lhrstep-built-in'][value='LHR-00001, Step #1 (MPI-00001, MPI document, Rev 1)']")
        .should("exist");
    });
    it("verify Button beside MPI should now be changed View Step", () => {
      cy.get("[data-cy='form.builder.view.step']").should("exist");
    });
  });

  context("Login First operator and complete step", () => {
    it("Logout admin user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Navig to LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrs1DocUrl);
      });
    });

    context("Complete LHRs with operator", () => {
      it("Approve step", () => {
        cy.ebApprove();
        cy.wait(5000);
      });
    });
  });

  context("Login Second operator and complete step", () => {

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Navig to LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrs1DocUrl);
      });
    });

    context("Complete LHRs with operator", () => {
      it("Approve step", () => {
        cy.ebApprove();
        cy.wait(3000);
      });
    });
  });

  context("Login as owner and access LHR", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
    it("Navig to LHRs #1", () => {
      cy.reload();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhr1DocUrl);
      });
    });
  });
  context("check loader and steps progres status", () => {
    context("check loader present and LHR step #1 should be completed", () => {
      it("verify loader is present", () => {
        cy.get("[data-cy='LHR-Step-Progress-Bar']").should("be.visible");
      });
      it("verify Step 1 is completed", () => {
        cy.get("[data-cy='completed-steps']").contains("1").should("exist");
      });
    });
    context("LHR step #2 should remain with Not Started status", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Check Step 2 status in Not Started or not", () => {
        cy.get("[data-cy='form.builder.step.noStarted']").should(
          "have.length",
          "1"
        );
      });
    });
    context("LHR Step #1 should now have status of Completed with date and time stamp.", () => {
      it("Verify date of completion LHRs #1", () => {
        cy.get("[data-cy='form.builder.step.complete']")
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Completed"]);
          });
      });
    });
  });
  context("Expand LHR step #1", () => {
    // 29
    context(`Operator List - status of Approved with date and timestamp should
     be displayed beside the operator/approver (User 1 and User 2)`, () => {
      it(`verify operator '${USERS[2].name}' and APPROVED status`, () => {
        cy.get("[data-cy='operator-name-1-0']").should("have.text", USERS[2].name);
        cy.get("[data-cy='operator-status-1-0']").should("have.text", "Approved");
      });
      it(`verify operator '${USERS[3].name}' and APPROVED status`, () => {
        cy.get("[data-cy='operator-name-1-1']").should("have.text", USERS[3].name);
        cy.get("[data-cy='operator-status-1-1']").should("have.text", "Approved");
      });
    });
    context("Start/Accepted/Rejected quantities should be displayed", () => {
      it("check Start quntity", () => {
        cy.get("[data-cy='start-quantity-value-1']").should("have.text", "10");
      });
      it("check Accepted quntity", () => {
        cy.get("[data-cy='accepted-quantity-value-1']").should("have.text", "8");
      });
      it("check Rejected quntity", () => {
        cy.get("[data-cy='rejected-quantity-value-1']").should("have.text", "2");
      });
    });
    it("verify Button beside MPI should now be changed View Step", () => {
      cy.get("[data-cy='form.builder.view.step']").should("exist");
    });
  });

  context("Materials & Equipment tab", () => {
    it("Navigate to Materials and Equipment Tab", () => {
      cy.drSelectMaterialsAndEquipmentTab();
      cy.wait(500);
      cy.get("[data-cy='tabCon-tabId.materialsandequipment']").arrowClick({ multiple: true });
    });
    it("Materials - Lot Number for the material should be displayed", () => {
      cy.get(".MuiChip-label").contains(lotNumber);
    });
    it("Equipment - Cal/PM Next due dates should be displayed", () => {
      cy.get("[data-cy='form.builder.equipment']").arrowClick({ multiple: true });
      cy.get(".MuiChip-label").contains("Callibration Due");
      cy.get(".MuiChip-label").contains("Preventive Maintenance Due");
    });
  });

  context("In the LHR, changed build type to R&D", () => {
    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
    it("Select 'R&D' build type", () => {
      cy.contains("Build Type").should("be.visible");
      cy.contains("Build Type").scrollIntoView().arrowClick().wait(1000);
      cy.get("[value='R&D']").check();
      cy.wait(2000);
    });

    it("Select button to switch", () => {
      cy.get("[data-cy=\"form.builder.lhr.build.switch\"]").then(() => {
        cy.get("[data-cy=\"form.builder.lhr.build.switch\"]").last().arrowClick();
      });
    });
  });

  context("verify the following fields for LHR Step2", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("verify QPI Doc ID and Title", () => {
      cy.get("div[class^='MuiExpansionPanelSummary']").eq(1).arrowClick();
      cy.get("input[value='QPI-00002 - QPI document1']").should(
        "exist"
      );
    });
    it("verify Start Step button exists", () => {
      cy.get("[data-cy='form.builder.start.step']").should("exist");
    });
    it("verify Start quantity exists", () => {
      cy.get("[data-cy=start-quantity-2]").should("exist");
      cy.get("[data-cy=start-quantity-value-2]").should(
        "have.value",
        ""
      );
    });
    it("verify Accepted quantity exists", () => {
      cy.get("[data-cy=accepted-quantity-2]").should("exist");
      cy.get("[data-cy=accepted-quantity-value-2]").should(
        "have.value",
        ""
      );
    });
    it("verify Rejected quantity exists", () => {
      cy.get("[data-cy=rejected-quantity-2]").should("exist");
      cy.get("[data-cy=rejected-quantity-value-2]").should(
        "have.value",
        ""
      );
    });
    it("verify operators field exists", () => {
      cy.get("[data-cy='operators-2']").should("exist");
    });
    it(`verify operators should have '${USERS[2].name}'`, () => {
      cy.get("[data-cy='operator-name-2-0']").should("have.text", USERS[2].name);
    });
    it(`verify operators should have '${USERS[3].name}'`, () => {
      cy.get("[data-cy='operator-name-2-1']").should("have.text", USERS[3].name);
    });
    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
      cy.wait(3000);
      cy.reload();
    });
  });
  context("Verify LHRS tabs", () => {
    it("LHRS should have 2 tabs - Overview and Procedure tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.procedure']").should("exist");
    });
    context("verify fields in overview tab ", () => {
      context("Overview Tab - should have the attachments and approval block", () => {
        it("Verify Attachments exists or not", () => {
          cy.get("[data-cy='AttachmentFieldPresenter-field'").should(
            "be.visible"
          );
        });
        it("Verify Approval Block is exists or not", () => {
          cy.get("[data-cy^='fb-approvals'").should("be.visible");
        });
      });
    });
    context("verify fields in procedure tab ", () => {
      context("Procedure Tab - should have the PI procedure: Steps, Attachments, Materials and Equipment, " +
                 "Start/Accepted/Rejected Quantities and all other FB fields defined in the MPI/QPI ", () => {
        it("Navigate to Procedure Tab", () => {
          cy.drSelectProcedureTab();
        });
        it("Verify Steps exists or not", () => {
          cy.get("[data-cy='form.builder.step.number'").should(
            "be.visible"
          );
        });
        it("Verify Attachment field is exists or not", () => {
          cy.get("[data-cy='form.builder.attachments'").should("exist");
        });
        it("Verify Materials is exists or not", () => {
          cy.get("[data-cy='form.builder.materials'").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Equipment is exists or not", () => {
          cy.get("[data-cy='form.builder.equipment'").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Start Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-start-quantity']").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Rejected Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-rejected-quantity']").scrollIntoView()
            .should("be.visible");
        });
        it("Verify Accepted Quantity is exists or not", () => {
          cy.get("[data-cy='lhrs-accepted-quantity']").scrollIntoView()
            .should("be.visible");
        });

      });
    });
  });

  context("verify All right panel tabs ", () => {
    context("verify reference tab ", () => {
      it("Reference Tab info", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });
      it("Verify References selection Add Remove", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });
      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should(
          "contain.text",
          "Revision"
        );
        cy.get("[data-cy='common.revision']")
          .parent()
          .should("contain.text", "QPI-00002");
        cy.get("[data-cy='common.revision']")
          .parent()
          .should(
            "contain.text",
            moment().tz("America/Los_Angeles").format("MM/DD/YYYY")
          );
      });
      it("verify migrate form button should exists or not", () => {
        cy.get("[data-cy='common.form.migration']").should("exist");
      });
    });
    context("Verify Revision", () => {
      it("open revision tab", () => {
        cy.get("[data-cy='note-icon']").arrowClick();
      });
      it("Verify revision Rev Document open or not", () => {
        cy.get("[data-cy='DocumentRevisionList-item']")
          .eq(0)
          .arrowClick();
        cy.wait(2000);
        cy.get("[data-cy='HeaderInfo-Rev']").should(
          "contain.text",
          "Rev A"
        );
      });
    });

    context(
      "Verify User able to add Groups or other user permissions",
      () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(USERS[3].name);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity],
            () => {
              cy.drAddGroupFromPermissionTab("Developers");
            }
          );
        });
      }
    );

    context("Check document history", () => {
      it("Verify history tab", () => {
        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });

        verifyHistoryContent(history, groupTwo);
      });
    });

    context("Verify Book Mark Exist or not", () => {
      it("Verify Book", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        cy.get("[data-cy=references-icon]").arrowClick();
      });
    });
  });

  context("Click on Redline button", () => {
    it("Click Red Line Button", () => {
      cy.get("[data-cy='HeaderMenuButton']").arrowClick();
      cy.get("[data-cy='redlineButton']").arrowClick();
    });
    context("Add material/EQ, step description and attachment. ", () => {
      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Fill step #2 description", () => {
        cy.xpath("//div[@data-cy='mpi-procedure-built-in.description']/../div[2]")
          .click();
        cy.xpath("//div[@data-cy='mpi-procedure-built-in.description']/../div[2]")
          .type("Description of step one");
        cy.wait(500);
        cy.unClick();
      });

      it("Add attachment", () => {
        cy.contains("Step #1").parentsUntil("li")
          .find("[data-cy='mediaUploadField']").arrowClick();
        cy.elUploadAttachment({
          fileName: "test_image.jpg",
          el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add 'Part document' to step #2", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy='form.builder.materials.btn']").eq(0).arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy='title']").arrowClick();
        cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        cy.get("[name='quantity']").arrowType("3");
        cy.wait(500);
        cy.get("[data-cy='unit']").arrowClick();
        cy.get("ul>li[role=option]").contains("Each").arrowClick();
        cy.get("[data-cy='form.builder.save']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add 'Equipment one' to step #2", () => {
        cy.mpiAddEquipmentToStep({
          numbOfStep: 1,
          equipment: "Equipment one",
        });
        cy.wait(3000);
      });
    });
    context("Add a Field” should be displayed and allow user to add FB components", () => {
      it("verify 'ADD a field' should exists", () => {
        cy.get("[data-cy='form.builder.add.field']").should("exist");
      });
      it("Clicking on “Add a Field” should open the form builder library", () => {
        cy.fbAddNewFieldWhenHidden();
      });
      context("User should be able to add any FB component", () => {
        it("Add Text field", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterLabel({ label: "text field" });
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
          cy.fbAddNewFieldButton();
        });
        context("Added FB components, materials/EQ, step desc and attachment should be displayed in the LHRS", () => {
          it("Check description step #1", () => {
            cy.get("[data-cy='mpi-procedure-built-in.description']").parent().find("p")
              .should("contain.text", "Description of step one");
          });

          it("Check materials step #1", () => {
            cy.get("[data-cy='form.builder.mpi.procedure.materials.title']")
              .eq(0)
              .should("have.text", "PRT-00005 - Part document | Qty: 3 each");
          });

          it("Check equipment step #1", () => {
            cy.get("[data-cy='form.builder.mpi.procedure.equipment.title']")
              .eq(0)
              .should("contains.text", "ET-00003 - Equipment one");
          });
          it("Verify 'Text Field' button displayed", () => {
            cy.get("[data-cy^='text-field-'").should("exist");
          });
          it("Verify Attachents should exist", () => {
            cy.get("[id='fb-mediaalbum-upload-mpi-procedure-built-in.attachments'").should("exist");
          });

        });

      });
    });
  });
  context("User should be able to:", () => {
    it("Navigate to Procedure Tab", () => {
      cy.drSelectProcedureTab();
    });
    it("Enter 'Start quantity' for LHRs #1", () => {
      cy.get("[name='lhrs-start-quantity']").arrowType("10");
      cy.unClick();
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name='lhrs-accepted-quantity']").arrowType("8");
      cy.unClick();
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.get("[name='lhrs-rejected-quantity']").arrowType("2");
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drSaveDocumentWithoutaudit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'SELECT' for 'Material One' ", () => {
      cy.get("[data-cy='form.builder.select']")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("ul>li[role=option]").contains(lotNumber).arrowClick();
    });

    it("Select quantity in lot dialog", () => {
      cy.get("input[name='quantity']").arrowType("0.5");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy='fb-control-btn']")
          .eq(0)
          .click();
      });
      cy.wait(5000);
    });

    it("Click 'SELECT' for 'Equipment one' ", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("button[data-cy='fb-control-btn']")
          .eq(1)
          .click({ force: true });
      });
    });

    it("Select CAL/PM 'Equipment document'", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("input[data-cy='usedOverride']").arrowClick();
      cy.get("ul>li[role='option']").contains("Equipment document").arrowClick();
    });

    it("Click 'SAVE' on select equipment dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
        cy.get("div[role=dialog] button[data-cy='fb-control-btn']")
          .eq(0)
          .click();
      });
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval User1", () => {
      cy.get("[data-cy^='fb-approvals-approvals']").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.wait(5000);
    });
    it("Add an Approval User2", () => {
      cy.get("[data-cy^='fb-approvals-approvals']").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
      });
      cy.wait(5000);
      cy.url().then((url: any) => {
        lhrs1DocUrl = url;
      });
    });
    it("Click complete step", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

  });

  context("Approve button for LHR/LHRS owner", () => {
    it("Approve step", () => {
      cy.ebApprove();
      cy.wait(5000);
    });
  });
  context("Click LHR link verify the status", () => {
    it("Navigate to LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhr1DocUrl);
      });
    });
    context("check loader present and  Step 1 completed, Step 2 in progress ", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("verify loader is present", () => {
        cy.get("[data-cy='LHR-Step-Progress-Bar']").should("be.visible");
      });
      it("verify Step 1 is completed", () => {
        cy.get("[data-cy='completed-steps']").contains("1").should("exist");
      });
      it("verify Step 2 is in progress", () => {
        cy.get("[data-cy='inprogress-steps']").contains("2").should("exist");
      });
    });
  });
  context("in the Details tab: LHR step #2 should be In Progress with date and timestamp", () => {
    it("LHR Step #1 should have status of In Progress", () => {
      cy.get("[data-cy='form.builder.step.inprogress']").should(
        "have.length",
        "1"
      );
    });
  });
  context(
    "Expand LHR Step#2",
    () => {
      context("verify the following fields for LHR Step1", () => {
        it("verify MPI/QPI Doc ID and Title", () => {
          cy.get("div[class^='MuiExpansionPanelSummary']").eq(1).arrowClick();
          cy.get("input[value='LHR-00001, Step #2 (QPI-00002, QPI document1, Rev 1)']").should(
            "exist"
          );
          cy.get("input[value='LHR-00001, Step #2 (QPI-00002, QPI document1, Rev 1)']")
            .should("have.css", "border-color", "rgb(244, 67, 54)");
        });
        context("Operators list: LHR/LHRS owner and User 3 should be displayed", () => {
          it(`verify operators should have '${USERS[1].name}'and status as APPROVED with timestamp`, () => {
            cy.get("[data-cy='operator-name-2-0']").should("have.text", USERS[1].name);
            cy.get("[data-cy='operator-status-2-0']").should("have.text", "Approved");
            cy.get("[data-cy='operator-sub-title-2-0']")
              .should(
                "contain.text",
                moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
          });
          it(`verify operators should have '${USERS[3].name}' and status as PENDING`, () => {
            cy.get("[data-cy='operator-name-2-1']").should("have.text", USERS[3].name);
            cy.get("[data-cy='operator-status-2-1']").should("contain.text", "Pending");
          });
        });
      });

    });
});
context("Login Third operator and complete step", () => {
  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
  });

  it("Navigate to LHRs", () => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
      cy.contains("LHR-00001").arrowClick();
    });
  });

  context("Complete LHRs with operator", () => {
    it("Approve step", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.wait(3000);
    });
  });
});
context("Login as owner and access LHR", () => {
  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
  });
  it("Navig to LHRs #1", () => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
      cy.contains("LHR-00001").eq(0).arrowClick({ force: true });
    });
  });
});
context("check loader present and  Step 1, Step 2 completed ", () => {
  it("Select Details tab", () => {
    cy.wait(100);
    cy.contains("LHR-00001").arrowClick({ force: true });
    cy.drSelectDetailsTab();
  });
  it("verify loader is present", () => {
    cy.get("[data-cy='LHR-Step-Progress-Bar']").should("be.visible");
  });
  it("verify Step 1 is completed", () => {
    cy.get("[data-cy='completed-steps']").contains("1").should("exist");
  });
  it("verify Step 2 is completed", () => {
    cy.get("[data-cy='completed-steps']").contains("2").should("exist");
  });
});
context("In the Details tab, LHR Step #2 should now have status of Completed with date and time stamp", () => {
  it("LHR Step #2 should have status of Completed", () => {
    cy.get("[data-cy='form.builder.step.complete']").should(
      "have.length",
      "2"
    );
  });
  it("verify LHR Step2 has completed date & time stamp", () => {
    cy.get("[data-cy='lhr-step-timestamp-2']")
      .should(
        "contain.text",
        moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
  });
  context("Start/Accepted/Rejected quantities should be displayed", () => {
    it("verify Start quantity exists", () => {
      cy.get("[data-cy='start-quantity-2']").should("exist");
      cy.get("[data-cy='start-quantity-value-2']").should(
        "have.text",
        "10"
      );
    });
    it("verify Accepted quantity exists", () => {
      cy.get("[data-cy='accepted-quantity-2']").should("exist");
      cy.get("[data-cy='accepted-quantity-value-2']").should(
        "have.text",
        "8"
      );
    });
    it("verify Rejected quantity exists", () => {
      cy.get("[data-cy='rejected-quantity-2']").should("exist");
      cy.get("[data-cy='rejected-quantity-value-2']").should(
        "have.text",
        "2"
      );
    });
    it("verify operators field exists", () => {
      cy.get("[data-cy=operators-2]").should("exist");
    });
    it(`verify operators should have '${USERS[1].name}'and status as APPROVED with timestamp`, () => {
      cy.get("[data-cy='operator-name-2-0']").should("have.text", USERS[1].name);
      cy.get("[data-cy='operator-status-2-0']").should("have.text", "Approved");
      cy.get("[data-cy='operator-sub-title-2-0']")
        .should(
          "contain.text",
          moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
    });
    it(`verify operators should have '${USERS[3].name}' and status as PENDING`, () => {
      cy.get("[data-cy='operator-name-2-1']").should("have.text", USERS[3].name);
      cy.get("[data-cy='operator-status-2-1']").should("contain.text", "Approved");
      cy.get("[data-cy='operator-sub-title-2-0']")
        .should(
          "contain.text",
          moment().tz("America/Los_Angeles").format("MMMM D, YYYY"));
    });

  });
  it("Button beside MPI/QPI should now be changed “View Step”", () => {
    it("verify Start Step button exists", () => {
      cy.get("[data-cy='form.builder.view.step']")
        .eq(1)
        .should("exist");
    });
  });
});
context("In the Materials& Equipment tab", () => {
  it("Navigate to Materials and Equipment Tab", () => {
    cy.drSelectMaterialsAndEquipmentTab();
    cy.wait(500);
    cy.get("[data-cy='form.builder.materials']").eq(0).arrowClick({ multiple: true });
  });
  it("Materials - Lot Number for the material should be displayed", () => {
    cy.get(".MuiChip-label").contains(lotNumber);
  });
  it("Equipment - Cal/PM Next due dates should be displayed", () => {
    cy.get("[data-cy='form.builder.equipment']").arrowClick({ multiple: true });
    cy.get(".MuiChip-label").contains("Callibration Due");
    cy.get(".MuiChip-label").contains("Preventive Maintenance Due");
  });
});

context("In the LHR Overview tab", () => {
  it("Select Overview tab", () => {
    cy.drSelectOverviewTab();
  });
  it("Check that End Quantity is updated with the quantity in the last step", () => {
    cy.get("[name='lhr-end-quantity'][value='8']").should("exist");
  });
  context("Assign approvers and submit for approval", () => {
    it("Add an Approval User1", () => {
      cy.get("[data-cy^='fb-approvals']").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.wait(5000);
    });
    it("Submit LHR for approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });
  });
  context("Approve LHR. Lot# with RD should be created and should be displayed in the References section", () => {
    it("Approve LHR", () => {
      cy.get("[data-cy='form.builder.request.approve']").contains("Approve").arrowClick();
      cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
        cy.get("[data-cy='common.confirm']").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });
  });
  context("Go to Lots landing page and check that Lot is displayed there as well.", () => {
    it("Navigate to lots", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.navigToLots();
    });
    it("Verify filter for LOT #", () => {
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="1"] input`).arrowType(lotNumber);
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", lotNumber);
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });
  });
});

export { };
