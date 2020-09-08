// / <reference types="Cypress" />

import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let company;
let adminEmployeeLoginResponse;
let multipleCompanies = false;
let adminEmployee;
let docTypes: any[];
const DAMDocumentTypes: string[] = [];
const DAMTitle = "My DAM";
const roleOne = "Role One";
const FormTitle = "New Form";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];
const INDIVIDUAL_USER = USERS[14];
const IMPORTER_USER = USERS[15];

context("Document Approval Matrix Flow", () => {

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          docTypes = company.documentTypes || [];
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: multipleCompanies });
    });
  });

  context("Create DAM", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${FormTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("fill in document type: Form", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("fill in output document type: Document Approval Matrix", () => {
      // SystemRequirement("REQ-0490");
      cy.drAddOutputDocType({ documentType: "Document Approval Matrix" });
    });

    it("open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("select 'Approval Matrix'", () => {
      cy.fbSelectApprovalMatrix();
    });

    it("add 'Approval Matrix' field", () => {
      cy.fbAddField();
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context("Add New Role: Role One", () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name, SECOND_USER.name);
    });

    it("Save role", () => {
      SystemRequirement("REQ-0590");

      cy.drAddApprovalRole();
    });
  });

  context("Select 'Role One' is needed for 'Approvals Numeric' on all document types", () => {
    it("Click edit DAM", () => {
      cy.drClickDAMEditBtn();
    });

    it("Check all checkboxes for 'Approvals Numeric'", () => {
      cy.get("div:nth-child(2)>table > tbody > tr> td:nth-child(1)")
        .each(($el) => {
          cy.wrap($el).click();
        });
    });

    it("Click edit DAM", () => {
      cy.drClickDAMEditBtn();
    });
  });

  context("'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and Release the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Test enforced approvals for all document types", () => {
    context("Test 'Component Specification' approvals", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Componenet specification approvals" });
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Component Specification" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drApproveAndReleaseDialog();
        cy.get("[data-cy=unchecked]").should("exist");
        cy.get("[data-cy=group-0]").should("have.text", "Role One");
        cy.get("[data-cy=ApproveAndRelease-cancelButton]").click();
      });
    });

    context("Test 'Dynamic Form' approvals", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Dynamic Form approvals" });
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Dynamic Form" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drApproveAndReleaseDialog();
        cy.get("[data-cy=unchecked]").should("exist");
        cy.get("[data-cy=group-0]").should("have.text", "Role One");
        cy.get("[data-cy=ApproveAndRelease-cancelButton]").click();
      });
    });

    context("Test 'Engineering Build' approvals", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Engineering Build" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drApproveAndReleaseDialog();
        cy.get("[data-cy=unchecked]").should("exist");
        cy.get("[data-cy=group-0]").should("have.text", "Role One");
        cy.get("[data-cy=ApproveAndRelease-cancelButton]").click();
      });
    });

    context("Test 'Form' approvals", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Form" });
        cy.get("[data-cy=field-name]").click();
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drApproveAndReleaseDialog();
        cy.get("[data-cy=unchecked]").should("exist");
        cy.get("[data-cy=group-0]").should("have.text", "Role One");
        cy.get("[data-cy=ApproveAndRelease-cancelButton]").click();
      });
    });

  });
});
