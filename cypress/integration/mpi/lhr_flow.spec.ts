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
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let thirdEmployee;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let equipmentDocument2;
let equipmentDocument3;
let materialsDocument2;
let materialsDocument3;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;
let lhrDocUrl;
let lhrs1DocUrl;
let developersGroup;
let secondEmployee;
let createdLotsFormDocument;
let formDocumentType;
let CSLDocumentType;

const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");


context("LHR flow", () => {
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
              LotHistoryRecordTest,
              MPITestProcedureDeletable,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
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


    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
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

    it("[API]Create material one", () => {
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
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
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

    it("[API]Create unreleased part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>unreleased part document</p>",
          document: {
            docId: "CS-00010",
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
          name: "Unreleased part document",
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

    it("[API]Create material three", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00007",
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
          name: "Material three",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument3 = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument3.id,
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

    it("[API]Create equipment two", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "ET-00007",
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
          name: "Equipment two",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        equipmentDocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: equipmentDocument2.id,
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

    it("[API]Create equipment three", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "ET-00008",
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
          name: "Equipment three",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        equipmentDocument3 = response;
        cy.drAPIApproveAndRelease({
          documentId: equipmentDocument3.id,
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
                      unit: "sets",
                    },
                    {
                      id: "kolg6eqp",
                      title: materialsDocument2.id,
                      quantity: 2,
                      unit: "boxes",
                    },
                  ],
                  equipment: [
                    {
                      id: "kolg6pz4",
                      title: equipmentDocument.id,
                    },
                    {
                      id: "kolg6tnb",
                      title: equipmentDocument2.id,
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
                name: "fb-approvals-ksherq6d",
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
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create lot document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Component Specification Lot' from the dropdown", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("div[id^=react-select]").contains("Component Specification Lot").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
      cy.wait(2000);
    });

    it("Enter Usable Quantity", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("12");
      cy.wait(2000);
    });

    it("Select 'Material one' for Part lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").arrowType("Material one");
      cy.get("ul>li[role=option]").contains("Material one").arrowClick();
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      cy.unClick();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        SystemRequirement("REQ-0560");
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Fill step #1", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Fill step #1 description", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add attachment", () => {
          SystemRequirement("REQ-3090");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.contains("Step #1").parentsUntil("li")
              .find("[data-cy=\"albumMediaButton\"]").arrowClick();
            cy.elUploadAttachment({
              fileName: "image.jpg",
              el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
            });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Material one' to step #1", () => {
          SystemRequirement("REQ-3100");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Material parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Parameter for material three" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });


        it("Add 'Equipment one' to step #1", () => {
          SystemRequirement("REQ-3130");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Equipment parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Fill step #2", () => {
        it("Add step #2", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PI Procedure" });
          cy.fbAddNewFieldButton();
        });

        it("Add attachment", () => {
          SystemRequirement("REQ-3090");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.contains("Step #2").parentsUntil("li")
              .find("[data-cy=\"albumMediaButton\"]").arrowClick();
            cy.elUploadAttachment({
              fileName: "test_image.jpg",
              el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
            });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Fill step #2 description", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Material two' to step #2", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "5", unit: "Day(s)" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Equipment two' to step #2", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Verify clone Step #1", () => {
        it("Clone Step #1", () => {
          SystemRequirement("REQ-3070");
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachments,
            CyRoutes.GetAttachmentsAttached ], () => {
            cy.get("[data-cy=\"form.builder.clone.step\"]").eq(0).arrowClick();
          });
        });

        it("Verify description of clone of Step #1", () => {
          cy.xpath("//div[contains(@data-cy, 'description')]/../div[2]")
            .eq(2)
            .should("have.text", "Description of step one");
        });

        it("Verify image of clone of Step #1", () => {
          cy.get(" [data-cy=\"mediaUploadField\"]").eq(1).find("svg").eq(0).arrowClick();
          cy.get("[data-cy=\"mediaUploadField\"] ul>li div[title]").each(($el) => {
            const attachName = $el.text();
            expect(attachName).to.be.oneOf(["image", "test_image"]);
          });
        });

        it("Verify materials of clone of Step #1", () => {
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.materials.title\"]")
            .should("have.text", "MT-00004 - Material one | Qty: 3 each");
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
            .should("have.text", "A: Parameter for material three | Qty: None ");
        });

        it("Verify equipments of clone of Step #1", () => {
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.equipment.title\"]")
            .should("have.text", "ET-00003 - Equipment one");
          cy.contains("Step #2").parentsUntil("li")
            .find("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
            .should("have.text", "B: Equipment parameter ");
        });
      });

      context("Verify remove Step", () => {
        it("Check step count before remove", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]").should("have.length", 3);
        });

        it("remove Step #2", () => {
          SystemRequirement("REQ-3080");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.contains("Step #2").parentsUntil("li").find("[data-cy=\"remove-schema-item\"]")
              .arrowClick({ force: true });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Check step count after remove", () => {
          cy.get("[data-cy=\"form.builder.step.number\"]").should("have.length", 2);
        });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        SystemRequirement("REQ-3140");
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        SystemRequirement("REQ-3140");
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        SystemRequirement("REQ-3131");
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Material one");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetAutocompleteOptions], () => {
          cy.get("ul>li[role=option]").contains("Material one").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Enable notes in LHR step", () => {
        it("Click edit on LHR step", () => {
          cy.get("[data-cy=\"edit-schema-item\"]").eq(2).arrowClick({ force: true });
        });

        it("Check 'Include Notes' checkbox", () => {
          SystemRequirement("FB-0200");
          cy.get("input[value=\"includeNotes\"]").check();
        });

        it("Save changes made to field", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"common.add\"]").arrowClick();
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true }).wait(3000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]").focus()
            .autocompleteSelect("PI-00002", { force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify indicator for parametrized Material", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true });
          SystemRequirement("REQ-3630");
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
            .should("have.text", "A: Parameter for material three | Qty: None ");
          cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]").parent().parent()
            .should("have.css", "background-color", "rgb(252, 222, 222)");
        });
      });

      context("Add another step with different MPI on document ", () => {
        it("Add LHR step", () => {
          SystemRequirement("REQ-3150");
          cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick({ force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select MPI document created with API for step #2 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(1).arrowClick({ force: true });
          cy.get("input[data-cy^=\"lhr-step\"]").autocompleteSelect("MPI created with API", { force: true });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify indicator for parametrized Equipment", () => {
          SystemRequirement("REQ-3630");
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
            .should("have.text", "B: Equipment parameter ");
          cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]").parent().parent()
            .should("have.css", "background-color", "rgb(252, 222, 222)");
        });
      });

      context("Try to release LHRt without parameters expecting validation error", () => {
        it("Approve and release LHRt document", () => {
          SystemRequirement("REQ-3640");
          cy.drApproveAndReleaseDialog();
          cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCall(
            CyRoutes.ReleaseDocRev,
            () => {
              cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
            });
        });

        it("Verify error message", () => {
          cy.wait(1000);
          cy.checkToastMessageIsEqual({
            message: "Parameters from MPI are not defined.",
          });
          cy.closeAllAlertMessages();
          cy.drCloseApproveAndReleaseDialog();
        });
      });

      context("Add parameter materials and equipment", () => {
        it("Add material parameter", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
          cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
            .eq(0).arrowClick({ force: true });
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"title\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("Material three").arrowClick();
          cy.get("[name=\"quantity\"]").arrowType("3");
          cy.get("[data-cy=\"unit\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("Day(s)").arrowClick();
          cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
        });

        it("Add equipment parameter", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
          cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
            .eq(1).arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"title\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("Equipment three").arrowClick();
          cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and release LHRt document", () => {
          SystemRequirement("REQ-3640");
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      SystemRequirement("REQ-3170");
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Verify LHR title", () => {
      SystemRequirement("REQ-3310");
      cy.get("#HeaderInfo-subtitle").should("have.text", " - LOT #" + lotDateSuffix + "02");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", "LHR-00004");
    });

    it("Verify current released part is 'rev 1'", () => {
      SystemRequirement("REQ-3820");
      cy.get("[data-cy=\"lhr-selected-part\"]")
        .should("have.attr", "value", "MT-00004 - rev 1 - Material one");
    });

    it("Check lot number", () => {
      SystemRequirement("REQ-3180");
      cy.get("#HeaderInfo-subtitle").should("have.text", " - LOT #" + lotDateSuffix + "02");
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
    });

    it("Select 'R&D' build type", () => {
      SystemRequirement("REQ-3190");
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(2000);
    });

    it("Add note to'End Quantity'", () => {
      SystemRequirement("REQ-3290");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetNotes, () => {
        cy.get("#fb-notes").arrowClick();
      });
      cy.get("[name=\"noteText\"]").arrowType("Quantity will be auto populated");
      cy.wrapWithWaitOnApiCall(CyRoutes.PostNotes, () => {
        cy.get("#send-icon").arrowClick();
      });
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });

    it("Check lot number", () => {
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      SystemRequirement("REQ-3180");
      cy.get("#HeaderInfo-subtitle").should("contains.text", " - LOT #" + lotDateSuffix + "02");
    });

    context("Complete first step in LHR", () => {
      context("Add operator and login it for work on LHRs", () => {
        it("Click on sidebar permission icon to add Operators", () => {
          cy.get("[data-cy='permission-icon']").arrowClick();
        });

        it(`Assign operator '${USERS[2].name}'`, () => {
          SystemRequirement("REQ-3200");
          cy.drAssignDocumentTo({ username: USERS[2].name });
        });

        it(`Logout user '${USERS[1].name}'`, () => {
          cy.authLogout();
        });

        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
        });

        it("Navigate to LHR landing page", () => {
          SystemRequirement("REQ-3350");
          cy.navigToLHR();
        });

        it("Select created LHR record", () => {
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.DocRevPreview,
            CyRoutes.GetAutocompleteOptions], () => {
            cy.dlSelectFirstDocument();
          });
        });
      });

      context("Start LHRs #1", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
        });

        it("Click 'START MPI'", () => {
          SystemRequirement("REQ-3210");
          cy.mpiStartStep({ stepNumber: 1 });
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });

        it("Verify LHRs title", () => {
          SystemRequirement("REQ-3320");
          cy.get("#HeaderInfo-subtitle", { timeout: 50000 })
            .should("have.text", "LHR-00004");
        });

        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Enter 'Start quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
        });

        it("Enter 'Accepted quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
        });

        it("Enter 'Rejected quntity' for LHRs #1", () => {
          cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
        });

        it("Click 'SELECT' for 'Material One' ", () => {
          cy.get("[data-cy=\"form.builder.select\"]")
            .eq(0)
            .click({ force: true });
        });

        it(`Select lot 'LOT #${lotDateSuffix}01'`, () => {
          cy.listLoadingElementShouldNotExist();
          cy.wait(2000);
          cy.get("input[data-cy=usedOverride]").arrowClick();
          cy.get("ul>li[role=option]").contains(`LOT #${lotDateSuffix}01`).arrowClick();
        });

        it("Select quantity in lot dialog", () => {
          cy.get("input[name=\"quantity\"]").arrowType("5");
        });

        it("Click 'SAVE' on select lot dialog", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
            cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
              .eq(0)
              .click();
          });
        });

        it("Click 'SELECT' for 'Equipment one' ", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.get("[data-cy=\"form.builder.select\"]")
              .eq(2)
              .click({ force: true });
          });
        });

        it("Select 'Equipment one'", () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"usedOverride\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("Equipment one").arrowClick();
        });

        it("Click 'SAVE' on select equipment dialog", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostLHRs], () => {
            cy.get("div[role=dialog] button[data-cy=\"fb-control-btn\"]")
              .eq(0)
              .click();
          });
        });

        it("Verify LOT is selected for 'Material One'", () => {
          SystemRequirement("REQ-3340", "REQ-3660");
          cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
            .should("contain.text", `LOT #${lotDateSuffix}01`);
        });

        it("Verify Equipment is selected for 'Equipment one'", () => {
          SystemRequirement("REQ-3660");
          cy.get("div[data-cy=\"form.builder.mpi.part.selection.equipment\"]")
            .should("have.text", "ET-00003");
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
          cy.wait(2000);
        });

        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          SystemRequirement("REQ-3220");
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
          });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Complete step", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve step", () => {
          SystemRequirement("REQ-3230");
          cy.ebApprove();
        });

        context("Check equipment and materials from MPI are present", () => {
          it("Select Procedure tab", () => {
            cy.drSelectProcedureTab();
          });

          it("Check description step #1", () => {
            cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
              .should("have.text", "Description of step one");
          });

          it("Check materials step #1", () => {
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(0)
              .should("have.text", "MT-00004 - Material one - rev 1 | Qty: 30 each");
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(1)
              .should("have.text", "MT-00007 - Material three - rev 1 | Qty: 30 days");
          });

          it("Check equipment step #1", () => {
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(0)
              .should("have.text", "ET-00003 - Equipment one");
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(1)
              .should("have.text", "ET-00008 - Equipment three");
          });

          it("Check description step #2", () => {
            cy.xpath("//div[contains(@data-cy, 'description')]/../div[2]")
              .eq(1)
              .should("have.text", "Description of step two");
          });

          it("Check materials step #2", () => {
            cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
              .eq(2)
              .should("have.text", "MT-00006 - Material two - rev 1 | Qty: 50 days");
          });

          it("Check equipment step #2", () => {
            cy.get("[data-cy$=\"equipment.title\"]")
              .eq(2)
              .should("have.text", "ET-00007 - Equipment two - rev 1");
          });

          it("Verify status is completed", () => {
            cy.url().then((url: any) => {
              lhrs1DocUrl = url;
            });
            cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
          });

          it("Select Overview tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Verify user who completed LHRs", () => {
            SystemRequirement("REQ-3240");
            cy.get("div[id=Presenter-FBWorkspace]>div").eq(-2).find("div>div:nth-child(5)")
              .should("contain.text", USERS[2].name);
          });
        });
      });
    });

    context("Verify anyone can make corrections to the LHRs after completing", () => {
      context("Login second user", () => {
        it(`Logout user '${USERS[2].name}'`, () => {
          cy.authLogout();
        });

        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
        });
      });

      context("Navigate to LHRs #1 and revise it", () => {
        it("Navig to LHRs #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.visit(lhrs1DocUrl);
          });
        });

        it("Click Revise on LHRs #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"updateRecord\"]").arrowClick();
            cy.wait(2000);
          });
        });

        it("Click save document", () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          cy.wait(2000);
        });

        it("Add an Approval", () => {
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
          });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Complete step", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve step", () => {
          SystemRequirement("REQ-3250");
          cy.ebApprove();
        });
      });
    });

    context("Login admin user", () => {
      it(`Logout user '${USERS[3].name}'`, () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context("Navigate back to LHR to start second LHRs", () => {
      it("Navigate to LHR landing page", () => {
        SystemRequirement("REQ-3350");
        cy.navigToLHR();
      });

      it("Select created LHR record", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocRevPreview,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
            cy.get("tr.k-master-row").first().arrowClick();
          });
          cy.listLoadingElementShouldNotExist();
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify date of completion LHRs #1", () => {
        cy.get("[data-cy=\"form.builder.step.complete\"]")
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Completed"]);
          });
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add owner to approver list", () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().arrowClick().wait(500);
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });

      it("Check lot number", () => {
        cy.get("#HeaderInfo-subtitle").should("have.text", " - LOT #" + lotDateSuffix + "02RD");
      });

      it("Try submitting for approval with uncompleted LHRs #2", () => {
        SystemRequirement("REQ-3300");
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.checkToastMessageContains({ message: "Every LHR step needs to be completed" });
      });
    });

    context("Complete LHRs #2 in LHR", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
        cy.wait(2000);
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy^=\"LHR Step 2\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        SystemRequirement("REQ-3210");
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("5");
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3");
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      context("Complete LHRs #2", () => {
        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add an Approval", () => {
          SystemRequirement("REQ-3220");
          cy.get("[data-cy^=\"fb-approvals-approvals\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
          });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Complete step", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve step", () => {
          cy.ebApprove();
        });
      });

      context("Check equipment and materials from MPI created with API are present", () => {
        it("Select Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Check description of step #1 in LHRs", () => {
          cy.xpath("//div[@data-cy=\"mpi-procedure-built-in.description\"]/../div[2]")
            .should("have.text", "Description of MPI step created with API");
        });

        it("Check materials of step #1 in LHRs #2", () => {
          cy.get("[data-cy=\"form.builder.lhrs.procedure.materials.title\"]")
            .eq(0)
            .should("have.text", "MT-00004 - Material one - rev 1 | Qty: 8 sets");
        });

        it("Check equipment of step #1 in LHRs #2", () => {
          cy.get("[data-cy$=\"equipment.title\"]")
            .eq(0)
            .should("have.text", "ET-00003 - Equipment one - rev 1");
        });

        it("Verify status is completed", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
        });
      });
    });

    context("Navigate to LHR to release it", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify completion date of LHRs #1 in LHR", () => {
        cy.get("[data-cy=\"form.builder.step.complete\"]").eq(0)
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Completed"]);
          });
      });

      it("Verify completion date of LHRs #2 in LHR", () => {
        cy.get("[data-cy=\"form.builder.step.complete\"]").eq(1)
          .invoke("text")
          .then((text) => {
            expect(text).to.be
              .oneOf(["Completed"]);
          });
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Release LHR", () => {
      it("Submit LHR for approval", () => {
        SystemRequirement("REQ-3300");
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve LHR", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
        cy.unClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Verify revision is specified on conneted Part document", () => {
        SystemRequirement("REQ-3330");
        cy.get("[data-cy=\"lhr-selected-part\"]")
          .should("have.attr", "value", "MT-00004 - rev 1 - Material one");
      });
    });

    context("Verify anyone can revise completed LHR", () => {
      context("Login admin user", () => {
        it(`Logout user '${USERS[1].name}'`, () => {
          cy.authLogout();
        });

        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
        });
      });

      context("Revise LHR", () => {
        it("Navigate to LHR", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.visit(lhrDocUrl);
          });
        });

        it("Click Revise on LHR", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy=\"updateRecord\"]").arrowClick();
          });
        });

        it("Check lot number", () => {
          cy.get("#HeaderInfo-subtitle").should("have.text", " - LOT #" + lotDateSuffix + "02RD");
        });
      });

      context("Release LHR", () => {
        it("Select Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add owner to approver list", () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().arrowClick().wait(500);
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
          });
          cy.listLoadingElementShouldNotExist();
        });

        it("Click save document", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PatchDocRev], () => {
              cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
            });
          cy.checkToastMessage({ exists: false });
          cy.listLoadingElementShouldNotExist();
        });

        it("Complete step", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
          });
          cy.listLoadingElementShouldNotExist();
        });

        it("Approve step", () => {
          SystemRequirement("REQ-3260");
          cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
          cy.unClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
            CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.checkToastMessage({ exists: false });
          cy.listLoadingElementShouldNotExist();
        });
      });
    });

    context("Verify LHRt is on document list", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter document list by title 'LHRt document'", () => {
        cy.dlFilterByDocTitle({ docTitle: "LHRt document" });
      });

      it("Verify LHRt document is present on list", () => {
        SystemRequirement("REQ-3360");
        cy.dlVerifyFilterByDocTitle({ docTitle: "LHRt document" });
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });
  });
});

export { };

