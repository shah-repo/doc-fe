// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];
const CAL_DUE_DATE = moment().tz("America/Los_Angeles")
  .add(5, "days")
  .format("l");
const PM_DUE_DATE = moment().tz("America/Los_Angeles")
  .add(10, "days")
  .format("l");

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let multipleCompanies;
let adminEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let createdMaintenanceRecordFormDocument;
let group;

context("Equipment maintenance test", () => {
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
                  },
                  {
                    index: 3,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5l",
                    editorConfig: {
                      fields: [],
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "Preventative Maintenance",
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
                      fields: [],
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
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

    it("[API]Create Maintenance record form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Maintenance form record</p>",
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
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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
      SystemRequirement("REQ-2880");
      cy.equipClickCreateNew();
    });

    it("Enter title 'Equipment maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment maintenance document" });
    });

    it("Enter description 'Equipment maintenance'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment maintenance" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).click();
    });

    it("Select 'Maintenance record form' for preventative maintenance required", () => {
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).click();
      cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).type("10");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
        .type("Instructions for preventative maintenance");
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).click();
    });

    it("Select 'Maintenance record form' for calibration required", () => {
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).click();
      cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").click();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).type("5");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration");
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    context("Approve and release equipment maintenance document", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.cmpClickCreateApprovalRequest();
      });

      it("Enter title AR title: ", () => {
        cy.arEnterApprovalRequestTitle({ title: "Approval request for equipment document" });
      });

      it("Enter description 'AR from New form template for approval request'", () => {
        cy.arEnterApprovalRequestDescription({ description: "equipment document AR" });
      });

      it("Add created document revision", () => {
        cy.arClickAddDocument().wait(500);
        cy.arChoseSpecificProposedDocument({ name: "EQ-00001" });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      // TODO: data-cy=\"fb-approvers-approvers\"]").should(be.disabled");

      it("Click Create Approval Request", () => {
        cy.arClickCreateApprovalRequestAfterCompletingForm();
      });

      it("Add first approver to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: ADMIN_USER.email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });

      it("Click 'Send To Review'", () => {
        cy.arClickSendToReview();
      });

      it("Verify AR status is 'In Review'", () => {
        cy.arVerifyStatus({ status: "In Review" });
      });

      it("Approve AR", () => {
        cy.arApproveAR();
      });

      it("Check approval request status is 'Approved'", () => {
        cy.arVerifyStatus({ status: "Approved" });
      });

      it("Close AR", () => {
        cy.arCloseAR();
      });

      it("Check approval request status is 'Closed'", () => {
        cy.arVerifyStatus({ status: "Closed" });
      });

      context("Navig to released 'Equipment maintenance document'", () => {
        it("Navig to equipment", () => {
          cy.navigToEquipment();
        });

        it("Select 'Equipment maintenance document'", () => {
          SystemRequirement("REQ-2870");
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
            cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
          });
        });
      });
    });
  });

  context("Fill new preventative maintenance form", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/pm-ki5wtk5l`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.GroupsGet, CyRoutes.GetAvailableApprovers], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.get("[data-cy=\"equipment_maintainer\"]").click();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).click();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").click();
      cy.wait(500);
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).click();
          }
        });
      cy.wait(500);
    });

    it("Create 'Preventative maintenance document'", () => {
      SystemRequirement("REQ-2890");
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Add an Approval'", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
      cy.wait(15000);
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Check equipment maintenance history on equipment maintenance document", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
        cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
      });
    });

    it("Check preventative maintenance document existance", () => {
      cy.get("div[data-cy=\"maintenanceHistory\"]")
        .eq(0)
        .contains("MR-00001 - Preventative maintenance document");
    });

    it("Check preventative maintenance status is in complience for next 10 days", () => {
      cy.log(createdCompany.name);
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(10, "days")
        .format("ddd MMMM D YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0)
        .contains(`PM Done - Due Date: ${prevMaintenanceComplianceDate}`);
    });
  });

  context("Fill new calbration form", () => {
    it("Click 'NEW PM' on calibration section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdMaintenanceRecordFormDocument.id}/create_maintenance/${docIdFromUrl}/calibration-ki5wtyj0`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.GroupsGet, CyRoutes.GetAvailableApprovers], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.get("[data-cy=\"equipment_maintainer\"]").click();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).click();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").click();
      cy.wait(500);
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).click();
          }
        });
      cy.wait(500);
    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
      cy.wait(15000);
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Check equipment calibration history on maintenance document", () => {
    it("Navig to Equipment", () => {
      cy.navigToDashboard();
      cy.navigToEquipment();
    });

    context("Verify equipment landing page", () => {
      it("Verify 'ID' is EQ-00001", () => {
        SystemRequirement("REQ-2840");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(1)").last().should("have.text", "EQ-00001");
      });

      it("Verify 'REVISION' is '1'", () => {
        SystemRequirement("REQ-2840");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(2)").last().should("have.text", "1");
      });

      it("Verify 'STATE' is 'Released'", () => {
        SystemRequirement("REQ-2840");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(3)").last().should("have.text", "Released");
      });

      it("Verify 'TITLE' is 'Equipment maintenance document'", () => {
        SystemRequirement("REQ-2840");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(4)")
          .last()
          .should("have.text", "Equipment maintenance document");
      });

      it(`Verify 'EFT OWNER' is '${USERS[1].name}'`, () => {
        SystemRequirement("REQ-2840");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(5)").last().should("have.text", USERS[1].name);
      });

      it("Verify 'EQ STATUS' is Active", () => {
        SystemRequirement("REQ-2840");
        cy.get("div.ReactVirtualized__Table__rowColumn").last().should("have.text", "Active");
      });

      it("Verify 'CAL DUE DATE'", () => {
        SystemRequirement("REQ-2840", "REQ-2910");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(6)").should("contain.text", CAL_DUE_DATE);
      });

      it("Verify 'PM DUE DATE'", () => {
        SystemRequirement("REQ-2840", "REQ-2910");
        cy.get("div[aria-rowindex=\"1\"]>div:nth-child(7)").should("contain.text", PM_DUE_DATE);
      });

      it("Verify equipment page filter", () => {
        SystemRequirement("REQ-2850");
        cy.filterEquip({
          docId: "EQ-00001", revision: "1", eqState: "Released", title: "Equipment maintenance document",
          owner: USERS[1].name, calDueDate: CAL_DUE_DATE, pmDueDate: PM_DUE_DATE, eqStatus: "Active",
        }).wait(2000);
      });

      it("Verify equipment is shown", () => {
        SystemRequirement("REQ-2850");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });
    });

    context("Verify maintenance document in equipment", () => {
      it("Select 'Equipment calibration document'", () => {
        SystemRequirement("REQ-2900");
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.EmployeesGet, CyRoutes.DocRevPreview], () => {
          cy.get("div.ReactVirtualized__Table__rowColumn").first().click();
          cy.wait(2000);
        });
      });

      it("Check Calibration document existance", () => {
        SystemRequirement("REQ-2900");
        cy.get("[data-cy=\"maintenanceHistory\"]")
          .eq(1)
          .should("contain", "MR-00002 - Calibration document")
          .and("contain", ADMIN_USER.name)
          .and("contain", "RELEASED");
      });

      it("Check calibration status is in complience for next 5 days", () => {
        SystemRequirement("REQ-2900", "REQ-2910");
        const calibrationComplianceDate = moment().tz("America/Los_Angeles")
          .add(5, "days")
          .format("ddd MMMM D YYYY");
        cy.get("[data-cy=\"maintenance.status\"]")
          .eq(1)
          .contains(`CAL Done - Due Date: ${calibrationComplianceDate}`);
      });

      it("Verify status is 'Released'", () => {
        SystemRequirement("REQ-2900");
        cy.drCheckDocumentStatus({ status: "Released" });
      });
    });
  });
});
