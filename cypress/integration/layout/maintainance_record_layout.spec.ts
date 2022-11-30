/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let equipmentDocumentType;
let formDocumentType;
let initialArDocument;
let group;
let createdEquipmentFormDocument;
let createdCalibrationForm;
let createdEquipmentNumericRevision;
let createdPMForm;
let maintenanceRecordDocumentType;

context("Layout Verification of maintainance records", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
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

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create migration MR document", () => {
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
  context("Fill MR document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'MR document'", () => {
      cy.drEnterDocumentTitle({ name: "Migration" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "Maintenance Record  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Maintenance Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Add FB Fields", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Maintainance Record Textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and released", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

  });

  context("Create MR document", () => {
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
  context("Fill MR document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'MR document'", () => {
      cy.drEnterDocumentTitle({ name: "Maintenance Record" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "Maintenance Record  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Maintenance Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });


  context("Verify Layout of document and Tabs", () => {
    it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00006",
        revision: "Rev 1",
      });
    });

    it("Verify that it contains Overview, Detail", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify this row is fixed, user should not be able to add/edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify MR opens to the Overview tab by default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify overview tab predefiend fields up to attachment", () => {
      cy.verifyPredefiendFields();
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Verify approval", () => {
      cy.get("[data-cy='form.builder.approvals']").should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

  });

  context("Add FB Fields", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Maintainance Record Textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify detail tab", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Click on details Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
    });

    it("Verify EQ,Maintainer,completion date fields", () => {
      cy.get("[data-cy='equipment_id']").should("exist");
      cy.get("[data-cy='equipment_maintainer']").should("exist");
      cy.get("[name='fb-equipment_due_date']").should("exist");
    });

    it("Verify Add field button Exist in detail tab", () => {
      cy.get("[data-cy='form.builder.add.field']").should("exist");
    });

    it("Verify added FB Field Checked chebox", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify added FB Field  textfield", () => {
      cy.get("[name^='maintainance-record-textfield']").should("exist");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Release MR Form", () => {
    it("Approve and release  document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create a required document from release form Verify the layout and Release It", () => {

    context("Create New Document from Release form", () => {
      it("Click 'Create New'", () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    context("Verify Layout of document and Tabs", () => {
      it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (WIP)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "Records",
          docId: "MR-00001",
          revision: "Rev A",
        });
      });

      it("Verify that it contains Overview, details", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify MR opens to the Overview tab by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify overview tab predefiend fields up to attachment", () => {
        cy.get("[data-cy='field-name']").should("exist");
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
      });
    });

    context("Verify Detail tab", () => {
      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify Click detail Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      });

      it("Verify EQ,Maintainer,completion date fields", () => {
        cy.get("[data-cy='equipment_id']").should("exist");
        cy.get("[data-cy='equipment_maintainer']").should("exist");
        cy.get("[name='fb-equipment_due_date']").should("exist");
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify add FB Field  textfield", () => {
        cy.get("[name^='maintainance-record-textfield']").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

    });

    context("Fill the form", () => {
      it("Fill the record details'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.drEnterDocumentTitle({ name: "MR Test title" });
        });
      });

      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("fill EQ,Maintainer,completion date fields", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy='equipment_id']").autocompleteSelect("EQ-00001");
        });
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy='equipment_maintainer']").autocompleteSelect(USERS[1].name);
        });
      });

      it("Fill 'Completion Date'", () => {
        const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
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
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get(`input[type="checkbox"][value="1"]`).should("exist");
          cy.get(`input[type="checkbox"][value="1"]`).check();
        });
        cy.wait(1000);
      });

      it("Verify add FB Field textfield", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name^='maintainance-record-textfield']").should("exist");
          cy.get("[name^='maintainance-record-textfield']").arrowType("Test");
          cy.unClick();
        });
      });

      it("Select Approval", () => {
        cy.drSelectOverviewTab();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
        });
      });
    });


    context("Validate Right Side Panel", () => {

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify it is fixed when user scroll", () => {
        cy.get("[data-cy='generalInfo'").scrollTo("top", { ensureScrollable: false });
        cy.get("[data-cy='References'").should("be.visible");
      });

      it("Verify Right side pannel Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify References selection Add Remove", () => {
        cy.cmpTurnOffAutosave();
        cy.verifyAddRemoveReference({ formId: "FM-0000" });
        cy.cmpTurnOnAutosave();
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      context("Verify Revision", () => {
        it("On click of revision Selcted revision should be open", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(USERS[3].name);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab("Developers");
          });
        });
      });

      context("Check document history", () => {
        const groupOne = "Developers";
        const history = [
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to group", value: `Developers` },
            ],
          },
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to user", value: `${USERS[3].name}` },
            ],
          },
        ];
        it("Verify Doc history", () => {
          cy.drSelectHistoryTab();
        });
        verifyHistoryContent(history, groupOne);
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });

        it("Verify navigation on click of 'Approvals' book mark", () => {
          cy.get("[data-cy='Bookmarks-detail']").contains("Approvals").arrowClick();
          cy.get("[data-cy='form.builder.approvals']").should("be.visible");
        });
      });

      context("Verify Scroll", () => {
        it("Navigate to history tab", () => {
          cy.get("[data-cy='timeline-icon']").arrowClick();
        });

        it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
          cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
        });
      });
    });

    context("Verify form migration", () => {
      it("Verify migrate form button is visible", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.get("[data-cy='common.form.migration']").should("be.visible");
      });

      it("Click on migrate form button", () => {
        cy.get("[data-cy='common.form.migration']").arrowClick();
      });

      it("Select form to be migrated", () => {
        cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
        cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
      });

      it("Mapped Maintenance Details field", () => {
        cy.get("[data-cy='field-fb-maintenance-details-section']" ).arrowClick();
        cy.get("[id^='react-select']").eq(1).autocompleteSelect("Maintenance Details");
      });

      it("Mapped MR textfield field", () => {
        cy.get("[data-cy^='field-maintainance-record-textfield']" ).arrowClick();
        cy.get("[id^='react-select']").eq(2).autocompleteSelect("Maintainance Record Textfield");
      });

      it("Mapped Equipment field", () => {
        cy.get("[data-cy='field-equipment_id']" ).arrowClick();
        cy.get("[id^='react-select']").eq(3).autocompleteSelect("Equipment");
      });

      it("Mapped Maintainer field", () => {
        cy.get("[data-cy='field-equipment_maintainer']" ).arrowClick();
        cy.get("[id^='react-select']").eq(4).autocompleteSelect("Maintainer");
      });

      it("Mapped Completion Date field", () => {
        cy.get("[data-cy='field-fb-equipment_due_date']" ).arrowClick();
        cy.get("[id^='react-select']").eq(5).autocompleteSelect("Completion Date");
      });

      it("Mapped Equipment Maintenance Section field", () => {
        cy.get("[data-cy='field-fb-requipment-maintenance-section']" ).arrowClick();
        cy.get("[id^='react-select']").eq(6).autocompleteSelect("Equipment Maintenance Section");
      });

      it("Mapped Approvals field", () => {
        cy.get("[data-cy^='field-fb-approvals']" ).arrowClick();
        cy.get("[id^='react-select']").eq(7).autocompleteSelect("form.builder.approvals");
      });

      it("Mapped checkbox field", () => {
        cy.get("[data-cy^='field-checkbox']" ).arrowClick();
        cy.get("[id^='react-select']").eq(8).autocompleteSelect("Checkbox");
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify the checkbox field data after migration", () => {
        cy.get("[value='1']").should("be.checked");
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });
    });

    context("Approve and Released", () => {
      it("click for approval", () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick({ force: true });
      });
    });
  });
});

export { };
