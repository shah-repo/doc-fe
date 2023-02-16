import * as CRC32 from "crc-32";
import faker from "faker";
import { Company } from "../../../../src/state/ducks/company/types";
import { addTestContext } from "../../../utils/context/addTestContext";
import { HEX2RGB } from "../../../utils/context/converers";
import { ICreateCompanyBootstrap } from "../../commands";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export { };
// We need this interfaces for Company Bootstrap, do not remove

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
      cmpGetCompanyMine(params: {
        employeeId: string;
        sessionId: string;
      }): Chainable<Subject>;
      cmpUpdatePageDetails(params: {
        id: string;
        employeeId: string;
        sessionId: string;
        payload: any;}): Chainable<Subject>;
      cmpSelectCompany(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpCompanyDoesntExist(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpSelectCompanyAlreadyLoggedIn(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpClickCreateNewDocument(): Chainable<Subject>;
      cmpClickCreateApprovalRequest(): Chainable<Subject>;
      cmpClickCreateApprovalRequestWithoutApi(): Chainable<Subject>;
      cmpVerifyNoPendingActions(): Chainable<Subject>;
      cmpVerifyCompanyAvatar(params: { name: string; avatarSource: string }): Chainable<Subject>;
      cmpVerifyCompanyLogo(params: { logoSource: string}): Chainable<Subject>;
      cmpVerifyDefaultBackgroundColor(params: { color: string}): Chainable<Subject>;
      cmpVerifySecondaryColor(params: { color: string}): Chainable<Subject>;
      cmpVerifySecondaryContrastText(params: { color: string}): Chainable<Subject>;
      cmpVerifyPrimaryContrastText(params: { color: string}): Chainable<Subject>;
      cmpVerifyPrimaryColor(params: { color: string}): Chainable<Subject>;
      cmpTurnOffAutosave(): Chainable<Subject>;
      cmpTurnOnAutosave(): Chainable<Subject>;
      cmpExitDropdown(): Chainable<Subject>;
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
  const companyName = `${capitalize(faker.commerce.color())} ${faker.company.companyName()} ${companyNumber}`;
  const acronym = companyName.match(/[A-Z]/g)?.join("");

  const bodyDefaults = {
    name: `${companyName}`,
    companyAcronym: `TC${acronym}${companyNumber}`,
    scheduledForDeletion: false,
    testAutomationCompany: true,
    numOfRevStages: 3,
    numOfDocDigits: 5,
    helloSignIntegrationEnabled: false,
    helloSignTestMode: false,
    remoteValidatorBundleName: "default",
    slackIntegrationEnabled: false,
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

  cy.createCompany({
    payload: {
      ...bodyDefaults,
      ...payload,
    }, sessionId,
  });
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

Cypress.Commands.add("cmpGetCompanyMine", (
  params: {
    employeeId: string;
    sessionId: string;
  }) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/company/mine`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpUpdatePageDetails", (
  params: {
    id: string;
    employeeId: string;
    sessionId: string;
    payload: any;
  }) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/page_details/${params.id}`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpTurnOffAutosave", () => {
  cy.get("[name=\"toggleAutosave\"]").uncheck();
});

Cypress.Commands.add("cmpTurnOnAutosave", () => {
  cy.get("[name=\"toggleAutosave\"]").check();
});

Cypress.Commands.add("cmpSelectCompany", (params: { name: string; multiple: boolean }) => {
  if (params.multiple) {
    cy.wrapWithWaitOnApiCalls([
      CyRoutes.CompanyMine,
      CyRoutes.SessionDetails,
      CyRoutes.IOTCredentials,
    ], () => {
      cy.get("#root").contains(params.name).arrowClick();
    });
    addTestContext("companyName", params.name);
  }
  cy.get("body").then(($body) => {
    const scheduledForDeleteAlertText = "This company tenant is scheduled to be deleted. If there are" +
    " concerns about this tenant being deleted, please reach out toenlil-feedback@shifamed.com";
    const scheduledForDeleteAlert = $body.find("div.Toastify__toast--success>div>div");
    if (scheduledForDeleteAlert && scheduledForDeleteAlert.text() === scheduledForDeleteAlertText) {
      cy.get("button.Toastify__close-button--success").arrowClick();
    }
  });
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("cmpCompanyDoesntExist", (params: { name: string; multiple: boolean }) => {
  if (params.multiple) {
    cy.get("#root").should("not.contain", params.name);
  }
});

Cypress.Commands.add("cmpSelectCompanyAlreadyLoggedIn", (params: { name: string; multiple: boolean }) => {
  if (params.multiple) {
    cy.wrapWithWaitOnApiCalls([
      CyRoutes.IOTCredentials,
      CyRoutes.CompanyMine,
    ], () => {
      cy.get("#root").contains(params.name).arrowClick();
    });

    addTestContext("companyName", params.name);
    cy.progressBarShouldNotExist();
  }
});

Cypress.Commands.add("cmpVerifyCompanyAvatar", (params: { name: string; avatarSource: string }) => {
  cy.xpath(`//div[contains(text(),"${params.name}")]/../img`)
    .should("have.attr", "src", params.avatarSource);
});

Cypress.Commands.add("cmpClickCreateNewDocument", () => {
  cy.get("[data-cy=\"document.revision.create\"]").arrowClick();
  cy.wait(1000);
});

Cypress.Commands.add("cmpVerifyNoPendingActions", () => {
  cy.get("[data-cy=\"dashboard.noPendingActions\"]").should("exist");
});

Cypress.Commands.add("cmpClickCreateApprovalRequest", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
    cy.get("[data-cy=\"change.request.create\"]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("cmpClickCreateApprovalRequestWithoutApi", () => {
  cy.get("[data-cy=\"change.request.create\"]").arrowClick();
<<<<<<< HEAD
=======
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
>>>>>>> 99eca6b933e1993009e564126a3a94e6008ca452
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
  cy.get(`[data-cy="UserName"]`).should("have.css", "color", HEX2RGB(params.color));
});

Cypress.Commands.add("cmpExitDropdown", () => {
  cy.get("body").type("{esc}");
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
