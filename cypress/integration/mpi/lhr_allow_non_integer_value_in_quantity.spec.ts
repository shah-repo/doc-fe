/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
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
let lhrDocUrl;

const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");

context("LHR allow non integer in quantity.", () => {
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
              { ...LotHistoryRecordTest },
              MPITest,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
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
            docId: `LOT #${lotDateSuffix}01`,
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

    it("[API]Create Lot record2", (done: any) => {
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
            "lot_part": materialsDocument2.id,
            "100-inspection-override": [
              "100% Inspection Override",
            ],
          },
          description: "",
          name: "API LOT 2",
          attachments: [],
          referenceTo: [],
          revisionStage: 3,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "LOT #22041302",
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
      cy.navigToLHR();
    });

    it("Click 'Initiate New LHR'", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select a document type Lot History Record and select a Form released", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("Lot History Record");
      });
    });

    it("Select build type R&D", () => {
      cy.get("[value='R&D']").arrowClick({ force: true }).wait(2000);
    });


    it("Select Approval", () => {
      cy.wrapWithWaitOnApiCalls([
      ], () => {
        cy.get("[data-cy^='fb-approvals']").autocompleteSelect(USERS[1].name);
      });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
    });

    it("Click details Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Step 1 Exist in detail tab", () => {
      cy.get("[data-cy='LHR Step 1']").should("be.visible");
    });

    it("Open LHR step", () => {
      cy.get("[data-cy='LHR Step 1']").arrowClick({ force: true });
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Select Approval", () => {
      cy.wrapWithWaitOnApiCalls([
      ], () => {
        cy.get("[data-cy^='fb-approvals']").autocompleteSelect(USERS[1].name);
      });
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Click 'SELECT' for `Material`", () => {
      cy.get("[data-cy=\"form.builder.select\"]")
        .eq(0)
        .click({ force: true });
    });

    it("Select lot `LOT`", () => {
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
      cy.get("input[data-cy=usedOverride]").arrowClick();
      cy.get("ul>li[role=option]").contains(`LOT #${lotDateSuffix}01 | MT-00004.1`).arrowClick();
    });

    it("Select quantity in lot dialog `0.1`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.1");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.2`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.2");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.345`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.345");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.0345`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.0345");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Verify that  error message “Quantity must be an integer number” is not displayed.", () => {
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.345 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0345 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.345 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0345 inch`);
    });

    it("Verify that inserted non-integer such (e.g. 0.0345) will be always displayed as 0.0345.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0345 inch`);
    });

  });

  context("Enter a non-integer value up to 10 numbers after decimal", () => {
    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.1856767676`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.1856767676");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.2898767885`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.2898767885");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.8989765434`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.8989765434");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Verify that  error message “Quantity must be an integer number” is not displayed.", () => {
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("Verify that the non-integer values is not truncated", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767676 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767885 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765434 inch`);
    });

    it("Verify that up to 10 numbers after the decimal is displayed", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767676 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767885 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765434 inch`);
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767676 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767885 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765434 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767676 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767885 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765434 inch`);
    });
  });

  context("Enter a non-integer value with more then 10 numbers after the decimal ", () => {
    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.8999999990111`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.8999999990111");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Error Message should display", () => {
      const errorStr = `You cannot exceed more than 10 numbers after the decimal in the "Quantity" field.`;
      cy.get(`[class="Toastify__toast-body"]`)
        .should("be.visible")
        .should("contain.text", errorStr);
    });
  });


  context("Enter a non-integer value with 10 numbers after the decimal ", () => {
    it("Select quantity in lot dialog `0.8123333334`", () => {
      cy.get("[data-cy='quantity']").clear().arrowType("0.8123333334");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8123333334 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8123333334 inch`);
    });
  });

  context("Fill the fields for Start/Accepted/Rejected quantities.", () => {
    it("Add Start quantity exists", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
    });
    it("Add Accepted quantity exists", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("10");
    });
    it("Add Rejected quantity exists", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("10");
    });
  });

  context("Navigate and export LHR.", () => {
    it("Navigate to LHR Landing page", () => {
      cy.navigToLHR();
    });

    it("Search for the LHR ", () => {
      cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00001");
      cy.get("tr.k-master-row").first().arrowClick();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("contain.text", "LHR-00001");
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.WIP}`, () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

  context("Navigate to LHR #1 and Complete it", () => {
    it("Navigate to LHR #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrDocUrl);
      });
    });

    it("Click details Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Open LHR step", () => {
      cy.get("[data-cy='LHR Step 1 - Rev A']").arrowClick({ force: true });
    });

    it("Click View step", () => {
      cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
    });

    it("Complete step", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it("Approve step", () => {
      cy.ebApprove();
    });
  });


  context("Revise LHR ", () => {
    it("Click Revise on LHRs #1", () => {
      cy.drClickReviseDocument();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^='fb-approvals-approvals-built-in']").autocompleteSelect(USERS[1].name);
    });

    it("Save the document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.63`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.63");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.46`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.46");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.451`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.451");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.0451`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.0451");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Verify that  error message “Quantity must be an integer number” is not displayed.", () => {
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.63 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.46 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.451 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0451 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.63 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.46 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.451 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0451 inch`);
    });

    it("Verify that inserted non-integer such (e.g. 0.0451) will be always displayed as 0.0451.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.0451 inch`);
    });
  });

  context("Enter a non-integer value up to 10 numbers after decimal", () => {
    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.1856767677`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.1856767677");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.2898767888`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.2898767888");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.8989765433`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.8989765433");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Verify that  error message “Quantity must be an integer number” is not displayed.", () => {
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("Verify that the non-integer values is not truncated", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767677 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767888 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765433 inch`);
    });

    it("Verify that up to 10 numbers after the decimal is displayed", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767677 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767888 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765433 inch`);
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767677 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767888 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765433 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.1856767677 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.2898767888 inch`)
        .and("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8989765433 inch`);
    });
  });

  context("Enter a non-integer value with more then 10 numbers after the decimal ", () => {
    it("Click 'CHANGE' for 'Material' ", () => {
      cy.get("[data-cy=\"form.builder.change\"]")
        .eq(0)
        .click({ force: true });
    });

    it(`Select lot 'LOT'`, () => {
      cy.selectLot({ lot: `LOT #${lotDateSuffix}01 | MT-00004.1` });
    });

    it("Select quantity in lot dialog `0.8999999990111`", () => {
      cy.get("[data-cy='quantity']").arrowType("0.8999999990111");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Error Message should display", () => {
      const errorStr = `You cannot exceed more than 10 numbers after the decimal in the "Quantity" field.`;
      cy.get(`[class="Toastify__toast-body"]`)
        .should("be.visible")
        .should("contain.text", errorStr);
    });
  });

  context("Enter a non-integer value with 10 numbers after the decimal ", () => {
    it("Select quantity in lot dialog `0.8999999999`", () => {
      cy.get("[data-cy='quantity']").clear().arrowType("0.8999999999");
    });

    it("Click 'SAVE' on select lot dialog", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
    });

    it("Enter a non-integer value up to 10 numbers in the “Quantity” section.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8999999999 inch`);
    });

    it("Verify that the quantity that is non-integer for any unit (inch, kg, gallon, etc.) selected.", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8999999999 inch`);
    });

    it("Verify that Lot with non-integer value in the 'Quantity'field is saved", () => {
      cy.get("[data-cy=\"form.builder.mpi.part.selection.materials\"]")
        .should("contain.text", `LOT #${lotDateSuffix}01 | MT-00004.1 | 0.8999999999 inch`);
    });
  });

  context("Fill the fields for Start/Accepted/Rejected quantities.", () => {
    it("Add Start quantity exists", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").clear().arrowType("12");
    });
    it("Add Accepted quantity exists", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").clear().arrowType("12");
    });
    it("Add Rejected quantity exists", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").clear().arrowType("12");
    });

  });


  context("Navigate and export LHR.", () => {
    it("Navigate to LHR Landing page", () => {
      cy.navigToLHR();
    });

    it("Search for the LHR ", () => {
      cy.get(`th[aria-colindex="9"] input`).clear().arrowType("LHR-00001");
      cy.get("tr.k-master-row").first().arrowClick();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("contain.text", "LHR-00001");
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context(`LHR with ${STATUS_TYPES_LABEL.WIP} status and LHRS with ${STATUS_TYPES_LABEL.WIP}`, () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-A" });
    });
  });

});
