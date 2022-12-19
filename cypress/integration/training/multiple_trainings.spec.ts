/* eslint-disable @typescript-eslint/camelcase */

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL, TrainingStatus } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let initialArDocument;
let everyoneGroup;
let secondEmployee;
let thirdEmployee;
let fourthEmployee;
let fifthEmployee;
let approvalRequestDocumentType;
let formDocumentType;
let createdTrainingCurriculumFormDocument;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let createdClinicalProtocolForm;
let developersGroup;
let asyncTasksGroup;
let releasedDoc1Id;
let caGroup;

context("Test for multiple TCs and users have different due dates", { tags: ["@timetool"] }, () => {
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
            users: [USERS[2], USERS[3], USERS[4], USERS[6]],
            documentTypes: [
              ClinicalProtocolNotRedline,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          fifthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[6].email);
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
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
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
          employees: [{ id: adminEmployee.id }],
        },
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Company Admin",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        caGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: caGroup.body[0].id,
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
                  label: "Change Orders",
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
                tabId: "overview",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-l0wcpa0v",
                uniqueSchemaItem: true,
                index: 7,
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create a document", () => {
    it(`Doc1 with ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
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
      cy.get(`[data-cy="HeaderInfo-docId"]`).then((x) => { releasedDoc1Id = x.text(); });
    });
  });

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetAutocompleteOptions, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("Training Curriculum test");
      });
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

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("35");
    });

    it("Select 2 Users to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[2].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[3].name}`);
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notifications", () => {
    it(`Login user ${USERS[2].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it(`Login user ${USERS[3].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context(`Login as company admin`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 7 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 7 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create another Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetAutocompleteOptions, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("Training Curriculum test");
      });
    });

    it("Enter training title 'training title1'", () => {
      cy.drEnterDocumentTitle({ name: "test training title1" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("35");
    });

    it("Select 2 Users to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[4].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[6].name}`);
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notifications", () => {
    it(`Login user ${USERS[4].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it(`Login user ${USERS[6].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[6], employeeId: fifthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context(`Login as company admin`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Notification for company admin", () => {
    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.contains("No pending actions").should("exist");
      cy.get("#full-width-tabpanel-0 li").should("have.length", 0);
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 17 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 17 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Notification for ${USERS[2].name}`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });
  });

  context(`Notification for ${USERS[3].name}`, () => {
    it(`Login as ${USERS[3].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });
  });

  context(`Notification for ${USERS[4].name}`, () => {
    it(`Login as ${USERS[4].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context(`Notification for ${USERS[6].name}`, () => {
    it(`Login as ${USERS[6].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[6], employeeId: fifthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context("Company admin dashboard", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it("Click on due tag", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has due trainings with 2 users", () => {
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (2)`);
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[2].name)
        .and("contain.text", USERS[3].name);
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (2)`);
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for ${USERS[2].name} & ${USERS[3].name} should present in All tab`, () => {
      cy.get("#full-width-tabpanel-0 li").should("have.length", 2);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[2].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[3].name.split(" ")[0]);
    });

    it(`Line item for ${USERS[2].name} & ${USERS[3].name} should present in due tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-1\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-2 ul li").should("have.length", 2);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[2].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[3].name.split(" ")[0]);
    });

    it("Chart - Due in 7 Days should have 2", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/training_record/dueSummary/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.DUE).to.equal(2);
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 6 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 6 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Notification for all users with ${TrainingStatus.DUE_IN_7_DAYS} tag`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it(`Login as ${USERS[3].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it(`Login as ${USERS[4].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it(`Login as ${USERS[6].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[6], employeeId: fifthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });
  });

  context("Company admin dashboard", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it("Click on due tag", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has due trainings with 4 users", () => {
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (4)`);
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[2].name)
        .and("contain.text", USERS[3].name)
        .and("contain.text", USERS[4].name)
        .and("contain.text", USERS[6].name);
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (4)`);
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for all users should present in All tab`, () => {
      cy.get("#full-width-tabpanel-0 li").should("have.length", 4);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[2].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[4].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it(`Line item for all users should present in due tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-1\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-2 ul li").should("have.length", 4);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[2].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[4].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it("Chart - Due in 7 Days should have 4", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/training_record/dueSummary/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.DUE).to.equal(4);
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Notification for all users", () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains("OVERDUE").should("exist");
    });

    it(`Login as ${USERS[3].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains("OVERDUE").should("exist");
    });

    it(`Login as ${USERS[4].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains(TrainingStatus.DUE_IN_7_DAYS).should("exist");
    });

    it(`Login as ${USERS[6].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[6], employeeId: fifthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains(TrainingStatus.DUE_IN_7_DAYS).should("exist");
    });
  });

  context("Company admin dashboard", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification for due", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it("Click on due tag", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has due trainings with 2 users", () => {
      cy.get("h2").eq(1).should("contain.text", "DUE IN 7 DAYS (2)");
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[4].name)
        .and("contain.text", USERS[6].name);
      cy.get("h2").eq(1).should("contain.text", "DUE IN 7 DAYS (2)");
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for 4 users should present in All tab`, () => {
      cy.get("#full-width-tabpanel-0 li").should("have.length", 4);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[4].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[6].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[2].name.split(" ")[0]);
    });

    it(`Line item for 2 users should present in due tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-1\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-2 ul li").should("have.length", 2);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[4].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it("Verify training notification for overdue", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).should("have.text", TrainingStatus.OVERDUE);
    });

    it("Click on overdue tag", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has overdue trainings with 2 users", () => {
      cy.get("h2").eq(1).should("contain.text", "Overdue (2)");
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[2].name)
        .and("contain.text", USERS[3].name);
      cy.get("h2").eq(1).should("contain.text", "Overdue (2)");
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for 2 should present in Overdue tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-2\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-1 ul li").should("have.length", 2);
      cy.get("#full-width-tabpanel-1 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-1 ul li").should("contain", USERS[2].name.split(" ")[0]);
    });

    it("Chart - Due in 7 Days & Overdue should have 2", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/training_record/dueSummary/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.DUE).to.equal(2);
          expect(res.body.OVERDUE).to.equal(2);
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Check Training notifications`, () => {
    it(`Login user as ${USERS[2].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it(`Complete training for ${USERS[2].name}`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
    });

    it("'Overdue' should not exist", () => {
      cy.contains("Overdue").should("not.exist");
    });

    it(`Login user as ${USERS[4].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
    });

    it(`Complete training for ${USERS[4].name}`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
    });

    it(`${TrainingStatus.DUE_IN_7_DAYS} should not exist`, () => {
      cy.contains("Due in 7 days").should("not.exist");
    });

    it(`Login user as ${USERS[3].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains(TrainingStatus.OVERDUE).should("exist");
    });

    it(`Login user as ${USERS[6].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[6], employeeId: fifthEmployee.id });
    });

    it("Verify training notification", () => {
      cy.contains(TrainingStatus.DUE_IN_7_DAYS).should("exist");
    });
  });

  context("Company admin dashboard", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification for due", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });

    it("Click on due tag", () => {
      cy.get("[trainingstatus=\"DUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has due trainings with 1 user", () => {
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (1)`);
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[6].name);
      cy.get("h2").eq(1).should("contain.text", `${TrainingStatus.DUE_IN_7_DAYS} (1)`);
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for 2 users should present in All tab`, () => {
      cy.get("#full-width-tabpanel-0 li").should("have.length", 2);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it(`Line item for 1 user should present in due tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-1\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-2 ul li").should("have.length", 1);
      cy.get("#full-width-tabpanel-2 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it("Verify training notification for overdue", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).should("have.text", TrainingStatus.OVERDUE);
    });

    it("Click on overdue tag", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]").eq(0).arrowClick();
    });

    it("Check if headline says 'Training Status'", () => {
      cy.get("[id='simple-modal-title']").should("contain.text", "Training Status");
    });

    it("Check if pop-up modal has overdue trainings with 1 user", () => {
      cy.get("h2").eq(1).should("contain.text", "Overdue (1)");
      cy.get("[class='MuiCollapse-wrapperInner']").eq(-1).should("contain.text", USERS[3].name);
      cy.get("h2").eq(1).should("contain.text", "Overdue (1)");
      cy.get("button[aria-label=close]").eq(0).arrowClick();
    });

    it(`Line item for 2 should present in All tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-0\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-0 li").should("have.length", 2);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[3].name.split(" ")[0]);
      cy.get("#full-width-tabpanel-0 ul li").should("contain", USERS[6].name.split(" ")[0]);
    });

    it(`Line item for 1 should present in Overdue tab`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-2\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-1 ul li").should("have.length", 1);
      cy.get("#full-width-tabpanel-1 ul li").should("contain", USERS[3].name.split(" ")[0]);
    });

    it("Chart - Due in 7 Days & Overdue should have 1", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/training_record/dueSummary/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.DUE).to.equal(1);
          expect(res.body.OVERDUE).to.equal(1);
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Chart - Total outsanding should have 2", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/training_record/due/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.total).to.equal(2);
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check dashboard and training tab for company admin", () => {
    it("In dashboard, 3 tabs should be present", () => {
      cy.get("[role=\"tablist\"]").eq(0).find("button").should("have.length", 3);
      cy.get("[role=\"tablist\"]").eq(0).find("button").eq(0).should("contain.text", "My Feed");
      cy.get("[role=\"tablist\"]").eq(0).find("button").eq(1).should("contain.text", "Trainings");
      cy.get("[role=\"tablist\"]").eq(0).find("button").eq(2).should("contain.text", "Recent");
    });

    it("In dashboard, training outstanding chart should be present", () => {
      cy.get("#training-chart canvas").should("be.exist");
    });

    it("In dashboard, user view should have 3 tabs", () => {
      cy.get("[role=\"tablist\"]").eq(1).find("button").should("have.length", 3);
      cy.get("[role=\"tablist\"]").eq(1).find("button").eq(0).should("contain.text", "ALL");
      cy.get("[role=\"tablist\"]").eq(1).find("button").eq(1).should("contain.text", "Overdue");
      cy.get("[role=\"tablist\"]").eq(1).find("button").eq(2).should("contain.text", "DUE IN 7 DAYS");
    });

    it("Training tab should have separate line item for Overdue & Due", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").should("have.length", 2);
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0).should("contain.text", "OVERDUE");
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(1).should("contain.text", "DUE IN 7 DAYS");
    });

    it("Check line item format in training tab", () => {
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0)
        .find(".MuiListItemIcon-root svg").should("be.exist");
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0)
        .find(".MuiGrid-container").eq(0)
        .should("contain.text", "Training on")
        .and("contain.text", "FM-00002")
        .and("contain.text", "OVERDUE")
        .and("contain.text", "released doc1");
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0)
        .find(".MuiGrid-container").eq(1)
        .should("contain.text", `${USERS[3].name}`);
    });

    it("Click on 'All' tab should display all training items", () => {
      cy.get("#full-width-tabpanel-0 ul li").should("have.length", 2);
    });

    it("Click on 'Due' tab should display due training items", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-1\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-2 ul li").should("have.length", 1);
    });

    it("Click on 'Overdue' tab should display Overdue training items", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-2\"]").arrowClick();
      });
      cy.get("#full-width-tabpanel-1 ul li").should("have.length", 1);
    });

    it("Check training item format", () => {
      cy.get("#full-width-tabpanel-1 li").eq(0)
        .should("contain.text", "At")
        .and("contain.text", "Athena")
        .and("contain.text", "Overdue")
        .and("contain.text", "FM-00002")
        .and("contain.text", "released doc1")
        .and("contain.text", "Due date");
    });

    it("On hover line item, Pin button should display", () => {
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0)
        .realHover().wait(1000);
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiListItem-root").eq(0)
        .find("svg").eq(2).realHover().wait(1000);
      cy.get("[id^=mui-tooltip-]").should("have.text", "Pin this item");
    });
  });

  context(`Complete Overdue training for ${USERS[3].name}`, () => {
    it(`Login user as ${USERS[3].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it(`Complete training for ${USERS[3].name}`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
    });

    it("'Overdue' should not exist", () => {
      cy.contains("Overdue").should("not.exist");
    });
  });

  context("Company admin dashboard", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Line item should not present in Overdue tab", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostTrainingDue, () => {
        cy.get("button[aria-controls=\"full-width-tabpanel-2\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("#full-width-tabpanel-1 ul li").should("have.length", 0);
    });

    it("Chart - Overdue should have 0", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/training_record/dueSummary/*" }, (req) => {
        req.reply((res) => {
          expect(res.body.OVERDUE).to.equal(0);
        });
      }).as("response");
      cy.wait(5000);
      cy.reload();
      cy.wait("@response");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });
});
