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
  DocRevGet = "DocRevGet"
}

export const routes: ICyRoutes =   {
  EmployeesGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/employees*",
    },
  },
  GroupsGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/groups*",
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
  PostOrPatchDocRev: {
    requestConfig: {
      url: "/api/v1/document_revisions/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
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
  Login: {
    requestConfig: {
      method: "POST",
      url: `/api/v1/auth/login`,
    },
  },
  DocRevGet: {
    requestConfig: {
      method: "GET",
      url: "/api/v1/document_revisions*",
    },
  },
};

