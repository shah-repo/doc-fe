import * as CRC32 from "crc-32";
import faker from "faker";
import { Company } from "../../../../src/state/ducks/company/types";
import { HEX2RGB } from "../../../utils/context/converers";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export { };
// We need this interfaces for Company Bootstrap, do not remove
interface IUser {
  email: string;
  name: string;
}
//
interface IdocumentTypeDto {
  documentTypeName: string;
  documentTypeAcronym: string;
  isQms?: boolean;
  group: string;
  privateNumberPool?: boolean;
  startingNumber?: number;
  needsSignature?: boolean;
  category?: string;
  schema?: any;
  fieldsConfig?:
  {
    U: {
      visible: boolean;
      required: boolean;
      label: string;
    };
  };
}

export interface ICreateCompanyBootstrap {
  name: string;
  companyAcronym: string;
  companyAdminEmail: string;
  importerEmail: string;
  slackIntegrationEnabled: boolean;
  helloSignIntegrationEnabled: boolean;
  helloSignTestMode: boolean;
  numOfRevStages: number;
  numOfDocDigits: number;
  users: IUser[];
  documentTypes: IdocumentTypeDto[];
  whiteLabeling?: any;
  addresses?: string[];
  remoteValidatorBundleName: string;
  acctCodes?: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      cmpCreateCompany(params: {
        payload: Partial<ICreateCompanyBootstrap>;
        sessionId: string;
        specFilePath: string;
      }): Chainable<Subject>;
      cmpUpdateCompany(params: {
        employeeId: string;
        sessionId: string;
        payload: Partial<Company>;}): Chainable<Subject>;
      cmpAdminUpdateCompany(params: {
        companyId: string;
        sessionId: string;
        payload: Partial<Company>;}): Chainable<Subject>;
      cmpSelectCompany(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpClickCreateNewDocument(): Chainable<Subject>;
      cmpClickCreateApprovalRequest(): Chainable<Subject>;
      cmpVerifyNoPendingActions(): Chainable<Subject>;
      cmpVerifyCompanyAvatar(params: { name: string; avatarSource: string }): Chainable<Subject>;
      cmpVerifyCompanyLogo(params: { logoSource: string}): Chainable<Subject>;
      cmpVerifyDefaultBackgroundColor(params: { color: string}): Chainable<Subject>;
      cmpVerifySecondaryColor(params: { color: string}): Chainable<Subject>;
      cmpVerifySecondaryContrastText(params: { color: string}): Chainable<Subject>;
      cmpVerifyPrimaryContrastText(params: { color: string}): Chainable<Subject>;
      cmpVerifyPrimaryColor(params: { color: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("cmpCreateCompany", (params: {
  payload: ICreateCompanyBootstrap;
  sessionId: string;
  specFilePath: string;
}) => {
  const { payload, sessionId, specFilePath } = params;

  const companyNumber = (Math.abs(CRC32.str(specFilePath)) + Math.round(Math.random() * 100000)) % 100000;

  const bodyDefaults = {
    name: `${capitalize(faker.commerce.color())} ${faker.company.companyName()} ${companyNumber}`,
    companyAcronym: `TC${companyNumber}`,
    scheduledForDeletion: false,
    whiteLabeling: {
      DEV_THEME: {
        logo: "/ta_assets_company_logo.png",
        avatar: "/ta_assets_company_avatar.png",
        imageEmail: "/ta_assets_company_email.png",
        colors: {
          defaultBackground: "#4b5dc6",
          primary: "#eb5055",
          primaryContrastText: "#000000",
          secondary: "#414b8b",
          secondaryContrastText: "#FFFFFF",
        },
      },
      DEMO_THEME: {
        logo: "/ta_assets_company_logo.png",
        avatar: "/ta_assets_company_avatar.png",
        imageEmail: "/ta_assets_company_email.png",
        colors: {
          defaultBackground: "#4b5dc6",
          primary: "#eb5055",
          primaryContrastText: "#000000",
          secondary: "#414b8b",
          secondaryContrastText: "#FFFFFF",
        },
      },
      SANDBOX_THEME: {
        logo: "/ta_assets_company_logo.png",
        avatar: "/ta_assets_company_avatar.png",
        imageEmail: "/ta_assets_company_email.png",
        colors: {
          defaultBackground: "#4b5dc6",
          primary: "#eb5055",
          primaryContrastText: "#000000",
          secondary: "#414b8b",
          secondaryContrastText: "#FFFFFF",
        },
      },
      PRODUCTION_THEME: {
        logo: "/ta_assets_company_logo.png",
        avatar: "/ta_assets_company_avatar.png",
        imageEmail: "/ta_assets_company_email.png",
        colors: {
          defaultBackground: "#4b5dc6",
          primary: "#eb5055",
          primaryContrastText: "#000000",
          secondary: "#414b8b",
          secondaryContrastText: "#FFFFFF",
        },
      },
    },
  };
  const body: ICreateCompanyBootstrap = {
    ...bodyDefaults,
    ...payload,
  };
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body,
    headers: {
      Authorization: `bearer_admin ${sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpUpdateCompany", (
  params: {
    employeeId: string;
    sessionId: string;
    payload: Partial<Company>;
  }) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/company/mine`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpAdminUpdateCompany", (
  params: {
    companyId: string;
    sessionId: string;
    payload: Partial<Company>;
  }) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/company/${params.companyId}`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpSelectCompany", (params: { name: string; multiple: boolean }) => {
  if (params.multiple) {
    cy.wrapWithWaitOnApiCalls([
      CyRoutes.IOTCredentials,
      CyRoutes.CompanyMine,
    ], () => {
      cy.get("#root").contains(params.name).click();
    });
  }
});

Cypress.Commands.add("cmpVerifyCompanyAvatar", (params: { name: string; avatarSource: string }) => {
  cy.xpath(`//div[contains(text(),"${params.name}")]/../img`)
    .should("have.attr", "src", params.avatarSource);
});

Cypress.Commands.add("cmpClickCreateNewDocument", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
    cy.get("[data-cy=\"document.revision.create\"]").click();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("cmpVerifyNoPendingActions", () => {
  cy.get("[data-cy=\"dashboard.noPendingActions\"]").should("exist");
});

Cypress.Commands.add("cmpClickCreateApprovalRequest", () => {
  cy.get("[data-cy=\"change.request.create\"]").click();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("cmpVerifyCompanyLogo", (params:  {logoSource: string}) => {
  cy.get("img[alt=\"Company logo\"]").should("have.attr", "src", params.logoSource);
});

Cypress.Commands.add("cmpVerifyDefaultBackgroundColor", (params:  {color: string}) => {
  cy.get("tr>th:nth-child(1)").should("have.css", "background-color", HEX2RGB(params.color));
});

Cypress.Commands.add("cmpVerifySecondaryColor", (params:  {color: string}) => {
  cy.get("a[href=\"/document_revision\"]>span").should("have.css", "color", HEX2RGB(params.color));
});

Cypress.Commands.add("cmpVerifySecondaryContrastText", (params:  {color: string}) => {
  cy.get("a[href=\"/\"]>span").should("have.css", "color", HEX2RGB(params.color));
});

Cypress.Commands.add("cmpVerifyPrimaryContrastText", (params:  {color: string}) => {
  cy.get("[data-cy=\"document.revision.create\"]").should("have.css", "color", HEX2RGB(params.color));
});

Cypress.Commands.add("cmpVerifyPrimaryColor", (params:  {color: string}) => {
  cy.get("[id=\"Header-userName\"]").should("have.css", "color", HEX2RGB(params.color));
});

export function cmpFilterDocumentTypeIdByName(companyResponse: Company, documentTypeName: string) {
  return companyResponse.documentTypes.filter((type) => type.documentTypeName === documentTypeName);
}

export function cmpAddNewEmployeeIds(employees, insertedUsers) {
  insertedUsers.forEach((user) => {
    employees.forEach((employee) => {
      if (user.email === employee.user.email) {
        user.newId = employee.id;
      }
    });
  });
}

export function cmpChangeGroupEmployeeIds(employees, groups) {
  groups.forEach((group) => {
    group.employees.forEach((groupEmployee) => {
      const newEmployee = employees.find((insertedEmployee) => groupEmployee.id === insertedEmployee.oldId);
      groupEmployee.id = newEmployee.newId;
    });
  });
}

export function cmpChangeGroupIds(oldGroups, newGroups) {
  oldGroups.forEach((oldGroup) => {
    const newGroup = newGroups.find((newGroup) => newGroup.name === oldGroup.name);
    oldGroup.newId = newGroup.id;
  });
}

export function cmpChangeParentGroupIds(groups) {
  groups.forEach((group) => {
    let counter = 0;
    group.parents.forEach((parentGroup) => {
      const updatedGroup = groups.find((updatedGroup) => updatedGroup.oldId === parentGroup.id);
      if (!updatedGroup) {
        group.parents.splice(counter);
      }
      else {
        parentGroup.id = updatedGroup.newId;
      }
      counter++;
    });
  });
}
