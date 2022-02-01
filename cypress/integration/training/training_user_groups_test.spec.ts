// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
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

context("Training user groups test", () => {
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

    it("[API]Login first tester", (done: any) => {
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

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'One-Time Training test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.unClick();
    });

    it("Check if 'One-Time Training test' has all predefined fields", () => {
      cy.get("[data-cy=\"Forced Retraining / One-Time Training\"]")
        .should("contain.text", "Forced Retraining / One-Time Training");
      cy.get("[data-cy=\"Documents to Train on\"]").should("contain.text", "Documents to Train on");
      cy.get("[data-cy=\"Force retraining (everyone will be retrained regardless of their current status)\"]")
        .should("contain.text", "Force retraining (everyone will be retrained regardless of their current status)");
      cy.get("[data-cy=\"Trainees Details\"]")
        .should("contain.text", "Trainees Details");
      cy.get("[data-cy=\"Groups to Train\"]")
        .should("contain.text", "Groups to Train");
      cy.get("[data-cy=\"Users to Train (if applicable)\"]")
        .should("contain.text", "Users to Train (if applicable)");
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
      cy.get("[id='formTemplate.outputDocumentTypes']>div>div>div>div:nth-child(2)").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum test" });
      cy.unClick();
    });

    it("Check if 'Training Curriculum test' has all predefined fields", () => {
      cy.get("[data-cy=\"Periodic Training\"]").should("contain.text", "Periodic Training");
      cy.get("[data-cy=\"Documents to Train on\"]").should("contain.text", "Documents to Train on");
      cy.get("[data-cy=\"Refresh/repeat training periodically?\"]")
        .should("contain.text", "Refresh/repeat training periodically?");
      cy.get("[data-cy=\"Training Frequency (in days)\"]")
        .should("contain.text", "Training Frequency (in days)");
      cy.get("[data-cy=\"Trainees Details\"]")
        .should("contain.text", "Trainees Details");
      cy.get("[data-cy=\"Groups to Train\"]")
        .should("contain.text", "Groups to Train");
      cy.get("[data-cy=\"Users to Train (if applicable)\"]")
        .should("contain.text", "Users to Train (if applicable)");
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Create form doc with different statuses", () => {
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

    it("Form with Superseded status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "revised form with superseded version" });
      cy.drEnterDocumentDescription({ description: "revised form description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: "Released" });
      cy.get("[id='PreviewControlsContainer-revise']").arrowClick();
      cy.wait(2000);
      cy.get("[id='Title-field']>div>div:nth-child(2)").arrowClick();
      cy.get("[id=\"Title-field\"]").arrowType("revised form with new released revision");
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'Test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "Test training form title" });
    });

    it("Enter document description 'Test training description'", () => {
      cy.drEnterDocumentDescription({ description: "Test training description" });
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

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.reload();
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

    it("Enter training title 'Training title'", () => {
      cy.drEnterDocumentTitle({ name: "Test training title" });
    });

    it("Enter description 'Training description'", () => {
      cy.drEnterDocumentDescription({ description: "Training description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Verify training options document types", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowClick();
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "AR Form");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "released form");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "revised form with new released revision");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "revised form with superseded version");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowType("released form{downarrow}{enter}");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("5");
    });

    it("Select Groups to train 'Developers'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").arrowType("Developers{downarrow}{enter}");
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[1].name}{downarrow}{enter}`);
        });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Verify trainings present on Training Curriculum page", () => {
    it("'Test training title' should be present", () => {
      cy.navigToTrainingCurriculums();
      cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType("Test training title");
      cy.get(`[data-grid-row-index="0"]`).should("contain", "Test training title");
    });
  });

  context("Check training notifications", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Verify training notification ${releasedFormId}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedFormId}released form` });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });


  context("Login third tester", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify there is no notification on dashboard for training", () => {
    it("Check dashboard for training notification", () => {
      cy.dashVerifyNoPendingActions();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });


  context("Login second tester", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
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

  context("Open and complete Training", () => {
    it(`Open assigned Training`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedFormId}released form Rev 1` });
    });

    it("Complete Training", () => {
      cy.trCompleteTraining();
    });
  });

  context("Verify Training Records with timestamp on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[2].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
    });
  });
});

export { };
