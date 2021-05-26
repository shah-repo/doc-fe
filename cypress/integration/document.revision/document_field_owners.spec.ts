// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Document Field Owners Test", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4], USERS[7]],
            documentTypes: [
              {
                documentTypeName: "Form Operators",
                documentTypeAcronym: "FO-",
                group: "FORM",
                isQms: true,
              },
              {
                documentTypeName: "Lot Hisotry Record Operators",
                documentTypeAcronym: "LHRO-",
                group: "LHR",
                category: "Record",
                isQms: true,
                fieldsConfig:
                  {
                    U: {
                      visible: true,
                      required: false,
                      label: "Operators",
                    },
                  },
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

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
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

    it("Select 'Form Operators' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form Operators" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lot Hisotry Record Operators" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "Text Field for " + USERS[3].name });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field for " + USERS[4].name });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });


  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Document'", () => {
      cy.drEnterDocumentTitle({ name: "New Document" });
    });

    it("Enters description 'New Document description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document description" });
    });

    it("clicks on 'Save' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click on sidebar permission icon to add Operators", () => {
      cy.get("[data-cy='permission-icon']").click();
    });

    it(`Select '${USERS[3].name}' to Assign document to`, () => {
      cy.drAssignDocumentTo({ username: USERS[3].name });
    });

    it(`Select '${USERS[4].name}' to Assign document to`, () => {
      cy.drAssignDocumentTo({ username: USERS[4].name });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context(`Open created document and check for operators restrictions`, () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check if Title input field is disabled", () => {
      cy.get("[value='New Document']input").should("be.disabled");
    });

    it("Check if Description input field is disabled", () => {
      cy.get("[class='public-DraftEditor-content']")
        .should("have.attr", "contenteditable", "false");
    });

    it("Check if Document Type input field is disabled", () => {
      cy.get("[id='documentType']input").should("have.attr", "type", "hidden");
    });

    it("Check if Document ID field is disabled", () => {
      cy.get("[id='document.docId']input").should("be.disabled");
    });

    it("Check if Reference input field is disabled", () => {
      cy.get("[data-cy='referenceTo']>div>div>input").should("be.disabled");
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='text-field-for']").type("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[4].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });


  context(`Add new textbox field for operator '${USERS[4].name}'`, () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='new-text-field-for']").type("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Check field from other colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.be.disabled");
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Check fields are disabled for user that is not field owner, and change owner of document", () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check field from first colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.be.disabled");
    });

    it("Check field from second colaborator is disabled", () => {
      cy.get("[name^='new-text-field-for']").should("be.be.disabled");
    });

    it(`Change owner to '${USERS[7].name}'`, () => {
      cy.drChangeOwnerFromMenu({ employee: USERS[7].name });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Check fields are disabled for user that is not field owner with new document owner", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[7].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check field from first colaborator is disabled", () => {
      cy.get("[name^='text-field-for']").should("be.disabled");
    });

    it("Check field from second colaborator is disabled", () => {
      cy.get("[name^='new-text-field-for']").should("be.disabled");
    });
  });

  context("Check all colaborators must be on approvals list", () => {
    it("Add first colaborator as Approver on document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Add second colaborator as Approver on document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[4].name });
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        cy.checkToastMessageIsEqual({ message: "All colaborators to the document must be on approvers list" });
      });
    });

    it("Add third colaborator as Approver on document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[7].name });
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[7].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "In Review" });
    });

    it("Approve record button click", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Reload document", () => {
      cy.reload();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context(`Approve form as '${USERS[3].name}'`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Document", status: "In Review" });
    });

    it("Approve record button click", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Reload document", () => {
      cy.reload();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context(`Approve form as '${USERS[4].name}'`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[4].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Document", status: "In Review" });
    });

    it("Approve record button click", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Reload document", () => {
      cy.reload();
    });

    it("Verify status is released", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });
});

export { };


