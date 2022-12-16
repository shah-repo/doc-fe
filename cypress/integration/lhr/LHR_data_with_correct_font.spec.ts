
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { FONT_SIZE_10, FONT_SIZE_12, FONT_SIZE_13, FONT_SIZE_14, FONT_SIZE_16, FONT_WT_400, FONT_WT_600, FONT_WT_700, LINE_HT_13, LINE_HT_15, LINE_HT_15_12, LINE_HT_15_96, LINE_HT_18, LINE_HT_19_2, LINE_HT_19_5, LINE_HT_20, LINE_HT_20_02, LINE_HT_21, LINE_HT_24, LINE_HT_25_6, sora, soraSansserif, TEXT_TRANS_UPPER } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";


let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let materialsDocumentType;
let partDocumentType;
let materialsDocument;
let materialsDocument2;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;
let LHRtDocumentType;
let LHRDocumentType;
let createdLHRtDocument;
let CSLDocumentType;
let formDocumentType;
let createdLotsFormDocument;
let createdLot;

const docId = "LOT #";
const docState = "STATE";
const docOwner = "OWNER";
const PartNo = "PART NUMBER/REV";
const CompletionDate = "COMPLETION DATE";
const StartQuantity = "START QUANTITY";
const EndQuantity = "END QUANTITY";
const Template = "TEMPLATE";
const Id = "ID";

context("LHR steps verification", () => {
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
              MPITest,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lots");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");

          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
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

    it("[API]Create material one", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Materials document</p>",
              document: {
                docId: "MT-00004",
                documentType: {
                  id: materialsDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [],
                },
              },
              name: "Material one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            materialsDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: materialsDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "CS-00005",
            documentType: {
              id: partDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create material two", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00006",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material two",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument2.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

    it("[API]Create MPI document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                tabId: "procedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                tabId: "procedure",
                index: 1,
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorConfig: {
                  materials: [
                    {
                      id: "kolg5zka",
                      title: materialsDocument.id,
                      quantity: 1,
                      unit: "inch",
                    },
                    {
                      id: "kolg6eqp",
                      title: materialsDocument2.id,
                      quantity: 2,
                      unit: "kilogram",
                    },
                  ],
                  description: "<p>Description of MPI step created with API</p>",
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
            ],
          },
          description: "<p>MPI created with API description</p>",
          name: "MPI created with API",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MPI-00008",
            securityList: {
              securityEmployees: [],
              securityGroups: [],
              operators: [],
            },
            documentType: {
              id: mpiDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        mpiDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: mpiDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

    it("[API]Create LHRt document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRt created with API</p>",
          document: {
            docId: "LHRT-00003",
            documentType: {
              id: LHRtDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "API LHRt document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [
              { id: LHRDocumentType[0].id },
            ],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                tabId: "overview",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                label: "Initial Quantity",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                label: "End Quantity",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                label: "Build Type",
                tabId: "overview",
                options: [
                  {
                    text: "R&D",
                    value: "R&D",
                  },
                  {
                    text: "Production",
                    value: "Production",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                label: "Due Date",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                label: "LHR Step",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: mpiDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "overview",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLHRtDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLHRtDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
          document: {
            docId: "FM-00008",
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
          name: "Lots form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: CSLDocumentType[0].id,
            }],
            schema: [
              {
                name: "lot_quantity",
                type: "quantity",
                index: 0,
                label: "Initial Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_usable_quantity",
                type: "quantity",
                index: 1,
                label: "Usable Quantity",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [],
                validationAttribute: "Usable Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_expiry_date",
                type: "datepicker",
                index: 2,
                label: "Expiration Date",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Expiration Date",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lot_part",
                type: "autocomplete",
                index: 3,
                label: "Part Selection",
                tabId: "details",
                optionId: "21",
                placeholder: "Select the appropriate part for this lot",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "100-inspection-override",
                type: "checkboxgroup",
                index: 4,
                label: "100% Inspection Override",
                tabId: "details",
                options: [
                  {
                    text: "100% Inspection Override",
                    value: "100% Inspection Override",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                editorProperties: [],
                validationAttribute: "100% Inspection Override",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                tabId: "details",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLotsFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLotsFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create Lot record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdLotsFormDocument.id,
          },
          formInput: {
            "fb-approvals-": [],
            "lot_quantity": 5,
            "lot_usable_quantity": 3,
            "lot_expiry_date": new Date(),
            "lot_part": materialsDocument.id,
            "100-inspection-override": [
              "100% Inspection Override",
            ],
          },
          description: "",
          name: "API LOT 1",
          attachments: [],
          referenceTo: [],
          revisionStage: 3,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "LOT #22041301",
            securityList: {
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
              operators: [],
            },
            documentType: {
              id: CSLDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLot = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLot.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Navigate to LHR and Start Step", () => {
    it("Navigate to LHR", () => {
      cy.wait(2000);
      cy.navigToLHR();
    });
  });

  context("Verify font for Landing page button", () => {
    it(`Verify 'Initiate new LHR' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
        .checkStylePropExists({
          content: "Initiate new LHR",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"document.revision.export.list\"]")
        .checkStylePropExists({
          content: "Export list",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"clearFilter\"]")
        .checkStylePropExists({
          content: "Clear Filters",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify font for Landing page table columns headers", () => {
    it(`Verify ${docId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docId,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docState} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docState,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docOwner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docOwner,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${PartNo} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: PartNo,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${CompletionDate} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: CompletionDate,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${StartQuantity} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: StartQuantity,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${EndQuantity} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: EndQuantity,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${Template} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: Template,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${Id} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: Id,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });
  });

  context("Select a sample of random items from the landing page", () => {
    it(`Verify 'Initiate new LHR' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
        .checkStylePropExists({
          content: "Initiate new LHR",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"document.revision.export.list\"]")
        .checkStylePropExists({
          content: "Export list",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"clearFilter\"]")
        .checkStylePropExists({
          content: "Clear Filters",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Click on “Initiate New LHR”", () => {
    it("Click 'Initiate New LHR'", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it(`Verify the pop-up 'Choose a Record Type' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_15_96} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="field-selectType"]`)
        .checkStylePropExists({
          content: "Select a document type",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_25_6, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the Pop-up 'Cancel' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="suggestFormCancelBtn"]`)
        .checkStylePropExists({
          content: "Cancel",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Click on “Initiate New LHR”", () => {
    it("Select a document type Lot History Record and select a Form released", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true });
        cy.get("div[id^=react-select]").contains(new RegExp("^Lot History Record$", "g")).arrowClick();
      });
    });

    it("turnoff autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("All the fields/tabs in the record & buttons in the page", () => {
    it(`Verify 'Submit for approval' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]")
        .checkStylePropExists({
          content: "Submit for approval",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Save' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]")
        .checkStylePropExists({
          content: "Save",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Attachments' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2} font-weight as ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Attachments",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_19_2, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify 'document status' 'Released' with font-size ${FONT_SIZE_10} font-family ${soraSansserif}  line-height ${LINE_HT_13} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="HeaderInfo-status"]`)
        .checkStylePropExists({
          content: "WIP",
          props: { "font-size": FONT_SIZE_10, "font-family": soraSansserif, "line-height": LINE_HT_13, "font-weight": FONT_WT_700 },
        });
    });

    it(`Verify 'doc-id' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_18} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="HeaderInfo-docId"]`)
        .checkStylePropExists({
          content: "LHR-00001",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_700 },
        });
    });

    it(`Verify 'Part to be Manufactured' with font-size ${FONT_SIZE_12} font-family ${soraSansserif}  line-height ${LINE_HT_15} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="Part to be Manufactured"]`)
        .checkStylePropExists({
          content: "Part to be Manufactured",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Initial Quantity' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_15} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="Initial Quantity"]`)
        .checkStylePropExists({
          content: "Initial Quantity",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'End Quantity' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_15} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="End Quantity"]`)
        .checkStylePropExists({
          content: "End Quantity",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Build Type' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_15} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="Build Type"]`)
        .checkStylePropExists({
          content: "Build Type",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Due Date' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_15} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="Due Date"]`)
        .checkStylePropExists({
          content: "Due Date",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Approvals' with font-size ${FONT_SIZE_16} font-family ${soraSansserif}  line-height ${LINE_HT_18} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="form.builder.approvals"]`)
        .checkStylePropExists({
          content: "Approvals",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify The side bar options References fonts", () => {
    it("Verify The side bar options References fonts", () => {
      cy.get("[data-cy=\"references-icon\"]").arrowClick();
    });

    it(`Verify the side bar options 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="References"]`)
        .checkStylePropExists({
          content: "References",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'General Info' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="generalInfo"]`)
        .checkStylePropExists({
          content: "General Info",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar owner font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="user-name"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "References",
        props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify the side bar 'Training' font-size ${FONT_SIZE_13} font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="training"]`)
        .checkStylePropExists({
          content: "Training",
          props: { "font-size": FONT_SIZE_13, "font-family": soraSansserif, "line-height": LINE_HT_19_5, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify the side bar 'Referenced By' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15_12} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Referenced By",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15_12, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify the side bar 'Release Date' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="releaseDate"]`)
        .checkStylePropExists({
          content: "Release Date",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'Form Info' font-size ${FONT_SIZE_12} font-family ${sora} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="output.info"]`)
        .checkStylePropExists({
          content: "Form Info",
          props: { "font-size": FONT_SIZE_12, "font-family": sora, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'Form Info' font-size ${FONT_SIZE_12} font-family ${sora} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="output.info"]`)
        .checkStylePropExists({
          content: "Form Info",
          props: { "font-size": FONT_SIZE_12, "font-family": sora, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'Migrate Form' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="common.form.migration"]`)
        .checkStylePropExists({
          content: "Migrate Form",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify The side bar options Revision's fonts", () => {
    it(`Verify Revisions font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
      cy.get("[data-cy=\"document.revision.docVersion\"]")
        .checkStylePropExists({
          content: "Revisions",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Doc ID with font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"common.docId\"]").eq(0)
        .checkStylePropExists({
          content: "ID: LHR-00001",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify Owner font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]");
      cy.get("[data-cy=\"revision\"]")
        .checkStylePropExists({
          content: "Owner",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Verify The side bar options History's fonts", () => {
    it(`Verify ${USERS[1].name} font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="timeline-icon"]`).arrowClick();
      cy.get(`[data-cy="change-key-0"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'New Doc ID' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-key-0-0"]`)
        .checkStylePropExists({
          content: "New Doc ID",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'LHR-00001' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-value-0-0"]`)
        .checkStylePropExists({
          content: "LHR-00001",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_700 },
        });
    });

    it(`Verify 'LHRT-00003 - revision 1 - API LHRt document' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="change-value-0-1"]`)
        .checkStylePropExists({
          content: "LHRT-00003 - revision 1 - API LHRt document",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify ${USERS[1].name} font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="change-value-0-2"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-value-0-3"]`)
        .checkStylePropExists({
          content: "Everyone",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Set to Draft by Giovanni Reynolds' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-value-0-4"]`)
        .checkStylePropExists({
          content: "Set to Draft by Giovanni Reynolds",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Verify The side bar options Access Permissions fonts", () => {
    it(`Verify 'Access Permissions' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"permission-icon\"]").arrowClick();
      cy.get(`[data-cy="Access Permissions"]`)
        .checkStylePropExists({
          content: "Access Permissions",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Selected Users' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Selected Users",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify 'Selected Groups' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="Selected-Groups"]`)
        .checkStylePropExists({
          content: "Selected Groups",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "Everyone",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_18, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Operators",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });
  });

  context("Verify The side bar options Bookmarks's fonts", () => {
    it(`Verify 'Bookmarks' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="bookmark-icon"]`).arrowClick();
      cy.get(`[data-cy="Bookmarks"]`)
        .checkStylePropExists({
          content: "Bookmarks",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify The side bar options 'Revision History' fonts", () => {
    it(`Verify 'Revision History' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="cr-icon"]`).arrowClick();
      cy.get(`[data-cy="Revision History"]`)
        .checkStylePropExists({
          content: "Revision History",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Try to submit the LHR for review without adding approvals ", () => {
    it("Select build type R&D", () => {
      cy.get("[value='R&D']").arrowClick();
      cy.wait(3000);
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.wait(4000);
    });

    it("Submit for approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick({ force: true });
    });

    it("Verify error message", () => {
      cy.checkToastMessageContains({
        message: "Approvals not present",
      });
    });

    it(`Verify 'Approvals not present' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[class="Toastify__toast-body"]`)
        .checkStylePropExists({
          content: "Approvals not present",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
      cy.closeAllAlertMessages();
    });
  });
});
