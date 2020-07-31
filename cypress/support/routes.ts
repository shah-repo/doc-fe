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
  ReleaseDocRev = "ReleaseDocRev",
  ARtoReview = "ARtoReview"
}

export const routes: ICyRoutes =   {
  ReleaseDocRev: {
    requestConfig: {
      method: "POST",
      url: "/api/v1/document_revisions/release/*",
    },
    callConfig: {
      responseTimeout: 25 * 1000,
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
};

