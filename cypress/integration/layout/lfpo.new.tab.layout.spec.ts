// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { lotIdRef } from "../../utils/constants/dateHandler";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";
import { STATUS_TYPES_LABEL } from "./../../../src/state/ducks/dashboard.new/my.feeds/types";

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
let createdRecivableFormDocument;
let createdRecivableDocument;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";
const todaysDate = moment().tz("America/Los_Angeles");
const todaysDateFormated = moment().tz("America/Los_Angeles").format("L");
const groupOne = "Developers";
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
const LFPO =  {
  documentTypeName: "Lot From Purchase Order Form",
  documentTypeAcronym: "LFPO",
  group: DOC_TYPE_GROUP.FORM,
  isQms: true,
};

context("LFPO new layout verification", () => {
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
            }],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdRecivableFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdRecivableFormDocument.id,
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

    it("[API]Create Receiving", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          name: "",
          description: "",
          document: {
            docId: "RCT-00001",
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
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: {
            id: createdRecivableFormDocument.id,
          },
          formInput: {
            "fb-po-approvals": [ adminEmployee.id ],
            "receivable-test": {
              id: createdPODocument.id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdRecivableDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdRecivableDocument.id,
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

  context("Migration FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Verify Predefined fields", () => {
      it("Verify Title, Description, Document Type, References, Document ID, output document", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='field-retrain']").should("exist");
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'LFPO Document Title'", () => {
        cy.drEnterDocumentTitle({ name: "Migration form" });
      });

      it("Enter description 'LFPO Document form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "LFPO Document form Document Revision description" });
      });

      it("Select 'Form' document type 'Lot From Purchase Order Form' dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Lot From Purchase Order Form" });
      });

      it("Select 'Lots' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lots" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Creat form", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
        cy.fbGroupOptions("1", "2", "3");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });

      it("Save the form data", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and released", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Verify Predefined fields", () => {
      it("Verify Title, Description, Document Type, References, Document ID, output document", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='field-retrain']").should("exist");
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'LFPO Document Title'", () => {
        cy.drEnterDocumentTitle({ name: "LFPO Document Title" });
      });

      it("Enter description 'LFPO Document form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "LFPO Document form Document Revision description" });
      });

      it("Select 'Form' document type 'Lot From Purchase Order Form' dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Lot From Purchase Order Form" });
      });

      it("Select 'Lots' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lots" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Save the form data", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });
  });

  context("Add FB fields and Verification of the created form", () => {
    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it("Save the form data", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "LFPO00007",
        revision: "Rev 1",
      });
    });

    it("Verify that it contains only Details tab", () => {
      cy.get("[data-cy='tabId.details']").should("exist");
      cy.get("#sm-tabpanel-1").should("not.exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Details tab by default", () => {
      cy.isTabActive({
        name: "details",
        index: 0,
      });
    });

    context("Verify Schema Fields", () => {
      it("Verify Default fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("#AttachmentFieldPresenter-field").should("be.visible");
      });

      it("Verify Added FB Fields", () => {
        cy.get("[name^='textfield-for-inline']").should("exist");
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Expiration Date, Part Selection, 100% inspection ride, Approval block", () => {
        cy.get("[name='lot_expiry_date']").should("exist");
        cy.get("[name='100-inspection-override']").should("exist");
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
        cy.get("[data-cy='lot_part']").should("exist");
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
      });

      it("Verify Quantity, Part Number, Usable Quantity, comment", () => {
        cy.get("[name='lot_quantity']").should("exist");
        cy.get("[name='lot_usable_quantity']").should("exist");
        cy.get("[data-cy='lot_part']").should("exist");
        cy.get("#RenderHTML").should("exist");
      });

      it("Verify Form option exist", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Submit for approval", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Verify form is created and released", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "Document List",
          docId: "LFPO00007",
          revision: "Rev 1",
        });
      });
    });
  });


  context("Receving flow", () => {
    it("Navigate to Receiving landing page", () => {
      cy.navigToReceivableList();
    });

    it("Click 'Create Receipt Record'", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Create Receiving Record", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Receivable test");
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify receiving should get created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Receiving",
        docId: "RCT-00002",
        revision: "Rev A",
      });
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab().wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Purchase order", () => {
      cy.get("[data-cy='porec-receivable-test']").autocompleteSelect("POT-00001 - rev 1 - PO for receiving");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the form data", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click on create lot", () => {
      cy.get("[name='po-items-built-in'] button").contains("Create Lot").first().arrowClick();
    });

    it("Verify pop up window will open", () => {
      cy.get("[data-cy='form.builder.po.create.a.lot']").contains("Create Lot").should("be.visible");
      cy.listLoadingElementShouldNotExist();
    });

    it("fill the fields", () => {
      cy.get("[name^='received']").arrowType("100").wait(2000);
    });

    it("Enter Expiration date", () => {
      cy.get(`.MuiDialogContent-root input[name="expirationDate"]`)
        .parent().find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document type", () => {
      cy.get("[data-cy='lotType']").autocompleteSelect("Lots");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select form", () => {
      cy.get("[data-cy='lotForm']").wait(2000).autocompleteSelect("LFPO Document Title");
      cy.listLoadingElementShouldNotExist();
    });

    it("Create lot", () => {
      cy.get("[data-cy='fb-control-btn']").contains("Create Lot").first().arrowClick();
    });

    it("Verify Lot should be created and displayed in the table for that part", () => {
      const lotId = lotIdRef + "01";
      cy.get("[data-cy='lots'] span").contains(lotId).should("exist");
    });
  });

  context("Verify created lot", () => {
    it("Navigate to Lot landing page", () => {
      cy.navigToLots();
      cy.dlClearFilters();
    });

    it("Click to open that LOT", () => {
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="2"] [class="k-input"]`).arrowClick();
      cy.get("li").contains(STATUS_TYPES_LABEL.WIP).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlSelectFirstDocument();
    });

    it("Verify The top left of the page displays: Icon and document type, Rev stage, status (WIP)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Lots",
        revision: "Rev A",
      });
    });

    it("Verify that it contains only Details tab", () => {
      cy.get("[data-cy='tabId.details']").should("exist");
      cy.get("#sm-tabpanel-1").should("not.exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Details tab by default", () => {
      cy.isTabActive({
        name: "details",
        index: 0,
      });
    });

    it("Verify Added FB Fields textfield and checkbox", () => {
      cy.get("[name^='textfield-for-inline']").should("exist");
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify Quantity, Part Number, Usable Quantity", () => {
      cy.get("[name='lot_quantity']").should("be.visible");
      cy.get("[name='lot_usable_quantity']").should("be.visible");
      cy.get("[data-cy='lot_part']").should("be.visible");
    });

    it("Verify Expiration Date, 100% inspection ride, Approval block", () => {
      cy.get("[name='lot_expiry_date']").should("exist");
      cy.get("[name='100-inspection-override']").should("exist");
      cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
    });

    it("Verify Form option", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Validate Right Side Panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Eye Icon", () => {
      cy.get("[data-cy='references-icon']").should("exist");
    });

    it("Verify Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify It is fixed as the user scrolls up or down", () => {
      cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
      cy.get("[data-cy='References']").should("be.visible");
    });

    it("Verify References selection Add Remove", () => {
      const docId = "FM-00001";
      cy.get("[data-cy=\"referenceTo\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevGet], () => {
        cy.get("[data-cy=\"referenceTo\"]").autocompleteSelect(docId);
      });
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevGet], () => {
        cy.get(`div[data-cy="field-referenceTo"]`).contains(docId)
          .parent().parent().parent().find("svg").arrowClick({ force: true });
      });
    });

    it("Verify Referenced By,and Release date Item exist or not", () => {
      cy.verifyReferenceInfo();
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "LFPO00007");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", todaysDate.format("MM/DD/YYYY"));
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
        cy.drAddUserFromPermissionTab(USERS[3].name);
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Add another group permission", () => {
        cy.wait(2000);
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.drAddGroupFromPermissionTab("Developers");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

      });

    });

    context("Check document history", () => {
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      verifyHistoryContent(history, groupOne);
    });

    context("Verify Book Mark Exist or not", () => {
      it("Verify Book", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });

      it("Click on book mark 'Approval' Approval block should be navigated", () => {
        cy.get("[data-cy='Bookmarks-detail']").contains("Approvals").arrowClick();
        cy.get("[data-cy^='approvals']").should("be.visible");
      });
    });
  });

  context("Verify Revision History tab", () => {
    it("Open revision history tab", () => {
      cy.drSelectRevisionHistoryTab();
      cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
    });
  });

  context("Verify form migration", () => {

    it("Verify migrate form button is visible", () => {
      cy.get("[data-cy=references-icon]").arrowClick();
      cy.get("[data-cy='common.form.migration']").should("be.visible");
    });

    it("Click on migrate form button", () => {
      cy.drClickMigrateForm();
    });

    it("Select form to be migrated", () => {
      cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
      cy.get("[id^='react-select']").contains("LFPO00002 - Migration form").arrowClick();
    });

    it("Mapped receivable field", () => {
      cy.get("[data-cy^='field-lot_quantity']" ).arrowClick();
      cy.get("[id^='react-select']").eq(1).autocompleteSelect("Initial Quantity");
    });

    it("Mapped receivable field", () => {
      cy.get("[data-cy^='field-textfield-for-inline']" ).arrowClick();
      cy.get("[id^='react-select']").eq(2).autocompleteSelect("Textfield for inline");
    });

    it("Mapped Usable Quantity field", () => {
      cy.get("[data-cy^='field-lot_usable_quantity']" ).arrowClick();
      cy.get("[id^='react-select']").eq(3).autocompleteSelect("Usable Quantity");
    });

    it("Mapped Expiration Date field", () => {
      cy.get("[data-cy^='field-lot_expiry_date']" ).arrowClick();
      cy.get("[id^='react-select']").eq(4).autocompleteSelect("Expiration Date");
    });

    it("Mapped Part Selection field", () => {
      cy.get("[data-cy^='field-lot_part']" ).arrowClick();
      cy.get("[id^='react-select']").eq(5).autocompleteSelect("Part Selection");
    });

    it("Mapped 100% Inspection Override field", () => {
      cy.get("[data-cy^='field-100-inspection-override']" ).arrowClick();
      cy.get("[id^='react-select']").eq(6).autocompleteSelect("100% Inspection Override");
    });

    it("Mapped Approval field", () => {
      cy.get("[data-cy^='field-fb-approvals']" ).arrowClick();
      cy.get("[id^='react-select']").eq(7).autocompleteSelect("form.builder.approvals");
    });


    it("Mapped Checkbox field", () => {
      cy.get("[data-cy^='field-checkbox']" ).arrowClick();
      cy.get("[id^='react-select']").eq(8).autocompleteSelect("Checkbox");
    });

    it("Click on confirm change", () => {
      cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
    });

    it("Verify data is migrated to new form field ", () => {
      cy.get("[name='lot_quantity']").should("have.value", "100");
      cy.get("[name^='textfield-for-inline']").should("be.visible");
      cy.get("[name='lot_usable_quantity']").should("be.visible");
      cy.get("[data-cy='lot_part']").should("be.visible");
      cy.get("[data-cy='lot_part']").should("have.value", "PRT-00005 - rev 1 - Part document");
    });

    it("Verify Expiration Date, Part Selection, 100% inspection ride, Approval block", () => {
      cy.get("[name='lot_expiry_date']").should("exist");
      cy.get("[name='100-inspection-override']").should("exist");
      cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
    });

    it("Verify form Id", () => {
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "LFPO00002");
    });

  });

  context("Verify Scroll", () => {
    it("Navigate to history tab", () => {
      cy.get("[data-cy='timeline-icon']").arrowClick();
    });

    it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
      cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
    });
  });

  context("Fill in the fields and Release", () => {

    it("Checked chebox value", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Fill in Approval block and  Approve and release Record", () => {
      cy.get("[data-cy^='fb-approvals-fb-approvals-']").eq(0).autocompleteSelect(`${USERS[1].name}`);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the form data", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release Record", () => {
      cy.get("[data-cy='ApproveAndRelease-button']").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and Release", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Verify After release", () => {
    it("Navigate to Lot landing page", () => {
      cy.navigToLots();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click to open that LOT", () => {
      cy.dlClearFilters();
      cy.get(".k-grid").contains("Accepted").arrowClick();
    });

    it("Verify The top left of the page displays: Icon and document type, Rev stage, status (ACCEPTED)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.ACCEPTED,
        title: "Lots",
        revision: "Rev A",
      });
    });

    it("Verify that it contains only Details tab", () => {
      cy.get("[data-cy='tabId.details']").should("exist");
      cy.get("#sm-tabpanel-1").should("not.exist");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Details tab by default", () => {
      cy.isTabActive({
        name: "details",
        index: 0,
      });
    });

    it("Verify FB Fields", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      cy.get("[data-cy='Textfield for inline']").should("exist");
    });

    it("Verify attachment", () => {
      cy.get(`h6`).contains("Attachments").should("exist");
    });

    it("Verify initial qunatity, usable quantity", () => {
      cy.get("[name='lot_quantity']").should("exist");
      cy.get("[name='lot_usable_quantity']").should("exist");
    });

    it("Expiration Date, Part Selection, 100% inspection ride, Approval block", () => {
      cy.get("[name='lot_expiry_date']").should("exist");
      cy.get("[name='100-inspection-override']").should("exist");
      cy.get("[name='lot_part']").should("exist");
      cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });
  });
});
