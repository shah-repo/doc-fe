// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let adminEmployee;
let purchaseOrderDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let group;
let receivableDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;
let createdPartDocument2;
let createdPODocument;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";
const todaysDate = moment().tz("America/Los_Angeles");
const currentFormattedDate = moment().tz("America/Los_Angeles").format("MM/DD/YYYY");
const todaysDateFormated = moment().tz("America/Los_Angeles").format("L");
const LFPO =  {
  documentTypeName: "Lot From Purchase Order Form",
  documentTypeAcronym: "LFPO",
  group: DOC_TYPE_GROUP.FORM,
  isQms: true,
};

context("Receiving landing page test", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [
              LFPO,
              Part,
              PurchaseOrderTest,
              ReceivableTest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: SECOND_USER.email,
      }).then((response) => {
        done();
      });
    });

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
              name: SupplierFormTitle,
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

    it("[API]Create part documents", (done: any) => {
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
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part second document</p>",
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
              name: "Part second document",
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
      });
    });

    it("[API]Create PO form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO Form document</p>",
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
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "PO Form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: purchaseOrderDocumentType[0].id,
            }],
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationAttribute: "PO Status",
                applicableValidationSchema: true,
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "po-general-information-to-be-completed-by-requester-section",
                type: "section",
                index: 1,
                label: "General Information",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
              },
              {
                name: "po-requestor-autocomplete",
                type: "autocomplete",
                index: 2,
                label: "Requestor",
                tabId: "details",
                rules: "required",
                hidden: false,
                deleted: false,
                optionId: "3",
                placeholder: "[Select requestor here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                optionLabelKey: "user.email",
                optionValueKey: "id",
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [
                  "deleteDisabled",
                ],
                validationAttribute: "Requestor",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "po-supplier-built-in",
                type: "supplier",
                tabId: "details",
                index: 3,
                label: "Supplier ",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationAttribute: "Supplier",
                applicableValidationSchema: true,
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "po-order-date",
                type: "datepicker",
                index: 4,
                label: "Order Date",
                tabId: "details",
                rules: "required",
                hidden: false,
                deleted: false,
                validators: {
                  required: true,
                },
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [
                  "deleteDisabled",
                ],
                validationAttribute: "Order Date",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "po-items-built-in",
                type: "purchaseorder",
                index: 5,
                label: "Purchase Order",
                tabId: "lineitems",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                applicableValidationSchema: true,
                validationAttribute: "Purchase Order",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-po-approvals",
                type: "approvals",
                index: 6,
                label: "Approvals",
                tabId: "details",
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

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPOFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPOFormDocument.id,
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

    it("[API]Create PO", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO for receiving</p>",
          document: {
            docId: "POT-00001",
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
          formDocument: {
            id: createdPOFormDocument.id,
          },
          name: "",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "po-items-built-in": {
              tax: "0.00",
              taxRate: 9.25,
              subTotal: "2100.00",
              totalAmount: "2100.00",
              shippingCost: "0.00",
              currency: "USD",
              exchangeRate: 1,
              totalInUSD: "2100.00",
              dateOfExchangeRate: "",
              items: [
                {
                  type: "product",
                  partNumberTitle: "Part document",
                  partNumberDocId: "PRT-00005 - 1",
                  partNumber: createdPartDocument.id,
                  order: 200,
                  units: "each",
                  unitPrice: 5,
                  date: todaysDate,
                  id: "l1or09um",
                  received: 0,
                  totalAmount: "1000.00",
                  formattedDate: todaysDateFormated,
                  index: 0,
                },
                {
                  type: "product",
                  partNumberTitle: "Part second document",
                  partNumberDocId: "PRT-00006 - 1",
                  partNumber: createdPartDocument2.id,
                  order: 100,
                  units: "each",
                  unitPrice: 11,
                  date: todaysDate,
                  id: "l1or0d4o",
                  received: 0,
                  totalAmount: "1100.00",
                  formattedDate: todaysDateFormated,
                  index: 1,
                },
              ],
            },
            "fb-po-approvals": [
              adminEmployee.id,
            ],
            "po-status-built-in": "Open",
            "po-requestor-autocomplete": adminEmployee.id,
            "po-order-date": todaysDate,
            "po-supplier-built-in": createdSupplierDocument.id,
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPODocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPODocument.id,
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


    it("[API]Create Receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Document form for Receivable</p>",
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
          name: "Migration Rece form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: receivableDocumentType[0].id,
            }],
            schema: [{
              index: 0,
              type: "poreceive",
              label: "Receivable",
              tabId: "details",
              name: "receivable-test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },
            {
              label: "form.builder.approvals",
              tabId: "overview",
              type: "poapprovals",
              deleteDisabled: false,
              name: "fb-po-approvals",
              uniqueSchemaItem: true,
              index: 1,
            },

            {
              index: 2,
              type: "textfield",
              label: "Text",
              tabId: "overview",
              name: "Test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },

            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        const createdPOFormDocument: any = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPOFormDocument?.id,
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

    it("[API]Create Receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Document form for Receivable</p>",
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
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "Receivable form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: receivableDocumentType[0].id,
            }],
            schema: [{
              index: 0,
              type: "poreceive",
              label: "Receivable",
              tabId: "details",
              name: "receivable-test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },
            {
              label: "form.builder.approvals",
              tabId: "overview",
              type: "poapprovals",
              deleteDisabled: false,
              name: "fb-po-approvals",
              uniqueSchemaItem: true,
              index: 1,
            },

            {
              index: 2,
              type: "textfield",
              label: "Text",
              tabId: "overview",
              name: "Test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },

            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });


  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to Records", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
    });

    it("Turn off auto save", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "FM-00004" });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify Tab Layout for Receivable form", () => {
    it("Verify Predefined Fields Appear", () => {
      cy.verifyPredefiendFields();
      cy.get("[data-cy='field-outputDocumentTypes']").should("exist");
      cy.get("[data-cy='referenceTo']").should("exist");
    });

    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Overview tab by default and it contains", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    context("Verify Overview  Tab", () => {
      it("Verify Header Info", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Document List",
          docId: "FM-00004",
          revision: "Rev 1",
        });
      });

      it("Verify Predefiend fields and form Options", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify attachment field is visible", () => {
        cy.get("#AttachmentFieldPresenter-field").should("be.visible");
      });

      it("Verify approval field is visible", () => {
        cy.get("[data-cy='fb-po-approvals']").should("exist");
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify fields in detail Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify add field button", () => {
        cy.get("[name='porec-receivable-test']").trigger("mouseover");
        cy.get("[data-cy='form.builder.add.field']").should("exist");
        cy.get("[name='porec-receivable-test']").trigger("mouseout");
      });

      it("Click ‘Add Field' button and Form Library should be opened", () => {
        cy.get("[name='porec-receivable-test']").trigger("mouseover");
        cy.get("[data-cy='form.builder.add.field']").eq(0).arrowClick();
        cy.get("div").contains("Form Builder Library").should("be.visible");
        cy.get("div").contains("Form Builder Library").parent().should("be.visible");
      });

      it("Add Receive Purchase Order", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "Receive PO" });
        cy.fbAddNewFieldButton();
      });

      it("Verify receive Po should be added to details tab", () => {
        cy.get("[data-cy^='porec-receive-po']").should("be.visible");
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create Receiving record 1 in draft stage", () => {
    it("Navigate to Receiving landing page", () => {
      cy.navigToReceivableList();
    });

    it("Create Receiving Record", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select 'Receivable test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Receivable test");
    });

    it("Select 'Receivable form'", () => {
      cy.get("[data-cy='field-selectForm']").arrowClick();
      cy.get("div[id^='react-select']").contains("Receivable form").arrowClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create Released Receiving record", () => {
    it("Navigate to Receiving landing page", () => {
      cy.navigToReceivableList();
    });

    it("Create Receiving Record", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select 'Receivable test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Receivable test");
    });

    it("Select 'Receivable form' ", () => {
      cy.get("[data-cy='field-selectForm']").arrowClick();
      cy.get("div[id^='react-select']").contains("Receivable form").arrowClick();
    });

    it("Verify receiving po should get created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Receiving",
        docId: "RCT-00002",
        revision: "Rev A",
      });
    });

    it("Add value in text field", () => {
      cy.get("[name='Test']").arrowType("Test");
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Purchase order", () => {
      cy.get("[data-cy='porec-receivable-test']").arrowClick({ force: true })
        .autocompleteSelect("POT-00001 - rev 1 - PO for receiving");
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the  form", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify Po ,Requestor, suplier, Receiving table,Receive all button should be exist", () => {
      cy.get("[data-cy='porec-receivable-test']").should("be.visible");
      cy.get("[data-cy='po-requestor-autocomplete']").should("be.visible");
      cy.get("[data-cy='po-supplier-built-in']").should("be.visible");
      cy.get("[data-cy^='purchaseorder'] table").should("be.visible");
      cy.get("[data-cy='form.builder.receive']").should("be.visible");
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on receive all", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.GetReceivableQuantity], () => {
          cy.get("[data-cy='fb-control-btn']").contains("Receive All").arrowClick();
        });
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify that all Parts, non-Enlil parts and PO services should have received quantities", () => {
      cy.get("[data-cy='received']").eq(0).scrollIntoView();
      cy.get("[data-cy='received']").eq(0).should("have.text", "200");
      cy.get("[data-cy='received']").eq(1).should("have.text", "100");
    });

    it("Click on line item and Insert Receipt Quantity and click on save ", () => {
      cy.get("[data-cy='partNumberDocId']").eq(0).arrowClick();
      cy.get("[data-cy='received'] input").clear().arrowType("180");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='form.builder.save']").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on line item and Insert Receipt Quantity and click on save ", () => {
      cy.get("[data-cy='partNumberDocId']").eq(1).arrowClick();
      cy.get("[data-cy='received'] input").clear().arrowType("100");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='form.builder.save']").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the document", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to details Tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify inserted quantity saved and display in the table ", () => {
      cy.get("[data-cy='received']").eq(0).scrollIntoView();
      cy.get("[data-cy='received'] span").eq(0).should("have.text", "180");
    });

    it("Verify form option should appear in this tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    context("Verify overview tab", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify that two tabs are displayed, Overview and Details tab", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify Header Info", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "Receiving",
          docId: "RCT-00002",
          revision: "Rev A",
        });
      });

      it("Verify Predefiend fields and form Options", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify attachment field is visible", () => {
        cy.get("#AttachmentFieldPresenter-field").should("be.visible");
      });

      it("Verify attachment field is visible", () => {
        cy.get("[data-cy='fb-po-approvals']").should("exist");
      });
    });
  });


  context("Validate Right Side Panel", () => {

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that right side panel Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify it is fixed when user scroll up or down", () => {
      cy.get("main").scrollTo("top", { ensureScrollable: false });
      cy.get("[data-cy='references-icon']").should("be.visible");
    });

    it("Verify eye icon", () => {
      cy.get("[data-cy='references-icon']").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify migrate form button", () => {
      cy.get("[data-cy='common.form.migration']").should("be.visible");
    });

    it("Verify References selection Add Remove", () => {
      cy.listLoadingElementShouldNotExist();
      cy.verifyAddRemoveReference({ formId: "FM-00001" });
    });

    it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
      cy.verifyReferenceInfo();
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00004");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", currentFormattedDate);
    });

    context("Verify Revision", () => {
      it("open revision tab", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
      });
    });

    context("Verify User able to add Groups or other user permissions", () => {
      it("Open permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Developers");
        });
      });

    });

    context("Check document history", () => {
      const groupOne = "Developers";
      let groupTwo;
      const history = [
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to group", value: `Developers` },
          ],
        },
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to user", value: `${USERS[3].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });

      history.forEach((element, groupIndex) => {
        it(`Check owner name for group ${groupIndex + 1}`, () => {
          cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
        });
        element.actions.forEach((action, index, identifier) => {
          it(`'${action.key}' as '${action.value}' exists`, () => {
            const typeOfChange = action.key;
            let contentOfChange = action.value;

            if (action.key === "New description" || action.key === "Description changed" ) {
              contentOfChange = "\n" + action.value + "\n";
            }

            if (typeOfChange === "s3Link added") {
              cy.get(`[data-cy^="change-key-${groupIndex}-${index}"]`).should("have.text", typeOfChange);
              cy.get("[data-cy='downloadS3link']").should("contain.text", contentOfChange);
            }
            else {
              if (action.key === "Access granted to group") {
                cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
                  expect($identifier.text()).to.be.oneOf([groupOne, groupTwo, "Everyone"]);
                });
              }
              else {
                cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
                  .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
                  .parent()
                  .parent()
                  .within(() => {
                    cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                    cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
                  });
              }
            }
          });
        });
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.drSelectBookmarksTab();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click on approval bookmark", () => {
        cy.get("[data-cy='Bookmarks-detail'] p").arrowClick();
      });

      it("Verify approval block is navigated", () => {
        cy.get("[data-cy='fb-po-approvals']").should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
      });
    });

    context("Verify form migration", () => {
      it("Navigate to overview tab and text field value", () => {
        cy.get("[data-cy='references-icon']").arrowClick();
        cy.drSelectOverviewTab();
      });

      it("Add value in text field", () => {
        cy.get("[name='Test']").clear().arrowType("Test");
        cy.drClickCreateDocumentWithoutApiCall();
      });
      it("Verify migrate form button is visible", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.get("[data-cy='common.form.migration']").should("be.visible");
      });

      it("Click on migrate form button", () => {
        cy.drClickMigrateForm();
      });

      it("Select form to be migrated", () => {
        cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
        cy.get("[id^='react-select']").contains("FM-00008").arrowClick();
      });

      it("Mapped receivable field", () => {
        cy.get("[data-cy^='field-receivable-test']" ).arrowClick();
        cy.get("[id^='react-select']").eq(1).autocompleteSelect("Receivable");
      });

      it("Mapped approval field", () => {
        cy.get("[data-cy^='field-fb-po-approvals']" ).arrowClick();
        cy.get("[id^='react-select']").eq(2).autocompleteSelect("form.builder.approvals");
      });

      it("Mapped Test field", () => {
        cy.get("[data-cy^='field-Test']" ).arrowClick();
        cy.get("[id^='react-select']").eq(3).autocompleteSelect("Text");
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify the existing field after migration", () => {
        cy.get("[name^='Test']").should("exist");
        cy.get("[name^='Test']").should("have.value", "Test");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00008");
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify Fields in Detail Tab PO Receivable, supplier,Requestor,Receiving table", () => {
        cy.get("[data-cy='porec-receivable-test']").should("have.value", "POT-00001 - rev 1 - PO for receiving");
        cy.get("[data-cy='po-supplier-built-in']").should("have.value", "SUP-00001 - rev 1 - API Supplier Document");
        cy.get("[data-cy='po-requestor-autocomplete']").should("exist");
        cy.get("[data-cy^='purchaseorder'] table").should("exist");
      });
    });

    context("Verify Scroll and tabs", () => {
      it("Verify that two tabs are displayed, Overview and Details tab", () => {
        cy.get("[data-cy='tabId.overview']").should("exist");
        cy.get("[data-cy='tabId.details']").should("exist");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Navigate to history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });
    });

  });

  context("Release document", () => {
    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab().wait(2000);
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^='fb-po-approvals']").arrowClick();
      cy.get("[data-cy^='fb-po-approvals']").autocompleteSelect(USERS[1].name);
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve the record", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("button[data-cy='fb-control-btn']").contains("Approve").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostApprovalsApprove,
        CyRoutes.SessionDetails,
        CyRoutes.GetRequiredApproversDocRev,
      ], () => {
        cy.get("[data-cy='common.confirm']").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

  });

  context("Verify received quantities.", () => {
    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify that all Parts, non-Enlil parts and PO services have received quantities", () => {
      cy.get("[data-cy='received']").eq(0).scrollIntoView();
      cy.get("[data-cy='received']").eq(0).should("have.text", "180");
      cy.get("[data-cy='received']").eq(1).should("have.text", "100");
    });
  });

  // verify Draft state
  context("Open Receivable Draft state document and validate the layout", () => {
    it("Navigate to Receivable", () => {
      cy.navigToReceivableList();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "RCT-00001" });
      cy.dlSelectFirstDocument();
    });

  });

  context("Verify Layout for created receiving record in draft state", () => {
    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Header Info", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Receiving",
        docId: "RCT-00001",
        revision: "Rev A",
      });
    });

    it("Navigate to details Tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(1000);
      cy.get("[data-cy='porec-receivable-test']").arrowClick({ force: true })
        .autocompleteSelect("POT-00001 - rev 1 - PO for receiving");
    });

    it("Verify Fields in Detail Tab PO Receivable, supplier,Requestor,Receiving table", () => {
      cy.get("[data-cy='porec-receivable-test']").should("exist");
      cy.get("[data-cy='po-requestor-autocomplete']").should("exist");
      cy.get("[data-cy='po-supplier-built-in']").should("exist");
    });

    it("Verify form option visible in detail tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that right side panel Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

  });

  // End of draft state verification
  // verify release state
  context("Open Receivable Draft state document and validate the layout", () => {
    it("Navigate to Receivable", () => {
      cy.navigToReceivableList();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "RCT-00002" });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify Layout for created receiving record in draft state", () => {
    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Header Info", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.RELEASED,
        title: "Receiving",
        docId: "RCT-00002",
        revision: "Rev A",
      });
    });

    it("Navigate to details Tab", () => {
      cy.wait(1000);
      cy.drSelectDetailsTab();
      cy.wait(1000);
    });

    it("Verify Fields in Detail Tab PO Receivable, supplier,Requestor,Receiving table", () => {
      cy.get("[data-cy='porec-receivable-test']").should("exist");
      cy.get("[data-cy='po-requestor-autocomplete']").should("exist");
      cy.get("[data-cy='po-supplier-built-in']").should("exist");
    });

    it("Verify form option visible in detail tab", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("be.hidden");
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that right side panel Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

  });

  context("Validate Right Side Panel", () => {

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
      cy.verifyReferenceInfo();
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00008");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", currentFormattedDate);
    });

    context("Verify Revision", () => {
      it("open revision tab", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
      });
    });

    context("Verify User able to add Groups or other user permissions", () => {
      it("Open permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[4].name);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Can be approver");
        });
      });
    });

    context("Check document history", () => {
      const groupOne = "Can be approver";
      const history = [
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to group", value: `Can be approver` },
          ],
        },
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to user", value: `${USERS[4].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      verifyHistoryContent(history, groupOne);
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.drSelectBookmarksTab();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });

      it("Click on approval bookmark", () => {
        cy.get("[data-cy='Bookmarks-detail'] p").arrowClick();
      });

      it("Verify approval block is navigated", () => {
        cy.get("[data-cy='fb-po-approvals']").should("be.visible");
      });
    });
  });
});
