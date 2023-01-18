// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
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
              TestDocumentType,
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login admin with autosave trigger shown", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
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
                          tabId: "details",
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
                            "receivable-kdptzei2": { id: createdPODocument.id },
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
                                "receivable-kdptzei2": { id: createdPODocument.id },
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
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
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
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
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

    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs",  field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2", "option3");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Add Select", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbGroupOptions("option1", "option2");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Timer", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Receive Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add PO Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Procedure", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Equipment", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
      cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Text field with range", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
      cy.fbEnterNameValue({ name: "label", value: "fb-range" });
      cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
    });

    it("Add Approvals", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Approvals" });
      cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Implementation Task", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
      cy.fbEnterNameValue({ name: "label", value: "fb-task" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    // Commented due to :ENC-13644
    // it("Add Instructions 'Select Document(s)'", () => {
    //   cy.fbAddNewFieldWhenHidden();
    //   cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "Select Document(s)" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
    //   cy.get("[data-cy=\"options\"]").autocompleteSelect("AR Form");
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    //     cy.fbAddNewFieldButton();
    //   });
    // });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "instructions-media-upload" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "evidence-media-upload" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
    });

    it("Add image to Instructions Media Upload", () => {
      cy.contains("instructions-media-upload").parentsUntil("li")
        .find("[data-cy=\"albumMediaButton\"]").arrowClick();
      cy.elUploadAttachment({
        fileName: "image.jpg",
        el: "fb-mediaalbum-upload-instructions-media-upload",
      });
      cy.saveBarShouldNotExist();
    });

    it("Delete image from Instructions Media Upload", () => {
      cy.get(`[id^="fb-mediaalbum-upload-instructions-media-upload-"]`)
        .parent().find("button").eq(3).click({ force: true });
      cy.saveBarShouldNotExist();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
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

    it("Fill TextField and check for autosave", () => {
      cy.get("[name^=fb-textfield-]").arrowType("Test field");
      cy.unClick();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Check Checkbox field and check for autosave", () => {
      cy.get("[name^=fb-checkbox-group-]>label>span>span>input").check("option1");
      cy.unClick();
      cy.saveBarShouldNotExist();
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[name^=fb-checkbox-group-]>label>span>span>input").check("option2");
      cy.wait("@response", { responseTimeout: 65 * 1000 });
    });

    it("Check Checkbox values are saved", () => {
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.reload();
      cy.get("[name^=fb-checkbox-group-]>label>span>span>input").eq(0).should("be.checked");
      cy.get("[name^=fb-checkbox-group-]>label>span>span>input").eq(1).should("be.checked");
      cy.progressBarShouldNotExist();
    });

    it("Uncheck Checkbox field and check for autosave", () => {
      cy.get("[name^=fb-checkbox-group-]>label>span>span>input").uncheck("option1");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select Autocomplete field and check for autosave", () => {
      cy.get("[data-cy^=fb-autocomplete-]").autocompleteSelect("FM-000");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Remove Autocomplete field and check for autosave", () => {
      cy.get("[data-cy^=fb-autocomplete-]").click();
      cy.get("[name^=fb-autocomplete-] button").eq(0).click();
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Fill text editor field and check for autosave", () => {
      cy.get("[data-cy^=fb-text-editor-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("Test description", { force: true });
      cy.unClick();
      cy.saveBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select Date and check for autosave", () => {
      cy.xpath("//input[@name]/ ../div/button").arrowClick();
      // eslint-disable-next-line max-len
      cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]")
        .last().arrowClick();
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select value for select field and check for autosave", () => {
      cy.get("[id^=\"mui-component-select-fb-select-field-\"]").arrowClick();
      cy.get("[data-value=\"option1\"]").arrowClick();
      cy.unClick();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Select another value for select field and check for autosave", () => {
      cy.get("[id^=\"mui-component-select-fb-select-field-\"]").arrowClick();
      cy.get("[data-value=\"option2\"]").arrowClick();
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select radiobutton and check for autosave", () => {
      cy.get("[name^=\"fb-radiobutton-group-\"]").first().arrowClick();
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Enter quantity value and check for autosave", () => {
      cy.get("[name^=\"fb-quantity-\"]").arrowType("2");
      cy.get("[data-cy=fb-quantity]").arrowClick();
      cy.saveBarShouldNotExist();
    });

    it("Edit quantity value and check for autosave", () => {
      cy.get("[name^=\"fb-quantity-\"]").clear().arrowType("3");
      cy.get("[data-cy=fb-quantity]").arrowClick();
      cy.saveBarShouldNotExist();
    });

    it("Add PO service item and check for autosave", () => {
      cy.get("[data-cy='form.builder.add.line.item']").arrowClick({ force: true });
      cy.poSelectOption({ optionName: "service" });
      cy.poEnterServiceID({ serviceId: "SRV123" });
      cy.poAddPOButtonClick();
      cy.saveBarShouldNotExist();
    });

    it("Select PO receivable and check for autosave", () => {
      cy.get("[data-cy^=\"porec-fb-receive-purchase-order-\"]").autocompleteSelect("POT-0000");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Enter Timer value and check for autosave", () => {
      cy.get("[name^=\"fb-timer-\"]").arrowType("5");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

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
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
        cy.saveBarShouldNotExist();
      });
    });

    it("Add POAM item and check for autosave", () => {
      cy.get(`[name^="fb-po-approval-matrix-"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.poAMEnterLevelName({ name: "2" });
      cy.poAMEnterLimit({ limit: "400" });
      cy.poAMSelectUsers(USERS[3].name);
      cy.poAddPOButtonClick();
    });

    it("Add Procedure step description and check for autosave", () => {
      cy.get("[data-cy$=\"description\"]>div>div>div>div>div[contenteditable]").eq(1)
        .click({ force: true }).arrowType("Step One description", { force: true });
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select Preventative Maintenance required 'No' and check for autosave", () => {
      cy.get("[name$=\".requirements\"]").eq(1).arrowClick();
      cy.get("[data-cy$=\".justification\"]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("Justification description", { force: true });
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Enter FB range and check for autosave", () => {
      cy.get("[name*=\"fb-range-\"]").arrowType("2");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Select Approval and check for autosave", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy^=\"fb-approvals-fb-approvals\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();

    });

    it("Upload attachment and check for autosave", () => {
      cy.fixture("test.docx").then((fileContent) => {
        cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).attachFile({
          fileContent: fileContent.toString(),
          fileName: "test.docx",
          mimeType: "*",
          filePath: `fixtures/test.docx`,
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Add Implementation task and check for autosave", () => {
      cy.get("[data-cy=\"form.builder.add.implementation.task\"]").arrowClick({ force: true });
      cy.get("[data-cy=\"title\"]").arrowType("Task One");
      cy.get("#fb-mpiprocedure-ref-description").arrowClick({ force: true }).arrowType("Task Description");
      cy.get("[data-cy=\"assigned\"]").focus().autocompleteSelect(`${USERS[1].email}`);
      cy.get("[name=\"dueDate\"]").parent().find("button").arrowClick({ force: true });
      // eslint-disable-next-line max-len
      cy.xpath(
        "//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]"
      ).last().click();
      cy.get("[data-cy=\"fb-control-btn\"]").eq(-2).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
    });

    // Commented due to :ENC-13644
    // it("Select REQ and check for autosave", () => {
    //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    //     cy.get("[data-cy^=\"fb-select-doc-\"]").autocompleteSelect("FM-00001");
    //     cy.unClick();
    //   });
    // });

    it("Delete Upload attachment and check for autosave", () => {
      cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).parent().parent()
        .find("button").first().click({ force: true });
      cy.saveBarShouldNotExist();
    });
  });

  context("Verify autosave of radiobutton change while Date autosave is in process", () => {
    it("Select Date", () => {
      cy.progressBarShouldNotExist();
      cy.wait(2000);
      cy.xpath("//input[@name]/ ../div/button").arrowClick();
      // eslint-disable-next-line max-len
      cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]")
        .last().arrowClick();
    });

    it("While autosaving, check radiobutton", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[name^=\"fb-radiobutton-group-\"]").last().arrowClick();
      cy.wait("@response", { responseTimeout: 90 * 1000 });
    });
  });

  context("Verify autosave of text editor change while TextField autosave is in process", () => {
    it("Fill TextField", () => {
      cy.progressBarShouldNotExist();
      cy.get("[name^=fb-textfield-]").clear().arrowType("New Test field");
    });

    it("While autosaving, fill text editor field", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[data-cy^=fb-text-editor-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("text editor", { force: true });

      cy.wait("@response", { responseTimeout: 90 * 1000 });
    });
  });

  context("Verify autosave of quantity change while TextField autosave is in process", () => {
    it("Fill TextField", () => {
      cy.progressBarShouldNotExist();
      cy.get("[name^=fb-textfield-]").clear().arrowType("Testing field while quantity is changed");
    });

    it("While autosaving, edit quantity field", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[name^=\"fb-quantity-\"]").click({ force: true }).clear().arrowType("3");
      cy.get("[data-cy=fb-quantity]").arrowClick({ force: true });
      cy.wait("@response", { responseTimeout: 90 * 1000 });
    });
  });


  context("Verify autosave of autocomplete change while TextField autosave is in process", () => {
    it("Fill TextField", () => {
      cy.progressBarShouldNotExist();
      cy.get("[name^=fb-textfield-]").clear().arrowType("Testing field while autocomplete is selected");
    });

    it("While autosaving, edit autocomplete field", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[data-cy^=fb-autocomplete-]").autocompleteSelect("FM-000");
      cy.unClick();

      cy.wait("@response", { responseTimeout: 90 * 1000 });
    });
  });
});


export { };

