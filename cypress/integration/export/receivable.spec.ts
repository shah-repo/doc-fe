/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableExport } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let purchaseOrderDocumentType;
let createdPOFormDocument;
let createdPODocument;
let receivableDocumentType;
let createdRecivableFormDocument;

context("Export Receivable doc", () => {
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
            documentTypes: [
              ReceivableExport,
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable Test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
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

    it("[API]Create PO-s", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>PO Form document</p>",
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
                    validationAttribute: "PO Status",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
                    label: "Supplier ",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Supplier",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "po-items-built-in",
                    type: "purchaseorder",
                    index: 2,
                    label: "Purchase Order",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Purchase Order",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "lineitems",
                  },
                  {
                    label: "form.builder.approvals",
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kqqix31p",
                    uniqueSchemaItem: true,
                    index: 3,
                    tabId: "details",
                  },
                ],
              },

            },
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPOFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPOFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              cy.poAPICreatePO({
                payload: {
                  name: "",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdPOFormDocument.id },
                  description: "API PO document",
                  revisionChangeType: RevisionChangeType.NextRevision,
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
                  formInput: {
                    "po-items-built-in": {
                      items: [{
                        id: "kqqj708c",
                        type: "service",
                        date: (new Date()).toISOString(),
                        tax: false,
                        capitalEquipment: false,
                        isTraceabilityRequired: false,
                        description: "office cleaning",
                        serviceId: "cleaning",
                        units: "hours",
                        order: 5,
                        glCode: "code 1",
                        unitPrice: 30,
                        received: 0,
                        totalAmount: "150.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      taxRate: 9.25,
                      subTotal: "150.00",
                      totalAmount: "150.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "150.00",
                      dateOfExchangeRate: "",
                    },
                    "po-status-built-in": "Open",
                  },
                },
                employeeId: employeeLoginFirst.id,
                sessionId: loginResponse.sessionId,
              }).then((response) => {
                createdPODocument = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdPODocument.id,
                  payload: {
                    effectiveDate: (new Date()).toISOString(),
                    documentType: { id: approvalRequestDocumentType[0].id },
                    formDocument: { id: initialArDocument[0].id },
                    approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
                  },
                  employeeId: employeeLoginFirst.id,
                  sessionId: loginResponse.sessionId,
                }).then(() => {
                  cy.poAPICreatePO({
                    payload: {
                      name: "",
                      attachments: [],
                      referenceTo: [],
                      formDocument: { id: createdPOFormDocument.id },
                      description: "API PO document 2",
                      revisionChangeType: RevisionChangeType.NextRevision,
                      document: {
                        docId: "POT-00002",
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
                        "po-items-built-in": {
                          items: [{
                            id: "kdpr51z9",
                            type: "service",
                            date: (new Date()).toISOString(),
                            tax: false,
                            capitalEquipment: false,
                            isTraceabilityRequired: false,
                            description: "transporting products",
                            serviceId: "transportingID",
                            units: "hours",
                            order: 5,
                            glCode: "code 1",
                            unitPrice: 40,
                            received: 0,
                            totalAmount: "200.00",
                            formattedDate: (new Date()).toLocaleDateString("en-US"),
                            index: 0,
                          },
                          {
                            id: "kdpr51z8",
                            type: "service",
                            date: (new Date()).toISOString(),
                            tax: false,
                            capitalEquipment: false,
                            isTraceabilityRequired: false,
                            description: "office cleaning",
                            serviceId: "cleaningID",
                            units: "hours",
                            order: 6,
                            glCode: "code 1",
                            unitPrice: 30,
                            received: 0,
                            totalAmount: "180.00",
                            formattedDate: (new Date()).toLocaleDateString("en-US"),
                            index: 1,
                          }],
                          tax: "0.00",
                          taxRate: 9.25,
                          subTotal: "380.00",
                          totalAmount: "380.00",
                          shippingCost: "0.00",
                          currency: "USD",
                          exchangeRate: 1,
                          totalInUSD: "380.00",
                          dateOfExchangeRate: "",
                        },
                        "po-status-built-in": "Open",
                      },
                    },
                    employeeId: employeeLoginFirst.id,
                    sessionId: loginResponse.sessionId,
                  }).then((response) => {
                    createdPODocument = response;
                    cy.drAPIApproveAndRelease({
                      documentId: createdPODocument.id,
                      payload: {
                        effectiveDate: (new Date()).toISOString(),
                        documentType: { id: approvalRequestDocumentType[0].id },
                        formDocument: { id: initialArDocument[0].id },
                        approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
                      },
                      employeeId: employeeLoginFirst.id,
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
    });

    it("[API]Create and release inline form for Receivable", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Receivable inline form</p>",
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
              name: "Receivable inline form",
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
                  name: "receivable-kdptzei2",
                  applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                  tabId: "details",
                },
                {
                  index: 1,
                  type: "textfield",
                  name: "text-field-ke04ztn7",
                  rows: 1,
                  editorProperties: [],
                  label: "Text field",
                  placeholder: "Enter text",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  tabId: "details",
                },
                // {
                //   label: "form.builder.approvals",
                //   type: "poapprovals",
                //   deleteDisabled: false,
                //   name: "fb-po-approvals-kqqix31p",
                //   uniqueSchemaItem: true,
                //   index: 2,
                // },
                {
                  index: 2,
                  type: "section",
                  name: "textfield-kn7fc209",
                  validationMode: "default",
                  label: "Section 1",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  applicableValidationSchema: true,
                  validationAttribute: "textfield",
                  tabId: "details",
                },
                {
                  index: 3,
                  type: "textfield",
                  name: "textfield1-kn7fc7w4",
                  rows: 1,
                  validationMode: "default",
                  label: "textfield 1",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  applicableValidationSchema: true,
                  validationAttribute: "textfield",
                  tabId: "details",
                },
                {
                  index: 4,
                  type: "inlineapproval",
                  name: "inline-approval-kw6gbxwm",
                  hidden: false,
                  outputDisabled: false,
                  deleted: false,
                  deleteInFormDisabled: false,
                  validationMode: "default",
                  validationAttribute: "Inline approval",
                  tabId: "details",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  applicableValidationSchema: true,
                  editorProperties: [],
                  label: "Inline approval",
                  editorConfig: {
                    groups: [
                      group.body[0].id,
                    ],
                  },
                }],
              },
            },
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdRecivableFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecivableFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });

    it("[API]Create and release form for Receivable", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Receivable form</p>",
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
                  name: "receivable-kdptzei2",
                  applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                  tabId: "details",
                },
                {
                  index: 1,
                  type: "textfield",
                  name: "text-field-ke04ztn7",
                  rows: 1,
                  editorProperties: [],
                  label: "Text field",
                  placeholder: "Enter text",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  tabId: "details",
                },
                {
                  label: "form.builder.approvals",
                  type: "poapprovals",
                  deleteDisabled: false,
                  name: "fb-po-approvals-kqqix31p",
                  uniqueSchemaItem: true,
                  index: 2,
                  tabId: "details",
                }],
              },
            },
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdRecivableFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecivableFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a Receivable from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Receivable inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Receivable inline form" });

      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Select Receivable", () => {
      cy.recSelectPo({ poTitle: "API PO document 2" });
    });

    it("Enter text in textfield", () => {
      cy.get("[name^=\"textfield1\"]").arrowType("Test one");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Receivable with WIP status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ status: "WIP", filename: "-1" });
    });
  });

  context("Receivable with Last Signed status", () => {
    context("Add Receivable with Last Signed", () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
      });

      it("Select Last Signed", () => {
        cy.contains("Last Signed").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Last Signed", filename: "-1" });
      });
    });
  });

  context("Receivable with Archive status", () => {
    context("Add Receivable with Archive", () => {
      it("Click WIP status Receivable", () => {
        cy.contains("WIP").arrowClick();
      });

      it("Update section", () => {
        cy.get("[name^=\"textfield1\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
      });

      it("Select Archive", () => {
        cy.contains("Archive").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Archive", filename: "-1" });
      });
    });
  });

  context("Receivable with Released status", () => {
    context("Add Receivable with Released", () => {
      it("Click WIP status Receivable", () => {
        cy.contains("WIP").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Finalize and release button click'", () => {
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recApproveAndReleaseInlineRecord();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Released", filename: "-A" });
      });
    });
  });

  context("Receivable with Canceled status", () => {
    context("Add Receivable with Canceled", () => {
      it("Click Update Receivable", () => {
        cy.drClickReviseDocument();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click Cancel draft", () => {
        cy.drCancelDraftButton();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Canceled", filename: "-A-1" });
      });
    });
  });

  context("Receivable with Pending Approval status", () => {
    context("Create a Receivable from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the Receivable form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "Receivable form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Select Receivable", () => {
        cy.recSelectPo({ poTitle: "API PO document" });
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add Receivable with Pending Approval", () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-po-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save and submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Pending Approval", filename: "-A" });
      });
    });
  });

  context("Receivable with Voided status", () => {
    context("Create a Receivable from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the Receivable form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "Receivable form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add Receivable with Voided", () => {
      it("Click Void button", () => {
        cy.arVoidAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: "Voided", filename: "-A-Void" });
      });
    });
  });

});

export { };

