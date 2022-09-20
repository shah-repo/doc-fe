/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
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
let approvalRequestDocumentType;
let formDocumentType;
let createdTrainingCurriculumFormDocument;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let createdClinicalProtocolForm;
let developersGroup;
let asyncTasksGroup;
const releasedFormId = "TC-00001";

context("Test training curriculum landing page updates", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/*/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(100);
      });
    }).as("Search");
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
              ClinicalProtocolNotRedline,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

    it("[API] Create Group1", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group1",
          permissions: [],
          isOfficial: true,
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      });
    });

    it("[API] Create Group2", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group2",
          permissions: [],
          isOfficial: true,
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      });
    });

    it("[API] Create Group3", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group3",
          permissions: [],
          isOfficial: true,
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      });
    });

    it("[API] Create Group4", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group4",
          permissions: [],
          isOfficial: true,
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      });
    });

    it("[API] Create Group5", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group5",
          permissions: [],
          isOfficial: true,
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
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
                docId: releasedFormId,
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
                tabId: "details",
                index: 1,
                label: "Documents to Train on",
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
                tabId: "details",
                index: 2,
                label: "Refresh/repeat training periodically?",
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
                tabId: "details",
                index: 3,
                label: "Training Frequency (in days)",
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
                tabId: "details",
                index: 4,
                label: "Trainees Details",
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
                tabId: "details",
                index: 5,
                label: "Groups to Train",
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
                tabId: "details",
                index: 6,
                label: "Users to Train (if applicable)",
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

  context("Create Training Curriculum record - Scenario 7", () => {
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
      cy.drEnterDocumentTitle({ name: "test training title scenario 7" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("2");
    });

    it("Select Groups to train 'Developers'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Developers");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Developers" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Developers New" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task PRECALC_DOC_TYPE_FOR_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check  the name of the group in TC Landing page", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Verify the changed Group name", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("TC-00002").wait(500);
      cy.trClearFilters();
      cy.get(`[data-grid-row-index="0"]`).should("contain", "TC-00002").and("contain", "Developers New");
    });
  });

  context("Create Training Curriculum record- Scenario 8", () => {
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
      cy.drEnterDocumentTitle({ name: "test training title - Scenario 8" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("2");
    });

    it("Select two Groups to train 'Group1', 'Async Tasks'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group1");
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Async Tasks");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Group1" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Group1 Test" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Async Tasks" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Async Tasks 1" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task PRECALC_DOC_TYPE_FOR_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check  the name of the group in TC Landing page", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Verify the changed group names", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("TC-00003").wait(500);
      cy.trClearFilters();
      cy.get(`[data-grid-row-index="0"]`).should("contain", "TC-00003").and("contain", "Group1 Test", "Async Tasks 1");
    });
  });

  context("Create Training Curriculum record- Scenario 9", () => {
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
      cy.drEnterDocumentTitle({ name: "test training title - Scenario 9" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("2");
    });

    it("Select two Groups to train 'Group2'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group2");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Revise TC", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select one more group to train", () => {
      cy.wait(2000);
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group3");
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Group2" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Group2 TA Test" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Group3" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Group3 test" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task PRECALC_DOC_TYPE_FOR_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check  the name of the group in TC Landing page", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Verify the changed group names", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("TC-00004").wait(500);
      cy.trClearFilters();
      cy.get(`[data-grid-row-index="0"]`).should("contain", "TC-00004").and("contain", "Group2 TA Test", "Group3 test");
    });
  });

  context("Create Training Curriculum record- Scenario 10", () => {
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
      cy.drEnterDocumentTitle({ name: "test training title - Scenario 10" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("2");
    });

    it("Select Groups to train 'Group3 test'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group3 test");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Revise TC", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select one more group to train", () => {
      cy.get("[class=\"MuiSvgIcon-root MuiChip-deleteIcon\"]").eq(1).arrowClick();
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group4");
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Group4" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Group4 test" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task PRECALC_DOC_TYPE_FOR_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check  the name of the group in TC Landing page", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Verify the changed group names", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("TC-00005").wait(500);
      cy.trClearFilters();
      cy.get(`[data-grid-row-index="0"]`).should("contain", "TC-00005").and("contain", "Group4 test");
    });
  });

  context("Create Training Curriculum record- Scenario 11", () => {
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
      cy.drEnterDocumentTitle({ name: "test training title - Scenario 11" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("2");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Revise TC", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select one more group to train", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group5");
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Search Group", () => {
      cy.grpClickEditGroupWithName({ name: "Group5" });
    });

    it("Change the name of the group", () => {
      cy.grpEditGroupName({ name: "Group5 test" });
    });

    it("Save group", () => {
      cy.grpSaveGroupPatch();
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task PRECALC_DOC_TYPE_FOR_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.PRECALC_DOC_TYPE_FOR_COMPANY });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check  the name of the group in TC Landing page", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Verify the changed group names", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("TC-00006").wait(500);
      cy.trClearFilters();
      cy.get(`[data-grid-row-index="0"]`).should("contain", "TC-00006").and("contain", "Group5 test");
    });
  });
});
