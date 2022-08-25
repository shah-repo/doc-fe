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
let createdMaintenanceInlineRecordFormDocument;
let createdMaintenanceRecordFormDocument;
let group;
let docIdFromUrl;

context("Export maintenance record", () => {
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
                    tabId: "calpmhistory",
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
                    tabId: "calpmhistory",
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

    it("[API]Create Maintenance inline record form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Maintenance form inline record</p>",
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
          name: "Maintenance inline record form",
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
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "details",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ki5yh7ba",
                uniqueSchemaItem: true,
                index: 5,
              },
              {
                index: 6,
                type: "section",
                name: "textfield-kn7fc209",
                validationMode: "default",
                label: "Section 1",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                validationAttribute: "textfield",
              },
              {
                index: 7,
                type: "textfield",
                name: "textfield1-kn7fc7w4",
                rows: 1,
                validationMode: "default",
                label: "textfield 1",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                validationAttribute: "textfield",
              },
              {
                index: 8,
                type: "inlineapproval",
                name: "inline-approval-kw6gbxwm",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "Inline approval",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                label: "Inline approval",
                tabId: "details",
                editorConfig: {
                  groups: [
                    group.body[0].id,
                  ],
                },
              },
            ],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMaintenanceInlineRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceInlineRecordFormDocument.id,
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

    it("[API]Create Maintenance record form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Maintenance form record</p>",
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
          name: "Maintenance record form",
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
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "overview",
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
        createdMaintenanceRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceRecordFormDocument.id,
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

  context("Create equipment maintenace document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to equipment list", () => {
      cy.navigToEquipment();
    });

    it("Click 'ADD NEW EQUIPMENT'", () => {
      cy.equipClickCreateNew();
    });

    it("Enter title 'Equipment maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
    });

    it("Enter description 'Equipment maintenance'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Select 'CAL/PM' tab", () => {
      cy.get("[data-cy=\"tabId.calpmhistory\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release EQ", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it(`Check equipment status is '${STATUS_TYPES_LABEL.RELEASED}'`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Fill new maintenance inline form", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.url().then((url: any) => {
        docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceInlineRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/pm-ki5wtk5l`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers], () => {
          cy.visit(newPMUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Maintenance Record inline form'", () => {
      cy.drEnterDocumentTitle({ name: "Maintenance Record inline form" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Equipment", () => {
      cy.get("[data-cy=equipment_id]").autocompleteSelect("EQ-00001");
      cy.unClick();
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

    it("Save 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Maintenance Record with WIP status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: STATUS_TYPES_LABEL.WIP, filename: "-1-Maintenance-Record-inline-form",
        status: STATUS_TYPES_LABEL.WIP,
      });
    });
  });

  context("Maintenance Record with Last Signed status", () => {
    context("Add Maintenance Record with Last Signed", () => {
      it("Add inline approver", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[name*=\"fb-ia-inline-approval\"] input").eq(0)
              .autocompleteSelect("enlil.testmail+cy1");
          });
      });

      it("Select Equipment", () => {
        cy.get("[data-cy=equipment_id]").autocompleteSelect("EQ-00001");
        cy.unClick();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").should("exist");
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Select Last Signed", () => {
        cy.contains("Last Signed").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          pdfStatus: "Last Signed", filename: "-1-Maintenance-Record-inline-form",
          status: STATUS_TYPES_LABEL.LAST_SIGNED,
        });
      });
    });
  });

  context("Maintenance Record with Archive status", () => {
    context("Add Maintenance Record with Archive", () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Click WIP status Maintenance Record", () => {
        cy.contains("WIP").arrowClick();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Update section", () => {
        cy.get("[name^=\"textfield1\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Select Archive", () => {
        cy.contains("Archive").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          pdfStatus: "Archive", filename: "-1-Maintenance-Record-inline-form",
          status: STATUS_TYPES_LABEL.ARCHIVE,
        });
      });
    });
  });

  context("Maintenance Record with Released status", () => {
    context("Add Maintenance Record with Released", () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Click WIP status Maintenance Record", () => {
        cy.contains("WIP").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Finalize and release button click'", () => {
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recFinalizeAndReleaseRecord();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          pdfStatus: "Released", filename: "-A-Maintenance-Record-inline-form",
          status: STATUS_TYPES_LABEL.RELEASED,
        });
      });
    });
  });

  context("Maintenance Record with Canceled status", () => {
    context("Add Maintenance Record with Canceled", () => {
      it("Click Update Maintenance Record", () => {
        cy.drClickReviseDocument();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click Cancel draft", () => {
        cy.drCancelDraftButton();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          pdfStatus: "Canceled", filename: "-A-1-Maintenance-Record-inline-form",
          status: STATUS_TYPES_LABEL.CANCELED,
        });
      });
    });
  });

  context("Maintenance Record with Voided status", () => {
    context("Fill new maintenance form", () => {
      it("Click 'NEW PM' on preventative maintenace section", () => {
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/pm-ki5wtk5l`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers], () => {
          cy.visit(newPMUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Maintenance Record form'", () => {
        cy.drEnterDocumentTitle({ name: "Maintenance Record form" });
      });

      it("Select document type 'Maintenance Record'", () => {
        cy.drSelectDocumentType({ documentType: "Maintenance Record" });
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Select revision stage 'Numeric'", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Create 'Preventative maintenance document'", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Select Equipment", () => {
        cy.get("[data-cy=equipment_id]").autocompleteSelect("EQ-00001");
        cy.unClick();
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

      it("Create 'Preventative maintenance document'", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Add Maintenance Record with Voided", () => {
      it("Click Void button", () => {
        cy.arVoidAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ pdfStatus: "Voided", filename: "-A-Void", status: STATUS_TYPES_LABEL.VOIDED });
      });
    });
  });

  context("Maintenance Record with In Review status", () => {
    context("Fill new maintenance form", () => {
      it("Click 'NEW PM' on preventative maintenace section", () => {
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/pm-ki5wtk5l`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers], () => {
          cy.visit(newPMUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Maintenance Record form'", () => {
        cy.drEnterDocumentTitle({ name: "Maintenance Record" });
      });

      it("Select document type 'Maintenance Record'", () => {
        cy.drSelectDocumentType({ documentType: "Maintenance Record" });
      });

      it("Select revision stage 'Numeric'", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Create 'Preventative maintenance document'", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Select Equipment", () => {
        cy.get("[data-cy=equipment_id]").autocompleteSelect("EQ-00001");
        cy.unClick();
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

      it("Create 'Preventative maintenance document'", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Add Maintenance Record with In Review", () => {
      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save and submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          pdfStatus: "In Review", filename: "-A-Maintenance-Record",
          status: STATUS_TYPES_LABEL.IN_REVIEW,
        });
      });
    });
  });

});
