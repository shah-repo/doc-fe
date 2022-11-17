/* eslint-disable max-len */

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let coordinatorUser;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPMForm;
let createdCalibrationForm;
let group;
let equipmentURL;
let calDocId;
let calId;
let adminSessionId;
let asyncTasksGroup;

const equimentDueDays = (31);
const ADMIN_USER = USERS[1];
const equipmentTitleForm = `Equipment-Form`;
const equipmentDocId = "EQ-00001";

context("'Equipment' test with time tool", { tags: ["@timetool"] }, () => {
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          coordinatorUser = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
        },
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Create 'Equipment Form'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title " + equipmentTitleForm, () => {
      cy.drEnterDocumentTitle({ name: equipmentTitleForm });
    });

    it("Enter document description 'Equipment document description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment Form document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Equipment' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("EQUIPMENT SECTIONS FOR PM", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
      cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
      cy.fbAddField();
    });

    it("EQUIPMENT SECTIONS FOR CAL", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "Calibration" });
      cy.get("input[value=\"calibration\"]").arrowClick();
      cy.fbAddField();
    });

    it("Click create document", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }).as("response");
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create 'Equipment'", () => {
    it("Click create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
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
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[2].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType(`${equimentDueDays}`);
      cy.unClick();
    });

    it("Type preventative maintenance instruction", () => {
      cy.get(`[data-cy="form.builder.pm.instructions"]`).eq(0).contains("Instructions").scrollIntoView();
      cy.get("[data-cy^='preventative-maintenance'] div[contenteditable]").last()
        .click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType(`${equimentDueDays}`);
    });

    it("Type calibration maintenance instruction", () => {
      cy.get(`[data-cy^="calibration"] div[contenteditable]`).last()
        .click({ force: true }).clear().arrowType("Instructions for calibration");
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context("Navig to released 'Equipment maintenance document'", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill calbration form and release it", () => {
    it("Click 'NEW CAL' on calibration section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          calId = response.id;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
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

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Navigate to details tab", () => {
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

    it("Create 'Calibration document' and approve", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to Overview tab", () => {
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

  context("Fill PM form and release it", () => {
    it("Navigate to EQ document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click 'NEW PM' on Preventative Maintenance section", () => {
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

    it("Enter title 'Preventative Maintenance'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance" });
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").subtract(1, "days");
      const month = dayOfTheMonth.format("MMMM");
      const day = dayOfTheMonth.format("D");

      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();

        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(0).arrowClick();
        }

        cy.wait(500);

        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();

            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
    });

    it("Create 'Preventative Maintenance' and approve it", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Navigate to Overview tab", () => {
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

  context("Verify UI notification is present for coordinator on current day", () => {
    it("Logout", () => {
      cy.authLogout();
    });

    it("Log user in", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: coordinatorUser.id });
    });

    it("Verify Dashboard list", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days` });
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days` });
    });

    it("Logout", () => {
      cy.authLogout();
    });
  });

  context("Login with primary owner", () => {
    it("Log user in", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  let totalDays = 0;
  const testDays = [1, 22, 1];
  testDays.forEach((dayToTest, i) => {
    totalDays = totalDays +  dayToTest;
    context(`Test UI message for day ${(totalDays)}`, () => {
      context("Use time tool to travel user back to future", () => {
        it("Navigate to async tasks", () => {
          cy.navigToAsyncTasks();
        });

        it("Select task TIME_TRAVEL_USER", () => {
          cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
        });

        it(`Select ${dayToTest.toString()} day to back in future`, () => {
          cy.get("input[name=\"day\"]").clear();
          cy.asyncSelectBackToTheFutureTime({ day: dayToTest });
        });

        it("Select next tasks", () => {
          cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.RECALC_COMPLIANCE_FOR_EQUIPMENTS });
        });

        it("Submit async task", () => {
          cy.asyncTaskClickSubmit();
          cy.wait(30000);
        });
      });

      context("Veriy UI notification is present for coordinator", () => {
        it("Logout", () => {
          cy.authLogout();
        });

        it("Log user in", () => {
          cy.authLoginToDashboard({ USER: USERS[2], employeeId: coordinatorUser.id });
        });

        it("Verify user is loged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Verify Dashboard list", () => {
          cy.get("[data-cy=dashboardFeedList]>div").then(($dayToTest) => {
            if (i === 0) {
              // cy.dashVerifyListItemExistsOnDashboard({ listItem: `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days` });
              // cy.dashVerifyListItemExistsOnDashboard({ listItem: `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days` });
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days`)
                .should("exist");
            }
            else if (i === 1) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 7 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
            }
            else if (i === 2) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 7 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 7 days`)
                .should("exist");
            }
          });
        });

        it("Logout", () => {
          cy.authLogout();
        });
      });

      context("Veriy UI notification is present for primary owner", () => {
        it("Log user in", () => {
          cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
        });

        it("Verify user is loged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Verify Dashboard list", () => {
          cy.get("[data-cy=dashboardFeedList]>div").then(($dayToTest) => {
            if (i === 0) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
            }
            else if (i === 1) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
            }
            else if (i === 2) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 7 days`)
                .should("exist");
            }
          });
        });
      });
    });
  });
});
