
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
let adminEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let createdMaintenanceRecordFormDocument;
let group;
let pmURL;
let calibrationURL;
let equipmentURL;

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
                deleteInFormDisabled: true,
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ki5yh7ba",
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
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate to calpmHistory tab", () => {
      cy.drSelectCalPmHistoryTab();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select 'Maintenance record form' for preventative maintenance required", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").arrowClick();
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
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Maintenance record form").arrowClick();
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

    it("Approve and release EQ", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });

    it("Check equipment status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    context("Navig to released 'Equipment maintenance document'", () => {
      it("Navig to equipment", () => {
        cy.navigToEquipment();
      });

      it("Select 'Equipment maintenance document'", () => {
        SystemRequirement("REQ-2870");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Fill new preventative maintenance form", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click on New CAL", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.drSelectSpecificationTab();
      cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          const calDocId = response.documentId;
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

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
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
      SystemRequirement("REQ-2890");
      cy.drClickCreateDocumentWithApiCall();
      cy.url().then((url: any) => {
        pmURL = url;
      });
    });
  });

  context("Check equipment maintenance history on equipment maintenance document", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview,
        CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill new calbration form", () => {
    it("Navigate to CalPmHistoryTab ", () => {
      cy.drSelectCalPmHistoryTab();
    });

    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          const calDocId = response.documentId;
          const newPMUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
            CyRoutes.GetAvailableApprovers], () => {
            cy.visit(newPMUrl);
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

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
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
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.url().then((url: any) => {
        calibrationURL = url;
      });
    });
  });

  context("Check equipment calibration history on maintenance document", () => {
    it("Navig to Equipment", () => {
      cy.navigToDashboard();
      cy.navigToEquipment();
    });

    context("Verify maintenance document in equipment", () => {
      it("Select 'Equipment calibration document'", () => {
        SystemRequirement("REQ-2900");
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview,
          CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Verify Maintenance History is changed to History", () => {
        it("Navigate to CalPmHistoryTab ", () => {
          cy.drSelectCalPmHistoryTab();
        });

        it("Verify for pm", () => {
          cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
          cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
        });

        it("Verify for calibration", () => {
          cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
        });
      });

      context("Release PM and calibration record", () => {
        it("Navigate to PM record", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
            cy.visit(pmURL);
          });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
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

        it("Navigate to Calibration record", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
            cy.visit(calibrationURL);
          });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
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

      context("Verify maintenance status complience date", () => {
        it("Navig to equipment list", () => {
          cy.navigToEquipment();
        });

        context("Verify equipment landing page", () => {
          it("Verify 'ID' is EQ-00001", () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="0"]`).should("have.text", "EQ-00001");
          });

          it("Verify 'REVISION' is '1'", () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="1"]`).should("have.text", "1");
          });

          it("Verify 'STATE' is 'Released'", () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="2"]`).should("have.text", "Released");
          });

          it("Verify 'TITLE' is 'Equipment maintenance document'", () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="3"]`)
              .should("have.text", "Equipment maintenance document");
          });

          it(`Verify 'EFT OWNER' is '${USERS[1].name}'`, () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="4"]`)
              .find("span").eq(0)
              .should("have.text", USERS[1].name);
          });

          it("Verify 'EQ STATUS' is Active", () => {
            SystemRequirement("REQ-2840");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="7"]`).should("have.text", "Active");
          });

          it("Verify 'CAL DUE DATE'", () => {
            SystemRequirement("REQ-2840", "REQ-2910");
            cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
              cy.reload();
            });
            cy.listLoadingElementShouldNotExist();
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="5"]`).should("have.text", CAL_DUE_DATE);
          });

          it("Verify 'PM DUE DATE'", () => {
            SystemRequirement("REQ-2840", "REQ-2910");
            cy.get(`td[role="gridcell"][colspan="1"][data-grid-col-index="6"]`).should("have.text", PM_DUE_DATE);
          });

          it("Verify equipment page filter", () => {
            SystemRequirement("REQ-2850");
            cy.filterEquip({
              docId: "EQ-00001", revision: "1", eqState: "Released", title: "Equipment maintenance document",
              owner: USERS[1].name, calDueDate: CAL_DUE_DATE, pmDueDate: PM_DUE_DATE, eqStatus: "Active",
            });
          });

          it("Verify equipment is shown", () => {
            SystemRequirement("REQ-2850");
            cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
          });

          it("Select 'Equipment calibration document'", () => {
            SystemRequirement("REQ-2900");
            cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview,
              CyRoutes.DocRevPreview], () => {
              cy.get("tr.k-master-row").first().arrowClick();
            });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        context("Verify Maintenance History is changed to History", () => {
          it("Navigate to CalPmHistoryTab ", () => {
            cy.drSelectCalPmHistoryTab();
          });

          it("Verify for pm", () => {
            cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
            cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
          });

          it("Verify for calibration", () => {
            cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
          });
        });

        context("Verify maintenance records are present on equipment", () => {
          it("Check preventative maintenance document existance", () => {
            cy.get("div[data-cy=\"maintenanceHistory\"]")
              .eq(1)
              .should("contain", "MR-00001 - Preventative maintenance document");
          });

          it("Check preventative maintenance status is in complience for next 10 days", () => {
            cy.log(createdCompany.name);
            const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
              .add(10, "days")
              .format("ddd, MMMM D, YYYY");
            cy.get("[data-cy=\"maintenance.status\"]")
              .eq(0).then(($el) => {
                const text = $el.text().replace(/\u00a0/g, "");
                expect(text).to.contain(`PMDone - Due date: ${prevMaintenanceComplianceDate}`);
              });
          });

          it("Check Calibration document existance", () => {
            SystemRequirement("REQ-2900");
            cy.get("[data-cy=\"maintenanceHistory\"]")
              .eq(0)
              .should("contain", "MR-00002 - Calibration document")
              .and("contain", ADMIN_USER.name)
              .and("contain", "RELEASED");
          });

          it("Check calibration status is in complience for next 5 days", () => {
            SystemRequirement("REQ-2900", "REQ-2910");
            const calibrationComplianceDate = moment().tz("America/Los_Angeles")
              .add(5, "days")
              .format("ddd, MMMM D, YYYY");
            cy.get("[data-cy=\"maintenance.status\"]")
              .eq(1).then(($el) => {
                const text = $el.text().replace(/\u00a0/g, "");
                expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
              });
          });

          it("Verify status is 'Released'", () => {
            SystemRequirement("REQ-2900");
            cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
          });
        });
      });
    });
  });

  context("Update EQ and verify History word", () => {
    it("Toggle off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click revise on EQ", () => {
      cy.drClickReviseDocument();
    });

    it("Save changes", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to CalPmHistoryTab ", () => {
      cy.drSelectCalPmHistoryTab();
    });

    it("Change PM section", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
        .type("UPDATED ").wait(500);
      cy.unClick();
    });

    it("Change calibration section", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("UPDATED ").wait(500);
      cy.unClick();
    });

    it("Save changes", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve AR", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    context("Verify Maintenance History is changed to History", () => {
      it("Navigate to CalPmHistoryTab ", () => {
        cy.drSelectCalPmHistoryTab();
      });

      it("Verify for pm", () => {
        cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
        cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
      });

      it("Verify for calibration", () => {
        cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
      });
    });
  });

  context("Update EQ form nad upgrade EQ to latest version with new PM and cal", () => {
    it("Navig to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter list to find EQ form", () => {
      cy.dlFilterByDocId({ docId: "FM-00003" });
    });

    it("Select first document on list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click revise on EQ form", () => {
      cy.drClickReviseDocument();
    });

    it("Save changes", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add Section", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "New section" });
      cy.fbAddNewFieldButton();
    });

    it("Approve and release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    context("Navigate to EQ document and upgrade to latest form", () => {
      it("Navig to equipment", () => {
        cy.navigToEquipment();
        cy.dlClearFilters();
      });

      it("Select 'Equipment maintenance document'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview,
          CyRoutes.DocPreview,
          CyRoutes.GetFieldLocks], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click revise on EQ form", () => {
        cy.drClickReviseDocument();
      });

      it("Save changes", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Click on upgrade to new form", () => {
        cy.drClickUpgradeForm();
      });

      it("Approve AR", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.url().then((url: any) => {
          equipmentURL = url;
        });
      });
    });

    context("Verify Maintenance History is changed to History", () => {
      it("Navigate to CalPmHistoryTab ", () => {
        cy.drSelectCalPmHistoryTab();
      });

      it("Verify for pm", () => {
        cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
        cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
      });

      it("Verify for calibration", () => {
        cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
      });
    });

    context("Add new PM and Cal", () => {
      context("Fill new preventative maintenance form", () => {
        it("Click 'NEW PM' on preventative maintenace section", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
          cy.get("[data-cy='form.builder.new.pm']").arrowClick();
          cy.wait("@response").then((res) => {
            if (res.response) {
              const response = res.response.body;
              const calDocId = response.documentId;
              const newPMUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
              cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
                CyRoutes.GetAvailableApprovers], () => {
                cy.visit(newPMUrl);
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

        it("Enter title 'Preventative maintenance document'", () => {
          cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
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
          SystemRequirement("REQ-2890");
          cy.drClickCreateDocumentWithApiCall();
          cy.url().then((url: any) => {
            pmURL = url;
          });
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
      });

      context("Fill new calbration form", () => {
        it("Navigate to EQ document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
            cy.visit(equipmentURL);
          });
        });

        it("Click 'NEW PM' on preventative maintenace section", () => {
          cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
          cy.drSelectSpecificationTab();
          cy.get("[data-cy='form.builder.new.pm']").arrowClick();
          cy.wait("@response").then((res) => {
            if (res.response) {
              const response = res.response.body;
              const calDocId = response.documentId;
              const newPMUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
              cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
                CyRoutes.GetAvailableApprovers], () => {
                cy.visit(newPMUrl);
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

        it("Enter title 'Calibration document'", () => {
          cy.drEnterDocumentTitle({ name: "Calibration document" });
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
              cy.log(dayNumber);
              if (dayOfTheMonth.toString() === dayNumber) {
                cy.wrap($el).arrowClick();
              }
            });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Create 'Calibration document'", () => {
          cy.drClickCreateDocumentWithApiCall();
          cy.url().then((url: any) => {
            calibrationURL = url;
          });
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
      });

      context("Verify Maintenance History is changed to History", () => {
        it("Navigate to EQ document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
            cy.visit(equipmentURL);
          });
        });

        it("Navigate to CalPmHistoryTab ", () => {
          cy.drSelectCalPmHistoryTab();
        });

        it("Verify for pm", () => {
          cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
          cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
        });

        it("Verify for calibration", () => {
          cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
        });
      });
    });
  });
});
