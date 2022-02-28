// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

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
let releasedDoc1Id;

context("Add/Remove users from Training Curriculum", () => {
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
            users: [USERS[2], USERS[3], USERS[4], USERS[7]],
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

  context("Create one document", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc1" });
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
      cy.get("#HeaderInfo-docId").then((x) => { releasedDoc1Id = x.text(); });
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
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks, CyRoutes.GetRequiredApprovers, CyRoutes.GetDocRevs], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .arrowType("Training Curriculum test{downarrow}{enter}");
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

    it("Click Refresh on 'Document to trained on'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("[name=training-document-to-be-trained-on]").find("button").eq(2).arrowClick({ force: true });
      });
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowType("released doc1{downarrow}{enter}");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("5");
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[1].name}{downarrow}{enter}`);
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[2].name}{downarrow}{enter}`);
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[3].name}{downarrow}{enter}`);
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[4].name}{downarrow}{enter}`);
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Complete trainings", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Open and complete training for ${USERS[1].name}`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Open and complete training for ${USERS[2].name}`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Revise training", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select training", () => {
      cy.trSelectFirstDocument();
    });

    it("Click on 'Revise Document'", () => {
      cy.get("#PreviewControlsContainer-revise").arrowClick();
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRev, CyRoutes.GetDocRevs, CyRoutes.DocPreview, CyRoutes.DocRevPreview,
        CyRoutes.GetRequiredApprovers, CyRoutes.GetFieldLocks, CyRoutes.EmployeesGet], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
    });

    it("Add new User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[7].name}{downarrow}{enter}`);
    });

    it(`Remove users ${USERS[1].name} and ${USERS[3].name}`, () => {
      cy.get("[data-cy=training-select-users-to-train]").parent()
        .find(".MuiAutocomplete-tag").eq(0).find(".MuiChip-deleteIcon").arrowClick();
      cy.get("[data-cy=training-select-users-to-train]").parent()
        .find(".MuiAutocomplete-tag").eq(1).find(".MuiChip-deleteIcon").arrowClick();
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit, CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Verify Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.documentControl\"]").arrowClick();
      cy.get("[data-cy=\"navigation.training\"]").should("be.exist");
      cy.get("[data-cy=\"navigation.trainingRecords\"]").arrowClick({ force: true });
    });

    it("clear filers", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetTrainingRecord, () => {
        cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      });
    });

    it(`Training record for ${USERS[1].name} should be present`, () => {
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[1].name).and("not.contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });

    it("Select training record", () => {
      cy.trSelectFirstDocument();
    });

    it("Check if 'I completed training on' message is displayed", () => {
      cy.get("[role='dialog']").should("contain.text", "I completed training on");
    });

    it("Check if 'FM-00003 Rev 1' revision is displayed", () => {
      cy.get("[role='dialog']").then(($el) => {
        const text = $el.text();
        expect(text.replace(/\u00a0/g, " ")).to.contain("FM-00003  Rev  1");
      });
    });

    it("Check if trainee name is correct", () => {
      cy.get("[role='dialog']").should("contain.text", USERS[1].name);
    });

    it("Check if 'Send To Email' button is displayed", () => {
      cy.get("button>span").should("contain.text", "Send To Email");
      cy.get("[role='dialog']>button").arrowClick();
    });

    it(`Training record for ${USERS[3].name} should not be present`, () => {
      cy.trLandingPageUsername({ username: USERS[3].name });
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.get(`[class="k-grid-norecords"]`).should("have.text", "No results found");
    });

    it(`Training record for ${USERS[2].name} should be present`, () => {
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[2].name).and("not.contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });

    it("Select training record", () => {
      cy.trSelectFirstDocument();
    });

    it("Check if 'I completed training on' message is displayed", () => {
      cy.get("[role='dialog']").should("contain.text", "I completed training on");
    });

    it("Check if 'FM-00003 Rev 1' revision is displayed", () => {
      cy.get("[role='dialog']").then(($el) => {
        const text = $el.text();
        expect(text.replace(/\u00a0/g, " ")).to.contain("FM-00003  Rev  1");
      });
    });

    it("Check if trainee name is correct", () => {
      cy.get("[role='dialog']").should("contain.text", USERS[2].name);
    });

    it("Check if 'Send To Email' button is displayed", () => {
      cy.get("button>span").should("contain.text", "Send To Email");
      cy.get("[role='dialog']>button").arrowClick();
    });

    it(`Training record for ${USERS[4].name} should be present`, () => {
      cy.trLandingPageUsername({ username: USERS[4].name });
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[4].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });

    it("Select training record", () => {
      cy.trSelectFirstDocument();
    });

    it("Check if 'I completed training on' message is displayed", () => {
      cy.get("[role='dialog']").should("contain.text", "I completed training on");
    });

    it("Check if 'FM-00003 Rev 1' revision is displayed", () => {
      cy.get("[role='dialog']").then(($el) => {
        const text = $el.text();
        expect(text.replace(/\u00a0/g, " ")).to.contain("FM-00003  Rev  1");
      });
    });

    it("Check if trainee name is correct", () => {
      cy.get("[role='dialog']").should("contain.text", USERS[4].name);
    });

    it("Check if 'Send To Email' button is displayed", () => {
      cy.get("button>span").should("contain.text", "Send To Email");
      cy.get("[role='dialog']>button").arrowClick();
    });

    it(`Training record for ${USERS[7].name} should be present`, () => {
      cy.trLandingPageUsername({ username: USERS[7].name });
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[7].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });

    it("Select training record", () => {
      cy.trSelectFirstDocument();
    });

    it("Check if 'I completed training on' message is displayed", () => {
      cy.get("[role='dialog']").should("contain.text", "I completed training on");
    });

    it("Check if 'FM-00003 Rev 1' revision is displayed", () => {
      cy.get("[role='dialog']").then(($el) => {
        const text = $el.text();
        expect(text.replace(/\u00a0/g, " ")).to.contain("FM-00003  Rev  1");
      });
    });

    it("Check if trainee name is correct", () => {
      cy.get("[role='dialog']").should("contain.text", USERS[7].name);
    });

    it("Check if 'Send To Email' button is displayed", () => {
      cy.get("button>span").should("contain.text", "Send To Email");
      cy.get("[role='dialog']>button").arrowClick();
    });
  });

  context("Verify training notifications", () => {
    context(`Verify training notification for ${USERS[3].name}`, () => {
      it("Logs user in", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[3].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Verify training notification should not present", () => {
        cy.dashVerifyNoPendingActions();
      });
    });

    context(`Verify training notification for ${USERS[7].name}`, () => {
      it("Logs user in", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[7].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Verify training notification should be present", () => {
        cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      });
    });
  });
});
