// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("FORM Field test", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
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

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("FORM Input 'TextField' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 TextFields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByName({ name: "test-label-1-" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify TextField checkbox property", () => {
        it("Verify TextField without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByName({ name: "test-label-1-" } );
          cy.fbVerifyElementVisibile({ name: "test-label-1-", el: "edit-schema-item" });
          cy.fbVerifyElementVisibile({ name: "test-label-1-", el: "remove-schema-item" });
        });

        it("Verify TextField with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByName({ name: "test-label-2-" } );
          cy.fbVerifyElementNotVisibile({ name: "test-label-2-", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibile({ name: "test-label-2-", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 TextFields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByName({ name: "test-label-1-" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify TextField checkbox property", () => {
        it("Verify TextField without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClass({ name: "test-label-1-", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify TextField with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClass({
            name: "test-label-2-", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Checkbox Group' checkbox test", () => {
    context("'Include Other' checkbox test", () => {
      context("Add 2 Checkbox Groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Include Other' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Include Other' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" });
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Include Other' checkbox", () => {
            cy.fbSelectCheckboxValue("includeContext");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Checkbox Group checkbox property", () => {
        it("Verify Checkbox Group without 'Include Other' checkbox", () => {
          cy.fbVerifyElementNotContainText({ name: "test-label-1-", label: "test label1", text: "Other" });
        });

        it("Verify Checkbox Group with 'Include Other' checkbox", () => {
          cy.fbVerifyElementContainText({ name: "test-label-2-", label: "test label2", text: "Other" });
        });
      });
    });

    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Checkbox Groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Checkbox Group", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Checkbox Group", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Checkbox Group checkbox property", () => {
        it("Verify Checkbox Group without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Checkbox Group with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Checkbox Groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Checkbox Group", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Checkbox Group", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Checkbox Group checkbox property", () => {
        it("Verify Checkbox Group without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Checkbox Group with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Autocomplete' checkbox test", () => {
    context("'Multi Select' checkbox test", () => {
      context("Create document with 2 Autocompletes", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Multi Select' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Multi Select' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Check 'Multi Select' checkbox", () => {
            cy.fbSelectCheckboxValue("multiple");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      context("Verify Autocomplete checkbox property", () => {
        it("Click Form Review", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Verify Autocomplete without 'Multi Select' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-1-\"]")
            .click()
            .type("{downarrow}{enter}")
            .should("not.have.value", "");
        });

        it("Verify Autocomplete with 'Multi Select' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-2-\"]")
            .click()
            .type("{downarrow}{enter}")
            .click()
            .type("{downarrow}{downarrow}{enter}")
            .should("have.value", "")
            .parent().get(".MuiAutocomplete-tag").should(($tag) => {
              expect($tag).to.have.length(2);
            });
        });
      });
    });

    context("'Include QR Scan' checkbox test", () => {
      context("Create & Release FORM document with 2 Autocompletes", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Include QR Scan' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Include QR Scan' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Check 'Include QR Scan' checkbox", () => {
            cy.fbSelectCheckboxValue("includeQRScan");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Autocomplete checkbox property", () => {
        it("Verify Autocomplete without 'Include QR Scan' checkbox", () => {
          cy.contains("test label1").parentsUntil("li").find(".MuiTypography-root")
            .should("not.contain", "Scan QR code");
        });

        it("Verify Autocomplete with 'Include QR Scan' checkbox", () => {
          cy.contains("test label2").parentsUntil("li").find(".MuiTypography-root").should("contain", "Scan QR code");
        });
      });
    });

    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Autocompletes", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Autocomplete checkbox property", () => {
        it("Verify Autocomplete without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Autocomplete with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Autocompletes", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Autocomplete", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Autocomplete checkbox property", () => {
        it("Verify Autocomplete without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Autocomplete with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Text Editor' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Text Editors", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Text Editor", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Text Editor", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Text Editor checkbox property", () => {
        it("Verify Text Editor without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Text Editor with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Text Editors", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Text Editor", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Text Editor", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Text Editor checkbox property", () => {
        it("Verify Text Editor without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Text Editor with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Date picker' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Date pickers", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Date picker checkbox property", () => {
        it("Verify Date picker without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Date picker with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Date pickers", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Date picker checkbox property", () => {
        it("Verify Date picker without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Date picker with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Hyperlink' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Hyperlinks", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Hyperlink", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter linkUrl 'google.com'", () => {
            cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Hyperlink", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter linkUrl 'google.com'", () => {
            cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Hyperlink checkbox property", () => {
        it("Verify Hyperlink without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Hyperlink with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Hyperlinks", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Hyperlink", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter linkUrl 'google.com'", () => {
            cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Hyperlink", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter linkUrl 'google.com'", () => {
            cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Hyperlink checkbox property", () => {
        it("Verify Hyperlink without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Hyperlink with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Select Field' checkbox test", () => {
    context("'Include None' checkbox test", () => {
      context("Add 2 Select Fields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Include None' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Include None' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Include None' checkbox", () => {
            cy.fbSelectCheckboxValue("includeNone");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      context("Verify Select Field checkbox property", () => {
        it("Click Form Review", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Verify Select Field without 'Include None' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[id^=mui-component-select-test-label-1-]").click();
          cy.get("[id^=menu-test-label-1-] ul").should("not.contain", "None");
          cy.get("[id^=menu-test-label-1-] ul").click();
        });

        it("Verify Select Field with 'Include None' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[id^=mui-component-select-test-label-2-]").click();
          cy.get("[id^=menu-test-label-2-] ul").should("contain", "None");
        });
      });
    });

    context("'Include Other' checkbox test", () => {
      context("Add 2 Select Fields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Include Other' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Include Other' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Include Other' checkbox", () => {
            cy.fbSelectCheckboxValue("includeContext");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      context("Verify Select Field checkbox property", () => {
        it("Click Form Review", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Verify Select Field without 'Include Other' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[id^=mui-component-select-test-label-1-]").click();
          cy.get("[id^=menu-test-label-1-] ul").should("not.contain", "Other");
          cy.get("[id^=menu-test-label-1-] ul").click();
        });

        it("Verify Select Field with 'Include Other' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[id^=mui-component-select-test-label-2-]").click();
          cy.get("[id^=menu-test-label-2-] ul").should("contain", "Other");
        });
      });
    });

    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Select Fields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Select Field checkbox property", () => {
        it("Verify Select Field without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Field with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Select Fields", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Select Field checkbox property", () => {
        it("Verify Select Field without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Select Field with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Radio Button group' checkbox test", () => {
    context("'Include Other' checkbox test", () => {
      context("Add 2 Radio Button groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Include Other' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Include Other' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByLabel({ label: "test label1" });
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Include Other' checkbox", () => {
            cy.fbSelectCheckboxValue("includeContext");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Radio Button group checkbox property", () => {
        it("Verify Radio Button group without 'Include Other' checkbox", () => {
          cy.contains("test label1").parentsUntil("li").should("not.contain", "Other");
        });

        it("Verify Radio Button group with 'Include Other' checkbox", () => {
          cy.contains("test label2").parentsUntil("li").should("contain", "Other");
        });
      });
    });

    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Radio Button groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Radio Button group", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Radio Button group", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Radio Button group checkbox property", () => {
        it("Verify Radio Button group without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Radio Button group with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Radio Button groups", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Radio Button group", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Radio Button group", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Radio Button group checkbox property", () => {
        it("Verify Radio Button group without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Radio Button group with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'File Upload' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 File Uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify File Upload checkbox property", () => {
        it("Verify File Upload without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify File Upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 File Uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify File Upload checkbox property", () => {
        it("Verify File Upload without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify File Upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Quantity' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Quantities", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Quantity checkbox property", () => {
        it("Verify Quantity without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Quantity with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Quantities", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Quantity checkbox property", () => {
        it("Verify Quantity without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Quantity with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Timer' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Timers", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Timer" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.get(`button[data-cy="form.builder.timer"]`).click();
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Timer checkbox property", () => {
        it("Verify Timer without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Timer with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Timers", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Timer" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.get(`button[data-cy="form.builder.timer"]`).click();
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Timer checkbox property", () => {
        it("Verify Timer without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Timer with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Approval Matrix' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Approval Matrix", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Approval Matrix checkbox property", () => {
        it("Verify Approval Matrix with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "Approval Roles" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "Approval Roles", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "Approval Roles", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add Approval Matrix", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Approval Matrix", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Approval Matrix checkbox property", () => {
        it("Verify Approval Matrix with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Approval Roles", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'PO Approval Matrix' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 PO Approval Matrixs", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify PO Approval Matrix checkbox property", () => {
        it("Verify PO Approval Matrix without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify PO Approval Matrix with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 PO Approval Matrixs", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify PO Approval Matrix checkbox property", () => {
        it("Verify PO Approval Matrix without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify PO Approval Matrix with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Instructions Media upload' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Instructions Media uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Instructions Media upload checkbox property", () => {
        it("Verify Instructions Media upload without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Instructions Media upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Instructions Media uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Instructions Media upload checkbox property", () => {
        it("Verify Instructions Media upload without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Instructions Media upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Evidence Media upload' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Evidence Media uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Evidence Media upload checkbox property", () => {
        it("Verify Evidence Media upload without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Evidence Media upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Evidence Media uploads", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Evidence Media upload checkbox property", () => {
        it("Verify Evidence Media upload without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Evidence Media upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Test Requirement' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Test Requirements", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Test Requirement checkbox property", () => {
        it("Verify Test Requirement without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Test Requirement with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Test Requirements", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Test Requirement checkbox property", () => {
        it("Verify Test Requirement without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Test Requirement with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Procedure' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Procedure", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Procedure checkbox property", () => {
        it("Verify Procedure with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "Step #1" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "Step #1", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "Step #1", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add Procedure", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Procedure", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Procedure checkbox property", () => {
        it("Verify Procedure with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "Step #1", el: "remove-schema-item", class:
            "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Input 'Text field with range' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Text field with ranges", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Text field with range checkbox property", () => {
        it("Verify Text field with range without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Text field with range with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Text field with ranges", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Text field with range checkbox property", () => {
        it("Verify Text field with range without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Text field with range with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Approval 'Inline Approval' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Inline Approvals", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Inline Approval checkbox property", () => {
        it("Verify Inline Approval without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Inline Approval with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Inline Approvals", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Inline Approval checkbox property", () => {
        it("Verify Inline Approval without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Inline Approval with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Buttons 'Checkpoint' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Checkpoints", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Checkpoint checkbox property", () => {
        it("Verify Checkpoint without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Checkpoint with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Checkpoints", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Checkpoint checkbox property", () => {
        it("Verify Checkpoint without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Checkpoint with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Buttons 'Create a Label' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Create a Labels", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Create a Label checkbox property", () => {
        it("Verify Create a Label without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Create a Label with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Create a Labels", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Create a Label checkbox property", () => {
        it("Verify Create a Label without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Create a Label with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Buttons 'Implementation Task' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Implementation Tasks", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Implementation Task checkbox property", () => {
        it("Verify Implementation Task without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Implementation Task with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Implementation Tasks", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Implementation Task checkbox property", () => {
        it("Verify Implementation Task without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Implementation Task with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Instructions 'MPI' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 MPIs", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add MPI", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add MPI", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify MPI checkbox property", () => {
        it("Verify MPI without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify MPI with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 MPIs", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add MPI", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add MPI", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify MPI checkbox property", () => {
        it("Verify MPI without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify MPI with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Instructions 'Select Document(s)' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Select Document(s)", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Select Document(s)", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Select Document(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Select Document(s) checkbox property", () => {
        it("Verify Select Document(s) without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Document(s) with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Select Document(s)", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Select Document(s)", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Select Document(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Select Document(s) checkbox property", () => {
        it("Verify Select Document(s) without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Select Document(s) with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Instructions 'Select Requirement(s)' checkbox test", () => {
    context("'Revision Disabled' checkbox test", () => {
      context("Create & Release FORM document with 2 Select Requirement(s)", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Revision Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Check 'Revision Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("reviseDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });

      context("Verify Select Requirement(s) checkbox property", () => {
        it("Verify Select Requirement(s) without 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label1" } );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Requirement(s) with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2" } );
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "edit-schema-item" });
          cy.fbVerifyElementNotVisibileByLabel({ label: "test label2", el: "remove-schema-item" });
        });
      });
    });

    context("'Deletion Disabled' checkbox test", () => {
      context("Add 2 Select Requirement(s)", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        context("Add form fields without 'Deletion Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1" } );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]")
              .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
          });

          it("Check 'Deletion Disabled' checkbox", () => {
            cy.fbSelectCheckboxValue("deleteDisabled");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });
      });

      context("Verify Select Requirement(s) checkbox property", () => {
        it("Verify Select Requirement(s) without 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label1", el: "remove-schema-item",
            class: "MuiSvgIcon-colorError",
          });
        });

        it("Verify Select Requirement(s) with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({
            label: "test label2", el: "remove-schema-item",
            class: "MuiSvgIcon-colorDisabled",
          });
        });
      });
    });
  });

  context("FORM Actions 'Action Button' test", () => {
    context("'Send Email & Send Email with Supplier' checkbox test", () => {
      context("Create FORM document", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        it("Add Action Button field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
        });

        it("Select checkboxes", () => {
          cy.fbSelectCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      context("Verify checkbox property", () => {
        it("Click Form Review", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Verify 'Send Email' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy=\"fb-control-btn\"]").eq(0)
            .click();
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Email\"]").should("contain", "Email");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Name\"]").should("contain", "Name");
          cy.fbClickButton({ el: "form.builder.cancel" });
        });

        it("Verify 'Send Email with Supplier' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy=\"fb-control-btn\"]").eq(1)
            .click();
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Email\"]").should("contain", "Email");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Name\"]").should("contain", "Name");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Supplier\"]").should("contain", "Supplier");
        });
      });
    });
  });

  context("Checkbox 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add TextField with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "textfield-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByName({ name: "textfield-wi-copy-" } );
        });

        it("Add TextField without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "textfield-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByName({ name: "textfield-wo-copy-" } );
        });

        it("Add Checkbox group with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbEnterNameValue({ name: "label", value: "cbg-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "cbg-wi-copy" });
        });

        it("Add Checkbox group without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "cbg-wo-copy" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "cbg-wo-copy" });
        });

        it("Add Text Editor with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "te-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "te-wi-copy" } );
        });

        it("Add Text Editor without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          cy.fbEnterNameValue({ name: "label", value: "te-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "te-wo-copy" } );
        });

        it("Add Select Field with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          cy.fbEnterNameValue({ name: "label", value: "sf-wi-copy" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "sf-wi-copy" } );
        });

        it("Add Select Field without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          cy.fbEnterNameValue({ name: "label", value: "sf-wo-copy" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "sf-wo-copy" } );
        });

        it("Add Radio Button group with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "rbg-wi-copy" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "rbg-wi-copy" } );
        });

        it("Add Radio Button group without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "rbg-wo-copy" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "rbg-wo-copy" } );
        });

        it("Add Quantity with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "q-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "q-wi-copy" } );
        });

        it("Add Quantity without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "q-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "q-wo-copy" } );
        });

        it("Add Timer with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
          cy.fbEnterNameValue({ name: "label", value: "t-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "t-wi-copy" } );
        });

        it("Add Timer without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
          cy.fbEnterNameValue({ name: "label", value: "t-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "t-wo-copy" } );
        });

        it("Add Text field with range with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "twr-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "twr-wi-copy" } );
        });

        it("Add Text field with range without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "twr-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "twr-wo-copy" } );
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Enter title: 'test title'", () => {
        cy.get("#Title-field").type("test title");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Add TextFields value", () => {
        cy.get("[name^=\"textfield-wi-copy-\"]").type("textfield-wi-copy-value");
        cy.wait(3000);
        cy.get("[name^=\"textfield-wo-copy-\"]").type("textfield-wo-copy-value");
        cy.wait(3000);
      });

      it("Select Checkboxes group", () => {
        cy.get("[name^=\"cbg-wi-copy-\"]").find("label").eq(0).click();
        cy.wait(3000);
        cy.get("[name^=\"cbg-wo-copy-\"]").find("label").eq(0).click();
        cy.wait(3000);
      });

      it("Add TextEditors value", () => {
        cy.get("[data-cy^=\"te-wi-copy-\"]").find("div[contenteditable]")
          .click({ force: true }).clear().type("te-wi-copy-value");
        cy.wait(3000);
        cy.get("[data-cy^=\"te-wo-copy-\"]").find("div[contenteditable]")
          .click({ force: true }).clear().type("te-wo-copy-value");
        cy.wait(3000);
      });

      it("Select 'Select fields' value", () => {
        cy.get("[id^=mui-component-select-sf-wi-copy-]").click();
        cy.get("[data-value=\"option1\"]").click();
        cy.wait(5000);
        cy.get("[id^=mui-component-select-sf-wo-copy-]").click();
        cy.get("[data-value=\"option1\"]").click();
        cy.wait(5000);
      });

      it("Select Radio button groups value", () => {
        cy.get("[name^=\"rbg-wi-copy-\"]").eq(0).click();
        cy.wait(3000);
        cy.get("[name^=\"rbg-wo-copy-\"]").eq(0).click();
        cy.wait(3000);
      });

      it("Add Quantities value", () => {
        cy.get("[name^=\"q-wi-copy-\"]").type("1");
        cy.wait(3000);
        cy.get("[name^=\"q-wo-copy-\"]").type("1");
        cy.wait(3000);
      });

      it("Add Timers value", () => {
        cy.get("[name^=\"t-wi-copy-\"]").type("t-wi-copy-value");
        cy.wait(3000);
        cy.get("[name^=\"t-wo-copy-\"]").type("t-wo-copy-value");
        cy.wait(3000);
      });

      it("Add 'TextField with range' value", () => {
        cy.get("[name^=\"twr-wi-copy-\"]").type("2");
        cy.wait(3000);
        cy.get("[name^=\"twr-wo-copy-\"]").type("2");
        cy.wait(3000);
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
      });
    });

    context("Verify fields", () => {
      it("Verify 'TextField' values", () => {
        cy.get("[name^=\"textfield-wi-copy-\"]").should("have.value", "textfield-wi-copy-value");
        cy.get("[name^=\"textfield-wo-copy-\"]").should("not.have.value", "textfield-wo-copy-value");
      });

      it("Verify 'Checkboxes group' values", () => {
        cy.get("[name^=\"cbg-wi-copy-\"]").find("input").eq(0).should("be.checked");
        cy.get("[name^=\"cbg-wo-copy-\"]").find("input").eq(0).should("not.be.checked");
      });

      it("Verify TextEditor with Editor values", () => {
        cy.get("[data-cy^=\"te-wi-copy-\"]").find("div[contenteditable]").should("have.text", "te-wi-copy-value");
        cy.get("[data-cy^=\"te-wo-copy-\"]").find("div[contenteditable]").invoke("val").should("be.empty");
      });

      it("Verify Select fields values", () => {
        cy.get("[name^=\"sf-wi-copy-\"]").should("have.value", "option1");
        cy.get("[name^=\"sf-wo-copy-\"]").invoke("val").should("be.empty");
      });

      it("Verify Radio button groups values", () => {
        cy.get("[name^=\"rbg-wi-copy-\"]").eq(0).should("have.value", "option1");
        cy.get("[name^=\"rbg-wo-copy-\"]").eq(0).should("not.be.checked");
      });

      it("Verify Quantities values", () => {
        cy.get("[name^=\"q-wi-copy-\"]").should("have.value", "1");
        cy.get("[name^=\"q-wo-copy-\"]").invoke("val").should("be.empty");
      });

      it("Verify Timers values", () => {
        cy.get("[name^=\"t-wi-copy-\"]").should("have.value", "t-wi-copy-value");
        cy.get("[name^=\"t-wo-copy-\"]").invoke("val").should("be.empty");
      });

      it("Verify TextField with range values", () => {
        cy.get("[name^=\"twr-wi-copy-\"]").should("have.value", "2");
        cy.get("[name^=\"twr-wo-copy-\"]").invoke("val").should("be.empty");
      });
    });
  });

  context("Checkbox DatePicker & PurchaseOrder 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title1'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title1" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add Date picker with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "dp-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "dp-wi-copy" } );
        });

        it("Add Date picker without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          cy.fbEnterNameValue({ name: "label", value: "dp-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "dp-wo-copy" } );
        });

        it("Add Purchase Order with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
          cy.fbEnterNameValue({ name: "label", value: "po-wi-copy" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "po-wi-copy" } );
        });

        it("Add Purchase Order without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
          cy.fbEnterNameValue({ name: "label", value: "po-wo-copy" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "po-wo-copy" } );
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title1{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title1'", () => {
        cy.get("#Title-field").type("test title1");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Add Date pickers value", () => {
        cy.get("[name^=\"dp-wi-copy-\"]").parent().find("button").click();
        cy.get(".MuiPickersDay-daySelected").click();
        cy.wait(3000);
        cy.get("[name^=\"dp-wo-copy-\"]").parent().find("button").click();
        cy.wait(3000);
        cy.get(".MuiPickersDay-daySelected").click();
        cy.wait(5000);
      });

      it("Add Purchase Orders value", () => {
        cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wi-copy-\"]").click();
        cy.get("[data-value=EUR]").click();
        cy.wait(3000);
        cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wo-copy-\"]").click();
        cy.get("[data-value=EUR]").click();
        cy.wait(3000);
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
      });
    });

    context("Verify fields", () => {
      it("Verify Date pickers values", () => {
        cy.get("input[name^=\"dp-wi-copy-\"]").invoke("val").should("not.be.empty");
        cy.get("input[name^=\"dp-wo-copy-\"]").should("have.value", "");
      });

      it("Verify Purchase Orders values", () => {
        cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wi-copy-\"]").should("have.text", "EUR €");
        cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wo-copy-\"]").should("have.text", "USD $");
      });
    });
  });

  context("Checkbox Autocomplete 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title3'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title3" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add Autocomplete with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "ac-wi-copy" });
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.wait(2000);
          cy.fbMouseOverByLabel({ label: "ac-wi-copy" });
        });

        it("Add Autocomplete without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "ac-wo-copy" });
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
          cy.fbAddNewFieldButton();
          cy.wait(2000);
          cy.fbMouseOverByLabel({ label: "ac-wo-copy" });
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title3{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title3'", () => {
        cy.get("#Title-field").type("test title3");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Select Autocompletes", () => {
        cy.get("[data-cy^=\"ac-wi-copy-\"]").click().type("{downarrow}{enter}");
        cy.wait(3000);
        cy.get("[data-cy^=\"ac-wo-copy-\"]").click().type("{downarrow}{enter}");
        cy.wait(3000);
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
      });
    });

    context("Verify fields", () => {
      it("Verify Autocompletes values", () => {
        cy.get("[data-cy^=\"ac-wi-copy-\"]").invoke("val").should("not.be.empty");
        cy.get("[data-cy^=\"ac-wo-copy-\"]").should("have.value", "");
      });
    });
  });

  context("Checkbox Approval Matrix with 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title4'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title4" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add Approval Matrix with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.wait(2000);
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title4{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title4'", () => {
        cy.get("#Title-field").type("test title4");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Click on 'Add Another Role' button", () => {
        cy.get("button[data-cy=\"form.builder.add.another.role\"]").click();
      });

      it("Enter Approval Role 'Role 1'", () => {
        cy.get("[data-cy=\"name\"]").type("Role 1");
      });

      it("Click on 'Add' button", () => {
        cy.get("button[data-cy=\"common.add\"]").click();
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
      });
    });

    context("Verify fields", () => {
      it("Verify Approval Matrix values", () => {
        cy.get("[data-cy=\"form.builder.approval.role\"]").parentsUntil("MuiFormControl-root")
          .find("input.MuiInputBase-input").invoke("val").should("not.be.empty");
      });

      it("Verify Approval Matrix fields", () => {
        cy.contains("Approval Role").should("exist");
        cy.contains("Approving Users").should("exist");
        cy.contains("Approving Groups").should("exist");
      });
    });
  });

  context("Checkbox Approval Matrix without 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title5'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title5" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields without Copyable value Checkbox", () => {
        it("Add Approval Matrix without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
          cy.fbAddNewFieldButton();
          cy.wait(2000);
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title5{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title5'", () => {
        cy.get("#Title-field").type("test title5");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Click on 'Add Another Role' button", () => {
        cy.get("button[data-cy=\"form.builder.add.another.role\"]").click();
      });

      it("Enter Approval Role 'Role 2'", () => {
        cy.get("[data-cy=\"name\"]").type("Role 2");
      });

      it("Click on 'Add' button", () => {
        cy.get("button[data-cy=\"common.add\"]").click();
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
      });
    });

    context("Verify fields", () => {
      it("Verify Approval Matrix fields", () => {
        cy.contains("Approval Role").should("not.exist");
        cy.contains("Approving Users").should("not.exist");
        cy.contains("Approving Groups").should("not.exist");
      });
    });
  });

  context("Checkbox Procedure 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title7'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title7" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add Procedure with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "Step #1" } );
        });

        it("Add Procedure without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
          cy.fbUnSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title7{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title7'", () => {
        cy.get("#Title-field").type("test title7");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Enter Step #1 description", () => {
        cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
          .find("div[contenteditable]").click({ force: true }).clear().type("step1 description");
      });

      it("Enter Step #2 description", () => {
        cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
          .find("div[contenteditable]").click({ force: true }).clear().type("step2 description");
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
        cy.wait(5000);
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
        cy.wait(5000);
      });
    });

    context("Verify fields", () => {
      it("Verify Procedure", () => {
        cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
          .find("div").eq(-1).invoke("text").should("not.be.empty");
        cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
          .find("div").eq(-1).invoke("text").should("be.empty");
      });
    });
  });

  context("Checkbox Equipment Maintenance 'Copyable value' test", () => {
    context("Create 'Engineering Build' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'eb-title8'", () => {
        cy.drEnterDocumentTitle({ name: "eb-title8" });
      });

      it("Enter document description 'eb description'", () => {
        cy.drEnterDocumentDescription({ description: "eb description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
        cy.unClick();
      });

      context("Add Fields with Copyable value Checkbox", () => {
        it("Add Equipment Maintenance with 'Copyable Value' checkbox", () => {
          cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
          cy.get("[data-cy=\"form.builder.add.field\"]").click();
          cy.fbSelectItemFromNewFieldList({ field: "Equipment Maintenance" });
          cy.fbEnterNameValue({ name: "label", value: "em-wi-copy" });
          // cy.contains("Preventative Maintenance").click();
          cy.get("input[value=\"preventativeMaintenance\"]").click();
          cy.fbSelectCheckboxValue("copyableValue");
          cy.fbAddNewFieldButton();
          cy.fbMouseOverByLabel({ label: "em-wi-copy" } );
        });

        it("Add Equipment Maintenance without 'Copyable Value' checkbox", () => {
          cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
          cy.fbSelectItemFromNewFieldList({ field: "Equipment Maintenance" });
          cy.fbEnterNameValue({ name: "label", value: "em-wo-copy" });
          // cy.contains("Preventative Maintenance").click();
          cy.get("input[value=\"preventativeMaintenance\"]").click();
          cy.fbAddNewFieldButton();
        });

        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Approve and release FORM document", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
            cy.fbClickButton({ el: "updateRecord" });
          });
        });
      });
    });

    context("Create 'Engineering Build' Record", () => {
      it("Navigate to Record on side bar", () => {
        cy.fbClickButton({ el: "navigation.records" });
      });

      it("Click 'Create a Record' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Select Record Type: 'Engineering Build'", () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });

      it("Select template", () => {
        cy.get("#field-selectType").parent().then((res) => {
          if (res.find("#MultipleFormTemplate-selectDocType").length > 0) {
            cy.get("#MultipleFormTemplate-selectDocType").click().type("eb-title8{downarrow}{enter}");
          }
        });
      });

      it("Enter title: 'test title8'", () => {
        cy.get("#Title-field").type("test title8");
      });

      it("Enter description: 'test description'", () => {
        cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("test description");
      });

      it("Select radio button of with copyableValue checkbox Equipment Maintenance", () => {
        cy.get("input[name^=\"em-wi-copy-\"]").eq(-1).click();
      });

      it("Enter Justification of with copyableValue checkbox Equipment Maintenance", () => {
        cy.get("[data-cy^=\"em-wi-copy-\"]").find("div[contenteditable]")
          .click({ force: true }).clear().type("Justification1");
      });

      it("Select radio button of without copyableValue checkbox Equipment Maintenance", () => {
        cy.get("input[name^=\"em-wo-copy-\"]").eq(-1).click();
      });

      it("Enter Justification of without copyableValue checkbox Equipment Maintenance", () => {
        cy.get("[data-cy^=\"em-wo-copy-\"]").find("div[contenteditable]")
          .click({ force: true }).clear().type("Justification2");
      });

      it("Click 'Save' button", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
        cy.wait(5000);
      });

      it("Click 'Clone EB' button", () => {
        cy.fbClickButton({ el: "CloneEBButton" });
        cy.wait(5000);
      });
    });

    context("Verify fields", () => {
      it("Verify Equipment Maintenance", () => {
        cy.get("[data-cy^=\"em-wi-copy-\"]").find("div[contenteditable]").parent()
          .find("div").eq(-1).invoke("text").should("not.be.empty");
        cy.get("input[name^=\"em-wo-copy-\"]").eq(-1).should("not.be.checked");
      });
    });
  });
});
