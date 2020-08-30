import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const owner = USERS[2].name;

const formTitle = "Form with multiple outputs";
const history = [
  {
    owner,
    actions: [
      { key: "Updated status", value: `Set to Released by ${owner}` },
      { key: "Updated status", value: `Set to In Review by ${owner}` },
      { key: "Updated status", value: `Set to Pending Change by ${owner}` },
    ],
  },
  {
    owner,
    actions: [
      { key: "New Doc ID", value: "FM-00003" },
      { key: "Access granted to group", value: "Everyone" },
      { key: "New owner", value: `${owner}` },
      { key: "New status", value: `Set to Draft by ${owner}` },
      { key: "New name", value: "Form with multiple outputs" },
      { key: "New description", value: "\nForm with multiple outputs\n" },
    ],
  },
];

context("Check Document History", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
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
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
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

  context("Start document creation", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${formTitle}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: formTitle });
    });

    it("fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("fill in output document type: Clinical Protocol, Component Specification", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.drSelectOutputDocumentType({ documentType: "Component Specification" });
    });
  });

  context("Create document and release it", () => {
    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approves and releases document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Check document history", () => {
    SystemRequirement("REQ-0360");
    it("Open history drawer", () => {
      cy.drSelectHistoryTab();
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="owner-${groupIndex}"]`).should("have.text", element.owner);
      });

      element.actions.forEach((action, index) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          cy.get(`[data-cy="change-key-${groupIndex}-${index}"]`).should("have.text", action.key);
          cy.get(`[data-cy="change-value-${groupIndex}-${index}"]`).should("have.text", action.value);
        });
      });
    });
  });
});

export { };

