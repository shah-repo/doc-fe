// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let multipleCompanies;
let poCreationDate1;
let poCreationDate2;
const pages = ["", "", ""];
let tmpRegex;
let downloadUrl;
let fileId;
let purchaseOrderId;
let downloadFile;
let emailsFromInbox: IMAPEmail[];
let dateAfterEmailShouldArrive;
const dateOffset = (5 * 1000);
const ADMIN_USER = USERS[1];
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const purchaseOrderFormName = "New Purchase Order Form";
// eslint-disable-next-line max-len
const renderHTMLContent = `<!DOCTYPE html><html lang="en"><head>  <meta charset="UTF-8" />  <meta name="viewport" content="width=device-width, initial-scale=1.0" />  <title>Document</title>  <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script></head><body>  <style>    html {      zoom: 0.2;    }    * {      margin: 0;      padding: 0;      box-sizing: border-box;      font-family: "Open Sans", sans-serif;      -webkit-print-color-adjust: exact;    }    .container {      width: 2480px;      padding: 80px;      margin: 0 auto;      position: relative;      background: #ffffff;    }    header {      padding-bottom: 30px;      border-bottom: 1px solid #d3d3d3;      margin-bottom: 80px;      height: 180px;    }    .fs41 {      font-size: 41px;    }    .fs34 {      font-size: 34px;    }    .fwb {      font-weight: bold;      letter-spacing: 1px;    }    .text-white {      color: white;    }    .title {      padding: 33px 30px;      background-color: #0381CB;    }    .title strong {      font-size: 34px;      color: white;    }    .information {      margin-bottom: 1.5em;    }    .information:after {      content: "";      display: block;      clear: both;    }    .information__supplier {      width: 1007px;      float: left;      border: 1px solid #d3d3d3;      min-height: 1100px;    }    .information__shipping {      width: 1273px;      float: right;      border: 1px solid #d3d3d3;      min-height: 1100px;    }    .supplier__address {      padding: 50px 30px;      border-bottom: 1px solid #d3d3d3;      height: 711px;    }    .supplier__contacts,    .billing__mail {      height: 220px;    }    .shipping-billing {      height: 314px;    }    .address-value,    .phone-value,    .fax-value,    .shipping-value,    .billing-value,    .data-value {      margin-left: 10px;    }    .supplier__contacts,    .supplier__info,    .billing__mail {      padding-left: 30px;      padding-top: 20px;      border-bottom: 1px solid #d3d3d3;    }    .supplier__info,    .billing__contacts {      border-bottom: none;      height: 200px;    }    .invoice_mail,    .contact_mail,    .data__item,    .total__item {      margin-bottom: 45px;    }    .invoice_mail div,    .contact_mail div {      float: left;      margin-right: 30px;    }    .data__item div {      float: left;      margin-right: 30px;    }    .data__item::after {      content: "";      display: block;      clear: both;    }    .invoice_mail:after {      content: "";      display: block;      clear: both;    }    .contact_mail:after {      content: "";      display: block;      clear: both;    }    .data-value {      font-size: 34px;      letter-spacing: 0px;      color: #292929;    }    .shipping-billing {      padding: 50px 30px;      border-bottom: 1px solid #d3d3d3;    }    .shipping-billing:after {      content: "";      display: block;      clear: both;    }    .shipping,    .billing {      width: 48%;    }    .shipping {      float: left;    }    .billing {      float: right;    }    .billing__contacts {      border-bottom: none;      padding-left: 30px;      padding-top: 20px;    }    .data_element {      float: left;      padding-right: 10px;      width: 50%;    }    .list table {      border-spacing: 0;      border-collapse: collapse;      border: 1px solid #007698;    }    .table th {      text-align: center;    }    .list td {      border: 1px solid #d3d3d3;    }    table {      max-width: 100%;    }    th {      font-weight: 900;    }    table {      margin-bottom: 1.5em;      position: relative;      width: 100%;      z-index: 1;    }    table th,    table td {      font-family: inherit;      font-size: inherit;      padding: 12px 0px;      vertical-align: middle;      font-size: 28px;    }    #checkbox {      border: 0.1px solid black;      height: 40px;      width: 40px;      position: absolute;      top: 30px;      left: 40px;    }    .checked {      width: 30px;      height: 15px;      border: 2px solid;      position: absolute;      top: 18%;      left: 13%;      transform: rotate(-45deg);      border-top: none;      border-right: none;      /* display:none; */    }    .smallCell {      width: 140px;    }    section {      margin-bottom: 50px;    }    .comments {      width: 1509px;      border: 1px solid #d3d3d3;      margin-right: 100px;      float: left;    }    .comments__block,    .subtotal {      height: 240px;    }    .subtotal {      width: 635px;      float: left;      padding-top: 30px;    }    section:after {      content: "";      display: block;      clear: both;    }    .subtotal .data__item {      margin-bottom: 20px;    }    .total {      padding: 10px 50px 10px 10px;      width: 635px;      border: 1px solid #d3d3d3;    }    .total .total__item {      margin-bottom: 0px;    }    .total__item div {      float: left;    }    .total__item:after {      content: "";      display: block;      clear: both;    }    .approvals {      border: 1px solid #d3d3d3;      margin-bottom: 50px;      width: 2320px;    }    .directors {      padding: 20px 50px 20px 20px;    }    .directors div {      float: left;      margin-right: 200px;      width: fit-content;    }    .directors div:last-child {      margin-right: 0px;    }    .directors:after {      content: "";      display: block;      clear: both;    }    .directors ul {      list-style-type: none;      padding-top: 30px;    }    .directors ul li {      margin-bottom: 30px;      font-size: 34px;    }    .directors ul li:last-child {      margin-bottom: 0px;    }    .signature span {      font-size: 34px;    }    .notification {      padding-bottom: 50px;      border-bottom: 1px solid #d3d3d3;    }    #date {      position: absolute;      right: 80px;      margin-top: 10px;      font-weight: bold;      font-size: 20px;    }  </style>  <div class="container">    <header>      <div style="float: left; width: 33%;">        <p class="fwb fs41">Purchase Order </p>        <p class="fs41" style="color: #292929;">Shifamed</p>      </div>      <div style="float: left; width: 33%; text-align: center;"> <img          src="https://doc-be-dev-public.s3.us-west-2.amazonaws.com/fbeba60d-2f25-4f35-90e8-41bb79b40df2/2021-01-26T12%3A27%3A29.846Z/Adona_logo.png"          alt="Logo" /> </div>      <div style="float: right;">        <p class="fwb fs41" style="color: #292929;">PO Number:          {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}<span></span></p>      </div>    </header>    <div style="clear: both;"></div>    <div class="information">      <div class="information__supplier">        <div class="title"> <strong class="fs18 text-white">SUPPLIER INFORMATION</strong> </div>        <div class="supplier__address">          <div style="float: left; margin-right: 20px; height: 100%;"> <strong              style="color: #292929; font-size: 34px;">To:</strong> </div>          <div class="data-value">            <div>{{autocompletes.po-supplier-built-in.name}}</div>            <div id="to-description" style="white-space: pre;">{{{autocompletes.po-supplier-built-in.description}}}            </div>          </div>        </div>        <div style="clear: both;"></div>        <div class="supplier__info">          <div class="data__item">            <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Department:</strong> </div>            <div class="data-value">{{documentRevision.formInput.department-k6ml6ew5}}</div>          </div>          <div class="data__item">            <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Requestor:</strong> </div>            <div class="data-value">{{autocompletes.po-requestor-autocomplete.user.name}}</div>          </div>        </div>      </div>      <div class="information__shipping">        <div class="title"> <strong>SHIPPING/BILLING INFORMATION</strong> </div>        <div class="shipping-billing" style="height: 100%">          <div class="shipping" style="height: 100%;width: 100%;">            <div style="float: left; height: 175px; margin-right: 30px;"> <strong                style="color: #292929; font-size: 34px;">Ship To:</strong> </div>            <div class="data-value">              <div id="shipping" style="">                <div id="shipping-customer-company" style="display: none">                  {{documentRevision.formInput.company-ship-to-address-kn5cq5gi}}</div>                <div id="shipping-third-party-company" style="display: none">                  {{autocompletes.third-party-company-k7f25yb6.name}}                  <br />{{{autocompletes.third-party-company-k7f25yb6.description}}}</div>                <div id="shipping-complete-manually" style="display: none">                  {{documentRevision.formInput.ship-to-address-k7f27j0k}}</div>              </div>            </div>          </div>          <div class="billing" style="width: 100%;margin-top: 40px;">            <div style="float: left; height: 175px; margin-right: 30px;"> <strong                style="color: #292929; font-size: 34px;">Bill To:</strong> </div>            <div class="data-value">              <div id="billing1" style="">                <div id="billing-customer-company"> Adona Medical <br>590 Division St <br>Campbell CA 95008 </div>                <div id="billing-complete-manually" style="display: none">                  {{documentRevision.formInput.company-bill-to-k7f2e82a}}</div>              </div>              <div id="billing"></div>            </div>          </div>        </div>        <div class="billing__mail">          <div class="invoice_mail">            <div style="float: left; width: 220px;"> <strong style="color: #292929; font-size: 34px;">Invoices                to:</strong> </div>            <div class="data-value" style="float: left;">accounting@shifamed.com </div>          </div>          <div class="contact_mail">            <div style="float: left; width: 202px;"> <strong style="color: #292929; font-size: 34px;">Contact:</strong>            </div>            <div class="data-value" style="float: left;">{{documentRevision.formInput.contact-email-kl7slf5l}}</div>          </div>        </div>        <div class="billing__contacts">          <div class="data_element">            <div class="data__item">              <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Shipping:</strong> </div>              <div class="data-value">{{documentRevision.formInput.shipping-k6mletok}}</div>            </div>            <div class="data__item">              <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Terms:</strong> </div>              <div class="data-value">{{documentRevision.formInput.terms-k6mlftzn}}</div>            </div>          </div>          <div class="data_element">            <div class="data__item">              <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Ordered:</strong> </div>              <div id="ordered" class="data-value"> </div>            </div>            <div class="data__item">              <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Quote:</strong> </div>              <div class="data-value">{{documentRevision.formInput.quotation-number-k7dwg3xr}} </div>            </div>          </div>        </div>      </div>    </div>    <div class="list">      <table id="items-table">        <thead>          <tr class="title text-white fwb" style="text-transform: uppercase;">            <th style="text-align: center;">Item</th>            <th style="text-align: center;width: 200px;">Order Qty</th>            <th style="text-align: center;">Units</th>            <th style="text-align: center;width: 400px;">SUP PN / Date Required</th>            <th style="text-align: center;">Description / PN</th>            <th style="text-align: center;">Price</th>            <th style="text-align: center;width: 230px;">Ext. Amount</th>            <th class="smallCell" style="text-align: center;">Tax</th>          </tr>        </thead>        <tbody> {{#documentRevision.formInput.po-items-built-in.items}} <tr title="table-item">            <td class="data-value" style="text-align: center;">{{index++}}</td>            <td class="data-value" style="text-align: center;">{{order}}</td>            <td class="data-value" style="text-align: center;">{{units}}</td>            <td class="data-value" style="text-align: center;">{{supplierPartNumber}}<br /> {{formattedDate}}</td>            <td class="data-value" style="text-align: center;">              {{partNumberTitle}}{{^partNumberTitle}}{{description}}{{^description}}{{/description}}{{/partNumberTitle}}              <br />              {{partNumberDocId}}{{^partNumberDocId}}{{serviceId}}{{^serviceId}}{{/serviceId}}{{/partNumberDocId}}</td>            </td>            <td class="data-value" style="text-align: center;"><span class="currency"></span>{{unitPrice}}</td>            <td class="data-value" style="text-align: center;"><span class="currency"></span>{{totalAmount}}</td>            <td style="position: relative; height: 188px;">              <div id="checkbox">{{#tax}}&#10003;{{/tax}}</div>            </td>          </tr>          <tr style="text-align: center; height: 95px;background-color: #ECECEC;">            <td colspan="8" style="color: #292929; height: 95px;" class="data-value">{{glCode}}</td>          </tr> {{/documentRevision.formInput.po-items-built-in.items}}        </tbody>      </table>    </div>    <section>      <div class="comments">        <div class="title"> <strong class="text-white fwb">NOTES / COMMENTS FOR SUPPLIER</strong> </div>        <div class="comments__block">          <div class="data-value" style="text-align: left; margin-left: 30px; margin-top: 30px;">            {{{documentRevision.formInput.comments-k6mlinzm}}} </div>        </div>      </div>      <div class="subtotal">        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Subtotal:</strong> </div>          <div class="data-value"> <span              class="currency"></span>{{documentRevision.formInput.po-items-built-in.subTotal}} </div>        </div>        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Tax:</strong> </div>          <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.tax}}          </div>        </div>        <div class="data__item">          <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Shipping Cost:</strong> </div>          <div class="data-value"> <span              class="currency"></span>{{documentRevision.formInput.po-items-built-in.shippingCost}} </div>        </div>        <div class="total">          <div class="total__item">            <div style="width: 268px;"> <strong style="color: #292929; font-size: 34px;">Total:</strong> </div>            <div class="data-value"> <span                class="currency"></span>{{documentRevision.formInput.po-items-built-in.totalAmount}} </div>          </div>        </div>      </div>    </section>    <div class="approvals">      <div class="title"> <strong class="text-white fwb">APPROVALS:<span></span></strong> </div>      <div class="directors">        <div style="margin-left: 100px;"> <strong style="color: #292929; font-size: 34px;">Name</strong>          {{#documentRevision.approvals}} <ul>            <li>{{approver.user.name}}</li>          </ul> {{/documentRevision.approvals}} </div>        <div> <strong style="color: #292929; font-size: 34px;">Date</strong> {{#validApprovalDates}} <ul>            <li>{{reviewedAt}}</li>          </ul> {{/validApprovalDates}} </div>      </div>    </div>    <div class="notification">      <p style="color: #292929; font-size: 34px;"> <strong style="color: #292929; font-size: 34px;"> Change          Notification: </strong> Supplier shall provide notification of any change or deviation to Goods and/or        Services to be provided under the Purchase Order. Any change or deviation requires prior written consent. </p>    </div>    <div> </div>    <footer>      <div id="pageFooter-last" />    </footer>  </div>  <script>         var table = document.getElementById('items-table'); var rows = []; var tempRows = table.getElementsByTagName('tr'); for (var i = 0; i < tempRows.length; i++) { if (tempRows[i].title === "table-item") { rows.push(tempRows[i]); } } for (var i = 0; i < rows.length; i++) { var index = i + 1; rows[i].cells[0].innerHTML = index; }      </script>  <script>   document.getElementById("to-description").innerHTML = document.getElementById("to-description").innerHTML.replace(/(<((?!br|\/br)[^>]+)>)/gi, ""); function formatDate(date) { if (!date) { return ""; } return moment(date).format("MM/DD/YYYY"); } document.getElementById("ordered").innerHTML = formatDate("{{documentRevision.formInput.po-order-date}}"); function shipping(field, options) { if (field === "Customer Company") { document.getElementById("shipping").style.whiteSpace = 'normal'; return options.customerCompany; } else if (field === "Third Party Company") { document.getElementById("shipping").style.whiteSpace = 'normal'; return options.thirdPartyCompany; } else if (field === "Complete Manually") { document.getElementById("shipping").style.whiteSpace = 'pre'; return options.completeManually; } else return ""; }; document.getElementById("shipping").innerHTML = shipping("{{documentRevision.formInput.ship-to-k7f1t1lw}}", { customerCompany: document.getElementById("shipping-customer-company").innerHTML, thirdPartyCompany: document.getElementById("shipping-third-party-company").innerHTML, completeManually: document.getElementById("shipping-complete-manually").innerHTML, }); function billing(field, options) { if (field === "Customer Company") { document.getElementById("billing").style.whiteSpace = 'normal'; return options.customerCompany; } else if (field === "Complete Manually") { document.getElementById("billing").style.whiteSpace = 'pre'; return options.completeManually; } else return ""; }; document.getElementById("billing").innerHTML = billing("{{documentRevision.formInput.bill-to-k7f29tfo}}", { customerCompany: document.getElementById("billing-customer-company").innerHTML, completeManually: document.getElementById("billing-complete-manually").innerHTML, }); function getCurrency(currency) { switch (currency) { case "EUR": return "€"; case "USD": return "$"; case "GBP": return "£"; default: return ""; } } var currencyElements = document.getElementsByClassName("currency"); for (var i = 0; i < currencyElements.length; i++) { currencyElements[i].innerHTML = getCurrency("{{documentRevision.formInput.po-items-built-in.currency}}"); }; if ("{{documentRevision.formInput.ship-to-k7f1t1lw}}" === "Customer Company") { document.getElementById("shipping").innerHTML = document.getElementById("shipping").innerHTML.replace(/, /gi, "<br>"); }; if ("{{documentRevision.formInput.bill-to-k7f29tfo}}" === "Customer Company") { document.getElementById("billing").innerHTML = document.getElementById("billing").innerHTML.replace(/, /gi, "<br>"); } </script></body></html>`;
const predefinedPOSchema = [
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
    rules: "required",
    tabId: "details",
    hidden: false,
    deleted: false,
    optionId: "3",
    optionPath: "/change_requests/available_approvers",
    placeholder: "[Select requestor here]",
    rulesObject: {},
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    optionLabelKey: "user.email",
    optionValueKey: "id",
    outputDisabled: false,
    validationMode: "default",
    formValuesRules: {},
    editorProperties: [
      "deleteDisabled",
    ],
    validationAttribute: "Requestor",
    deleteInFormDisabled: true,
    sampleItemsIndicator: {
      id: "",
      enabled: false,
      serialNumber: 0,
      sampleSection: false,
    },
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
    validationAttribute: "Supplier",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "ordered-k6mlhan7",
    type: "datepicker",
    index: 4,
    label: "Order Date",
    rules: "required",
    tabId: "details",
    hidden: false,
    deleted: false,
    validators: {
      required: true,
    },
    rulesObject: {},
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    formValuesRules: {},
    editorProperties: [
      "deleteDisabled",
    ],
    validationAttribute: "Order Date",
    deleteInFormDisabled: true,
    sampleItemsIndicator: {
      id: "",
      enabled: false,
      serialNumber: 0,
      sampleSection: false,
    },
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
    validationAttribute: "Purchase Order",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "po-items-built-in-summary",
    type: "purchaseordersummary",
    index: 6,
    label: "Purchase Order Summary",
    tabId: "details",
    lineItem: "po-items-built-in",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    validationAttribute: "Purchase Order Summary",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
];

context("Create company with JSON's", () => {
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

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.listLoadingElementShouldNotExist();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*='approved-dam-json-is-used-']").check("Yes");
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "po_dam.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*='approved-page-details-json-is-used-']").check("Yes");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*='approved-navigation-json-is-used-']").check("Yes");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get("[data-cy='albumMediaButton']").eq(0).arrowClick();
      cy.pmUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document for create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login User", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });
  });

  context("Create Part & Supplier manually", () => {
    context("Create Form Part document to create Part", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
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
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create Part document for PO", () => {
      it("Navigates to parts list", () => {
        cy.navigToParts();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.ptClickCreateNewPart();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'PO Part' Form", () => {
        cy.ptSelectPartFormFromMultiSelect({ partForm: "Parts" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
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

    context("Create Supplier form for PO", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enters title 'New Supplier Form'", () => {
        cy.drEnterDocumentTitle({ name: "New Supplier Form" });
      });

      it("Enters description 'New Supplier Description'", () => {
        cy.drEnterDocumentDescription({ description: "New Supplier Description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Supplier' outputdocument type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Supplier" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create Supplier document for PO", () => {
      it("Navigates to suppliers list", () => {
        cy.navigToSuppliers();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'Add new supplier' button", () => {
        cy.ptClickCreateNewPart();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enters title 'New Supplier'", () => {
        cy.drEnterDocumentTitle({ name: "New Supplier" });
      });

      it("Enters description 'New Part description'", () => {
        cy.drEnterDocumentDescription({ description: "New Supplier description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });
  });

  context("Check PO exists & verify schema with predefined schema", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check filters for document type management", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.filterDocTypeManagement({
        status: "Active", documentType: "Purchase Order", acronym: "PO-",
        privateNumber: "Yes", redline: "No", qms: "Yes", needsSignature: "Yes", training: "No",
        startingNumber: "1", revisionStage: "Numeric", group: "PO",
        equipmentProdEnforce: "No", category: "Purchase Order",
      });
    });

    it("Check predefined schema matches the one set in previous", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='14']>span").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[class="k-form-field-wrap"]>span>textarea`)
        .invoke("val")
        .then((res) => JSON.parse(res as string))
        .each((preItem: any, index: number) => {
          expect(preItem.name).to.eq(predefinedPOSchema[index].name);
          expect(preItem.type).to.eq(predefinedPOSchema[index].type);
          expect(preItem.label).to.eq(predefinedPOSchema[index].label);
          expect(preItem.tabId).to.eq(predefinedPOSchema[index].tabId);
        });
    });

    it("Close the schema popup", () => {
      cy.dtmCloseDialogButton();
    });
  });

  context("Create a new form with output PO", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: purchaseOrderFormName });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("PO Status is a Select Field", () => {
      cy.get("#mui-component-select-po-status-built-in").should("exist");
    });

    it("PO Status is labeled 'PO Status'", () => {
      cy.get(`[data-cy="PO Status"]`).should("have.text", "PO Status");
    });

    it("PO status field can not be deleted", () => {
      cy.get(".fb-field-wrapper-po-status-built-in>div>div>div>[data-cy='remove-schema-item']")
        .should("have.class", "schema-delete-disabled");
    });

    it("Section field labeled 'General Information'", () => {
      cy.get(`[data-cy="General Information"]`).should("have.text", "General Information");
    });

    it("Autocomplete field labeled 'Requestor'", () => {
      cy.get(`[data-cy="Requestor"]`).should("have.text", "Requestor");
    });

    it("Requestor field cannot be deleted", () => {
      cy.get(".fb-field-wrapper-po-requestor-autocomplete>div>div>div>[data-cy='remove-schema-item']")
        .should("have.class", "schema-delete-disabled");
    });

    it("Supplier field labeled 'Supplier'", () => {
      cy.get(`[data-cy="Supplier "]>div>span`).should("have.text", "Supplier ");
    });

    it("Supplier field cannot be deleted", () => {
      cy.get(".fb-field-wrapper-po-supplier-built-in>div>div>div>[data-cy='remove-schema-item']")
        .should("have.class", "schema-delete-disabled");
    });

    it("Date picker field labeled 'Order date'", () => {
      cy.get(`[data-cy="Order Date"]`).should("have.text", "Order Date");
    });

    it("Order date field cannot be deleted", () => {
      cy.get(".fb-field-wrapper-ordered-k6mlhan7>div>div>div>[data-cy='remove-schema-item']")
        .should("have.class", "schema-delete-disabled");
    });

    it("Switch to Line items tab", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("PO table field labeled 'Purchase Order'", () => {
      cy.get(`[data-cy="Purchase Order"]`).should("have.text", "Purchase Order");
    });

    it("PO table field cannot be deleted", () => {
      cy.get(".fb-field-wrapper-po-items-built-in>div>div>div>[data-cy='remove-schema-item']")
        .should("have.class", "schema-delete-disabled");
    });
  });

  context("See preview & Send to email and verify all fields are present", () => {
    it("Switch to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("PO Status is a Select Field", () => {
      cy.get(`[id="mui-component-select-po-status-built-in"]`).eq(1).should("exist");
    });

    it("General Information exists", () => {
      cy.get(`[id="general-information-to-be-completed-by-requester-kc3oqlpn"]`).eq(1).should("exist");
    });

    it("Requestor exists", () => {
      cy.get("[data-cy='po-requestor-autocomplete']").eq(1).should("exist");
    });

    it("Supplier exists", () => {
      cy.get(`[name="po-supplier-built-in"]`).eq(1).should("exist");
    });

    it("Order Date exists", () => {
      cy.get(`[name="ordered-k6mlhan7"]`).eq(1).should("exist");
    });

    it("Approals exists", () => {
      cy.get(`[name^="fb-po-approvals"]`).eq(1).should("exist");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to Line items tab", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Order Date exists", () => {
      cy.get(`[name="po-items-built-in"]`).eq(1).should("exist");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Send to email & Verify all fields are present", () => {
    it(`Check doc ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get(`[data-cy="field-name"]`).should("have.text", purchaseOrderFormName);
      cy.get("[data-cy='HeaderInfo-docId']").then((x) => {
        purchaseOrderId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message 'File will be sent to your email shortly.'", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Purchase Order form notification", () => {
    it("Verify emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${purchaseOrderId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
        expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
        downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download. Link will expire in 4 hours.",
            `<button type="button">DOWNLOAD</button>`,
          ],
        }];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    it("Download zip file containing Purchase Order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${purchaseOrderId}${filetime}_draft.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });

      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${purchaseOrderId}-1-New-Purchase-Order-Form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for Approval request form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${purchaseOrderId}-1-New-Purchase-Order-Form.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 for Approval request form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${purchaseOrderId}, Revision 1\nNEW PURCHASE ORDER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nNew Purchase Order Form description/);

        expect(el).match(/Output Document Type\nPurchase Order/);

        expect(el).match(/PO Status/);

        expect(el).match(/GENERAL INFORMATION/);

        expect(el).match(/Requestor/);

        expect(el).match(/Supplier/);

        expect(el).match(/Order Date/);

        expect(el).match(/Draft/);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for Approval request form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${purchaseOrderId}, Revision 1\nNEW PURCHASE ORDER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Purchase Orders/);

        expect(el).match(/APPROVALS/);

        expect(el).match(/Approvers/);

        expect(el).match(/Draft/);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for Approval request form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${purchaseOrderId}, Revision 1\nNEW PURCHASE ORDER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History/);

        expect(el).match(/Draft/);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("In Render HTML paste an updated code", () => {
    it("Switch to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter html code into 'Render HTML' field", () => {
      cy.drEnterHtmlText({
        htmlText: renderHTMLContent,
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Create an output", () => {
      cy.drCreateNewDocumentFromForm();
      poCreationDate1 = moment().tz("America/Los_Angeles").format("MMM D, YYYY hh:mm A");
      poCreationDate2 = moment().tz("America/Los_Angeles").add(1, "minutes").format("MMMM D, YYYY hh:mm A");
    });
  });

  context("Make sure all predefined fields are present", () => {
    it("PO Status is a Select Field", () => {
      cy.get("#mui-component-select-po-status-built-in").should("exist");
    });

    it("General Information exists", () => {
      cy.get("#general-information-to-be-completed-by-requester-kc3oqlpn").should("exist");
    });

    it("Requestor exists", () => {
      cy.get("[data-cy='po-requestor-autocomplete']").should("exist");
    });

    it("Supplier exists", () => {
      cy.get(`[name="po-supplier-built-in"]`).should("exist");
    });

    it("Order Date exists", () => {
      cy.get(`[name="ordered-k6mlhan7"]`).should("exist");
    });

    it("Approals exists", () => {
      cy.get(`[name^="fb-po-approvals"]`).should("exist");
    });

    it("Switch to Line items tab", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Order Date exists", () => {
      cy.get(`[name="po-items-built-in"]`).should("exist");
    });
  });

  context("Fill form fields", () => {
    it("Enter description 'New Purchase Order'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Check history entry", () => {
      SystemRequirement("REQ-1630");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drSelectHistoryTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="change-key-0"]`).contains(USERS[1].name);
      cy.get("time[data-cy='audit-time-0']")
        .contains((poCreationDate1 || poCreationDate2));
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Switch to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.unClick();
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Create A New Supplier'", () => {
      SystemRequirement("REQ-4900");
      cy.get("[data-cy='form.builder.create.new.supplier']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Title 'Supplier'", () => {
      cy.get("[data-cy='name']").arrowType("Supplier");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Description 'Supplier Description'", () => {
      cy.xpath("//div[@data-cy='description']/../div[2]").eq(1).arrowClick();
      cy.get("[data-cy='description']>div>div>div>div>div[contenteditable]").eq(1).clear()
        .arrowType("Supplier Description").wait(500);
      cy.unClick();
      cy.checkToastMessage({ exists: false });
    });

    it("Select Document Type 'Supplier'", () => {
      cy.get("[name='document.documentType.id']").autocompleteSelect("Supplier");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new supplier", () => {
      cy.get("[data-cy='common.confirm']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Order Date", () => {
      cy.get("input[name^=ordered]").parent().find("button").arrowClick().wait(1000);
      cy.get("button.MuiPickersDay-daySelected").arrowClick().wait(1000);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.poAddApproverOnApproverList({ approver: USERS[1].email });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Uploads text.docx", () => {
      SystemRequirement("REQ-1350");
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      SystemRequirement("REQ-1400");
      cy.get("[data-cy='common.add']").click();
      cy.get("p[class*='MuiFormHelperText-root']>span")
        .contains("The Part Number field is required when Supplier Part Number is empty.");
      cy.get("p[class*='MuiFormHelperText-root']>span")
        .contains("The Supplier Part Number field is required when Part Number is empty.");
    });

    it("Select Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectPartNumber({ partNo: "PRT-00001 - 1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "5" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
    });

    it("Enter Supplier Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter number of Units", () => {
      SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1410");
      cy.get("[name='date']").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button to add item without Part Number", () => {
      cy.get("[data-cy='fb-control-btn']").last().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "10" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
    });

    it("Enter Supplier Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter number of Units", () => {
      SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1410");
      cy.get("[name='date']").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Check line items have unique IDs", () => {
      SystemRequirement("REQ-1380");
      cy.poCheckForLineItemsAndTheirID({ firstId: "1", secondId: "2" });
    });

    it("Check currency options dropdown", () => {
      SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
    });

    it("Select Currency 'USD'", () => {
      cy.poSelectCurrency({ currencyValue: "USD" });
      cy.unClick();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Subtotal value", () => {
      SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "$30.00" });
    });

    it("Check Tax value", () => {
      SystemRequirement("REQ-1450");
      cy.poCheckTax({ number: "2.775000" });
    });

    it("Check Total value", () => {
      SystemRequirement("REQ-1440");
      cy.unClick();
      cy.get("[data-cy='poTotal']").should("have.text", "$34.77");
    });
  });

  context("Submit for Approval", () => {
    it("Click 'Submit for Approval' button", () => {
      SystemRequirement("REQ-1490");
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.ebApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });
});

export { };
