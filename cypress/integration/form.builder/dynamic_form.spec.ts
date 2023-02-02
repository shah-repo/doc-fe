// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let formId;
let emailsFromInbox;
const pages = ["", "", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

context("Dynamic Form Test", () => {
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
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              ClinicalProtocolDocType,
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

  context("Fill in document attributes", () => {
    it("Enters title 'New Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Dynamic Form" });
    });

    it("Enters description 'New Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Dynamic Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Add section field", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section" });
      cy.fbAddNewFieldButton();
    });

    it("Add Select field", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "Select field" });
      cy.fbGroupOptions("A", "B", "C");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
    });

    it("Add TextField", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add Subsection", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Document Revision", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-revision" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Parts", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-parts" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Parts");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete with Document Approvers", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-doc-approvers" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbAddNewFieldButton();
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbOpenValidation();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get("input[name=\"validators.required_if\"]").arrowClick();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("Select field");
      cy.unClick();
      cy.get(`[id="mui-component-select-validators.required_if.value"]`).arrowClick();
      cy.get(`ul>li[role="option"]`).contains("A").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add Paragraph", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph");
      cy.fbAddNewFieldButton();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
      cy.fbAddNewFieldButton();
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbAddNewFieldButton();
      cy.elUploadAttachment({ fileName: "TestTemplate.json", el: "fb-attachment-field-fb-blank-template-" });
    });

    it("Add Step", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step" });
      cy.fbAddNewFieldButton();
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
    });

    it("upload file in Instructions Media upload", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").first().arrowClick();
      cy.pmUploadAttachment({ fileName: "video.mp4" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Send to Email", () => {
    it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "New Dynamic Form" });
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
    SystemRequirement("REQ-4860");
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
        `${formId}-1-New-Dynamic-Form.pdf`);
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
          fileName: `${formId}-1-New-Dynamic-Form.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(4);
        expect(cdata.text).match(/Page 1 of 4/);
        expect(cdata.text).match(/Page 2 of 4/);
        expect(cdata.text).match(/Page 3 of 4/);
        expect(cdata.text).match(/Page 4 of 4/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
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
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      expect(el).match(/Page 1 of 4/);
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nNew Dynamic Form description/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/FB-SECTION\nSelect field\nfb-text-editor\nfb-textfield/);

        expect(el).match(/FB-SUBSECTION\nfb-autocomplete-doc-revision/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      expect(el).match(/Page 2 of 4/);
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-autocomplete-parts\nfb-autocomplete-doc-approvers/);

        expect(el).match(/fb-checkbox-group/);
        tmpRegex = new RegExp(`1(.*)2(.*)3`);
        expect(el).match(tmpRegex);

        expect(el).match(/fb-fileupload\nfb-paragraph/);

        tmpRegex = new RegExp( `fb-radiobutton-group\n(.*)option1(.*)option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-evidence/);

        expect(el).match(/fb-instructions/);

        expect(el).match(/video.mp4/);

        expect(el).match(/FB-BLANK-TEMPLATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[2];
      expect(el).match(/Page 3 of 4/);
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TestTemplate.json/);

        expect(el).match(/FB-STEP #1\nfb-quantity/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[3];
      expect(el).match(/Page 4 of 4/);
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve and Release form", () => {
    it("Approve and release form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "New Dynamic Form" });
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
    SystemRequirement("REQ-4860");
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
        `${formId}-1-New-Dynamic-Form.pdf`);
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
          fileName: `${formId}-1-New-Dynamic-Form.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(4);
        expect(cdata.text).match(/Page 1 of 4/);
        expect(cdata.text).match(/Page 2 of 4/);
        expect(cdata.text).match(/Page 3 of 4/);
        expect(cdata.text).match(/Page 4 of 4/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
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
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      expect(el).match(/Page 1 of 4/);
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\n${arId}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nNew Dynamic Form description/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/FB-SECTION\nSelect field\nfb-text-editor\nfb-textfield/);

        expect(el).match(/FB-SUBSECTION\nfb-autocomplete-doc-revision/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      expect(el).match(/Page 2 of 4/);
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-autocomplete-parts\nfb-autocomplete-doc-approvers/);

        expect(el).match(/fb-checkbox-group/);
        tmpRegex = new RegExp(`1(.*)2(.*)3`);
        expect(el).match(tmpRegex);

        expect(el).match(/fb-fileupload\nfb-paragraph/);

        tmpRegex = new RegExp( `fb-radiobutton-group\n(.*)option1(.*)option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-evidence/);

        expect(el).match(/fb-instructions/);

        expect(el).match(/video.mp4/);

        expect(el).match(/FB-BLANK-TEMPLATE/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[2];
      expect(el).match(/Page 3 of 4/);
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TestTemplate.json/);

        expect(el).match(/FB-STEP #1\nfb-quantity/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[3];
      expect(el).match(/Page 4 of 4/);
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DYNAMIC FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Create second document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Form with Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Form with Dynamic Form" });
    });

    it("Enters description 'New Form with Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Form with Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Clinical Protocol' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'New Dynamic Form' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Custom Controls", field: "New Dynamic Form" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Select 'Text Field 1' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.wait(1000);
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType("New Text Field 1");
      cy.fbSelectCheckboxValue("copyableValue");
      cy.get("[data-cy='common.add']").arrowClick();
    });

    it("Select 'Text Field 2' field", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.wait(1000);
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType("New Text Field 2");
      cy.fbSelectCheckboxValue("copyableValue");
      cy.get("[data-cy='common.add']").arrowClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Document from Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Document from Form" });
    });

    it("Enters description 'New Document from Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document from Form description" });
    });

    it("Enters text inside 'New Text Field 1' dynamic form field", () => {
      cy.get("[data-cy*=\"new-text-field-1\"]").arrowType("Some text for Dynamic Form field");
    });

    it("Enters text inside 'New Text Field 2'", () => {
      cy.get("[data-cy*=\"new-text-field-2\"]").arrowType("Some text for Text field");
    });

    it("Enters text inside 'fb-textfield'", () => {
      cy.get("input[name*=\"fb-textfield\"]").arrowType("ABCD");
      cy.unClick();
    });

    it("Select A in the Select field", () => {
      cy.get(`[id*="mui-component-select-select-field"]`).arrowClick();
      cy.get(`ul>li[role="option"]`).contains("B").arrowClick();
    });

    it("Click create document after filling document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });
});

export { };

