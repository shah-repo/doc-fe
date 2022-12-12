// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { receivingReleasedDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;
let poPageDetailsId;
let poHTMLDocRevId;
// eslint-disable-next-line max-len
const renderHTMLContent = `<!DOCTYPE html><html lang="en"><head>  <meta charset="UTF-8" />  <meta name="viewport" content="width=device-width, initial-scale=1.0" />  <title>Document</title>  <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script></head><body>  <style>    html {      zoom: 0.2;    }    * {      margin: 0;      padding: 0;      box-sizing: border-box;      font-family: "Open Sans", sans-serif;      -webkit-print-color-adjust: exact;    }    .container {      width: 2480px;      padding: 80px;      margin: 0 auto;      position: relative;      background: #ffffff;    }    header {      padding-bottom: 30px;      border-bottom: 1px solid #d3d3d3;      margin-bottom: 80px;      height: 180px;    }    .fs41 {      font-size: 41px;    }    .fs34 {      font-size: 34px;    }    .fwb {      font-weight: bold;      letter-spacing: 1px;    }    .text-white {      color: white;    }    .title {      padding: 33px 30px;      background-color: #0381CB;    }    .title strong {      font-size: 34px;      color: white;    }    .information {      margin-bottom: 1.5em;    }    .information:after {      content: "";      display: block;      clear: both;    }    .information__supplier {      width: 1007px;      float: left;      border: 1px solid #d3d3d3;      min-height: 1100px;    }    .information__shipping {      width: 1273px;      float: right;      border: 1px solid #d3d3d3;      min-height: 1100px;    }    .supplier__address {      padding: 50px 30px;      border-bottom: 1px solid #d3d3d3;      height: 711px;    }    .supplier__contacts,    .billing__mail {      height: 220px;    }    .shipping-billing {      height: 314px;    }    .address-value,    .phone-value,    .fax-value,    .shipping-value,    .billing-value,    .data-value {      margin-left: 10px;    }    .supplier__contacts,    .supplier__info,    .billing__mail {      padding-left: 30px;      padding-top: 20px;      border-bottom: 1px solid #d3d3d3;    }    .supplier__info,    .billing__contacts {      border-bottom: none;      height: 200px;    }    .invoice_mail,    .contact_mail,    .data__item,    .total__item {      margin-bottom: 45px;    }    .invoice_mail div,    .contact_mail div {      float: left;      margin-right: 30px;    }    .data__item div {      float: left;      margin-right: 30px;    }    .data__item::after {      content: "";      display: block;      clear: both;    }    .invoice_mail:after {      content: "";      display: block;      clear: both;    }    .contact_mail:after {      content: "";      display: block;      clear: both;    }    .data-value {      font-size: 34px;      letter-spacing: 0px;      color: #292929;    }    .shipping-billing {      padding: 50px 30px;      border-bottom: 1px solid #d3d3d3;    }    .shipping-billing:after {      content: "";      display: block;      clear: both;    }    .shipping,    .billing {      width: 48%;    }    .shipping {      float: left;    }    .billing {      float: right;    }    .billing__contacts {      border-bottom: none;      padding-left: 30px;      padding-top: 20px;    }    .data_element {      float: left;      padding-right: 10px;      width: 50%;    }    .list table {      border-spacing: 0;      border-collapse: collapse;      border: 1px solid #007698;    }    .table th {      text-align: center;    }    .list td {      border: 1px solid #d3d3d3;    }    table {      max-width: 100%;    }    th {      font-weight: 900;    }    table {      margin-bottom: 1.5em;      position: relative;      width: 100%;      z-index: 1;    }    table th,    table td {      font-family: inherit;      font-size: inherit;      padding: 12px 0px;      vertical-align: middle;      font-size: 28px;    }    #checkbox {      border: 0.1px solid black;      height: 40px;      width: 40px;      position: absolute;      top: 30px;      left: 40px;    }    .checked {      width: 30px;      height: 15px;      border: 2px solid;      position: absolute;      top: 18%;      left: 13%;      transform: rotate(-45deg);      border-top: none;      border-right: none;      /* display:none; */    }    .smallCell {      width: 140px;    }    section {      margin-bottom: 50px;    }    .comments {      width: 1509px;      border: 1px solid #d3d3d3;      margin-right: 100px;      float: left;    }    .comments__block,    .subtotal {      height: 240px;    }    .subtotal {      width: 635px;      float: left;      padding-top: 30px;    }    section:after {      content: "";      display: block;      clear: both;    }    .subtotal .data__item {      margin-bottom: 20px;    }    .total {      padding: 10px 50px 10px 10px;      width: 635px;      border: 1px solid #d3d3d3;    }    .total .total__item {      margin-bottom: 0px;    }    .total__item div {      float: left;    }    .total__item:after {      content: "";      display: block;      clear: both;    }    .approvals {      border: 1px solid #d3d3d3;      margin-bottom: 50px;      width: 2320px;    }    .directors {      padding: 20px 50px 20px 20px;    }    .directors div {      float: left;      margin-right: 200px;      width: fit-content;    }    .directors div:last-child {      margin-right: 0px;    }    .directors:after {      content: "";      display: block;      clear: both;    }    .directors ul {      list-style-type: none;      padding-top: 30px;    }    .directors ul li {      margin-bottom: 30px;      font-size: 34px;    }    .directors ul li:last-child {      margin-bottom: 0px;    }    .signature span {      font-size: 34px;    }    .notification {      padding-bottom: 50px;      border-bottom: 1px solid #d3d3d3;    }    #date {      position: absolute;      right: 80px;      margin-top: 10px;      font-weight: bold;      font-size: 20px;    }  </style>  <div class="container">    <header>      <div style="float: left; width: 33%;">        <p class="fwb fs41">Purchase Order </p>        <p class="fs41" style="color: #292929;">Shifamed</p>      </div>      <div style="float: left; width: 33%; text-align: center;"> <img          src="https://doc-be-dev-public.s3.us-west-2.amazonaws.com/fbeba60d-2f25-4f35-90e8-41bb79b40df2/2021-01-26T12%3A27%3A29.846Z/Adona_logo.png"          alt="Logo" /> </div>      <div style="float: right;">        <p class="fwb fs41" style="color: #292929;">PO Number:          {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}<span></span></p>      </div>    </header>    <div style="clear: both;"></div>    <div class="information">      <div class="information__supplier">        <div class="title"> <strong class="fs18 text-white">SUPPLIER INFORMATION</strong> </div>        <div class="supplier__address">          <div style="float: left; margin-right: 20px; height: 100%;"> <strong              style="color: #292929; font-size: 34px;">To:</strong> </div>          <div class="data-value">            <div>{{autocompletes.po-supplier-built-in.name}}</div>            <div id="to-description" style="white-space: pre;">{{{autocompletes.po-supplier-built-in.description}}}            </div>          </div>        </div>        <div style="clear: both;"></div>        <div class="supplier__info">          <div class="data__item">            <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Department:</strong> </div>            <div class="data-value">{{documentRevision.formInput.department-k6ml6ew5}}</div>          </div>          <div class="data__item">            <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Requestor:</strong> </div>            <div class="data-value">{{autocompletes.po-requestor-autocomplete.user.name}}</div>          </div>        </div>      </div>      <div class="information__shipping">        <div class="title"> <strong>SHIPPING/BILLING INFORMATION</strong> </div>        <div class="shipping-billing" style="height: 100%">          <div class="shipping" style="height: 100%;width: 100%;">            <div style="float: left; height: 175px; margin-right: 30px;"> <strong                style="color: #292929; font-size: 34px;">Ship To:</strong> </div>            <div class="data-value">              <div id="shipping" style="">                <div id="shipping-customer-company" style="display: none">                  {{documentRevision.formInput.company-ship-to-address-kn5cq5gi}}</div>                <div id="shipping-third-party-company" style="display: none">                  {{autocompletes.third-party-company-k7f25yb6.name}}                  <br />{{{autocompletes.third-party-company-k7f25yb6.description}}}</div>                <div id="shipping-complete-manually" style="display: none">                  {{documentRevision.formInput.ship-to-address-k7f27j0k}}</div>              </div>            </div>          </div>          <div class="billing" style="width: 100%;margin-top: 40px;">            <div style="float: left; height: 175px; margin-right: 30px;"> <strong                style="color: #292929; font-size: 34px;">Bill To:</strong> </div>            <div class="data-value">              <div id="billing1" style="">                <div id="billing-customer-company"> Adona Medical <br>590 Division St <br>Campbell CA 95008 </div>                <div id="billing-complete-manually" style="display: none">                  {{documentRevision.formInput.company-bill-to-k7f2e82a}}</div>              </div>              <div id="billing"></div>            </div>          </div>        </div>        <div class="billing__mail">          <div class="invoice_mail">            <div style="float: left; width: 220px;"> <strong style="color: #292929; font-size: 34px;">Invoices                to:</strong> </div>            <div class="data-value" style="float: left;">accounting@shifamed.com </div>          </div>          <div class="contact_mail">            <div style="float: left; width: 202px;"> <strong style="color: #292929; font-size: 34px;">Contact:</strong>            </div>            <div class="data-value" style="float: left;">{{documentRevision.formInput.contact-email-kl7slf5l}}</div>          </div>        </div>        <div class="billing__contacts">          <div class="data_element">            <div class="data__item">              <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Shipping:</strong> </div>              <div class="data-value">{{documentRevision.formInput.shipping-k6mletok}}</div>            </div>            <div class="data__item">              <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Terms:</strong> </div>              <div class="data-value">{{documentRevision.formInput.terms-k6mlftzn}}</div>            </div>          </div>          <div class="data_element">            <div class="data__item">              <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Ordered:</strong> </div>              <div id="ordered" class="data-value"> </div>            </div>            <div class="data__item">              <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Quote:</strong> </div>              <div class="data-value">{{documentRevision.formInput.quotation-number-k7dwg3xr}} </div>            </div>          </div>        </div>      </div>    </div>    <div class="list">      <table id="items-table">        <thead>          <tr class="title text-white fwb" style="text-transform: uppercase;">            <th style="text-align: center;">Item</th>            <th style="text-align: center;width: 200px;">Order Qty</th>            <th style="text-align: center;">Units</th>            <th style="text-align: center;width: 400px;">SUP PN / Date Required</th>            <th style="text-align: center;">Description / PN</th>            <th style="text-align: center;">Price</th>            <th style="text-align: center;width: 230px;">Ext. Amount</th>            <th class="smallCell" style="text-align: center;">Tax</th>          </tr>        </thead>        <tbody> {{#documentRevision.formInput.po-items-built-in.items}} <tr title="table-item">            <td class="data-value" style="text-align: center;">{{index++}}</td>            <td class="data-value" style="text-align: center;">{{order}}</td>            <td class="data-value" style="text-align: center;">{{units}}</td>            <td class="data-value" style="text-align: center;">{{supplierPartNumber}}<br /> {{formattedDate}}</td>            <td class="data-value" style="text-align: center;">              {{partNumberTitle}}{{^partNumberTitle}}{{description}}{{^description}}{{/description}}{{/partNumberTitle}}              <br />              {{partNumberDocId}}{{^partNumberDocId}}{{serviceId}}{{^serviceId}}{{/serviceId}}{{/partNumberDocId}}</td>            </td>            <td class="data-value" style="text-align: center;"><span class="currency"></span>{{unitPrice}}</td>            <td class="data-value" style="text-align: center;"><span class="currency"></span>{{totalAmount}}</td>            <td style="position: relative; height: 188px;">              <div id="checkbox">{{#tax}}&#10003;{{/tax}}</div>            </td>          </tr>          <tr style="text-align: center; height: 95px;background-color: #ECECEC;">            <td colspan="8" style="color: #292929; height: 95px;" class="data-value">{{glCode}}</td>          </tr> {{/documentRevision.formInput.po-items-built-in.items}}        </tbody>      </table>    </div>    <section>      <div class="comments">        <div class="title"> <strong class="text-white fwb">NOTES / COMMENTS FOR SUPPLIER</strong> </div>        <div class="comments__block">          <div class="data-value" style="text-align: left; margin-left: 30px; margin-top: 30px;">            {{{documentRevision.formInput.comments-k6mlinzm}}} </div>        </div>      </div>      <div class="subtotal">        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Subtotal:</strong> </div>          <div class="data-value"> <span              class="currency"></span>{{documentRevision.formInput.po-items-built-in.subTotal}} </div>        </div>        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Tax:</strong> </div>          <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.tax}}          </div>        </div>        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Shipping Cost:</strong> </div>          <div class="data-value"> <span              class="currency"></span>{{documentRevision.formInput.po-items-built-in.shippingCost}} </div>        </div>        <div class="total">          <div class="total__item">            <div style="width: 268px;"> <strong style="color: #292929; font-size: 34px;">Total:</strong> </div>            <div class="data-value"> <span                class="currency"></span>{{documentRevision.formInput.po-items-built-in.totalAmount}} </div>          </div>        </div>      </div>    </section>    <div class="approvals">      <div class="title"> <strong class="text-white fwb">APPROVALS:<span></span></strong> </div>      <div class="directors">        <div style="margin-left: 100px;"> <strong style="color: #292929; font-size: 34px;">Name</strong>          {{#documentRevision.approvals}} <ul>            <li>{{approver.user.name}}</li>          </ul> {{/documentRevision.approvals}} </div>        <div> <strong style="color: #292929; font-size: 34px;">Date</strong> {{#validApprovalDates}} <ul>            <li>{{reviewedAt}}</li>          </ul> {{/validApprovalDates}} </div>      </div>    </div>    <div class="notification">      <p style="color: #292929; font-size: 34px;"> <strong style="color: #292929; font-size: 34px;"> Change          Notification: </strong> Supplier shall provide notification of any change or deviation to Goods and/or        Services to be provided under the Purchase Order. Any change or deviation requires prior written consent. </p>    </div>    <div> </div>    <footer>      <div id="pageFooter-last" />    </footer>  </div>  <script>         var table = document.getElementById('items-table'); var rows = []; var tempRows = table.getElementsByTagName('tr'); for (var i = 0; i < tempRows.length; i++) { if (tempRows[i].title === "table-item") { rows.push(tempRows[i]); } } for (var i = 0; i < rows.length; i++) { var index = i + 1; rows[i].cells[0].innerHTML = index; }      </script>  <script>   document.getElementById("to-description").innerHTML = document.getElementById("to-description").innerHTML.replace(/(<((?!br|\/br)[^>]+)>)/gi, ""); function formatDate(date) { if (!date) { return ""; } return moment(date).format("MM/DD/YYYY"); } document.getElementById("ordered").innerHTML = formatDate("{{documentRevision.formInput.po-order-date}}"); function shipping(field, options) { if (field === "Customer Company") { document.getElementById("shipping").style.whiteSpace = 'normal'; return options.customerCompany; } else if (field === "Third Party Company") { document.getElementById("shipping").style.whiteSpace = 'normal'; return options.thirdPartyCompany; } else if (field === "Complete Manually") { document.getElementById("shipping").style.whiteSpace = 'pre'; return options.completeManually; } else return ""; }; document.getElementById("shipping").innerHTML = shipping("{{documentRevision.formInput.ship-to-k7f1t1lw}}", { customerCompany: document.getElementById("shipping-customer-company").innerHTML, thirdPartyCompany: document.getElementById("shipping-third-party-company").innerHTML, completeManually: document.getElementById("shipping-complete-manually").innerHTML, }); function billing(field, options) { if (field === "Customer Company") { document.getElementById("billing").style.whiteSpace = 'normal'; return options.customerCompany; } else if (field === "Complete Manually") { document.getElementById("billing").style.whiteSpace = 'pre'; return options.completeManually; } else return ""; }; document.getElementById("billing").innerHTML = billing("{{documentRevision.formInput.bill-to-k7f29tfo}}", { customerCompany: document.getElementById("billing-customer-company").innerHTML, completeManually: document.getElementById("billing-complete-manually").innerHTML, }); function getCurrency(currency) { switch (currency) { case "EUR": return "€"; case "USD": return "$"; case "GBP": return "£"; default: return ""; } } var currencyElements = document.getElementsByClassName("currency"); for (var i = 0; i < currencyElements.length; i++) { currencyElements[i].innerHTML = getCurrency("{{documentRevision.formInput.po-items-built-in.currency}}"); }; if ("{{documentRevision.formInput.ship-to-k7f1t1lw}}" === "Customer Company") { document.getElementById("shipping").innerHTML = document.getElementById("shipping").innerHTML.replace(/, /gi, "<br>"); }; if ("{{documentRevision.formInput.bill-to-k7f29tfo}}" === "Customer Company") { document.getElementById("billing").innerHTML = document.getElementById("billing").innerHTML.replace(/, /gi, "<br>"); } </script></body></html>`;
const apiCreatedCompany: any = {
  employees: [],
  documentTypes: [],
};
const ADMIN_USER = USERS[1];
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const purchaseOrderFormName = "New Purchase Order Form";
const poFormTitle = "New Purchase Order Form";
const poFormDescription = "New Purchase Order Form Description";
const poDescription = "Test Purchase Order";
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

context("Create company with JSON's and verify Purchase Order", () => {
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
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              NCORecord,
              SupplierExport,
              ClinicalProtocolDocType,
              PurchaseOrderDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
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

    it("[API]Get group", () => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create form for NCO document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName, { force: true });
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr, { force: true });
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email, { force: true });
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get(`[data-cy="Approved DAM json is used"]`).scrollIntoView();
      cy.get("[name*='approved-dam-json-is-used']").eq(0).should("have.value", "Yes").click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload DAM JSON", () => {
      cy.get(`[data-cy="DAM JSON "]`).scrollIntoView();
      cy.atchUploadDOMJSONForNCO({ fileName: "po_dam.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get(`[data-cy="Approved Page Details json is used"]`).scrollIntoView();
      cy.get(`[name*="approved-page-details-json-is-used-"]`).eq(0)
        .should("have.value", "Yes").arrowClick().wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload Page Details JSON", () => {
      cy.get(`[data-cy="Page Details JSON"]`).scrollIntoView();
      cy.fixture("PageDetails.json").then((fileContent) => {
        cy.get(`[id^="fb-attachment-field-page-details-json-"]`).eq(0).attachFile({
          fileContent,
          fileName: "PageDetails.json",
          mimeType: "*",
          filePath: `fixtures/PageDetails.json`,
        });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get(`[data-cy="Approved Navigation json is used"]`).scrollIntoView();
      cy.get("[name*='approved-navigation-json-is-used-']").eq(0)
        .should("have.value", "Yes").click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Users List JSON", () => {
      cy.get(`[data-cy="Users List"]`).scrollIntoView();
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get(`[data-cy^="Client\\'s Logo (max 180px x 75px)"]`).scrollIntoView();
      cy.get("[data-cy='albumMediaButton']").eq(0).arrowClick();
      cy.pmUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document for create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login admin user and intercept APIs", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
          }
        });
      }).as("response1");

      cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            loginResponse = res.body;
          }
        });
      }).as("response2");

      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      cy.wait("@response");
      cy.wait("@response1");
      cy.wait("@response2");
    });
  });

  context("PO Page Details API", () => {
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
      }).then((response) => {
        if (response.body) {
          poPageDetailsId = response.body[0].id;
        }
      }).then(() => {
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
                sourcePath: [
                  "revisionStage:revision",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_STATUS_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[2],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_status",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
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
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_PART_NUMBER_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[5],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_partNumber",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_AMOUNT_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[6],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_amount",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "USER_NAME",
                label: COLUMN_HEADERS[7],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.requestor-k740hxlb",
                sourcePath: [
                  "formInput.requestor-k740hxlb",
                  "formInput.po-requestor-autocomplete",
                ],
                showOnAndroid: true,
              },
              {
                fn: "DATE_FORMAT_MM_DD_YYYY",
                label: COLUMN_HEADERS[8],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.order-date-formatted",
                sourcePath: [
                  "formInput.ordered-k6mlhan7",
                  "formInput.po-order-date",
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

    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });

      cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            loginResponse = res.body;
          }
        });
      }).as("response");
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      cy.wait("@response");
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
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
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


    it("Navigate to MatrixDetails tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter Level Name value to be '1'", () => {
      cy.poAMEnterLevelName({ name: "1" });
    });

    it("Enter Limit value to be '5000'", () => {
      cy.poAMEnterLimit({ limit: "5000" });
    });

    it(`Select Users '${USERS[1].name}'`, () => {
      cy.poAMSelectUsers(USERS[1].name);
    });

    it("Add first POAM level", () => {
      cy.get(`[data-cy="common.add"]`).contains("Add").arrowClick().wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.get(`[data-cy="common.add"]`).contains("Add").arrowClick().wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Release POAM", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create Form Part document to create Part", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'PO Part' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Part document for PO", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'PO Part' Form", () => {
      cy.ptSelectPartFormFromMultiSelect({ partForm: "Parts" });
    });

    it("Enters title 'New Part'", () => {
      cy.drEnterDocumentTitle({ name: "New Part" });
    });

    it("Enters description 'New Part description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create Part document 2 for PO", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'PO Part' Form", () => {
      cy.ptSelectPartFormFromMultiSelect({ partForm: "Parts" });
    });

    it("Enters title 'New Part'", () => {
      cy.drEnterDocumentTitle({ name: "New Part 2" });
    });

    it("Enters description 'New Part description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part description 2" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create a form for PO with outputtype as 'Purchase Order', approve and release it", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${poFormTitle}`, () => {
      cy.drEnterDocumentTitle({ name: poFormTitle });
    });

    it(`Enter description ${poFormDescription}`, () => {
      cy.drEnterDocumentDescription({ description: poFormDescription });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Enter html code into 'Render HTML' field", () => {
      cy.drEnterHtmlText({
        htmlText: renderHTMLContent,
      });
      cy.unClick();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Check PO status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", purchaseOrderFormName);
    });
  });

  context("Create PO from created PO form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to Purchase Order list", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click create new PO", () => {
      cy.poClickCreatePO();
    });

    it(`Enter description ${poDescription}`, () => {
      cy.drEnterDocumentDescription({ description: poDescription });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select Order Date", () => {
      cy.get(`[class*="MuiOutlinedInput"] > div > button[tabindex="0"]`).arrowClick();
      cy.get("button.MuiPickersDay-daySelected").arrowClick();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add Line Item' button", () => {
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00001" });
    });

    it("Enter Supplier Part Number", () => {
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "100" });
    });

    it("Check Tax option", () => {
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get(`[data-cy="form.builder.add.line.item"]`).click();
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

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
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

  context("Verify approver, approve and release PO", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Add Approver '${USERS[1].name}' for Approval`, () => {
      cy.poAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it(`Replace Requestor with '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick().wait(1000);
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify approvals is added only once in approval block", () => {
      it("Verify approvers", () => {
        cy.get("[data-tag-index='0']>span>div").should("have.length", 1);
      });
      cy.get("[data-tag-index='0']>span>div")
        .should("contain.text", "Giovanni Reynolds - enlil.testmail+cy1@gmail.com");
    });
  });

  context("Verify that history tab is capturing the changes - Adding requestor to the approval field", () => {
    it("navigate to history tab", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify requestor added field", () => {
      // eslint-disable-next-line max-len
      cy.get("[data-cy=\"form.builder.audit.STRING_NEW\"]").eq(0).contains("Requestor Added").should("exist");
    });

    it("Verify requestor value", () => {
      // // eslint-disable-next-line max-len
      cy.get("[data-cy=\"no-padding-margin\"]").eq(0).contains("Giovanni Reynolds enlil.testmail+cy1@gmail.com")
        .should("exist");
    });
  });

  context("Navigate to Approval block and try to remove approver", () => {
    it("Navigate to Approval block and try to remove approver", () => {
      cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
      cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });
  });

  context("Submit for Approval and verify PO can be released", () => {
    it("Click on Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`, () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 1",
      });
    });

    it("Approve PO", () => {
      cy.ebApprove();
    });
  });

  context("Verify released PO and it's data", () => {
    it("Verify document header details", () => {
      cy.verifyHeaderInfoContent({
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 1",
      });
    });

    it(`Verify title is ${poDescription}`, () => {
      cy.get(`[data-cy="BaseWithhtml-editor"]`).should("contain.text", poDescription);
    });

    it(`Verify PO status is Open`, () => {
      cy.get("#mui-component-select-po-status-built-in").should("contain.text", "Open");
    });

    it(`Check the Requestor field contain ${USERS[1].name} - ${USERS[1].email}`, () => {
      cy.get(`[data-cy^="po-requestor-"]`).should("have.value", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it(`Verify Order Date`, () => {
      cy.get(`[name^="ordered-"]`).should("not.have.value", "");
    });

    it(`Check the Approval field contain ${USERS[1].name} - ${USERS[1].email}`, () => {
      cy.get("div.Mui-disabled.MuiChip-deletable").should("contain", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Verify part number", () => {
      cy.get("[data-cy='partNumberDocId']").eq(0).should("have.text", "PRT-00001 - 1");
    });

    it("Verify supplier number", () => {
      cy.get("[data-cy='supplierPartNumber']").eq(0).should("have.text", "PRT-0004");
    });

    it("Verify description", () => {
      cy.get("[data-cy='description']>span>span>span").should("have.text", "New Part");
    });

    it("Verify ordered quantity", () => {
      cy.get("[data-cy='order']").eq(0).should("have.text", "5");
    });

    it("Verify Date Required", () => {
      cy.get("[data-cy='formattedDate']").eq(0)
        .should("have.text", receivingReleasedDate);
    });

    it("Verify Unit", () => {
      cy.get("[data-cy='unitPrice']").eq(0).should("have.text", "$100.00");
    });

    it("Verify tax rate", () => {
      cy.get("[name='po-items-built-in.taxRate']").should("have.text", "9.25");
    });

    it("Verify tax value", () => {
      cy.get("[name='po-items-built-in.tax']").should("have.text", "46.250000");
    });

    it("Verify Grand Total", () => {
      cy.get("[data-cy='poTotal']").should("have.text", "$566.25");
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
            Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          const responseBody = response.body.toString();
          expect(responseBody)
            .contains(`PO Number:          PO-00001-1`)
            .and.contains("Requestor:")
            .and.contains(USERS[1].name);
        });
      });
    });
  });

  context("Revise record and check flow", () => {
    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    it("Navigate to Created Record", () => {
      cy.dlSelectFirstDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("revise record", () => {
      cy.get(`[data-cy="updateRecord"]`).arrowClick();
      cy.get(`[data-cy="DocumentRevisionForm-submit"]`).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add Approver '${USERS[2].name}' for Approval`, () => {
      cy.poAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it(`Select '${USERS[2].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
      cy.get(`[data-cy^="po-requestor-"]`).arrowClick({ force: true }).wait(1000);
      cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify approvals is added only once in approval block", () => {
      it("Verify approvers", () => {
        cy.get("[data-tag-index='1']>span>div").should("have.length", 1);
      });
      cy.get("[class=\"MuiChip-root MuiAutocomplete-tag Mui-disabled MuiChip-deletable\"]")
        .should("contain.text", "Harry Bartoletti - enlil.testmail+cy2@gmail.com");
    });
  });

  context("Verify that history tab is capturing the changes - Adding requestor to the approval field", () => {
    it("navigate to history tab", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify requestor updated field", () => {
      // eslint-disable-next-line max-len
      cy.get("[data-cy=\"form.builder.audit.STRING_EDITED\"]").eq(0).contains("Requestor Updated").should("exist");
    });

    it("Verify requestor value", () => {
      // // eslint-disable-next-line max-len
      cy.get("[data-cy=\"no-padding-margin\"]").eq(0).contains("Harry Bartoletti enlil.testmail+cy2@gmail.com")
        .should("exist");
    });
  });

  context("Navigate to Approval block and try to remove approver", () => {
    it("Navigate to Approval block and try to remove approver", () => {
      cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
      cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });
  });

  context("Submit for Approval and verify PO can be released", () => {
    it("Click on Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`, () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 2",
      });
    });

    it("Approve PO", () => {
      cy.ebApprove();
    });
  });

  context("Verify released PO and it's data", () => {
    it("Verify document header details", () => {
      cy.verifyHeaderInfoContent({
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 2",
      });
    });

    it(`Verify title is ${poDescription}`, () => {
      cy.get(`[data-cy="BaseWithhtml-editor"]`).should("contain.text", poDescription);
    });

    it(`Verify PO status is Open`, () => {
      cy.get("#mui-component-select-po-status-built-in").should("contain.text", "Open");
    });

    it(`Check the Requestor field contain ${USERS[2].name} - ${USERS[2].email}`, () => {
      cy.get(`[data-cy^="po-requestor-"]`).should("have.value", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it(`Verify Order Date`, () => {
      cy.get(`[name^="ordered-"]`).should("not.have.value", "");
    });

    it(`Check the Approval field contain ${USERS[2].name} - ${USERS[2].email}`, () => {
      cy.get("div.Mui-disabled.MuiChip-deletable").should("contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Verify part number", () => {
      cy.get("[data-cy='partNumberDocId']").eq(0).should("have.text", "PRT-00001 - 1");
    });

    it("Verify supplier number", () => {
      cy.get("[data-cy='supplierPartNumber']").eq(0).should("have.text", "PRT-0004");
    });

    it("Verify description", () => {
      cy.get("[data-cy='description']>span>span>span").should("have.text", "New Part");
    });

    it("Verify ordered quantity", () => {
      cy.get("[data-cy='order']").eq(0).should("have.text", "5");
    });

    it("Verify Date Required", () => {
      cy.get("[data-cy='formattedDate']").eq(0)
        .should("have.text", receivingReleasedDate);
    });

    it("Verify Unit", () => {
      cy.get("[data-cy='unitPrice']").eq(0).should("have.text", "$100.00");
    });

    it("Verify tax rate", () => {
      cy.get("[name='po-items-built-in.taxRate']").should("have.text", "9.25");
    });

    it("Verify tax value", () => {
      cy.get("[name='po-items-built-in.tax']").should("have.text", "46.250000");
    });

    it("Verify Grand Total", () => {
      cy.get("[data-cy='poTotal']").should("have.text", "$566.25");
    });
  });
});

context("Confirm the PO entered data is correct", () => {
  it("Navigate to Purchase Order list", () => {
    cy.navigToPurchaseOrder();
  });

  it("verify the correct data are displayed in PO table with state as 'Pending Approval'", () => {
    cy.dlClearFilters();
    cy.dlFilterByDocId({ docId: "PO-00001" });
    cy.dlFilterByRev({ revision: "2" });
    cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
    cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "2");
    cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Open");
    cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "Pending Approval");
    cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "N/A");
    cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[2].name);
    cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", receivingReleasedDate);
  });
});

context(`Sign-out as ${USERS[1].name} and to sign-in as ${USERS[2].name} and release PO`, () => {
  it("Auth logout", () => {
    cy.authLogout();
  });

  it(`Auth login as ${USERS[2].name}`, () => {
    cy.authLogin({ email: USERS[2].email });
  });

  it("Select company", () => {
    cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
  });

  it("Turn off autosave", () => {
    cy.cmpTurnOffAutosave();
  });

  it("Accept Approval Request with password prompt", () => {
    cy.wrapWithWaitOnApiCalls(
      [CyRoutes.PostDashboardFeedSearch], () => {
        cy.contains("needs your approval for").trigger("mouseover").wait(500);
        cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(500);
        cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      });
    cy.progressBarShouldNotExist();
    cy.listLoadingElementShouldNotExist();
    cy.checkToastMessage({ exists: false });
  });
});

context(`Sign-out as ${USERS[2].name} and to sign-in as ${USERS[1].name} and verify PO data`, () => {
  it("Auth logout", () => {
    cy.authLogout();
  });

  it(`Auth login as ${USERS[1].name}`, () => {
    cy.authLogin({ email: USERS[1].email });
  });

  it("Select company", () => {
    cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
  });

  it("Navigate to Purchase Order list", () => {
    cy.navigToPurchaseOrder();
  });

  it("Select created PO", () => {
    cy.dlClearFilters();
    cy.dlSelectFirstDocument();
  });

  it(`Verify PO statusbar background-color as GREEN(${Colors.latest_green_varient}) for RELEASED document`, () => {
    cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
  });
});

context("Navigate to landing page and verify that correct data are displayed", () => {
  it("Navigate to Purchase Order landing page", () => {
    cy.navigToPurchaseOrder();
  });

  it("verify the correct data are displayed in PO fields", () => {
    cy.dlClearFilters();
    cy.dlFilterByDocId({ docId: "PO-00001" });
    cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
    cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "2");
    cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Open");
    cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "RELEASED");
    cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "N/A");
    cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "PRT-00001 - 1");
    cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "$566.25");
    cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[2].name);
    cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", receivingReleasedDate);
  });
});

context("Verify that downloaded PDF display Requestor information", () => {
  it("Select created PO", () => {
    cy.dlSelectFirstDocument();
  });

  it("[API]Login admin tester", (done: any) => {
    cy.authApiLogin({
      email: USERS[1].email,
    }).then((response) => {
      loginResponse = response;
      done();
    });
  });

  it("Turn off autosave", () => {
    cy.cmpTurnOffAutosave();
  });

  it("[API]Get html document and verify PO number and Requestor information", () => {
    cy.url().then((url: any) => {
      poHTMLDocRevId = url.split("/").pop();
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        const responseBody = response.body.toString();
        cy.log(responseBody);
        expect(responseBody)
          .contains(`PO Number:          PO-00001-2`)
          .and.contains("Requestor:")
          .and.contains(USERS[2].name);
      });
    });
  });
});

export { };
