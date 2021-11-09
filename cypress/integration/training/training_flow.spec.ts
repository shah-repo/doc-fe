// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let releasedFormId;
let forceTrainingRecordId;
let approvedFormId;

context("Training Flow test", () => {
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
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Training Curriculum test",
                documentTypeAcronym: "TC-",
                group: "TRAINING_CURRICULUM",
                privateNumberPool: true,
                canRedLine: false,
                isQms: true,
                needsSignature: true,
                defaultTraining: false,
                startingNumber: 1,
                hiddenForCreationForUsersWithoutTags: [],
                fieldsConfig: {
                  E: {
                    visible: false,
                    required: true,
                  },
                  G: {
                    label: "Training Required",
                    visible: false,
                  },
                  N: {
                    label: "Finalize and Release",
                    visible: false,
                  },
                },
                defaultRevStage: "Alpha",
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
                    omitFinalValidation: true,
                    validationAttribute: "Periodic Training",
                    applicableValidationSchema: true,
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
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    placeholder: "Select documents for training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
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
                    rules: "required||",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                    ],
                    validators: {
                      required: true,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if: false,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    rulesObject: {},
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Refresh/repeat training periodically?",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-validity",
                    rows: 1,
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
                    placeholder: "Enter the training refresh period in days",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "visibility",
                    validationAttribute: "Training Frequency (in days)",
                    applicableValidationSchema: true,
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
                    omitFinalValidation: true,
                    validationAttribute: "Trainees Details",
                    applicableValidationSchema: true,
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
                    deleteDisabled: false,
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Users to Train (if applicable)",
                    applicableValidationSchema: true,
                  },
                ],
                category: "Training Curriculums",
                active: true,
              },
              {
                documentTypeName: "One-Time Training test",
                documentTypeAcronym: "TF-",
                group: "TRAINING_CURRICULUM",
                privateNumberPool: true,
                canRedLine: false,
                isQms: true,
                needsSignature: true,
                defaultTraining: false,
                startingNumber: 1,
                hiddenForCreationForUsersWithoutTags: [],
                fieldsConfig: {
                  E: {
                    visible: false,
                    required: true,
                  },
                  G: {
                    label: "Training Required",
                    visible: false,
                  },
                  N: {
                    label: "Finalize and Release",
                    visible: false,
                  },
                },
                defaultRevStage: "Alpha",
                schema: [
                  {
                    name: "training-curriculum-details-section",
                    type: "section",
                    index: 0,
                    label: "Forced Retraining / One-Time Training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Forced Retraining / One-Time Training",
                    applicableValidationSchema: true,
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
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    placeholder: "Select documents for training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "visibility",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Documents to Train on",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-force-retraining-for-everyone",
                    type: "radiogroup",
                    index: 2,
                    label: "Force retraining (everyone will be retrained regardless of their current status)",
                    rules: "required||",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                    ],
                    validators: {
                      required: true,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if: false,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    rulesObject: {},
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute:
                      "Force retraining (everyone will be retrained regardless of their current status)",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-details-section",
                    type: "section",
                    index: 3,
                    label: "Trainees Details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Trainees Details",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-select-groups-to-train",
                    type: "autocomplete",
                    index: 4,
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
                    index: 5,
                    label: "Users to Train (if applicable)",
                    multiple: true,
                    optionId: "13",
                    placeholder: "Select users",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Users to Train (if applicable)",
                    applicableValidationSchema: true,
                  },
                ],
                category: "Training Curriculums",
                active: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create Training Curriculum form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "test training form title" });
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "test training description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum test" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create form doc with different statuses", () => {
    it("Form with Draft status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "draft form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("Form with In Review status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "review form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
      });
      cy.drCheckDocumentStatus({ status: "In Review" });
    });

    it("Form with Pending change status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "pending change form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
      });
      cy.authLogout();
      cy.authLogin({ email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      cy.trRejectAR();
      cy.authLogout();
      cy.authLogin({ email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Form with Obsolete status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "obsolete form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drClickReviseDocument();
      cy.get("#RevisionTypeChange-obsolete").click();
      cy.recClickSaveBtn();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: "Obsolete" });
    });

    it("Form with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: "Released" });
      cy.get("#HeaderInfo-docId").then((x) => { releasedFormId = x.text(); });
    });

    it("Form with Approved status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "approved form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.get("#HeaderInfo-docId").then((x) => { approvedFormId = x.text(); });
      cy.navigToApprovalRequestList();
      cy.cmpClickCreateApprovalRequest();
      cy.arEnterApprovalRequestTitle({ title: "AR form" });
      cy.arEnterApprovalRequestDescription({ description: "Description" });
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "approved form" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "Document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "Justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
      cy.arClickCreateApprovalRequestAfterCompletingForm();
      cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
      cy.arSaveApiCall();
      cy.arClickSendToReview();
      cy.arApproveAR();
      cy.drCheckDocumentStatus({ status: "Approved" });
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
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks, CyRoutes.GetRequiredApprovers, CyRoutes.GetDocRevs], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").click({ force: true })
          .type("Training Curriculum test{downarrow}{enter}");
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

    it("Periodic training should be displayed", () => {
      cy.get("#training-curriculum-details-section").should("have.text", "Periodic Training");
    });

    it("Verify training options document types", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").click();
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "released form");
      // cy.get(".MuiAutocomplete-popper ul li").should("contain", "approved form");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", approvedFormId);
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "draft form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "review form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "pending change form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "obsolete form");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").type("released form{downarrow}{enter}");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).click();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").type("5");
    });

    it("Trainee Details should be present", () => {
      cy.get("#training-details-section").should("have.text", "Trainees Details");
    });

    it("Select Groups to train 'Developers'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").type("Developers{downarrow}{enter}");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").type(`${USERS[1].name}{downarrow}{enter}`);
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Verify training status should be 'Draft'", () => {
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").click();
    });

    it("Verify training status should be 'In Review'", () => {
      cy.drCheckDocumentStatus({ status: "In Review" });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Create One-Time Training form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training form title" });
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "One-Time training description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'One-Time Training test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("One-Time Training record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'One-Time Training test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview, CyRoutes.EmployeesGet,
        CyRoutes.GetFieldLocks, CyRoutes.GetRequiredApprovers, CyRoutes.GetDocRevs], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").click({ force: true })
          .type("One-Time Training test{downarrow}{enter}");
      });
    });

    it("Enter training title 'One-Time training title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training title" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Refresh training periodically should not exist for One-Time training", () => {
      cy.get("[name=training-refresh-training-periodically]").should("not.exist");
    });

    it("Refresh period days should not exist for One-Time training", () => {
      cy.get("[name=training-validity]").should("not.exist");
    });

    it("Forced Retraining / One-Time Training should be displayed", () => {
      cy.get("#training-curriculum-details-section").should("have.text", "Forced Retraining / One-Time Training");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").type("released form{downarrow}{enter}");
    });

    it("Select force training option 'Yes'", () => {
      cy.get("[name=training-force-retraining-for-everyone]").eq(0).click();
    });

    it("Select training group 'Developers'", () => {
      cy.get("[name=training-select-groups-to-train]").type("Developers{downarrow}{enter}");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").type(`${USERS[1].name}{downarrow}{enter}`);
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").click();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Verify trainings present on Training Curriculum page", () => {
    it("'test training title' should be present", () => {
      cy.navigToTrainingCurriculums();
      cy.get("#name").clear().type("test training title");
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(1).invoke("text")
        .should("contain", "test training title");
    });

    it("'One-Time training title' should be present", () => {
      cy.get("#name").clear().type("One-Time training title");
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(1).invoke("text")
        .should("contain", "One-Time training title");
    });
  });

  context("Check columns on Training Curriculums page", () => {
    it("Check default columns on landing page", () => {
      cy.trVerifyElementByColumnName({ el: "docId", name: "Training Curriculum ID" });
      cy.trVerifyElementByColumnName({ el: "name", name: "Title" });
      cy.trVerifyElementByColumnName({ el: "owner", name: "Owner" });
      cy.trVerifyElementByColumnName({ el: "displayStatus", name: "State" });
      cy.get("[name^=dynamicParams]").parent().parent().parent().parent().should("contain.text", "Group");
    });
  });

  context("Verify Training Records with 'Pending' on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[1].name} with Pending on 'Completed on' column should be present`, () => {
      cy.get("#docRevTitle").clear().arrowType("released form");
      cy.get("#userName").clear().arrowType(USERS[1].name);
      cy.get("#docId").clear().arrowType(releasedFormId);
      cy.get(".ReactVirtualized__Grid__innerScrollContainer").invoke("text")
        .should("contain", releasedFormId).and("contain", USERS[1].name).and("contain", "Pending");
    });

    it(`${USERS[2].name} with Pending on 'Completed on' column should be present`, () => {
      cy.get("#docRevTitle").clear().arrowType("released form");
      cy.get("#userName").clear().arrowType(USERS[2].name);
      cy.get("#docId").clear().arrowType(releasedFormId);
      cy.get(".ReactVirtualized__Grid__innerScrollContainer").invoke("text")
        .should("contain", releasedFormId).and("contain", USERS[2].name).and("contain", "Pending");
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").click();
    });

    it("Verify training notification", () => {
      cy.contains(`TRAINING: ${releasedFormId} - Rev 1 released form`).should("exist");
    });
  });

  context("Open and complete Training", () => {
    it("Open assigned Training", () => {
      cy.contains(`TRAINING: ${releasedFormId}`).parent().parent().parent()
        .find(".MuiButton-containedSecondary").then(($el) => {
          const link = $el.attr("href");
          cy.visit(CONFIG.FE_URL + link);
        });
    });

    it("Verify expiry of 365 days and due of 30 days", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            const dueOn = new Date(response.trainingRecords[0].dueOn);
            const todayDate = new Date();
            const diff = Math.ceil((dueOn - todayDate) / (1000 * 60 * 60 * 24));
            expect(response.trainingRecords[0].trainingPlan.validity).to.equal(365);
            expect(diff).to.equal(30);
          }
        });
      }).as("response");
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });
  });

  context("Verify Training Records with timestamp on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.training\"]").click();
      cy.get("[data-cy=\"navigation.trainingRecords\"]").click();
    });

    it(`${USERS[1].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.get("#docRevTitle").clear().arrowType("released form");
      cy.get("#userName").clear().arrowType(USERS[1].name);
      cy.get("#docId").clear().arrowType(releasedFormId);
      cy.get(".ReactVirtualized__Grid__innerScrollContainer").invoke("text")
        .should("contain", releasedFormId).and("contain", USERS[1].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(7).invoke("text")
        .should("contain", completedDate);
    });
  });

  context("Forced Training", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'One-Time Training test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview, CyRoutes.EmployeesGet,
        CyRoutes.GetFieldLocks, CyRoutes.GetRequiredApprovers, CyRoutes.GetDocRevs], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").click({ force: true })
          .type("One-Time Training test{downarrow}{enter}");
      });
    });

    it("Enter training title 'One-Time training title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training title1" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").type("released form{downarrow}{enter}");
    });

    it("Select force training option 'Yes'", () => {
      cy.get("[name=training-force-retraining-for-everyone]").eq(0).click();
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").type(`${USERS[1].name}{downarrow}{enter}`);
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").click();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("'One-Time training title1' should be present", () => {
      cy.get("#name").clear().type("One-Time training title1");
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(1).invoke("text")
        .should("contain", "One-Time training title1");
    });

    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").click();
    });

    it("Verify training notification", () => {
      cy.contains(`TRAINING: ${releasedFormId} - Rev 1 released form`).should("exist");
    });

    it("Open assigned Training", () => {
      cy.contains(`TRAINING: ${releasedFormId}`).parent().parent().parent()
        .find(".MuiButton-containedSecondary").then(($el) => {
          const link = $el.attr("href");
          cy.visit(CONFIG.FE_URL + link);
        });
    });

    it("Get training Id", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            forceTrainingRecordId = res.body.trainingRecords[0].trId;
          }
        });
      }).as("response");
      cy.wait("@response");
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });

    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.training\"]").click();
      cy.get("[data-cy=\"navigation.trainingRecords\"]").click();
    });

    it(`${USERS[1].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.get("#docRevTitle").clear().arrowType("released form");
      cy.get("#userName").clear().arrowType(USERS[1].name);
      cy.get("#docId").clear().arrowType(releasedFormId);
      cy.get(".ReactVirtualized__Grid__innerScrollContainer").invoke("text")
        .should("contain", releasedFormId).and("contain", USERS[1].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(7).invoke("text")
        .should("contain", completedDate);
      cy.get(".ReactVirtualized__Table__row .ReactVirtualized__Table__rowColumn").eq(0).invoke("text")
        .should("contain", forceTrainingRecordId);
    });
  });
});
