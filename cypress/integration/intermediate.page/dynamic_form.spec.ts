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
          it("Selects 'Dynamic Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Dynamic Form" });
          });

          it("Verify 'Title' field is visible", () => {
            cy.get("[data-cy=\"field-name\"]").should("exist");
          });

          it("Verify 'Description' field is visible", () => {
            cy.get("[data-cy=\"description\"]").should("exist");
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
            cy.get("[data-cy=\"field-securityEmployees\"]").should("exist");
          });

          it("Verify 'Selected Groups' field is visible", () => {
            cy.get("[data-cy=\"field-securityGroups\"]").should("exist");
          });

          it("Verify No 'Preview Layout' button is displayed", () => {
            cy.contains("button", "Preview Layout").should("not.exist");
          });

          it("Verify Attachments and Output document type are not displayed", () => {
            cy.get("[data-cy=\"albumMediaButton\"]").should("not.exist");
            cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("not.exist");
          });

          it("Verify no predefined fields are displayed", () => {
            cy.get("[data-cy=\"field-securityGroups\"]").last().should("exist");
          });

          it("Verify there is no ADD A FIELD button", () => {
            cy.get("button[data-cy=\"form.builder.add.field\"]").should("not.exist");
          });

          it("Verify there are no options nor icons for Import and Export of the form JSON", () => {
            cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("not.exist");
            cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("not.exist");
          });
        }
      );

      context("Click on CREATE DOCUMENT button & Verify the design", () => {
        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click CREATE DOCUMENT", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify there is ADD A FIELD button is displayed", () => {
          cy.get("button[data-cy=\"form.builder.add.field\"]").should("exist");
        });

        it("Verify center bottom displays: eye, import and export icons", () => {
          cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("exist");
          cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("exist");
          cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("exist");
        });

        // The design matches the Figma
      });

    });
  }
);
