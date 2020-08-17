import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Document Attachment Flow", () => {
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
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [
              {
                name: "Second Tester",
                email: "enlil.testmail+cy2@gmail.com",
              },
              {
                name: "Third Tester",
                email: "enlil.testmail+cy3@gmail.com",
              },
              {
                name: "Fourth Tester",
                email: "enlil.testmail+cy4@gmail.com",
              }],
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
        email: "enlil.testmail+cy2@gmail.com",
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
        email: "enlil.testmail+cy2@gmail.com",
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

    context("Uploads attachments", () => {
      it("Uploads text.docx", () => {
        cy.atchUploadAttachment({ fileName: "test.docx" });
      });

      it("Uploads redline attachment 'image.jpg'", () => {
        cy.atchUploadRedlineAttachment({ fileName: "image.jpg" });
      });

      it("Check if Selected Groups are set to 'Everyone' by default", () => {
        SystemRequirement("REQ-0300");
        cy.get("div[data-cy=field-securityEmployees]>#securityEmployees")
          .should("have.text", "Enter the name of users to access the document");
        cy.get("[data-cy=\"field-securityGroups\"]").contains("Everyone");
      });

      it("Clicks Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approves and releases document", () => {
        cy.drApproveAndReleaseDocument();
      });

      it("Download all attachments with redline document", () => {
        SystemRequirement("REQ-0390");
        cy.atchDownloadAllAttachments();
      });

      it("Enter password to confirm download", () => {
        cy.atchEnterConfirmationPassword({ password: "Tester1!" });
      });

      it("Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Uploads image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Clicks Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approves and releases document", () => {
        cy.drApproveAndReleaseDocument();
      });

      it("Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Clicks Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approves and releases document", () => {
        cy.drApproveAndReleaseDocument();
      });

      it("Select Superseded version of document without redline attachments", () => {
        cy.drSelectReleasedVersionOfDocument({ docVersion: 1 });
      });

      it("Download all attachments without redline document on Superseded version", () => {
        SystemRequirement("REQ-0380");
        cy.atchDownloadAllAttachments();
      });

      it("Enter password to confirm download", () => {
        cy.atchEnterConfirmationPassword({ password: "Tester1!" });
      });
    });
  });
});

export { };

