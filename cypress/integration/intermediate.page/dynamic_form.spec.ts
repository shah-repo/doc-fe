import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

context(
  "Verify that the intermediate page of the Dynamic Form matches the new design and functionality",
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

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });

      context(
        "Select Document Type 'Dynamic Form' and check Page default fields",
        () => {
          it("Selects 'Dynamic Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Dynamic Form" });
          });

          it("Verify 'Title' field is visible", () => {
            cy.intPageVerifyTitleExist();
          });

          it("Verify 'Description' field is visible", () => {
            cy.intPageVerifyDescriptionExist();
          });

          it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
            cy.get("[data-cy=\"field-document.documentType.id\"]")
              .parent()
              .should("have.class", "MuiGrid-grid-xs-6")
              .next()
              .should("have.class", "MuiGrid-grid-xs-6")
              .should("contain.text", "Document ID");
          });

          it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
            cy.get("[data-cy=\"field-revisionStage\"]")
              .parent()
              .parent()
              .should("have.class", "MuiGrid-grid-xs-6")
              .next()
              .should("have.class", "MuiGrid-grid-xs-6")
              .should("contain.text", "Training Required");
          });

          it("Verify 'Selected Users' field is visible", () => {
            cy.intPageVerifySelectedUsersExist();
          });

          it("Verify 'Selected Groups' field is visible", () => {
            cy.intPageVerifySelectedGroupsExist();
          });

          it("Verify No 'Preview Layout' button is displayed", () => {
            cy.intPageVerifyPreviewLayoutButtonNotExist();
          });

          it("Verify Attachments is displayed", () => {
            cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
          });

          it("Verify Output document type are not displayed ", () => {
            cy.intPageVerifyOutputDocTypeNotExist();
          });

          it("Verify no predefined fields are displayed", () => {
            cy.intPageVerifySelectedGroupsExist();
          });

          it("Verify there is no ADD A FIELD button", () => {
            cy.intPageVerifyAddFieldNotExist();
          });

          it("Verify there are no options nor icons for Import and Export of the form JSON", () => {
            cy.intPageVerifyFormOptionsNotExist();
          });
        }
      );

      context("Click on CREATE DOCUMENT button & Verify the design", () => {
        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click CREATE DOCUMENT", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Verify there is ADD A FIELD button is displayed", () => {
          cy.intPageVerifyAddFieldExist();
        });

        it("Verify center bottom displays: eye, import and export icons", () => {
          cy.intPageVerifyFormOptionsExist();
        });
      });

      context(`Make sure each tab in which the user can add FB fields has a functional “Preview” button`, () => {
        it("Verify 'Details' tab is displayed", () => {
          cy.intPageVerifyDetailsTabExist();
        });

        it("Navigate to Detail Tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify center bottom displays: eye, import and export icons", () => {
          cy.intPageVerifyFormOptionsExist();
        });
      });

      context("Make sure fields and tabs displayed in non preview mode are the same displayed in Preview mode", () => {
        context("Add form fields", () => {
          it("Add Quantity", () => {
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
            cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
            cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });

          it("Add Autocomplete", () => {
            SystemRequirement("FB-0140", "FB-0150");
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
            cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
            cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
            cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
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

          it("Click save document", () => {
            cy.drClickSaveWithoutApiCall();
          });
        });

        context("Verify Form fields in non preivew mode", () => {
          it("Verify Quantity attributes", () => {
            cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
            cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
            cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbClickButton({ el: "fb-editor-actions-cancel" });
          });

          it("Verify Autocomplete attributes", () => {
            cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
            cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
            cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
            cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
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

          it("Navigate to Detail Tab", () => {
            cy.get(`[data-cy="tabId.details"]`).last().arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Add and check Quantity field", () => {
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-quantity-]").clear().arrowType("1");
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-quantity-]").should("have.value", "1");
          });

          it("Add and check Date picker field", () => {
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-datepicker-]").parent().find("button").arrowClick();
            cy.get(".MuiPickersDay-daySelected").arrowClick();
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("input[name^=fb-datepicker-]").invoke("val").should("not.be.empty");
          });

          it("Add and check Autocomplete field", () => {
            cy.get("input[data-cy^=\"fb-autocomplete-\"]").eq(1).arrowClick().autocompleteSelect("FM-00001");
            // eslint-disable-next-line max-len
            cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0).contains("FM-00001 - rev 1 - AR Form");
          });

          it("Close Preview dialog", () => {
            cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
          });
        });

        context(`Make sure that none of the changes made in “Preview” were saved`, () => {
          it("Verify Quantity values", () => {
            cy.get("input[name^=\"fb-quantity-\"]").should("have.text", "");
          });

          it("Verify Date picker values", () => {
            cy.get("input[name^=\"fb-datepicker-\"]").invoke("val").should("be.empty");
          });

          it("Verify Autocomplete values", () => {
            cy.get("input[data-cy^=\"fb-autocomplete-\"]").parent().find(".MuiAutocomplete-tag").should("not.exist");
          });
        });

        context(`Click on ‘Add Field’ button in one of the tabs >> 
          Form Builder Library opens on the left-hand side`, () => {
          it("Navigate to Overview Tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Add Text field with range", () => {
            SystemRequirement("FB-0100", "FB-0110", "FB-0160");
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
            cy.fbEnterNameValue({ name: "label", value: "fb-range" });
            cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
            cy.fbSelectCheckboxName("editorConfig.rangeOption",
              "editorConfig.criticalToQuality", "editorConfig.inspection");
            cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });

          it("Add Paragraph", () => {
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
            cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
              .click({ force: true }).clear().arrowType("fb-paragraph");
            cy.fbAddNewFieldButton();
          });

          it("Add Instructions Media upload", () => {
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
            cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
            cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });

          it("Add Evidence Media upload", () => {
            cy.fbClickAddNewHiddenBtn();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
            cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
            cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
            cy.fbAddNewFieldButton();
          });

          it("Click save document", () => {
            cy.drClickSaveWithoutApiCall();
            cy.reload();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });
        });

        context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
          it("Open Preview dialog", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });

          it("Verify Text field with range", () => {
            cy.get(".MuiDialogContent-root [name^='fb-range-']").should("be.visible");
          });

          it("Verify Paragraph", () => {
            cy.get(".MuiDialogContent-root").contains("fb-paragraph").should("be.visible");
          });

          it("Verify Evidence Media Upload", () => {
            cy.get(".MuiDialogContent-root").contains("fb-evidence").should("be.visible");
          });

          it("Verify instructions media", () => {
            cy.get(".MuiDialogContent-root [data-cy='fb-instructions']").should("be.visible");
          });

          it("Close Preview dialog", () => {
            cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
          });
        });

        context("Change the order of the fields", () => {
          it("move component", () => {
            cy.get("[class*='fb-field-wrapper-fb-range-']").trigger("mouseover");
            cy.wait(2000);
            cy.get(".drag-handle").eq(0)
              .realMouseDown({ position: "center", button: "left" });
            cy.wait(3000);
            cy.get(".drag-handle").eq(1)
              .realMouseMove(0, 0, { position: "center" })
              .realMouseUp();
          });
        });

        context("Open the Preview mode and make sure it was updated accordingly", () => {
          it("Open Preview dialog", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });

          it("Verify Paragraph", () => {
            cy.get(".MuiDialogContent-root").contains("fb-paragraph").should("exist");
          });

          it("Verify Text field with range", () => {
            cy.get(`[role="dialog"] [data-cy^="textfieldwithrange"]`).should("exist");
          });

          it("Verify Text field with range", () => {
            cy.get("[name^='fb-range-']").should("exist");
          });

          it("Verify Evidence Media Upload", () => {
            cy.contains("fb-evidence").should("exist");
          });

          it("Verify instructions media", () => {
            cy.get("[data-cy='fb-instructions']").should("exist");
          });

          it("Close Preview dialog", () => {
            cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
          });
        });
      });
    });
  }
);
