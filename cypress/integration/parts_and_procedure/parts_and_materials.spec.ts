import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Procedure and parts flow test", () => {
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
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
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
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });
  });

  context("Login company admin", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create part document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'New Part'", () => {
        cy.drEnterDocumentTitle({ name: "New Part for procedure" });
      });

      it("Enters description 'New Part description'", () => {
        cy.drEnterDocumentDescription({ description: "New Part description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Component Specification' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Component Specification" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocument();
      });
    });
  });

  context("Create document with procedure field", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "Form document for procedure" });
      });

      it("Enters description 'Procedure description'", () => {
        cy.drEnterDocumentDescription({ description: "Procedure description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });

      it("Add procedure field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectCustomFieldToAdd({ name: "Procedure" });
        cy.fbAddField();
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocument();
      });
    });
  });


  context("Create procedure document", () => {
    it("Click create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });
    context("Fill procedure document attributes", () => {
      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "Procedure document" });
      });

      it("Enters description 'Procedure description'", () => {
        cy.drEnterDocumentDescription({ description: "Procedure description" });
      });
    });
  });
});

export { };

