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
      poSelectPartNumberNew(params: {partNo: string }): Chainable<Subject>;
      poVerifyPartNumber(params: {partNo: string }): Chainable<Subject>;
      poEnterQuantityOrdered(params: {quantity: string}): Chainable<Subject>;
      poCheckQuantityOrdered(params: {quantity: string}): Chainable<Subject>;
      poEnterQuantityReceipt(params: {quantity: string}): Chainable<Subject>;
      poCheckReceiptQty(params: {quantity: string}): Chainable<Subject>;
      poSelectUnits(): Chainable<Subject>;
      poCheckUnits(params: {unit: string}): Chainable<Subject>;
      poSelectGLCode(): Chainable<Subject>;
      poEnterSupplierPartNumber(params: {partNumber: string}): Chainable<Subject>;
      poEnterPartDescription(params: {partDescription: string}): Chainable<Subject>;
      poNumberOfUnits(params: {number: string}): Chainable<Subject>;
      poAddDateRequired(): Chainable<Subject>;
      poCheckDateRequired(params: {dateRequired: string}): Chainable<Subject>;
      poShippingCost(params: {number: string}): Chainable<Subject>;
      poCheckShippingCost(params: {cost: string}): Chainable<Subject>;
      poCheckCurrency(): Chainable<Subject>;
      poCheckAmount(params: {number: string}): Chainable<Subject>;
      poCheckTotalAmount(params: {number: string}): Chainable<Subject>;
      poSelectTaxCheckbox(): Chainable<Subject>;
      poSelectOption(params: {optionName: string}): Chainable<Subject>;
      poEnterServiceID(params: {serviceId: string}): Chainable<Subject>;
      poCheckServiceID(params: {serviceId: string}): Chainable<Subject>;
      poEnterDescription(params: {description: string}): Chainable<Subject>;
      poCheckDescription(params: {description: string}): Chainable<Subject>;
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
      poAMCheckApprovalIconIfItsPrimary(): Chainable<Subject>;
      poAMCheckApprovalIconIfItsDisabled(): Chainable<Subject>;
      poAMSelectApprover(...list: string[]): Chainable<Subject>;
      poAMEnterPassword(): Chainable<Subject>;
      poAMApproveButton(): Chainable<Subject>;
      poAMApproveSubmissionButton(): Chainable<Subject>;
      poAMCheckIfApproverHasApprovalSign(): Chainable<Subject>;
      poAMCheckForAlertMessage(): Chainable<Subject>;
      poRejectAR(params: {password: string}): Chainable<Subject>;
      poRejectARNew(params: {password: string}): Chainable<Subject>;
      poVerifyStatus(params: {status: string}): Chainable<Subject>;
      poAPICreatePO(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      poSelectPoForm(params: {nameOfPoForm: string}): Chainable<Subject>;
      poAddApproverOnApproverList(params: {approver: string }): Chainable<Subject>;
      poAddApproverOnApproverListWithoutApi(params: {approver: string }): Chainable<Subject>;
      poSelectPoFormFromMultiSelect(params: {poType: string; poForm?: string}): Chainable<Subject>;
      poSelectPOStatus(params: {status: string}): Chainable<Subject>;
      poCheckTax(params: {number: string}): Chainable<Subject>;
      poCheckTaxRate(params: {taxRate: string}): Chainable<Subject>;
      poListVerifyFilterBySupplier(params: {supplier: string}): Chainable<Subject>;
      poListVerifyFilterByOrderDate(params: {orderDate: string}): Chainable<Subject>;
      poSelectSupplier(params: {supplier: string}): Chainable<Subject>;
      poClickOnPending(): Chainable<Subject>;
      poApprove(): Chainable<Subject>;
      poApproveWithoutApi(): Chainable<Subject>;
      poCheckRequestor(params: {requestor: string}): Chainable<Subject>;
      poCheckOrderDate(params: {orderDate: string}): Chainable<Subject>;
      poBuildInStatus(params: {status: string}): Chainable<Subject>;
      verifyPoApprovalSignature(params: {name: string; email: string}): Chainable<Subject>;
      verifyPoApprovalDisabled(params: {name: string; email: string}): Chainable<Subject>;
    }
  }
}

export interface PurchaseOrderItem {
  index: integer;
  partNumber?: string;
  description?: string;
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
  cy.get("[data-cy^=\"fb-po-approvals\"]").scrollIntoView().arrowClick().wait(500);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
    cy.get("[data-cy^=\"fb-po-approvals\"]").autocompleteSelect(params.approver).wait(500);
  });
  cy.unClick();

  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poAddApproverOnApproverListWithoutApi", (params: { approver: string; waitAggregatedAudit?: boolean }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy^=\"fb-po-approvals\"]").scrollIntoView().arrowClick().wait(500);
  cy.get("[data-cy^=\"fb-po-approvals\"]").autocompleteSelect(params.approver).wait(500);
  cy.unClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poAddNewFieldItem", () => {
  cy.get("button[data-cy=\"fb-control-btn\"]").contains("ADD LINE ITEM").arrowClick({ force: true });
  cy.wait(500);
});

Cypress.Commands.add("poAddPOButtonClick", () => {
  cy.get("button[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).arrowClick();
});

Cypress.Commands.add("poCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.LotQuantity], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("verifyPoApprovalSignature", (params) => {
  cy.get(`[data-cy*="fb-po-approvals-"]`).parent().parent().should("contain", `${params.name} - ${params.email}`);
  cy.poClickOnPending();
  cy.contains("PO Approval sig");
  cy.get(`[data-cy="user-name-0-DRAFT"]`).contains(params.name);
  cy.get(`[data-cy="user-email-0-DRAFT"]`).contains(params.email);
  cy.get("[name*='fb-po-approvals-']>div").eq(4).contains("Pending Approval");
});

Cypress.Commands.add("verifyPoApprovalDisabled", (params) => {
  cy.get(`input[data-cy^="fb-po-approvals"]`).parent().should("contain", `${params.name} - ${params.email}`);
  cy.get(`input[data-cy^="fb-po-approvals"]`).parent()
    .find(`[class="MuiChip-root MuiAutocomplete-tag Mui-disabled MuiChip-deletable"]`).should("exist");
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
  cy.get("[name=\"partNumber\"]").arrowClick({ force: true });
  cy.get("ul>li[role=option]").contains(params.partNo).arrowClick({ force: true });
});

Cypress.Commands.add("poSelectPartNumberNew", (params: {partNo: string }) => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[data-cy=\"partNumber\"]").click({ force: true }).focused().autocompleteSelect(params.partNo);
  cy.unClick();
});

Cypress.Commands.add("poVerifyPartNumber", (params: {partNo: string }) => {
  cy.get(`[data-cy="supplierPartNumber"]`).contains(params.partNo);
});

Cypress.Commands.add("poEnterQuantityOrdered", (params: {quantity: string}) => {
  cy.get("[name=\"order\"]").arrowClick().arrowType(params.quantity);
});

Cypress.Commands.add("poCheckQuantityOrdered", (params: {quantity: string}) => {
  cy.get(`[data-cy="order"]`).contains(params.quantity);
});

Cypress.Commands.add("poEnterQuantityReceipt", (params: {quantity: string}) => {
  cy.get("[name=\"received\"]").arrowClick().arrowType(params.quantity);
});

Cypress.Commands.add("poCheckReceiptQty", (params: {quantity: string}) => {
  cy.get(`[data-cy="received"]`).contains(params.quantity);
});

Cypress.Commands.add("poSelectUnits", () => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[name=\"units\"]").click().focused().autocompleteSelect("Each");
  cy.unClick();
});

Cypress.Commands.add("poCheckUnits", (params: {unit: string}) => {
  cy.get(`[data-cy="units"]`).contains(params.unit);
});

Cypress.Commands.add("poSelectGLCode", () => {
  cy.listLoadingElementShouldNotExist();
  cy.get("[name=\"glCode\"]").click().focused().autocompleteSelect("code 1");
  cy.unClick();
});

Cypress.Commands.add("poEnterSupplierPartNumber", (params: {partNumber: string}) => {
  cy.get("[name=\"supplierPartNumber\"]").arrowClick().arrowType(params.partNumber);
  cy.unClick();
});

Cypress.Commands.add("poEnterPartDescription", (params: {partDescription: string}) => {
  cy.get("[name=\"partNumberTitle\"]").arrowClick().arrowType(params.partDescription);
});

Cypress.Commands.add("poNumberOfUnits", (params: {number: string}) => {
  cy.get(`[name="unitPrice"]`).arrowClick({ force: true }).wait(500);
  cy.get(`[name="unitPrice"]`).arrowType(params.number);
});

Cypress.Commands.add("poAddDateRequired", () => {
  cy.xpath("//input[@name]/ ../div/button").arrowClick({ force: true });
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click();
});

Cypress.Commands.add("poCheckDateRequired", (params: { dateRequired: string }) => {
  cy.get("[data-cy='formattedDate']>span").contains(params.dateRequired);
});

Cypress.Commands.add("poShippingCost", (params: {number: string}) => {
  cy.get(`[name="po-items-built-in.shippingCost"]`).arrowClick({ force: true }).wait(1000);
  cy.get(`[name*="po-items-built-in.shippingCost"]`).arrowType("{leftarrow}{leftarrow}{leftarrow}" + params.number);
  cy.unClick();
});

Cypress.Commands.add("poCheckShippingCost", (params: {cost: string}) => {
  cy.get(`[name*="shippingCost"]`).contains(params.cost);
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
  cy.unClick();
});

Cypress.Commands.add("poSelectTaxCheckbox", () => {
  cy.get("[name=\"tax\"]").check();
});

Cypress.Commands.add("poSelectPOStatus", (params: {status: string}) => {
  cy.get("[id$=\"po-status-built-in\"]").arrowClick({ force: true });
  cy.get("ul>li[role=option]").contains(params.status).arrowClick({ force: true });
});

Cypress.Commands.add("poCheckAmount", (params: {number: string}) => {
  cy.get("[class*=\"MuiTableCell-root MuiTableCell-body FBTotal-root\"]").contains(params.number).should("exist");
});

Cypress.Commands.add("poCheckTotalAmount", (params: {number: string}) => {
  cy.get(`[data-cy="poTotal"]`).contains(params.number).should("exist");
});

Cypress.Commands.add("poCheckTaxRate", (params: {taxRate: string}) => {
  cy.get(`[name="po-items-built-in.taxRate"]`).should("have.text", params.taxRate);
});

Cypress.Commands.add("poCheckTax", (params: {number: string}) => {
  cy.get(`[name="po-items-built-in.tax"]`).should("have.value", params.number);
});

Cypress.Commands.add("poSelectOption", (params: {optionName: string}) => {
  cy.get("input[value=" + params.optionName + "]").arrowClick({ force: true });
});

Cypress.Commands.add("poEnterServiceID", (params: {serviceId: string}) => {
  cy.get("[name=\"serviceId\"]").arrowClick().arrowType(params.serviceId);
});

Cypress.Commands.add("poCheckServiceID", (params: {serviceId: string}) => {
  cy.get(`[data-cy="serviceId"]`).contains(params.serviceId);
});

Cypress.Commands.add("poEnterDescription", (params: {description: string}) => {
  cy.get("[name=\"description\"]").arrowClick().arrowType(params.description);
});

Cypress.Commands.add("poCheckDescription", (params: {description: string}) => {
  cy.get(`[data-cy="description"]`).contains(params.description);
});

Cypress.Commands.add("poClickOnSpecificPOFromList", (params: {item: string}) => {
  cy.get("tr.k-master-row").contains(params.item).arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poCheckForSpecificPOItemValue", (params: {itemValue: string}) => {
  cy.get("tr.k-master-row").first().contains(params.itemValue).should("exist");
});

Cypress.Commands.add("poCheckMessageForConversionSite", () => {
  cy.get("[name=\"po-items-built-in\"]").contains("Exchange rate according to ").should("exist");
  cy.get("[name=\"po-items-built-in\"]").contains("fixer.io").should("exist");
  cy.get("[name=\"po-items-built-in\"]").contains("as of").should("exist");
});

Cypress.Commands.add("poConvertedToDollarsMessage", () => {
  cy.get("[name=\"po-items-built-in\"]").contains("Total in US dollars:").should("exist");
});

Cypress.Commands.add("poCheckStatus", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"HeaderInfo\"]").contains(item).should("exist");
  });
});

Cypress.Commands.add("poCheckIfFormPopUpIsActive", (params: {type: string; list: string[]}) => {
  cy.get("[data-cy=\"field-selectType\"]").arrowClick();
  cy.get("[id^=\"react-select\"]").contains(params.type).arrowClick();
  cy.get("[data-cy=\"field-selectForm\"]").arrowClick();
  params.list.forEach((item) => {
    cy.get("[id^=react-select]").contains(item).should("exist");
  });
});

Cypress.Commands.add("poCloseFormPopUpOnLandingPage", () => {
  cy.get("[data-cy=suggestFormCancelBtn]").arrowClick();
});

Cypress.Commands.add("poCheckForLineItemsAndTheirID", (params: {firstId: string; secondId: string}) => {
  cy.get("[data-cy=\"poItemIndex\"]").eq(0).should("have.text", params.firstId);
  cy.get("[data-cy=\"poItemIndex\"]").eq(1).should("have.text", params.secondId);
});

Cypress.Commands.add("poAMEnterLevelName", (params: {name: string}) => {
  cy.get("[name=\"name\"]").clear().arrowType(params.name);
});

Cypress.Commands.add("poAMEnterLimit", (params: {limit: string}) => {
  cy.get("[name=\"limit\"]").clear().arrowType(params.limit);
});

Cypress.Commands.add("poAMSelectUsers", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[name=\"signatures.0.employees\"]").autocompleteSelect(item);
  });
});

Cypress.Commands.add("poAMSelectApprover", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[id=\"approvals\"]").autocompleteSelect(item);
  });
});

Cypress.Commands.add("poAMEnterPassword", () => {
  cy.get(`input[name="password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
});

Cypress.Commands.add("poSaveDocument", () => {
  cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poAMCheckForApproval", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetRequiredApprovers, () => {
    cy.get("#ApproveAndRelease-button").arrowClick();
  });
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsPrimary", () => {
  cy.get(`[data-cy="check-circle-primary"]`).should("exist");
});

Cypress.Commands.add("poAMCheckApprovalIconIfItsDisabled", () => {
  cy.get(`[data-cy="check-circle-disabled"]`).should("exist");
});

Cypress.Commands.add("poAMApproveButton", () => {
  cy.get("#ApproveAndRelease-submit").arrowClick();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("poAMApproveSubmissionButton", () => {
  cy.get(`[data-cy="transition-approve"]`).arrowClick();
});

Cypress.Commands.add("poAMCheckIfApproverHasApprovalSign", () => {
  cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
  cy.get("ul>li[role=option]").contains("PO Approval sig").should("exist");
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
  cy.get("div[data-cy=\"HeaderInfo-status\"]>span").should("contain", params.status);
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
    CyRoutes.DocPreview], () => {
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

Cypress.Commands.add("poListVerifyFilterByOrderDate", (params: {orderDate: string }) => {
  cy.get(`[aria-colindex="9"] input`).arrowType(params.orderDate).wait(500);
});

Cypress.Commands.add("poSelectSupplier", (params: {supplier: string }) => {
  cy.listLoadingElementShouldNotExist();

  cy.get("[data-cy^=\"po-supplier-built-in\"]").autocompleteSelect(`${params.supplier}`);

  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("poClickOnPending", () => {
  cy.get(`[data-cy="approval-block-common.pending"]`).arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poApprove", () => {
  cy.get("[data-cy=\"form.builder.request.approve\"]").arrowClick();
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
    cy.get("[data-cy=\"common.confirm\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poApproveWithoutApi", () => {
  cy.poClickOnPending();
  cy.get("[data-cy=\"form.builder.request.approve\"]").scrollIntoView();
  cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick({ force: true });
  cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
  cy.unClick();
  cy.get("[data-cy=\"common.confirm\"]").arrowClick();
  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("poCheckRequestor", (params: {requestor: string }) => {
  cy.get("[data-cy^='po-requestor-']").should("have.value", params.requestor);
});

Cypress.Commands.add("poCheckOrderDate", (params: {orderDate: string }) => {
  cy.get("[name^='ordered-']").should("have.value", params.orderDate);
});

Cypress.Commands.add("poBuildInStatus", (params: {status: string }) => {
  cy.get("#mui-component-select-po-status-built-in").should("have.text", params.status);
});
