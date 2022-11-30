/* eslint-disable cypress.eslint.rules/cy.pause */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let loggedInEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let toolingDocType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let createdPMForm;
let createdCalibrationForm;
let createdPMRecord;
let createdCalibrationRecord;
let createdEquipmentNumericRevision;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;


context("NCO document type management", () => {
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
            documentTypes: [NCORecord],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          loggedInEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
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
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: NCORecord.documentTypeName });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details_supira.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Prepare new Company", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        loggedInEmployee = loginResponse.employees.find((emp) => emp.company.name.includes(newCompanyName));
        done();
      });
    });

    it("[API]Get newly created NCO company", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/document_type`,
        headers: {
          Authorization: `bearer ${loggedInEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((res) => {
        if (res.body.length > 0 ) {
          approvalRequestDocumentType = res.body.find(
            (docType: any) => docType.documentTypeName === "Change Order"
          );
          equipmentDocumentType = res.body.find((docType: any) => docType.documentTypeName === "Equipment or Fixture");
          formDocumentType = res.body.find((docType: any) => docType.documentTypeName === "Form");
          maintenanceRecordDocumentType = res.body.find(
            (docType: any) => docType.documentTypeName === "Equipment Preventive Maintenance"
          );
        }
        done();
      });
    });

    it("[API]Create Equipment form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: loggedInEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response ? response[0] : {};
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance and Calibration form</p>",
            document: {
              docId: "FM-00003",
              documentType: {
                id: formDocumentType.id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [],
              },
            },
            name: "Maintenance and calibration form document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: equipmentDocumentType.id,
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
                  validationAttribute: "Calibration",
                  tabId: "specification",
                },
                {
                  name: "location-kngiboz9",
                  type: "select",
                  tabId: "overview",
                  index: 5,
                  label: "Location:",
                  options: [
                    {
                      text: "R&D ",
                      value: "R&D ",
                    },
                    {
                      text: "Hemolysis ",
                      value: "Hemolysis ",
                    },
                    {
                      text: "Portable",
                      value: "Portable",
                    },
                    {
                      text: "CER (Controlled Environment Room)",
                      value: "CER (Controlled Environment Room)",
                    },
                    {
                      text: "IQC",
                      value: "IQC",
                    },
                    {
                      text: "form.builder.other",
                      value: "includeContext",
                    },
                  ],
                  placeholder: "[Select from the List]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  validationMode: "default",
                  editorProperties: [
                    "includeContext",
                  ],
                  validationAttribute: "Location:",
                  applicableValidationSchema: true,
                },
              ],
            },

          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then((response) => {
          createdEquipmentFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdEquipmentFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType.id },
              formDocument: { id: initialArDocument.id },
              approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
            },
            employeeId: loggedInEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
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
              id: formDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Preventative Maintenance form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType.id,
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
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdPMForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
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
              id: formDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Calibration form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType.id,
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
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
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
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
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
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
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
            "location-kngiboz9": "IQC",
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document with Numeric revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document 2</p>",
          document: {
            docId: "EQ-00002",
            documentType: {
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Equipment document 2",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
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
            "location-kngiboz9": "Portable",
          },
        },
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
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
            docId: "EQ-00003",
            documentType: {
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
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
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
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
            "location-kngiboz9": "R&D ",
          },
        },
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
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
            "equipment_maintainer": loggedInEmployee.id,
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
              securityGroups: [],
              operators: [],
            },
            documentType: {
              id: maintenanceRecordDocumentType.id,
            },
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
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
            "equipment_maintainer": loggedInEmployee.id,
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
              securityGroups: [],
              operators: [],
            },
            documentType: {
              id: maintenanceRecordDocumentType.id,
            },
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
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
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });
  });

  context("Navigate and verify Equipment Landing Page", () => {
    it("Click on Equipment list", () => {
      cy.navigToEquipmentList();
    });

    it("Verify Owner title column", () => {
      SystemRequirement("REQ-2840");
      cy.get("[class='k-column-title']").eq(4).should("have.text", "OWNER");
    });

    it("Verify Owner title column", () => {
      SystemRequirement("REQ-2840");
      cy.get("[class='k-column-title']").eq(8).should("have.text", "LOCATION");
    });

    it("Filter by Owner & Location", () => {
      SystemRequirement("REQ-2840");
      cy.filterEquipByOwnerAndLocation({ owner: USERS[1].name, location: "IQC" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Clear Filters", () => {
      cy.dtmClearFilters();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
    });
  });

  context("Create equipment maintenace document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click 'ADD NEW EQUIPMENT'", () => {
      cy.get("[id='DocumentByTypeListPresenter-openDocRev']").arrowClick();
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("div[id^=react-select]").contains("Equipment or Fixture").arrowClick();
      });
    });

    it("Enter title 'Equipment maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Manual Equipment" });
    });

    it("Enter description 'Equipment maintenance'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment maintenance Manual" });
    });

    it("Navigate To specification", () => {
      cy.drSelectSpecificationTab();
    });

    it("Select Primary Owner", () => {
      cy.landingPageLoadingElementShouldNotExist();
      cy.drSelectPrimaryOwner({ owner: USERS[1].name });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate To calpmhistory", () => {
      cy.drSelectCalPmHistoryTab();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select 'Maintenance record form' for preventative maintenance required", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("10");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
        .type("Instructions for preventative maintenance").wait(500);
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Select 'Maintenance record form' for calibration required", () => {
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick({ force: true });
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("5");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate To overview", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Portable Location", () => {
      cy.get("[id*=select-location]").eq(0).arrowClick({ force: true });
      cy.get("ul>li[data-value='Portable']").arrowClick();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    context("Verify owner", () => {
      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Filter by title", () => {
        cy.filterEquipmentTitle({ name: "Manual Equipment" });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Navigate To specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Change Primary Owner", () => {
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
        cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick({ force: true });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.wait(15000);
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Verify Owner name", () => {
        cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[2].name);
      });

      it("Verify Location Selected", () => {
        cy.get("tr.k-master-row").first().find("td").eq(8).contains("Portable");
      });
    });

    context("Verify location", () => {
      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Change Location to IQC", () => {
        cy.get("[id*=select-location]").eq(0).arrowClick({ force: true });
        cy.get("ul>li[data-value='IQC']").arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
        cy.dlClearFilters();
      });

      it("Filter equipment by title", () => {
        cy.get("[class=\"k-textbox\"]").eq(2).arrowType("Manual Equipment");
      });

      it("Verify Location value", () => {
        cy.get("tr.k-master-row").first().find("td").eq(8).contains("IQC");
      });
    });

    context("Release EQ", () => {
      it("[API] Release EQ", (done: any) => {
        cy.drGetDocRevs({ employeeId: loggedInEmployee.id, sessionId: loginResponse.sessionId })
          .then((documentRevisionsRes) => {
            const manualDocRev = (documentRevisionsRes || []).find((x: any) => x.name === "Manual Equipment") as any;
            cy.drAPIApproveAndRelease({
              documentId: manualDocRev.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Revise EQ and verify data on landing page", () => {
      it("Revise Equipment", () => {
        cy.drClickReviseDocument();
      });

      it("Navigate To specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Change Primary Owner", () => {
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
        cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick({ force: true });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate To overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Change Location to Portable", () => {
        cy.get("[id*=select-location]").eq(0).arrowClick({ force: true });
        cy.get("ul>li[data-value='Portable']").arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
        cy.dlClearFilters();
      });

      it("Filter by Owner & Location", () => {
        SystemRequirement("REQ-2840");
        cy.filterEquipByOwnerAndLocation({ owner: USERS[1].name, location: "Portable" });
      });

      it("Verify Owner name", () => {
        cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
      });

      it("Verify Location value", () => {
        cy.get("tr.k-master-row").first().find("td").eq(8).contains("Portable");
      });
    });
  });

  context("Create Tooling Eqipment", () => {
    context("Add Tooling DocRev", () => {
      it("[API]Get Company and DocTypes", (done: any) => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_type`,
          headers: {
            Authorization: `bearer ${loggedInEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((res) => {
          if (res.body.length > 0 ) {
            toolingDocType = res.body.find(
              (docType: any) => docType.documentTypeName.includes("Tool")
            );
          }
          done();
        });
      });

      it("[API]Create TL form", (done: any) => {
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: loggedInEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response ? response[0] : {};
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Tooling form</p>",
              document: {
                docId: "FM-00006",
                documentType: {
                  id: formDocumentType.id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [],
                },
              },
              name: "Tooling form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: toolingDocType.id,
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
                    label: "TL Owner",
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
                  {
                    name: "location-kngiboz9",
                    type: "select",
                    tabId: "overview",
                    index: 5,
                    label: "Location:",
                    options: [
                      {
                        text: "R&D ",
                        value: "R&D ",
                      },
                      {
                        text: "Hemolysis ",
                        value: "Hemolysis ",
                      },
                      {
                        text: "Portable",
                        value: "Portable",
                      },
                      {
                        text: "CER (Controlled Environment Room)",
                        value: "CER (Controlled Environment Room)",
                      },
                      {
                        text: "IQC",
                        value: "IQC",
                      },
                      {
                        text: "form.builder.other",
                        value: "includeContext",
                      },
                    ],
                    placeholder: "[Select from the List]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "includeContext",
                    ],
                    validationAttribute: "Location:",
                    applicableValidationSchema: true,
                  },
                ],
              },

            },
            employeeId: loggedInEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdEquipmentFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEquipmentFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });

      it("[API]Create Tooling document with Numeric revision", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Equipment document</p>",
            document: {
              docId: "TL-00001",
              documentType: {
                id: toolingDocType.id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [],
              },
            },
            name: "Tooling document",
            formDocument: {
              id: createdEquipmentFormDocument.id,
            },
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {
              "fb-default-eq-status": "Active",
              "fb-primary-owner-eq": loggedInEmployee.id,
              "fb-coordinator-eq": loggedInEmployee.id,
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
              "location-kngiboz9": "Portable",
            },
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    context("Verify owner", () => {
      it("Clear Filters", () => {
        cy.dtmClearFilters();
        cy.dlVerifyDocumentCount({ numberOfDoc: 6 });
      });


      it("Filter by title", () => {
        cy.filterEquipmentTitle({ name: "Tooling document" });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Navigate To specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Change Primary Owner", () => {
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
        cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick({ force: true });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
        cy.dlClearFilters();
      });

      it("Filter by Owner & Location", () => {
        SystemRequirement("REQ-2840");
        cy.filterEquipByOwnerAndLocation({ owner: USERS[2].name, location: "Portable" });
      });

      it("Verify Owner name", () => {
        cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[2].name);
      });
    });

    context("Verify location", () => {
      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Change Location to IQC", () => {
        cy.get("[id*=select-location]").eq(0).arrowClick({ force: true });
        cy.get("ul>li[data-value='IQC']").arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
        cy.dlClearFilters();
      });

      it("Filter by Owner & Location", () => {
        SystemRequirement("REQ-2840");
        cy.filterEquipByOwnerAndLocation({ owner: USERS[2].name, location: "IQC" });
      });

      it("Verify Location value", () => {
        cy.get("tr.k-master-row").first().find("td").eq(8).contains("IQC");
      });
    });

    context("Release EQ", () => {
      it("[API] Release EQ'", (done: any) => {
        cy.drGetDocRevs({ employeeId: loggedInEmployee.id, sessionId: loginResponse.sessionId })
          .then((documentRevisionsRes) => {
            const manualDocRev = (documentRevisionsRes || []).find((x: any) => x.name === "Tooling document") as any;
            cy.drAPIApproveAndRelease({
              documentId: manualDocRev.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
      });
    });

    context("Revise EQ and verify data on landing page", () => {
      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Revise Equipment", () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick({ force: true });
      });

      it("Navigate To specification", () => {
        cy.drSelectSpecificationTab();
      });

      it("Change Primary Owner", () => {
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("[class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeSmall\"]").eq(1).arrowClick({ force: true });
        cy.drSelectPrimaryOwner({ owner: USERS[1].name });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate To overview", () => {
        cy.get("[data-cy=\"tabId.overview\"]").arrowClick();
      });

      it("Change Location to Portable", () => {
        cy.get("[id*=select-location]").eq(0).arrowClick({ force: true });
        cy.get("ul>li[data-value='Portable']").arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
        cy.dlClearFilters();
      });

      it("Filter by Owner & Location", () => {
        SystemRequirement("REQ-2840");
        cy.filterEquipByOwnerAndLocation({ owner: USERS[1].name, location: "Portable" });
      });


      it("Verify Owner name", () => {
        cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
      });

      it("Verify Location value", () => {
        cy.get("tr.k-master-row").first().find("td").eq(8).contains("Portable");
      });
    });
  });

});

