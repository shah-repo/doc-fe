// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const saveFileNameOne = (Math.round(Math.random() * 100000)) % 100000;

context("FORM Field Upload test", () => {
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
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
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

  context("Create a form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter document description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    context("Create FORM document with File Upload fields", () => {
      it("Add File Upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "file1" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "file1" } );
      });

      it("Add File Upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "file2" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "file2" } );
      });

      it("Add File Upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "file3" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "file3" } );
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Create new 'Clinical Protocol'", () => {
      it("Click on 'New' button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
      });

      it("Enter title 'test title'", () => {
        cy.drEnterDocumentTitle({ name: "test title" });
      });

      it("Enter description 'test description'", () => {
        cy.drEnterDocumentDescription({ description: "test description" });
      });

      it("Upload file1", () => {
        cy.elUploadAttachment({ fileName: "dummy.pdf", el: "fb-attachment-field-file-1-" });
      });

      it("Upload file2", () => {
        cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-file-2-" });
      });

      it("Upload file3", () => {
        cy.elUploadAttachment({ fileName: "test.docx", el: "fb-attachment-field-file-3-" });
      });

      it("Check file1 on click Download", () => {
        cy.elDownloadFile({ fileName: "dummy.pdf", saveFileName: saveFileNameOne + "dummy.pdf" });
      });

      it("Check size of downloaded file1", () => {
        cy.readFile(`cypress/downloads/${saveFileNameOne}dummy.pdf`).should("have.length", "12647");
      });

      it("Check file1 on click View File", () => {
        cy.contains("dummy.pdf").rightclick();
        cy.contains(`Download attached file dummy.pdf`).parent().find("li").eq(-1).click();
        cy.get("[data-cy=\"dummy.pdf\"]").should("exist");
        cy.get("[data-cy=\"dialog-close\"]").click();
      });

      it("Check file2 on click Download", () => {
        cy.elDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameOne + "image.jpg" });
      });

      it("Check size of downloaded file2", () => {
        cy.readFile(`cypress/downloads/${saveFileNameOne}image.jpg`).should("have.length", "32732");
      });

      it("Check file2 on click View File", () => {
        cy.contains("image.jpg").rightclick();
        cy.contains(`Download attached file image.jpg`).parent().find("li").eq(-1).click();
        cy.get("[data-cy=\"image.jpg\"]").should("exist");
        cy.get("[data-cy=\"dialog-close\"]").click();
      });

      it("Check file3 on click Download", () => {
        cy.elDownloadFile({ fileName: "test.docx", saveFileName: saveFileNameOne + "test.docx" });
      });

      it("Check size of downloaded file3", () => {
        cy.readFile(`cypress/downloads/${saveFileNameOne}test.docx`).should("have.length", "11");
      });
    });
  });
});
