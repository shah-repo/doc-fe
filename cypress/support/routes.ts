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
  PatchDocSecurity = "PatchDocSecurity"
}

export const routes: ICyRoutes =   {
  EmployeesGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/employees*",
    },
    callConfig: {
      responseTimeout: 20 * 1000,
      requestTimeout: 10 * 1000,
    },
  },
  EmployeesPost: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/employees",
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
  GroupsGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups*",
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
      responseTimeout: 25 * 1000,
      requestTimeout: 10 * 1000,
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
  GetDocRevStatusesCategory: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/statuses*",
    },
  },
  GetDocRevDocTypeCategory: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions?documentTypeCategory*",
    },
  },
  GetDocTypeGroupOptions: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_type/with_forms?docTypeGroupOption*",
    },
  },
  PostOrPatchDocRev: {
    requestConfig: {
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
      requestTimeout: 15 * 1000,
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
      responseTimeout: 45 * 1000,
    },
  },
  ARtoReview: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests/*/in_review",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
    },
  },
  IOTCredentials: {
    requestConfig: {
      method: "GET",
      url: "api/v1/auth/credentials/iot",
    },
    callConfig: {
      responseTimeout: 10 * 1000,
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
  },
  UploadAttachmentMediaUpload: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/documents/file_upload_candidates",
    },
    callConfig: {
      responseTimeout: 15 * 1000,
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
      responseTimeout: 10 * 1000,
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
  },
  DocPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/documents/*",
    },
    callConfig: {
      responseTimeout: 20 * 1000,
    },
  },
  DocRevPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 10 * 1000,
    },
  },
  GetDocAggregatedAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/aggregated_audit",
    },
  },
  GetDocAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/audit",
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
      responseTimeout: 10 * 1000,
      requestTimeout: 10 * 1000,
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
  },
  GetRequiredApproversDocRev: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/required_approvers*",
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
      url: "/api/v1/change_requests*",
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
};

