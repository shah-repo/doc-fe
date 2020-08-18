import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Document Creation Flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
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
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Component Specification' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Component Specification" });
    });

    it("Checks if document type id is 'CS-00003'", () => {
      SystemRequirement("REQ-0320");
      cy.drCheckIfDocumentIdMatches({ docId: "CS-00003" });
    });

    it("Set document type id manually to 'CS-00999'", () => {
      SystemRequirement("REQ-0170");
      cy.drSetDocTypeId({ docId: "00999" });
    });

    it("Select reference for document", () => {
      SystemRequirement("REQ-0180");
      cy.drSelectReferences( "Initial AR Form", "Inline Approve Form" );
    });

    it("Remove reference for document", () => {
      SystemRequirement("REQ-0190");
      cy.drRemoveReferences( 1 );
    });

    context("Uploads attachments", () => {
      it("Uploads text.docx", () => {
        cy.atchUploadAttachment({ fileName: "test.docx" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test.docx", attributes: "11.00 B Microsoft Word File" });
      });

      it("Uploads image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Check image.jpg attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check two attachment are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });

      it("Remove attachment image.jpg", () => {
        cy.atchRemoveAttachment({ fileName: "image.jpg" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });
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

  context("Document in Draft", () => {
    it("Check if document status is Draft after creating a document", () => {
      SystemRequirement("REQ-0330");
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    context("Uploads attachments", () => {
      it("Uploads test_image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test_image.jpg", attributes: "79.54 kB JPG File" });
      });

      it("Check two attachments are displayed: test.docx, test_image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "test.docx" ] });
      });

      it("Uploads image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check three attachments are displayed: test.docx, image.jpg, test_image.jpg", () => {
        SystemRequirement("REQ-0200", "REQ-0210");
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test_image.jpg", "image.jpg", "test.docx" ] });
      });
    });

    context("Check primary attachment function", () => {
      it("Set attachment as primary", () => {
        cy.atchSetPrimaryAttachment({ fileName: "test_image.jpg" });
      });

      it.skip("Allow user to only set single attachment to be primary", () => {
        SystemRequirement("REQ-0250");
        cy.atchSetPrimaryAttachment({ fileName: "test.docx" });
        cy.atchCheckForSinglePrimaryAttachment();
      });

      it("Save document after setting primary attachment", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Remove attachment test_image.jpg", () => {
        SystemRequirement("REQ-0240");
        cy.atchRemoveAttachment({ fileName: "test_image.jpg" });
      });

      it("Check two attachments are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });
    });
  });
});

export { };

