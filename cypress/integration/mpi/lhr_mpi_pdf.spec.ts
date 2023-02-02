// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, lotDocumentIdRef, lotIdRef, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let developersGroup;
let materialsDocument2;
let equipmentDocument3;
let materialsDocument3;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let equipmentDocument2;
let mpiDocument;
let mpiDocumentType;
let createdPartDocument;
let lhrDocUrl;
let formDocumentType;
let CSLDocumentType;
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;
let lhrDocId;
let lotDocumentId;
let emailsFromInbox;
let createdLotsFormDocument;

const pages = ["", "", "", "", ""];
const delay1 = 5000;

context("Autosave LHR", () => {
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
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
      cy.get("div[id^=react-select]").contains("Component Specification Lot").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "Component specification lot document" });
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12").unClick();
    });

    it("Enter Usable Quantity", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("13").unClick();
    });

    it("Select 'Material one' for Part lot", () => {
      cy.get("[data-cy=\"lot_part\"]").arrowClick();
      cy.get("[data-cy=\"lot_part\"]").autocompleteSelect("Material one");
      cy.unClick();
    });

    it("Add 'Material one' in reference", () => {
      cy.drSelectReferences("Material one");
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
    });

    it("Add 'Expiry Date'", () => {
      cy.xpath("//input[@name]/ ../div/button").arrowClick();
      cy.get("button.MuiPickersDay-current").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve record", () => {
      cy.ebApproveWithoutApi();
    });

    it(`Verify status is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
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
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Material one" });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment one" });
        });
      });

      context("Release MPI", () => {
        it("Click save document", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
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
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Select field", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).arrowClick({ force: true });
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("option1", "option2", "option3");
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
        cy.fbSelectCheckboxValue("includeNone", "includeContext");
        cy.fbAddNewFieldButton();
      });

      it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).arrowClick({ force: true });
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get(`input[name="validators.required_if"]`).check();
        cy.get(`[data-cy="validators.required_if.name"]`).click().focused().autocompleteSelect("Select field" );
        cy.unClick();
        cy.get(`[id="mui-component-select-validators.required_if.value"]`).arrowClick();
        cy.get(`[data-value="includeNone"]`).click().focused().autocompleteSelect("None");
        cy.unClick();
        cy.fbAddNewFieldButton();
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowClick();
        cy.get("[data-cy=\"lhr-selected-part\"]").autocompleteSelect("Part document");
        cy.unClick();
      });

      it("Add 'Part document' in reference", () => {
        cy.drSelectReferences("Part document");
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Select created MPI in LHR template", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Select MPI document for step #1 in LHRt", () => {
        cy.get(`[name^="lhrstep-built-in"]`).arrowClick({ force: true });
        cy.get(`[name^="lhrstep-built-in"]`).autocompleteSelect("MPI document");
        cy.unClick();
      });

      it("Click save document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Add another step with different MPI on document ", () => {
      it("Add LHR step", () => {
        cy.get("[data-cy=\"form.builder.add.step\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select MPI document created with API for step #2 in LHRt", () => {
        cy.get(`[name^="lhr-step"]`).arrowClick({ force: true });
        cy.get("input[data-cy^=\"lhr-step\"]").autocompleteSelect("MPI created with API");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify indicator for parametrized Material", () => {
        cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]")
          .should("have.text", "A: Material one | Qty: None ");
        cy.get("[data-cy=\"form.builder.mpi.procedure.materials.title.id\"]").parent().parent()
          .should("have.css", "background-color", "rgb(252, 222, 222)");
      });

      it("Verify indicator for parametrized Equipment", () => {
        cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]")
          .should("have.text", "B: Equipment one ");
        cy.get("[data-cy=\"form.builder.mpi.procedure.equipment.title.id\"]").parent().parent()
          .should("have.css", "background-color", "rgb(252, 222, 222)");
      });
    });
  });

  context("Save and send email notification", () => {
    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
      cy.arCheckTitleInEditableAndMatches({ name: "LHRt document" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        lhrDocId = $docIdElement.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for LHRt notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${lhrDocId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${lhrDocId}${fileTimeFormat}_draft.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${lhrDocId}-1-LHRt-document.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${lhrDocId}-1-LHRt-document.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 for LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nLHRt document description/);

        expect(el).match(/Output Document Type\nLot History Record Test/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        expect(el).match(/Part to be Manufactured\nCS-00005 - Part document/);

        expect(el).match(/Initial Quantity/);

        expect(el).match(/End Quantity/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Due Date/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 of LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {

        tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/LHR STEP #1\nPI-00002 - MPI document/);

        expect(el).match(/Materials\nA: Material one/);

        expect(el).match(/Equipment\nB: Equipment one/);

        expect(el).match(/LHR STEP #2\nPI-00008 - MPI created with API/);

        expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 1 sets/);

        expect(el).match(/MT-00006 - Material two \| Qty: 2 boxes/);

        expect(el).match(/Equipment\nET-00003 - Equipment one/);

        expect(el).match(/ET-00007 - Equipment two/);

        expect(el).match(/Select field\nTEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");

        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");

        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 of LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {

        tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Add parameter materials and equipment", () => {
    it("Add material parameter", () => {
      cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
        .eq(0).arrowClick().wait(500);

      cy.get(`[data-cy="title"]`).arrowClick().wait(500);
      cy.get(`[data-cy="title"]`).autocompleteSelect("Material one");
      cy.unClick();

      cy.get("input[name=\"quantity\"]").arrowType("0.6").wait(500);
      cy.unClick();
      cy.get("[data-cy=\"unit\"]").autocompleteSelect("Day(s)");
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
    });

    it("Add equipment parameter", () => {
      cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeSmall']")
        .eq(1).arrowClick().wait(500);

      cy.get(`[data-cy="title"]`).arrowClick().wait(500);
      cy.get(`[data-cy="title"]`).autocompleteSelect("Equipment one");
      cy.unClick();

      cy.get("[data-cy=\"form.builder.save\"]").arrowClick().wait(500);
    });
  });

  context("Release LHRt", () => {
    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release LHRt document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify form Released status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
      cy.arCheckTitleInEditableAndMatches({ name: "LHRt document" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        lhrDocId = $docIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for  LHRt notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${lhrDocId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${lhrDocId}${fileTimeFormat}_rel.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${lhrDocId}-1-LHRt-document.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${lhrDocId}-1-LHRt-document.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 for LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nLHRt document description/);

        expect(el).match(/Output Document Type\nLot History Record Test/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        expect(el).match(/Part to be Manufactured\nCS-00005 - Part document/);

        expect(el).match(/Initial Quantity/);

        expect(el).match(/End Quantity/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Due Date/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 of LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        expect(el).match(/LHR STEP #1\nPI-00002 - MPI document/);

        expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 0.6 days/);

        expect(el).match(/LHR STEP #2\nPI-00008 - MPI created with API/);

        expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 1 sets/);

        expect(el).match(/MT-00006 - Material two \| Qty: 2 boxes/);

        expect(el).match(/Equipment\nET-00003 - Equipment one/);

        expect(el).match(/ET-00007 - Equipment two/);

        expect(el).match(/Select field\nTEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 of LHRt", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Create a new LHR", () => {
    it("Click create a new LHR from LHRt", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Verify LHR title", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `LHRLHR-00004${lotDocumentIdRef}02 Rev AWIP`,
        breadcrump: true,
      });
    });

    it("Verify current released part is 'rev 1'", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]")
        .should("have.attr", "value", "CS-00005 - rev 1 - Part document");
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check lot number", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `${lotDocumentIdRef}02`,
        breadcrump: false,
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("50.1");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("Add 'Due Date'", () => {
      cy.xpath("//input[@name]/ ../div/button").arrowClick();
      cy.get("button.MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select option1 checked", () => {
      cy.get(`[id^="mui-component-select-select-field"]`).arrowClick({ force: true });
      cy.get("[data-value=\"option1\"]").wait(1000).arrowClick();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Check lot number", () => {
    it("Navig to LHR", () => {
      cy.navigToLHRWithoutAPI();
    });

    it("Click open LHR", () => {
      cy.get(`tr.k-master-row`).first().contains(lotIdRef + "02RD").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check lot number", () => {
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      cy.verifyListItemExistsOnHeader({
        listItem:
            `${lotDocumentIdRef}02RD`,
        breadcrump: false,
      });
    });
  });

  context("Start LHRs #1 and Save it", () => {
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.get(`div[class^="MuiExpansionPanelSummary"]`).eq(0).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Upload attachment 'test_image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.drClickSaveWithoutApiCall();
    });

    it("Verify LHRs title", () => {
      cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center"]`).last()
        .should("contain", lotIdRef + "02RD")
        .and("contain", "LHR-00004")
        .and("contain", "CS-00005.1")
        .and("contain", "Part document");
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("8.1").unClick();
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("10.8").unClick();
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("3.2").unClick();
    });

    it("Click 'SELECT' for 'Material One'", () => {
      cy.lhrSelectMaterial({
        selectElement: 0,
        lot: lotIdRef + "01",
        quantity: `0.5`,
      });
    });

    it("Click 'SELECT' for 'Equipment One'", () => {
      cy.lhrSelectEquipment({
        selectElement: 0,
        equipment: `Equipment one`,
      });
    });

    it("Verify LOT is selected for 'Material One'", () => {
      cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
        .should("contain.text", lotIdRef + "01");
    });

    it("Verify Equipment is selected for 'Equipment one'", () => {
      cy.get("div[data-cy=\"form.builder.mpi.part.selection.equipment\"]")
        .should("have.text", "ET-00003");
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();

      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
    });
  });

  context("Navigate back to LHR and Send to email", () => {
    it("Navig to LHR", () => {
      cy.navigToLHRWithoutAPI();
    });

    it("Click open LHR", () => {
      cy.get(`tr.k-master-row`).first().contains(lotIdRef + "02RD").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check doc status for WIP and click on Send To Email", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `LHRLHR-00004${lotDocumentIdRef}02RD Rev AWIP`,
        breadcrump: true,
      });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("contain.text", "LHR").then(($docIdElement) => {
        lhrDocId = $docIdElement.text();
      });

      cy.get("#HeaderInfo-subtitle").should("contain.text", "LOT").then(($docIdElement) => {
        lotDocumentId = $docIdElement.text().replace("-", "").trim();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    context("Verify email for LHR notification", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${lhrDocId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          if (emails) {
            emailsFromInbox = emails;
            expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
          }
          else {
            assert.fail("No email found");
          }
        });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[1].email,
            contains: [`Hello <b>${USERS[1].name},</b>`,
              "Your documents are ready for download.",
              "<button type=\"button\">DOWNLOAD</button>",
              createdCompany.id],
          }];
        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });

    context("Verify that zip file containing pdf downloaded", () => {
      SystemRequirement("REQ-4860");
      it("Download zip file", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${lhrDocId}${fileTimeFormat}_WIP.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("Verify file size of the downloaded zip file", () => {
        const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
        cy.readFile(zipfile).its("length").should("be.gt", 500);
      });

      it("unzip and extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
          `${lhrDocId}-A.pdf`);
        cy.readFile(pdffile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length for image.jpg is more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length for test_image.jpg is more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "LHR Step 1", "test_image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content", () => {
      it("Extract texts from PDF file content", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${lhrDocId}-A.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(3);
          expect(cdata.text).match(/Page 1 of 3/);
          expect(cdata.text).match(/Page 2 of 3/);
          expect(cdata.text).match(/Page 3 of 3/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 3")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 3")) {
              pages[1] = element;
            }
            if (element.includes("Page 3 of 3")) {
              pages[2] = element;
            }
          });
        });
      });

      it("Verify page 1 for LHR", () => {
        SystemRequirement("REQ-4850", "REQ-4880");
        const el = pages[0];
        if (el.includes("Page 1 of 3")) {
          tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Part to be Manufactured\nCS-00005 - 1 Part document/);

          expect(el).match(/Initial Quantity\n50.1/);

          expect(el).match(/End Quantity/);

          tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `Due Date\n${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          expect(el).match(/LHR STEP #1\nLHR-00004, Step #1 \(PI-00002, MPI document, Rev 1\)/);

          tmpRegex = new RegExp( `Step started \\| ${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);

          expect(el).match(/test_image.jpg/);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 3/);
        }
      });

      it("Verify page 2 of LHR", () => {
        SystemRequirement("REQ-4850", "REQ-4880");
        const el = pages[1];
        if (el.includes("Page 2 of 3")) {
          tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
          expect(el).match(tmpRegex);

          expect(el).match(/PI PROCEDURE\nMaterials/);

          tmpRegex = new RegExp(`${lotIdRef}01 \\| MT-00004.1 \\| 0.5 days`);
          expect(el).match(tmpRegex);

          expect(el).match(/Equipment\nET-00003 - Equipment one - rev 1/);

          expect(el).match(/Start quantity\n8.1/);

          expect(el).match(/Accepted quantity\n10.8/);

          expect(el).match(/Rejected quantity\n3.2/);

          tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| DRAFT`);
          expect(el).match(tmpRegex);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`MT-00004 - Material one - rev 1 \\| Qty: 4.859999999999999 days`);
          expect(el).match(tmpRegex);

          expect(el).match(/APPROVALS\nNone/);

          expect(el).match(/Select field\noption1/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 3/);
        }
      });

      it("Verify page 3 of LHR", () => {
        SystemRequirement("REQ-4850", "REQ-4880");
        const el = pages[2];
        if (el.includes("Page 3 of 3")) {
          tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
          expect(el).match(tmpRegex);

          expect(el).match(/LHR STEP #2\nPI-00008 - MPI created with API/);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 3 of 3/);
        }
      });
    });
  });

  context("Navigate to LHR #1 and Complete it", () => {
    it("Navigate to LHR #1", () => {
      cy.visit(lhrDocUrl);
      cy.listLoadingElementShouldAppear();
    });

    it("Complete LHR Step #1 ", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve step", () => {
      cy.ebApproveWithoutApi();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Start LHRs #2 'Save and Complete it'", () => {
    it("Navig to LHR", () => {
      cy.navigToLHRWithoutAPI();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.get(`div[class^="MuiExpansionPanelSummary"]`).eq(1).arrowClick({ force: true });
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Verify LHRs title", () => {
      cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center"]`).last()
        .should("contain", lotIdRef + "02RD")
        .and("contain", "LHR-00004")
        .and("contain", "CS-00005.1")
        .and("contain", "Part document");
    });

    it("Upload attachment 'test.docx'", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Enter 'Start quntity' for LHRs #2", () => {
      cy.drSelectProcedureTab();
      cy.listLoadingElementShouldNotExist();
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("80.1").unClick();
    });

    it("Enter 'Accepted quntity' for LHRs #2", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("10.8").unClick();
    });

    it("Enter 'Rejected quntity' for LHRs #2", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("80.1").unClick();
    });

    it("Click 'SELECT' for 'Material One'", () => {
      cy.lhrSelectMaterial({
        selectElement: 0,
        lot: lotIdRef + "01",
        quantity: `10.5`,
      });
    });

    it("Click 'SELECT' for 'Equipment One'", () => {
      cy.lhrSelectEquipment({
        selectElement: 2,
        equipment: `Equipment one`,
      });
    });

    it("Verify LOT is selected for 'Material One'", () => {
      cy.get("div[data-cy=\"form.builder.lhrs.procedure.materials.title\"]").eq(0).parent()
        .should("contain.text", lotIdRef + "01");
    });

    it("Verify Equipment is selected for 'Equipment one'", () => {
      cy.get("div[data-cy=\"form.builder.mpi.part.selection.equipment\"]")
        .should("have.text", "ET-00003");
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();

      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
    });

    it("Complete step # 2", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Click 'Approve' button", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Release LHR", () => {
    it("Navig to LHR", () => {
      cy.navigToLHRWithoutAPI();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Click open LHR", () => {
      cy.get(`[data-grid-row-index="0"]`).eq(0).contains(lotIdRef + "02RD").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("check Initial quntity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").should("have.value", "50.1");
    });

    it("check End quntity", () => {
      cy.get("[name=\"lhr-end-quantity\"]").should("have.value", "10.8");
    });

    it("check build type", () => {
      cy.get("[name=\"lhr-build-type\"]").should("be.checked");
    });

    it("check due date", () => {
      cy.get("[name=\"lhr-due-date\"]").invoke("val").should("be.exist");
    });

    it("Add first Approver'", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Add second Approver'", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
    });

    it("Remove second Approver'", () => {
      cy.pmDeleteApproverFromApproverList({ approver: `${USERS[2].name} - ${USERS[2].email}` });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("check approvers", () => {
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("check Initial quntity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").should("have.value", "50.1");
    });

    it("check End quntity", () => {
      cy.get("[name=\"lhr-end-quantity\"]").should("have.value", "10.8");
    });

    it("check build type", () => {
      cy.get("[name=\"lhr-build-type\"]").should("be.checked");
    });

    it("check due date", () => {
      cy.get("[name=\"lhr-due-date\"]").invoke("val").should("be.exist");
    });
  });

  context("Approve to Release Document", () => {
    it("Submit for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.wait(delay1);
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.lhrApproveWithoutApi();
      cy.wait(delay1);
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Check doc status for Released", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `LHRLHR-00004${lotDocumentIdRef}02RD Rev ARELEASED`,
        breadcrump: true,
      });

      cy.get("#HeaderInfo-subtitle").should("contain.text", "LOT").then(($docIdElement) => {
        lotDocumentId = $docIdElement.text().replace("-", "").trim();
      });
    });
  });

  context("Send to email", () => {
    it("Click on Send To Email", () => {
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for  LHR notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${lhrDocId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${lhrDocId}${fileTimeFormat}_rel.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${lhrDocId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length for test_image.jpg is more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "LHR Step 1", "test_image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length for test.docx is more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "LHR Step 2", "test.docx");
      cy.readFile(attachedFile).its("length").should("be.gt", 10);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${lhrDocId}-A.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(4);
        expect(cdata.text).match(/Page 1 of 4/);
        expect(cdata.text).match(/Page 2 of 4/);
        expect(cdata.text).match(/Page 3 of 4/);
        expect(cdata.text).match(/Page 4 of 4/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 4")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 4")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 4")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 4")) {
            pages[3] = element;
          }
        });
      });
    });

    it("Verify page 1 for LHR", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);
        expect(el).match(/image\.jpg/);

        expect(el).match(/Part to be Manufactured\nCS-00005 - 1 Part document/);

        expect(el).match(/Initial Quantity\n50\.1/);

        expect(el).match(/End Quantity\n10\.8/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `Due Date\n${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/LHR STEP #1\nLHR-00004, Step #1 \(PI-00002, MPI document, Rev 1\)/);

        tmpRegex = new RegExp( `Step completed \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/test_image.jpg/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);
      }
    });

    it("Verify page 2 of LHR", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
        expect(el).match(tmpRegex);

        expect(el).match(/PI PROCEDURE\nMaterials/);

        tmpRegex = new RegExp(`MT-00004 - Material one - rev 1 \\| Qty: 4.859999999999999 days`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${lotIdRef}01 \\| MT-00004.1 \\| 0.5 days`);
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nET-00003 - Equipment one - rev 1/);

        expect(el).match(/Start quantity\n8\.1/);

        expect(el).match(/Accepted quantity\n10\.8/);

        expect(el).match(/Rejected quantity\n3\.2/);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| APPROVED \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Select field\noption1/);

        expect(el).not.match(/TEXT FIELD/);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| APPROVED \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);
      }
    });

    it("Verify page 3 of LHR", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
        expect(el).match(tmpRegex);

        expect(el).match(/LHR STEP #2\nLHR-00004, Step #2 \(PI-00008, MPI created with API, Rev 1\)/);

        tmpRegex = new RegExp( `Step completed \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);
        expect(el).match(/test.docx/);

        expect(el).match(/PI PROCEDURE\nMaterials/);

        expect(el).match(/MT-00004 - Material one - rev 1 \| Qty: 80\.1 sets/);

        tmpRegex = new RegExp(`${lotIdRef}01 \\| MT-00004.1 \\| 10.5 sets`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`MT-00006 - Material two - rev 1 \\| Qty: 160\\.2 boxes`);
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nET-00003 - Equipment one - rev 1/);
        expect(el).match(/ET-00007 - Equipment two - rev 1/);

        expect(el).match(/Start quantity\n80\.1/);

        expect(el).match(/Accepted quantity\n10\.8/);

        expect(el).match(/Rejected quantity\n80\.1/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);
      }
    });

    it("Verify page 4 of LHR", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new RegExp( `Lot History Record Test\n${lotDocumentId}\nCS-00005, REV 1, PART DOCUMENT`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- (.*) \\| APPROVED \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: LHRT-00003, Revision 1, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);
      }
    });
  });
});
export { };
