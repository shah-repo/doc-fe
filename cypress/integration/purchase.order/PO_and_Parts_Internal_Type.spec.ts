/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";


Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let releasedFormId;
let dateAfterEmailShouldArrive;
let emailDateOffset;
let emailsFromInbox;
let downloadUrl;
let tmpRegex;
let downloadFile;
let fileId;
let supplierFieldName;
let poFieldName;
let createdOldSupplierForm;
let group;
let initialArDocument;
let formDocumentType;
let supplierDocumentType;
let approvalRequestDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdMaintenanceRecordFormDocument;


const pages = ["", "", ""];
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
      { key: "New owner", value: `${owner}` },
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
      cy.get("[data-cy=\"Supplier \"]")
        .should("have.text", "Supplier ");
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
      cy.fbCheckFieldsExistSectionList("Section", "Subsection", "Step");
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
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
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
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Po  " });
      cy.fbAddField();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for Po Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify that the Form contains Details and Line Items tab", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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
      cy.get("[data-cy=\"Supplier \"]").contains("Supplier ")
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

  context("Enter html code into 'Render HTML' field", () => {
    // it("Enter html code into 'Render HTML' field", () => {
    //   cy.drEnterHtmlText({
    //     htmlText:
    //       `<!DOCTYPE html>
    //       <html lang="en">

    //       <head>
    //           <meta charset="UTF-8" />
    //           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //           <title>Document</title>
    //           <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
    //           <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />
    //           <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
    //       </head>

    //       <body>
    //           <style>
    //               html {
    //                   zoom: 0.2;
    //               }

    //               * {
    //                   margin: 0;
    //                   padding: 0;
    //                   box-sizing: border-box;
    //                   font-family: "Open Sans", sans-serif;
    //                   -webkit-print-color-adjust: exact;
    //               }

    //               .container {
    //                   width: 2480px;
    //                   padding: 80px;
    //                   margin: 0 auto;
    //                   position: relative;
    //                   background: #ffffff;
    //               }

    //               header {
    //                   padding-bottom: 30px;
    //                   border-bottom: 1px solid #d3d3d3;
    //                   margin-bottom: 80px;
    //                   height: 180px;
    //               }

    //               .fs41 {
    //                   font-size: 41px;
    //               }

    //               .fs34 {
    //                   font-size: 34px;
    //               }

    //               .fwb {
    //                   font-weight: bold;
    //                   letter-spacing: 1px;
    //               }

    //               .text-white {
    //                   color: white;
    //               }

    //               .title {
    //                   padding: 33px 30px;
    //                   background-color: #007698;
    //               }

    //               .title strong {
    //                   font-size: 34px;
    //                   color: white;
    //               }

    //               .information {
    //                   margin-bottom: 1.5em;
    //               }

    //               .information:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .information__supplier {
    //                   width: 1007px;
    //                   float: left;
    //                   border: 1px solid #d3d3d3;
    //                   min-height: 1100px;
    //               }

    //               .information__shipping {
    //                   width: 1273px;
    //                   float: right;
    //                   border: 1px solid #d3d3d3;
    //                   min-height: 1100px;
    //               }

    //               .supplier__address {
    //                   padding: 50px 30px;
    //                   border-bottom: 1px solid #d3d3d3;
    //                   height: 711px;
    //               }

    //               .supplier__contacts,
    //               .billing__mail {
    //                   height: 220px;
    //               }

    //               .shipping-billing {
    //                   height: 314px;
    //               }

    //               .address-value,
    //               .phone-value,
    //               .fax-value,
    //               .shipping-value,
    //               .billing-value,
    //               .data-value {
    //                   margin-left: 10px;
    //               }

    //               .supplier__contacts,
    //               .supplier__info,
    //               .billing__mail {
    //                   padding-left: 30px;
    //                   padding-top: 20px;
    //                   border-bottom: 1px solid #d3d3d3;
    //               }

    //               .supplier__info,
    //               .billing__contacts {
    //                   border-bottom: none;
    //                   height: 200px;
    //               }

    //               .invoice_mail,
    //               .contact_mail,
    //               .data__item,
    //               .total__item {
    //                   margin-bottom: 45px;
    //               }

    //               .invoice_mail div,
    //               .contact_mail div {
    //                   float: left;
    //                   margin-right: 30px;
    //               }

    //               .data__item div {
    //                   float: left;
    //                   margin-right: 30px;
    //               }

    //               .data__item::after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .invoice_mail:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .contact_mail:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .data-value {
    //                   font-size: 34px;
    //                   letter-spacing: 0px;
    //                   color: #292929;
    //               }

    //               .shipping-billing {
    //                   padding: 50px 30px;
    //                   border-bottom: 1px solid #d3d3d3;
    //               }

    //               .shipping-billing:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .shipping,
    //               .billing {
    //                   width: 48%;
    //               }

    //               .shipping {
    //                   float: left;
    //               }

    //               .billing {
    //                   float: right;
    //               }

    //               .billing__contacts {
    //                   border-bottom: none;
    //                   padding-left: 30px;
    //                   padding-top: 20px;
    //               }

    //               .data_element {
    //                   float: left;
    //                   padding-right: 10px;
    //                   width: 50%;
    //               }

    //               .list table {
    //                   border-spacing: 0;
    //                   border-collapse: collapse;
    //                   border: 1px solid #007698;
    //               }

    //               .table th {
    //                   text-align: center;
    //               }

    //               .list td {
    //                   border: 1px solid #d3d3d3;
    //               }

    //               table {
    //                   max-width: 100%;
    //               }

    //               th {
    //                   font-weight: 900;
    //               }

    //               table {
    //                   margin-bottom: 1.5em;
    //                   position: relative;
    //                   width: 100%;
    //                   z-index: 1;
    //               }

    //               table th,
    //               table td {
    //                   font-family: inherit;
    //                   font-size: inherit;
    //                   padding: 12px 0px;
    //                   vertical-align: middle;
    //                   font-size: 28px;
    //               }

    //               #checkbox {
    //                   border: 0.1px solid black;
    //                   height: 40px;
    //                   width: 40px;
    //                   position: absolute;
    //                   top: 30px;
    //                   left: 40px;
    //               }

    //               .checked {
    //                   width: 30px;
    //                   height: 15px;
    //                   border: 2px solid;
    //                   position: absolute;
    //                   top: 18%;
    //                   left: 13%;
    //                   transform: rotate(-45deg);
    //                   border-top: none;
    //                   border-right: none;
    //                   /* display:none; */
    //               }

    //               .smallCell {
    //                   width: 140px;
    //               }

    //               section {
    //                   margin-bottom: 50px;
    //               }

    //               .comments {
    //                   width: 1509px;
    //                   border: 1px solid #d3d3d3;
    //                   margin-right: 100px;
    //                   float: left;
    //               }

    //               .comments__block,
    //               .subtotal {
    //                   height: 240px;
    //               }

    //               .subtotal {
    //                   width: 635px;
    //                   float: left;
    //                   padding-top: 30px;
    //               }

    //               section:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .subtotal .data__item {
    //                   margin-bottom: 20px;
    //               }

    //               .total {
    //                   padding: 10px 50px 10px 10px;
    //                   width: 635px;
    //                   border: 1px solid #d3d3d3;
    //               }

    //               .total .total__item {
    //                   margin-bottom: 0px;
    //               }

    //               .total__item div {
    //                   float: left;
    //               }

    //               .total__item:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .approvals {
    //                   border: 1px solid #d3d3d3;
    //                   margin-bottom: 50px;
    //                   width: 2320px;
    //               }

    //               .directors {
    //                   padding: 20px 50px 20px 20px;
    //               }

    //               .directors div {
    //                   float: left;
    //                   margin-right: 200px;
    //                   width: fit-content;
    //               }

    //               .directors div:last-child {
    //                   margin-right: 0px;
    //               }

    //               .directors:after {
    //                   content: "";
    //                   display: block;
    //                   clear: both;
    //               }

    //               .directors ul {
    //                   list-style-type: none;
    //                   padding-top: 30px;
    //               }

    //               .directors ul li {
    //                   margin-bottom: 30px;
    //                   font-size: 34px;
    //               }

    //               .directors ul li:last-child {
    //                   margin-bottom: 0px;
    //               }

    //               .signature span {
    //                   font-size: 34px;
    //               }

    //               .notification {
    //                   padding-bottom: 50px;
    //                   border-bottom: 1px solid #d3d3d3;
    //               }

    //               #date {
    //                   position: absolute;
    //                   right: 80px;
    //                   margin-top: 10px;
    //                   font-weight: bold;
    //                   font-size: 20px;
    //               }
    //           </style>
    //           <div class="container">
    //               <header>
    //                   <div style="float: left; width: 33%;">
    //                       <p class="fwb fs41">Purchase Order </p>
    //                       <!-- <p class="fs41"style="color: #292929;">Shifamed</p> -->
    //                   </div>
    //                   <div style="float: left; width: 33%; text-align: center;"> <img src="https://doc-be-dev-public.s3.us-west-2.amazonaws.com/fbeba60d-2f25-4f35-90e8-41bb79b40df2/2020-05-21T08%3A37%3A20.213Z/shifamed-logo.png" alt="Logo" /> </div>
    //                   <div style="float: right;">
    //                       <p class="fwb fs41" style="color: #292929;">PO Number: {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}<span></span></p>
    //                   </div>
    //               </header>
    //               <div style="clear: both;"></div>
    //               <div class="information">
    //                   <div class="information__supplier">
    //                       <div class="title"> <strong class="fs18 text-white">SUPPLIER INFORMATION</strong> </div>
    //                       <div class="supplier__address">
    //                           <div style="float: left; margin-right: 20px; height: 100%;"> <strong style="color: #292929; font-size: 34px;">To:</strong> </div>
    //                           <div class="data-value">
    //                               <div>{{autocompletes.po-supplier-built-in.name}}</div>
    //                               <div id="to-description" style="white-space: pre;">{{{autocompletes.po-supplier-built-in.description}}}</div>
    //                           </div>
    //                       </div>
    //                       <div style="clear: both;"></div>
    //                       <div class="supplier__info">
    //                           <div class="data__item">
    //                               <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Department:</strong> </div>
    //                               <div class="data-value">{{documentRevision.formInput.department-k6ml6ew5}}</div>
    //                           </div>
    //                           <div class="data__item">
    //                               <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Requestor:</strong> </div>
    //                               <div class="data-value">{{autocompletes.po-requestor-autocomplete.user.name}}</div>
    //                           </div>
    //                       </div>
    //                   </div>
    //                   <div class="information__shipping">
    //                       <div class="title"> <strong>SHIPPING/BILLING INFORMATION</strong> </div>
    //                       <div class="shipping-billing" style="height: 100%">
    //                           <div class="shipping" style="height: 100%;width: 100%;">
    //                               <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Ship To:</strong> </div>
    //                               <div class="data-value">
    //                                   <div id="shipping" style="">
    //                                       <div id="shipping-customer-company" style="display: none">{{documentRevision.formInput.company-ship-to-address-kn5cq5gi}}</div>
    //                                       <div id="shipping-third-party-company" style="display: none">{{autocompletes.third-party-company-k7f25yb6.name}} <br/>{{{autocompletes.third-party-company-k7f25yb6.description}}}</div>
    //                                       <div id="shipping-complete-manually" style="display: none">{{documentRevision.formInput.ship-to-address-k7f27j0k}}</div>
    //                                   </div>
    //                               </div>
    //                           </div>
    //                           <div class="billing" style="width: 100%;margin-top: 40px;">
    //                               <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Bill To:</strong> </div>
    //                               <div class="data-value">
    //                                   <div id="billing1" style="">
    //                                       <div id="billing-customer-company"> Shifamed <br>590 Division St <br>Campbell CA 95008 </div>
    //                                       <div id="billing-complete-manually" style="display: none">{{documentRevision.formInput.company-bill-to-k7f2e82a}}</div>
    //                                   </div>
    //                                   <div id="billing"></div>
    //                               </div>
    //                           </div>
    //                       </div>
    //                       <div class="billing__mail">
    //                           <div class="invoice_mail">
    //                               <div style="float: left; width: 220px;"> <strong style="color: #292929; font-size: 34px;">Invoices to:</strong> </div>
    //                               <div class="data-value" style="float: left;">accounting@shifamed.com </div>
    //                           </div>
    //                           <div class="contact_mail">
    //                               <div style="float: left; width: 202px;"> <strong style="color: #292929; font-size: 34px;">Contact:</strong> </div>
    //                               <div class="data-value" style="float: left;">{{documentRevision.formInput.contact-email-kl7slf5l}}</div>
    //                           </div>
    //                       </div>
    //                       <div class="billing__contacts">
    //                           <div class="data_element">
    //                               <div class="data__item">
    //                                   <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Shipping:</strong> </div>
    //                                   <div class="data-value">{{documentRevision.formInput.shipping-k6mletok}}</div>
    //                               </div>
    //                               <div class="data__item">
    //                                   <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Terms:</strong> </div>
    //                                   <div class="data-value">{{documentRevision.formInput.terms-k6mlftzn}}</div>
    //                               </div>
    //                           </div>
    //                           <div class="data_element">
    //                               <div class="data__item">
    //                                   <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Ordered:</strong> </div>
    //                                   <div id="ordered" class="data-value"> </div>
    //                               </div>
    //                               <div class="data__item">
    //                                   <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Quote:</strong> </div>
    //                                   <div class="data-value">{{documentRevision.formInput.quotation-number-k7dwg3xr}} </div>
    //                               </div>
    //                           </div>
    //                       </div>
    //                   </div>
    //               </div>
    //               <div class="list">
    //                   <table id="items-table">
    //                       <thead>
    //                           <tr class="title text-white fwb" style="text-transform: uppercase;">
    //                               <th style="text-align: center;">Item</th>
    //                               <th style="text-align: center;width: 200px;">Order Qty</th>
    //                               <th style="text-align: center;">Units</th>
    //                               <th style="text-align: center;width: 400px;">SUP PN / Date Required</th>
    //                               <th style="text-align: center;">Description / PN</th>
    //                               <th style="text-align: center;">Price</th>
    //                               <th style="text-align: center;width: 230px;">Ext. Amount</th>
    //                               <th class="smallCell" style="text-align: center;">Tax</th>
    //                           </tr>
    //                       </thead>
    //                       <tbody> {{#documentRevision.formInput.po-items-built-in.items}}
    //                           <tr title="table-item">
    //                               <td class="data-value" style="text-align: center;">{{index++}}</td>
    //                               <td class="data-value" style="text-align: center;">{{order}}</td>
    //                               <td class="data-value" style="text-align: center;">{{units}}</td>
    //                               <td class="data-value" style="text-align: center;">{{supplierPartNumber}}<br /> {{formattedDate}}</td>
    //                               <td class="data-value" style="text-align: center;"> {{partNumberTitle}}{{^partNumberTitle}}{{description}}{{^description}}{{/description}}{{/partNumberTitle}} <br /> {{partNumberDocId}}{{^partNumberDocId}}{{serviceId}}{{^serviceId}}{{/serviceId}}{{/partNumberDocId}}</td>
    //                               </td>
    //                               <td class="data-value" style="text-align: center;"><span class="currency"></span>{{unitPrice}}</td>
    //                               <td class="data-value" style="text-align: center;"><span class="currency"></span>{{totalAmount}}</td>
    //                               <td style="position: relative; height: 188px;">
    //                                   <div id="checkbox">{{#tax}}&#10003;{{/tax}}</div>
    //                               </td>
    //                           </tr>
    //                           <tr style="text-align: center; height: 95px;background-color: #ECECEC;">
    //                               <td colspan="8" style="color: #292929; height: 95px;" class="data-value">{{glCode}}</td>
    //                           </tr> {{/documentRevision.formInput.po-items-built-in.items}} </tbody>
    //                   </table>
    //               </div>
    //               <section>
    //                   <div class="comments">
    //                       <div class="title"> <strong class="text-white fwb">NOTES / COMMENTS FOR SUPPLIER</strong> </div>
    //                       <div class="comments__block">
    //                           <div class="data-value" style="text-align: left; margin-left: 30px; margin-top: 30px;"> {{{documentRevision.formInput.comments-k6mlinzm}}} </div>
    //                       </div>
    //                   </div>
    //                   <div class="subtotal">
    //                       <div class="data__item">
    //                           <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Subtotal:</strong> </div>
    //                           <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.subTotal}} </div>
    //                       </div>
    //                       <div class="data__item">
    //                           <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Tax:</strong> </div>
    //                           <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.tax}} </div>
    //                       </div>
    //                       <div class="data__item">
    //                           <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Shipping Cost:</strong> </div>
    //                           <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.shippingCost}} </div>
    //                       </div>
    //                       <div class="total">
    //                           <div class="total__item">
    //                               <div style="width: 268px;"> <strong style="color: #292929; font-size: 34px;">Total:</strong> </div>
    //                               <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.totalAmount}} </div>
    //                           </div>
    //                       </div>
    //                   </div>
    //               </section>
    //               <div class="approvals">
    //                   <div class="title"> <strong class="text-white fwb">APPROVALS:<span></span></strong> </div>
    //                   <div class="directors">
    //                       <div style="margin-left: 100px;"> <strong style="color: #292929; font-size: 34px;">Name</strong> {{#documentRevision.approvals}}
    //                           <ul>
    //                               <li>{{approver.user.name}}</li>
    //                           </ul> {{/documentRevision.approvals}} </div>
    //                       <div> <strong style="color: #292929; font-size: 34px;">Date</strong> {{#validApprovalDates}}
    //                           <ul>
    //                               <li>{{reviewedAt}}</li>
    //                           </ul> {{/validApprovalDates}} </div>
    //                   </div>
    //               </div>
    //               <div class="notification">
    //                   <p style="color: #292929; font-size: 34px;"> <strong style="color: #292929; font-size: 34px;"> Change Notification: </strong> Supplier shall provide notification of any change or deviation to Goods and/or Services to be provided under the Purchase Order. Any change or deviation requires prior written consent. </p>
    //               </div>
    //               <div> </div>
    //               <footer>
    //                   <div id="pageFooter-last" /> </footer>
    //           </div>
    //           <script>
    //               var table = document.getElementById('items-table');
    //               var rows = [];
    //               var tempRows = table.getElementsByTagName('tr');
    //               for (var i = 0; i < tempRows.length; i++) {
    //                   if (tempRows[i].title === "table-item") {
    //                       rows.push(tempRows[i]);
    //                   }
    //               }
    //               for (var i = 0; i < rows.length; i++) {
    //                   var index = i + 1;
    //                   rows[i].cells[0].innerHTML = index;
    //               }
    //           </script>
    //           <script>
    //               document.getElementById("to-description").innerHTML = document.getElementById("to-description").innerHTML.replace(/(<((?!br|\/br)[^>]+)>)/gi, "");

    //               function formatDate(date) {
    //                   if (!date) {
    //                       return "";
    //                   }
    //                   return moment(date).format("MM/DD/YYYY");
    //               }
    //               document.getElementById("ordered").innerHTML = formatDate("{{documentRevision.formInput.po-order-date}}");

    //               function shipping(field, options) {
    //                   if (field === "Customer Company") {
    //                       document.getElementById("shipping").style.whiteSpace = 'normal';
    //                       return options.customerCompany;
    //                   } else if (field === "Third Party Company") {
    //                       document.getElementById("shipping").style.whiteSpace = 'normal';
    //                       return options.thirdPartyCompany;
    //                   } else if (field === "Complete Manually") {
    //                       document.getElementById("shipping").style.whiteSpace = 'pre';
    //                       return options.completeManually;
    //                   } else return "";
    //               };
    //               document.getElementById("shipping").innerHTML = shipping("{{documentRevision.formInput.ship-to-k7f1t1lw}}", {
    //                   customerCompany: document.getElementById("shipping-customer-company").innerHTML,
    //                   thirdPartyCompany: document.getElementById("shipping-third-party-company").innerHTML,
    //                   completeManually: document.getElementById("shipping-complete-manually").innerHTML,
    //               });

    //               function billing(field, options) {
    //                   if (field === "Customer Company") {
    //                       document.getElementById("billing").style.whiteSpace = 'normal';
    //                       return options.customerCompany;
    //                   } else if (field === "Complete Manually") {
    //                       document.getElementById("billing").style.whiteSpace = 'pre';
    //                       return options.completeManually;
    //                   } else return "";
    //               };
    //               document.getElementById("billing").innerHTML = billing("{{documentRevision.formInput.bill-to-k7f29tfo}}", {
    //                   customerCompany: document.getElementById("billing-customer-company").innerHTML,
    //                   completeManually: document.getElementById("billing-complete-manually").innerHTML,
    //               });

    //               function getCurrency(currency) {
    //                   switch (currency) {
    //                       case "EUR":
    //                           return "€";
    //                       case "USD":
    //                           return "$";
    //                       case "GBP":
    //                           return "£";
    //                       default:
    //                           return "";
    //                   }
    //               }
    //               var currencyElements = document.getElementsByClassName("currency");
    //               for (var i = 0; i < currencyElements.length; i++) {
    //                   currencyElements[i].innerHTML = getCurrency("{{documentRevision.formInput.po-items-built-in.currency}}");
    //               };
    //               if ("{{documentRevision.formInput.ship-to-k7f1t1lw}}" === "Customer Company") {
    //                   document.getElementById("shipping").innerHTML = document.getElementById("shipping").innerHTML.replace(/, /gi, "<br>");
    //               };
    //               if ("{{documentRevision.formInput.bill-to-k7f29tfo}}" === "Customer Company") {
    //                   document.getElementById("billing").innerHTML = document.getElementById("billing").innerHTML.replace(/, /gi, "<br>");
    //               }
    //           </script>
    //       </body>

    //       </html>`,
    //   });
    // });

    it("navigate to Details tab", () => {
      cy.drSelectLineItems();
    });

    it("Verify Supporting Documents", () => {
      cy.get("[id=\"attachmentHeader\"]").contains("Supporting Documents")
        .should("exist");
    });
  });

  context("Send email, verify email and verify PDF file content", () => {
    context("Verify `Draft DAM document` title", () => {
      it("Check doc Draft status and click on Send To Email", () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("FM-").then((x) => {
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

    context("Verify email for draft document notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${releasedFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        });
      });

      it("Verify the emails that should be received", () => {
        const ADMIN_USER = USERS[1];
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: ADMIN_USER.email,
            contains: [`Hello <b>${ADMIN_USER.name},</b>`,
              "Your documents are ready for download.",
              "<button type=\"button\">DOWNLOAD</button>",
              company.id],
          }];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });

    // context("Verify zip file downloaded", () => {
    //   it("Download zip file containing document notification", () => {
    //     expect(downloadUrl).contains("exported_file_download");
    //     fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

    //     cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
    //       if (res.body !== "") {
    //         downloadUrl = res.body.url;
    //         const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
    //         downloadFile  =  `${releasedFormId}${filetime}_draft.zip`;
    //         cy.downloadFile({
    //           url: downloadUrl,
    //           directory: CONFIG.DOWNLOADS_DIR,
    //           fileName: downloadFile,
    //         });
    //       }
    //     });
    //   });

    //   it("Verify file size of the downloaded zip file", () => {
    //     const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
    //     cy.readFile(zipfile).its("length").should("be.gt", 500);
    //   });

    //   it("extract pdf file from zip file", () => {
    //     cy.unzipFile(
    //       {
    //         directory: CONFIG.DOWNLOADS_DIR,
    //         fileName: downloadFile,
    //       });
    //   });

    //   it("Verify attached file length more than 500 bytes", () => {
    //     const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
    //       downloadFile.replace(".zip", ""), "image.jpg");
    //     cy.readFile(attachedFile).its("length").should("be.gt", 500);
    //   });
    // });

    // context("Verify PDF file content draft document", () => {
    //   it("Extract texts from PDF file content draft document", () => {
    //     cy.pdfparseFile({
    //       directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
    //       fileName: `${releasedFormId}-1-DAM-Document.pdf`,
    //     }).then((cdata) => {
    //       expect(cdata.numpages).eq(3);
    //       expect(cdata.text).match(/Page 1 of 3/);
    //       expect(cdata.text).match(/Page 2 of 3/);
    //       expect(cdata.text).match(/Page 3 of 3/);
    //       tmpRegex = new RegExp( "\\n\\n");
    //       const arr = cdata.text.split(tmpRegex);
    //       arr.forEach((element) => {
    //         if (element.includes("Page 1 of 3")) {
    //           pages[0] = element;
    //         }
    //         if (element.includes("Page 2 of 3")) {
    //           pages[1] = element;
    //         }
    //         if (element.includes("Page 3 of 3")) {
    //           pages[2] = element;
    //         }
    //       });
    //     });
    //   });

    //   it("Verify page 1 for draft document", () => {
    //     const el = pages[0];
    //     if (el.includes("Page 1 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/AR ID\nNone/);

    //       tmpRegex = new
    //       RegExp( `Description\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Attachments/);

    //       expect(el).match(/image.jpg/);

    //       expect(el).match(/Checkbox/);

    //       expect(el).match(/1 2 3/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 1 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });

    //   it("Verify page 2 for draft document", () => {
    //     const el = pages[1];
    //     if (el.includes("Page 2 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/APPROVAL ROLES/);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole One\nApproving Users\n${FIRST_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole Two\nApproving Users\n${SECOND_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole Three\nApproving Users\n${THIRD_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).not.match(/TEXT FIELD/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 2 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });

    //   it("Verify page 3 for draft document", () => {
    //     const el = pages[2];
    //     if (el.includes("Page 3 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).not.match(/TEXT FIELD/);

    //       expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 3 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });
    // });

  });

  context("Approve and Release", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Send email, verify email and verify PDF file content", () => {
    context("Verify `Draft DAM document` title", () => {
      it("Check doc Draft status and click on Send To Email", () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("FM-").then((x) => {
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

    // context("Verify email for draft document notification", () => {
    //   it("Get emails", () => {
    //     const getEmailSetting =  {
    //       to: CONFIG.TEST_EMAIL,
    //       // eslint-disable-next-line @typescript-eslint/camelcase
    //       wait_time_sec: 5,
    //       after: dateAfterEmailShouldArrive,
    //       subject: `Export for document ${releasedFormId}`,
    //     };

    //     cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
    //       emailsFromInbox = emails;
    //       expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
    //       downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
    //     });
    //   });

    //   it("Verify the emails that should be received", () => {
    //     const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
    //       {
    //         sentToUser: USERS[1].email,
    //         contains: [`Hello <b>${USERS[1].name},</b>`,
    //           "Your documents are ready for download.",
    //           "<button type=\"button\">DOWNLOAD</button>",
    //           company.id],
    //       }];

    //     cy.imapVerifyEmailsInList({
    //       receivedEmails: emailsFromInbox,
    //       emailsToTest: emailsThatShouldBeReceived,
    //       getEmailsSincedate: dateAfterEmailShouldArrive,
    //       assertNumberOfEmailsFoundInList: 1,
    //     });
    //   });
    // });

    // context("Verify zip file downloaded", () => {
    //   it("Download zip file containing document notification", () => {
    //     expect(downloadUrl).contains("exported_file_download");
    //     fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

    //     cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
    //       if (res.body !== "") {
    //         downloadUrl = res.body.url;
    //         const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
    //         downloadFile  =  `${releasedFormId}${filetime}_draft.zip`;
    //         cy.downloadFile({
    //           url: downloadUrl,
    //           directory: CONFIG.DOWNLOADS_DIR,
    //           fileName: downloadFile,
    //         });
    //       }
    //     });
    //   });

    //   it("Verify file size of the downloaded zip file", () => {
    //     const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
    //     cy.readFile(zipfile).its("length").should("be.gt", 500);
    //   });

    //   it("extract pdf file from zip file", () => {
    //     cy.unzipFile(
    //       {
    //         directory: CONFIG.DOWNLOADS_DIR,
    //         fileName: downloadFile,
    //       });
    //   });

    //   it("Verify attached file length more than 500 bytes", () => {
    //     const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
    //       downloadFile.replace(".zip", ""), "image.jpg");
    //     cy.readFile(attachedFile).its("length").should("be.gt", 500);
    //   });
    // });

    // context("Verify PDF file content draft document", () => {
    //   it("Extract texts from PDF file content draft document", () => {
    //     cy.pdfparseFile({
    //       directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
    //       fileName: `${releasedFormId}-1-DAM-Document.pdf`,
    //     }).then((cdata) => {
    //       expect(cdata.numpages).eq(3);
    //       expect(cdata.text).match(/Page 1 of 3/);
    //       expect(cdata.text).match(/Page 2 of 3/);
    //       expect(cdata.text).match(/Page 3 of 3/);
    //       tmpRegex = new RegExp( "\\n\\n");
    //       const arr = cdata.text.split(tmpRegex);
    //       arr.forEach((element) => {
    //         if (element.includes("Page 1 of 3")) {
    //           pages[0] = element;
    //         }
    //         if (element.includes("Page 2 of 3")) {
    //           pages[1] = element;
    //         }
    //         if (element.includes("Page 3 of 3")) {
    //           pages[2] = element;
    //         }
    //       });
    //     });
    //   });

    //   it("Verify page 1 for draft document", () => {
    //     const el = pages[0];
    //     if (el.includes("Page 1 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/AR ID\nNone/);

    //       tmpRegex = new
    //       RegExp( `Description\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Attachments/);

    //       expect(el).match(/image.jpg/);

    //       expect(el).match(/Checkbox/);

    //       expect(el).match(/1 2 3/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 1 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });

    //   it("Verify page 2 for draft document", () => {
    //     const el = pages[1];
    //     if (el.includes("Page 2 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/APPROVAL ROLES/);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole One\nApproving Users\n${FIRST_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole Two\nApproving Users\n${SECOND_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new
    //       RegExp( `Approval Role\nRole Three\nApproving Users\n${THIRD_USER.name}\nApproving Groups`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).not.match(/TEXT FIELD/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 2 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });

    //   it("Verify page 3 for draft document", () => {
    //     const el = pages[2];
    //     if (el.includes("Page 3 of 3")) {
    //       tmpRegex = new
    //       RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
    //       expect(el).match(tmpRegex);

    //       expect(el).not.match(/TEXT FIELD/);

    //       expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

    //       expect(el).match(/Draft/);

    //       tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
    //       expect(el).match(tmpRegex);

    //       expect(el).match(/Page 3 of 3/);

    //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
    //       expect(el).not.match(tmpRegex);
    //     }
    //   });
    // });

  });

  context("Fill out all the fields", () => {
    it("click on create New", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter description 'New Purchase Order'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Save PO", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });

  context("verify all the fields", () => {
    it("Navigate to PO Landing Page", () => {
      cy.navigToPurchaseOrder();
    });

    it("click on Add New Purchase order", () => {
      cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase order record" });
    });

    it("Verify that the top left of the page displays docId", () => {
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("PO-00002")
        .should("exist");
    });

    it("Verify that the top left of the page displays Rev", () => {
      cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev A")
        .should("exist");
    });

    it("Verify that the top left of the page displays status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains("DRAFT")
        .should("exist");
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
      cy.get("[data-cy=\"common.summary.total\"]").contains("Summary of totals")
        .should("exist");
    });

    it("Verify SubTotal", () => {
      cy.get("[data-cy=\"SubTotal\"]").contains("SubTotal")
        .should("exist");
    });

    it("Verify Tax Total", () => {
      cy.get("[data-cy=\"Tax Total\"]").contains("Tax Total")
        .should("exist");
    });

    it("Verify Grand Total", () => {
      cy.get("[data-cy=\"form.builder.grand.total\"]").contains("Grand Total")
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
      cy.get("[data-cy=\"Supplier \"]").contains("Supplier ")
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
    });

    it("Remove reference for document", () => {
      cy.drRemoveReferences({ reference: "FM-00002" });
      cy.progressBarShouldNotExist();
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

  context("verify Bookmark and Revision History fields", () => {
    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Save PO", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });

  context("Verify the Predefined schema field for PO line item", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
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
  });

  context("Click 'Add line item' and fill the data", () => {
    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").click();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Check Tax box", () => {
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poAddPOButtonClick();
      });
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$10.00" });
    });

    it("Check Tax value", () => {
      cy.poCheckTax({ number: "0.925000" });
    });

    it("Check Total value", () => {
      cy.unClick();
      cy.get("[data-cy=\"poTotal\"]").should("have.text", "$30.93");
    });

    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it(`Verify SubTotal field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(1).contains("$10.00")
        .should("exist");
    });

    it(`Verify Tax Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(3).contains("$0.93")
        .should("exist");
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(5).contains("$30.93")
        .should("exist");
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("delete line item", () => {
      cy.get("[class=\"MuiSvgIcon-root FBIcon-root MuiSvgIcon-fontSizeSmall\"]").eq(0).click();
      cy.wait(2000);
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(5).contains("$20.00")
        .should("exist");
    });
  });

  context("Click 'Add line item' and select Service data", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add item' button", () => {
      cy.unClick();
      cy.get("[data-cy=\"fb-control-btn\"]").click();
    });

    it("Click on service option", () => {
      cy.poSelectOption({ optionName: "service" });
    });

    it("Select service id", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "2" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "10" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$20.00" });
    });

    it("Check Total value", () => {
      cy.unClick();
      cy.get("[data-cy=\"poTotal\"]").should("have.text", "$40.00");
    });

    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it(`Verify SubTotal field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(1).contains("$20.00")
        .should("exist");
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(5).contains("$40.00")
        .should("exist");
    });
  });

  context("Navigate to Line items tab and add Enlil part, include taxes", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").click();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Check Tax box", () => {
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poAddPOButtonClick();
      });
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.unClick();
    });

    it("Check Subtotal value", () => {
      cy.poCheckAmount({ number: "$30.00" });
    });

    it("Check Tax value", () => {
      cy.poCheckTax({ number: "0.925000" });
    });

    it("Check Total value", () => {
      cy.unClick();
      cy.get("[data-cy=\"poTotal\"]").should("have.text", "$250.93");
    });

    it("navigate to Details tab and verify the Summary of totals", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it(`Verify SubTotal field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(1).contains("$30.00")
        .should("exist");
    });

    it(`Verify Grand Total field`, () => {
      cy.get("[class=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-auto\"]").eq(5).contains("$250.93")
        .should("exist");
    });
  });

  context("Add and remove Attachement", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("navigate to Details tab ", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Check one attachment is displayed: image.jpg", () => {
      cy.get("[data-cy=\"attachment.title\"]").contains("image.jpg").should("exist");    });

    it("Remove attachment image.jpg", () => {
      cy.get("[id=\"AttachmentIconPresenter-handleRemove\"]").eq(1).arrowClick({ force: true });
    });

    it("Check one attachment is removed", () => {
      cy.get("[data-cy=\"attachment.title\"]").should("not.exist");
    });

    it("Uploads text.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("navigate to Details tab ", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it("Add approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("check attachement on dashboard", () => {
      cy.get("svg[class^=\"makeStyles-icon-\"]").eq(0).arrowClick();
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
      cy.get("svg[class^=\"makeStyles-icon-\"]").eq(0).arrowClick();
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
    });

    it("verify that PO landing page is pulling correct data", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PO-00002").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType("A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType("Open").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType("API Supplier Document").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType("PRT-00005 - 1").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(5).clear().arrowType("$250.93").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(6).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(7).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select PO from the list", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PO-00001");
      cy.dlSelectFirstDocument();
    });

    it("Add approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve PO", () => {
      cy.ebApprove();
    });

    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("verify that PO landing page is pulling correct data for newly released po", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PO-00001").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType("A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType("Open").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(5).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(6).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(7).clear().arrowType("N/A").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select PO from the list", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PO-00002");
      cy.dlSelectFirstDocument();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Download all attachments with redline document", () => {
      cy.atchDownloadAll();
    });

  });

  context(`Login with ${USERS[1].name} user`, () => {
    const saveFileNameOne = (Math.round(Math.random() * 100000)) % 100000;
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("click on Add New Purchase order", () => {
      cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Another new purchase order description" });
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Verify Supporting Documents", () => {
      cy.get("[id=\"attachmentHeader\"]").contains("Supporting Documents")
        .should("exist");
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image1.jpg" });
    });

    it("Check attachment is displayed: image1.jpg", () => {
      cy.get("[data-cy=\"attachment.title\"]").contains("image1.jpg").should("exist");
    });

    it("navigate to Details tab ", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Check attachment is displayed: image1.jpg", () => {
      cy.get("[data-cy=\"attachment.title\"]").contains("image1.jpg").should("exist");
    });

    it("Download attachment", () => {
      cy.atchDownloadFile({ fileName: "image1.jpg", saveFileName: saveFileNameOne + "image1.jpg" });
    });

    it("Check size of downloaded file2", () => {
      cy.readFile(`cypress/downloads/${saveFileNameOne}image1.jpg`).should("have.length", "32732");
    });

    it("Remove attachment image1.jpg", () => {
      cy.get("[id=\"AttachmentIconPresenter-handleRemove\"]").eq(1).arrowClick({ force: true });
    });

    it("Check one attachment is removed", () => {
      cy.get("[data-cy=\"attachment.title\"]").should("not.exist");
    });

    it("Uploads text.docx", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("navigate to Details tab ", () => {
      cy.wait(2000);
      cy.drSelectDetailsTab();
    });

    it("Add approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve PO", () => {
      cy.ebApprove();
    });
  });
});
