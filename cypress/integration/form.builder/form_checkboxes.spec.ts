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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByName({ name: "test-label-1-"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByName({ name: "test-label-1-"} );
          cy.fbVerifyElementVisibile({ name: "test-label-1-", el: "edit-schema-item" });
          cy.fbVerifyElementVisibile({ name: "test-label-1-", el: "remove-schema-item" });
        });

        it("Verify TextField with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByName({ name: "test-label-2-"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        })

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Text field", () => {
            cy.fbMouseOverByName({ name: "test-label-1-"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClass({ name: "test-label-2-", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Checkbox Group with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        })

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Checkbox Group", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Checkbox Group with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[data-cy^=\"test-label-1-\"]")
            .click()
            .type("{downarrow}{enter}")
            .should("not.have.value", "");
        });

        it("Verify Autocomplete with 'Multi Select' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[data-cy^=\"test-label-2-\"]")
            .click()
            .type("{downarrow}{enter}")
            .click()
            .type("{downarrow}{downarrow}{enter}")
            .should("have.value", "")
            .parent().get('.MuiAutocomplete-tag').should(($tag) => {
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.contains("test label1").parentsUntil('li').find(".MuiTypography-root").should('not.contain', "Scan QR code");
        });

        it("Verify Autocomplete with 'Include QR Scan' checkbox", () => {
          cy.contains("test label2").parentsUntil('li').find(".MuiTypography-root").should('contain', "Scan QR code");
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Autocomplete with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Autocomplete with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Text Editor with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Text Editor with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Date picker with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Date picker", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Date picker with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Hyperlink with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Hyperlink with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[id^=mui-component-select-test-label-1-]").click();
          cy.get("[id^=menu-test-label-1-] ul").should("not.contain", "None");
          cy.get("[id^=menu-test-label-1-] ul").click();
        });

        it("Verify Select Field with 'Include None' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[id^=mui-component-select-test-label-2-]").click();
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[id^=mui-component-select-test-label-1-]").click();
          cy.get("[id^=menu-test-label-1-] ul").should("not.contain", "Other");
          cy.get("[id^=menu-test-label-1-] ul").click();
        });

        it("Verify Select Field with 'Include Other' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[id^=mui-component-select-test-label-2-]").click();
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Field with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        })

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Select Field", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Select Field with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.contains("test label1").parentsUntil('li').should('not.contain', "Other");
        });

        it("Verify Radio Button group with 'Include Other' checkbox", () => {
          cy.contains("test label2").parentsUntil('li').should('contain', "Other");
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Radio Button group with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Enter options", () => {
            cy.fbGroupOptions("option1", "option2");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        })

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Radio Button group", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Radio Button group with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify File Upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add File Upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify File Upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Quantity with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Quantity", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Quantity with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.get(`button[data-cy="form.builder.timer"]`).click();
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Timer with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Timer", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.get(`button[data-cy="form.builder.timer"]`).click();
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Timer with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
          cy.fbMouseOverByLabel({ label: "Approval Roles"} )
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
          cy.fbVerifyElementClassByLabel({ label: "Approval Roles", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify PO Approval Matrix with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add PO Approval Matrix", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify PO Approval Matrix with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Instructions Media upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Instructions Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Instructions Media upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Evidence Media upload with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Evidence Media upload", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Evidence Media upload with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Test Requirement with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Test Requirement", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select 'Document revisions' as options", () => {
            cy.get("[data-cy=\"testRequirement\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Test Requirement with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
          cy.fbMouseOverByLabel({ label: "Step #1"} )
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
          cy.fbVerifyElementClassByLabel({ label: "Step #1", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Text field with range with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Text field with range", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Text field with range with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          })

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          })

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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Inline Approval with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          })

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Inline Approval", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select Approvers", () => {
            cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
          });

          it("Select Groups", () => {
            cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
          })

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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Inline Approval with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Checkpoint with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Checkpoint", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Checkpoint with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Create a Label with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Create a Label", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Create a Label with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Implementation Task with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Implementation Task", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Implementation Task with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify MPI with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "MPI" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify MPI with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Document(s) with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
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
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Select Document(s) with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Revision Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
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
          cy.fbMouseOverByLabel({ label: "test label1"} );
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "edit-schema-item" });
          cy.fbVerifyElementVisibileByLabel({ label: "test label1", el: "remove-schema-item" });
        });

        it("Verify Select Requirement(s) with 'Revision Disabled' checkbox", () => {
          cy.fbMouseOverByLabel({ label: "test label2"} )
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
            cy.fbEnterNameValue({ name:"label", value: "test label1" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Add form fields with 'Deletion Disabled' checkbox ", () => {
          it("Add Select Requirement(s)", () => {
            cy.fbMouseOverByLabel({ label: "test label1"} );
            cy.fbClickButton({ el: "form.builder.add.field" });
            cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
          });

          it("Enter label", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label2" });
          });

          it("Select Options", () => {
            cy.get("[data-cy=\"options\"]").type("Visual Alarm Indicator - The system shall use color as a visual indication of alarm type{downarrow}{enter}");
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
          cy.fbVerifyElementClassByLabel({ label: "test label1", el: "remove-schema-item", class: "MuiSvgIcon-colorError" });
        });

        it("Verify Select Requirement(s) with 'Deletion Disabled' checkbox", () => {
          cy.fbVerifyElementClassByLabel({ label: "test label2", el: "remove-schema-item", class: "MuiSvgIcon-colorDisabled" });
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
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root')
            .find("[data-cy=\"fb-control-btn\"]").eq(0)
            .click();
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Email\"]").should("contain", "Email");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Name\"]").should("contain", "Name");
          cy.fbClickButton({ el: "form.builder.cancel" })
        });

        it("Verify 'Send Email with Supplier' checkbox", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root')
            .find("[data-cy=\"fb-control-btn\"]").eq(1)
            .click();
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Email\"]").should("contain", "Email");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Name\"]").should("contain", "Name");
          cy.get(".MuiDialog-container").eq(1).find("[data-cy=\"Supplier\"]").should("contain", "Supplier");
        });
      });
    });
  });
});
