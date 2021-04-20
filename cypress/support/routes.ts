export interface CyWaitOptions {
  log: boolean;
  timeout: number;
  requestTimeout: number;
  responseTimeout: number;
}

type ICyRoutes = {[key in keyof typeof CyRoutes]: {
  requestConfig: Partial<Cypress.RouteOptions>;
  callConfig?: Partial<CyWaitOptions>;
}};

export enum CyRoutes {
  GetAttachments = "GetAttachments",
  EmployeesGet = "EmployeesGet",
  EmployeesPost = "EmployeesPost",
  GroupsGet = "GroupsGet",
  ReleaseDocRev = "ReleaseDocRev",
  ARtoReview = "ARtoReview",
  IOTCredentials = "IOTCredentials",
  CompanyMine = "CompanyMine",
  SetPrimaryAttachment = "SetPrimaryAttachment",
  UploadAttachment = "UploadAttachment",
  PatchDocRev = "PatchDocRev",
  PostOrPatchDocRev = "PostOrPatchDocRev",
  Login = "Login",
  GetDocumentTypes = "GetDocumentTypes",
  GetChangeRequests = "GetChangeRequests",
  ChangeRequestApprove = "ChangeRequestApprove",
  ARPreview = "ARPreview",
  GroupsPost = "GroupsPost",
  GroupsPatch = "GroupsPatch",
  DocPreview = "DocPreview",
  DocRevGet = "DocRevGet",
  LotQuantity = "LotQuantity",
  DocRevPreview = "DocRevPreview",
  GetProposedDocId = "GetProposedDocId",
  PatchCancelDocRev = "PatchCancelDocRev",
  GetPendingActions = "GetPendingActions",
  PostCloseAR = "PostCloseAR",
  PostApproveAR = "PostApproveAR",
  GetRequiredApprovers = "GetRequiredApprovers",
  GetAvailableApprovers = "GetAvailableApprovers",
  PatchAR = "PatchAR",
  GetDocAggregatedAudit = "GetDocAggregatedAudit",
  PostApprovalsApprove = "PostApprovalsApprove",
  GetGroupsApprovalRoles = "GetGroupsApprovalRoles",
  GroupsGetClearFilter = "GroupsGetClearFilter",
  PostChangeRequests = "PostChangeRequests",
  PostTaskDone = "PostTaskDone",
  PostRemoteValidatorsHelper = "PostRemoteValidatorsHelper",
  GetDocDynamicForm = "GetDocDynamicForm",
  UploadAttachmentMediaUpload = "UploadAttachmentMediaUpload",
  PostApprovals = "PostApprovals",
  GetFileUploadCandidates = "GetFileUploadCandidates",
  GetRequiredApproversDocRev = "GetRequiredApproversDocRev",
  ReleaseDocRevWithoutAr = "ReleaseDocRevWithoutAr",
  GetDocumentType = "GetDocumentType",
  PostRejectCR = "PostRejectCR",
  GetSpecificDocumentType = "GetSpecificDocumentType",
  PostWithdrawChangeRequests = "PostWithdrawChangeRequests",
  GetDocTypeGroupOptions = "GetDocTypeGroupOptions",
  GetDocAudit = "GetDocAudit",
  GetDocRevDocTypeCategory = "GetDocRevDocTypeCategory",
  GetDocRevStatusesCategory = "GetDocRevStatusesCategory",
  PostDocRevInReview = "PostDocRevInReview",
  PatchDocSecurity = "PatchDocSecurity",
  GetRevisionDocTypeGroupOptions = "GetRevisionDocTypeGroupOptions",
  PostDocRev = "PostDocRev",
  GroupGet = "GroupGet",
  GetDocRevDisplayStatus = "GetDocRevDisplayStatus",
  PostTasks = "PostTasks",
  DeleteLogout = "DeleteLogout",
  GetDocRevs = "GetDocRevs",
  SessionDetails = "SessionDetails",
  PatchDocRevOwner = "PatchDocRevOwner",
  PreventIdleLogout = "PreventIdleLogout",
  EmployeesGetActive = "EmployeesGetActive",
  ArAudit = "ArAudit",
  UpgradeToReleasedForm = "UpgradeToReleasedForm",
  GetAutocompleteOptions = "GetAutocompleteOptions",
}

export const routes: ICyRoutes =   {
  EmployeesGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/employees*",
    },
    callConfig: {
      responseTimeout: 50 * 1000,
      requestTimeout: 40 * 1000,
    },
  },
  EmployeesGetActive: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/employees?active*",
    },
    callConfig: {
      responseTimeout: 50 * 1000,
      requestTimeout: 40 * 1000,
    },
  },
  EmployeesPost: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/employees",
    },
  },
  ArAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/change_requests/*/audit",
    },
  },
  SessionDetails: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/auth/sessionDetails",
    },
    callConfig: {
      responseTimeout: 50 * 1000,
      requestTimeout: 40 * 1000,
    },
  },
  UpgradeToReleasedForm: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/upgradeToReleasedForm/*",
    },
    callConfig: {
      responseTimeout: 20 * 1000,
      requestTimeout: 20 * 1000,
    },
  },
  LotQuantity: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/documents/lot_quantity/*",
    },
    callConfig: {
      responseTimeout: 10 * 1000,
    },
  },
  PatchDocSecurity: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/documents/*/update_security",
    },
    callConfig: {
      responseTimeout: 10 * 1000,
    },
  },
  PreventIdleLogout: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/auth/prevent_idle_logout",
    },
    callConfig: {
      responseTimeout: 50 * 1000,
      requestTimeout: 40 * 1000,
    },
  },
  GroupsGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups*",
    },
  },
  GroupGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups/*",
    },
  },
  GroupsGetClearFilter: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups",
    },
  },
  GroupsPost: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/groups",
    },
  },
  GroupsPatch: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/groups/*",
    },
  },
  PatchDocRev: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 55 * 1000,
      requestTimeout: 45 * 1000,
    },
  },
  PostTasks: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/tasks",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  PatchDocRevOwner: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/*/owner_change",
    },
  },
  GetDocDynamicForm: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/dynamic_forms",
    },
  },
  PostDocRevInReview: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/document_revisions/in_review/*",
    },
  },
  DeleteLogout: {
    requestConfig: {
      method: "DELETE",
      url: "/api/v1/auth/logout",
    },
    callConfig: {
      responseTimeout: 35 * 1000,
      requestTimeout: 25 * 1000,
    },
  },
  GetDocRevStatusesCategory: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/statuses*",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  GetDocRevDisplayStatus: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions?displayStatus*",
    },
  },
  GetDocRevDocTypeCategory: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions?documentTypeCategory*",
    },
    callConfig: {
      responseTimeout: 35 * 1000,
      requestTimeout: 20 * 1000,
    },
  },
  GetDocTypeGroupOptions: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_type/with_forms?docTypeGroupOption*",
    },
  },
  GetRevisionDocTypeGroupOptions: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions?docTypeGroupOptions*",
    },
  },
  PostOrPatchDocRev: {
    requestConfig: {
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
      requestTimeout: 25 * 1000,
    },
  },
  ReleaseDocRevWithoutAr: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/document_revisions/release_without_ar/*",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
    },
  },
  PostRejectCR: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/reject",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
    },
  },
  ReleaseDocRev: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/document_revisions/release/*",
    },
    callConfig: {
      responseTimeout: 55 * 1000,
      requestTimeout: 30 * 1000,
    },
  },
  ARtoReview: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/in_review",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
      requestTimeout: 20 * 1000,
    },
  },
  IOTCredentials: {
    requestConfig: {
      method: "GET",
      url: "api/v1/auth/credentials/iot",
    },
    callConfig: {
      responseTimeout: 55 * 1000,
      requestTimeout: 30 * 1000,
    },
  },
  GetFileUploadCandidates: {
    requestConfig: {
      method: "GET",
      url: "api/v1/documents/file_upload_candidates*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
    },
  },
  CompanyMine: {
    requestConfig: {
      method: "GET",
      url: "api/v1/company/mine",
    },
  },
  SetPrimaryAttachment: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/*/set_primary/*",
    },
  },
  UploadAttachment: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/attachments/upload",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
      requestTimeout: 20 * 1000,
    },
  },
  GetAttachments: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/attachments*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
      requestTimeout: 20 * 1000,
    },
  },
  UploadAttachmentMediaUpload: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/documents/file_upload_candidates",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  Login: {
    requestConfig: {
      method: "POST",
      url: `/api/v1/auth/login`,
    },
  },
  GetDocumentTypes: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_type",
    },
    callConfig: {
      responseTimeout: 30 * 1000,
    },
  },
  GetDocumentType: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_type*",
    },
  },
  GetSpecificDocumentType: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_type/*",
    },
  },
  ChangeRequestApprove: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/approve",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
    },
  },
  DocRevGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions*",
    },
    callConfig: {
      responseTimeout: 20 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  ARPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/change_requests/*",
    },
    callConfig: {
      requestTimeout: 25 * 1000,
      responseTimeout: 20 * 1000,
    },
  },
  DocPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/documents/*",
    },
    callConfig: {
      requestTimeout: 30 * 1000,
      responseTimeout: 40 * 1000,
    },
  },
  DocRevPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      requestTimeout: 15 * 1000,
      responseTimeout: 20 * 1000,
    },
  },
  GetDocAggregatedAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/aggregated_audit",
    },
    callConfig: {
      requestTimeout: 35 * 1000,
      responseTimeout: 40 * 1000,
    },
  },
  GetDocAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/audit",
    },
    callConfig: {
      requestTimeout: 35 * 1000,
      responseTimeout: 40 * 1000,
    },
  },
  GetProposedDocId: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/documents/proposed_docid*",
    },
  },
  PatchCancelDocRev: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/cancel/*",
    },
  },
  GetPendingActions: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/pending_actions",
    },
  },
  PostCloseAR: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/closed",
    },
  },
  GetRequiredApprovers: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/required_approvers",
    },
    callConfig: {
      responseTimeout: 40 * 1000,
      requestTimeout: 30 * 1000,
    },
  },
  PostApproveAR: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/approve",
    },
  },
  PatchAR: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/change_requests/*",
    },
  },
  GetAvailableApprovers: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/change_requests/available_approvers",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  GetRequiredApproversDocRev: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/required_approvers*",
    },
    callConfig: {
      responseTimeout: 35 * 1000,
      requestTimeout: 30 * 1000,
    },
  },
  PostApprovalsApprove: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/approvals/*/approve",
    },
    callConfig: {
      responseTimeout: 20 * 1000,
    },
  },
  PostApprovals: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/approvals",
    },
  },
  GetGroupsApprovalRoles: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups/approval_roles",
    },
  },
  GetChangeRequests: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/change_requests**",
    },
  },
  PostDocRev: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/document_revisions",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  GetDocRevs: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions*",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  PostChangeRequests: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests",
    },
  },
  PostWithdrawChangeRequests: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/withdrawn",
    },
  },
  PostTaskDone: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/tasks/*/done",
    },
  },
  PostRemoteValidatorsHelper: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/remoteValidators/helper",
    },
  },
  GetAutocompleteOptions: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/autocomplete_options/*",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
};

