import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, receivingReleasedDateMonth } from "../../utils/constants/dateHandler";
import { LotsTest } from "../../utils/constants/documentTypes/lot";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let adminEmployeeLoginResponse;
let createdCompany;
let adminEmployee;
let purchaseOrderDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let supplierDocumentType;
let partDocumentType;
let loginResponse;
let group;
let initialArDocument;
let createdSupplierFormDocument;
let createdSupplierDocument;
let createdPartDocument;
let createdPOFormDocument;
let receivingName;
let receivePageDetailsId;
let receivingDocumentType;
let receivingDocumentTypeNew;
let oldReceivingForm;
let CSLDocumentType;
let createdLotsFormDocument;
const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";
const TEXTFIELD_LABEL = "TEXT FIELD";
const RADIO_BUTTON_GROUP_LABEL = "radioGroup";
const CHECKBOX_LABEL = "checkboxGroup";
const CHECKBOX_REQUIRED_IF_VALUE = "Y";


context("Receivable record lifecycle", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[3], USERS[4]],
            documentTypes: [
              Part,
              PurchaseOrderDocType,
              ReceivableTest,
              LotsTest,
            ],
            acctCodes: ["code 1"],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          receivingDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          receivingDocumentTypeNew = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lots test");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
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

    it("[API]Create part document", (done: any) => {
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
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "PO Status",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "general-information-to-be-completed-by-requester-kc3oqlpn",
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
                rules: "",
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
                index: 3,
                label: "Supplier ",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Supplier",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "ordered-k6mlhan7",
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
              },
              {
                name: "po-items-built-in",
                type: "purchaseorder",
                tabId: "lineitems",
                index: 5,
                label: "Purchase Order",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Purchase Order",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "fb-po-approvals-l7rbwkqp",
                type: "poapprovals",
                index: 6,
                label: "form.builder.approvals",
                tabId: "details",
                deleteDisabled: false,
                uniqueSchemaItem: true,
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
        }).then(() => done() );
      });
    });

    it("[API]Create old receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Old receiving Form document</p>",
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
          name: "Old Receiving Form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: receivingDocumentType[0].id,
            }],
            schema: [
              {
                name: "receiving-ku6t73ty",
                type: "poreceive",
                index: 0,
                label: "Select PO",
                tabId: "details",
                rules: "",
                hidden: false,
                deleted: false,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [],
                validationAttribute: "Select PO",
                deleteInFormDisabled: false,
                applicableValidationSchema: true,
              },
              {
                name: "fb-approvals-ku6t6gzw",
                type: "approvals",
                tabId: "overview",
                index: 1,
                label: "form.builder.approvals",
                deleteDisabled: true,
                uniqueSchemaItem: true,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        oldReceivingForm = response;
        cy.drAPIApproveAndRelease({
          documentId: oldReceivingForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done() );
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
  });
  context("Login user", () => {
    context("Login user when he doesn't have privileges", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
      });
    });
  });

  context("Create PO document with three Products", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrderWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Requestor", () => {
      cy.get("[data-cy^=po-requestor]").scrollIntoView();
      cy.get("[data-cy^=po-requestor]").arrowClick().wait(500);
      cy.get("[data-cy^=po-requestor]").arrowClick().autocompleteSelect(USERS[11].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select PO order date", () => {
      cy.get("[name^=ordered]").parent().find("button").arrowClick();
      cy.get("button.MuiPickersDay-current").arrowClick();
    });

    it("Select 'SUP-00001' Supplier ", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00001");
    });

    it("Enters description 'New Purchase Order Description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Click 'Save the document", () => {
      cy.recClickCreateDocumentWithApiCall();
    });

    context("Create first line item on PO", () => {
      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
      });

      it("Click on 'Add item' button", () => {
        cy.poAddNewFieldItem();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Part Number", () => {
        cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
      });

      it("Enter Quantity Ordered", () => {
        cy.poEnterQuantityOrdered({ quantity: "200" });
      });

      it("Select Units", () => {
        cy.poSelectUnits();
      });

      it("Enter Unit Price", () => {
        cy.poNumberOfUnits({ number: "5" });
      });

      it("Add Required Date", () => {
        cy.get("[name^=date]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-daySelected").arrowClick();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Approve Purchase Order document", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });

      it("Click 'Approve' button", () => {
        cy.poClickOnPending();
        cy.ebApproveWithoutApi();
      });
    });
  });

  context("Create receiving form", () => {
    it("[API]Create receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>New Recivable description</p>",
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
          name: "New Receivable Form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: receivingDocumentTypeNew[0].id,
            }],
            schema: [
              {
                name: "fb-approvals-l5tbfe6o",
                type: "approvals",
                index: 0,
                label: "form.builder.approvals",
                tabId: "overview",
                deleteDisabled: true,
                uniqueSchemaItem: true,
              },
              {
                index: 1,
                type: "poreceive",
                name: "receivable-l5tbfgkl",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "Receivable",
                rules: "",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                label: "Receivable",
                tabId: "overview",
              },
              {
                index: 2,
                type: "textfield",
                name: "text-field-l5tbfi74",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "TEXT FIELD",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                placeholder: "",
                rows: 1,
                label: "TEXT FIELD",
                validators: {
                  required: true,
                },
                tabId: "overview",
              },
              {
                index: 3,
                type: "radiogroup",
                name: "radio-group-l5tbfnrn",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "visibility",
                validationAttribute: "radioGroup",
                rules: "required_if:text-field-l5tbfi74,X",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                options: [
                  {
                    value: "1",
                    text: "1",
                  },
                  {
                    value: "2",
                    text: "2",
                  },
                  {
                    value: "3",
                    text: "3",
                  },
                ],
                label: "radioGroup",
                validators: {
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  required_if: {
                    name: "text-field-l5tbfi74",
                    value: "X",
                  },
                },
                tabId: "overview",
              },
              {
                index: 4,
                type: "checkboxgroup",
                name: "checkbox-group-l5tbftgw",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "visibility",
                validationAttribute: "checkboxGroup",
                rules: "required_if:text-field-l5tbfi74,Y",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                options: [
                  {
                    value: "1",
                    text: "1",
                  },
                  {
                    value: "2",
                    text: "2",
                  },
                  {
                    value: "3",
                    text: "3",
                  },
                ],
                label: "checkboxGroup",
                validators: {
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  required_if: {
                    name: "text-field-l5tbfi74",
                    value: "Y",
                  },
                },
                tabId: "overview",
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        oldReceivingForm = response;
        cy.drAPIApproveAndRelease({
          documentId: oldReceivingForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done() );
      });
    });
  });

  context("Create a form with output as 'PO Approval matrix', Approve and release it", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'POAM Form'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Form" });
    });

    it("Enters description 'POAM Form description'", () => {
      cy.drEnterDocumentDescription({ description: "POAM Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'PO Approval Matrix' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Approval Matrix" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create POAM document for PO", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title as 'POAM Document'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Document" });
    });

    it("Enter description as 'POAM Doc description'", () => {
      cy.drEnterDocumentDescription({ description: "POAM Doc description" });
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to MatrixDetails tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Click on 'Add Item'", () => {
    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter Level Name value to be 'level 1'", () => {
      cy.poAMEnterLevelName({ name: "level 1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Limit value to be '400'", () => {
      cy.poAMEnterLimit({ limit: "400" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Fill in the fields - Signature 1 group as 'Everyone'", () => {
      cy.get(`[name="signatures.0.groups"]`).arrowClick().wait(1000);
      cy.contains("Everyone").arrowClick().wait(1000);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' button", () => {
      cy.get(`[data-cy="common.add"]`).contains("Add").arrowClick().wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify 'Everyone' group exists under signature 1", () => {
      cy.get(`tr>td[class*="MuiTableCell-root"]`).eq(2).contains("Everyone");
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });
  });

  context("Create RC", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Receivable test' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Receivable test" });
    });

    it("Setting Text area value Y", () => {
      cy.get(`[data-cy^="text-field"]`).arrowType(CHECKBOX_REQUIRED_IF_VALUE);
      cy.unClick();
    });

    it(`select value for ${CHECKBOX_LABEL}`, () => {
      cy.get(`input[type="checkbox"][value="2"]`).check();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Search for API PO document and select it", () => {
      cy.recSelectPo({ poTitle: "New Purchase Order" });
      cy.unClick();
    });

    it("Verify requester is present on receivable", () => {
      cy.get("input[data-cy^=\"po-requestor\"]").should("have.attr", "value", `${USERS[11].name} - ${USERS[11].email}`);
    });

    it("Verify supplier is present on receivable", () => {
      cy.get("input[data-cy^=\"po-supplier-built-in\"]")
        .should("have.attr", "value", "SUP-00001 - rev 1 - API Supplier Document");
    });

    it("Verify PO table is present on receivable", () => {
      cy.get("div[name=\"po-items-built-in\"]>table").should("exist");
      cy.unClick();
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify RC should be created in WIP and Alpha by default", () => {
    it("Verify RC should be created in WIP", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Verify RC should be Alpha by default", () => {
      SystemRequirement("REQ-3840");
      cy.get(`[data-cy="revision"]`).eq(0).contains("Revision A - WIP");
    });
  });

  context(`Verify there should be an Approvals block and Submit for Approval button`, () => {
    it("Verify Approvals block exists", () => {
      SystemRequirement("REQ-3840");
      cy.get(`[name^="fb-approvals-fb-approvals-"]`).should("exist");
    });

    it(`Verify 'Submit for Approval' exists`, () => {
      SystemRequirement("REQ-3840");
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").should("exist");
    });
  });

  context(`Select PO and receive items`, () => {
    it("Select PO and receive items", () => {
      cy.pause();
    });
  });

  context(`Add approvers on the approvals block and release RC`, () => {
    it("Add approvers on the approvals block and release RC", () => {
      cy.pause();
    });

    it("Check if it follows DAM required approvers", () => {
      cy.pause();
    });
  });

  context("Add two approver and then remove one", () => {
    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[12].name });
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it("remove one approver", () => {
      cy.contains(USERS[12].name).last().parent().parent().find(".MuiChip-deleteIcon").arrowClick();
    });

    it("Save receivable with approver", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify `Receiving document` status and send email", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Click on “Receive all“", () => {
    it("Click on “Receive all”", () => {
      SystemRequirement("REQ-4790");
      cy.get("[data-cy=\"form.builder.receive\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Create a Lot' on first line item", () => {
      cy.get("tr>td>button").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Lots test' document type", () => {
      cy.get("[data-cy='lotType']").autocompleteSelect("Lots test");
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Lots form document' form", () => {
      cy.get("[data-cy='lotForm']").autocompleteSelect("Lots form");
    });

    it("Click 'Create Lot' button", () => {
      cy.get("[data-cy='form.builder.po.create.lot']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
    });
  });

  context("Patch page details and verify receiving landing page", () => {
    it("[API]Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Receive",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          receivePageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: receivePageDetailsId,
          payload: {
            columns: [
              {
                label: "Receipt ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                label: "Receipt Record State",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
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
                fn: "AUTOCOMPLETE_DOC_ID",
                label: "PO #",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-docId-in-receiving",
                sourcePath: [
                  `formInput.${receivingName}`,
                  "formInput.receivable-l5tbfgkl",
                ],
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
                fn: "PO_SUPPLIER_NAME_IN_RECEIVABLE",
                label: "Supplier",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-suppliers-in-receiving",
                sourcePath: [
                  `formInput.${receivingName}`,
                  "formInput.receivable-l5tbfgkl",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PART_NUMBER_REV_FROM_RECEIVABLE",
                label: "Part Number/Rev",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.part_number_rev",
                sourcePath: [
                  `formInput.${receivingName}`,
                  "formInput.receivable-l5tbfgkl",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_STATUS_IN_RECEIVABLE",
                label: "PO Status",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-status-in-receiving",
                sourcePath: [
                  `formInput.${receivingName}`,
                  "formInput.receivable-l5tbfgkl",
                ],
                showOnAndroid: true,
              },
            ],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("Auth logout", () => {
      cy.authLogout();
    });

    it("Auth login first user", () => {
      cy.authLogin({ email: USERS[11].email });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Navigate to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Verify Receipt ID", () => {
      cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "RCT-00001");
    });

    it("Verify Receipt Record State", () => {
      cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "WIP");
    });

    it("Verify Owner", () => {
      cy.get("tr.k-master-row").first().find("td").eq(2).should("contain.text", USERS[11].name);
    });

    it("Verify PO #", () => {
      cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "POT-00001");
    });

    it("Verify Released Date", () => {
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "");
    });

    it("Verify Supplier", () => {
      cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "API Supplier Document");
    });

    it("Verify Part Number/Rev", () => {
      cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "PRT-00005 - 1, PRT-00006 - 1");
    });

    it("Verify PO Status", () => {
      cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", "Open");
    });
  });

  context("Submit receiving document for Approval", () => {
    it("Open receiving document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });
  });

  context("While in “Pending Approval” state, send to email", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.PENDING_APPROVAL });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Approve receiving", () => {
    it("Approve", () => {
      cy.ebApprove();
    });
  });

  context("After “Released” state, send to email", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify landing page after releasing receiving", () => {
    it("Navig to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Verify Receipt ID", () => {
      cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "RCT-00001");
    });

    it("Verify Receipt Record State", () => {
      cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "Released");
    });

    it("Verify Owner", () => {
      cy.get("tr.k-master-row").first().find("td").eq(2).should("contain.text", USERS[11].name);
    });

    it("Verify PO #", () => {
      cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "POT-00001");
    });

    it("Verify Released Date", () => {
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", receivingReleasedDateMonth);
    });

    it("Verify Supplier", () => {
      cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "API Supplier Document");
    });

    it("Verify Part Number/Rev", () => {
      cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "PRT-00005 - 1, PRT-00006 - 1");
    });

    it("Verify PO Status", () => {
      cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", "Open");
    });
  });

  context("Verify old receiving form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Receivable' form", () => {
      cy.get(`div[data-cy^="field-selectType"]`).click().focused()
        .arrowType("Receivable{downarrow}{enter}");
      cy.unClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Search for API PO document and select it", () => {
      cy.drSelectDetailsTab();
      cy.get("input[data-cy^=\"porec-rece\"]").click().focused().autocompleteSelect("New Purchase Order");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify requester is present on receivable", () => {
      cy.get("input[data-cy^=\"po-requestor\"]").should("have.attr", "value", `${USERS[11].name} - ${USERS[11].email}`);
    });

    it("Verify supplier is present on receivable", () => {
      cy.get("input[data-cy^=\"po-supplier-built-in\"]")
        .should("have.attr", "value", "SUP-00001 - rev 1 - API Supplier Document");
    });

    it("Verify PO table is present on receivable", () => {
      cy.get("div[name=\"po-items-built-in\"]>table").should("exist");
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });
});

