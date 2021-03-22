// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Document Operators Access Test", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Form Operators",
                documentTypeAcronym: "FO-",
                group: "FORM",
                isQms: true,
              },
              {
                documentTypeName: "Engineering Build Operators",
                documentTypeAcronym: "EBO-",
                group: "ENGINEERING_BUILD",
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
              {
                documentTypeName: "Part Operators",
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
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
        email: USERS[1].email,
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
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  // TODO: Create form for Parts with API, not through document list creation!
  context("Create Form Part document to create Part", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Parts' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Part Operators" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Start Part creation flow", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Click on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'Part Operators' Form", () => {
      cy.inspecSelectRecordFormFromMultiSelect({ recordType: "Part Operators" });
    });

    it("Enter title 'Test Part'", () => {
      cy.drEnterDocumentTitle({ name: "Test Part" });
    });

    it("Enter description 'Test Part description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Part description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click Create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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
      cy.drSelectOutputDocumentType({ documentType: "Engineering Build Operators" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(3000);
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });


  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRev,
        CyRoutes.EmployeesGet,
        CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enters title 'New Document'", () => {
      cy.drEnterDocumentTitle({ name: "New Document" });
    });

    it("Enters description 'New Document description'", () => {
      cy.drEnterDocumentDescriptionWithWait({ description: "New Document description" });
    });

    it("Choose an existing part from the list of available parts", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"childrenParts\"]").type("Test Part{downarrow}{enter}");
      });
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
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.fbAddNewFieldButton();
      });
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

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("reload page", () => {
      cy.reload();
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
    it("Navigates to document list", () => {
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


  context(`Fill textbox field with operator '${USERS[4].name}'`, () => {
    it("Navigates to document list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check field for first operator is not disabled", () => {
      cy.get("[name^='text-field-for']").should("not.be.disabled");
    });

    it("Check field for second operator is not disabled", () => {
      cy.get("[name^='new-text-field-for']").should("not.be.disabled");
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='new-text-field-for']").type("Test First Field");
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
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Submit for approval and approve as owner", () => {
    it("Navigates to document list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Add Owner as Approver on document", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Add first colaborator as Approver on document", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
    });

    it("Add second colaborator as Approver on document", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[4].name });
    });

    it("Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
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

    it("Navigates to document list", () => {
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

    it("Navigates to document list", () => {
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


