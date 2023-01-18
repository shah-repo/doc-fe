import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

context(
  "Verify that the intermediate page of the Dynamic Form matches the new design and functionality",
  () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

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
              importerEmail: IMPORTER_USER.email,
              users: [USERS[2], USERS[3], USERS[4]],
              documentTypes: [ClinicalProtocolDocType],
            },
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCompany = response;
            adminEmployee = createdCompany.employees.find(
              (employee) => employee.user.email === USERS[1].email
            );
            done();
          });
        });
      });

      context("Login user", () => {
        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({
            USER: USERS[1],
            employeeId: adminEmployee.id,
          });
        });
      });

      context("Go to Document List and create a document", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context(
        "Select Document Type 'Dynamic Form' and check Page default fields",
        () => {
          it("Selects document type as 'Clinical Protocol'", () => {
            cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
          });

          it("Verify 'Title' field is visible", () => {
            cy.intPageVerifyTitleExist();
          });

          it("Verify 'Description' field is visible", () => {
            cy.intPageVerifyDescriptionExist();
          });

          it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
            cy.get("[data-cy=\"field-document.documentType.id\"]")
              .parent()
              .should("have.class", "MuiGrid-grid-xs-6")
              .next()
              .should("have.class", "MuiGrid-grid-xs-6")
              .should("contain.text", "Document ID");
          });

          it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
            cy.get("[data-cy=\"field-revisionStage\"]")
              .parent()
              .parent()
              .should("have.class", "MuiGrid-grid-xs-6")
              .next()
              .should("have.class", "MuiGrid-grid-xs-6")
              .should("contain.text", "Training Required");
          });

          it("Verify 'Selected Users' field is visible", () => {
            cy.intPageVerifySelectedUsersExist();
          });

          it("Verify 'Selected Groups' field is visible", () => {
            cy.intPageVerifySelectedGroupsExist();
          });

          it("Verify Attachments and Output document type are not displayed", () => {
            cy.get("[data-cy=\"albumMediaButton\"]").should("not.exist");
            cy.intPageVerifyOutputDocTypeNotExist();
          });

          it("Verify no predefined fields are displayed", () => {
            cy.intPageVerifySelectedGroupsExist();
          });

          it("Verify there is no ADD A FIELD button", () => {
            cy.intPageVerifyAddFieldNotExist();
          });

          it("Verify there are no options nor icons for Import and Export of the form JSON", () => {
            cy.intPageVerifyFormOptionsNotExist();
          });
        }
      );

      context("Verify description field", () => {
        it("Verify DescriptionToolBar", () => {
          cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
          cy.get("div[class^=\"rdw-editor-toolbar\"]").should("exist");
          cy.get("div[title=\"Bold\"]").should("exist");
          cy.get("div[title=\"Italic\"]").should("exist");
          cy.get("div[title=\"Underline\"]").should("exist");
          cy.get("div[title=\"Strikethrough\"]").should("exist");
          cy.get("div[title=\"Monospace\"]").should("exist");
          cy.get("div[title=\"Superscript\"]").should("exist");
          cy.get("div[title=\"Subscript\"]").should("exist");
          cy.get("[aria-label=\"rdw-color-picker\"]").should("exist");
          cy.get("div[title=\"Unordered\"]").should("exist");
          cy.get("div[title=\"Ordered\"]").should("exist");
          cy.get("div[title=\"Indent\"]").should("exist");
          cy.get("div[title=\"Outdent\"]").should("exist");
          cy.get("[aria-label=\"rdw-inline-control\"]").should("exist");
          cy.get("[aria-label=\"rdw-textalign-control\"]").should("exist");
          cy.get("[title=\"Block Type\"]").should("not.exist");
          cy.get("[aria-label=\"rdw-font-size-control\"]").should("not.exist");
          cy.get("[aria-label=\"rdw-font-family-control\"]").should("not.exist");
        });

        it("Enter a 1 line description", () => {
          cy.drEnterDocumentDescription({
            description: "This is description test to check length. Checking length of characters and lines.",
          });
          cy.unClick();
          cy.intPageVerifyDescriptionViewMoreNotExist();
          cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
        });

        it("Add 2nd line description", () => {
          cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
          cy.get(`[data-cy="description"] [contenteditable]`)
            .first()
            .arrowType(
              "{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines."
            );
          cy.unClick();
          cy.intPageVerifyDescriptionViewMoreNotExist();
          cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
        });

        it("Add 3rd line description", () => {
          cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
          cy.get(`[data-cy="description"] [contenteditable]`)
            .first()
            .arrowType("{moveToEnd}{enter}This is description test to check length.");
          cy.unClick();
          cy.intPageVerifyDescriptionViewMoreExist();
          cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
        });

        it("Enter a description longer than 3 lines and over 245 characters", () => {
          cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
          cy.get(`[data-cy="description"] [contenteditable]`)
            .first()
            .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
          cy.unClick();
          cy.get("[data-cy=\"description\"] button").arrowClick();
          cy.get(`[data-cy="description"] [contenteditable]`).first().scrollIntoView({ ensureScrollable: false });
          cy.unClick();
        });
      });
      context("Verify DescriptionToolBar Functionality", () => {
        it("Verify Description for BOLD", () => {
          cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
          cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Bold\"]").arrowClick().wait(2000);
          cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
          cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-weight", "700");
          cy.unClick();
        });

        it("Verify Description for Italic", () => {
          cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
          cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Italic\"]").arrowClick().wait(2000);
          cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
          cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-style", "italic");
          cy.unClick();
        });

        it("Verify Description for Monospace", () => {
          cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
          cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Monospace\"]").arrowClick().wait(2000);
          cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
          cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-family", "monospace");
          cy.unClick();
        });
      });

      context("Click on CREATE DOCUMENT button & Verify the design", () => {
        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click CREATE DOCUMENT", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify there is ADD A FIELD button should not display", () => {
          cy.intPageVerifyAddFieldNotExist();
        });

        it("Verify center bottom should not display: eye, import and export icons", () => {
          cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("not.exist");
          cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("not.exist");
          cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("not.exist");
        });

      });

    });
  });
