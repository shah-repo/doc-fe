// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { ClinicalProtocolDocType } from "../../../../utils/constants/documentTypes/clinicalProtocol";
import { RecordDocumentType } from "../../../../utils/constants/documentTypes/testTypes";
import { PurchaseOrderTest } from "../../../../utils/constants/documentTypes/purchaseOrder";
import { STATUS_TYPES_LABEL } from "../../../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../../../fixtures/default_po_schema";
import { TrainingCurriculum } from "../../../../utils/constants/documentTypes/trainingCurriculum";
import { GroupTag } from "../../../../../src/state/ducks/auth/types";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { cmpFilterDocumentTypeIdByName } from "../../../../support/commands/company/commands";

let createdCompany;
let loginResponse;
let group;
let adminEmployee;
let initialArDocument;
let createdPurchaseOrderFormDocument;
let purchaseOrderDocumentType;
let supplierDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let secondEmployee;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let allGroups;
let developersGroup;
let asyncTasksGroup;
let caGroup;
let everyoneGroup;
let createdClinicalProtocolForm;
let createdTrainingCurriculumFormDocument;
let recordUrl;
let recordId;
let inlineRecordId;
let inlineRecordUrl;
let doc1ArUrl;
let doc1ArId;
let doc2ArUrl;
let doc2ArId;
let poUrl;
let poId;
let doc3Url;
const doc3Title = "Doc 3 Title";

context("Dismiss notifications", () => {
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
              ClinicalProtocolDocType,
              RecordDocumentType,
              PurchaseOrderTest,
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
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          done();
        });
      });
    });
  });

  context("[API] Create documents", () => {
    it("[API] Login as User 1", (done: any) => {
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
          employees: [
            { id: adminEmployee.id },
            { id: secondEmployee.id },
          ],
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

    it("[API] Creates supplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Supplier Document</p>",
            document: {
              docId: "SUP-00003",
              documentType: {
                id: supplierDocumentType[0].id,
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
            name: "API supplier",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API] Create PO record form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Purchase order form record</p>",
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
            name: "Purchase Order form",
            renderHTML: "<html><body><h1>Purchase order</h1></body></html>",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: purchaseOrderDocumentType[0].id,
              }],
              schema: purchaseOrderDefaultSchema,
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPurchaseOrderFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPurchaseOrderFormDocument.id,
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

  context("Create Doc 1", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.wait(1000);
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: "Doc 1" });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Checks if document type id is 'CP-00002'", () => {
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00002" });
    });

    it("Select document revision as Numeric", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Clicks on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Express AR", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({
        approverName: USERS[2].name,
      });
      cy.wait(1000);
      cy.get("#ChangeRequestLink-linkButton").then(($el) => {
        doc1ArId = $el.text();
        doc1ArUrl = $el.attr("href");
      });
    });
  });

  context("Create Doc 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.wait(1000);
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: "Doc 2" });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Checks if document type id is 'CP-00006'", () => {
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00006" });
    });

    it("Select document revision as Numeric", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Clicks on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "AR Title" });
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "AR Description" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add document", () => {
      cy.drSelectItemsTab();
      cy.arClickAddItem();
      cy.arChoseSpecificProposedDocument({ name: "CP-00006" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickSaveItem();
      cy.arItemsLoaderShouldNotExist();
    });

    it("Add User 1 as approver", () => {
      cy.drSelectApprovalsTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[1].email });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Add User 2 as approver'", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click Send To Review", () => {
      cy.url().then((url) => (doc2ArUrl = url));
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => { doc2ArId = x.text(); });
      cy.arClickSendToReviewNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create form document for Record", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Record Form" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify approvals field is automatically added", () => {
          cy.get("[data-cy='form.builder.approvals']").should("exist");
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });
      });
    });
  });

  context("Create new Record", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: "Record Title" });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
    });

    it("Add approvers", () => {
      cy.contains("Approvals").should("exist");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");

      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
    });

    it("Save Record", () => {
      cy.url().then((url) => (recordUrl = url));
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => { recordId = x.text(); });
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.recSubmitForApprovalWithoutAPI();
    });
  });

  context("Create form document for Record with Inline Approvers", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Record Form Inline" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Open details tab", () => {
          cy.drSelectDetailsTab();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add Inline Approval", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
          cy.listLoadingElementShouldNotExist();
          cy.fbEnterNameValue({ name: "label", value: "Inline Approval" });
          cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
          cy.fbAddNewFieldButton();
        });

        it("Save the form", () => {
          cy.drClickCreateDocumentWithoutApiCallForForms();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(3000);
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(3000);
        });
      });
    });
  });

  context("Create new Record with Inline Approver", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: "Record Title Inline" });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select approver", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").autocompleteSelect(`${USERS[2].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Save Record", () => {
      cy.url().then((url) => (inlineRecordUrl = url));
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Send request for approval", () => {
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => { inlineRecordId = x.text(); });
      cy.get("[data-cy='form.builder.request.approval']").arrowClick();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Purchase Order", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Fill form fields", () => {
      it("Enter description 'New Purchase Order'", () => {
        cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Open' for PO status", () => {
        cy.poSelectPOStatus({ status: "Open" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Select User 1 as Requestor`, () => {
        cy.get("[data-cy^=po-requestor]").arrowClick();
        cy.get("[data-cy^=po-requestor]").autocompleteSelect(USERS[1].name);
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Select 'Quality' for Department`, () => {
        cy.get("div[id*=department]").arrowClick();
        cy.get("ul>li[role=option]").contains("Quality").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'SUP-00003' Supplier ", () => {
        cy.get("[data-cy='po-supplier-built-in']").arrowClick();
        cy.get("[data-cy='po-supplier-built-in']").autocompleteSelect("SUP-00003");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Third party Company' for Ship To", () => {
        cy.get("[name^='ship-to']").eq(1).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Third party Company Address", () => {
        cy.get("input[data-cy^=third-party-company]").arrowClick();
        cy.get("input[data-cy^=third-party-company]").autocompleteSelect("API supplier");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'FedEx 449260805' for Shipping Information", () => {
        cy.get(`[data-cy="Shipping Information"]`).scrollIntoView();
        cy.get("div[id*=select-shipping]").arrowClick();
        cy.get("ul>li[role=option]").contains("FedEx").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Credit Card' for Terms", () => {
        cy.get("div[id*=terms]").arrowClick();
        cy.get("ul>li[role=option]").contains("Credit Card").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter '1' for Quotation Number", () => {
        cy.get("input[name^=quotation-number]").arrowType("1");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Order Date", () => {
        cy.get("input[name^=ordered]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-day[tabindex='0']").last().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Save PO", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Add purchase order item", () => {
      it("Open line items tab", () => {
        cy.drSelectLineItems();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Upload attachments", () => {
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
        cy.progressBarShouldNotExist();
        cy.wait(2000);
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.wait(2000);
      });

      it("Click on 'Add item' button to add item without Part Number", () => {
        cy.get(`button[data-cy="fb-control-btn"]`).eq(0).arrowClick({ multiple: true, force: true }).wait(1000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Quantity Ordered", () => {
        cy.poEnterQuantityOrdered({ quantity: "10" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Units", () => {
        cy.poSelectUnits();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Supplier Part Number", () => {
        cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter number of Units", () => {
        cy.poNumberOfUnits({ number: "2" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Required Date", () => {
        cy.get("input[name^=date]").parent().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check Tax box", () => {
        cy.poSelectTaxCheckbox();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save PO", () => {
        cy.poSaveDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Finish PO", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter 'Nothing to comment' inside PO dialog box", () => {
        cy.get("div[style='width: 100%; height: 100%;']").arrowClick();
        cy.get("div[contenteditable=true]").eq(1).arrowType("Nothing to comment");
        cy.get("[data-cy=Comments]").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
      });

      it("Enter 'contact.us@gmail.com' inside Contact Email", () => {
        cy.get("[name^=contact-email]").arrowType("contact.us@gmail.com");
        cy.unClick();
        cy.progressBarShouldNotExist();
      });

      it("Add User 1 as Approval", () => {
        cy.get("[data-cy^='fb-po-approvals-']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add User 2 as Approval", () => {
        cy.get("[data-cy^='fb-po-approvals-']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save PO", () => {
        cy.url().then((url) => (poUrl = url));
        cy.get("[data-cy='HeaderInfo-docId']").then((x) => { poId = x.text(); });
        cy.poSaveDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.poAMCheckForApprovalWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Create TC", () => {
    it("Create Doc 3", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: doc3Title });
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
      cy.url().then((url) => (doc3Url = url));
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

      it("Select Doc 3 to be trained on", () => {
        cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect(doc3Title);
      });

      it("Select refresh training periodically 'Yes'", () => {
        cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      });

      it("Enter training refresh period days", () => {
        cy.get("[name=training-validity]").arrowType("60");
      });

      it("Select User 1 to train", () => {
        cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
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
        cy.poAMCheckForApprovalWithoutApi();
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
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it(`User should see Training for Doc 3`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `Rev 1 ${doc3Title}A training is assigned to you`,
      });
    });

    it(`User should see PO for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${poId}`,
      });
    });

    it(`User should see Record for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${recordId}`,
      });
    });

    it(`User should see Doc 2 for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${doc2ArId}`,
      });
    });
  });

  context("Dismiss notifications", () => {
    it("Dismiss item 1", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 2", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 3", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 4", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("'To Do' tab should be empty", () => {
      SystemRequirement("REQ-5330");
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Verify that user can still approve or train the documents", () => {
    context("Verify Doc 2 AR document", () => {
      it("Open Document", () => {
        cy.visit(doc2ArUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='transition-approve']").should("exist");
      });
    });

    context("Verify Record document", () => {
      it("Open Document", () => {
        cy.visit(recordUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='fb-control-btn']").contains("Approve").should("exist");
      });
    });

    context("Verify PO document", () => {
      it("Open Document", () => {
        cy.visit(poUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='approval-block-common.pending']").arrowClick();
        cy.get("[data-cy='fb-control-btn']").contains("Approve").should("exist");
      });
    });

    context("Verify training document", () => {
      it("Open Document", () => {
        cy.visit(doc3Url);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("button[data-cy=training-complete]").should("exist");
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
    it(`User should see Doc 1 for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${doc1ArId}`,
      });
    });

    it(`User should see Doc 2 for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${doc2ArId}`,
      });
    });

    it(`User should see Record for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${recordId}`,
      });
    });

    it(`User should see Record with inline approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${inlineRecordId}`,
      });
    });

    it(`User should see PO for approval`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${USERS[1].name}needs your approval for${poId}`,
      });
    });

    it(`User should see Training for Doc 3`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `Rev 1 ${doc3Title}A training is assigned to you`,
      });
    });
  });

  context("Dismiss notifications", () => {
    it("Dismiss item 1", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 2", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 3", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 4", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 5", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("Dismiss item 6", () => {
      cy.dashDismissFirstItem();
      cy.wait(1000);
    });

    it("'To Do' tab should be empty", () => {
      SystemRequirement("REQ-5330");
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Verify that user can still approve or train the documents", () => {
    context("Verify Doc 1", () => {
      it("Open Document", () => {
        cy.visit(doc1ArUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='transition-approve']").should("exist");
      });
    });

    context("Verify Doc 2", () => {
      it("Open Document", () => {
        cy.visit(doc2ArUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='transition-approve']").should("exist");
      });
    });

    context("Verify Record document", () => {
      it("Open Document", () => {
        cy.visit(recordUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='fb-control-btn']").contains("Approve").should("exist");
      });
    });

    context("Verify inline Record document", () => {
      it("Open Document", () => {
        cy.visit(inlineRecordUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='fb-control-btn']").contains("Approve").should("exist");
      });
    });

    context("Verify PO document", () => {
      it("Open Document", () => {
        cy.visit(poUrl);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("[data-cy='approval-block-common.pending']").arrowClick();
        cy.get("[data-cy='fb-control-btn']").contains("Approve").should("exist");
      });
    });

    context("Verify training document", () => {
      it("Open Document", () => {
        cy.visit(doc3Url);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Document can be approved", () => {
        cy.get("button[data-cy=training-complete]").should("exist");
      });
    });
  });
});

export { };
