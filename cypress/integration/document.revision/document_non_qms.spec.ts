import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Non-QMS Document Creation Flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "NonQMS Document",
                documentTypeAcronym: "NQ",
                group: "OTHER",
                isQms: false,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start Non-QMS document creation flow", () => {
    it("Navigates to document list", () => {
      SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in necessary Non-QMS document attributes", () => {
    it("Enters title 'New Non-QMS Document'", () => {
      cy.drEnterDocumentTitle({ name: "New Non-QMS Document" });
    });

    it("Enters description 'New Non-QMS Document Description'", () => {
      cy.drEnterDocumentDescription({ description: "New Non-QMS Document Description" });
    });

    it("Selects 'NonQMS Document' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "NonQMS Document" });
    });

    context("Check permission groups", () => {
      it("Check if Selected Groups are set to 'Everyone' by default", () => {
        SystemRequirement("REQ-0300");
        cy.get("div[data-cy=field-securityEmployees]>#securityEmployees")
          .should("have.text", "Enter the name of users to access the document");
        cy.get("[data-cy=\"field-securityGroups\"]").contains("Everyone");
      });
    });
  });

  context("Creates document", () => {
    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Approve and release document", () => {
    it("Check if document status is Draft after creating a document", () => {
      SystemRequirement("REQ-0330");
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("Approves and releases document", () => {
      SystemRequirement("REQ-0900");
      cy.drApproveAndReleaseNonQMSDocument();
    });
  });
});

export { };

