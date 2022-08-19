// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let company;
let adminEmployeeLoginResponse;
let adminEmployee;

const paperlhrTitle = "Paper LHR form";
const txtFieldTitle1 = "fb-textfield";
const txtFieldTitle2 = "fb-textfield-1";
const fileUploadFieldTitle = "fb-fileupload";

context("Document Approval Matrix Revise", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create 'Paper LHR' form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: paperlhrTitle });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify predefined fields are displayed", () => {
    it("Check 'Part to be Manufactured' is not displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Check 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
      cy.get("[data-cy=\"Build Type\"]").parent().parent().parent().parent()
        .should("contain.html", `role="radiogroup"`);
      cy.get("[name=\"lhr-build-type\"]").eq(0).should("have.value", "R&D");
      cy.get("[name=\"lhr-build-type\"]").eq(1).should("have.value", "Production");
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Add TextField with validation", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle1 });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add another one TextField without validation", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle2 });
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Navigate to document list and check data on landing page", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByType({ type: "FM" });
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Draft" });
    });
  });

  context("Open the FM and Verify all data and predefined fields are present", () => {
    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });

    it("Verify 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Approve and release form", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Navigate to document list and check data on landing page", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByType({ type: "FM" });
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Released" });
      cy.dlVerifyFilterByArId({ arId: "AR-00001" });
      cy.dlVerifyFilterByEffectiveDate({ effectiveDate: "8/18/2022" });
    });
  });

  context("Click to revise Verify all data and predefined fields are present", () => {
    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context(`Remove ${fileUploadFieldTitle} and approve and release form`, () => {
    it(`Remove ${fileUploadFieldTitle}`, () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(-2).arrowClick({ force: true });
    });

    it("Verify File Upload is not diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("not.exist");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });
});

