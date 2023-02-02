// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let recFormId;
let adminEmployee;
let RDdocumentType;

let recDocId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

context("Record inline Flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
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
              RecordOne,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record one");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("[API]Update record document type", () => {
    it("Change fields config in record document type", () => {
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        id: RDdocumentType[0].id,
        payload: {
          fieldsConfig: {
            D: {
              visible: false,
              required: false,
            },
            E: {
              label: "Record Type",
              visible: true,
              required: true,
            },
            F: {
              label: "Record ID",
              visible: false,
              required: true,
            },
            G: {
              visible: false,
              required: false,
            },
            I: {
              visible: false,
            },
            J: {
              visible: false,
            },
            K: {
              label: "Void",
              visible: true,
            },
            L: {
              label: "Correction",
              visible: true,
            },
            N: {
              label: "Finalize and Release",
              visible: true,
            },
            O: {
              label: "Record History",
              visible: true,
            },
            R: {
              visible: false,
            },
            S: {
              label: "Update Record",
              visible: true,
            },
            A1: {
              label: "WIP",
              visible: true,
            },
            A2: {
              label: "Voided",
              visible: true,
            },
            A3: {
              label: "Archive",
              visible: true,
            },
            P1: {
              label: "WIP",
              visible: true,
            },
            P2: {
              label: "Voided",
              visible: true,
            },
            P3: {
              label: "Archive",
              visible: true,
            },
          },
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Inline Form Document Revision" });
      });

      it("Enter description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
        cy.fbGroupOptions("1", "2", "3");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Add 'Text Field' as 'TEXT FIELD'`, () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.fbFieldRequiredIfIn({ name: "Checkbox" });
        cy.fbSelectCheckboxValue("3");
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add second textfield", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Second textfield for inline" });
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add second inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Second inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddField();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create document", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.arCheckTitleInEditableAndMatches({ name: "Inline Form Document Revision" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
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

    context("Verify email for record form notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[2].email,
            contains: [`Hello <b>${USERS[2].name},</b>`,
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
      it("Download zip file containing record form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${recFormId}${fileTimeFormat}_draft.zip`;
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
          `${recFormId}-1-Inline-Form-Document-Revision.pdf`);
        cy.readFile(pdffile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content", () => {
      it("Extract texts from PDF file content for record form", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${recFormId}-1-Inline-Form-Document-Revision.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(3);
          expect(cdata.text).match(/Page 1 of 3/);
          expect(cdata.text).match(/Page 2 of 3/);
          expect(cdata.text).match(/Page 3 of 3/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 3")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 3")) {
              pages[1] = element;
            }
            if (element.includes("Page 3 of 3")) {
              pages[2] = element;
            }
          });
        });
      });

      it("Verify page 1 for record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[0];
        if (el.includes("Page 1 of 3")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/AR ID\nNone/);

          expect(el).match(/Description\nInline Form Document Revision description/);

          expect(el).match(/Output Document Type\nRecord one/);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Textfield for inline/);

          expect(el).match(/Inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`);
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 3/);
        }
      });

      it("Verify page 2 of record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[1];
        if (el.includes("Page 2 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Second textfield for inline/);

          expect(el).match(/Second inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`);

          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 3/);
        }
      });

      it("Verify page 3 of record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        SystemRequirement("REQ-4870");
        const el = pages[2];
        if (el.includes("Page 3 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`);
          expect(el).match(tmpRegex);

          expect(el).match(/Page 3 of 3/);
        }
      });
    });

    context("Release document", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: "Inline Form Document Revision" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
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

    context("Verify email for record form notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[2].email,
            contains: [`Hello <b>${USERS[2].name},</b>`,
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
      it("Download zip file containing record form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${recFormId}${fileTimeFormat}_rel.zip`;
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
          `${recFormId}-1-Inline-Form-Document-Revision.pdf`);
        cy.readFile(pdffile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content", () => {
      it("Extract texts from PDF file content for record form", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${recFormId}-1-Inline-Form-Document-Revision.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(3);
          expect(cdata.text).match(/Page 1 of 3/);
          expect(cdata.text).match(/Page 2 of 3/);
          expect(cdata.text).match(/Page 3 of 3/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 3")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 3")) {
              pages[1] = element;
            }
            if (element.includes("Page 3 of 3")) {
              pages[2] = element;
            }
          });
        });
      });

      it("Verify page 1 for record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[0];
        if (el.includes("Page 1 of 3")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nInline Form Document Revision description/);

          expect(el).match(/Output Document Type\nRecord one/);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Textfield for inline/);

          expect(el).match(/Inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 3/);
        }
      });

      it("Verify page 2 of record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[1];
        if (el.includes("Page 2 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Second textfield for inline/);

          expect(el).match(/Second inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 3/);
        }
      });

      it("Verify page 3 of record form", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        SystemRequirement("REQ-4870");
        const el = pages[2];
        if (el.includes("Page 3 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
          tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 3 of 3/);
        }
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on create new and chose 'Record one'", () => {
      SystemRequirement("REQ-2760");
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.get("input[id=\"attachments-button-file\"]").attachFile("image.jpg");
        cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").click().wait(500);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check().wait(1000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType("First entry");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter text 'First entry' in second textfield for inline", () => {
        cy.get(`[data-cy^="second-textfield-for-inline"] input`)
          .type("First entry");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select approver for first inline", () => {
        cy.listLoadingElementShouldNotExist();
        cy.get(`[name*="fb-ia-inline-field"] input`).arrowClick();
        cy.get(`[name*="fb-ia-inline-field"] input`)
          .autocompleteSelect(`${USERS[2].name}`, { force: true });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Select second approver for first inline", () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[name^=\"fb-ia-inline-field\"] input").arrowClick();
        cy.get("[name^=\"fb-ia-inline-field\"] input")
          .autocompleteSelect(`${USERS[3].name}`, { force: true });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Remove second approver for first inline", () => {
        cy.pmDeleteApproverFromApproverList({ approver: `${USERS[3].name} - ${USERS[3].email}` });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Select approver for second inline", () => {
        cy.get(`[name*="fb-ia-second-inline-field"] input`).arrowClick();
        cy.get(`[name*="fb-ia-second-inline-field"] input`)
          .autocompleteSelect(`${USERS[2].name}`, { force: true });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Select second approver for second inline", () => {
        cy.get(`[name*="fb-ia-second-inline-field"] input`).arrowClick();
        cy.get(`[name*="fb-ia-second-inline-field"] input`)
          .autocompleteSelect(`${USERS[3].name}`, { force: true });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Remove second approver for second inline", () => {
        cy.contains(`${USERS[3].name} - ${USERS[3].email}`).parent().next().arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Send request for approval", () => {
        cy.get(`[data-cy="form.builder.request.approval"]`).first().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Check inline record creation default to numeric revision", () => {
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recCheckRevisionStage({ stage: "Revision 1" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check approve button is not disabled", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").should("not.be.disabled");
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it(`Check doc status for ${STATUS_TYPES_LABEL.WIP} and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
        cy.arCheckTitleInEditableAndMatches({ name: "Record Document Revision" });
        cy.drGetDocIdElementFromUI().should("contain.text", "RD-").then(($docIdElement: JQuery<HTMLElement>) => {
          recDocId = $docIdElement.text();
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

    context("Verify email notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recDocId}`,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[2].email,
            contains: [`Hello <b>${USERS[2].name},</b>`,
              "Your documents are ready for download.",
              "<button type=\"button\">DOWNLOAD</button>",
              createdCompany.id,
            ],
          }];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });

    context("Verify zip file downloaded", () => {
      SystemRequirement("REQ-4860");
      it("Download zip file containing inline record notification", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${recDocId}${fileTimeFormat}_WIP.zip`;
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

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content for WIP document", () => {
      it("Extract texts from PDF file content for WIP document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${recDocId}-1-Record-Document-Revision.pdf`,
        }).then((cdata) => {
          expect(cdata.numpages).eq(1);
          expect(cdata.text).match(/Page 1 of 1/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 1")) {
              pages[0] = element;
            }
          });
        });
      });

      it("Verify page 1 for WIP document", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[0];
        if (el.includes("Page 1 of 1")) {
          tmpRegex = new
          RegExp( `Record one\n${recDocId}, Revision 1\nRECORD DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Textfield for inline\nFirst entry/);

          expect(el).match(/Second textfield for inline\nFirst entry/);

          tmpRegex = new RegExp(`Checkbox`);
          expect(el).match(tmpRegex);

          tmpRegex = RegExp( `${USERS[3].name}`, "gi" );
          expect(el).not.match(tmpRegex);

          expect(el).not.match(/TEXT FIELD/);

          expect(el).match(/1 2 3\nWIP/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 1/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          // commenting this code for now until the issue ENC-11348 fixed
          // tmpRegex = new RegExp(`INLINE FIELD\\n${USERS[2].name} \\- .*@.* \\| PENDING`);
          // expect(el).match(tmpRegex);

          // tmpRegex = new RegExp(`SECOND INLINE FIELD\\n${USERS[2].name} \\- .*@.* \\| DRAFT`);
          // expect(el).match(tmpRegex);
        }
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("button[data-cy=\"fb-control-btn\"]").first().contains("Approve").first().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.wait(5000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check system creates new major revision after inline approve", () => {
        SystemRequirement("REQ-1040");
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recCheckRevisionStage({ stage: "Revision 2" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Change textfield and approve again", () => {
      it("Enter text 'Second entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080", "REQ-1100");
        cy.get(`[data-cy^="textfield-for-inline"] input`).scrollIntoView();
        cy.get(`[data-cy^="textfield-for-inline"] input`).arrowClick();
        cy.get(`[data-cy^="textfield-for-inline"] input`).arrowType(", Second entry");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Save record", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify system asks for another approval afer changing section", () => {
        SystemRequirement("REQ-1050", "REQ-0990", "REQ-1100", "REQ-1090");
        cy.get("[data-cy^=\"form.builder.approval.pending\"]")
          .first()
          .should("have.text", "Inline approval pending");
      });

      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
        cy.wait(5000);
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve second Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(10000);
      });
    });

    context("Edit and try to release it ", () => {
      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter text 'Third entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType(", Third entry");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save record", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Approve Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(10000);
      });
    });

    context("Approve and Release document", () => {
      it("Approve and release it", () => {
        cy.drClickRevisionsSidePanel();
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drClickRevisionsSidePanel();
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recApproveAndReleaseInlineRecord();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check only last record is shown on list and that it is in alpha state", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clear filters", () => {
        SystemRequirement("REQ-1110");
        cy.dlClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if there is only one record in list", () => {
        SystemRequirement("REQ-1110", "REQ-2790");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Filter record by name and status, and select it", () => {
        SystemRequirement("REQ-0120");
        cy.recFilterByTitle({ revision: "Record Document Revision" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(1000);
        cy.recFilterByStatus({ status: "Released" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("tr.k-master-row").first().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify record is in alpha state", () => {
        SystemRequirement("REQ-1060");
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recCheckRevisionStage({ stage: "Revision A" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Check doc status for ${STATUS_TYPES_LABEL.RELEASED} and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: "Record Document Revision" });
        cy.drGetDocIdElementFromUI().should("contain.text", "RD-").then(($docIdElement: JQuery<HTMLElement>) => {
          recDocId = $docIdElement.text();
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

    context("Verify email notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recDocId}`,
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
            sentToUser: USERS[2].email,
            contains: [`Hello <b>${USERS[2].name},</b>`,
              "Your documents are ready for download.",
              "<button type=\"button\">DOWNLOAD</button>",
              createdCompany.id,
            ],
          }];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });

    context("Verify zip file downloaded", () => {
      SystemRequirement("REQ-4860");
      it("Download zip file containing inline record notification", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${recDocId}${fileTimeFormat}_rel.zip`;
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

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content for Released document", () => {
      it("Extract texts from PDF file content for Released document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${recDocId}-A-Record-Document-Revision.pdf`,
        }).then((cdata) => {
          expect(cdata.numpages).eq(1);
          expect(cdata.text).match(/Page 1 of 1/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 1")) {
              pages[0] = element;
            }
          });
        });
      });

      it("Verify page 1 for Released document", () => {
        SystemRequirement("REQ-4850");
        SystemRequirement("REQ-4880");
        const el = pages[0];
        if (el.includes("Page 1 of 1")) {
          tmpRegex = new
          RegExp( `Record one\n${recDocId}, Revision A\nRECORD DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Textfield for inline\nFirst entry, Second entry, Third entry/);

          tmpRegex = new RegExp(`INLINE FIELD\\n${USERS[2].name} \\| Approved \\| ${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          expect(el).match(/Second textfield for inline\nFirst entry/);

          tmpRegex = new RegExp(`SECOND INLINE FIELD\\n${USERS[2].name} \\| Approved \\| ${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Release Details\\nReleased by: ${USERS[2].name}\\nReleased Date: ${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp( `Checkbox\\n(.*)\\n(.*)\\n(.*)\\n${USERS[2].name} \\| Approved \\| ${pdfDocRelDate}`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = RegExp( `${USERS[3].name}`, "gi" );
          expect(el).not.match(tmpRegex);

          expect(el).not.match(/TEXT FIELD/);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 1/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });
  });
});

export { };


