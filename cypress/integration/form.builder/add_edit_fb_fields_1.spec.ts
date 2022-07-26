// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let formId;
let arId;
let emailsFromInbox;
const pages = ["", "", "", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;

context("Add and edit FB fields - Test 1", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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

  context("Start document creation flow", () => {
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

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add Autocomplete with Document Revision", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-revision" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Parts", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-parts" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Parts");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Document Approvers", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-approvers" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
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

    it("Add Hyperlink", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
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
      cy.fbAddNewFieldButton();
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

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
    });

    it("Add Timer", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
      cy.fbAddNewFieldButton();
    });

    it("Add Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
      cy.fbAddNewFieldButton();
    });

    it("Add Receive Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.fbAddNewFieldButton();
    });

    it("Add PO Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
      cy.fbAddNewFieldButton();
    });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
      cy.fbAddNewFieldButton();
    });

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Step", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step" });
      cy.fbAddNewFieldButton();
    });

    it("Add EB Procedure", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
      cy.fbAddNewFieldButton();
    });

    it("Edit TextField", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit section field", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Subsection", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Checkbox group", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Autocomplete with Document Revision", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete-doc-revision" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-revision1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Autocomplete with Parts", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete-parts" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-parts1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Autocomplete with Document Approvers", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete-doc-approvers" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-approvers1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Text Editor", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Date picker", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Hyperlink", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Select Field", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Radio Button group", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Paragraph", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph1");
      cy.fbAddNewFieldButton();
    });

    it("Edit File Upload", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Blank Template Form", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Quantity", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Timer", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Purchase Order", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-purchase-order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Receive Purchase Order", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-receive-purchase-order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit PO Approval Matrix", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-po-approval-matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Instructions Media upload", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-instructions" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit EB Procedure", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "Step #1" });
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify Updation of Fields on reload page", () => {
    it("reload page", () => {
      cy.navigToDocumentList();
      cy.drFilterDocListByNameAndStatus({ title: "New Document Revision", status: "Draft" });
    });

    it("Verify TextField", () => {
      cy.contains("fb-textfield1").should("exist");
    });

    it("Verify Section", () => {
      cy.contains("fb-section1").should("exist");
    });

    it("Verify Subsection", () => {
      cy.contains("FB-SUBSECTION1").should("exist");
    });

    it("Verify Checkbox group", () => {
      cy.contains("fb-checkbox-group1").should("exist");
    });

    it("Verify Autocomplete for Document Revision", () => {
      cy.contains("fb-autocomplete-doc-revision1").should("exist");
    });

    it("Verify Autocomplete for Parts", () => {
      cy.contains("fb-autocomplete-parts1").should("exist");
    });

    it("Verify Autocomplete for Document Approvers", () => {
      cy.contains("fb-autocomplete-doc-approvers1").should("exist");
    });

    it("Verify Text Editor", () => {
      cy.contains("fb-text-editor1").should("exist");
    });

    it("Verify Date picker", () => {
      cy.contains("fb-datepicker1").should("exist");
    });

    it("Verify Hyperlink", () => {
      cy.contains("fb-hyperlink1").should("exist");
    });

    it("Verify Select Field", () => {
      cy.contains("fb-select-field1").should("exist");
    });

    it("Verify Radio Button group", () => {
      cy.contains("fb-radiobutton-group1").should("exist");
    });

    it("Verify Paragraph", () => {
      cy.contains("fb-paragraph1").should("exist");
    });

    it("Verify File Upload", () => {
      cy.contains("fb-fileupload1").should("exist");
    });

    it("Verify Blank Template Form", () => {
      cy.contains("fb-blank-template1").should("exist");
    });

    it("Verify Quantity", () => {
      cy.contains("fb-quantity1").should("exist");
    });

    it("Verify Timer", () => {
      cy.contains("fb-timer1").should("exist");
    });

    it("Verify Purchase Order", () => {
      cy.contains("fb-purchase-order1").should("exist");
    });

    it("Verify Receive Purchase Order", () => {
      cy.contains("fb-receive-purchase-order1").should("exist");
    });

    it("Verify PO Approval Matrix", () => {
      cy.contains("fb-po-approval-matrix1").should("exist");
    });

    it("Verify Instructions Media upload", () => {
      cy.contains("fb-instructions1").should("exist");
    });

    it("Upload attachment 'video.mp4'", () => {
      SystemRequirement("REQ-2990");
      cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
        cy.pmUploadAttachment({ fileName: "video.mp4" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify EB Procedure", () => {
      cy.contains("Step #1").should("exist");
    });

    it("Save document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
    });

    it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "New Document Revision" });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify draft form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
        expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
        downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    it("Download zip file containing training form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_draft.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-New-Document-Revision.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-New-Document-Revision.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(5);
        expect(cdata.text).match(/Page 1 of 5/);
        expect(cdata.text).match(/Page 2 of 5/);
        expect(cdata.text).match(/Page 3 of 5/);
        expect(cdata.text).match(/Page 4 of 5/);
        expect(cdata.text).match(/Page 5 of 5/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 5")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 5")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 5")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 5")) {
            pages[3] = element;
          }
          if (element.includes("Page 5 of 5")) {
            pages[4] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nNew Document Revision description/);

        expect(el).match(/Output Document Type\nTest Document Type/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield1/);

        expect(el).match(/STEP #1\nDescription/);

        expect(el).match(/Attachments\nMaterials/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment/);

        expect(el).match(/FB-STEP #1/);

        expect(el).match(/fb-evidence/);

        expect(el).match(/fb-instructions1/);

        expect(el).match(/video.mp4/);

        expect(el).match(/FB-PO-APPROVAL-MATRIX1/);

        expect(el).match(/LEVEL NAMELIMITSIGNATURE 1SIGNATURE 2SIGNATURE 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Purchase Orders/);

        expect(el).match(/ITEM\nPART\nNUMBER\nSUPPLIER\nPART\nNUMBER\nDESCRIPTIONORDERED\nRECEIPT\nQTY\nUNITSTAXSUM/);

        expect(el).match(/fb-quantity1/);

        expect(el).match(/FB-BLANK-TEMPLATE1/);

        expect(el).match(/TestTemplate.json/);

        expect(el).match(/fb-fileupload1/);

        expect(el).match(/fb-paragraph1/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `fb-radiobutton-group1\n(.*)option1(.*)option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-select-field1\nfb-hyperlink1/);

        expect(el).match(/fb-datepicker1/);

        expect(el).match(/fb-text-editor1/);

        expect(el).match(/fb-autocomplete-doc-approvers1/);

        expect(el).match(/fb-autocomplete-parts1/);

        expect(el).match(/fb-autocomplete-doc-revision1/);

        tmpRegex = new RegExp( `fb-checkbox-group1\nFB-SUBSECTION1\nFB-SECTION1\noption1 option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 5 in document", () => {
      const el = pages[4];
      if (el.includes("Page 5 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 5 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve and Release form", () => {
    it("Approve and release form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "New Document Revision" });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });

      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });

      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify released form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
        expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
        downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    it("Download zip file containing training form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_rel.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-New-Document-Revision.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-New-Document-Revision.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(5);
        expect(cdata.text).match(/Page 1 of 5/);
        expect(cdata.text).match(/Page 2 of 5/);
        expect(cdata.text).match(/Page 3 of 5/);
        expect(cdata.text).match(/Page 4 of 5/);
        expect(cdata.text).match(/Page 5 of 5/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 5")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 5")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 5")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 5")) {
            pages[3] = element;
          }
          if (element.includes("Page 5 of 5")) {
            pages[4] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nNew Document Revision description/);

        expect(el).match(/Output Document Type\nTest Document Type/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield1/);

        expect(el).match(/STEP #1\nDescription/);

        expect(el).match(/Attachments\nMaterials/);


        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment/);

        expect(el).match(/FB-STEP #1/);

        expect(el).match(/fb-evidence/);

        expect(el).match(/fb-instructions1/);

        expect(el).match(/video.mp4/);

        expect(el).match(/FB-PO-APPROVAL-MATRIX1/);

        expect(el).match(/LEVEL NAMELIMITSIGNATURE 1SIGNATURE 2SIGNATURE 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Purchase Orders/);

        expect(el).match(/ITEM\nPART\nNUMBER\nSUPPLIER\nPART\nNUMBER\nDESCRIPTIONORDERED\nRECEIPT\nQTY\nUNITSTAXSUM/);

        expect(el).match(/fb-quantity1/);

        expect(el).match(/FB-BLANK-TEMPLATE1/);

        expect(el).match(/TestTemplate.json/);

        expect(el).match(/fb-fileupload1/);

        expect(el).match(/fb-paragraph1/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `fb-radiobutton-group1\n(.*)option1(.*)option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-select-field1\nfb-hyperlink1/);

        expect(el).match(/fb-datepicker1/);

        expect(el).match(/fb-text-editor1/);

        expect(el).match(/fb-autocomplete-doc-approvers1/);

        expect(el).match(/fb-autocomplete-parts1/);

        expect(el).match(/fb-autocomplete-doc-revision1/);

        tmpRegex = new RegExp( `fb-checkbox-group1\nFB-SUBSECTION1\nFB-SECTION1\noption1 option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 5 in document", () => {
      const el = pages[4];
      if (el.includes("Page 5 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 5 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });
});

export { };

