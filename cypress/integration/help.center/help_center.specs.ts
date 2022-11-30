// / <reference types="Cypress" />

import content from "../../../src/App/Enlil/Features/HelpCenter/data/content-en";
import { HelpModule } from "../../../src/App/Enlil/Features/HelpCenter/HelpCenter.types";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { testHelpCenterModule } from "../../utils/functions/testHelpCenterModule";

context("Help Center behaviour", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  let createdCompany;
  let adminEmployee;

  context("[API] Prepare company", () => {
    let loginResponse;
    let group;

    let formDocumentType;
    let recordDocumentType;
    let equipmentDocumentType;
    let partDocumentType;
    let approvalRequestDocumentType;
    let supplierDocumentType;
    let ebDocumentType;
    let purchaseOrderDocumentType;
    let receivableDocumentType;
    let lotsDocumentType;
    let mpiDocumentType;
    let lhrtDocumentType;
    let lhrDocumentType;
    let trainingCurriculumDocumentType;

    it("[API] Create company", (done: any) => {
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
              EngineeringBuild,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          ebDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build Test");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          lotsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lots");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions");
          lhrtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR Template");
          lhrDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record");
          trainingCurriculumDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Training Curriculum");
          done();
        });
      });
    });

    it("[API] Login user", (done: any) => {
      cy.authApiLogin({
        email: adminEmployee.user.email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API] Create EB page details", (done: any) => {
      cy.request({
        method: "POST",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
        body: {
          category: "EB",
          addNewBtnLabel: "Create Engineering Build",
          config: {},
          columns: [
            {
              label: "EB ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
            {
              fn: "DOCUMENT_REVISION_VERSION",
              label: "Revision",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.revision",
              sourcePath: ["revisionStage:revision"],
              showOnAndroid: true,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "status",
              showOnAndroid: true,
            },
            {
              label: "Title",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "name",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Released Date",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "releasedAt",
              showOnAndroid: true,
            },
            {
              fn: "FORM_DOC_ID",
              label: "Form ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.formDocId",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
            {
              fn: "PART_ID_FROM_EB",
              label: "Part ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.partFromEb",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
          ],
        },
      }).then(() =>  done());
    });

    it("[API] Update company navigation", (done: any) => {
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
                  icon: "/navigation_icons/eb_icon.svg",
                  type: "CATEGORY",
                  label: "Engineering Builds",
                  category: "EB",
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
              icon: "/navigation_icons/document-menu.svg",
              path: "/page_details_management",
              type: "LINK",
              label: "Page Details Management",
              restrictedToUsersWithTags: [
                GroupTag.PAGE_DETAILS_MANAGEMENT,
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

    context("[API] Add employee to developers group", () => {
      it("[API] Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          group = response;
          done();
        });
      });

      it("[API] Patch group", () => {
        cy.grpPatchGroup({
          groupId: group.body[0].id,
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: adminEmployee.id }],
          },
        });
      });
    });

    context("[API] Prepare documents", () => {
      let initialArDocument;
      let createdPartDocument;
      let createdEquipmentDocument;
      let createdSupplierDocument;
      let createdEBDocument;
      let createdPurchaseOrderFormDocument;
      let createdPurchaseOrderDocument;
      let createdMaterialsDocument;
      let createdMPIDocument;
      let lhrtDocument;
      let createdTrainingCurriculumFormDocument;

      it("[API] Get AR document", (done: any) => {
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          done();
        });
      });

      it("[API] Create Equipment document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Equipment",
            document: {
              docId: "EQ-00001",
              documentType: {
                id: equipmentDocumentType[0].id,
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
            name: "Equipment",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {
              "fb-default-eq-status": "Active",
              "fb-primary-owner-eq": adminEmployee.id,
              "fb-coordinator-eq": adminEmployee.id,
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdEquipmentDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdEquipmentDocument.id,
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

      it("[API] Create Part document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Part",
            document: {
              docId: "PRT-00001",
              documentType: {
                id: partDocumentType[0].id,
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
            name: "Part",
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

      it("[API] Create Supplier document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Supplier</p>",
            document: {
              docId: "SUP-00001",
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
            name: "Supplier",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {},
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdSupplierDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdSupplierDocument.id,
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

      it("[API] Create EB document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "EB",
            document: {
              docId: "EB-00001",
              documentType: {
                id: ebDocumentType[0].id,
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
            name: "EB",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {},
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdEBDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdEBDocument.id,
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

      it("[API] Create Purchase Order form", (done: any) => {
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
                docId: "FM-00002",
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
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: purchaseOrderDocumentType[0].id,
                }],
                schema: [],
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

      it("[API] Create Purchase Order document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Purchase Order",
            document: {
              docId: "PO-00001",
              documentType: {
                id: purchaseOrderDocumentType[0].id,
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
            name: "",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: {
              id: createdPurchaseOrderFormDocument.id,
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPurchaseOrderDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPurchaseOrderDocument.id,
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

      it("[API] Create Receiving document", (done: any) => {
        cy.recAPICreateReceivable({
          payload: {
            name: "",
            description: "",
            attachments: [],
            referenceTo: [],
            revisionChangeType: RevisionChangeType.NextRevision,
            document: {
              docId: "RC-00005",
              documentType: {
                id: receivableDocumentType[0].id,
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
            formInput: {
              "receivable-kdptzei2": { id: createdPurchaseOrderDocument.id },
            },
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });

      it("[API] Create material one", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Materials document</p>",
            document: {
              docId: "MT-00004",
              documentType: {
                id: partDocumentType[0].id,
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
            name: "Material one",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdMaterialsDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdMaterialsDocument.id,
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

      it("[API] Create MPI document", () => {
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
                        title: createdMaterialsDocument.id,
                        quantity: 1,
                        unit: "sets",
                      },
                    ],
                    equipment: [
                      {
                        id: "kolg6pz4",
                        title: createdEquipmentDocument.id,
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
              docId: "PI-00008",
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
                id: mpiDocumentType[0].id,
              },
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdMPIDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdMPIDocument.id,
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

      it("[API] Create LHRt document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "LHRt",
            document: {
              docId: "LHRT-00001",
              documentType: {
                id: lhrtDocumentType[0].id,
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
            name: "LHRt",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [
                { id: lhrDocumentType[0].id },
              ],
              schema: [
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
                    value: createdMPIDocument.id,
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
          lhrtDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: lhrtDocument.id,
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

      it("[API] Create LHR document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "LHR",
            document: {
              docId: "LHR-00001",
              documentType: {
                id: lhrDocumentType[0].id,
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
            name: "LHR",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: { id: lhrtDocument.id },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });

      it("[API] Create Lots document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "LOT",
            document: {
              docId: "LOT #00000001",
              documentType: {
                id: lotsDocumentType[0].id,
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
            name: "LOT",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });

      it("[API] Create Record document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Record",
            document: {
              docId: "MR-00001",
              documentType: {
                id: recordDocumentType[0].id,
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
            name: "Record",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });

      it("[API] Create Training Curriculum form", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Training Curriculum form",
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
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: "Training Curriculum form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: trainingCurriculumDocumentType[0].id,
              }],
              schema: [],
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

      it("[API] Create Training Curriculum document", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "Training Curriculum",
            document: {
              docId: "TC-00001",
              documentType: {
                id: trainingCurriculumDocumentType[0].id,
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
            name: "Training Curriculum",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: {
              id: createdTrainingCurriculumFormDocument.id,
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });


  context("Scenario 1 - Dashboard", () => {
    context("Verify module", () => {
      const moduleData = content[HelpModule.Dashboard];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData);
    });
  });

  context("Scenario 2 - Document List", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToDocumentList();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.DocumentList];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData);
    });
  });

  context("Scenario 3 - Change Order", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToApprovalRequestList();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.ApprovalRequests];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 4 - Records", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToRecords();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Record];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 5 - Purchase Order", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToPurchaseOrder();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.PurchaseOrder];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 6 - Equipment", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToEquipment();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Equipment];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 7 - Supplier Management / Supplier", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToSuppliers();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Supplier];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 8 - Receiving", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToReceivableList();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Receive];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 9 - Parts", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToParts();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Parts];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 10 - Engineering Builds", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToEB();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.EB];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 11 - LHR", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToLHR();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Lhr];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 12 - Lots", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToLots();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.Lot];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 13 - Training", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.navigToTrainingCurriculums();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.TrainingCurriculums];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData, { withDocuments: true });
    });
  });

  context("Scenario 14 - User Management", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.usrNavigateToUserManagement();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.UserManagement];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData);
    });
  });

  context("Scenario 15 - Group Management", () => {
    it("Open the module / landing page that you need to test", () => {
      cy.grpNavigateToGroupManagement();
    });

    context("Verify module", () => {
      const moduleData = content[HelpModule.GroupManagement];

      it("Check module data", () => {
        expect(moduleData).to.exist;
      });

      testHelpCenterModule(moduleData);
    });
  });
});
