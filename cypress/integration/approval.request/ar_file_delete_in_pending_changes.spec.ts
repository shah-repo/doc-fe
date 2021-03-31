// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("File delete in Pending Change", () => {
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

    it("Upload test.docx and image.jpg files", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[3].name}`]);
    });

    context("Withdraw submission and check attachments on document", () => {
      it("Navigates to Approval Request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Filters document by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: "test title", status: "In Review" });
      });

      it("Withdraw Submission", () => {
        cy.arWithdrawSubmission();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filters document by name and status, and select it", () => {
        cy.drFilterDocListByNameAndStatus({ title: "test title", status: "Pending Change" });
      });

      it("Check number of attachments", () => {
        cy.get("[data-cy=attachment]").should("have.length", 2);
      });

      it("Delete file test.docx", () => {
        cy.contains("test.docx").parent().parent().find("#AttachmentIconPresenter-handleRemove").click({ force: true });
      });

      it("Check number of attachments after reload page", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "test title", status: "Pending Change" });
        cy.get("[data-cy=attachment]").should("have.length", 1);
      });

      it("Delete file image.jpg", () => {
        cy.contains("image.jpg").parent().parent().find("#AttachmentIconPresenter-handleRemove").click({ force: true });
      });

      it("Check number of attachments after reload page", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "test title", status: "Pending Change" });
        cy.get("[data-cy=attachment]").should("have.length", 0);
      });

      it("Upload dummy.pdf", () => {
        cy.atchUploadAttachment({ fileName: "dummy.pdf" });
      });

      it("Check number of attachments after reload page", () => {
        cy.navigToDocumentList();
        cy.drFilterDocListByNameAndStatus({ title: "test title", status: "Pending Change" });
        cy.get("[data-cy=attachment]").should("have.length", 1);
      });
    });
  });
});
