// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { HistoryTestRecord } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;

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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              HistoryTestRecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
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
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.fbSelectInlineApproval();
        });
        cy.get("[name=\"label\"]").arrowType("Inline field");
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
        cy.drEnterDocumentTitleWithWait({ name: "History Test Record" });
      });

      it("Enter description 'History Test Record description'", () => {
        cy.drEnterDocumentDescriptionWithWait({ description: "History Test Record description" });
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=\"textfield-for-inline\"]").arrowType("First entry");
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
      });

      it("Check 'Red' and 'Green' value on checkbox", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.fbSelectCheckboxValue( "Red", "Green" );
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
      });

      it("Select 'One' value on radiobutton", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.fbSelectRadioButtonValue({ value: "One" });
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
      });

      it("Select 'SelectOne' value on select field", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.fbSelectFieldValue({ value: "SelectOne" });
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
      });

      it("Select approver for first inline", () => {
        SystemRequirement("REQ-4340");
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("[name*=\"fb-ia-inline-field\"] input").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[2].email).arrowClick();
        });
      });

      it("Save record", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Change textfield and approve again", () => {
        it("Enter text 'Second entry' in textfield for inline with bold tag to check if tags shows in history", () => {
          SystemRequirement("REQ-1080");
          cy.unClick();
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostOrPatchDocRev,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy^=\"textfield-for-inline\"]").arrowType(", <b> Second entry </b>");
            cy.unClick();
            cy.progressBarShouldNotExist();
          });
        });

        it("Enter description 'History Test Inline Record description'", () => {
          cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").clear();
          cy.drEnterDocumentDescriptionWithWait({ description: "History Test Inline Record description" });
        });

        it("Verify system asks for another approval afer changing section", () => {
          SystemRequirement("REQ-1050");
          cy.get("[data-cy^=\"form.builder.approval.pending\"]")
            .first()
            .should("have.text", "Inline approval pending");
        });

        it("Approve first Inline Approval", () => {
          SystemRequirement("REQ-4400");
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
          cy.get("input[name=\"password\"]").clear().arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Uncheck 'Red' and 'Green' value on checkbox", () => {
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostOrPatchDocRev,
            CyRoutes.SessionDetails], () => {
            cy.fbUnSelectCheckboxValue( "Red" );
            cy.progressBarShouldNotExist();
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbUnSelectCheckboxValue( "Green" );
            cy.unClick();
          });
        });

        it("Check 'Blue' value on checkbox", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectCheckboxValue( "Blue" );
            cy.unClick();
          });
          cy.progressBarShouldNotExist();
        });

        it("Select 'Two' value on radiobutton", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectRadioButtonValue({ value: "Two" });
            cy.unClick();
          });
          cy.progressBarShouldNotExist();
        });

        it("Select 'SelectTwo' value on select field", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectFieldValue({ value: "SelectTwo" });
            cy.unClick();
          });
          cy.progressBarShouldNotExist();
        });

        it("Save record", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Count number of elements in approval history", () => {
          cy.get("[data-cy*=\"fb-approval-history\"]").should("have.length", 6);
        });

        it("Check Inline approval history values", () => {
          SystemRequirement("REQ-1000");
          cy.fbInlineApprovalHisotryCheck(
            "Approved",
            "Checked in CheckboxGroup for inline: Blue",
            "Changed RadioBtnGroup for inline from One to Two",
            "Unchecked in CheckboxGroup for inline: Green",
            "Unchecked in CheckboxGroup for inline: Red",
            "Changed Select field for inline from SelectOne to SelectTwo"
          );
        });

        it("Check record status is in 'Draft'", () => {
          cy.drCheckDocumentStatus({ status: "Draft" });
        });
      });

      context("Check inline approval history on released document", () => {
        it("Approve first Inline Approval", () => {
          SystemRequirement("REQ-4350");
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
          cy.get("input[name=\"password\"]").clear().arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Navigate to released document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetDocAggregatedAudit], () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
          });
        });

        it("Count number of elements in approval history", () => {
          cy.get("[data-cy*=\"fb-approval-history\"]").should("have.length", 7);
        });

        it("Check Inline approval history values for current revision", () => {
          SystemRequirement("REQ-1000", "REQ-2680", "REQ-4370");
          cy.fbInlineApprovalHisotryCheck(
            "Approved",
            "Checked in CheckboxGroup for inline: Blue",
            "Changed RadioBtnGroup for inline from One to Two",
            "Unchecked in CheckboxGroup for inline: Green",
            "Unchecked in CheckboxGroup for inline: Red",
            "Changed Select field for inline from SelectOne to SelectTwo",
            "Approved"
          );
        });

        it("Check record status is in 'Last Signed'", () => {
          cy.drCheckDocumentStatus({ status: "Last Signed" });
        });
      });

      context("Check inline approval history on released Superseded document", () => {
        it("Navigate to Superseded document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetDocAggregatedAudit], () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(2).arrowClick();
          });
        });

        it("Count number of elements in approval history", () => {
          cy.get("[data-cy*=\"fb-approval-history\"]").should("have.length", 3);
        });

        it("Check Inline approval history values for current revision", () => {
          SystemRequirement("REQ-1000", "REQ-2680");
          cy.fbInlineApprovalHisotryCheck(
            "Approved",
            "Changed Textfield for inline from First entry to First entry, Second entry",
            "Approved",
          );
        });

        it("Check record status is in 'Superseded'", () => {
          cy.drCheckDocumentStatus({ status: "Superseded" });
        });
      });
    });
  });
});

export { };

