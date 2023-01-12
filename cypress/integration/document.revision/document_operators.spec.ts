// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../support/config";
import { Categories } from "../../utils/constants/categories";
import { FormOperatorsType } from "../../utils/constants/documentTypes/form";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let employeeLoginThird;
let employeeLoginFourth;

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
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              FormOperatorsType,
              {
                documentTypeName: "Engineering Build Operators",
                documentTypeAcronym: "EBO-",
                group: DOC_TYPE_GROUP.ENGINEERING_BUILD,
                category: Categories.Record,
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
                group: DOC_TYPE_GROUP.PART,
                isQms: true,
                needsSignature: true,
                category: Categories.Parts,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeLoginThird = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          employeeLoginFourth = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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
      cy.drClickSaveWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enters title 'New Document'", () => {
      cy.drEnterDocumentTitle({ name: "New Document" });
    });

    it("Enters description 'New Document description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document description" });
    });

    it("Choose an existing part from the list of available parts", () => {
      cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("Test Part");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
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
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field for " + USERS[4].name });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("reload page", () => {
      cy.reload();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on sidebar permission icon to add Operators", () => {
      cy.drSelectPermissionTab();
    });

    it(`Select '${USERS[3].name}' to Assign document to`, () => {
      cy.drAssignDocumentTo({ username: USERS[3].name });
    });

    it("Click on sidebar permission icon to add Operators", () => {
      cy.wait(5000);
      cy.drSelectPermissionTab();
    });

    it(`Select '${USERS[4].name}' to Assign document to`, () => {
      cy.drAssignDocumentTo({ username: USERS[4].name });
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: employeeLoginThird.id });
    });
  });

  context(`Open created document and check for operators restrictions`, () => {
    it("Navigates to records", () => {
      cy.navigToRecords();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check if Title input field is disabled", () => {
      cy.get("[data-cy=\"field-name\"]").arrowClick();
      cy.get("input[value=\"New Document\"]").should("be.disabled");
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
      cy.get("[name^='text-field-for']").arrowType("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: employeeLoginFourth.id });
    });
  });

  context(`Fill textbox field with operator '${USERS[4].name}'`, () => {
    it("Navigates to records", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Check field for first operator is not disabled", () => {
      cy.get("[name^='text-field-for']").should("not.be.disabled");
    });

    it("Check field for second operator is not disabled", () => {
      cy.get("[name^='new-text-field-for']").should("not.be.disabled");
    });

    it("Fill value for FB textbox field", () => {
      cy.get("[name^='new-text-field-for']").arrowType("Test First Field");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Submit for approval and approve as owner", () => {
    it("Navigates to records", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "Draft" });
    });

    it("Add Owner as Approver on document", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Add first colaborator as Approver on document", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[3].name });
    });

    it("Add second colaborator as Approver on document", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[4].name });
    });

    it("Submit for Approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.progressBarShouldAppear();
    });

    it("Approve record button click", () => {
      cy.ebTryToApprove();
      cy.progressBarShouldAppear();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context(`Approve form as '${USERS[3].name}'`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: employeeLoginThird.id });
    });

    it("Navigates to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "In Review" });
    });

    it("Approve record button click", () => {
      cy.ebTryToApprove();
      cy.progressBarShouldAppear();
    });

    it(`Logout as current user`, () => {
      cy.authLogout();
    });
  });

  context(`Approve form as '${USERS[4].name}'`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: employeeLoginFourth.id });
    });

    it("Navigates to records list", () => {
      cy.navigToRecords();
    });

    it("Filter document by name and status, and select it", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "New Document", status: "In Review" });
    });

    it("Approve record button click", () => {
      cy.ebTryToApprove();
      cy.progressBarShouldAppear();
    });

    it("Verify status is released", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});

export { };


