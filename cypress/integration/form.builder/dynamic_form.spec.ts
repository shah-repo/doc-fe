import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Dynamic Form Test", () => {
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

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Dynamic Form" });
    });

    it("Enters description 'New Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Dynamic Form" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field" });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocument();
    });

    it("Navigates to document list", () => {
      SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Form with Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Form with Dynamic Form" });
    });

    it("Enters description 'New Form with Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Form with Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Clinical Protocol' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'New Dynamic Form' field", () => {
      SystemRequirement("REQ-0550");
      cy.fbSelectCustomControl();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'Text Field 2' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field 2'", () => {
      cy.fbAddLabelName({ name: "New Text Field 2" });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocument();
    });

    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Document from Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Document from Form" });
    });

    it("Enters description 'New Document from Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document from Form description" });
    });

    it("Enters text inside 'New Text Field 1'", () => {
      cy.get("[data-cy*=\"new-text-field\"]").eq(1).type("Some text for Text field");
    });

    it("Enters text inside 'New Text Field 2'", () => {
      cy.get("[data-cy*=\"new-text-field-2\"]").type("Some text for Dynamic Form field");
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });
});

export { };

