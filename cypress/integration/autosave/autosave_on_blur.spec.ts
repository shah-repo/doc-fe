// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let purchaseOrderDocumentType;
let formDocumentType;
let receivableDocumentType;
let group;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let createdPODocument;
let createdRecivableFormDocument;
let createdReceivable1;

context("Autosave on blur", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });


    it("[API]Create receivables", (done: any) => {
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
                schema: [{
                  index: 0,
                  type: "purchaseorder",
                  label: "PO",
                  name: "po-kdpqvhc7",
                  applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                }],
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
              cy.poAPICreatePO({
                payload: {
                  name: "",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdPOFormDocument.id },
                  description: "API PO document",
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
                    "po-kdpqvhc7": {
                      items: [{
                        id: "kdpr51z9",
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
                      subTotal: "150.00",
                      totalAmount: "150.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "150.00",
                      dateOfExchangeRate: "",
                    },
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
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
                  cy.drCreateDocumentRevision({
                    payload: {
                      attachments: [],
                      description: "<p>document form for Receivable</p>",
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
                      cy.recAPICreateReceivable({
                        payload: {
                          name: "",
                          description: "",
                          attachments: [],
                          referenceTo: [],
                          formDocument: { id: createdRecivableFormDocument.id },
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
                            "receivable-kdptzei2": createdPODocument.id,
                          },
                        },
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then((response) => {
                        createdReceivable1 = response;
                        cy.drAPIApproveAndRelease({
                          documentId: createdReceivable1.id,
                          payload: {
                            effectiveDate: (new Date()).toISOString(),
                            documentType: { id: approvalRequestDocumentType[0].id },
                            formDocument: { id: initialArDocument[0].id },
                            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                          },
                          employeeId: adminEmployee.id,
                          sessionId: loginResponse.sessionId,
                        }).then(() => {
                          cy.recAPICreateReceivable({
                            payload: {
                              name: "",
                              description: "",
                              attachments: [],
                              referenceTo: [],
                              formDocument: { id: createdRecivableFormDocument.id },
                              revisionChangeType: RevisionChangeType.NextRevision,
                              document: {
                                docId: "RC-00006",
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
                                "receivable-kdptzei2": createdPODocument.id,
                              },
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
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Add all Form builder fields that needs to be tested with autosave", () => {
    // it("Add TextField", () => {
    //   cy.fbAddNewField();
    //   cy.fbSelectItemFromNewFieldList({ field: "Text field" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Checkbox group", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
    //   cy.fbGroupOptions("option1");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Autocomplete", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
    //   cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    //   cy.wait(2000);
    // });

    // it("Add Text Editor", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Date picker", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Select", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Select" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
    //   cy.fbGroupOptions("option1", "option2");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Radio Button group", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
    //   cy.fbGroupOptions("option1", "option2");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add File Upload", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Quantity", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Timer", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
    //   cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Purchase Order", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Receive Purchase Order", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Receive Purchase Order" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    it("Add Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add PO Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
        cy.fbAddNewFieldButton();
      });
    });

    // it("Add Instructions Media upload", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Evidence Media upload", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Test Requirement", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-test-req" });
    //   cy.get("[data-cy=\"testRequirement\"]")
    //     .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Procedure", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Equipment", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
    //   cy.get("input[value=\"preventativeMaintenance\"]").click();
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Text field with range", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-range" });
    //   cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Section", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Section" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-section" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Subsection", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Subsection" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Step", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Step" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-step" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Approvals", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Approvals" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Inline Approval", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
    //   cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
    //   cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Request Approval", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Request Approval" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-request-approval" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Checkpoint", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Create a Label", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-create-label" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Implementation Task", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-task" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Instructions 'MPI'", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.get(`[data-cy="form.builder.instructionsdocument"]`).eq(-1).click();
    //   cy.fbEnterNameValue({ name: "label", value: "fb-mpi" });
    //   cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Instructions 'Select Document(s)'", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
    //   cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Instructions 'Select Requirement(s)'", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-select-req" });
    //   cy.get("[data-cy=\"options\"]")
    //     .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    // it("Add Actions 'Action Button'", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create document from form and test autosave on blur", () => {
    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New document from form'", () => {
      cy.drEnterDocumentTitle({ name: "New document from form" });
    });

    it("Enters description 'New document from form description'", () => {
      cy.drEnterDocumentDescription({ description: "New document from form description" });
    });

    // it("Fill TextField and check for autosave", () => {
    //   cy.get("[name^=fb-textfield-]").type("Test field");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Check Checkbox field and check for autosave", () => {
    //   cy.get("[name^=fb-checkbox-group-]>label>span>span>input").check();
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Select Autocomplete field and check for autosave", () => {
    //   cy.get("[data-cy^=fb-autocomplete-]").type("FM-000{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Fill text editor field and check for autosave", () => {
    //   cy.get("[data-cy^=fb-text-editor-]>div>div>div>div>div[contenteditable]>div")
    //     .click({ force: true }).type("Test description", { force: true });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Select Date and check for autosave", () => {
    //   cy.xpath("//input[@name]/ ../div/button").click().wait(200);
    //   // eslint-disable-next-line max-len
    //   cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]")
    //     .last().click().wait(300);
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Select value for select field and check for autosave", () => {
    //   cy.get("[id^=\"mui-component-select-fb-select-field-\"]").click();
    //   cy.get("[data-value=\"option1\"]").click();
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Select radiobutton and check for autosave", () => {
    //   cy.get("[name^=\"fb-radiobutton-group-\"]").first().click();
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Upload attachment and check for autosave", () => {
    //   cy.fixture("test.docx").then((fileContent) => {
    //     cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
    //       cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).attachFile({
    //         fileContent: fileContent.toString(),
    //         fileName: "test.docx",
    //         mimeType: "*",
    //         filePath: `fixtures/test.docx`,
    //       });
    //     });
    //   });
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Enter quantity value and check for autosave", () => {
    //   cy.get("[name^=\"fb-quantity-\"]").type("2");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    // it("Add PO item and check for autosave", () => {
    //   cy.poAddNewFieldItem();
    //   cy.wrapWithWaitOnApiCalls(
    //     [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //       cy.poAddPOButtonClick();
    //     });
    // });

    // it("Select PO receivable and check for autosave", () => {
    //   cy.get("[data-cy^=\"porec-fb-receive-purchase-order-\"]").type("PO-0000{downarrow}{enter}");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
    //     cy.unClick();
    //   });
    // });

    it("Add DAM item and check for autosave", () => {
      it("Click on 'Add Item' button", () => {
        cy.drAddApprovalMatrixItem();
      });

      it("Add prefix: DWOTS", () => {
        cy.drAddAMItemValue({ identity: "prefix", value: "DWOTS" });
      });

      it("Add internalType", () => {
        cy.drAMInternalType({ value: "OTHER" });
      });

      it("Add document type: 'Document Without Training & Signature'", () => {
        cy.drAddAMItemValue({ identity: "documentType", value: "Document Without Training & Signature" });
      });

      it("Ensure 'Training Required' not selected", () => {
        cy.get(`[data-cy="trainingReq"] input[type=checkbox]`).should("not.be.checked");
      });

      it("Save Approval Matrix Item", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit, CyRoutes.GetDocAudit], () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
        });
      });
    });
  });
});


export { };
