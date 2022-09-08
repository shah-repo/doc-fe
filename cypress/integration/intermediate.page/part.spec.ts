import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

context(
  "Verify that the intermediate page of the Part matches the new design and functionality",
  () => {
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
              documentTypes: [ClinicalProtocolDocType],
            },
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCompany = response;
            adminEmployee = createdCompany.employees.find(
              (employee) => employee.user.email === USERS[1].email
            );
            done();
          });
        });
      });
    });

    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({
          USER: USERS[1],
          employeeId: adminEmployee.id,
        });
      });
    });

    context("Go to Document List and create a document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context(
      "Select Document Type 'Form'",
      () => {
        it("Click on 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Record Document' output document type from dropdown", () => {
          cy.drSelectOutputDocumentType({ documentType: "Parts" });
        });
      }
    );
    context("verify the button “Preview Layout” next to “Output Doc Type” and gets coloured and it’s clickable", () => {
      it("Check 'Select Output Document Type' is displayed", () => {
        cy.get("[data-cy='field-outputDocumentTypes']").should("exist");
      });
      it("Verify 'Preview Layout' button is displayed and next to output doc type", () => {
        cy.contains("button", "Preview Layout").should("exist");
        cy.get("[data-cy='field-outputDocumentTypes']").parent().parent().contains("Preview Layout").should("exist");
      });
      it("verify Preview layout button is colored and its clickable", () => {
        cy.contains("button", "Preview Layout").should("be.enabled")
          .should("have.css", "background-color", "rgb(1, 31, 187)");
      });
    });

    context("Clicking on it will display a preview of the document and its fields", () => {
      it("Click 'Preview Layout' button", () => {
        cy.intPageClickPreviewLayout();
      });
      context("verify default fields", () => {

        it("Verify Document Type", () => {
          cy.get("[data-cy='field-document.documentType.id']").contains("Document Type")
            .should("exist");
        });

        it("Verify Document ID", () => {
          cy.get("[data-cy='field-document.docId']").contains("Document ID")
            .should("exist");
        });

        it("Verify Revision Stage", () => {
          // eslint-disable-next-line max-len
          cy.get("[id='sm-tabpanel-0'] [class^='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6']").eq(2).contains("Revision Stage")
            .should("exist");
        });

        it("Verify Numeric", () => {
          cy.get("[data-cy='field-revisionStage']").contains("Numeric")
            .should("exist");
        });

        it("Verify Numeric Alpha", () => {
          cy.get("[data-cy='field-revisionStage']").contains("Numeric Alpha")
            .should("exist");
        });

        it("Verify Alpha", () => {
          cy.get("[data-cy='field-revisionStage']").contains("Alpha")
            .should("exist");
        });

        it("Verify Training Required", () => {
          cy.get("[data-cy='field-retrain']").contains("Training Required")
            .should("exist");
        });

        it("Verify Output Document Type", () => {
          cy.get("[data-cy='field-outputDocumentTypes']").contains("Output Document Type")
            .should("exist");
        });

        it("Verify Output Document Type as Parts", () => {
          cy.get("[id='formTemplate.outputDocumentTypes']").contains("Parts")
            .should("exist");
        });
      });
      context("verify predefined fields", () => {
        it("navigate to Specification Items", () => {
          cy.drSelectSpecificationTab();
        });

        it("Button should have text Make vs Buy", () => {
          cy.get("[data-cy='Make vs Buy']")
            .should("have.text", "Make vs Buy");
        });

        it("Button should have text Unit of measure", () => {
          cy.get("[data-cy='Unit of measure']")
            .should("have.text", "Unit of measure");
        });

        it("Button should have text Traceability required", () => {
          cy.get("[data-cy='Traceability required']")
            .should("have.text", "Traceability required");
        });

        it("Button should have text IQC Required", () => {
          cy.get("[data-cy='IQC Required']")
            .should("have.text", "IQC Required");
        });

        it("Button should have text Limited Shelf Life", () => {
          cy.get("[data-cy='Limited Shelf Life']")
            .should("have.text", "Limited Shelf Life");
        });

        it("Button should have text FAI Required", () => {
          cy.get("[data-cy='FAI Required']")
            .should("have.text", "FAI Required");
        });
      });
    });

    context("Click on create a Document", () => {
      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });
    context(`Make sure each tab in which the user can add FB fields has a functional “Preview” button`, () => {
      it("Verify 'Overview' tab is displayed", () => {
        cy.intPageVerifyOverviewTabExist();
      });

      it("Navigate to Overview Tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify center bottom displays: eye, import and export icons", () => {
        cy.intPageVerifyFormOptionsExist();
      });
      it("Verify 'Specifications' tab is displayed", () => {
        cy.intPageVerifySpecificationTabExist();
      });

      it("navigate to Specification Items", () => {
        cy.drSelectSpecificationTab();
      });

      it("Verify center bottom displays: eye, import and export icons", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });

    context("Click on one of them", () => {
      context("Make sure fields and tabs displayed in non preview mode are the same displayed in Preview mode", () => {
        context("Add form fields", () => {

          it("Add Autocomplete", () => {
            SystemRequirement("FB-0140", "FB-0150");
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
            cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
            cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
            cy.get("[data-cy='optionId']").autocompleteSelect("Document Revision");
            cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });

          it("Add Date picker", () => {
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
            cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
            cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });
        });

        context("Verify Form fields in non preivew mode", () => {

          it("Verify Autocomplete attributes", () => {
            cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
            cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
            cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
            cy.get("[data-cy='optionId']").should("have.value", "Document revisions");
            cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          });

          it("Verify Date picker attributes", () => {
            cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
            cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
            cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          });
        });

        context("Verify Form fields in preview mode", () => {
          it("Open Preview dialog", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });

          it("Add and check Date picker field", () => {
            cy.get("[data-cy='form.builder.form.preview']").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-datepicker-]").parent().find("button").arrowClick();
            cy.get(".MuiPickersDay-daySelected").arrowClick();
            cy.get("[data-cy='form.builder.form.preview']").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-datepicker-]").invoke("val").should("not.be.empty");
          });

          it("Add and check Autocomplete field", () => {
            cy.get("input[data-cy^='fb-autocomplete-']").eq(1).arrowClick().autocompleteSelect("FM-00001");
            // eslint-disable-next-line max-len
            cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0).contains("FM-00001 - rev 1 - AR Form");
          });

          it("Close Preview dialog", () => {
            cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
          });
        });

        context(`Make sure that none of the changes made in “Preview” were saved`, () => {

          it("Verify Date picker values", () => {
            cy.get("input[name^='fb-datepicker-']").invoke("val").should("be.empty");
          });

          it("Verify Autocomplete values", () => {
            cy.get("input[data-cy^='fb-autocomplete-']").parent().find(".MuiAutocomplete-tag").should("not.exist");
          });
        });
      });
    });

    context("Click on ‘Add Field’ button in one of the tabs > Form Builder Library opens on the left-hand side", () => {
      context(`Click on ‘Add Field’ button in one of the tabs >> 
      Form Builder Library opens on the left-hand side`, () => {
        it("Navigate to Overview Tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Add Quantity", () => {
          cy.fbAddNewFieldWhenHidden();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.fbAddNewFieldButton();
          });
        });

        it("Add Radio Button group", () => {
          cy.fbAddNewFieldWhenHidden();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
          cy.get("input[value^='visibility']").check();
          cy.get(`input[name="validators.required_if"]`).check();
          cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-quantity" );
          cy.get(`[data-cy="validators.required_if.value"]`).arrowType("1" );
          cy.fbAddNewFieldButton();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

      });

      context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
        it("Open Preview dialog", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Verify Only Field 1 is displayed", () => {
          cy.get("[name^='fb-quantity-']").should("exist");
          cy.get("[data-cy='fb-radiobutton-group']").should("not.be.visible");
        });

        it("Field 2 is only displayed if Field 1 is enter as '1'", () => {
          cy.get("[name^='fb-quantity-']").eq(1).arrowType("1");
          cy.get("[data-cy='fb-radiobutton-group']").should("exist");
        });

        it("Close Preview dialog", () => {
          cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
        });
      });
    });

    context("Edit the fields so that", () => {
      context("Remove the validation from Field 2", () => {
        it("Edit Radio Button group", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
          cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
          cy.get("input[value^='default']").check();
          cy.get(`input[name="validationMode"]`).check();
          cy.get(`input[name="validators.required_if"]`).uncheck();
          cy.fbAddNewFieldButton();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });
    });

    context("Open the Preview mode and make sure it was updated accordingly", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Verify Field 1 is displayed", () => {
        cy.get("[name^='fb-quantity-']").should("exist");
      });

      it("Verify Field 2 is displayed", () => {
        cy.get("[data-cy='fb-radiobutton-group']").should("exist");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });
  }
);
