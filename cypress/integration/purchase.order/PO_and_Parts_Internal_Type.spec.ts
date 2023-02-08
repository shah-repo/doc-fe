/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let group;
let initialArDocument;
let formDocumentType;
let supplierDocumentType;
let approvalRequestDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdMaintenanceRecordFormDocument;


const owner = USERS[1].name;
const history = [
  {
    owner,
    actions: [
      { key: "Description changed", value: "New Purchase order record" },
    ],
  },
  {
    owner,
    actions: [
      { key: "New Doc ID", value: "PO-00002" },
      { key: "Form Set To", value: "FM-00002 - revision 1 - New Purchase Order Form" },
      { key: "New owner", value: owner },
      { key: "Access granted to group", value: "Everyone" },
      { key: "New status", value: `Set to Draft by ${owner}` },
    ],
  },
];

context("PO and parts ", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("Create company", () => {
    it("[API] Creates company", (done: any) => {
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
              Part,
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API] Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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
        createdMaintenanceRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceRecordFormDocument.id,
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
  });

  context("Create purchase order form", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Purchase Order Form" });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Predefined fields are displayed", () => {
    it("Button should have check title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Purchase Order Form")
        .should("exist");
    });

    it("Button should have check Description", () => {
      cy.get("[data-cy=\"description\"]").contains( "New Purchase Order Form description")
        .should("exist");
    });

    it("Button should have text Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Button should have text Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Button should have text Numeric", () => {
      cy.get("[data-cy=\"common.Numeric\"]").contains("Numeric")
        .should("exist");
    });

    it("Button should have text Selected Users", () => {
      cy.get("[data-cy=\"field-securityEmployees\"]").contains("Selected Users")
        .should("exist");
    });

    it("Button should have text Selected Groups", () => {
      cy.get("[data-cy=\"field-securityGroups\"]").contains("Selected Groups")
        .should("exist");
    });

    it("Button should have text Attachments", () => {
      cy.get("div[id^=\"attachmentHeader\"]").contains("Attachments")
        .should("exist");
    });

    it("Button should have text Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Button should have text Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify that the top left of the page displays docId", () => {
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("FM-00002")
        .should("exist");
    });

    it("Verify that the top left of the page displays Rev", () => {
      cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev 1")
        .should("exist");
    });

    it("Verify that the top left of the page displays status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains("DRAFT")
        .should("exist");
    });

    it("Verify Form opens to the Details tab by default", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });

    it("Verify the page displays Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

    it("Button should have text PO Status", () => {
      cy.get("[data-cy=\"PO Status\"]")
        .should("have.text", "PO Status");
    });

    it("Button should have text General Information", () => {
      cy.get("[data-cy=\"General Information\"]")
        .should("have.text", "General Information");
    });

    it("Button should have text Requestor", () => {
      cy.get("[data-cy=\"Requestor\"]")
        .should("have.text", "Requestor");
    });

    it("Button should have text Supplier ", () => {
      cy.get("[data-cy^=\"Supplier\"]")
        .should("contain.text", "Supplier");
    });

    it("Button should have text Order Date", () => {
      cy.get("[data-cy=\"Order Date\"]")
        .should("have.text", "Order Date");
    });

    it("Button should have text Summary of totals", () => {
      cy.get("[data-cy=\"common.summary.total\"]")
        .should("have.text", "Summary of totals");
    });

    it("Verify the page displays", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });
  });

  context("Verify Add Field section", () => {
    it("Verify Add Field section", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.get(`input[placeholder^="Search"]`).should("exist");
      cy.fbVerifySectionsOnAddField("Section", "Inputs", "Approvals", "Custom Controls",
        "Instructions", "Buttons", "Actions");
    });

    it("Verify Section  from Add field field", () => {
      cy.get(`[data-cy="Section-btn"]`).arrowClick();
      cy.get("[data-cy='Section']").eq(0).should("exist");
      cy.get("[data-cy='Section']").eq(1).arrowClick();
      cy.get(`[data-cy="fb-editor-mode-config-0"]`).should("exist");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).should("exist");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="Section-btn"]`).arrowClick();
    });

    it("Verify 'Input' from Add Field section", () => {
      cy.fbCheckFieldsExistInputsList("Text field", "Checkbox group", "Autocomplete", "Text Editor",
        "Date picker", "Hyperlink", "Select", "Radio Button group", "Paragraph", "File Upload",
        "Blank Template Form", "Quantity", "Timer", "Purchase Order", "Receive Purchase Order",
        "PO Approval Matrix", "Instructions Media upload", "Evidence Media upload", "EB Procedure",
        "PI Procedure", "Equipment", "Text field with range", "Supplier");
      cy.fbCheckFieldsDoesntExistOnInputsList("LHR Step");
      cy.fbCheckFieldsExistApprovalsList("Approvals", "Inline Approval", "Request Approval");
      cy.fbCheckFieldsExistInstructionsList("MPI", "Select Document(s)");
      cy.fbCheckFieldsExistButtonsList("Checkpoint", "Create a Label", "Implementation Task");
      cy.fbCheckFieldsExistActionsList("Action Button");
      cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
    });

    it("Verify Search Field for `text`", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("text").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="Text field"]`).should("exist");
      cy.get(`[data-cy="Text Editor"]`).should("exist");
      cy.get(`[data-cy="Text field with range"]`).should("exist");
    });

    it("Verify Search Field for `upload`", () => {
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("upload").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="File Upload"]`).should("exist");
      cy.get(`[data-cy="Instructions Media upload"]`).should("exist");
      cy.get(`[data-cy="Evidence Media upload"]`).should("exist");
    });

    it("Verify Search Field for `inline`", () => {
      cy.get(`input[placeholder^="Search"]`).clear().arrowType("inline").arrowClick();
      cy.unClick();
      cy.get(`[data-cy="Inline Approval"]`).should("exist");
      cy.get(`[data-cy="Inline Approval"]`).parent()
        .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
      cy.get(`input[placeholder^="Search"]`).clear();
    });

    it("Verify Favorites", () => {
      cy.fbVerifySectionsOnAddField("Favorites");
      cy.fbCheckFieldsExistFavoritesList("Inline Approval");
      cy.get(`[data-cy="Inline Approval"]`).parent()
        .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
      cy.fbVerifySectionsNotOnAddField("Favorites");
    });
  });

  context("Add components in the form", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for purchase order test" });
      cy.fbAddField();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Verify the highlighted Items", () => {
    it("Verify the remove button", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().should("exist");
    });

    it("Verify the Edit button", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().should("exist");
    });

    it("Verify the presentation button", () => {
      cy.get("[class=\"MuiSvgIcon-root\"]").eq(18).should("exist");
    });

    it("Verify the drag & drop button", () => {
      cy.get("[class=\"drag-handle\"]").last().should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Po  " });
      cy.fbAddField();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("move component", () => {
      cy.get("[data-cy='Textfield for Po  ']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for Po Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });
  });

  context("Verify that the Form contains Details and Line Items tab", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Button should have text Details Tab", () => {
      cy.get("[data-cy=\"tabId.details\"]")
        .should("have.text", "Details");
    });

    it("Button should have text Line Items Tab", () => {
      cy.get("[data-cy=\"tabId.lineitems\"]")
        .should("have.text", "Line Items");
    });
  });

  context("Verify Form opens to the Details tab by default and it contains", () => {
    it("Verify Form opens to the Details tab by default", () => {
      cy.get("[data-cy=\"tabId.details\"]").contains("Details")
        .should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Purchase Order Form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("New Purchase Order Form description")
        .should("exist");
    });

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Purchase Order", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Purchase Order")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });
  });

  context("Verify Form opens to the Details tab by default and it contains", () => {
    it("Verify PO Status", () => {
      cy.get("[data-cy=\"PO Status\"]").contains("PO Status")
        .should("exist");
    });

    it("Verify General Information", () => {
      cy.get("[data-cy=\"General Information\"]").contains("General Information")
        .should("exist");
    });

    it("Verify Requestor", () => {
      cy.get("[data-cy=\"Requestor\"]").contains("Requestor")
        .should("exist");
    });

    it("Verify Supplier ", () => {
      cy.get("[data-cy^=\"Supplier\"]").contains("Supplier")
        .should("exist");
    });

    it("Verify Order Date", () => {
      cy.get("[data-cy=\"Order Date\"]").contains("Order Date")
        .should("exist");
    });

    it("Verify Summary of totals", () => {
      cy.get("[data-cy=\"common.summary.total\"]").contains("Summary of totals")
        .should("exist");
    });

    it("Verify Approvals", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").contains("Approvals")
        .should("exist");
    });

    it("Verify Textfield for purchase order test", () => {
      cy.get("[data-cy=\"Textfield for purchase order test\"]").contains("Textfield for purchase order test")
        .should("exist");
    });

    it("Verify fb-checkbox-group", () => {
      cy.get("[data-cy=\"fb-checkbox-group\"]").contains("fb-checkbox-group")
        .should("exist");
    });

    it("Verify fb-autocomplete", () => {
      cy.get("[data-cy=\"fb-autocomplete\"]").contains("fb-autocomplete")
        .should("exist");
    });
  });

  context("Approve and Release", () => {
    it("Approve and Release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill out all the fields", () => {
    it("click on create New", () => {
      cy.drCreateNewDocumentFromForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'New Purchase Order'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add '${USERS[1].name}' as the Requestor`, () => {
      cy.get("[name^=po-requestor-]").click().autocompleteSelect(`${USERS[1].name} - ${USERS[1].email}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      cy.get(`[name="po-order-date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("verify all the fields", () => {
    it("Navigate to PO Landing Page", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create new PO", () => {
      cy.poClickCreatePO();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase order record" });
      cy.progressBarShouldNotExist();
    });

    it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Purchase Orders",
        docId: "PO-00002",
        revision: "Rev A",
      });
    });

    it("Button should have text Details Tab", () => {
      cy.get("[data-cy=\"tabId.details\"]")
        .should("have.text", "Details");
    });

    it("Button should have text Line Items Tab", () => {
      cy.get("[data-cy=\"tabId.lineitems\"]")
        .should("have.text", "Line Items");
    });

    it("Verify Textfield for purchase order test", () => {
      cy.get("[data-cy=\"Textfield for purchase order test\"]").contains("Textfield for purchase order test")
        .should("exist");
    });

    it("Verify fb-checkbox-group", () => {
      cy.get("[data-cy=\"fb-checkbox-group\"]").contains("fb-checkbox-group")
        .should("exist");
    });

    it("Verify fb-autocomplete", () => {
      cy.get("[data-cy=\"fb-autocomplete\"]").contains("fb-autocomplete")
        .should("exist");
    });

    it("Verify Summary of totals", () => {
      cy.get(`[data-cy="common.summary.total"]`).contains("Summary of totals")
        .should("exist");
    });

    it("Verify SubTotal", () => {
      cy.get(`[data-cy="common.summary.sub.total"]`).contains("SubTotal")
        .should("exist");
    });

    it("Verify Tax Total", () => {
      cy.get(`[data-cy="common.summary.tax"]`).contains("Tax Total")
        .should("exist");
    });

    it("Verify Grand Total", () => {
      cy.get(`[data-cy="form.builder.grand.total"]`).contains("Grand Total")
        .should("exist");
    });

    it("Verify PO Status", () => {
      cy.get("[data-cy=\"PO Status\"]").contains("PO Status")
        .should("exist");
    });

    it("Verify Requestor", () => {
      cy.get("[data-cy=\"Requestor\"]").contains("Requestor")
        .should("exist");
    });

    it("Verify Order Date", () => {
      cy.get("[data-cy=\"Order Date\"]").contains("Order Date")
        .should("exist");
    });

    it("Verify Supplier ", () => {
      cy.get("[data-cy^=\"Supplier\"]").contains("Supplier")
        .should("exist");
    });

    it("Verify Create a new supplier", () => {
      cy.get("[data-cy=\"form.builder.create.new.supplier\"]").contains("Create a new supplier")
        .should("exist");
    });
  });

  context("verify References fields", () => {
    it("Verify References ", () => {
      cy.get("[data-cy=\"references-icon\"]").should("exist");
    });

    it("Verify General Info ", () => {
      cy.get("[data-cy=\"generalInfo\"]").should("exist");
    });

    it("Verify Avatar ", () => {
      cy.get("[data-cy=\"user-avatar\"]").should("exist");
    });

    it("Verify User name ", () => {
      cy.get("[data-cy=\"user-name\"]").should("exist");
    });

    it("Verify References ", () => {
      cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
    });

    it("Verify Referenced By ", () => {
      cy.get("[data-cy=\"generalInfo\"]").contains("Referenced By")
        .should("exist");
    });

    it("Verify ReleaseDate ", () => {
      cy.get("[data-cy=\"releaseDate\"]").should("exist");
    });

    it("Verify FormInfo ", () => {
      cy.get("[data-cy=\"output.info\"]").should("exist");
    });

    it("Verify Migrate Form ", () => {
      cy.get("[data-cy=\"common.form.migration\"]").should("exist");
    });

    it("Add reference to part", () => {
      cy.drSelectReferences("FM-00002");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Remove reference for document", () => {
      cy.drRemoveReferences({ reference: "FM-00002" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("verify PO History fields", () => {
    it("Verify PO History", () => {
      cy.get("[data-cy=\"note-icon\"]").should("exist");
    });
  });

  context("verify History fields", () => {
    it("Verify History ", () => {
      cy.get("[data-cy=\"timeline-icon\"]").should("exist");
    });

    it("Open History drawer and compare history values", () => {
      cy.drSelectHistoryTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
          else {
            if (action.key === "Access granted to group") {
              cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
                expect($identifier.text()).to.be.oneOf(["Everyone"]);
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

  context("verify Access Permission fields", () => {
    it("Verify Access Permission ", () => {
      cy.get("[data-cy=\"permission-icon\"]").should("exist");
    });
  });

  context("verify Bookmark and Revision History fields", () => {
    it("Verify Bookmark ", () => {
      cy.get("[data-cy=\"bookmark-icon\"]").should("exist");
    });

    it("Verify Revision History ", () => {
      cy.get("[data-cy=\"cr-icon\"]").should("exist");
    });
  });

  context("Fill all fields", () => {
    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add '${USERS[1].name}' as the Requestor`, () => {
      cy.get("[name^=po-requestor-]").click().autocompleteSelect(`${USERS[1].name} - ${USERS[1].email}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      cy.get(`[name="po-order-date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify the Predefined schema field for PO line item", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify Supporting Documents", () => {
      cy.get("[id=\"attachmentHeader\"]").contains("Supporting Documents")
        .should("exist");
    });

    it(`Verify item field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Item")
        .should("exist");
    });

    it(`Verify Part Number field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Part Number")
        .should("exist");
    });

    it(`Verify Supplier Part Number field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Supplier Part Number")
        .should("exist");
    });

    it(`Verify Description field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Description")
        .should("exist");
    });

    it(`Verify Ordered field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Ordered")
        .should("exist");
    });

    it(`Verify Receipt Qty field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Receipt Qty")
        .should("exist");
    });

    it(`Verify Units field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Units")
        .should("exist");
    });

    it(`Verify Date Required field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Date Required")
        .should("exist");
    });

    it(`Verify Unit Price field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Unit Price")
        .should("exist");
    });

    it(`Verify Lots field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Lots")
        .should("exist");
    });

    it(`Verify Tax field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Tax")
        .should("exist");
    });

    it(`Verify Sum field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Sum")
        .should("exist");
    });

    it(`Verify ADD LINE ITEM field`, () => {
      cy.get("[data-cy=\"form.builder.add.line.item\"]").should("exist");
    });

    it(`Verify Sub Total:  field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Sub Total: ")
        .should("exist");
    });

    it(`Verify Tax Rate:  field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Tax Rate: ")
        .should("exist");
    });

    it(`Verify Tax:  field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Tax: ")
        .should("exist");
    });

    it(`Verify Shipping cost:  field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Shipping cost: ")
        .should("exist");
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("Grand Total")
        .should("exist");
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });
  });

  context("Click 'Add line item' and fill the data", () => {
    it("Click on 'Add line Item'", () => {
      cy.get(`button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax option", () => {
      cy.poSelectTaxCheckbox();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$10.00" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax value", () => {
      cy.poCheckTax({ number: "0.925000" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Check Grand Total", () => {
      cy.poCheckTotalAmount({ number: "$12.93" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });


    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Summary of totals should be visible", () => {
      cy.get(`[data-cy="common.summary.total"]`).scrollIntoView();
    });

    it("Check Sub total", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(1).contains("$10.00");
    });

    it("Check Tax Total", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(3).contains("$0.93");
    });

    it("Check Shipping cost", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(5).contains("$2.00");
    });

    it(`Verify Grand Total field`, () => {
      SystemRequirement("REQ-1440");
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(7).contains("$12.93");
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("delete line item", () => {
      cy.get("[data-cy=\"poItems\"]").eq(0).find("td").eq(0).click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(5).contains("$0.00");
    });
  });

  context("Click 'Add line item' and select Service data", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add line Item'", () => {
      cy.get(`button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on service option", () => {
      cy.poSelectOption({ optionName: "service" });
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select service id", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "2" });
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      cy.poSelectUnits();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "10" });
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$20.00" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax value", () => {
      cy.poCheckTax({ number: "0.00" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Total value", () => {
      cy.poCheckTotalAmount({ number: "$20.00" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Summary of totals should be visible", () => {
      cy.get(`[data-cy="common.summary.total"]`).scrollIntoView();
    });

    it("Check Subtotal", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(1).contains("$20.00");
    });

    it("Check Tax Total", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(3).contains("$0.00");
    });

    it(`Verify Shipping Cost`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(5).contains("$0.00");
    });

    it(`Verify Grand Total`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(7).contains("$20.00");
    });
  });

  context("Navigate to Line items tab and add Enlil part, include taxes", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add line Item'", () => {
      cy.get(`button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax box", () => {
      cy.poSelectTaxCheckbox();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$30.00" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax value", () => {
      cy.poCheckTax({ number: "0.925000" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      // cy.get(`[name="po-items-built-in.shippingCost"]`).arrowClick();
      // cy.get(`[name*="po-items-built-in.shippingCost"]`).arrowType("{selectAll}{backspace}{2}");
      // cy.unClick();
      // cy.progressBarShouldNotExist();
      // cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Check Total value", () => {
      cy.poCheckTotalAmount({ number: "$32.92" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Summary of totals should be visible", () => {
      cy.get(`[data-cy="common.summary.total"]`).scrollIntoView();
    });

    it("Summary of totals should be visible", () => {
      cy.get(`[data-cy="common.summary.total"]`).scrollIntoView();
    });

    it("Check Subtotal", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(1).contains("$30.00");
    });

    it("Check Tax Total", () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(3).contains("$0.93");
    });

    it(`Verify Shipping Cost`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(5).contains("$2.00");
    });

    it(`Verify Grand Total`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto"]`).eq(7).contains("$32.92");
    });
  });

  context("Add and remove Attachement", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab ", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check one attachment is displayed: image.jpg", () => {
      cy.get("[data-cy=\"attachment.title\"]").contains("image.jpg").should("exist");    });

    it("Remove attachment image.jpg", () => {
      cy.get("[id=\"AttachmentIconPresenter-handleRemove\"]").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check one attachment is removed", () => {
      cy.get("[data-cy=\"attachment.title\"]").should("not.exist");
    });

    it("Uploads test.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.progressBarShouldNotExist();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
    });

    it("navigate to Details tab ", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Add approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").scrollIntoView().arrowClick().wait(1000);
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[2].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Navigate to dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("check attachement on dashboard", () => {
      cy.get("svg[data-cy='expand-icon']").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify Attachments", () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-sm-6 MuiGrid-grid-md-9\"]").eq(4).contains("image.jpg")
        .should("exist");
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-sm-6 MuiGrid-grid-md-9\"]").eq(4).contains("test.docx")
        .should("exist");
    });
  });

  context(`Login with ${USERS[2].name} user`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("check attachement on dashboard", () => {
      cy.get("svg[data-cy='expand-icon']").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify Attachments", () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-sm-6 MuiGrid-grid-md-9\"]").eq(4).contains("image.jpg")
        .should("exist");
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-sm-6 MuiGrid-grid-md-9\"]").eq(4).contains("test.docx")
        .should("exist");
    });
  });

  context(`Login with ${USERS[1].name} user`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filter", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify that PO landing page is pulling correct data", () => {
      cy.get("[class='k-textbox']").eq(0).clear().arrowType("PO-00002").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(1).clear().arrowType("A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(2).clear().arrowType("Open").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(3).clear().arrowType("API Supplier Document").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(4).clear().arrowType("PRT-00005 - 1").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(5).clear().arrowType("$32.92").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(6).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(7).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Select PO from the list", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[class='k-textbox']").eq(0).clear().arrowType("PO-00001");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.dlSelectFirstDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Add approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").scrollIntoView();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick().wait(1000);
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[1].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Approve PO", () => {
      cy.ebApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filter", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify that PO landing page is pulling correct data for newly released po", () => {
      cy.get("[class='k-textbox']").eq(0).clear().arrowType("PO-00001").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(1).clear().arrowType("A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(2).clear().arrowType("Open").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(3).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(4).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(5).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(6).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class='k-textbox']").eq(7).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Select PO from the list", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.get("[class='k-textbox']").eq(0).clear().arrowType("PO-00002");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

      cy.dlSelectFirstDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Download all attachments with redline document", () => {
      cy.atchDownloadAll();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Navigate to Po landing page`, () => {
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("click on Add New Purchase order", () => {
      cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Another new purchase order description" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("[data-cy='po-requestor-autocomplete']").autocompleteSelect(USERS[1].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Line Items", () => {
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.drSelectLineItems();
    });

    it("Verify Supporting Documents", () => {
      cy.get("[id=\"attachmentHeader\"]").contains("Supporting Documents")
        .should("exist");
    });

    it("Uploads image.jpg", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
    });

    it("Uploads test.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.progressBarShouldNotExist();
    });

    it("Check attachment is displayed: image.jpg", () => {
      cy.get("[data-cy=\"attachment.title\"]").contains("image.jpg").should("exist");
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab ", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approver", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy^='fb-po-approvals-']").scrollIntoView();
      cy.get("[data-cy^='fb-po-approvals-']").arrowClick();
      cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[1].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Download attachments document", () => {
      cy.atchDownloadAll();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab ", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve PO", () => {
      cy.ebApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });
});

export { };
