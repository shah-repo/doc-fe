// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;

context("Record inline history Flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "History Test Record",
                documentTypeAcronym: "HTR-",
                group: "RECORD",
                isQms: true,
                needsSignature: true,
                category: "Record",
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

  context("FORM document creation flow", () => {

    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'History Test Inline Form", () => {
        cy.drEnterDocumentTitle({ name: "History Test Inline Form" });
      });

      it("Enter description 'History Test Inline Form description'", () => {
        cy.drEnterDocumentDescription({ description: "History Test Inline Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "History Test Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Add textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectTextField();
        cy.fbAddLabelName({ name: "Textfield for inline" });
        cy.fbAddField();
      });

      it("Add checkbox group", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbCheckboxGroupField();
        cy.fbGroupName({ name: "CheckboxGroup for inline" });
        cy.fbGroupOptions("Red", "Green", "Blue");
        cy.fbAddField();
      });

      it("Add radio button group", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbRadioBtnGroupField();
        cy.fbGroupName({ name: "RadioBtnGroup for inline" });
        cy.fbGroupOptions("One", "Two", "Three");
        cy.fbAddField();
      });

      it("Add Select field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectField();
        cy.fbGroupName({ name: "Select field for inline" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbAddField();
      });

      it("Add inline approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.wrapWithWaitOnApiCall(CyRoutes.GetGroupsApprovalRoles, () => {
          cy.fbSelectInlineApproval();
        });
        cy.get("[name=\"label\"]").type("Inline field");
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddField();
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'History Test Record' on dropdown", () => {
      SystemRequirement("REQ-0970");
      cy.recSelectRecordFormFromMultiSelect({
        recordType: "History Test Record",
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'History Test Record'", () => {
        cy.drEnterDocumentTitle({ name: "History Test Record" });
      });

      it("Enter description 'History Test Record description'", () => {
        cy.drEnterDocumentDescription({ description: "History Test Record description" });
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.get("[data-cy^=\"textfield-for-inline\"]").click().type("First entry");
      });

      it("Check 'Red' and 'Green' value on checkbox", () => {
        cy.fbSelectCheckboxValue( "Red", "Green" );
      });

      it("Select 'One' value on radiobutton", () => {
        cy.fbSelectRadioButtonValue({ value: "One" });
      });

      it("Select 'SelectOne' value on select field", () => {
        cy.fbSelectFieldValue({ value: "SelectOne" });
      });

      it("Select approver for first inline", () => {
        cy.get("[name*=\"fb-ia-inline-field\"] input")
          .type("enlil.testmail+cy2{downarrow}{enter}", { force: true });
      });

      it("Save record", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.EmployeesGet,
          CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

      context("Change textfield and approve again", () => {
        it("Enter text 'Second entry' in textfield for inline with bold tag to check if tags shows in history", () => {
          SystemRequirement("REQ-1080");
          cy.get("[data-cy^=\"textfield-for-inline\"]").click().type(", <b> Second entry </b>");
        });

        it("Enter description 'History Test Inline Record description'", () => {
          cy.drEnterDocumentDescription({ description: "History Test Inline Record description" });
        });

        it("Verify system asks for another approval afer changing section", () => {
          SystemRequirement("REQ-1050");
          cy.get("[data-cy^=\"form.builder.approval.pending\"]")
            .first()
            .should("have.text", "Inline approval pending");
        });

        it("Approve first Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet,
            CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        it("Uncheck 'Red' and 'Green' value on checkbox", () => {
          cy.fbUnSelectCheckboxValue( "Red", "Green" );
        });

        it("Check 'Blue' value on checkbox", () => {
          cy.fbSelectCheckboxValue( "Blue" );
        });

        it("Select 'One' value on radiobutton", () => {
          cy.fbSelectRadioButtonValue({ value: "Two" });
        });

        it("Select 'SelectOne' value on select field", () => {
          cy.fbSelectFieldValue({ value: "SelectTwo" });
        });

        it("Select 'SelectOne' value on select field", () => {
          cy.fbSelectFieldValue({ value: "SelectTwo" });
        });

        it("Save record", () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        });

        it("Count number of elements in approval history", () => {
          cy.get("[data-cy*=\"fb-approval-history\"]").should("have.length", 6);
        });

        it("Check Inline approval history values", () => {
          cy.fbInlineApprovalHisotryCheck(
            "Approved",
            "Checked in CheckboxGroup for inline: Blue",
            "Changed RadioBtnGroup for inline from One to Two",
            "Unchecked in CheckboxGroup for inline: Green",
            "Unchecked in CheckboxGroup for inline: Red",
            "Changed Select field for inline from SelectOne to SelectTwo"
          );
        });
      });
    });
  });
});

export { };
