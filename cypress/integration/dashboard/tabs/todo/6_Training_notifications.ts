// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { RevisionChangeType } from "../../../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../../../support/commands/company/commands";
import { ClinicalProtocolNotRedline } from "../../../../utils/constants/documentTypes/clinicalProtocol";
import { TrainingCurriculum } from "../../../../utils/constants/documentTypes/trainingCurriculum";
import { GroupTag } from "../../../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../../../src/state/ducks/dashboard.new/my.feeds/types";
import { SQS_TYPES } from "../../../../../src/ui/async.tasks/types";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let initialArDocument;
let formDocumentType;
let approvalRequestDocumentType;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let allGroups;
let developersGroup;
let asyncTasksGroup;
let caGroup;
let everyoneGroup;
let createdClinicalProtocolForm;
let createdTrainingCurriculumFormDocument;
let releasedDoc1Id;
let releasedDoc2Id;

context("Training notifications", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
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
            users: [USERS[2]],
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

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API] Get group", (done: any) => {
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

    it("[API] Patch 'Developers' group", () => {
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

    it("[API] Patch 'Async Tasks' group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [
            { id: adminEmployee.id },
            { id: secondEmployee.id },
          ],
        },
      });
    });

    it("[API] Patch 'Company Admin' group", () => {
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

    it("[API] API request for updating company navigation", (done: any) => {
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
            {
              icon: "/navigation_icons/document-menu.svg",
              label: "Async Tasks",
              path: "/async_tasks",
              restrictedToUsersWithTags: [GroupTag.ASYNC_TASKS_UI],
              type: "LINK",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API] Create form to be used for training", (done: any) => {
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

    it("[API] Create Training Curriculum form", (done: any) => {
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Periodic Training",
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "training-document-to-be-trained-on",
                type: "autocomplete",
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
                tabId: "details",
              },
              {
                name: "training-refresh-training-periodically",
                type: "radiogroup",
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
                tabId: "details",
              },
              {
                name: "training-validity",
                type: "quantity",
                index: 3,
                label: "Training Frequency (in days)",
                rules: "required_if:training-refresh-training-periodically,Yes",
                validators: {
                  // eslint-disable-next-line @typescript-eslint/camelcase
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
                tabId: "details",
              },
              {
                name: "training-details-section",
                type: "section",
                index: 4,
                label: "Trainees Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Trainees Details",
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "training-select-groups-to-train",
                type: "autocomplete",
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
                tabId: "details",
              },
              {
                name: "training-select-users-to-train",
                type: "autocomplete",
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
                tabId: "details",
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

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create documents", () => {
    it("Create doc1", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => { releasedDoc1Id = x.text(); });
    });

    it("Create doc2", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc2" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => { releasedDoc2Id = x.text(); });
    });
  });

  context("Create Training Curriculum", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test");
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
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
    });

    it("Select document 'released doc2' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc2");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("40");
    });

    it("Select User 2 to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[2].name}`);
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.pmSubmitForApprovalInThreeDotsWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training record count and existing", () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get("tr.k-master-row").should("have.length", 2);
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Verify training notifications for both documents", () => {
      SystemRequirement("REQ-2470");
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc2Id}Rev 1 released doc2` });
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create document express AR", () => {
    context("Create new document", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.wait(1000);
      });

      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Document title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "New Document Revision description" });
      });

      it("Selects document type", () => {
        cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
      });

      it("Select document revision as Numeric", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Clicks on 'Create Document' button", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click Express AR", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm({
          approverName: USERS[2].name,
        });
      });
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Regular AR notification should be first in the list", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00005");
    });
  });

  context("Do Time Travel", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 23 days to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 23 });
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
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 5 }, () => {
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Here should be two training notifications at the top", { retries: 5 }, () => {
      cy.wait(20000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc2")
        .and("contain.text", "DUE IN 7 DAYS");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc1")
        .and("contain.text", "DUE IN 7 DAYS");
    });
  });

  context("Complete training for Doc1", () => {
    it("Go to training record", () => {
      cy.contains("released doc1").arrowClick();
      cy.progressBarShouldNotExist();
    });

    it("Complete training", () => {
      cy.trCompleteTraining();
      cy.progressBarShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Notification for Doc 1 should disappear", () => {
      cy.contains("released doc1").should("not.exist");
    });

    it("Notification for Doc 2 should remain as is", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc2")
        .and("contain.text", "DUE IN 7 DAYS");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("My Feed should contain completed training notification for doc1", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc1")
        .and("contain.text", "COMPLETED");
    });
  });

  context("Create another notification to push down the training ones", () => {
    context("Create document express AR", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.wait(1000);
      });

      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Document title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "New Document Revision description" });
      });

      it("Selects document type", () => {
        cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
      });

      it("Select document revision as Numeric", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Clicks on 'Create Document' button", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click Express AR", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Verify tabs content", () => {
      it("Goto Dashboard", () => {
        cy.navigToDashboardWithoutApi();
      });

      it("Notification for Doc 2 should be first as it was", () => {
        cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
          .should("contain.text", "released doc2")
          .and("contain.text", "DUE IN 7 DAYS");
      });
    });
  });

  context("Do Time Travel", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 8 days to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 8 });
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
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 5 }, () => {
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Notification for Doc 2 should be OVERDUE on top", { retries: 5 }, () => {
      SystemRequirement("REQ-2480");
      cy.wait(20000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc2")
        .and("contain.text", "OVERDUE");
    });
  });

  context("Complete training for Doc2", () => {
    it("Go to training record", () => {
      cy.contains("released doc2").arrowClick();
      cy.progressBarShouldNotExist();
    });

    it("Complete training", () => {
      cy.trCompleteTraining();
      cy.progressBarShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Notification for Doc 2 should disappear", () => {
      cy.contains("released doc2").should("not.exist");
    });

    it("There should be no training notification left", () => {
      cy.contains("Your training").should("not.exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("My Feed should contain completed training notification for doc2", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc2")
        .and("contain.text", "COMPLETED");
    });
  });

  context("Do Time Travel", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 33 days to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 33 });
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
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 5 }, () => {
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("New training notification should appear for Doc 1 on the To Do tab", { retries: 5 }, () => {
      cy.wait(20000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "released doc1A training is assigned to you");
    });
  });
});

export { };
