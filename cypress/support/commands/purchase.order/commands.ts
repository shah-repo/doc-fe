/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { integer } from "aws-sdk/clients/cloudfront";
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      poAddNewFieldItem(): Chainable<Subject>;
      poCreateNew(): Chainable<Subject>;
      poClickCreatePO(): Chainable<Subject>;
      poAddPOButtonClick(): Chainable<Subject>;
      poEnterDocumentDescription(params: {description: string }): Chainable<Subject>;
      poSelectPartNumber(): Chainable<Subject>;
      poEnterQuantityOrdered(params: {quantity: string}): Chainable<Subject>;
      poSelectUnits(): Chainable<Subject>;
      poSelectGLCode(): Chainable<Subject>;
      poEnterSupplierPartNumber(params: {partNumber: string}): Chainable<Subject>;
      poNumberOfUnits(params: {number: string}): Chainable<Subject>;
      poAddDateRequired(): Chainable<Subject>;
      poShippingCost(params: {number: string}): Chainable<Subject>;
      poCheckCurrency(): Chainable<Subject>;
      poCheckAmount(params: {number: string}): Chainable<Subject>;
      poSelectTaxCheckbox(): Chainable<Subject>;
      poSelectOption(params: {optionName: string}): Chainable<Subject>;
      poEnterServiceID(params: {serviceId: string}): Chainable<Subject>;
      poEnterDescription(params: {description: string}): Chainable<Subject>;
      poSelectCurrency(params: { currencyValue: string }): Chainable<Subject>;
      poCheckMessageForConversionSite(): Chainable<Subject>;
      poCheckStatus(...list: string[]): Chainable<Subject>;
      poClickOnSpecificPOFromList(params: {item: string}): Chainable<Subject>;
      poCheckForSpecificPOItemValue(params: {itemValue: string}): Chainable<Subject>;
      poConvertedToDollarsMessage(): Chainable<Subject>;
      poCheckIfFormPopUpIsActive(...list: string[]): Chainable<Subject>;
      poCloseFormPopUpOnLandingPage(): Chainable<Subject>;
      poCheckForLineItemsAndTheirID(params: {firstId: string; secondId: string}): Chainable<Subject>;
      poAMEnterLevelName(params: {name: string}): Chainable<Subject>;
      poAMEnterLimit(params: {limit: string}): Chainable<Subject>;
      poAMSelectUsers(...list: string[]): Chainable<Subject>;
      poAMCheckForApproval(): Chainable<Subject>;
      poSaveDocument(): Chainable<Subject>;
      poAMCheckApprovalIconIfItsGreen(): Chainable<Subject>;
      poAMCheckApprovalIconIfItsGray(): Chainable<Subject>;
      poAMSelectApprover(...list: string[]): Chainable<Subject>;
      poAMApproveButton(): Chainable<Subject>;
      poAMCheckIfApproverHasApprovalSign(): Chainable<Subject>;
      poAMCheckForAlertMessage(): Chainable<Subject>;
      poRejectAR(params: {password: string}): Chainable<Subject>;
      poVerifyStatus(params: {status: string}): Chainable<Subject>;
      poAPICreatePO(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      poSelectPoForm(params: {nameOfPoForm: string}): Chainable<Subject>;
    }
  }
}

export interface PurchaseOrderItem {
  index: integer;
  partNumber?: string;
  descritpion?: string;
  ordered: integer;
  received: integer;
  units?: string;
  dateRequired?: string;
  unitPrice: string;
  totalPrice?: string;
}
Cypress.Commands.add("poSelectPoForm", (params: {nameOfPoForm: string}) => {
  cy.get("[id=FormListDialog-selectForm]").click();
  cy.get("[id^=react-select]").contains(params.nameOfPoForm).click();
});

Cypress.Commands.add("poAddNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").click().wait(500);
});

Cypress.Commands.add("poAddPOButtonClick", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains(new RegExp("^Add$", "g")).click();
});

Cypress.Commands.add("poCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevGet, CyRoutes.DocPreview, CyRoutes.LotQuantity], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
  });
});

Cypress.Commands.add("poClickCreatePO", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
});

Cypress.Commands.add("poEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description);
  cy.get("[id=\"DocumentRevisionForm-submit\"]").wait(3000).click();
});

Cypress.Commands.add("poSelectPartNumber", () => {
  cy.get("[name=\"partNumber\"]").click().wait(300);
  cy.get("ul[role=listbox] > li").contains("PRT-00003 - 1").click();
});

Cypress.Commands.add("poEnterQuantityOrdered", (params: {quantity: string}) => {
  cy.get("[name=\"order\"]").click().type(params.quantity);
});

Cypress.Commands.add("poSelectUnits", () => {
  cy.get("[name=\"units\"]").click();
  cy.get("ul[role=listbox] > li").contains("Each").click();
});

Cypress.Commands.add("poSelectGLCode", () => {
  cy.get("[name=\"glCode\"]").click();
  cy.get("ul[role=listbox] > li").contains("code 1").click();
});

Cypress.Commands.add("poEnterSupplierPartNumber", (params: {partNumber: string}) => {
  cy.get("[name=\"description\"]").click().type(params.partNumber);
});

Cypress.Commands.add("poNumberOfUnits", (params: {number: string}) => {
  cy.get("[name=\"unitPrice\"]").click().type(params.number);
});

Cypress.Commands.add("poAddDateRequired", () => {
  cy.xpath("//input[@name]/ ../div/button").click().wait(200);
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click().wait(300);
});

Cypress.Commands.add("poShippingCost", (params: {number: string}) => {
  cy.get("[name*=\"shippingCost\"]").click().wait(1000).type("{leftarrow}{leftarrow}{leftarrow}{leftarrow}" + params.number);
});

Cypress.Commands.add("poCheckCurrency", () => {
  cy.get("[id*=\"currency\"]").click();
  cy.get("ul[role=listbox] > li").contains("USD").should("exist");
  cy.get("ul[role=listbox] > li").contains("EUR").should("exist");
  cy.get("ul[role=listbox] > li").contains("GBP").should("exist");
  cy.get("ul[role=listbox] > li").contains("AUD").should("exist");
  cy.get("ul[role=listbox] > li").contains("CAD").should("exist");
});

Cypress.Commands.add("poSelectCurrency", (params: { currencyValue: string }) => {
  cy.get("ul[role=listbox] > li").contains(params.currencyValue).click().wait(500);
});

Cypress.Commands.add("poSelectTaxCheckbox", () => {
  cy.get("[name=\"tax\"]").check();
});

Cypress.Commands.add("poCheckAmount", (params: {number: string}) => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains(params.number).should("exist");
});

Cypress.Commands.add("poSelectOption", (params: {optionName: string}) => {
  cy.get("input[value=" + params.optionName + "]").click();
});

Cypress.Commands.add("poEnterServiceID", (params: {serviceId: string}) => {
  cy.get("[name=\"serviceId\"]").click().type(params.serviceId);
});

Cypress.Commands.add("poEnterDescription", (params: {description: string}) => {
  cy.get("[name=\"description\"]").click().type(params.description);
});

Cypress.Commands.add("poClickOnSpecificPOFromList", (params: {item: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
    cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.item).click();
  });
});

Cypress.Commands.add("poCheckForSpecificPOItemValue", (params: {itemValue: string}) => {
  cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.itemValue).should("exist");
});

Cypress.Commands.add("poCheckMessageForConversionSite", () => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").should("contain.text", "Exchange rate according to ");
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").should("contain.text", "fixer.io");
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").should("contain.text", "as of");
});

Cypress.Commands.add("poConvertedToDollarsMessage", () => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains("Total in US dollars:").should("exist");
});

Cypress.Commands.add("poCheckStatus", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[class=\"MuiList-root MuiList-padding\"] > div > a > div").contains(item).should("exist");
  });
});

Cypress.Commands.add("poCheckIfFormPopUpIsActive", (...list: string[]) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  list.forEach((item) => {
    cy.get("[id^=react-select]").contains(item).should("exist");
  });
  cy.get("[data-cy=field-selectType]>div:nth-child(1)").click();
});

Cypress.Commands.add("poCloseFormPopUpOnLandingPage", () => {
  cy.get("[data-cy=suggestFormCancelBtn]").click();
});

Cypress.Commands.add("poCheckForLineItemsAndTheirID", (params: {firstId: string; secondId: string}) => {
  cy.get("[class=\"MuiTableRow-root\"]").eq(1).contains(params.firstId).should("exist");
  cy.get("[class=\"MuiTableRow-root\"]").eq(2).contains(params.secondId).should("exist");
});

Cypress.Commands.add("poAMEnterLevelName", (params: {name: string}) => {
  cy.get("[name=\"name\"]").type(params.name);
});

Cypress.Commands.add("poAMEnterLimit", (params: {limit: string}) => {
  cy.get("[name=\"limit\"]").type(params.limit);
});

Cypress.Commands.add("poAMSelectUsers", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[name=\"signatures.0.employees\"]").type(item + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("poAMSelectApprover", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[id=\"approvals\"]").type(item + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("poSaveDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
    cy.get("[id=\"DocumentRevisionForm-submit\"]").click();
  });
});

Cypress.Commands.add("poAMCheckForApproval", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
    cy.get("#ApproveAndRelease-button").click();
  });
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsGreen", () => {
  cy.get("[fill=\"#B4DE5A\"]").should("exist");
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsGray", () => {
  cy.get("[fill=\"#D8D9D6\"]").should("exist");
});

Cypress.Commands.add("poAMApproveButton", () => {
  cy.get("#ApproveAndRelease-submit").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poAMCheckIfApproverHasApprovalSign", () => {
  cy.get("[id=\"approvals\"]").contains("PO Approval sig").should("exist");
});

Cypress.Commands.add("poAMCheckForAlertMessage", () => {
  cy.get("[class=\"Toastify__toast-body\"]").contains("at least one approver from group").contains("has to be selected").should("exist");
  cy.closeAllAlertMessages();
});

Cypress.Commands.add("poRejectAR", (params: {password: string}) => {
  cy.get("button[aria-label=reject]").first().click().wait(300);
  cy.get("[data-cy=\"transition.action.password\"]").click().type(params.password);
  cy.wait(300).get("[data-cy=\"passwordConfirm\"]").click();
});

Cypress.Commands.add("poVerifyStatus", (params: { status: string }) => {
  cy.get("[data-cy=\"HeaderInfo-status\"]").should("have.text", params.status);
});

Cypress.Commands.add("poAPICreatePO", (params: {
  payload: DocumentRevisionEditRequestBody;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

