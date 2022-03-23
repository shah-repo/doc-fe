/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
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
let createdTrainingCurriculumRecord;
let clinicalProtocolDocumentType;
let createdClinicalProtocolForm;
let developersGroup;
let createdClinicalProtocolForm2;
const assignDate = moment().tz("America/Los_Angeles").format("l");
const dueDate = moment().tz("America/Los_Angeles").add(1, "month").subtract(1, "days").format("l");

context("Test training records and training curriculum landing page", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/*/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(200);
      });
    });
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
                documentTypeName: "Training Curriculum Test",
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
                      required_if: false,
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
                    type: "quantity",
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
              name: "Form document for training",
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

    it("[API]Create form2 to be used for training", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Form to be used for training</p>",
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
                  id: everyoneGroup.body[0].id,
                },
              ],
            },
          },
          name: "Form2 document for training",
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
        createdClinicalProtocolForm2 = response;
        cy.drAPIApproveAndRelease({
          documentId: createdClinicalProtocolForm2.id,
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

    it("[API]Create Training Curriculum record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Training Curriculum record</p>",
          document: {
            docId: "TCT-00001",
            documentType: {
              id: trainingCurriculumDocumentType[0].id,
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
          name: "ATraining Curriculum test record",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 3,
          formDocument: {
            id: createdTrainingCurriculumFormDocument.id,
          },
          formInput: {
            "training-document-to-be-trained-on": [
              createdClinicalProtocolForm.documentId,
            ],
            "training-refresh-training-periodically": "Yes",
            "training-validity": 5,
            "training-select-groups-to-train": [
              developersGroup.body[0].id,
            ],
            "training-select-users-to-train": [
              adminEmployee.id,
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdTrainingCurriculumRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdTrainingCurriculumRecord.id,
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

    it("[API]Create Training Curriculum record 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Training Curriculum record 2</p>",
          document: {
            docId: "TCT-00002",
            documentType: {
              id: trainingCurriculumDocumentType[0].id,
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
          name: "BTraining Curriculum test record2",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 3,
          formDocument: {
            id: createdTrainingCurriculumFormDocument.id,
          },
          formInput: {
            "training-document-to-be-trained-on": [
              createdClinicalProtocolForm2.documentId,
            ],
            "training-refresh-training-periodically": "Yes",
            "training-validity": 5,
            "training-select-groups-to-train": [
              everyoneGroup.body[0].id,
            ],
            "training-select-users-to-train": [
              adminEmployee.id,
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdTrainingCurriculumRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdTrainingCurriculumRecord.id,
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

  context("Verify Training Records landing page", () => {
    it("Navigate to training records landing page", () => {
      cy.navigToTrainingRecords();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", "TRN ID");
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", "Doc ID");
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", "Revision");
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "Document Title");
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", "Trainee");
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", "Assign Date");
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", "Due Date");
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", "Completed On");
      cy.get(`th[role="columnheader"]`).eq(8).should("have.text", "TC ID");
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });

    it(`Verify drag and drop TRN ID header on second slot`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "TRN-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "FM-");
    });

    it(`Column grouping should be displayed`, () => {
      cy.get(`th[aria-colindex="5"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
      cy.unClick();
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="5"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("have.length", "4");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("not.exist");
    });

    it(`Verify training record could be open`, () => {
      cy.get("div[role=dialog]").should("not.exist");
      cy.trSelectFirstDocument();
      cy.get("div[role=dialog]").should("exist");
      cy.get("div[role=dialog] button").eq(0).arrowClick();
      cy.get("div[role=dialog]").should("not.exist");
    });

    it(`Verify training record count`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 6 });
      cy.get("tr.k-master-row").should("have.length", 6);
    });

    it("Verify arrow for Doc ID", () => {
      cy.get(`td[data-grid-col-index="0"]`).should("have.text", "FM-00004FM-00004FM-00004FM-00004FM-00003FM-00003");
      cy.get(`th[aria-colindex="1"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="1"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="0"]`).should("have.text", "FM-00003FM-00003FM-00004FM-00004FM-00004FM-00004");
      cy.get(`th[aria-colindex="1"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="1"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="0"]`).should("have.text", "FM-00004FM-00004FM-00004FM-00004FM-00003FM-00003");
      cy.get(`th[aria-colindex="1"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it("Verify arrow for TRN ID", () => {
      cy.get(`th[aria-colindex="2"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="2"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="1"]`)
        .should("have.text", "TRN-00001TRN-00002TRN-00003TRN-00004TRN-00005TRN-00006");
      cy.get(`th[aria-colindex="2"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="2"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="1"]`)
        .should("have.text", "TRN-00006TRN-00005TRN-00004TRN-00003TRN-00002TRN-00001");
    });

    it("Verify arrow for Revision", () => {
      cy.get(`td[data-grid-col-index="2"]`)
        .should("have.text", "111111");
      cy.get(`th[aria-colindex="3"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="3"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="2"]`)
        .should("have.text", "111111");
      cy.get(`th[aria-colindex="3"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="3"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="2"]`)
        .should("have.text", "111111");
    });

    it("Verify arrow for Document title", () => {
      cy.get(`td[data-grid-col-index="3"]`)
        .should("have.text", "Form document for trainingForm document for training" +
        "Form2 document for trainingForm2 document for trainingForm2 document for trainingForm2 document for training");
      cy.get(`th[aria-colindex="4"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="4"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="3"]`)
        .should("have.text", "Form2 document for trainingForm2 document for training" +
        "Form2 document for trainingForm2 document for trainingForm document for trainingForm document for training");
      cy.get(`th[aria-colindex="4"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="4"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="3"]`)
        .should("have.text", "Form document for trainingForm document for training" +
        "Form2 document for trainingForm2 document for trainingForm2 document for trainingForm2 document for training");
    });

    it("Verify arrow for Trainee", () => {
      cy.get(`td[data-grid-col-index="4"]`)
        .should("have.text", "GRGiovanni ReynoldsHBHarry BartolettiGRGiovanni ReynoldsEWEda Walker" +
        "ABAthena BlockHBHarry Bartoletti");
      cy.get(`th[aria-colindex="5"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="5"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="4"]`)
        .should("have.text", "ABAthena BlockEWEda WalkerGRGiovanni ReynoldsGRGiovanni Reynolds" +
        "HBHarry BartolettiHBHarry Bartoletti");
      cy.get(`th[aria-colindex="5"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="5"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="4"]`)
        .should("have.text", "HBHarry BartolettiHBHarry BartolettiGRGiovanni Reynolds" +
        "GRGiovanni ReynoldsEWEda WalkerABAthena Block");
    });

    it("Verify arrow for Assign Date", () => {
      cy.get(`td[data-grid-col-index="5"]`)
        .should("have.text", `${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}`);
      cy.get(`th[aria-colindex="6"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="5"]`)
        .should("have.text", `${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}`);
      cy.get(`th[aria-colindex="6"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="5"]`)
        .should("have.text", `${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}${assignDate}`);
    });

    it("Verify arrow for Due Date", () => {
      cy.get(`td[data-grid-col-index="6"]`)
        .should("have.text", `${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}`);
      cy.get(`th[aria-colindex="7"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="6"]`)
        .should("have.text", `${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}`);
      cy.get(`th[aria-colindex="7"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="6"]`)
        .should("have.text", `${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}${dueDate}`);
    });

    it("Verify arrow for Completed On", () => {
      cy.get(`td[data-grid-col-index="7"]`)
        .should("have.text", "PendingPendingPendingPendingPendingPending");
      cy.get(`th[aria-colindex="8"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="8"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="7"]`)
        .should("have.text", "PendingPendingPendingPendingPendingPending");
      cy.get(`th[aria-colindex="8"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="8"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="7"]`)
        .should("have.text", "PendingPendingPendingPendingPendingPending");
    });

    it("Verify arrow for Due Date", () => {
      cy.get(`td[data-grid-col-index="8"]`)
        .should("have.text", "TCT-00001TCT-00001TCT-00002TCT-00002TCT-00002TCT-00002");
      cy.get(`th[aria-colindex="9"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="9"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="8"]`)
        .should("have.text", "TCT-00001TCT-00001TCT-00002TCT-00002TCT-00002TCT-00002");
      cy.get(`th[aria-colindex="9"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="9"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`td[data-grid-col-index="8"]`)
        .should("have.text", "TCT-00002TCT-00002TCT-00002TCT-00002TCT-00001TCT-00001");
    });
  });
});
