/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import moment from "moment-timezone";
import { TIME_ZONE } from "../../../src/common/utils/date";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset } from "../../utils/constants/dateHandler";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let initialArDocument;
let everyoneGroup;
let secondEmployee;
let approvalRequestDocumentType;
let formDocumentType;
let createdTrainingCurriculumFormDocument;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let createdClinicalProtocolForm;
let allGroups;
let developersGroup;
let asyncTasksGroup;
let releasedDoc1Id;
let caGroup;
let emailsFromInbox: IMAPEmail[];
let dateAfterEmailShouldArrive;
let getEmailSetting;

context("Email popup modal for training due",  { tags: ["@timetool"] }, () => {
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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[13], USERS[14]],
            documentTypes: [
              ClinicalProtocolNotRedline,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[12].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          trainingCurriculumDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Training Curriculum Test");
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroups({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        allGroups = response;
        cy.log(response);
        developersGroup = allGroups.find((group) => group.name === "Developers");
        asyncTasksGroup = allGroups.find((group) => group.name === "Async Tasks");
        caGroup = allGroups.find((group) => group.name === "Company Admin");
        done();
      });
    });

    it("[API]Patch 'Developers' group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]Patch 'Async Tasks' group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
        },
      });
    });

    it("[API]Patch 'Company Admin' group", () => {
      cy.grpPatchGroup({
        groupId: caGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [
            GroupTag.DASHBOARD_ADMIN,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
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
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              menu: [
                {
                  icon: "/navigation_icons/computer.svg",
                  path: "/training",
                  type: "LINK",
                  label: "Training Records",
                },
                {
                  icon: "/navigation_icons/receipt_list.svg",
                  path: "/document_by_category/Training Curriculums",
                  type: "LINK",
                  label: "Training Curriculums",
                },
              ],
              type: "MENU",
              label: "Training",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]Create form to be used for training", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        everyoneGroup = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Form to be used for training</p>",
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
                      id: everyoneGroup.body[0].id,
                    },
                  ],
                },
              },
              name: "released form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: clinicalProtocolDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdClinicalProtocolForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdClinicalProtocolForm.id,
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

    it("[API]Create Training Curriculum form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Training Curriculum form</p>",
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
                  id: everyoneGroup.body[0].id,
                },
              ],
            },
          },
          name: "Training Curriculum form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: trainingCurriculumDocumentType[0].id,
            }],
            schema: [
              {
                name: "training-curriculum-details-section",
                type: "section",
                index: 0,
                label: "Periodic Training",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Periodic Training",
                applicableValidationSchema: true,
              },
              {
                name: "training-document-to-be-trained-on",
                type: "autocomplete",
                index: 1,
                label: "Documents to Train on",
                tabId: "details",
                rules: "|required",
                multiple: true,
                optionId: "36",
                validators: {
                  required: true,
                },
                placeholder: "Select documents for training",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "visibility",
                editorProperties: [
                  "multiple",
                ],
                validationAttribute: "Documents to Train on",
                applicableValidationSchema: true,
              },
              {
                name: "training-refresh-training-periodically",
                type: "radiogroup",
                index: 2,
                label: "Refresh/repeat training periodically?",
                tabId: "details",
                rules: "required||",
                options: [
                  {
                    text: "Yes",
                    value: "Yes",
                  },
                ],
                validators: {
                  required: true,
                },
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Refresh/repeat training periodically?",
                applicableValidationSchema: true,
              },
              {
                name: "training-validity",
                type: "quantity",
                index: 3,
                label: "Training Frequency (in days)",
                tabId: "details",
                rules: "required_if:training-refresh-training-periodically,Yes",
                validators: {
                  required_if: {
                    name: "training-refresh-training-periodically",
                    value: [
                      "Yes",
                    ],
                  },
                },
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "visibility",
                validationAttribute: "Training Frequency (in days)",
                applicableValidationSchema: true,
              },
              {
                name: "training-details-section",
                type: "section",
                index: 4,
                label: "Trainees Details",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Trainees Details",
                applicableValidationSchema: true,
              },
              {
                name: "training-select-groups-to-train",
                type: "autocomplete",
                index: 5,
                label: "Groups to Train",
                tabId: "details",
                multiple: true,
                optionId: "10",
                placeholder: "Select groups",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                editorProperties: [
                  "multiple",
                ],
                validationAttribute: "Groups to Train",
                applicableValidationSchema: true,
              },
              {
                name: "training-select-users-to-train",
                type: "autocomplete",
                index: 6,
                label: "Users to Train (if applicable)",
                tabId: "details",
                multiple: true,
                optionId: "13",
                placeholder: "Select users",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                editorProperties: [
                  "multiple",
                ],
                validationAttribute: "Users to Train (if applicable)",
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-l0wcpa0v",
                uniqueSchemaItem: true,
                index: 7,
                tabId: "overview",
              },
            ],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdTrainingCurriculumFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdTrainingCurriculumFormDocument.id,
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
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
    });
  });

  context("Create a document", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedDoc1Id = x.text(); });
    });
  });

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("Training Curriculum test");
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training title 'training title'", () => {
      cy.drEnterDocumentTitle({ name: "test training title" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("40");
    });

    it("Select 2 Users to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[12].name}`);
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click on 'Overview' tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it(`Login user ${USERS[12].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 31 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 31 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(15000);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 3 }, () => {
      cy.wait(5000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
    it("Verify training notification", { retries: 5 }, () => {
      cy.wait(8000);
      cy.get("[id='scrollable-auto-tab-0'").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).should("have.text", "OVERDUE");
    });
  });

  context("Click on overdue tag and check the pop-up content", () => {
    it("Click on overdue tag", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has overdue trainings with 2 users", () => {
      cy.get("h2").eq(1).should("contain.text", "Overdue (2)");
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[11].name)
        .and("contain.text", USERS[12].name);
      cy.get("h2").eq(1).should("contain.text", "Overdue (2)");
    });

    it("Click on 'EMAIL ALL'", () => {
      cy.get("button").contains("EMAIL ALL").arrowClick();
    });

    it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
      cy.contains("EMAIL SENT TO ALL").should("exist");
      cy.get("button[aria-label=close]").eq(1).arrowClick();
      dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(emailDateOffset, "milliseconds");
    });

    it("There should be 3 columns", () => {
      cy.contains("Overdue (2)").parent().parent().find(".MuiGrid-item").should("have.length", 3);
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });
  });

  context(`Verify email for pending training notification to ${USERS[11].name}`, () => {
    it("Verify emails", () => {
      getEmailSetting =  {
        to: USERS[11].email,
        after: dateAfterEmailShouldArrive,
        subject: "Your training is overdue",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetMails({ userEmail: USERS[11].email, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const dueDate = moment().tz(TIME_ZONE)
        .subtract(1, "days")
        .format("MMM D, YYYY");
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[11].email,
          contains: ["Your training is OVERDUE!",
            `Hi ${USERS[11].name}`,
            "FM-00002\r\n                                        released doc1</strong></u> was due on",
            `${dueDate}`,
            "Thank you,",
            "<button type=\"button\">View Training</button>",
          ],
        }];

      // eslint-disable-next-line no-console
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Get emails and visit training page", () => {
      getEmailSetting =  {
        to: USERS[11].email,
        after: dateAfterEmailShouldArrive,
        subject: "Your training is overdue",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetRecordRequestLink({ userEmail: USERS[11].email, options: getEmailSetting });
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on overdue tag", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).arrowClick();
    });

    it("Check if pop-up modal has overdue trainings with 1 user", () => {
      cy.get("h2").eq(1).should("contain.text", "Overdue (1)");
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[12].name);
      cy.get("h2").eq(1).should("contain.text", "Overdue (1)");
    });

    it("Click on 'EMAIL ALL'", () => {
      cy.get("button").contains("EMAIL ALL").eq(0).arrowClick();
    });

    it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
      cy.contains("EMAIL SENT TO ALL").should("exist");
      cy.get("button[aria-label=close]").eq(1).arrowClick();
      dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(emailDateOffset, "milliseconds");
    });
  });

  context(`Login user as ${USERS[12].name}`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });
  });

  context(`Verify email for pending training notification to ${USERS[12].name}`, () => {
    it("Verify emails", () => {
      getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: "Your training is overdue",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const dueDate = moment().tz(TIME_ZONE)
        .subtract(1, "days")
        .format("MMM D, YYYY");
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[12].email,
          contains: ["Your training is OVERDUE!",
            `Hi ${USERS[12].name}`,
            "FM-00002\r\n                                        released doc1</strong></u> was due on",
            `${dueDate}`,
            "Thank you,",
            "<button type=\"button\">View Training</button>",
          ],
        }];

      // eslint-disable-next-line no-console
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Get emails and visit training page", () => {
      getEmailSetting =  {
        to: USERS[12].email,
        after: dateAfterEmailShouldArrive,
        subject: "Your training is overdue",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetRecordRequestLink({ userEmail: USERS[12].email, options: getEmailSetting });
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
    });

    it("'OVERDUE' should not exist", () => {
      cy.contains("OVERDUE").should("not.exist");
    });
  });
});
