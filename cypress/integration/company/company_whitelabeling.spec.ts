// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;

const defaultLogo = "/ta_assets_company_logo.png";
const defaultAvatar = "/ta_assets_company_avatar.png";
const defaultDefaultBackground = "#4b5dc6";
const defaultPrimary = "#eb5055";
const defaultPrimaryContrastText = "#000000";
const defaultSecondary = "#414b8b";
const defaultSecondaryContrastText = "#FFFFFF";

const replacedLogo = "/ta_assets_company_avatar.png";
const replacedAvatar = "/ta_assets_company_logo.png";
const replacedDefaultBackground = "#FFFFFF";
const replacedPrimary = "#FF0000";
const replacedPrimaryContrastText = "#00FF00";
const replacedSecondary = "#0000FF";
const replacedSecondaryContrastText = "#000000";

context("Whitelabeling test", () => {
  context("[API]Prepare company", () => {
    it("[API]Create company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Verify default company avatar", () => {
      cy.cmpVerifyCompanyAvatar({ name: createdCompany.name, avatarSource: defaultAvatar });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify default company logo", () => {
      cy.cmpVerifyCompanyLogo({ logoSource: defaultLogo });
    });

    context("Verify default company colors", () => {
      it("Verify 'primary' company color", () => {
        cy.cmpVerifyPrimaryColor({ color: defaultPrimary });
      });

      it("Verify 'primaryContrastText' company color", () => {
        cy.cmpVerifyPrimaryContrastText({ color: defaultPrimaryContrastText });
      });

      it("Verify 'secondary' company color", () => {
        cy.cmpVerifySecondaryColor({ color: defaultSecondary });
      });

      it("Verify 'secondaryContrastText' company color", () => {
        cy.cmpVerifySecondaryContrastText({ color: defaultSecondaryContrastText });
      });

      it("Verify 'defaultBackground' company color", () => {
        cy.navigToDocTypeManagement();
        cy.cmpVerifyDefaultBackgroundColor({ color: defaultDefaultBackground });
      });
    });

    context("Logout", () => {
      it("Sign out user", () => {
        cy.authLogout();
      });
    });
  });

  context("Change company whitelabeling", () => {
    it("[API] Patch company", (done: any) => {
      cy.cmpAdminUpdateCompany({
        sessionId: loginResponse.sessionId,
        companyId: createdCompany.id,
        payload: {
          whiteLabeling: {
            DEV_THEME: {
              logo: replacedLogo,
              avatar: replacedAvatar,
              colors: {
                defaultBackground: replacedDefaultBackground,
                primary: replacedPrimary,
                primaryContrastText: replacedPrimaryContrastText,
                secondary: replacedSecondary,
                secondaryContrastText: replacedSecondaryContrastText,
              },
            },
            DEMO_THEME: {
              logo: replacedLogo,
              avatar: replacedAvatar,
              colors: {
                defaultBackground: replacedDefaultBackground,
                primary: replacedPrimary,
                primaryContrastText: replacedPrimaryContrastText,
                secondary: replacedSecondary,
                secondaryContrastText: replacedSecondaryContrastText,
              },
            },
            SANDBOX_THEME: {
              logo: replacedLogo,
              avatar: replacedAvatar,
              colors: {
                defaultBackground: replacedDefaultBackground,
                primary: replacedPrimary,
                primaryContrastText: replacedPrimaryContrastText,
                secondary: replacedSecondary,
                secondaryContrastText: replacedSecondaryContrastText,
              },
            },
            PRODUCTION_THEME: {
              logo: replacedLogo,
              avatar: replacedAvatar,
              colors: {
                defaultBackground: replacedDefaultBackground,
                primary: replacedPrimary,
                primaryContrastText: replacedPrimaryContrastText,
                secondary: replacedSecondary,
                secondaryContrastText: replacedSecondaryContrastText,
              },
            },
          },
        },
      }).then(() => done());
    });
  });

  context("Login user and verify whitelabel changes", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Verify replaced company avatar", () => {
      cy.cmpVerifyCompanyAvatar({ name: createdCompany.name, avatarSource: replacedAvatar });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify replaced company logo", () => {
      cy.cmpVerifyCompanyLogo({ logoSource: replacedLogo });
    });

    context("Verify replaced company colors", () => {
      it("Verify 'primary' company color", () => {
        cy.cmpVerifyPrimaryColor({ color: replacedPrimary });
      });

      it("Verify 'primaryContrastText' company color", () => {
        cy.cmpVerifyPrimaryContrastText({ color: replacedPrimaryContrastText });
      });

      it("Verify 'secondary' company color", () => {
        cy.cmpVerifySecondaryColor({ color: replacedSecondary });
      });

      it("Verify 'secondaryContrastText' company color", () => {
        cy.cmpVerifySecondaryContrastText({ color: replacedSecondaryContrastText });
      });

      it("Verify 'defaultBackground' company color", () => {
        cy.navigToDocTypeManagement();
        cy.cmpVerifyDefaultBackgroundColor({ color: replacedDefaultBackground });
      });
    });
  });
});

export { };

