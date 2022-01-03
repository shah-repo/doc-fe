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

context("Repeat Training with Training Curriculum", () => {
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
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowType("AR Form{downarrow}{enter}");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("1");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[1].name}{downarrow}{enter}`);
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[2].name}{downarrow}{enter}`);
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notifications", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify training notification", () => {
      cy.contains(`TRAINING: FM-00001 - Rev 1 AR Form`).should("exist");
    });
  });

  context("Complete Training and verify expire on field", () => {
    it("Open assigned Training", () => {
      cy.contains(`TRAINING: FM-00001`).parent().parent().parent()
        .find(".MuiButton-containedSecondary").then(($el) => {
          const link = $el.attr("href");
          cy.visit(CONFIG.FE_URL + link);
        });
    });

    it("Click complete training button", () => {
      cy.trCompleteTraining();
    });

    it("Verify expire on is 1 day", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            const expireOn = new Date(response.trainingRecords[0].expireOn);
            const todayDate = new Date();
            const diff = Math.ceil((expireOn - todayDate) / (1000 * 60 * 60 * 24));
            expect(diff).to.equal(1);
          }
        });
      }).as("response");
      cy.reload();
      cy.wait("@response");
    });
  });

  context("Log in as second user and check training is pending", () => {
    it("Logout user", () => {
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

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[2].name} with Pending on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.get(".ReactVirtualized__Grid__innerScrollContainer").invoke("text")
        .should("contain", USERS[2].name).and("contain", "Pending");
    });
  });
});

export { };
