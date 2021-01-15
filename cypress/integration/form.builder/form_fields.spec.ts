// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
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

  context("FORM Input 'TextField' test", () => {
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

      context("Add form fields", () => {
        it("Add Text field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        });
      });

      context("Fill in TextField attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        });

        it("Enter rows '2'", () => {
          cy.fbEnterNameValue({ name: "rows", value: "2" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit TextField attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify TextField attributes", () => {
      it("Verify TextField label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify TextField placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      });

      it("Verify TextField rows", () => {
        cy.fbVerifyNameValue({ name: "rows", value: "2" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Checkbox Group' test", () => {
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

      context("Add form fields", () => {
        it("Add Checkbox group", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
        });
      });

      context("Fill in Checkbox group attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Checkbox Group attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Checkbox Group attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      });

      it("Verify checkboxes 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Autocomplete' test", () => {
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

      context("Add form fields", () => {
        it("Add Autocomplete", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        });
      });

      context("Fill in Autocomplete attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        });

        it("Select 'Document revisions' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
        });

        it("Check 'Multi', 'QR Scan', 'Revision', 'Deletion', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Autocomplete attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Autocomplete attributes", () => {
      it("Verify Autocomplete label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify Autocomplete placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      });

      it("Verify Autocomplete options 'Document revisions' ", () => {
        cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
      });

      it("Verify checkboxes 'Multi', 'QR Scan', 'Revision', 'Deletion', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Text Editor' test", () => {
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

      context("Add form fields", () => {
        it("Add Text Editor", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
        });
      });

      context("Fill in Text Editor attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Text Editor attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Text Editor attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Date Picker' test", () => {
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

      context("Add form fields", () => {
        it("Add Date Picker", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
        });
      });

      context("Fill in Date Picker attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Date Picker attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Date Picker attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Hyperlink' test", () => {
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

      context("Add form fields", () => {
        it("Add Hyperlink", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
        });
      });

      context("Fill in Hyperlink attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter linkUrl 'google.com'", () => {
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Hyperlink attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Hyperlink attributes", () => {
      it("Verify Hyperlink label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify Hyperlink linkUrl", () => {
        cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Select Field' test", () => {
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

      context("Add form fields", () => {
        it("Add Select Field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Select Field" });
        });
      });

      context("Fill in Select Field attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'None', 'Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
            "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Select Field attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Select Field attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      });

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      });

      it("Verify checkboxes 'None', 'Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("includeNone", "includeContext",
          "reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Radio Button group' test", () => {
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

      context("Add form fields", () => {
        it("Add Radio Button group", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
        });
      });

      context("Fill in Radio Button group attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Radio Button group attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Radio Button group attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      });

      it("Verify checkboxes 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Paragraph' test", () => {
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

      context("Add form fields", () => {
        it("Add Paragraph", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
        });
      });

      context("Fill in Paragraph attributes", () => {
        it("Enter paragraph", () => {
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().type("testing");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Paragraph attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Paragraph attributes", () => {
      it("Verify paragraph", () => {
        cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]").should("have.text", "testing");
      });
    });
  });

  context("FORM Input 'File Upload' test", () => {
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

      context("Add form fields", () => {
        it("Add File Upload", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
        });
      });

      context("Fill in File Upload attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit File Upload attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify File Upload attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Blank Template Form' test", () => {
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

      context("Add form fields", () => {
        it("Add Blank Template Form", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Blank Template Form" });
        });
      });

      context("Fill in Blank Template Form attributes", () => {
        it("Enter label 'test Blank Template Form'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test Blank Template Form" });
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Blank Template Form attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Blank Template Form attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test Blank Template Form" });
      });
    });
  });

  context("FORM Input 'Quantity' test", () => {
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

      context("Add form fields", () => {
        it("Add Quantity", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
        });
      });

      context("Fill in Quantity attributes", () => {
        it("Enter label 'test quantity'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test quantity" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Quantity attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Quantity attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test quantity" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Timer' test", () => {
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

      context("Add form fields", () => {
        it("Add Timer", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Timer" });
        });
      });

      context("Fill in Timer attributes", () => {
        it("Enter label 'test timer'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test timer" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Timer attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Timer attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test timer" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Approval Matrix' test", () => {
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

      context("Add form fields", () => {
        it("Add Approval Matrix", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
        });
      });

      context("Fill in Approval Matrix attributes", () => {
        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Approval Matrix attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Approval Matrix attributes", () => {
      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'PO Approval Matrix' test", () => {
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

      context("Add form fields", () => {
        it("Add PO Approval Matrix", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
        });
      });

      context("Fill in PO Approval Matrix attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit PO Approval Matrix attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify PO Approval Matrix attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Instructions Media upload' test", () => {
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

      context("Add form fields", () => {
        it("Add Instructions Media upload", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
        });
      });

      context("Fill in Instructions Media upload attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Instructions Media upload attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Instructions Media upload attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Evidence Media upload' test", () => {
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

      context("Add form fields", () => {
        it("Add Evidence Media upload", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
        });
      });

      context("Fill in Evidence Media upload attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Evidence Media upload attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Evidence Media upload attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Test Requirement' test", () => {
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

      context("Add form fields", () => {
        it("Add Test Requirement", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Test Requirement" });
        });
      });

      context("Fill in Test Requirement attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Select 'Document revisions' as options", () => {
          cy.get("[data-cy=\"testRequirement\"]")
            .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Test Requirement attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Test Requirement attributes", () => {
      it("Verify Test Requirement label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify Test Requirement options 'Document revisions' ", () => {
        cy.get("[data-cy=\"testRequirement\"]")
          .should("have.value",
            "Visual Alarm Indicator - The system shall use color as a visual indication of alarm type");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Procedure' test", () => {
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

      context("Add form fields", () => {
        it("Add Procedure", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
        });
      });

      context("Fill in Procedure attributes", () => {
        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Procedure attributes", () => {
      it("Click on Step #1 Edit icon", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").last().click({ force: true });
      });
    });

    context("Verify Procedure attributes", () => {
      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Input 'Text field with range' test", () => {
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

      context("Add form fields", () => {
        it("Add Text field with range", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
        });
      });

      context("Fill in Text field with range attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Enter label 'test placeholder'", () => {
          cy.fbEnterNameValue({ name: "placeholder", value: "test placeholder" });
        });

        it("Check 'Range', 'Critical to quality', 'Inspection' checkboxes", () => {
          cy.fbSelectCheckboxName("editorConfig.rangeOption",
            "editorConfig.criticalToQuality", "editorConfig.inspection");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Text field with range attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Text field with range attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      });

      it("Verify checkboxes 'Range', 'Critical to quality', 'Inspection'", () => {
        cy.fbVerifyCheckboxName("editorConfig.rangeOption",
          "editorConfig.criticalToQuality", "editorConfig.inspection");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Section 'Section' test", () => {
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

      context("Add form fields", () => {
        it("Add Section field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Section" });
        });
      });

      context("Fill in Section attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Inspection Section' checkboxes", () => {
          cy.fbSelectCheckboxValue("inspectionSection");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Section attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Section attributes", () => {
      it("Verify Section label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Inspection Section'", () => {
        cy.fbVerifyCheckboxValue("inspectionSection");
      });
    });
  });

  context("FORM Section 'Subsection' test", () => {
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

      context("Add form fields", () => {
        it("Add Subsection field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Subsection" });
        });
      });

      context("Fill in Subsection attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Subsection attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Subsection attributes", () => {
      it("Verify Subsection label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });
    });
  });

  context("FORM Section 'Step' test", () => {
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

      context("Add form fields", () => {
        it("Add Step field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Step" });
        });
      });

      context("Fill in Step attributes", () => {
        it("Enter label 'test step label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test step label" });
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Step attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Step attributes", () => {
      it("Verify Step label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test step label" });
      });
    });
  });

  context("FORM Section 'Test Step' test", () => {
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

      context("Add form fields", () => {
        it("Add Test Step field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Test Step" });
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Step attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Test Step attributes", () => {
      it("Verify Step label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "Step" });
      });
    });
  });

  context("FORM Approval 'Approvals' test", () => {
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

      context("Add form fields", () => {
        it("Add Approvals field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Approvals" });
        });
      });

      context("Fill in Approvals attributes", () => {
        it("Enter label 'test approval'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test approval" });
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Approvals attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Approvals attributes", () => {
      it("Verify approval", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test approval" });
      });
    });
  });

  context("FORM Approval 'Inline Approval' test", () => {
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

      context("Add form fields", () => {
        it("Add Inline Approval field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
        });
      });

      context("Fill in Inline Approval attributes", () => {
        it("Enter label 'test approval'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test approval" });
        });

        it("Select Approvers", () => {
          cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
        });

        it("Select Groups", () => {
          cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Inline Approval attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Inline Approval attributes", () => {
      it("Verify approval", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test approval" });
      });

      it("Verify Approvers", () => {
        cy.get("[data-cy=\"editorConfig.approvers\"]").parent().should("contain", USERS[1].email);
      });

      it("Verify Groups", () => {
        cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain", "Everyone");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Actions 'Action Button' test", () => {
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

      context("Add form fields", () => {
        it("Add Action Button field", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
        });
      });

      context("Fill in Action Button attributes", () => {
        it("Select checkboxes", () => {
          cy.fbSelectCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Action Button attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Action Button attributes", () => {
      it("Verify checkboxes", () => {
        cy.fbVerifyCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
      });
    });
  });

  context("FORM Buttons 'Checkpoint' test", () => {
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

      context("Add form fields", () => {
        it("Add Checkpoint", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
        });
      });

      context("Fill in Checkpoint attributes", () => {
        it("Enter label 'test checkpoint'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test checkpoint" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Checkpoint attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Checkpoint attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test checkpoint" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Buttons 'Create a Label' test", () => {
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

      context("Add form fields", () => {
        it("Add 'Create a Label'", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
        });
      });

      context("Fill in 'Create a Label' attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit 'Create a Label' attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify 'Create a Label' attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Buttons 'Implementation Task' test", () => {
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

      context("Add form fields", () => {
        it("Add 'Implementation Task'", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
        });
      });

      context("Fill in 'Implementation Task' attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit 'Implementation Task' attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify 'Implementation Task' attributes", () => {
      it("Verify label", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Instructions 'MPI' test", () => {
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

      context("Add form fields", () => {
        it("Add MPI", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "MPI" });
        });
      });

      context("Fill in MPI attributes", () => {
        it("Enter label 'test mpi'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test mpi" });
        });

        it("Select Document options", () => {
          cy.get("[data-cy=\"instructionsDocument\"]").type("FM-00001 - rev 1 - AR Form{downarrow}{enter}");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit MPI attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify MPI attributes", () => {
      it("Verify label 'test mpi'", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test mpi" });
      });

      it("Verify Document option ", () => {
        cy.get("[data-cy=\"instructionsDocument\"]").should("have.value", "FM-00001 - rev 1 - AR Form");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Instructions 'Select Document(s)' test", () => {
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

      context("Add form fields", () => {
        it("Add Select Document(s)", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
        });
      });

      context("Fill in Select Document(s) attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Select Options", () => {
          cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Select Document(s) attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Select Document(s) attributes", () => {
      it("Verify label 'test label'", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify Option ", () => {
        cy.get("[data-cy=\"options\"]").parent().should("contain", "AR Form");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });

  context("FORM Instructions 'Select Requirement(s)' test", () => {
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

      context("Add form fields", () => {
        it("Add Select Requirement(s)", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Select Requirement" });
        });
      });

      context("Fill in Select Requirement(s) attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Select Options", () => {
          cy.get("[data-cy=\"options\"]")
            .type("Visual Alarm Indicator - The system shall use color as a visual indication of{downarrow}{enter}");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Create FORM document", () => {
        it("Click create document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });

    context("Edit Select Requirement(s) attributes", () => {
      it("Click on Edit icon", () => {
        cy.fbEditHiddenBtn();
      });
    });

    context("Verify Select Requirement(s) attributes", () => {
      it("Verify label 'test label'", () => {
        cy.fbVerifyNameValue({ name: "label", value: "test label" });
      });

      it("Verify Option ", () => {
        cy.get("[data-cy=\"options\"]").parent().should("contain",
          "Visual Alarm Indicator - The system shall use color as a visual indication of alarm type");
      });

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      });
    });
  });
});
