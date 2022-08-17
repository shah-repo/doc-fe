import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

context("DAM and POAM", () => {
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
            documentTypes: [],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

    context("Create DAM FORM", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: `DAM FORM` });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "DAM FORM Description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects output document type: Document Approval Matrix", () => {
        cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click CREATE DOCUMENT", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("'Approve and Release' the DAM Form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Create New Document out of the Form", () => {
        cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick();
      });

      it(`Enters title`, () => {
        cy.drEnterDocumentTitle({ name: "DAM Title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "DAM Description" });
      });
    });

    context("Verify DAM", () => {
      it("Navigate to document list landing page", () => {
        cy.navigToDocumentList();
      });

      it("Filter document by name and status, and select it", () => {
        cy.drFilterDocListByNameAndStatus({ title: "DAM Title", status: "Draft" });
      });

      it("Verify that DAM contains Overview, Matrix Details and Approval roles tab", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.matrixdetails\"]").should("exist");
        cy.get("[data-cy=\"tabId.approvalroles\"]").should("exist");
      });
    });

    context("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      it("Verify there is no ADD A FIELD button", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("not.exist");
      });

      it("Verify there is no EDIT A FIELD button", () => {
        cy.get("button[data-cy=\"edit-schema-item\"]").should("not.exist");
      });
    });

    context("Verify that user should not be able to rearrange the order of the Tabs", () => {
      it("should not be able to rearrange the order of the Tabs", () => {
        cy.verifyFixedTab();
      });
    });

    context("Verify DAM opens to the Overview tab by default", () => {
      it("Verify Overview as default selected tab", () => {
        cy.verifySelectedTab({ tab: "overview" });
      });

      it("Verify Document ID exist", () => {
        cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      });

      it("Verify Training required exist", () => {
        cy.get("[data-cy=\"field-retrain\"]").should("exist");
      });

      it("Verify Attachments exist", () => {
        cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
      });

      it("Verify that Form Options should appear for this tab", () => {
        cy.verifyFormOptionsVisibility({ visibility: true });
      });
    });

    context("Click Matrix Details Tab, clicking on it should open that tab and close the other one", () => {
      it("Navigate to Matrix Details Tab", () => {
        cy.drSelectMatrixDetailsTab();
        cy.verifySelectedTab({ tab: "matrixdetails" });
        cy.verifySelectedTab({ tab: "overview" }).should("not.exist");
      });
    });

  });
});
