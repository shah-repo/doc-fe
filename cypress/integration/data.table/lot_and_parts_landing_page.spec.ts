/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let partDocumentType;
let createdPartDocument;
let createdPartDocument2;
let createdPartDocument3;
let developersGroup;
let formDocumentType;
let createdLotsFormDocument;
let CSLDocumentType;
let createdLot;
let partsPageDetailsId;

const lot = "LOT #";
const state = "STATE";
const partNumberRev = "PART NUMBER/REV";
const initialQuantity = "INITIAL QUANTITY";
const template = "TEMPLATE";
const rev = "REVISION";
const partId = "PART ID";
const title = "TITLE";
const owner = "OWNER";
const arId = "AR ID";
const status = "STATUS";
const effectiveDate = "EFFECTIVE DATE";

context("Test Lots and Parts landing page", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/document_revisions/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(100);
      });
    }).as("Search");
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
              EngineeringBuild,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
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

    it("[API]Create part document", (done: any) => {
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
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00005",
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
      });
    });

    it("[API]Create Part document 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document2</p>",
          document: {
            docId: "PRT-00006",
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
          name: "Part document2",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument2.id,
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

    it("[API]Create Part document 3", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document2</p>",
          document: {
            docId: "PRT-00007",
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
          name: "Part document3",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument3 = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument3.id,
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
            "lot_part": createdPartDocument.id,
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
            "lot_part": createdPartDocument.id,
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

    it("[API]Create Lot record3", (done: any) => {
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
            "lot_part": createdPartDocument.id,
            "100-inspection-override": [
              "100% Inspection Override",
            ],
          },
          description: "",
          name: "API LOT 3",
          attachments: [],
          referenceTo: [],
          revisionStage: 3,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "LOT #22041303",
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
      }).then(() => done());
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
          employees: [{ id: adminEmployee.id }],
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
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Parts",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          partsPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: partsPageDetailsId,
          payload: {
            columns: [
              {
                label: "PART ID",
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
                label: "TITLE",
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
                label: "AR ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "changeRequest.crId",
                showOnAndroid: true,
              },
              {
                label: "Status",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                label: "EFFECTIVE DATE",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "effectiveDate",
                showOnAndroid: true,
              },
            ],
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

  context("Verify Lots landing page", () => {
    it("Navigate to lots", () => {
      cy.navigToLots();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${lot}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${state}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${partNumberRev}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${initialQuantity}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${template}`);
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[id="DocumentByTypeListPresenter-openDocRev"]`)
        .should("have.text", "Add new Lot")
        .and("exist");
    });

    it(`Verify drag and drop State header on first slot`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "LOT");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });

      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "LOT");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it(`Column grouping should be displayed`, () => {
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
      cy.unClick();
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("have.length", "2");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.wait(2000);
    });

    it(`Verify Lot can be opened`, () => {
      cy.dlSelectFirstDocument();
      cy.arVerifyStatus({ status: "WIP" });
    });

    it(`Verify LOT count`, () => {
      cy.navigToLots();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get("tr.k-master-row").should("have.length", 3);
    });

    context("Verify filters on each field", () => {
      it("Verify filter for LOT #", () => {
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="1"] input`).arrowType("LOT #22041303");
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "LOT #22041303");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for State", () => {
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("WIP").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "WIP");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Part Number/Rev", () => {
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="3"] input`).arrowType("PRT-00005");
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "PRT-00005");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Initial Quantity", () => {
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).arrowType("5");
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "5");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Template", () => {
        cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="5"] input`).arrowType("FM-00008");
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "FM-00008");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify clear filters", () => {
        cy.trClearFilters();
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      });
    });

    context("Verify hide and freeze", () => {
      it("Verify hide on State", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${state}`);
        cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Hide Column").arrowClick();
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${state}`);
      });

      it("Verify unhide on State", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${state}`);
        cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
        cy.get("ul>li[role=menuitem]").contains(`${state}`).parents("li").find("svg").arrowClick();
        cy.get("body").type("{esc}");
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${state}`);
      });

      it("Verify freeze on State", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${state}`);
        cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${state}`);
      });

      it("Verify un-freeze on State", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${state}`);
        cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${state}`);
      });
    });

    context("Verify dropdown filters", () => {
      it("Verify LOT # dropdown filters", () => {
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      });

      it(`Verify LOT # "Does not contain" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
        cy.get(`th[aria-colindex="1"] input`).arrowType("1");
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Is equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
        cy.get(`th[aria-colindex="1"] input`).arrowType("LOT #22041303");
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Is not equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
        cy.get(`th[aria-colindex="1"] input`).arrowType("LOT #22041303");
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Starts with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
        cy.get(`th[aria-colindex="1"] input`).arrowType("LOT #2204130");
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Ends with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
        cy.get(`th[aria-colindex="1"] input`).arrowType("1");
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Is null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is null").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Is not null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });


      it(`Verify LOT # "Is empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });

      it(`Verify LOT # "Is not empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });
    });

    context("Verify select field filter", () => {
      it(`Verify filter is disabled on default select field`, () => {
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).should("have.attr", "disabled");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("WIP").arrowClick();
        cy.landingPageLoadingElementShouldAppear();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "WIP");
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).should("not.have.attr", "disabled");
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).arrowClick();
        cy.landingPageLoadingElementShouldAppear();
      });
    });
  });

  context("Verify Parts landing page", () => {
    it("Navigate to parts landing page", () => {
      cy.navigToParts();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${partId}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${title}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${arId}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${status}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${effectiveDate}`);
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[id="DocumentByTypeListPresenter-openDocRev"]`)
        .should("have.text", "Add new Part")
        .and("exist");
    });

    it(`Verify drag and drop Revision header on first slot`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "PRT");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });

      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "PRT");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it(`Column grouping should be displayed`, () => {
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
      cy.unClick();
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("have.length", "1");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get("tr.k-grouping-row").should("not.exist");
    });

    it(`Verify Part can be opened`, () => {
      cy.dlSelectFirstDocument();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it(`Verify Parts count`, () => {
      cy.navigToParts();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get("tr.k-master-row").should("have.length", 3);
    });
  });

  context("Verify filters on each field", () => {
    it("Verify filter for PART ID", () => {
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="1"] input`).arrowType("PRT-00007");
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "PRT-00007");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for Revision", () => {
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="2"] input`).arrowType("1");
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "1");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for TITLE", () => {
      cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="3"] input`).arrowType("Part document3");
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "Part document3");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for Owner", () => {
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="4"] input`).arrowType(USERS[1].name);
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", USERS[1].name);
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for AR ID", () => {
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="5"] input`).arrowType("AR-00003");
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "AR-00003");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for Status", () => {
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="6"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Released").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "Released");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify filter for EFFECTIVE DATE", () => {
      cy.get(`th[aria-colindex="7"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="7"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="7"] span.k-input`).should("have.text", "Last 7 days");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Verify clear filters", () => {
      cy.trClearFilters();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="7"] span.k-input`).should("have.text", "All");
    });
  });

  context("Verify hide and freeze", () => {
    it("Verify hide on Revision", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${rev}`);
      cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${rev}`);
    });

    it("Verify unhide on Revision", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${rev}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains(`${rev}`).parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${rev}`);
    });

    it("Verify freeze on Revision", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${rev}`);
      cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${rev}`);
    });

    it("Verify un-freeze on Revision", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${rev}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${rev}`);
    });
  });

  context("Verify dropdown filters", () => {
    it("Verify PART ID dropdown filters", () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
    });

    it(`Verify PART ID "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("7");
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PRT-00007");
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PRT-00007");
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PRT-0000");
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("7");
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });


    it(`Verify PART ID "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });

    it(`Verify PART ID "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });
  });

  context("Verify select field filter", () => {
    it(`Verify filter is disabled on default select field`, () => {
      cy.get(`th[aria-colindex="6"] button[title="Clear"]`).should("have.attr", "disabled");
      cy.get(`th[aria-colindex="6"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Released").arrowClick();
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "Released");
      cy.get(`th[aria-colindex="6"] button[title="Clear"]`).should("not.have.attr", "disabled");
      cy.get(`th[aria-colindex="6"] button[title="Clear"]`).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });
  });
});

