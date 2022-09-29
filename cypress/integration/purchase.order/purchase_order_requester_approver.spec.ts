/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let poHTMLDocRevId;
let adminEmployeeLoginResponse;
let adminEmployee;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;
let multipleCompanies;
const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";

context("po_requestor_as_an_approver", () => {
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
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 0;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [
              Part,
              PurchaseOrderTest,
              ReceivableTest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login second user", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        done();
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 1 ? true : false;

        done();
      });
    });

    it("[API]Create Supplier form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: adminEmployeeLoginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: adminEmployeeLoginResponse.sessionId,
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
            sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
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
              sessionId: adminEmployeeLoginResponse.sessionId,
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
                sessionId: adminEmployeeLoginResponse.sessionId,
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
                  sessionId: adminEmployeeLoginResponse.sessionId,
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
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
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
          sessionId: adminEmployeeLoginResponse.sessionId,
        }).then(() =>  done());
      });
    });

  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
      // cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
      //   req.reply((res) => {
      //     if (res.body !== "") {
      //       loginResponse = res.body;
      //     }
      //   });
      // }).as("response");
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      // cy.wait("@response");
    });
  });

  context("Create Form PO Approval matrix", () => {
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
    });
    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });
  context("Create POAM document for PO", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.listLoadingElementShouldNotExist();
    });
    it("Enters title 'POAM Document'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Document" });
    });
    it("Enters description 'POAM Doc description'", () => {
      cy.drEnterDocumentDescription({ description: "POAM Doc description" });
    });
    it("Navigate to MatrixDetails tab", () => {
      cy.drSelectMatrixDetailsTab();
    });
    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
    });
    it("Enter Level Name value to be '1'", () => {
      cy.poAMEnterLevelName({ name: "1" });
    });
    it("Enter Limit value to be '5000'", () => {
      cy.poAMEnterLimit({ limit: "5000" });
    });
    it(`Select Users '${USERS[1].name}'`, () => {
      cy.poAMSelectUsers(USERS[1].name);
      cy.wait(1000);
      cy.poAMSelectUsers(USERS[3].name);
    });
    it("Add first POAM level", () => {
      cy.poAddPOButtonClick();
    });
    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
    });
    it("Enter Level Name value to be '2'", () => {
      cy.poAMEnterLevelName({ name: "2" });
    });
    it("Enter Limit value to be '25000'", () => {
      cy.poAMEnterLimit({ limit: "25000" });
    });
    it(`Select Users '${USERS[2].name}'`, () => {
      cy.poAMSelectUsers(USERS[2].name);
    });
    it("Add second POAM level", () => {
      cy.poAddPOButtonClick();
    });
    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create 'Purchase Order' form", () => {

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'po title'", () => {
      cy.drEnterDocumentTitle({ name: "po title" });
    });

    it("Enter document description 'Purchase Order document description'", () => {
      cy.drEnterDocumentDescription({ description: "Purchase Order document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Purchase Order test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Enter html code into 'Render HTML' field", () => {
      cy.drEnterHtmlText({
        htmlText:
          `<!DOCTYPE html>
          <html lang="en">

          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />
              <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
          </head>

          <body>
              <style>
                  html {
                      zoom: 0.2;
                  }

                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      font-family: "Open Sans", sans-serif;
                      -webkit-print-color-adjust: exact;
                  }

                  .container {
                      width: 2480px;
                      padding: 80px;
                      margin: 0 auto;
                      position: relative;
                      background: #ffffff;
                  }

                  header {
                      padding-bottom: 30px;
                      border-bottom: 1px solid #d3d3d3;
                      margin-bottom: 80px;
                      height: 180px;
                  }

                  .fs41 {
                      font-size: 41px;
                  }

                  .fs34 {
                      font-size: 34px;
                  }

                  .fwb {
                      font-weight: bold;
                      letter-spacing: 1px;
                  }

                  .text-white {
                      color: white;
                  }

                  .title {
                      padding: 33px 30px;
                      background-color: #007698;
                  }

                  .title strong {
                      font-size: 34px;
                      color: white;
                  }

                  .information {
                      margin-bottom: 1.5em;
                  }

                  .information:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .information__supplier {
                      width: 1007px;
                      float: left;
                      border: 1px solid #d3d3d3;
                      min-height: 1100px;
                  }

                  .information__shipping {
                      width: 1273px;
                      float: right;
                      border: 1px solid #d3d3d3;
                      min-height: 1100px;
                  }

                  .supplier__address {
                      padding: 50px 30px;
                      border-bottom: 1px solid #d3d3d3;
                      height: 711px;
                  }

                  .supplier__contacts,
                  .billing__mail {
                      height: 220px;
                  }

                  .shipping-billing {
                      height: 314px;
                  }

                  .address-value,
                  .phone-value,
                  .fax-value,
                  .shipping-value,
                  .billing-value,
                  .data-value {
                      margin-left: 10px;
                  }

                  .supplier__contacts,
                  .supplier__info,
                  .billing__mail {
                      padding-left: 30px;
                      padding-top: 20px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  .supplier__info,
                  .billing__contacts {
                      border-bottom: none;
                      height: 200px;
                  }

                  .invoice_mail,
                  .contact_mail,
                  .data__item,
                  .total__item {
                      margin-bottom: 45px;
                  }

                  .invoice_mail div,
                  .contact_mail div {
                      float: left;
                      margin-right: 30px;
                  }

                  .data__item div {
                      float: left;
                      margin-right: 30px;
                  }

                  .data__item::after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .invoice_mail:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .contact_mail:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .data-value {
                      font-size: 34px;
                      letter-spacing: 0px;
                      color: #292929;
                  }

                  .shipping-billing {
                      padding: 50px 30px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  .shipping-billing:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .shipping,
                  .billing {
                      width: 48%;
                  }

                  .shipping {
                      float: left;
                  }

                  .billing {
                      float: right;
                  }

                  .billing__contacts {
                      border-bottom: none;
                      padding-left: 30px;
                      padding-top: 20px;
                  }

                  .data_element {
                      float: left;
                      padding-right: 10px;
                      width: 50%;
                  }

                  .list table {
                      border-spacing: 0;
                      border-collapse: collapse;
                      border: 1px solid #007698;
                  }

                  .table th {
                      text-align: center;
                  }

                  .list td {
                      border: 1px solid #d3d3d3;
                  }

                  table {
                      max-width: 100%;
                  }

                  th {
                      font-weight: 900;
                  }

                  table {
                      margin-bottom: 1.5em;
                      position: relative;
                      width: 100%;
                      z-index: 1;
                  }

                  table th,
                  table td {
                      font-family: inherit;
                      font-size: inherit;
                      padding: 12px 0px;
                      vertical-align: middle;
                      font-size: 28px;
                  }

                  #checkbox {
                      border: 0.1px solid black;
                      height: 40px;
                      width: 40px;
                      position: absolute;
                      top: 30px;
                      left: 40px;
                  }

                  .checked {
                      width: 30px;
                      height: 15px;
                      border: 2px solid;
                      position: absolute;
                      top: 18%;
                      left: 13%;
                      transform: rotate(-45deg);
                      border-top: none;
                      border-right: none;
                      /* display:none; */
                  }

                  .smallCell {
                      width: 140px;
                  }

                  section {
                      margin-bottom: 50px;
                  }

                  .comments {
                      width: 1509px;
                      border: 1px solid #d3d3d3;
                      margin-right: 100px;
                      float: left;
                  }

                  .comments__block,
                  .subtotal {
                      height: 240px;
                  }

                  .subtotal {
                      width: 635px;
                      float: left;
                      padding-top: 30px;
                  }

                  section:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .subtotal .data__item {
                      margin-bottom: 20px;
                  }

                  .total {
                      padding: 10px 50px 10px 10px;
                      width: 635px;
                      border: 1px solid #d3d3d3;
                  }

                  .total .total__item {
                      margin-bottom: 0px;
                  }

                  .total__item div {
                      float: left;
                  }

                  .total__item:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .approvals {
                      border: 1px solid #d3d3d3;
                      margin-bottom: 50px;
                      width: 2320px;
                  }

                  .directors {
                      padding: 20px 50px 20px 20px;
                  }

                  .directors div {
                      float: left;
                      margin-right: 200px;
                      width: fit-content;
                  }

                  .directors div:last-child {
                      margin-right: 0px;
                  }

                  .directors:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .directors ul {
                      list-style-type: none;
                      padding-top: 30px;
                  }

                  .directors ul li {
                      margin-bottom: 30px;
                      font-size: 34px;
                  }

                  .directors ul li:last-child {
                      margin-bottom: 0px;
                  }

                  .signature span {
                      font-size: 34px;
                  }

                  .notification {
                      padding-bottom: 50px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  #date {
                      position: absolute;
                      right: 80px;
                      margin-top: 10px;
                      font-weight: bold;
                      font-size: 20px;
                  }
              </style>
              <div class="container">
                  <header>
                      <div style="float: left; width: 33%;">
                          <p class="fwb fs41">Purchase Order </p>
                          <!-- <p class="fs41"style="color: #292929;">Shifamed</p> -->
                      </div>
                      <div style="float: left; width: 33%; text-align: center;"> <img src="https://doc-be-dev-public.s3.us-west-2.amazonaws.com/fbeba60d-2f25-4f35-90e8-41bb79b40df2/2020-05-21T08%3A37%3A20.213Z/shifamed-logo.png" alt="Logo" /> </div>
                      <div style="float: right;">
                          <p class="fwb fs41" style="color: #292929;">PO Number: {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}<span></span></p>
                      </div>
                  </header>
                  <div style="clear: both;"></div>
                  <div class="information">
                      <div class="information__supplier">
                          <div class="title"> <strong class="fs18 text-white">SUPPLIER INFORMATION</strong> </div>
                          <div class="supplier__address">
                              <div style="float: left; margin-right: 20px; height: 100%;"> <strong style="color: #292929; font-size: 34px;">To:</strong> </div>
                              <div class="data-value">
                                  <div>{{autocompletes.po-supplier-built-in.name}}</div>
                                  <div id="to-description" style="white-space: pre;">{{{autocompletes.po-supplier-built-in.description}}}</div>
                              </div>
                          </div>
                          <div style="clear: both;"></div>
                          <div class="supplier__info">
                              <div class="data__item">
                                  <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Department:</strong> </div>
                                  <div class="data-value">{{documentRevision.formInput.department-k6ml6ew5}}</div>
                              </div>
                              <div class="data__item">
                                  <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Requestor:</strong> </div>
                                  <div class="data-value">{{autocompletes.po-requestor-autocomplete.user.name}}</div>
                              </div>
                          </div>
                      </div>
                      <div class="information__shipping">
                          <div class="title"> <strong>SHIPPING/BILLING INFORMATION</strong> </div>
                          <div class="shipping-billing" style="height: 100%">
                              <div class="shipping" style="height: 100%;width: 100%;">
                                  <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Ship To:</strong> </div>
                                  <div class="data-value">
                                      <div id="shipping" style="">
                                          <div id="shipping-customer-company" style="display: none">{{documentRevision.formInput.company-ship-to-address-kn5cq5gi}}</div>
                                          <div id="shipping-third-party-company" style="display: none">{{autocompletes.third-party-company-k7f25yb6.name}} <br/>{{{autocompletes.third-party-company-k7f25yb6.description}}}</div>
                                          <div id="shipping-complete-manually" style="display: none">{{documentRevision.formInput.ship-to-address-k7f27j0k}}</div>
                                      </div>
                                  </div>
                              </div>
                              <div class="billing" style="width: 100%;margin-top: 40px;">
                                  <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Bill To:</strong> </div>
                                  <div class="data-value">
                                      <div id="billing1" style="">
                                          <div id="billing-customer-company"> Shifamed <br>590 Division St <br>Campbell CA 95008 </div>
                                          <div id="billing-complete-manually" style="display: none">{{documentRevision.formInput.company-bill-to-k7f2e82a}}</div>
                                      </div>
                                      <div id="billing"></div>
                                  </div>
                              </div>
                          </div>
                          <div class="billing__mail">
                              <div class="invoice_mail">
                                  <div style="float: left; width: 220px;"> <strong style="color: #292929; font-size: 34px;">Invoices to:</strong> </div>
                                  <div class="data-value" style="float: left;">accounting@shifamed.com </div>
                              </div>
                              <div class="contact_mail">
                                  <div style="float: left; width: 202px;"> <strong style="color: #292929; font-size: 34px;">Contact:</strong> </div>
                                  <div class="data-value" style="float: left;">{{documentRevision.formInput.contact-email-kl7slf5l}}</div>
                              </div>
                          </div>
                          <div class="billing__contacts">
                              <div class="data_element">
                                  <div class="data__item">
                                      <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Shipping:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.shipping-k6mletok}}</div>
                                  </div>
                                  <div class="data__item">
                                      <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Terms:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.terms-k6mlftzn}}</div>
                                  </div>
                              </div>
                              <div class="data_element">
                                  <div class="data__item">
                                      <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Ordered:</strong> </div>
                                      <div id="ordered" class="data-value"> </div>
                                  </div>
                                  <div class="data__item">
                                      <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Quote:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.quotation-number-k7dwg3xr}} </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="list">
                      <table id="items-table">
                          <thead>
                              <tr class="title text-white fwb" style="text-transform: uppercase;">
                                  <th style="text-align: center;">Item</th>
                                  <th style="text-align: center;width: 200px;">Order Qty</th>
                                  <th style="text-align: center;">Units</th>
                                  <th style="text-align: center;width: 400px;">SUP PN / Date Required</th>
                                  <th style="text-align: center;">Description / PN</th>
                                  <th style="text-align: center;">Price</th>
                                  <th style="text-align: center;width: 230px;">Ext. Amount</th>
                                  <th class="smallCell" style="text-align: center;">Tax</th>
                              </tr>
                          </thead>
                          <tbody> {{#documentRevision.formInput.po-items-built-in.items}}
                              <tr title="table-item">
                                  <td class="data-value" style="text-align: center;">{{index++}}</td>
                                  <td class="data-value" style="text-align: center;">{{order}}</td>
                                  <td class="data-value" style="text-align: center;">{{units}}</td>
                                  <td class="data-value" style="text-align: center;">{{supplierPartNumber}}<br /> {{formattedDate}}</td>
                                  <td class="data-value" style="text-align: center;"> {{partNumberTitle}}{{^partNumberTitle}}{{description}}{{^description}}{{/description}}{{/partNumberTitle}} <br /> {{partNumberDocId}}{{^partNumberDocId}}{{serviceId}}{{^serviceId}}{{/serviceId}}{{/partNumberDocId}}</td>
                                  </td>
                                  <td class="data-value" style="text-align: center;"><span class="currency"></span>{{unitPrice}}</td>
                                  <td class="data-value" style="text-align: center;"><span class="currency"></span>{{totalAmount}}</td>
                                  <td style="position: relative; height: 188px;">
                                      <div id="checkbox">{{#tax}}&#10003;{{/tax}}</div>
                                  </td>
                              </tr>
                              <tr style="text-align: center; height: 95px;background-color: #ECECEC;">
                                  <td colspan="8" style="color: #292929; height: 95px;" class="data-value">{{glCode}}</td>
                              </tr> {{/documentRevision.formInput.po-items-built-in.items}} </tbody>
                      </table>
                  </div>
                  <section>
                      <div class="comments">
                          <div class="title"> <strong class="text-white fwb">NOTES / COMMENTS FOR SUPPLIER</strong> </div>
                          <div class="comments__block">
                              <div class="data-value" style="text-align: left; margin-left: 30px; margin-top: 30px;"> {{{documentRevision.formInput.comments-k6mlinzm}}} </div>
                          </div>
                      </div>
                      <div class="subtotal">
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Subtotal:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.subTotal}} </div>
                          </div>
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Tax:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.tax}} </div>
                          </div>
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Shipping Cost:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.shippingCost}} </div>
                          </div>
                          <div class="total">
                              <div class="total__item">
                                  <div style="width: 268px;"> <strong style="color: #292929; font-size: 34px;">Total:</strong> </div>
                                  <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.totalAmount}} </div>
                              </div>
                          </div>
                      </div>
                  </section>
                  <div class="approvals">
                      <div class="title"> <strong class="text-white fwb">APPROVALS:<span></span></strong> </div>
                      <div class="directors">
                          <div style="margin-left: 100px;"> <strong style="color: #292929; font-size: 34px;">Name</strong> {{#documentRevision.approvals}}
                              <ul>
                                  <li>{{approver.user.name}}</li>
                              </ul> {{/documentRevision.approvals}} </div>
                          <div> <strong style="color: #292929; font-size: 34px;">Date</strong> {{#validApprovalDates}}
                              <ul>
                                  <li>{{reviewedAt}}</li>
                              </ul> {{/validApprovalDates}} </div>
                      </div>
                  </div>
                  <div class="notification">
                      <p style="color: #292929; font-size: 34px;"> <strong style="color: #292929; font-size: 34px;"> Change Notification: </strong> Supplier shall provide notification of any change or deviation to Goods and/or Services to be provided under the Purchase Order. Any change or deviation requires prior written consent. </p>
                  </div>
                  <div> </div>
                  <footer>
                      <div id="pageFooter-last" /> </footer>
              </div>
              <script>
                  var table = document.getElementById('items-table');
                  var rows = [];
                  var tempRows = table.getElementsByTagName('tr');
                  for (var i = 0; i < tempRows.length; i++) {
                      if (tempRows[i].title === "table-item") {
                          rows.push(tempRows[i]);
                      }
                  }
                  for (var i = 0; i < rows.length; i++) {
                      var index = i + 1;
                      rows[i].cells[0].innerHTML = index;
                  }
              </script>
              <script>
                  document.getElementById("to-description").innerHTML = document.getElementById("to-description").innerHTML.replace(/(<((?!br|\/br)[^>]+)>)/gi, "");

                  function formatDate(date) {
                      if (!date) {
                          return "";
                      }
                      return moment(date).format("MM/DD/YYYY");
                  }
                  document.getElementById("ordered").innerHTML = formatDate("{{documentRevision.formInput.po-order-date}}");

                  function shipping(field, options) {
                      if (field === "Customer Company") {
                          document.getElementById("shipping").style.whiteSpace = 'normal';
                          return options.customerCompany;
                      } else if (field === "Third Party Company") {
                          document.getElementById("shipping").style.whiteSpace = 'normal';
                          return options.thirdPartyCompany;
                      } else if (field === "Complete Manually") {
                          document.getElementById("shipping").style.whiteSpace = 'pre';
                          return options.completeManually;
                      } else return "";
                  };
                  document.getElementById("shipping").innerHTML = shipping("{{documentRevision.formInput.ship-to-k7f1t1lw}}", {
                      customerCompany: document.getElementById("shipping-customer-company").innerHTML,
                      thirdPartyCompany: document.getElementById("shipping-third-party-company").innerHTML,
                      completeManually: document.getElementById("shipping-complete-manually").innerHTML,
                  });

                  function billing(field, options) {
                      if (field === "Customer Company") {
                          document.getElementById("billing").style.whiteSpace = 'normal';
                          return options.customerCompany;
                      } else if (field === "Complete Manually") {
                          document.getElementById("billing").style.whiteSpace = 'pre';
                          return options.completeManually;
                      } else return "";
                  };
                  document.getElementById("billing").innerHTML = billing("{{documentRevision.formInput.bill-to-k7f29tfo}}", {
                      customerCompany: document.getElementById("billing-customer-company").innerHTML,
                      completeManually: document.getElementById("billing-complete-manually").innerHTML,
                  });

                  function getCurrency(currency) {
                      switch (currency) {
                          case "EUR":
                              return "€";
                          case "USD":
                              return "$";
                          case "GBP":
                              return "£";
                          default:
                              return "";
                      }
                  }
                  var currencyElements = document.getElementsByClassName("currency");
                  for (var i = 0; i < currencyElements.length; i++) {
                      currencyElements[i].innerHTML = getCurrency("{{documentRevision.formInput.po-items-built-in.currency}}");
                  };
                  if ("{{documentRevision.formInput.ship-to-k7f1t1lw}}" === "Customer Company") {
                      document.getElementById("shipping").innerHTML = document.getElementById("shipping").innerHTML.replace(/, /gi, "<br>");
                  };
                  if ("{{documentRevision.formInput.bill-to-k7f29tfo}}" === "Customer Company") {
                      document.getElementById("billing").innerHTML = document.getElementById("billing").innerHTML.replace(/, /gi, "<br>");
                  }
              </script>
          </body>

          </html>`,
      });
    });

    it("Save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Navigate to PO landing page and fill the fields ", () => {
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order" });
      });
    });

    it("Enter description 'New Purchase Order'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });
  });
  context("Add Requestor", () => {
    it(`Select '${USERS[2].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
    });
    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Add Non Enlil Product", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });
    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
    });
    it("select non enlil part number", () => {
      cy.poEnterSupplierPartNumber({ partNumber: "Sample Part" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
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
      cy.poAddPOButtonClick();
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });

  context("Check the Approval block - Requestor should not be added in the Approval block", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("verify Requestor should not be added in the Approval block", () => {
      cy.get(".MuiAutocomplete-tag span div").should("not.exist");
    });
  });
  context("Verify that history tab is NOT adding requestor to the approval field", () => {
    it("Open History drawer and compare history values", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify Approver Added as User 1", () => {
      cy.get("[data-cy='form.builder.audit.STRING_NEW']").contains("Approver Added")
        .should("not.exist");

      cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains("Giovanni Reynolds")
        .should("not.exist");
    });
  });

  context("Add Approver and Requestor", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add an Approval", () => {
      cy.wait(1000);
      cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[4].name);
      cy.wait(1000);
    });
    it("Check approver should not be fulfilling PO level signature", () => {
      cy.poAMCheckApprovalIconIfItsGray();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
    it("User should not able to release PO, error message should appear", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick({ force: true });
      cy.checkToastMessage({ exists: true });
    });

    it("Remove Approver'", () => {
      cy.contains(`${USERS[4].name} - ${USERS[4].email}`).parent().next().arrowClick();
    });
    it("Verify that Approver can be removed", () => {
      cy.wait(1000);
      cy.get(".MuiAutocomplete-tag span div").should("not.exist");
    });
  });

  context("Add Requestor - Requestor should not be fulfilling PO level signature", () => {
    it(`Select '${USERS[2].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
      cy.wait(1000);
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[4].name).arrowClick();
      });
    });
    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });
    it("Check requestor should not be fulfilling PO level signature", () => {
      cy.poAMCheckApprovalIconIfItsGray();
    });
  });

  context("Add line item Enlil Product", () => {
    it("Navigate to Lineitem tab", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add item' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.poAddNewFieldItem();
      });
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
      cy.poAddDateRequired();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });
  });

  context("Check the Approval block", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });
    context("Requestor should be added in the Approval block and it should not be fulfilling PO level signature", () => {
      it("verify Requestor should be added in the Approval block", () => {
        cy.get(".MuiAutocomplete-tag span div").should("exist");
      });
      it("Check if selected approver has approval signature right by his name", () => {
        cy.contains("PO Approval sig").should("exist");
      });
      it("Check requestor should not be fulfilling PO level signature", () => {
        cy.poAMCheckApprovalIconIfItsGray();
      });
    });
    context("Verify that history tab is capturing the changes - Adding requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });
      it("Verify Added Requestor captured on history", () => {
        cy.get("[data-cy^='form.builder.audit.STRING_EDITED']").contains("Requestor Updated")
          .should("exist");
        cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[4].name)
          .should("exist");
      });
    });
    context("Click to remove Approver and verify that Approver can not be removed", () => {
      it("Navigate to Approval block and try to remove Added requestor as an approver", () => {
        cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
        cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
        cy.unClick();
      });
      it("Verify Approver can't be removed", () => {
        cy.get(".MuiAutocomplete-tag span div").should("exist");
      });
    });
    it("User should not able to release PO, error message should appear", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick({ force: true });
      cy.checkToastMessage({ exists: true });
      cy.pause();
    });
  });

  context("Navigate to Requestor field and replace existing with new Requestor that fulfills PO level signature", () => {
    it(`Replace Requestor with '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick().wait(1000);
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
    });
    it("Verify that previous Requestor is removed", () => {
      cy.get("[data-cy='po-requestor-autocomplete']").should("not.have.value", `${USERS[2].name} - ${USERS[2].email}`);
    });
    it("New Requestor should be added in the Approval block and it should be fulfilling PO level signature", () => {
      cy.get("[data-cy='po-requestor-autocomplete']").should("have.value", `${USERS[1].name} - ${USERS[1].email}`);
    });
    context("Verify that history tab is capturing the changes - New requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
        cy.wait(1000);
      });

      it("Verify Approver Added as User 2", () => {
        cy.get("[data-cy='change-key-0-0']").contains("Approver Added")
          .should("exist");

        cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
          .should("exist");
      });
    });
    context("Click to remove Approver and verify that Approver can not be removed", () => {
      it("Navigate to Approval block and try to remove Added requestor as an approver", () => {
        cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
        cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
        cy.unClick();
      });
      it("Verify Approver can't be removed", () => {
        cy.get(".MuiAutocomplete-tag span div").should("exist");
      });
    });
  });
  context("Remove line item with Enlil Product", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });
    it("Remove enlil product", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get(":nth-child(2) > :nth-child(1) > .MuiBox-root > .MuiSvgIcon-root").arrowClick();
      });
    });
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("Check the Approval block - Requestor should be removed from the Approval block", () => {
      cy.get(".MuiAutocomplete-tag span div").should("not.exist");
    });

    context("Verify that history tab is capturing the changes - Removing requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });

      it("Verify Approver Added as User 1", () => {
        cy.get("[data-cy='form.builder.audit.STRING_NEW']").contains("Approver Removed")
          .should("not.exist");
      });
    });
    context("Verify that Approver can be added manually and add Approver that fulfills PO level signature", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add an Approval", () => {
        cy.wait(1000);
        cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[3].name);
        cy.wait(1000);
      });
      it("Check if selected approver has approval signature right by his name", () => {
        cy.contains("PO Approval sig").should("exist");
      });
      it("Check requestor should be fulfilling PO level signature", () => {
        cy.poAMCheckApprovalIconIfItsRed();
      });
    });
  });
  context("Add Service 'line item'", () => {
    it("Navigate to Lineitem tab", () => {
      cy.drSelectLineItems();
      cy.wait(100);
    });
    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
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

    it("Add Required Date", () => {
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "10" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });
  context("Check the Approval block - Requestor should be added in the Approval block next to Requestor added manually", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("Check the Approval block - Requestor should be added in the Approval block next to Requestor added manually", () => {
      cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`);
    });
    context("Verify that history tab is capturing the changes - Added requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });
      it("Verify Added Requestor captured on history", () => {
        cy.get("[data-cy^='change-key-0-0']").contains("Approver Added")
          .should("exist");
        cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
          .should("exist");
      });
    });
    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });
    it("Check requestos should be fulfilling PO level signature", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });
  });
  context("Navigate to Requestor field and remove Requestor", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });
    it("Check the Approval block - Requestor should be removed from the Approval block", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true }).arrowType(`{backspace}`);
        cy.unClick();
      });
    });
    it("Verify that history tab is capturing the changes - Removing requestor to the approval field", () => {
      cy.get("[data-cy^='form.builder.audit.STRING_DELETED']").contains("Requestor Deleted")
        .should("exist");
      cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
        .should("exist");
    });
  });
  context("Navigate to Requestor field and add Requestor that fulfills PO level signature", () => {
    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
    });
    context("New Requestor should be added in the Approval block and it should be fulfilling PO level signature", () => {
      it("Check if New Requestor should be added in the Approval block", () => {
        cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`);
      });
      it("Check if selected approver has approval signature right by his name", () => {
        cy.contains("PO Approval sig").should("exist");
      });
      it("Check requestos should be fulfilling PO level signature", () => {
        cy.poAMCheckApprovalIconIfItsRed();
      });
    });
    context("Verify that history tab is capturing the changes - added requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });
      it("Verify Added Requestor captured on history", () => {
        cy.get("[data-cy^='form.builder.audit.STRING_EDITED']").contains("Requestor Updated")
          .should("exist");
        cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
          .should("exist");
      });
    });
  });
  context("Remove line item with Service", () => {
    it("Navigate to Lineitem tab", () => {
      cy.drSelectLineItems();
    });
    it("Check the Approval block - Requestor should be removed from the Approval block", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get(":nth-child(2) > :nth-child(1) > .MuiBox-root > .MuiSvgIcon-root").arrowClick();
      });
    });
    it("Verify that history tab is capturing the changes - Removing requestor to the approval field", () => {
      cy.drSelectHistoryTab();
      cy.wait(1000);
    });

    it("Verify remove requestor to the approval field", () => {
      cy.get("[data-cy^='change-key-']").contains("Approver Removed")
        .should("exist");

      cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
        .should("exist");
    });
    context("Verify that Approver can be added manually and add Approver that fulfills PO level signature", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("add Approver that fulfills PO level signature", () => {
        it("Add an Approval", () => {
          cy.wait(1000);
          cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[2].name);
          cy.wait(1000);
        });
        it("Check if New Requestor should be added in the Approval block", () => {
          cy.get(".MuiBox-root").contains(`${USERS[2].name} - ${USERS[2].email}`);
        });
        it("Check if selected approver has approval signature right by his name", () => {
          cy.contains("PO Approval sig").should("exist");
        });
        it("Check requestos should be fulfilling PO level signature", () => {
          cy.poAMCheckApprovalIconIfItsRed();
        });
      });
    });
  });
  context("Add line item with Enlil Product", () => {
    context("Add line item Enlil Product", () => {
      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
      });

      it("Click on 'Add item' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.poAddNewFieldItem();
        });
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
        cy.poAddDateRequired();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });
    });

    context("Check the Approval block", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Requestor should be added in the Approval block and it should not be fulfilling PO level signature", () => {
        it("Check if Requestor should be added in the Approval block", () => {
          cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`);
        });
        it("Check if selected approver has approval signature right by his name", () => {
          cy.contains("PO Approval sig").should("exist");
        });
        it("Check requestos should not be fulfilling PO level signature", () => {
          cy.poAMCheckApprovalIconIfItsGray();
        });
      });
      context("Verify that history tab is capturing the changes - Adding requestor to the approval field", () => {
        it("Open History drawer and compare history values", () => {
          cy.drSelectHistoryTab();
        });
        it("Verify Added Requestor captured on history", () => {
          cy.get("[data-cy^='form.builder.audit.STRING_EDITED']").contains("Requestor Updated")
            .should("exist");
          cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
            .should("exist");
        });
      });
    });
  });
  context("Add line item with Service", () => {
    context("Add Service 'line item'", () => {
      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
        cy.wait(100);
      });
      it("Click on 'Add' inside PO dialog box and check for required fields", () => {
        cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
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

      it("Add Required Date", () => {
        cy.get("[name=\"date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Enter Unit Price", () => {
        cy.poNumberOfUnits({ number: "10" });
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
    context("Check the Approval block, and Requestor should be added only once", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Requestor should added only once", () => {
        cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`).should("have.length", 1);
      });
    });
  });
  context("Remove Service", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });
    it("Remove service", () => {
      cy.get(".MuiTableBody-root > :nth-child(3) > :nth-child(1) > .MuiBox-root").arrowClick();
    });
    context("Check the Approval block, Requestor should be still present in the Approval block next to Approver added manually", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Requestor should be present in approval block", () => {
        cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`).should("have.length", 1);
      });
    });
    context("Verify that history tab is capturing the changes - Removing requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });

      it("Verify Approver Added as User 1", () => {
        cy.get("[data-cy='form.builder.audit.STRING_NEW']").contains("Approver Removed")
          .should("not.exist");
      });
    });
  });
  context("Add service line item again", () => {
    context("Add Service 'line item'", () => {
      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
        cy.wait(100);
      });
      it("Click on 'Add' inside PO dialog box and check for required fields", () => {
        cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
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

      it("Add Required Date", () => {
        cy.get("[name=\"date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Enter Unit Price", () => {
        cy.poNumberOfUnits({ number: "10" });
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
    it("Check the Approval block, and Requestor should be added only once", () => {
      cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`).should("have.length", 1);
    });
    context("Verify that history tab is capturing the changes - Added requestor to the approval field", () => {
      it("Open History drawer and compare history values", () => {
        cy.drSelectHistoryTab();
      });
      it("Verify Added Requestor captured on history", () => {
        cy.get("[data-cy^='change-key-0-0']").contains("Approver Added")
          .should("exist");
        cy.get("[class^=\"makeStyles-auditValue-\"]").eq(0).contains(USERS[1].name)
          .should("exist");
      });
    });
  });
  context("Remove Enlil Product", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });
    it("remove enlil product", () => {
      cy.get(":nth-child(2) > :nth-child(1) > .MuiBox-root > .MuiSvgIcon-root").arrowClick();
    });
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(100);
    });
    it("Check the Approval block, Requestor should be still present in the Approval block next to Approver added manually", () => {
      cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`).should("have.length", 1);
    });
  });
  context("Remove line item with Non-Enlil Product ", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.wait(100);
    });
    it("remove non enlil product", () => {
      cy.get(":nth-child(1) > :nth-child(1) > .MuiBox-root > .MuiSvgIcon-root").arrowClick();
    });
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(100);
    });
    it("Check the Approval block, Requestor should be still present in the Approval block next to Approver added manually", () => {
      cy.get(".MuiBox-root").contains(`${USERS[1].name} - ${USERS[1].email}`).should("have.length", 1);
    });
    it("remove Approver added manually", () => {
      cy.contains(`${USERS[3].name} - ${USERS[3].email}`).parent().next().arrowClick();

    });
    it("Verify that Approver can be removed", () => {
      cy.get(".MuiBox-root").contains(`${USERS[3].name} - ${USERS[3].email}`).should("not.exist");

    });
    context("Click to remove Approver and verify that Approver can not be removed", () => {
      it("Navigate to Approval block and try to remove Added requestor as an approver", () => {
        cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
        cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
        cy.unClick();
      });
      it("Verify Approver can't be removed", () => {
        cy.get(".MuiAutocomplete-tag span div").should("exist");
      });
    });
    context("Add Approver manually, Verify it can be added.", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Add an Approval", () => {
        cy.wait(1000);
        cy.get("[data-cy^='fb-po-approvals-']").autocompleteSelect(USERS[3].name);
        cy.wait(1000);
      });
      it("verify approver added", () => {
        cy.get(".MuiBox-root").contains(`${USERS[3].name} - ${USERS[3].email}`).should("exist");
      });
    });

  });
  context("Verify that Approvers fulfill PO level signature", () => {
    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });
    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });
    context("Check “Backspace” and “Clear all” option will not be available in the PO approval field", () => {
      it(`Verify that “Backspace” and “Clear all” option will not be available in the PO approval field`, () => {
        cy.get("[data-cy^=fb-po-approvals]").arrowClick({ force: true }).arrowType(`{backspace}`).clear();
      });
    });
    context("Approve PO", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve PO", () => {
        cy.ebApprove();
      });
    });
  });
  context("Verify that downloaded PDF display Requestor information", () => {
    it("Navigate to Purchase Order list", () => {
      cy.navigToPurchaseOrder();
      cy.dlClearFilters();
    });
    it("Select created PO", () => {
      cy.dlSelectFirstDocument();
    });
    it("[API]Get html document and verify PO number and Requestor information", () => {
      cy.url().then((url: any) => {
        poHTMLDocRevId = url.split("/").pop();
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
          headers: {
            Authorization: `bearer ${adminEmployee.id}:${adminEmployeeLoginResponse.sessionId}`,
          },
        }).then((response) => {
          const responseBody = response.body.toString();
          expect(responseBody)
            .contains(`PO Number: PO-00001-A`)
            .and.contains("Requestor:")
            .and.contains(USERS[3].name);
        });
      });
    });
  });
  context("Navigate to dashboard Verify that notification is present for All approvers (Requestor and added Manually)", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
    });
    it(`verify PO Notification for ${USERS[1].name}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${USERS[1].name}APPROVEDPO-00001`,
      });
    });
    it(`verify PO Notification from ${USERS[2].name}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `PO-00001Rev A isIN REVIEWpending approvals from`,
      });
    });
  });

});
