// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
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
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
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
        cy.wait(5000);
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
        cy.get("[data-cy^=\"textfield-for-inline\"]").type("First entry");
      });

      it("Check 'Red' and 'Green' value on checkbox", () => {
        cy.fbSelectCheckboxValue( "Red", "Green" );
      });

      it("Select 'One' value on radiobutton", () => {
        SystemRequirement("FB-0900");
        SystemRequirement("FB-0960");
        cy.fbSelectRadioButtonValue({ value: "One" });
      });

      it("Select 'SelectOne' value on select field", () => {
        SystemRequirement("FB-0870");
        cy.fbSelectFieldValue({ value: "SelectOne" });
      });

      it("Select approver for first inline", () => {
        SystemRequirement("REQ-4340");
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("[name*=\"fb-ia-inline-field\"] input").click();
          cy.get("ul[role=listbox]>li").contains(USERS[2].email).click();
        });
      });

      it("Save record", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.wait(5000);
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.DocPreview,
          CyRoutes.GetDocAggregatedAudit,
          CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

      context("Change textfield and approve again", () => {
        it("Enter text 'Second entry' in textfield for inline with bold tag to check if tags shows in history", () => {
          SystemRequirement("REQ-1080");
          cy.unClick();
          cy.get("[data-cy^=\"textfield-for-inline\"]").type(", <b> Second entry </b>");
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
          SystemRequirement("REQ-4400");
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.get("input[name=\"password\"]").clear().type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.DocPreview,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        it("Uncheck 'Red' and 'Green' value on checkbox", () => {
          SystemRequirement("FB-0430");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbUnSelectCheckboxValue( "Red", "Green" );
            cy.unClick();
          });
        });

        it("Check 'Blue' value on checkbox", () => {
          SystemRequirement("FB-0430");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectCheckboxValue( "Blue" );
            cy.unClick();
          });
        });

        it("Select 'Two' value on radiobutton", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectRadioButtonValue({ value: "Two" });
            cy.unClick();
          });
        });

        it("Select 'SelectTwo' value on select field", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
            cy.fbSelectFieldValue({ value: "SelectTwo" });
            cy.unClick();
          });
        });

        it("Save record", () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
          cy.wait(4000);
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
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().click();
          cy.wait(2000);
          cy.get("input[name=\"password\"]").clear().type("Tester1!");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.DocPreview,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
          // cy.wait(3000);
        });

        it("Navigate to released document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetDocAggregatedAudit], () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).click();
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
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(2).click();
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

