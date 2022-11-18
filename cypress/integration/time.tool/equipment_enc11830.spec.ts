/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, equimentCALDueDays, equimentPMDueDays, momentInPST } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPMForm;
let createdCalibrationForm;
let group;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
let equipmentURL;
let asyncTasksGroup;
let dueDateInEmail;
let multipleCompanies;
let dashboardDueDate;

const ADMIN_USER = USERS[1];
const equipmentTitleForm = "Equipment-Form";
const equipmentDocId = "EQ-00001";

context("Autocomplete 'Equipment' test", { tags: ["@timetool"] }, () => {
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
      }).then((response: any) => {
        loginResponse = response;
        multipleCompanies = response.employees.length > 0;
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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      }).then((response: any) => {
        loginResponse = response;
        multipleCompanies = response.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [
            {
              id: adminEmployee.id,
            },
            {
              id: secondEmployee.id,
            },
          ],
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

      it("Select 'Equipment' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Equipment" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Add select field and set validation ", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddField();
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

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add Autocomplete", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.fbAddNewFieldButton();
        });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.listLoadingElementShouldNotExist();
      });

      it("Select references", () => {
        cy.drSelectReferences( "FM-00004" );
        cy.drSelectReferences( "FM-00005" );
        cy.unClick();
      });

      it("Click create document", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }).as("response");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Verify form Draft status", () => {
    it("Verify form Draft status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: equipmentTitleForm });
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify form Released status", () => {
    it("Verify form Released status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: equipmentTitleForm });
    });
  });

  context("Create 'Equipment'", () => {
    it("Navigate to Equipment", () => {
      cy.navigToEquipment();
    });

    it("Click on 'create a document'", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").arrowClick();
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document for test'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description for test'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select references", () => {
      cy.drSelectReferences( "FM-00004" );
      cy.drSelectReferences( "FM-00005" );
      cy.unClick();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick({ force: true });
    });

    it(`Select '${USERS[2].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick({ force: true });
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType(`${equimentPMDueDays}`);
      cy.unClick();
    });

    it("Type preventative maintenance instruction", () => {
      cy.get("[data-cy^=\"preventative-maintenance\"] div[contenteditable]").last()
        .click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType(`${equimentCALDueDays}`);
    });

    it("Type calibration maintenance instruction", () => {
      cy.get("[data-cy^=\"calibration\"] div[contenteditable]").last().click({ force: true })
        .clear().arrowType("Instructions for calibration");
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Autocomplete-Approvers", () => {
      cy.get(`input[data-cy^="autocomplete-approvers"]`).autocompleteSelect(`${USERS[2].name }`);
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

    it("Verify equipment Released status and header information", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Equipment document" });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", equipmentDocId );
    });
  });

  context("Navig to released 'Equipment maintenance document'", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill new calbration form", () => {
    it("Switch to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Click 'NEW CAL' on calibration section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.calibration']").scrollIntoView();
      cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          const calDocId = response.documentId;
          const calId = response.id;
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

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Click Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
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

    it("Create 'Calibration document' and approve", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(3000);
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
        cy.wait(3000);
      });
    });
  });

  context("Fill new PM form", () => {
    it("Navigate to EQ document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Click 'NEW PM' on Preventative Maintenance section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
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

    it("Create 'Preventative Maintenance' and approve it", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.landingPageLoadingElementShouldNotExist();
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
        cy.wait(5000);
      });
    });
  });

  context("Set time travel to Day 1", () => {
    it("Select 1 day to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 1 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      dueDateInEmail = momentInPST().add(`${equimentCALDueDays}`, "days")
        .subtract(1, "days").format("MM/DD/YYYY");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(15000);
    });
  });

  context("Verify that the Primary owner receives an email for CAL due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[1].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received for CAL due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Primary owner as CAL due", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify the Dashboard notification as 'CAL will be due in 30 days'", () => {
      dashboardDueDate = moment().tz("America/Los_Angeles").add(30, "days").format("MMM D");
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days${dashboardDueDate}`,
      });
    });
  });

  context("Verify that the Coordinator receives an email as CAL due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[2].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received as CAL due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [`Hello <b>${USERS[2].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Coordinator as CAL due", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify the Dashboard notification as 'CAL will be due in 30 days'", () => {
      dashboardDueDate = moment().tz("America/Los_Angeles").add(30, "days").format("MMM D");
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 30 days${dashboardDueDate}`,
      });
    });
  });

  context("Set time travel to Day 11", () => {
    it("Logout currect user", () => {
      cy.authLogout();
    });

    it("Log in as Primary owner", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 10 days to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 10 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      dueDateInEmail = momentInPST().add(`${equimentPMDueDays}`, "days")
        .subtract(11, "days").format("MM/DD/YYYY");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(15000);
    });
  });

  context("Verify that the Primary owner receives an email for PM due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[1].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
            `${dueDateInEmail}`,
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

  context("Verify that the Primary owner did not receive notification as Preventative Maintenance due", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify Primary owner did not received notification as 'Preventative Maintenance will be due in 30 days'", () => {
      dashboardDueDate = momentInPST().add(`${equimentPMDueDays}`, "days").subtract(11, "days").format("MMM D");
      cy.dashVerifyListItemNotExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days${dashboardDueDate}`,
      });
    });
  });

  context("Verify that the Coordinator receives an email as PM due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[2].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received as PM due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [`Hello <b>${USERS[2].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Coordinator as Preventative Maintenance due", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify the Dashboard notification as 'Preventative Maintenance will be due in 30 days'", () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 30 days${dashboardDueDate}`,
      });
    });
  });

  context("Set time travel to Day 25", () => {
    it("Logout currect user", () => {
      cy.authLogout();
    });

    it("Log in as Primary owner", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 14 days to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 14 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      dueDateInEmail = momentInPST().add(`${equimentCALDueDays}`, "days").subtract(25, "days").format("MM/DD/YYYY");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(15000);
    });
  });

  context("Verify that the Primary owner receives an email for CAL due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[1].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received for CAL due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Primary owner as CAL due", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify the Dashboard notification as 'Due for Calibration in 7 days'", () => {
      dashboardDueDate = momentInPST().add(`${equimentCALDueDays}`, "days").subtract(25, "days").format("MMM D");
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 7 days${dashboardDueDate}`,
      });
    });
  });

  context("Verify that the Coordinator receives an email as CAL due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[2].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has Calibration Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received as CAL due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [`Hello <b>${USERS[2].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has Calibration due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Coordinator as CAL due", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify the Dashboard notification as 'Due for Calibration in 7 days'", () => {
      dashboardDueDate = momentInPST().add(`${equimentCALDueDays}`, "days").subtract(25, "days").format("MMM D");
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Calibration in 7 days${dashboardDueDate}`,
      });
    });
  });

  context("Set time travel to Day 32", () => {
    it("Logout currect user", () => {
      cy.authLogout();
    });

    it("Log in as Primary owner", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 7 days to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 7 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(15000);
    });
  });

  context("Navigate to equipment list and verify CAL status updated to CAL Due", () => {
    it("Navigate to equipment list", () => {
      cy.navigToEquipment();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select first Equipment on list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("CAL status should update to CAL Due", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .subtract(1, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDue - Due date: ${calibrationComplianceDate}`);
        });
    });
  });

  context("Set time travel to Day 34", () => {
    it("Select 2 days to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 2 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      dueDateInEmail = momentInPST().add(`${equimentPMDueDays}`, "days").subtract(34, "days").format("MM/DD/YYYY");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(15000);
    });
  });

  context("Verify that the Primary owner receives an email for PM due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[1].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
            `${dueDateInEmail}`,
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

  context("Verify that the Primary owner did not receive notification as Preventative Maintenance due", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify the Dashboard notification not received as 'Preventative Maintenance will be due in 7 days'", () => {
      dashboardDueDate = momentInPST().add(`${equimentPMDueDays}`, "days").subtract(34, "days").format("MMM D");
      cy.dashVerifyListItemNotExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 7 days${dashboardDueDate}`,
      });
    });
  });

  context("Verify that the Coordinator receives an email as PM due", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: USERS[2].email,
        after: dateAfterEmailShouldArrive,
        subject: `Equipment ${equipmentDocId} Equipment document has PM Due`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received as PM due", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [`Hello <b>${USERS[2].name},</b>`,
            `Equipment <b>${equipmentDocId} Equipment document</b> has PM due on`,
            `${dueDateInEmail}`,
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

  context("Verify Dashboard notification for Coordinator as Preventative Maintenance due", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify the Dashboard notification as 'Preventative Maintenance will be due in 7 days'", () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${equipmentDocId}Rev 1 Equipment documentis Due for Preventative Maintenance in 7 days${dashboardDueDate}`,
      });
    });
  });

  context("Set time travel to Day 41", () => {
    it("Logout currect user", () => {
      cy.authLogout();
    });

    it("Log in as Primary owner", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 7 days to time travel", () => {
      cy.equipSetTimeTravelInDays({ days: 7 });
    });
  });

  context("Trigger email", () => {
    it("Select task SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.SEND_EMAILS_FOR_UPCOMING_DUE_DATES_IN_EQS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
    });
  });

  context("Navigate to equipment list and verify PM status updated to PM Due", () => {
    it("Navigate to equipment list", () => {
      cy.navigToEquipment();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select first Equipment on list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("PM status should update to PM Due", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .subtract(1, "days")
        .format("ddd, MMMM D, YYYY");

      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDue - Due date: ${prevMaintenanceComplianceDate}`);
        });
    });
  });
});
