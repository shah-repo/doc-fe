import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let developersGroup;
let poPageDetailsId;
let formDocumentType;
let createdPOFormDocument;
let purchaseOrderDocumentType;
let createdPODocument;
let createdSupplierFormDocument;
let createdSupplierDocument;
let supplierDocumentType;
let approvalRequestDocumentType;

const PURCHASE_ORDER = "Purchase Order";
const PO_FORM_DOCUMENT = "PO Form document";
const TITLE = "API PO document";
const groupOne = "Developers";
const COLUMN_HEADERS = [
  "PO #",
  "REVISION",
  "PO STATUS",
  "PO STATE",
  "SUPPLIER",
  "PART NUMBER",
  "AMOUNT",
  "REQUESTOR",
  "ORDER DATE",
];
const supplierDocName = "SUP-00001 - rev 1 - API Supplier Document";

context(
  `As a user, if I revise a PO and select Admin change (dot release), then the system should not automatically
add the requestor to the approvals field`,
  () => {
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
      it("[API]Create company", (done: any) => {
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
              documentTypes: [],
            },
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
            purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PURCHASE_ORDER);
            supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
            approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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
          groupName: groupOne,
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
            tags: [
              ...developersGroup.body[0].tags,
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
                icon: "/navigation_icons/receipt_list.svg",
                type: "CATEGORY",
                label: "Purchase Orders",
                category: "Purchase Order",
                restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
              },
            ],
          },
        }).then(() => {
          done();
        });
      });
    });
    context("[API]create supplier", () => {
      it("[API]Create Supplier form", (done: any) => {
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
                description: "<p>Supplier Form document</p>",
                document: {
                  docId: "FM-00010",
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
                name: "supplier form",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: supplierDocumentType[0].id,
                  }],
                  schema: [],
                },

              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdSupplierFormDocument = response;
              cy.drAPIApproveAndRelease({
                documentId: createdSupplierFormDocument.id,
                payload: {
                  effectiveDate: (new Date()).toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                  approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.poAPICreatePO({
                  payload: {
                    name: "API Supplier Document",
                    attachments: [],
                    referenceTo: [],
                    formDocument: { id: createdSupplierFormDocument.id },
                    description: "API Supplier document",
                    revisionChangeType: RevisionChangeType.NextRevision,
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
                  },
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
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
                  }).then(() => {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    context("Login admin user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("[API] Patch page details", (done: any) => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/page_details`,
          qs: {
            category: "Purchase Order",
          },
          headers: {
            Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
          },
        })
          .then((response) => {
            if (response.body) {
              poPageDetailsId = response.body[0].id;
            }
          })
          .then(() => {
            cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
            cy.cmpUpdatePageDetails({
              id: poPageDetailsId,
              payload: {
                columns: [
                  {
                    label: COLUMN_HEADERS[0],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "document.docId",
                    showOnAndroid: true,
                  },
                  {
                    fn: "DOCUMENT_REVISION_VERSION",
                    label: COLUMN_HEADERS[1],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.version",
                    sourcePath: ["revisionStage:revision"],
                    showOnAndroid: true,
                  },
                  {
                    fn: "PO_STATUS_FROM_PURCHASE_ORDER",
                    label: COLUMN_HEADERS[2],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.po_status",
                    sourcePath: ["formDocument.formTemplate.schema"],
                    showOnAndroid: true,
                  },
                  {
                    label: COLUMN_HEADERS[3],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "displayStatus",
                    showOnAndroid: true,
                  },
                  {
                    fn: "SUPPLIER_NAME_FROM_PURCHASE_ORDER",
                    label: COLUMN_HEADERS[4],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.supplier",
                    sourcePath: ["formDocument.formTemplate.schema"],
                    showOnAndroid: true,
                  },
                  {
                    fn: "PO_PART_NUMBER_FROM_PURCHASE_ORDER",
                    label: COLUMN_HEADERS[5],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.po_partNumber",
                    sourcePath: ["formDocument.formTemplate.schema"],
                    showOnAndroid: true,
                  },
                  {
                    fn: "PO_AMOUNT_FROM_PURCHASE_ORDER",
                    label: COLUMN_HEADERS[6],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.po_amount",
                    sourcePath: ["formDocument.formTemplate.schema"],
                    showOnAndroid: true,
                  },
                  {
                    fn: "USER_NAME",
                    label: COLUMN_HEADERS[7],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.requestor-k740hxlb",
                    sourcePath: ["formInput.requestor-k740hxlb", "formInput.po-requestor-autocomplete"],
                    showOnAndroid: true,
                  },
                  {
                    fn: "DATE_FORMAT_MM_DD_YYYY",
                    label: COLUMN_HEADERS[8],
                    fieldName: "irrelevant",
                    showOnWeb: true,
                    valuePath: "precalc.order-date-formatted",
                    sourcePath: ["formInput.ordered-k6mlhan7", "formInput.po-order-date"],
                    showOnAndroid: true,
                  },
                ],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
      });

      it("Login user to dashboard", () => {
        cy.authLogout();
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context("Create Purchase Order Document", () => {
      it("[API]Create PO document", (done: any) => {
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
                description: `<p>${PO_FORM_DOCUMENT}</p>`,
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
                name: `${PO_FORM_DOCUMENT}`,
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [
                    {
                      id: purchaseOrderDocumentType[0].id,
                    },
                  ],
                  schema: [
                    {
                      name: "po-status-built-in",
                      type: "select",
                      index: 0,
                      label: "PO Status",
                      tabId: "details",
                      options: [
                        {
                          text: "Open",
                          value: "Open",
                        },
                        {
                          text: "Closed",
                          value: "Closed",
                        },
                        {
                          text: "Cancelled",
                          value: "Cancelled",
                        },
                      ],
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                      deleteDisabled: true,
                      validationAttribute: "PO Status",
                      deleteInFormDisabled: true,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "po-supplier-built-in",
                      type: "supplier",
                      index: 1,
                      label: "Supplier ",
                      tabId: "details",
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                      deleteDisabled: true,
                      validationAttribute: "Supplier",
                      deleteInFormDisabled: true,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "po-items-built-in",
                      type: "purchaseorder",
                      index: 2,
                      label: "Purchase Order",
                      tabId: "lineitems",
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                      deleteDisabled: true,
                      validationAttribute: "Purchase Order",
                      deleteInFormDisabled: true,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "po-requestor-autocomplete",
                      type: "autocomplete",
                      index: 3,
                      label: "Requestor",
                      tabId: "details",
                      rules: "required",
                      hidden: false,
                      deleted: false,
                      optionId: "3",
                      placeholder: "[Select requestor here]",
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                      deleteDisabled: false,
                      optionLabelKey: "user.email",
                      optionValueKey: "id",
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: ["deleteDisabled"],
                      validationAttribute: "Requestor",
                      deleteInFormDisabled: true,
                      applicableValidationSchema: true,
                    },
                    {
                      label: "form.builder.approvals",
                      type: "poapprovals",
                      deleteDisabled: false,
                      name: "fb-po-approvals-kqqix31p",
                      uniqueSchemaItem: true,
                      index: 4,
                      tabId: "details",
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdPOFormDocument = response;
              cy.drAPIApproveAndRelease({
                documentId: createdPOFormDocument.id,
                payload: {
                  effectiveDate: new Date().toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                  approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.poAPICreatePO({
                  payload: {
                    name: "",
                    attachments: [],
                    referenceTo: [],
                    formDocument: { id: createdPOFormDocument.id },
                    description: TITLE,
                    revisionChangeType: RevisionChangeType.NextRevision,
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
                    formInput: {
                      "po-status-built-in": "Open",
                      "po-requestor-autocomplete": adminEmployee.id,
                    },
                  },
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                }).then((response) => {
                  createdPODocument = response;
                  cy.drAPIApproveAndRelease({
                    documentId: createdPODocument.id,
                    payload: {
                      effectiveDate: new Date().toISOString(),
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
        });
      });
    });

    context("Purchase Order Landing page", () => {
      it("Navigate to Purchase Order", () => {
        cy.navigToPurchaseOrder();
      });

      it(`Filter document by status ${STATUS_TYPES_LABEL.RELEASED}, and select it`, () => {
        cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick({ force: true });
        cy.get("li").contains("RELEASED").arrowClick().wait(500);
        cy.get(`td[data-grid-col-index="3"]`).eq(0).arrowClick();
      });

      it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.verifyHeaderInfoContent({
          title: "Purchase Orders",
          docId: "PO-00001",
          revision: "Rev A",
        });
      });
    });

    context("Click 'Revise' and select Admin change", () => {
      it("Click revise on PO record", () => {
        cy.drClickReviseDocument();
      });

      it("Upgrade to administrative change", () => {
        cy.drAdministrativeRevisionLevel();
      });

      it("Clicks Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("PO is in Draft now", () => {
      it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Purchase Orders",
          docId: "PO-00001",
          revision: "Rev A",
        });
      });
    });

    context("Fill in Fields including field Requestor", () => {
      it(`Select '${USERS[2].name}' for Requestor`, () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get(`div[name^="po-requestor-autocomplete"]`)
            .find(`button[aria-label="Clear"]`).arrowClick({ force: true });
          cy.get("[data-cy^=po-requestor-autocomplete]").arrowClick();
          cy.wait(3000);
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
      });
      it("Select Supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy='po-supplier-built-in']").autocompleteSelect(supplierDocName);
          cy.unClick();
        });
      });
    });

    context(
      `Check the Approval field and verify that the system did NOT automatically added 
    the requestor to the approval field`,
      () => {
        it(`Check the Approval field does not contain requestor ${USERS[2].name}`, () => {
          cy.get("[data-cy^=fb-po-approvals]").should("not.have.text", USERS[2].name);
        });
      }
    );

    context("Insert Approver to Approval Block", () => {
      it(`Insert Approver '${USERS[1].name}' for Approval`, () => {
        cy.get("[data-cy^=fb-po-approvals]").click({ force: true });
        cy.get("ul>li[role=option]").contains(USERS[1].name).should("be.visible").click();
      });
    });

    context("Check “Backspace” and “Clear all” option will not be available in the PO approval field", () => {
      it(`Verify that “Backspace” and “Clear all” option will not be available in the PO approval field`, () => {
        cy.wait(1000);
        cy.get("[data-cy^=fb-po-approvals]").arrowClick({ force: true }).arrowType(`{backspace}`).clear();
      });
    });

    context("Submit for Approval and verify PO can be released. ", () => {
      it(`Click on Submit for approval button`, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`, () => {
        cy.verifyHeaderInfoContent({
          title: "Purchase Orders",
          status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
          docId: "PO-00001",
          revision: "Rev A.1",
        });
      });

      it("Approve PO", () => {
        cy.ebApprove();
      });
    });

    context("Verify that data is saved", () => {
      it(`Verify title is ${TITLE}`, () => {
        cy.get("[data-cy=\"BaseWithhtml-editor\"]").should("exist").contains(TITLE);
      });

      it(`Verify PO status is Open`, () => {
        cy.get("#mui-component-select-po-status-built-in").should("exist").contains("Open");
      });

      it(`Check the Requestor field contain ${USERS[2].name} - ${USERS[2].email}`, () => {
        cy.get("[data-cy^=po-requestor-autocomplete]").should("have.value", `${USERS[2].name} - ${USERS[2].email}`);
      });

      it(`Check the Approval field contain ${USERS[1].name} - ${USERS[1].email}`, () => {
        cy.get("div.Mui-disabled.MuiChip-deletable").should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      });

      it(`Check the supplier field contains ${supplierDocName}`, () => {
        cy.get("[data-cy='po-supplier-built-in']").should("have.value", supplierDocName);
      });
    });
  }
);

export { };

