// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
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
            importerEmail: IMPORTER_USER.email,
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

  context("Create a form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter document description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    context("Create FORM document with Form fields", () => {
      it("Add TextField", () => {
        cy.fbAddNewField();
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.get(`[name^="fb-textfield"`).parent().trigger("mouseover");
      });

      it("Add Checkbox group", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-checkbox-group" });
      });

      it("Add Autocomplete", () => {
        SystemRequirement("FB-0470");
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.wait(2000);
        cy.contains("fb-autocomplete").trigger("mouseover");
      });

      it("Add Text Editor", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-text-editor" } );
      });

      it("Add Date picker", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-datepicker" } );
      });

      it("Verify you can't add value to date picker in form edit design mode", () => {
        SystemRequirement("FB-0680");
        cy.get("input[name^=fb-datepicker]").should("have.attr", "disabled");
      });

      it("Add Hyperlink", () => {
        SystemRequirement("FB-0720");
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-hyperlink" } );
      });

      it("Add Select Field", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
          "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-select-field" } );
      });

      it("Verify data can't be entered to select field in form edit design mode", () => {
        SystemRequirement("FB-0860");
        cy.get("input[name^=fb-select-field]").should("have.attr", "type", "hidden");
      });

      it("Add Radio Button group", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-radiobutton-group" } );
      });


      it("Verify radio buttons can't be selected", () => {
        SystemRequirement("FB-0950");
        cy.get("input[name^=fb-radiobutton-group]").eq(0).should("have.attr", "disabled");
        cy.get("input[name^=fb-radiobutton-group]").eq(1).should("have.attr", "disabled");
        cy.get("input[name^=fb-radiobutton-group]").eq(2).should("have.attr", "disabled");
      });

      it("Add Paragraph", () => {
        SystemRequirement("FB-0990");
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Paragraph" });
        cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().type("fb-paragraph");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-paragraph" } );
      });

      it("Add File Upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-fileupload" } );
      });

      it("Add Blank Template Form", () => {
        SystemRequirement("FB-1170, FB-1180");
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Blank Template Form" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbAddNewFieldButton();
        cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
        cy.fbMouseOverByLabel({ label: "fb-blank-template" } );
      });

      it("Add Quantity", () => {
        SystemRequirement("FB-1270");
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-quantity" } );
      });

      it("Add Timer", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
        cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-timer" } );
      });

      it("Add Purchase Order", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-purchase-order" } );
      });

      it("Add Receive Purchase Order", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Receive Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.wait(2000);
        cy.fbMouseOverByLabel({ label: "fb-receive-purchase-order" } );
      });

      it("Add Approval Matrix", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Approval Roles" } );
      });

      it("Add PO Approval Matrix", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
        cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-po-approval-matrix" } );
      });

      it("Add Instructions Media upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Instructions Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-instructions" } );
      });

      it("Add Evidence Media upload", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Evidence Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-evidence" } );
      });

      it("Add Procedure", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #1" } );
      });

      it("Add Equipment", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
        cy.get("input[value=\"preventativeMaintenance\"]").click();
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-equipment" } );
      });

      it("Add Text field with range", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "fb-range" });
        cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
        cy.fbSelectCheckboxName("editorConfig.rangeOption",
          "editorConfig.criticalToQuality", "editorConfig.inspection");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-range" } );
      });

      it("Add Section", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Section" });
        cy.fbEnterNameValue({ name: "label", value: "fb-section" });
        cy.fbSelectCheckboxValue("inspectionSection");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-section" } );
      });

      it("Add Subsection", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Subsection" });
        cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "FB-SUBSECTION" } );
      });

      it("Add Step", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Step" });
        cy.fbEnterNameValue({ name: "label", value: "fb-step" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-step" } );
      });

      it("Add Approvals", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Approvals" });
        cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-approvals" } );
      });

      it("Add Inline Approval", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").type(`${USERS[1].email }{downarrow}{enter}`);
        cy.get("[data-cy=\"editorConfig.groups\"]").type("Everyone{downarrow}{enter}");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-inline-approval" } );
      });

      it("Add Request Approval", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Request Approval" });
        cy.fbEnterNameValue({ name: "label", value: "fb-request-approval" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-request-approval" } );
      });

      it("Add Checkpoint", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Checkpoint" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-checkpoint" } );
      });

      it("Add Create a Label", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Create a Label" });
        cy.fbEnterNameValue({ name: "label", value: "fb-create-label" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-create-label" } );
      });

      it("Add Implementation Task", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Implementation Task" });
        cy.fbEnterNameValue({ name: "label", value: "fb-task" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-task" } );
      });

      it("Add Instructions 'MPI'", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.get(`[data-cy="form.builder.instructionsdocument"]`).eq(-1).click();
        cy.fbEnterNameValue({ name: "label", value: "fb-mpi" });
        cy.get("[data-cy=\"instructionsDocument\"]").type("AR Form{downarrow}{enter}");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-mpi" } );
      });

      it("Add Instructions 'Select Document(s)'", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Select Document" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
        cy.get("[data-cy=\"options\"]").type("AR Form{downarrow}{enter}");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "fb-select-doc" } );
      });

      it("Add Actions 'Action Button'", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Action Button" });
        cy.fbSelectCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        cy.fbAddNewFieldButton();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify Form fields", () => {
      it("Verify TextField attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
        cy.fbVerifyNameValue({ name: "rows", value: "2" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Checkbox group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Autocomplete attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Text Editor attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Date picker attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Hyperlink attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify location linked on Hyperlink", () => {
        SystemRequirement("FB-0770");
        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[name^=fb-hyperlink-]").click();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Verify Select Field attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-select-field" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Radio Button group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Paragraph attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
        cy.get("[data-cy=\"paragraph\"]").parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify File Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Blank Template Form attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbClickButton({ el: "dialog-close" });
        cy.contains("image.jpg").should("exist");
      });

      it("Verify Quantity attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Timer attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Purchase Order attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-purchase-order" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-purchase-order" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Receive Purchase Order attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-receive-purchase-order" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-receive-purchase-order" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Approval Matrix attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "Approval Roles" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify PO Approval Matrix attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-po-approval-matrix" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-po-approval-matrix" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Instructions Media Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-instructions" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-instructions" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Evidence Media Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-evidence" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-evidence" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Procedure attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "Step #1" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Equipment attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-equipment" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-equipment" });
        cy.fbVerifyCheckboxValue("preventativeMaintenance");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify TextField with range attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-range" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-range" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-range placeholder" });
        cy.fbVerifyCheckboxName("editorConfig.rangeOption",
          "editorConfig.criticalToQuality", "editorConfig.inspection");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Section attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
        cy.fbVerifyCheckboxValue("inspectionSection");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Subsection attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Step attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-step" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-step" });
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Approvals attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-approvals" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-approvals" });
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Inline Approval attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").parent().should("contain", USERS[1].email);
        cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain", "Everyone");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Request Approval attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-request-approval" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-request-approval" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Checkpoint attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-checkpoint" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-checkpoint" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Create a Label attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-create-label" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-create-label" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Implementation Task attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-task" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-task" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify MPI attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-mpi" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-mpi" });
        cy.get("[data-cy=\"instructionsDocument\"]").should("have.value", "FM-00001 - rev 1 - AR Form");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Select Document attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-select-doc" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-select-doc" });
        cy.get("[data-cy=\"options\"]").parent().should("contain", "AR Form");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "dialog-close" });
      });

      it("Verify Action Button attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "Send Email" });
        cy.fbVerifyCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        cy.fbClickButton({ el: "dialog-close" });
      });
    });

    context("Check fields in Preview Mode", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Add and check Quantity field", () => {
        SystemRequirement("FB-1340");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").clear().type("1");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").should("have.value", "1");
      });

      it("there should be no edit for field", () => {
        SystemRequirement("FB-1210, FB-1300, FB-0760, FB-0490");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify location linked on Hyperlink", () => {
        SystemRequirement("FB-0800");
        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[name^=fb-hyperlink-]").click();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Close Preview dialog", () => {
        cy.fbClickButton({ el: "dialog-close" });
      });
    });

    context("Edit and verify Form fields", () => {
      it("Edit Quantity field", () => {
        SystemRequirement("FB-1270");
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity1" });
        cy.fbAddNewFieldButton();
      });

      it("Edit Blank Template field", () => {
        SystemRequirement("FB-1180");
        cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template1" });
        cy.fbAddNewFieldButton();
      });

      it("Edit Autocomplete field", () => {
        SystemRequirement("FB-0470");
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete1" });
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Verify updated Quantity field", () => {
        cy.get("[data-cy=\"fb-quantity1\"]").should("exist");
        cy.get("[data-cy=\"fb-quantity1\"]").should("have.text", "fb-quantity1");
      });

      it("Verify updated Blank Template field", () => {
        cy.get("[data-cy=\"fb-blank-template1\"]").should("exist");
        cy.get("[data-cy=\"fb-blank-template1\"]").should("have.text", "fb-blank-template1");
      });

      it("Verify updated Autocomplete field", () => {
        cy.get("[data-cy=\"fb-autocomplete1\"]").should("exist");
        cy.get("[data-cy=\"fb-autocomplete1\"]").should("have.text", "fb-autocomplete1");
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Create Clinical Protocol doc", () => {
      it("Click New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: "test title" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "test description" });
      });

      it("Enter Quantity field value", () => {
        SystemRequirement("FB-1320");
        cy.get("input[name^=\"fb-quantity-\"]").type("1");
      });

      it("Select Autocomplete field value", () => {
        SystemRequirement("FB-0510");
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").click().type("test title{downarrow}{enter}");
      });

      it("Click Save button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify Clinical Protocol doc values", () => {
      it("Verify Quantity values", () => {
        cy.get("input[name^=\"fb-quantity-\"]").should("have.value", "1");
      });

      it("Verify Not to edit Quantity field", () => {
        SystemRequirement("FB-1280");
        cy.get("[data-cy=\"fb-quantity1\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify Not to edit Blank Template field", () => {
        SystemRequirement("FB-1190");
        cy.get("[data-cy=\"fb-blank-template1\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify Not to edit Hyperlink field", () => {
        SystemRequirement("FB-0740");
        cy.get("[name^=fb-hyperlink-]").parent().parent().parent()
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify location linked on Hyperlink", () => {
        SystemRequirement("FB-0780");
        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[name^=fb-hyperlink-]").click();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Verify Autocomplete values", () => {
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").parent().invoke("text").should("not.be.empty");
      });
    });
  });
});
