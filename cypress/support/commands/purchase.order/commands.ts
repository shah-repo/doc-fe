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
      poSelectPartNumber(params: {partNo: string }): Chainable<Subject>;
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
      poCheckIfFormPopUpIsActive(params: {type: string; list: string[]}): Chainable<Subject>;
      poCloseFormPopUpOnLandingPage(): Chainable<Subject>;
      poCheckForLineItemsAndTheirID(params: {firstId: string; secondId: string}): Chainable<Subject>;
      poAMEnterLevelName(params: {name: string}): Chainable<Subject>;
      poAMEnterLimit(params: {limit: string}): Chainable<Subject>;
      poAMSelectUsers(...list: string[]): Chainable<Subject>;
      poAMCheckForApproval(): Chainable<Subject>;
      poSaveDocument(): Chainable<Subject>;
      poAMCheckApprovalIconIfItsRed(): Chainable<Subject>;
      poAMCheckApprovalIconIfItsGray(): Chainable<Subject>;
      poAMSelectApprover(...list: string[]): Chainable<Subject>;
      poAMApproveButton(): Chainable<Subject>;
      poAMCheckIfApproverHasApprovalSign(): Chainable<Subject>;
      poAMCheckForAlertMessage(): Chainable<Subject>;
      poRejectAR(params: {password: string}): Chainable<Subject>;
      poRejectARNew(params: {password: string}): Chainable<Subject>;
      poVerifyStatus(params: {status: string}): Chainable<Subject>;
      poAPICreatePO(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      poSelectPoForm(params: {nameOfPoForm: string}): Chainable<Subject>;
      poAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      poSelectPoFormFromMultiSelect(params: {poType: string; poForm?: string}): Chainable<Subject>;
      poSelectPOStatus(params: {status: string}): Chainable<Subject>;
      poCheckTax(params: {number: string}): Chainable<Subject>;
      poListVerifyFilterBySupplier(params: {supplier: string}): Chainable<Subject>;
      poSelectSupplier(params: {supplier: string}): Chainable<Subject>;
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
  cy.get("[id=FormListDialog-selectForm]").arrowClick();
  cy.get("[id^=react-select]").contains(params.nameOfPoForm).arrowClick();
});

Cypress.Commands.add("poAddApproverOnApproverList", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();

  cy.get("[data-cy^=\"fb-po-approvals\"]").arrowClick();
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("ul>li[role=option]").contains(params.approver).arrowClick();
  });

  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poAddNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").arrowClick();
});

Cypress.Commands.add("poAddPOButtonClick", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains(new RegExp("^Add$", "g")).arrowClick();
});

Cypress.Commands.add("poCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.LotQuantity], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poClickCreatePO", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").arrowClick().arrowType(params.description);
  cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
});

Cypress.Commands.add("poSelectPartNumber", (params: {partNo: string }) => {
  cy.get("[name=\"partNumber\"]").arrowClick();
  cy.get("ul[role=listbox] > li").contains(params.partNo).arrowClick();
});

Cypress.Commands.add("poEnterQuantityOrdered", (params: {quantity: string}) => {
  cy.get("[name=\"order\"]").arrowClick().arrowType(params.quantity);
});

Cypress.Commands.add("poSelectUnits", () => {
  cy.get("[name=\"units\"]").arrowClick();
  cy.get("ul > li[role=option]").contains("Each").arrowClick();
});

Cypress.Commands.add("poSelectGLCode", () => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[name=\"glCode\"]").arrowClick();
  cy.get("ul > li[role=option]").contains("code 1").arrowClick();
});

Cypress.Commands.add("poEnterSupplierPartNumber", (params: {partNumber: string}) => {
  cy.get("[name=\"supplierPartNumber\"]").arrowClick().arrowType(params.partNumber);
});

Cypress.Commands.add("poNumberOfUnits", (params: {number: string}) => {
  cy.get("[name=\"unitPrice\"]").arrowClick().arrowType(params.number);
});

Cypress.Commands.add("poAddDateRequired", () => {
  cy.xpath("//input[@name]/ ../div/button").arrowClick();
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click();
});

Cypress.Commands.add("poShippingCost", (params: {number: string}) => {
  cy.get("[name*=\"shippingCost\"]").arrowClick().arrowType("{leftarrow}{leftarrow}{leftarrow}{leftarrow}" + params.number);
});

Cypress.Commands.add("poCheckCurrency", () => {
  cy.get("[id*=\"currency\"]").arrowClick();
  cy.get("ul[role=listbox] > li").contains("USD").should("exist");
  cy.get("ul[role=listbox] > li").contains("EUR").should("exist");
  cy.get("ul[role=listbox] > li").contains("GBP").should("exist");
  cy.get("ul[role=listbox] > li").contains("AUD").should("exist");
  cy.get("ul[role=listbox] > li").contains("CAD").should("exist");
});

Cypress.Commands.add("poSelectCurrency", (params: { currencyValue: string }) => {
  cy.get("ul[role=listbox] > li").contains(params.currencyValue).arrowClick();
});

Cypress.Commands.add("poSelectTaxCheckbox", () => {
  cy.get("[name=\"tax\"]").check();
});

Cypress.Commands.add("poSelectPOStatus", (params: {status: string}) => {
  cy.get("[id$=\"po-status-built-in\"]").arrowClick();
  cy.get("ul[role=listbox]>li").contains(params.status).arrowClick();
});

Cypress.Commands.add("poCheckAmount", (params: {number: string}) => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains(params.number).should("exist");
});

Cypress.Commands.add("poCheckTax", (params: {number: string}) => {
  cy.get("[name=\"po-items-built-in.tax\"]").should("have.attr", "value", params.number);
});

Cypress.Commands.add("poSelectOption", (params: {optionName: string}) => {
  cy.get("input[value=" + params.optionName + "]").arrowClick();
});

Cypress.Commands.add("poEnterServiceID", (params: {serviceId: string}) => {
  cy.get("[name=\"serviceId\"]").arrowClick().arrowType(params.serviceId);
});

Cypress.Commands.add("poEnterDescription", (params: {description: string}) => {
  cy.get("[name=\"description\"]").arrowClick().arrowType(params.description);
});

Cypress.Commands.add("poClickOnSpecificPOFromList", (params: {item: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
    cy.get("tr.k-master-row").contains(params.item).arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poCheckForSpecificPOItemValue", (params: {itemValue: string}) => {
  cy.get("tr.k-master-row").first().contains(params.itemValue).should("exist");
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

Cypress.Commands.add("poCheckIfFormPopUpIsActive", (params: {type: string; list: string[]}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
  cy.get("[id^=\"react-select\"]").contains(params.type).arrowClick();
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
  params.list.forEach((item) => {
    cy.get("[id^=react-select]").contains(item).should("exist");
  });
  cy.get("[data-cy=field-selectType]>div:nth-child(1)").arrowClick();
});

Cypress.Commands.add("poCloseFormPopUpOnLandingPage", () => {
  cy.get("[data-cy=suggestFormCancelBtn]").arrowClick();
});

Cypress.Commands.add("poCheckForLineItemsAndTheirID", (params: {firstId: string; secondId: string}) => {
  cy.get("[data-cy=\"poItemIndex\"]").eq(0).should("have.text", params.firstId);
  cy.get("[data-cy=\"poItemIndex\"]").eq(1).should("have.text", params.secondId);
});

Cypress.Commands.add("poAMEnterLevelName", (params: {name: string}) => {
  cy.get("[name=\"name\"]").arrowType(params.name);
});

Cypress.Commands.add("poAMEnterLimit", (params: {limit: string}) => {
  cy.get("[name=\"limit\"]").arrowType(params.limit);
});

Cypress.Commands.add("poAMSelectUsers", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[name=\"signatures.0.employees\"]").arrowType(item + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("poAMSelectApprover", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[id=\"approvals\"]").arrowType(item + "{downarrow}{enter}");
  });
});

Cypress.Commands.add("poSaveDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poAMCheckForApproval", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
    cy.get("#ApproveAndRelease-button").arrowClick();
  });
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsRed", () => {
  cy.get("[class=\"MuiSvgIcon-root MuiSvgIcon-colorPrimary\"]").should("exist");
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsGray", () => {
  cy.get("[class=\"MuiSvgIcon-root MuiSvgIcon-colorDisabled\"]").should("exist");
});

Cypress.Commands.add("poAMApproveButton", () => {
  cy.get("#ApproveAndRelease-submit").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poAMCheckIfApproverHasApprovalSign", () => {
  cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
  cy.get("ul[role=\"listbox\"]>li").contains("PO Approval sig").should("exist");
});

Cypress.Commands.add("poAMCheckForAlertMessage", () => {
  cy.get("[class=\"Toastify__toast-body\"]").contains("Approvals not present").should("exist");
  cy.closeAllAlertMessages();
});

Cypress.Commands.add("poRejectAR", (params: {password: string}) => {
  cy.get("[data-cy=\"transition.action.password\"]").arrowClick().arrowType(params.password);
  cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poRejectARNew", (params: {password: string}) => {
  cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
  cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
  cy.get(`[data-cy="transition.action.password"]`).arrowClick().arrowType(params.password);
  cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
  cy.checkToastMessage({ exists: false });
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

Cypress.Commands.add("poSelectPoFormFromMultiSelect", (params: {poType: string; poForm?: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApprovers], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.poType).arrowClick();
    if (params.poForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
      cy.get("div[id^=react-select]").contains(params.poForm).arrowClick();
    }
  });
});

Cypress.Commands.add("poListVerifyFilterBySupplier", (params: {supplier: string }) => {
  cy.get(`[aria-colindex="4"] input`).arrowType(params.supplier).wait(500);
});

Cypress.Commands.add("poSelectSupplier", (params: {supplier: string }) => {
  cy.listLoadingElementShouldNotExist();

  cy.get("[data-cy^=\"po-supplier-built-in\"]").arrowType(`${params.supplier}`).wait(1000)
    .arrowType("{downarrow}{enter}");

  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

