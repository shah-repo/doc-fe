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

  context("FORM TextField test", () => {
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
      })

      context("Fill in TextField attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        });

        it("Enter rows '2'", () => {
          cy.fbEnterNameValue({ name: "rows", value: "2" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify TextField placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      })

      it("Verify TextField rows", () => {
        cy.fbVerifyNameValue({ name: "rows", value: "2" });
      })

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Checkbox Group test", () => {
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
      })

      context("Fill in Checkbox group attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["includeContext", "reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      })

      it("Verify checkboxes 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Autocomplete test", () => {
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
      })

      context("Fill in Autocomplete attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        });

        it("Select 'Document revisions' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
        });

        it("Check 'Multi Select', 'Include QR Scan', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify Autocomplete placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      })

      it("Verify Autocomplete options 'Document revisions' ", () => {
        cy.get("[data-cy=\"optionId\"]").should("have.value", 'Document revisions');
      })

      it("Verify checkboxes 'Multi Select', 'Include QR Scan', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Text Editor test", () => {
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
      })

      context("Fill in Text Editor attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      })

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Date Picker test", () => {
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
      })

      context("Fill in Date Picker attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Hyperlink test", () => {
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
      })

      context("Fill in Hyperlink attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label" });
        });

        it("Enter linkUrl 'google.com'", () => {
          cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        });

        it("Check 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify Hyperlink linkUrl", () => {
        cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
      })

      it("Verify checkboxes 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })

  context("FORM Select Field test", () => {
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
      })

      context("Fill in Select Field attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name:"label", value: "test label"});
        });

        it("Enter placeholder 'test placeholder'", () => {
          cy.fbEnterPlaceholder({placeholder: "test placeholder"});
        });

        it("Enter options", () => {
          cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        });

        it("Check 'Include None', 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value' checkboxes", () => {
          cy.fbSelectCheckboxValue(["includeNone", "includeContext", "reviseDisabled", "deleteDisabled", "copyableValue"]);
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
      })

      it("Verify placeholder", () => {
        cy.fbVerifyNameValue({ name: "placeholder", value: "test placeholder" });
      })

      it("Verify options", () => {
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      })

      it("Verify checkboxes 'Include None', 'Include Other', 'Revision Disabled', 'Deletion Disabled', 'Copyable Value'", () => {
        cy.fbVerifyCheckboxValue("includeNone", "includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      })
    })
  })
});
