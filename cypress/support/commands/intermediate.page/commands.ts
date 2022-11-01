
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      intPageVerifyTitleExist(): Chainable<Subject>;
      intPageVerifyTitleNotExist(): Chainable<Subject>;
      intPageVerifyDescriptionExist(): Chainable<Subject>;
      intPageVerifyDescriptionNotExist(): Chainable<Subject>;
      intPageVerifyDescriptionViewMoreExist(): Chainable<Subject>;
      intPageVerifyDescriptionViewMoreNotExist(): Chainable<Subject>;
      intPageVerifyDocTypeExist(): Chainable<Subject>;
      intPageVerifyDocIdIsEditable(): Chainable<Subject>;
      intPageVerifyDocIdIsNotEditable(): Chainable<Subject>;
      intPageVerifyRevisionStageExist(): Chainable<Subject>;
      intPageVerifyTrainingRequiredExist(): Chainable<Subject>;
      intPageVerifySelectedUsersExist(): Chainable<Subject>;
      intPageVerifySelectedGroupsExist(): Chainable<Subject>;

      intPageVerifyAttachmentExist(): Chainable<Subject>;
      intPageVerifyAttachmentNotExist(): Chainable<Subject>;
      intPageVerifyOutputDocTypeExist(): Chainable<Subject>;
      intPageVerifyOutputDocTypeNotExist(): Chainable<Subject>;
      intPageClickPreviewLayout(): Chainable<Subject>;
      intPageClosePreviewDialog(): Chainable<Subject>;
      intPageVerifyPreviewLayoutButtonNotExist(): Chainable<Subject>;
      intPageVerifyPreviewLayoutButtonDisabled(): Chainable<Subject>;
      intPageVerifyPreviewLayoutButtonEnabled(): Chainable<Subject>;
      intPageVerifyApprovalRequestDetailsExist(): Chainable<Subject>;
      intPageVerifyApprovalRequestDetailsNotExist(): Chainable<Subject>;
      intPageVerifyApproversExist(): Chainable<Subject>;
      intPageVerifyApproversNotExist(): Chainable<Subject>;
      intPageVerifyApprovalsExist(): Chainable<Subject>;
      intPageVerifyNewApprovalsExist(): Chainable<Subject>;
      intPageVerifyApprovalsNotExist(): Chainable<Subject>;
      intPageVerifyAddDocumentExist(): Chainable<Subject>;
      intPageVerifyAddDocumentExistDisabled(): Chainable<Subject>;
      intPageVerifyAddDocumentNotExist(): Chainable<Subject>;
      intPageVerifyAddFieldExist(): Chainable<Subject>;
      intPageVerifyAddFieldNotExist(): Chainable<Subject>;
      intPageVerifyFormOptionsExist(): Chainable<Subject>;
      intPageVerifyFormOptionsNotExist(): Chainable<Subject>;
      intPageVerifyInitialQuantityExist(): Chainable<Subject>;
      intPageVerifyInitialQuantityNotExist(): Chainable<Subject>;
      intPageVerifyUsableQuantityExist(): Chainable<Subject>;
      intPageVerifyUsableQuantityNotExist(): Chainable<Subject>;
      intPageVerifyExpirationDateExist(): Chainable<Subject>;
      intPageVerifyExpirationDateNotExist(): Chainable<Subject>;
      intPageVerifyPartSelectionExist(): Chainable<Subject>;
      intPageVerifyPartSelectionNotExist(): Chainable<Subject>;
      intPageVerifyInspectionOverrideExist(): Chainable<Subject>;
      intPageVerifyInspectionOverrideNotExist(): Chainable<Subject>;
      intPageVerifyApprovalMatrixExist(): Chainable<Subject>;
      intPageVerifyApprovalMatrixNotExist(): Chainable<Subject>;
      intPageVerifyApprovalRolesExist(): Chainable<Subject>;
      intPageVerifyApprovalRolesNotExist(): Chainable<Subject>;
      intPageVerifyEqStatusExist(): Chainable<Subject>;
      intPageVerifyEqStatusNotExist(): Chainable<Subject>;
      intPageVerifyPrimaryOwnerExist(): Chainable<Subject>;
      intPageVerifyPrimaryOwnerNotExist(): Chainable<Subject>;
      intPageVerifyCoordinatorExist(): Chainable<Subject>;
      intPageVerifyCoordinatorNotExist(): Chainable<Subject>;
      intPageVerifyMaintenanceDetailsExist(): Chainable<Subject>;
      intPageVerifyMaintenanceDetailsNotExist(): Chainable<Subject>;
      intPageVerifyEquipmentExist(): Chainable<Subject>;
      intPageVerifyEquipmentNotExist(): Chainable<Subject>;
      intPageVerifyMaintainerExist(): Chainable<Subject>;
      intPageVerifyMaintainerNotExist(): Chainable<Subject>;
      intPageVerifyCompletionDateExist(): Chainable<Subject>;
      intPageVerifyCompletionDateNotExist(): Chainable<Subject>;
      intPageVerifyCompanyDetailsExist(): Chainable<Subject>;
      intPageVerifyCompanyDetailsNotExist(): Chainable<Subject>;
      intPageVerifyCompanyNameExist(): Chainable<Subject>;
      intPageVerifyCompanyNameNotExist(): Chainable<Subject>;
      intPageVerifyCompanyAbbreviationExist(): Chainable<Subject>;
      intPageVerifyCompanyAbbreviationNotExist(): Chainable<Subject>;
      intPageVerifyCompanyAdminEmailExist(): Chainable<Subject>;
      intPageVerifyCompanyAdminEmailNotExist(): Chainable<Subject>;
      intPageVerifyClientLogoExist(): Chainable<Subject>;
      intPageVerifyClientLogoNotExist(): Chainable<Subject>;
      intPageVerifyApprovedDamJsonExist(): Chainable<Subject>;
      intPageVerifyApprovedDamJsonNotExist(): Chainable<Subject>;
      intPageVerifyApprovedDamJsonIsUsedExist(): Chainable<Subject>;
      intPageVerifyApprovedDamJsonIsUsedNotExist(): Chainable<Subject>;
      intPageVerifyDamJsonExist(): Chainable<Subject>;
      intPageVerifyDamJsonNotExist(): Chainable<Subject>;
      intPageVerifyApprovedPageDetailsJsonExist(): Chainable<Subject>;
      intPageVerifyApprovedPageDetailsJsonNotExist(): Chainable<Subject>;
      intPageVerifyApprovedPageDetailsJsonIsUsedExist(): Chainable<Subject>;
      intPageVerifyApprovedPageDetailsJsonIsUsedNotExist(): Chainable<Subject>;
      intPageVerifyPageDetailsJsonExist(): Chainable<Subject>;
      intPageVerifyPageDetailsJsonNotExist(): Chainable<Subject>;
      intPageVerifyApprovedNavigationJsonIsUsedExist(): Chainable<Subject>;
      intPageVerifyApprovedNavigationJsonIsUsedNotExist(): Chainable<Subject>;
      intPageVerifyNavigationJsonExist(): Chainable<Subject>;
      intPageVerifyNavigationJsonNotExist(): Chainable<Subject>;
      intPageVerifyLaunchingDetailsExist(): Chainable<Subject>;
      intPageVerifyLaunchingDetailsNotExist(): Chainable<Subject>;
      intPageVerifyScheduledGoLiveDateExist(): Chainable<Subject>;
      intPageVerifyScheduledGoLiveDateNotExist(): Chainable<Subject>;
      intPageVerifyEmployeesTemplateListExist(): Chainable<Subject>;
      intPageVerifyEmployeesTemplateListNotExist(): Chainable<Subject>;
      intPageVerifyUsersListExist(): Chainable<Subject>;
      intPageVerifyUsersListNotExist(): Chainable<Subject>;
      intPageVerifySeedDocumentsToBeIncludedExist(): Chainable<Subject>;
      intPageVerifySeedDocumentsToBeIncludedNotExist(): Chainable<Subject>;
      intPageVerifyPostCreationRecordsExist(): Chainable<Subject>;
      intPageVerifyPostCreationRecordsNotExist(): Chainable<Subject>;
      intPageVerifyLogsCreatedExist(): Chainable<Subject>;
      intPageVerifyLogsCreatedNotExist(): Chainable<Subject>;
      intPageVerifyPurchaseOrderApprovalMatrixExist(): Chainable<Subject>;
      intPageVerifyPurchaseOrderApprovalMatrixNotExist(): Chainable<Subject>;
      intPageVerifyPiProcedureExist(): Chainable<Subject>;
      intPageVerifyPiProcedureNotExist(): Chainable<Subject>;
      intPageVerifyStartQuantityExist(): Chainable<Subject>;
      intPageVerifyStartQuantityNotExist(): Chainable<Subject>;
      intPageVerifyAcceptedQuantityExist(): Chainable<Subject>;
      intPageVerifyAcceptedQuantityNotExist(): Chainable<Subject>;
      intPageVerifyRejectedQuantityExist(): Chainable<Subject>;
      intPageVerifyRejectedQuantityNotExist(): Chainable<Subject>;
      intPageVerifyEndQuantityExist(): Chainable<Subject>;
      intPageVerifyEndQuantityNotExist(): Chainable<Subject>;
      intPageVerifyPartToBeManufacturedExist(): Chainable<Subject>;
      intPageVerifyPartToBeManufacturedNotExist(): Chainable<Subject>;
      intPageVerifyBuildTypeExist(): Chainable<Subject>;
      intPageVerifyBuildTypeNotExist(): Chainable<Subject>;
      intPageVerifyDueDateExist(): Chainable<Subject>;
      intPageVerifyDueDateNotExist(): Chainable<Subject>;
      intPageVerifyLHRStepExist(): Chainable<Subject>;
      intPageVerifyLHRStepNotExist(): Chainable<Subject>;
      intPageVerifyPoStatusExist(): Chainable<Subject>;
      intPageVerifyPoStatusNotExist(): Chainable<Subject>;
      intPageVerifyRequestorExist(): Chainable<Subject>;
      intPageVerifyRequestorNotExist(): Chainable<Subject>;
      intPageVerifySupplierExist(): Chainable<Subject>;
      intPageVerifySupplierNotExist(): Chainable<Subject>;
      intPageVerifyOrderDateExist(): Chainable<Subject>;
      intPageVerifyOrderDateNotExist(): Chainable<Subject>;
      intPageVerifyPoTableExist(): Chainable<Subject>;
      intPageVerifyPoTableNotExist(): Chainable<Subject>;
      intPageVerifyPeriodicTraningExist(): Chainable<Subject>;
      intPageVerifyPeriodicTraningNotExist(): Chainable<Subject>;
      intPageVerifyDocumentsToBeTrainedOnExist(): Chainable<Subject>;
      intPageVerifyDocumentsToBeTrainedOnNotExist(): Chainable<Subject>;
      intPageVerifyTrainingFrequencyExist(): Chainable<Subject>;
      intPageVerifyTrainingFrequencyNotExist(): Chainable<Subject>;
      intPageVerifyTraineesDetailsExist(): Chainable<Subject>;
      intPageVerifyTraineesDetailsNotExist(): Chainable<Subject>;
      intPageVerifyGroupsToTrainExist(): Chainable<Subject>;
      intPageVerifyGroupsToTrainNotExist(): Chainable<Subject>;
      intPageVerifyUsersToTrainExist(): Chainable<Subject>;
      intPageVerifyUsersToTrainNotExist(): Chainable<Subject>;
      intPageVerifyDocumentTitleExist(): Chainable<Subject>;
      intPageVerifyDocumentTitleNotExist(): Chainable<Subject>;
      intPageVerifyDocumentDescriptionExist(): Chainable<Subject>;
      intPageVerifyDocumentDescriptionNotExist(): Chainable<Subject>;
      intPageVerifyTypeOfDocumentToBeCreatedExist(): Chainable<Subject>;
      intPageVerifyTypeOfDocumentToBeCreatedNotExist(): Chainable<Subject>;
      intPageVerifyDocumentTypeToBeSelectedExist(): Chainable<Subject>;
      intPageVerifyDocumentTypeToBeSelectedNotExist(): Chainable<Subject>;
      intPageVerifyJsonFormExist(): Chainable<Subject>;
      intPageVerifyJsonFormNotExist(): Chainable<Subject>;
      intPageVerifyDefineTheOutputOfThatFormExist(): Chainable<Subject>;
      intPageVerifyDefineTheOutputOfThatFormNotExist(): Chainable<Subject>;
      intPageVerifyDefaultRevisionStageExist(): Chainable<Subject>;
      intPageVerifyDefaultRevisionStageNotExist(): Chainable<Subject>;
      intPageVerifySeedTrainingRequiredExist(): Chainable<Subject>;
      intPageVerifySeedTrainingRequiredNotExist(): Chainable<Subject>;
      intPageVerifyAttachmentsToBeIncludedExist(): Chainable<Subject>;
      intPageVerifyAttachmentsToBeIncludedNotExist(): Chainable<Subject>;
      intPageVerifyMakeVsBuyExist(): Chainable<Subject>;
      intPageVerifyMakeVsBuyNotExist(): Chainable<Subject>;
      intPageVerifyPrimarySupplierExist(): Chainable<Subject>;
      intPageVerifyPrimarySupplierNotExist(): Chainable<Subject>;
      intPageVerifyOtherSuppliersExist(): Chainable<Subject>;
      intPageVerifyOtherSuppliersNotExist(): Chainable<Subject>;
      intPageVerifyUnitOfMeasureExist(): Chainable<Subject>;
      intPageVerifyUnitOfMeasureNotExist(): Chainable<Subject>;
      intPageVerifyTraceabilityRequiredExist(): Chainable<Subject>;
      intPageVerifyTraceabilityRequiredNotExist(): Chainable<Subject>;
      intPageVerifySerializedExist(): Chainable<Subject>;
      intPageVerifySerializedNotExist(): Chainable<Subject>;
      intPageVerifySelectSerializationExist(): Chainable<Subject>;
      intPageVerifySelectSerializationNotExist(): Chainable<Subject>;
      intPageVerifyIqcRequiredExist(): Chainable<Subject>;
      intPageVerifyIqcRequiredNotExist(): Chainable<Subject>;
      intPageVerifyLimitedShelfLifeExist(): Chainable<Subject>;
      intPageVerifyLimitedShelfLifeNotExist(): Chainable<Subject>;
      intPageVerifyFaiRequiredExist(): Chainable<Subject>;
      intPageVerifyFaiRequiredNotExist(): Chainable<Subject>;
      intPageVerifySelectFormDocumentForImportExist(): Chainable<Subject>;
      intPageVerifySelectFormDocumentForImportNotExist(): Chainable<Subject>;
      intPageVerifyColumnDocumentRecordIdExist(): Chainable<Subject>;
      intPageVerifyColumnDocumentRecordIdNotExist(): Chainable<Subject>;
      intPageVerifySelectOutputDocumentTypeExist(): Chainable<Subject>;
      intPageVerifySelectOutputDocumentTypeNotExist(): Chainable<Subject>;
      intPageVerifyDownloadExcelTemplateExist(): Chainable<Subject>;
      intPageVerifyDownloadExcelTemplateExistDisabled(): Chainable<Subject>;
      intPageVerifyDownloadExcelTemplateNotExist(): Chainable<Subject>;

      intPageVerifyChangeDetailsTabExist(): Chainable<Subject>;
      intPageVerifyDocumentsTabExist(): Chainable<Subject>;
      intPageVerifyOverviewTabExist(): Chainable<Subject>;
      intPageVerifyDetailsTabExist(): Chainable<Subject>;
      intPageVerifyMatrixDetailsTabExist(): Chainable<Subject>;
      intPageVerifyApprovalRolesTabExist(): Chainable<Subject>;
      intPageVerifyProcedureTabExist(): Chainable<Subject>;
      intPageVerifyMaterialsAndEquipmentTabExist(): Chainable<Subject>;
      intPageVerifySpecificationTabExist(): Chainable<Subject>;
      intPageVerifyCalPmHistoryTabExist(): Chainable<Subject>;
      intPageVerifyTrainingTabExist(): Chainable<Subject>;
      intPageVerifyLineItemsTabExist(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("intPageVerifyTitleExist", () => {
  cy.get(`[data-cy="field-name"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTitleNotExist", () => {
  cy.get(`[data-cy="field-name"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDescriptionExist", () => {
  cy.get(`[data-cy="description"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDescriptionNotExist", () => {
  cy.get(`[data-cy="description"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDescriptionViewMoreExist", () => {
  cy.get(`[data-cy="description"] button`).should("exist");
});

Cypress.Commands.add("intPageVerifyDescriptionViewMoreNotExist", () => {
  cy.get(`[data-cy="description"] button`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDocTypeExist", () => {
  cy.get(`[data-cy="field-document.documentType.id"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocIdIsEditable", () => {
  cy.get(`input[id="document.docId"]`).should("not.be.disabled");
});

Cypress.Commands.add("intPageVerifyDocIdIsNotEditable", () => {
  cy.get(`input[id="document.docId"]`).should("be.disabled");
});

Cypress.Commands.add("intPageVerifyRevisionStageExist", () => {
  cy.get(`[data-cy="field-revisionStage"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTrainingRequiredExist", () => {
  cy.get(`[data-cy="field-retrain"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySelectedUsersExist", () => {
  cy.get(`[data-cy="field-securityEmployees"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySelectedGroupsExist", () => {
  cy.get(`[data-cy="field-securityGroups"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyAttachmentExist", () => {
  cy.get("#AttachmentFieldPresenter-linkButton").should("exist");
});

Cypress.Commands.add("intPageVerifyAttachmentNotExist", () => {
  cy.get("#AttachmentFieldPresenter-linkButton").should("not.exist");
});

Cypress.Commands.add("intPageVerifyOutputDocTypeExist", () => {
  cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyOutputDocTypeNotExist", () => {
  cy.get(`[data-cy="field-outputDocumentTypes"]`).should("not.exist");
});

Cypress.Commands.add("intPageClickPreviewLayout", () => {
  cy.contains("Preview Layout").arrowClick();
});

Cypress.Commands.add("intPageClosePreviewDialog", () => {
  cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
});

Cypress.Commands.add("intPageVerifyPreviewLayoutButtonNotExist", () => {
  cy.contains("button", "Preview Layout").should("not.exist");
});

Cypress.Commands.add("intPageVerifyPreviewLayoutButtonDisabled", () => {
  cy.contains("button", "Preview Layout").should("be.disabled")
    .should("have.css", "background-color", "rgb(162, 162, 162)");
});

Cypress.Commands.add("intPageVerifyPreviewLayoutButtonEnabled", () => {
  cy.contains("button", "Preview Layout").should("be.enabled")
    .should("have.css", "background-color", "rgb(1, 31, 187)");
});

Cypress.Commands.add("intPageVerifyApprovalRequestDetailsExist", () => {
  cy.get(`[data-cy="Approval Request Details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovalRequestDetailsNotExist", () => {
  cy.get(`[data-cy="Approval Request Details"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApproversExist", () => {
  cy.get(`[data-cy="form.builder.approvers"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApproversNotExist", () => {
  cy.get(`[data-cy="form.builder.approvers"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovalsExist", () => {
  cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyNewApprovalsExist", () => {
  cy.get(`[data-cy="Approvals"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovalsNotExist", () => {
  cy.get(`[data-cy="form.builder.approvals"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyAddDocumentExist", () => {
  cy.get(`[data-cy="fb.add.document"]`).should("exist").should("not.be.disabled");
});

Cypress.Commands.add("intPageVerifyAddDocumentExistDisabled", () => {
  cy.get(`[data-cy="fb.add.document"]`).should("exist").should("be.disabled");
});

Cypress.Commands.add("intPageVerifyAddDocumentNotExist", () => {
  cy.get(`[data-cy="fb.add.document"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyAddFieldExist", () => {
  cy.get(`button[data-cy="form.builder.add.field"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyAddFieldNotExist", () => {
  cy.get(`button[data-cy="form.builder.add.field"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyFormOptionsExist", () => {
  cy.get(`button[data-cy="FBWorkspace-clickView"]`).should("exist").should("be.enabled")
    .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
  cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).should("exist")
    .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
  cy.get(`[data-cy="FBWorkspace-importTemplate"]`).should("exist")
    .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
});

Cypress.Commands.add("intPageVerifyFormOptionsNotExist", () => {
  cy.get(`button[data-cy="FBWorkspace-clickView"]`).should("not.exist");
  cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).should("not.exist");
  cy.get(`[data-cy="FBWorkspace-importTemplate"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyInitialQuantityExist", () => {
  cy.get(`[data-cy="Initial Quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyInitialQuantityNotExist", () => {
  cy.get(`[data-cy="Initial Quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyUsableQuantityExist", () => {
  cy.get(`[data-cy="Usable Quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyUsableQuantityNotExist", () => {
  cy.get(`[data-cy="Usable Quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyExpirationDateExist", () => {
  cy.get(`[data-cy="Expiration Date"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyExpirationDateNotExist", () => {
  cy.get(`[data-cy="Expiration Date"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPartSelectionExist", () => {
  cy.get(`[data-cy="Part Selection"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPartSelectionNotExist", () => {
  cy.get(`[data-cy="Part Selection"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyInspectionOverrideExist", () => {
  cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyInspectionOverrideNotExist", () => {
  cy.get(`[data-cy="100% Inspection Override"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovalMatrixExist", () => {
  cy.get(`[data-cy="form.builder.approvalMatrix"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovalMatrixNotExist", () => {
  cy.get(`[data-cy="form.builder.approvalMatrix"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovalRolesExist", () => {
  cy.get(`[data-cy="form.builder.approval.roles"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovalRolesNotExist", () => {
  cy.get(`[data-cy="form.builder.approval.roles"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyEqStatusExist", () => {
  cy.get(`[data-cy="EQ Status"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyEqStatusNotExist", () => {
  cy.get(`[data-cy="EQ Status"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPrimaryOwnerExist", () => {
  cy.get(`[data-cy="Primary Owner"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPrimaryOwnerNotExist", () => {
  cy.get(`[data-cy="Primary Owner"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCoordinatorExist", () => {
  cy.get(`[data-cy="Coordinator"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCoordinatorNotExist", () => {
  cy.get(`[data-cy="Coordinator"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyMaintenanceDetailsExist", () => {
  cy.get(`[data-cy="Maintenance Details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyMaintenanceDetailsNotExist", () => {
  cy.get(`[data-cy="Maintenance Details"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyEquipmentExist", () => {
  cy.get(`[data-cy="Equipment"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyEquipmentNotExist", () => {
  cy.get(`[data-cy="Equipment"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyMaintainerExist", () => {
  cy.get(`[data-cy="Maintainer"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyMaintainerNotExist", () => {
  cy.get(`[data-cy="Maintainer"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCompletionDateExist", () => {
  cy.get(`[data-cy="Completion Date"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCompletionDateNotExist", () => {
  cy.get(`[data-cy="Completion Date"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCompanyDetailsExist", () => {
  cy.get(`[data-cy="Company Details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCompanyDetailsNotExist", () => {
  cy.get(`[data-cy="Company Details"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCompanyNameExist", () => {
  cy.get(`[data-cy="Company Name"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCompanyNameNotExist", () => {
  cy.get(`[data-cy="Company Name"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCompanyAbbreviationExist", () => {
  cy.get(`[data-cy="Company Abbreviation"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCompanyAbbreviationNotExist", () => {
  cy.get(`[data-cy="Company Abbreviation"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyCompanyAdminEmailExist", () => {
  cy.get(`[data-cy="Company Admin Email"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCompanyAdminEmailNotExist", () => {
  cy.get(`[data-cy="Company Admin Email"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyClientLogoExist", () => {
  cy.get(`[data-cy="Client's Logo (max 180px x 75px)"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyClientLogoNotExist", () => {
  cy.get(`[data-cy="Client's Logo (max 180px x 75px)"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovedDamJsonExist", () => {
  cy.get(`[data-cy="APPROVED DAM JSON"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovedDamJsonNotExist", () => {
  cy.get(`[data-cy="APPROVED DAM JSON"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovedDamJsonIsUsedExist", () => {
  cy.get(`[data-cy="Approved DAM json is used"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovedDamJsonIsUsedNotExist", () => {
  cy.get(`[data-cy="Approved DAM json is used"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDamJsonExist", () => {
  cy.get(`[data-cy="DAM JSON "]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDamJsonNotExist", () => {
  cy.get(`[data-cy="DAM JSON "]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovedPageDetailsJsonExist", () => {
  cy.get(`[data-cy="APPROVED PAGE DETAILS JSON"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovedPageDetailsJsonNotExist", () => {
  cy.get(`[data-cy="APPROVED PAGE DETAILS JSON"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovedPageDetailsJsonIsUsedExist", () => {
  cy.get(`[data-cy="Approved Page Details json is used"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovedPageDetailsJsonIsUsedNotExist", () => {
  cy.get(`[data-cy="Approved Page Details json is used"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPageDetailsJsonExist", () => {
  cy.get(`[data-cy="Page Details JSON"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPageDetailsJsonNotExist", () => {
  cy.get(`[data-cy="Page Details JSON"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyApprovedNavigationJsonIsUsedExist", () => {
  cy.get(`[data-cy="Approved Navigation json is used"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovedNavigationJsonIsUsedNotExist", () => {
  cy.get(`[data-cy="Approved Navigation json is used"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyNavigationJsonExist", () => {
  cy.get(`[data-cy="Navigation JSON"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyNavigationJsonNotExist", () => {
  cy.get(`[data-cy="Navigation JSON"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyLaunchingDetailsExist", () => {
  cy.get(`[data-cy="Launching Details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyLaunchingDetailsNotExist", () => {
  cy.get(`[data-cy="Launching Details"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyScheduledGoLiveDateExist", () => {
  cy.get(`[data-cy="Scheduled Go Live Date"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyScheduledGoLiveDateNotExist", () => {
  cy.get(`[data-cy="Scheduled GoLiveDate"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyEmployeesTemplateListExist", () => {
  cy.get(`[data-cy="EMPLOYEES TEMPLATE LIST"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyEmployeesTemplateListNotExist", () => {
  cy.get(`[data-cy="EMPLOYEES TEMPLATE LIST"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyUsersListExist", () => {
  cy.get(`[data-cy="Users List"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyUsersListNotExist", () => {
  cy.get(`[data-cy="Users List"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySeedDocumentsToBeIncludedExist", () => {
  cy.get(`[data-cy="Seed documents to be included"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySeedDocumentsToBeIncludedNotExist", () => {
  cy.get(`[data-cy="Seed documents to be included"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPostCreationRecordsExist", () => {
  cy.get(`[data-cy="Post Creation Records"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPostCreationRecordsNotExist", () => {
  cy.get(`[data-cy="Post CreationRecords"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyLogsCreatedExist", () => {
  cy.get(`[data-cy="Logs Created"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyLogsCreatedNotExist", () => {
  cy.get(`[data-cy="Logs Created"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPurchaseOrderApprovalMatrixExist", () => {
  cy.get(`[data-cy="Purchase Order Approval Matrix"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPurchaseOrderApprovalMatrixNotExist", () => {
  cy.get(`[data-cy="Purchase OrderApprovalMatrix"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPiProcedureExist", () => {
  cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPiProcedureNotExist", () => {
  cy.get(`[data-cy="form.builder.mpiprocedure"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyStartQuantityExist", () => {
  cy.get(`[data-cy="Start quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyStartQuantityNotExist", () => {
  cy.get(`[data-cy="Start quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyAcceptedQuantityExist", () => {
  cy.get(`[data-cy="Accepted quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyAcceptedQuantityNotExist", () => {
  cy.get(`[data-cy="Accepted quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyRejectedQuantityExist", () => {
  cy.get(`[data-cy="Rejected quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyRejectedQuantityNotExist", () => {
  cy.get(`[data-cy="Rejected quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyEndQuantityExist", () => {
  cy.get(`[data-cy="End Quantity"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyEndQuantityNotExist", () => {
  cy.get(`[data-cy="End Quantity"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPartToBeManufacturedExist", () => {
  cy.get(`[data-cy="Part to be Manufactured"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPartToBeManufacturedNotExist", () => {
  cy.get(`[data-cy="Part to be Manufactured"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyBuildTypeExist", () => {
  cy.get(`[data-cy="Build Type"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyBuildTypeNotExist", () => {
  cy.get(`[data-cy="Build Type"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDueDateExist", () => {
  cy.get(`[data-cy="Due Date"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDueDateNotExist", () => {
  cy.get(`[data-cy="Due Date"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyLHRStepExist", () => {
  cy.get(`[data-cy^="LHR Step"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyLHRStepNotExist", () => {
  cy.get(`[data-cy^="LHR Step"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPoStatusExist", () => {
  cy.get(`[data-cy="PO Status"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPoStatusNotExist", () => {
  cy.get(`[data-cy="PO Status"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyRequestorExist", () => {
  cy.get(`[data-cy="Requestor"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyRequestorNotExist", () => {
  cy.get(`[data-cy="Requestor"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySupplierExist", () => {
  cy.get(`[data-cy="Supplier "]`).should("exist");
});

Cypress.Commands.add("intPageVerifySupplierNotExist", () => {
  cy.get(`[data-cy="Supplier "]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyOrderDateExist", () => {
  cy.get(`[data-cy="Order Date"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyOrderDateNotExist", () => {
  cy.get(`[data-cy="Order Date"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPoTableExist", () => {
  cy.get(`[data-cy="common.summary.total"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPoTableNotExist", () => {
  cy.get(`[data-cy="common.summary.total"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPeriodicTraningExist", () => {
  cy.get(`[data-cy="Refresh/repeat training periodically?"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPeriodicTraningNotExist", () => {
  cy.get(`[data-cy="Refresh/repeat training periodically?"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDocumentsToBeTrainedOnExist", () => {
  cy.get(`[data-cy="Documents to be trained on"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocumentsToBeTrainedOnNotExist", () => {
  cy.get(`[data-cy="Documents to be trained on"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyTrainingFrequencyExist", () => {
  cy.get(`[data-cy="Training refresh period (days)"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTrainingFrequencyNotExist", () => {
  cy.get(`[data-cy="Training refresh period (days)"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyTraineesDetailsExist", () => {
  cy.get(`[data-cy="Trainees Details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTraineesDetailsNotExist", () => {
  cy.get(`[data-cy="Trainees Details"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyGroupsToTrainExist", () => {
  cy.get(`[data-cy="Select Groups to train"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyGroupsToTrainNotExist", () => {
  cy.get(`[data-cy="Select Groups to train"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyUsersToTrainExist", () => {
  cy.get(`[data-cy="Select Users to train (if applicable)"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyUsersToTrainNotExist", () => {
  cy.get(`[data-cy="Select Users to train (if applicable)"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDocumentTitleExist", () => {
  cy.get(`[data-cy="Document Title"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocumentTitleNotExist", () => {
  cy.get(`[data-cy="Document Title"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDocumentDescriptionExist", () => {
  cy.get(`[data-cy="Document Description"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocumentDescriptionNotExist", () => {
  cy.get(`[data-cy="Document Description"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyTypeOfDocumentToBeCreatedExist", () => {
  cy.get(`[data-cy="Type of document to be created"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTypeOfDocumentToBeCreatedNotExist", () => {
  cy.get(`[data-cy="Type of document to be created"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDocumentTypeToBeSelectedExist", () => {
  cy.get(`[data-cy="Document Type to be selected"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocumentTypeToBeSelectedNotExist", () => {
  cy.get(`[data-cy="Document Type to be selected"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyJsonFormExist", () => {
  cy.get(`[data-cy="JSON Form"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyJsonFormNotExist", () => {
  cy.get(`[data-cy="JSON Form"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDefineTheOutputOfThatFormExist", () => {
  cy.get(`[data-cy="Define the output of that form"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDefineTheOutputOfThatFormNotExist", () => {
  cy.get(`[data-cy="Define the output of that form"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDefaultRevisionStageExist", () => {
  cy.get(`[data-cy="Default Revision Stage"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDefaultRevisionStageNotExist", () => {
  cy.get(`[data-cy="Default Revision Stage"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySeedTrainingRequiredExist", () => {
  cy.get(`[data-cy="Training Required"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySeedTrainingRequiredNotExist", () => {
  cy.get(`[data-cy="Training Required"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyAttachmentsToBeIncludedExist", () => {
  cy.get(`[data-cy="Attachments to be included"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyAttachmentsToBeIncludedNotExist", () => {
  cy.get(`[data-cy="Attachments to be included"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyMakeVsBuyExist", () => {
  cy.get(`[data-cy="Make vs Buy"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyMakeVsBuyNotExist", () => {
  cy.get(`[data-cy="Make vs Buy"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyPrimarySupplierExist", () => {
  cy.get(`[data-cy="Primary Supplier"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyPrimarySupplierNotExist", () => {
  cy.get(`[data-cy="Primary Supplier"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyOtherSuppliersExist", () => {
  cy.get(`[data-cy="Other Suppliers"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyOtherSuppliersNotExist", () => {
  cy.get(`[data-cy="Other Suppliers"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyUnitOfMeasureExist", () => {
  cy.get(`[data-cy="Unit of measure"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyUnitOfMeasureNotExist", () => {
  cy.get(`[data-cy="Unit of measure"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyTraceabilityRequiredExist", () => {
  cy.get(`[data-cy="Traceability required"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTraceabilityRequiredNotExist", () => {
  cy.get(`[data-cy="Traceability required"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySerializedExist", () => {
  cy.get(`[data-cy="Serialized"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySerializedNotExist", () => {
  cy.get(`[data-cy="Serialized"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySelectSerializationExist", () => {
  cy.get(`[data-cy="Select serialization"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySelectSerializationNotExist", () => {
  cy.get(`[data-cy="Select serialization"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyIqcRequiredExist", () => {
  cy.get(`[data-cy="IQC Required"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyIqcRequiredNotExist", () => {
  cy.get(`[data-cy="IQC Required"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyLimitedShelfLifeExist", () => {
  cy.get(`[data-cy="Limited Shelf Life"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyLimitedShelfLifeNotExist", () => {
  cy.get(`[data-cy="Limited Shelf Life"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyFaiRequiredExist", () => {
  cy.get(`[data-cy="FAI Required"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyFaiRequiredNotExist", () => {
  cy.get(`[data-cy="FAI Required"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySelectFormDocumentForImportExist", () => {
  cy.get(`[data-cy="Select Form Document For Import"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySelectFormDocumentForImportNotExist", () => {
  cy.get(`[data-cy="Select Form Document For Import"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyColumnDocumentRecordIdExist", () => {
  cy.get(`[data-cy="Column Document/Record Id?"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyColumnDocumentRecordIdNotExist", () => {
  cy.get(`[data-cy="Column Document/Record Id?"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifySelectOutputDocumentTypeExist", () => {
  cy.get(`[data-cy="Select Output Document Type"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySelectOutputDocumentTypeNotExist", () => {
  cy.get(`[data-cy="Select Output Document Type"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyDownloadExcelTemplateExist", () => {
  cy.get(`[data-cy="Download Excel Template"]`).parent().parent("button").should("exist").should("not.be.disabled");
});

Cypress.Commands.add("intPageVerifyDownloadExcelTemplateExistDisabled", () => {
  cy.get(`[data-cy="Download Excel Template"]`).parent().parent("button").should("exist").should("be.disabled");
});

Cypress.Commands.add("intPageVerifyDownloadExcelTemplateNotExist", () => {
  cy.get(`button [data-cy="Download Excel Template"]`).should("not.exist");
});

Cypress.Commands.add("intPageVerifyChangeDetailsTabExist", () => {
  cy.get(`[data-cy="tabId.changedetails"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDocumentsTabExist", () => {
  cy.get(`[data-cy="tabId.documents"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyOverviewTabExist", () => {
  cy.get(`[data-cy="tabId.overview"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyDetailsTabExist", () => {
  cy.get(`[data-cy="tabId.details"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyMatrixDetailsTabExist", () => {
  cy.get(`[data-cy="tabId.matrixdetails"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyApprovalRolesTabExist", () => {
  cy.get(`[data-cy="tabId.approvalroles"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyProcedureTabExist", () => {
  cy.get(`[data-cy="tabId.procedure"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyMaterialsAndEquipmentTabExist", () => {
  cy.get(`[data-cy="tabId.materialsandequipment"]`).should("exist");
});

Cypress.Commands.add("intPageVerifySpecificationTabExist", () => {
  cy.get(`[data-cy="tabId.specification"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyCalPmHistoryTabExist", () => {
  cy.get(`[data-cy="tabId.specification"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyTrainingTabExist", () => {
  cy.get(`[data-cy="tabId.training"]`).should("exist");
});

Cypress.Commands.add("intPageVerifyLineItemsTabExist", () => {
  cy.get(`[data-cy="tabId.lineitems"]`).should("exist");
});

