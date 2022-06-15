/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPMForm;
let createdCalibrationForm;
let group;
let equipmentURL;
let pmSchemaFieldName;
let calibrationSchemaFieldName;
let adminSessionId;
let asyncTasksGroup;
let dateAfterEmailShouldArrive;
let emailsFromInbox;

const equimentDueDays = (31);
const multipleCompanies = true;
const ADMIN_USER = USERS[1];
const equipmentTitleForm = `Equipment-Form`;
const equipmentDocId = "EQ-00001";

context("Autocomplete 'Equipment' test", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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

  context("Autocomplete 'Equipment' test", () => {
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

      it("Add autocomplete of “Approvers” and set validation", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddField();
      });

      it("Add select field and set validation ", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.fbFieldRequiredIf({ name: "Autocomplete-Approvers", value: USERS[1].email });
        cy.fbAddField();
      });

      it("EQUIPMENT SECTIONS FOR PM", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbAddField();
      });

      it("EQUIPMENT SECTIONS FOR CAL", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
        cy.get("input[value=\"calibration\"]").arrowClick();
        cy.fbAddField();
      });

      it("Select references", () => {
        cy.drSelectReferences( "FM-00004" );
        cy.drSelectReferences( "FM-00005" );
        cy.unClick();
      });

      it("Click create document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            pmSchemaFieldName = response.formTemplate.schema[5].name;
            calibrationSchemaFieldName = response.formTemplate.schema[6].name;
          }
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
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

    it("Select references", () => {
      cy.drSelectReferences( "FM-00004" );
      cy.drSelectReferences( "FM-00005" );
      cy.unClick();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[2].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick();
    });

    it("Autocomplete-Approvers", () => {
      cy.get(`input[data-cy^="autocomplete-approvers"]`).autocompleteSelect(`${USERS[2].name }`);
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
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
      cy.get("[data-cy^=\"preventative-maintenance\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
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
      cy.get("[data-cy^=\"calibration\"]>div>div>div>div>div[contenteditable]")
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
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdCalibrationForm.id}/create_maintenance/${docIdFromUrl}/${calibrationSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
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

    it("Create 'Calibration document' and approve", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
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
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdPMForm.id}/create_maintenance/${docIdFromUrl}/${pmSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative Maintenance'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
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

  context("Fill second PM form and keep it in draft", () => {
    it("Navigate to EQ document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click 'NEW PM' on Preventative Maintenance section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdPMForm.id}/create_maintenance/${docIdFromUrl}/${pmSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Second Preventative Maintenance", () => {
      cy.drEnterDocumentTitle({ name: "Second Preventative Maintenance" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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

    it("Create 'Second Preventative Maintenance'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });
  });

  context("Check equipment calibration history on preventative maintenance history in equipment", () => {
    it("Navig to Equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify history for pm", () => {
      cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
      cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
    });

    it("Verify history for calibration", () => {
      cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
    });
  });

  const testDays = [1, 21, 1, 1];
  const startingTestDay = 1;
  testDays.forEach((dayToTest, i) => {
    context(`Test UI message for day ${dayToTest}`, () => {
      context("Use time tool to travel user back to future", () => {
        it("Navigate to async tasks", () => {
          cy.navigToAsyncTasks();
        });

        it("Select task TIME_TRAVEL_USER", () => {
          cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
        });

        const daysToJumpBackInFuture = startingTestDay + i === 1 ? 1 : 1;
        it(`Select ${daysToJumpBackInFuture.toString()} day to back in future`, () => {
          cy.get("input[name=\"day\"]").clear();
          cy.asyncSelectBackToTheFutureTime({ day: dayToTest });
        });

        it("Select next tasks", () => {
          cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.RECALC_COMPLIANCE_FOR_EQUIPMENTS });
          cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        });

        it("Submit async task", () => {
          cy.asyncTaskClickSubmit();
          cy.wait(2000);
          cy.reload();
        });
      });

      context("Veriy UI notification is present for coordinator", () => {
        it("Logout", () => {
          cy.authLogout();
        });

        it("Log user in", () => {
          cy.authLogin({
            email: USERS[2].email,
          });
        });

        it("Selects company", () => {
          cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
        });

        it("Verify user is loged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Get emails", () => {
          cy.then(() => {
            if (i === 0) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {
                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  }).and(() => {

                    const getEmailSetting =  {
                      to: USERS[2].email,
                      after: dateAfterEmailShouldArrive,
                      subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
                    };

                    cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                      .then((emails) => {
                        emailsFromInbox = emails;
                      }).then(() => {

                        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                          {
                            sentToUser: USERS[2].email,
                            contains: [`Hello <b>${USERS[2].name},</b>`,
                              `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
                              `Please click on the button below to view it`,
                              "<button type=\"button\">VIEW ITEM</button>",
                              createdCompany.id],
                          }];

                        cy.imapVerifyEmailsInList({
                          receivedEmails: emailsFromInbox,
                          emailsToTest: emailsThatShouldBeReceived,
                          getEmailsSincedate: dateAfterEmailShouldArrive,
                          assertNumberOfEmailsFoundInList: 1,
                        });
                      });
                  });
                });
            }

            else if (i === 0) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {

                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  });
                });
            }

            else if (i === 2) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {

                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  });
                });
            }

            else if (i === 3) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {

                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  });
                });
            }
          });
        });

        it("Verify Dashboard list", () => {
          cy.get("[data-cy=dashboardFeedList]>div").then(($dayToTest) => {
            if (i === 0) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days`)
                .should("exist");
            }
            else if (i === 1) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days`)
                .should("exist");
            }
            else if (i === 2) {
              cy.get("[data-cy=dashboardFeedList]>div").eq(0)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 7 days`)
                .should("exist");
              cy.get("[data-cy=dashboardFeedList]>div").eq(1)
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
            }
            else if (i === 3) {
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
          cy.authLogin({
            email: USERS[1].email,
          });
        });

        it("Selects company", () => {
          cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
        });

        it("Verify user is loged in", () => {
          cy.navigListExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });

        it("Get emails", () => {
          cy.then(($dayToTest) => {
            if (i === 0) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {
                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  }).and(() => {

                    const getEmailSetting =  {
                      to: USERS[2].email,
                      after: dateAfterEmailShouldArrive,
                      subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
                    };

                    cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                      .then((emails) => {
                        emailsFromInbox = emails;
                      }).then(() => {

                        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                          {
                            sentToUser: USERS[2].email,
                            contains: [`Hello <b>${USERS[2].name},</b>`,
                              `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
                              `Please click on the button below to view it`,
                              "<button type=\"button\">VIEW ITEM</button>",
                              createdCompany.id],
                          }];

                        cy.imapVerifyEmailsInList({
                          receivedEmails: emailsFromInbox,
                          emailsToTest: emailsThatShouldBeReceived,
                          getEmailsSincedate: dateAfterEmailShouldArrive,
                          assertNumberOfEmailsFoundInList: 1,
                        });
                      });
                  });
                });
            }

            else if (i === 2) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {

                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  });
                });
            }

            else if (i === 3) {
              const getEmailSetting =  {
                to: USERS[2].email,
                after: dateAfterEmailShouldArrive,
                subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
              };

              cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
                .then((emails) => {
                  emailsFromInbox = emails;
                }).then(() => {

                  const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
                    {
                      sentToUser: USERS[2].email,
                      contains: [`Hello <b>${USERS[2].name},</b>`,
                        `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
                        // `${dueDateInEmail}`,
                        `Please click on the button below to view it`,
                        "<button type=\"button\">VIEW ITEM</button>",
                        createdCompany.id],
                    }];

                  cy.imapVerifyEmailsInList({
                    receivedEmails: emailsFromInbox,
                    emailsToTest: emailsThatShouldBeReceived,
                    getEmailsSincedate: dateAfterEmailShouldArrive,
                    assertNumberOfEmailsFoundInList: 1,
                  });
                });
            }
          });
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
                .contains(`${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days`)
                .should("exist");
            }
            else if (i === 3) {
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
