/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { pdfFooterDate } from "../../utils/constants/dateHandler";
import { DesignDocument } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let pdfContent;
const pages = ["", "", "", ""];
let docId;
let arId;
let tmpRegex;

context("Export internal doc - Design Document form", () => {
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
    it("[API]Create company", (done: any) => {
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
              DesignDocument,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a DD form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on Create New button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "DD doc form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "DD form description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Design Document' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Design Document" });
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add section field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterLabel({ label: "fb-section" });
      cy.fbAddNewFieldButton();
    });

    it("Add Subsection", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Document Revision", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-revision" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbAddNewFieldButton();
    });

    it("Add Select Field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-textfield" );
      cy.get(`[data-cy="validators.required_if.value"]`).arrowType("A" );
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Paragraph", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph");
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbAddNewFieldButton();
      cy.elUploadAttachment({ fileName: "TestTemplate.json", el: "fb-attachment-field-fb-blank-template-" });
    });

    it("Add Step", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step" });
      cy.fbAddNewFieldButton();
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
    });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
      cy.fbAddNewFieldButton();
    });

    it("Add Evidence Media upload", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Get ids", () => {
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        docId = $docIdElement.text();
      });
    });
  });

  context("Check pdf email and get content", () => {
    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: STATUS_TYPES_LABEL.DRAFT, filename: "-1-DD-doc-form" }).then((data) => {
        pdfContent = data;
      });
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(4);
      expect(pdfContent.text).match(/Page 1 of 4/);
      expect(pdfContent.text).match(/Page 2 of 4/);
      expect(pdfContent.text).match(/Page 3 of 4/);
      expect(pdfContent.text).match(/Page 4 of 4/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
      arr.forEach((element) => {
        if (element.includes("Page 1 of 4")) {
          pages[0] = element;
        }
        if (element.includes("Page 2 of 4")) {
          pages[1] = element;
        }
        if (element.includes("Page 3 of 4")) {
          pages[2] = element;
        }
        if (element.includes("Page 4 of 4")) {
          pages[3] = element;
        }
      });
    });

    it("Verify page 1 of DD form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nDD form description/);

        expect(el).match(/Output Document Type\nDesign Document/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield/);
        expect(el).match(/fb-instructions/);
        expect(el).match(/fb-quantity/);
        expect(el).match(/FB-BLANK-TEMPLATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);
      }
    });

    it("Verify page 2 of DD form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TestTemplate.json/);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/fb-paragraph/);
        expect(el).match(/fb-radiobutton-group/);
        expect(el).match(/fb-select-field/);
        expect(el).match(/fb-datepicker/);
        expect(el).match(/fb-text-editor/);
        expect(el).match(/fb-autocomplete-doc-revision/);
        expect(el).match(/fb-checkbox-group/);
        expect(el).match(/FB-SUBSECTION/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);
      }
    });

    it("Verify page 3 of DD form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/FB-SECTION/);
        expect(el).match(/FB-STEP #1/);
        expect(el).match(/fb-evidence/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);
      }
    });

    it("Verify page 4 of DD form", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);
      }
    });
  });

  context("Verify pdf content after released", () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
    });

    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: STATUS_TYPES_LABEL.RELEASED, filename: "-1-DD-doc-form" }).then((data) => {
        pdfContent = data;
      });
    });

    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(4);
      expect(pdfContent.text).match(/Page 1 of 4/);
      expect(pdfContent.text).match(/Page 2 of 4/);
      expect(pdfContent.text).match(/Page 3 of 4/);
      expect(pdfContent.text).match(/Page 4 of 4/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
      arr.forEach((element) => {
        if (element.includes("Page 1 of 4")) {
          pages[0] = element;
        }
        if (element.includes("Page 2 of 4")) {
          pages[1] = element;
        }
        if (element.includes("Page 3 of 4")) {
          pages[2] = element;
        }
        if (element.includes("Page 4 of 4")) {
          pages[3] = element;
        }
      });
    });

    it("Verify page 1 of DD form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nDD form description/);

        expect(el).match(/Output Document Type\nDesign Document/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield/);
        expect(el).match(/fb-instructions/);
        expect(el).match(/fb-quantity/);
        expect(el).match(/FB-BLANK-TEMPLATE/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);
      }
    });

    it("Verify page 2 of DD form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TestTemplate.json/);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/fb-paragraph/);
        expect(el).match(/fb-radiobutton-group/);
        expect(el).match(/fb-select-field/);
        expect(el).match(/fb-datepicker/);
        expect(el).match(/fb-text-editor/);
        expect(el).match(/fb-autocomplete-doc-revision/);
        expect(el).match(/fb-checkbox-group/);
        expect(el).match(/FB-SUBSECTION/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);
      }
    });

    it("Verify page 3 of DD form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/FB-SECTION/);
        expect(el).match(/FB-STEP #1/);
        expect(el).match(/fb-evidence/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);
      }
    });

    it("Verify page 4 of DD form", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nDD DOC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);
      }
    });
  });

});

export { };

