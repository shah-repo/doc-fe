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
  ChangeRequestApprove = "ChangeRequestApprove",
  ARPreview = "ARPreview",
  GroupsPost = "GroupsPost",
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
  ReleaseDocRevWithoutAr = "ReleaseDocRevWithoutAr"
}

export const routes: ICyRoutes =   {
  EmployeesGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/employees*",
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
  PatchDocRev: {
    requestConfig: {
      method: "PATCH",
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
    },
  },
  GetDocDynamicForm: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/dynamic_forms",
    },
  },
  PostOrPatchDocRev: {
    requestConfig: {
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
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
      responseTimeout: 15 * 1000,
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
      responseTimeout: 15 * 1000,
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
  },
  DocRevPreview: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*",
    },
  },
  GetDocAggregatedAudit: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions/*/aggregated_audit",
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
  PostChangeRequests: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/change_requests",
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

