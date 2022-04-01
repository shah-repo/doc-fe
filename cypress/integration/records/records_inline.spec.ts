// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import path from "path";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let recFormId;

let multipleCompanies;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");

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
              {
                documentTypeName: "Legal Record",
                documentTypeAcronym: "LR-",
                group: "RECORD",
                isQms: true,
                needsSignature: true,
                category: "Record",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
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
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
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
        cy.drSelectOutputDocumentType({ documentType: "Legal Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Add textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectTextField();
        cy.fbAddLabelName({ name: "Textfield for inline" });
        cy.fbAddField();
      });

      it("Add inline approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.fbSelectInlineApproval();
        });
        cy.get("[name=\"label\"]").arrowType("Inline field");
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddField();
      });

      it("Add second textfield", () => {
        cy.fbClickAddNewHiddenBtn();

        cy.fbSelectTextField();
        cy.fbAddLabelName({ name: "Second textfield for inline" });
        cy.fbAddField();
      });

      it("Add second inline approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectInlineApproval();
        cy.get("[name=\"label\"]").arrowType("Second inline field");
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.fbAddField();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Add Checkbox group", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).arrowClick({ force: true });
        cy.get("[class=\"MuiButton-label\"]").contains("Checkbox group").arrowClick();
        cy.get(`input[name="label"]`).clear().arrowType("Checkbox").arrowClick();
        cy.get("[data-cy=\"options\"]").arrowType("1{enter}" );
        cy.get("[data-cy=\"options\"]").arrowType("2{enter}" );
        cy.get("[data-cy=\"options\"]").arrowType("3{enter}" );
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-2).arrowClick({ force: true });
        cy.get("button[data-cy=\"form.builder.textfield\"]").arrowClick();
        cy.get(`input[name="label"]`).clear().arrowType("TEXT FIELD").arrowClick();
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get(`input[name="validators.required_if_in"]`).check();
        cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
        cy.get(`input[type="checkbox"][value="3"]`).last().check();
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create document and draft it", () => {
      it("Click create document after filling document", () => {
        cy.pause();
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify form Draft status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: "Draft" });
        cy.arCheckTitleInEditableAndMatches({ name: "Inline Form Document Revision" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });


    context("Verify email for  record form notification", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          if (emails) {
            emailsFromInbox = emails;
            expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
          }
          else {
            assert.fail("No email found");
          }
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
      it("Download zip file containing record form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${recFormId}${filetime}_draft.zip`;
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
        const el = pages[0];
        if (el.includes("Page 1 of 3")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/AR ID\nNone/);

          expect(el).match(/Description\nInline Form Document Revision description/);

          expect(el).match(/Output Document Type\nLegal Record/);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Textfield for inline/);

          expect(el).match(/Inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          expect(el).match(/Second textfield for inline/);

          expect(el).match(/Checkbox\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");

          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");

          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 3/);
        }
      });

      it("Verify page 2 of record form", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/TEXT FIELD/);

          expect(el).match(/Second inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");

          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");

          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 3/);
        }
      });

      it("Verify page 3 of record form", () => {
        const el = pages[2];
        if (el.includes("Page 3 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");

          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");

          expect(el).match(tmpRegex);

          expect(el).match(/Page 3 of 3/);
        }
      });
    });

    context("Approve document and release it", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Verify form Draft status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
        cy.arCheckTitleInEditableAndMatches({ name: "Inline Form Document Revision" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
        });
        cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
          arId = $lnEl.text();
        });
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
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
          if (emails) {
            emailsFromInbox = emails;
            expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
          }
          else {
            assert.fail("No email found");
          }
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
      it("Download zip file containing record form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${recFormId}${filetime}_rel.zip`;
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
        const el = pages[0];
        if (el.includes("Page 1 of 3")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nInline Form Document Revision description/);

          expect(el).match(/Output Document Type\nLegal Record/);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Textfield for inline/);

          expect(el).match(/Inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          expect(el).match(/Second textfield for inline/);

          expect(el).match(/Checkbox\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 3/);
        }
      });

      it("Verify page 2 of record form", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/TEXT FIELD/);

          expect(el).match(/Second inline field\nInline approval pending/);

          expect(el).match(/At least one approval required/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 3/);
        }
      });

      it("Verify page 3 of record form", () => {
        const el = pages[2];
        if (el.includes("Page 3 of 3")) {

          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nINLINE FORM DOCUMENT REVISION`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 3 of 3/);
        }
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and chose 'Legal Record'", () => {
      SystemRequirement("REQ-2760");
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Legal Record" });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
      });

      it("Enter description 'Record Document Revision description'", () => {
        cy.drEnterDocumentDescriptionWithWait({ description: "Record Document Revision description" });
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType("First entry");
          cy.unClick();
        });
      });

      it("Enter text 'First entry' in second textfield for inline", () => {
        SystemRequirement("REQ-1080");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=\"second-textfield-for-inline\"] input")
            .type("First entry");
          cy.unClick();
        });
      });

      it("Select approver for first inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[name*=\"fb-ia-inline-field\"] input")
              .autocompleteSelect("enlil.testmail+cy2");
          });
      });

      it("Select approver for second inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.get("[name*=\"fb-ia-second-inline-field\"] input")
              .autocompleteSelect("enlil.testmail+cy2");
          });
      });

      it("Check inline record creation default to numeric revision", () => {
        SystemRequirement("REQ-1020");
        cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
          .contains("Revision 1");
      });

      it("Check approve button is not disabled", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").should("not.be.disabled");

      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.GetDocAggregatedAudit,
          CyRoutes.SessionDetails], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check system creates new major revision after inline approve", () => {
        SystemRequirement("REQ-1040");
        cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
          .contains("Revision 2");
      });

      context("Change textfield and approve again", () => {
        it("Enter text 'Second entry' in textfield for inline", () => {
          SystemRequirement("REQ-1080", "REQ-1100");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostOrPatchDocRev,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType(", Second entry");
            cy.unClick();
            cy.progressBarShouldNotExist();
          });
        });

        it("Save record", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
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
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.GetDocAggregatedAudit,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.checkToastMessage({ exists: false });
        });

        it("Approve second Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.GetDocAggregatedAudit,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Edit and try to release it ", () => {
        it("Enter text 'Third entry' in textfield for inline", () => {
          SystemRequirement("REQ-1080");
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostOrPatchDocRev,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType(", Third entry");
            cy.unClick();
            cy.progressBarShouldNotExist();
          });
        });

        it("Save record", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve Inline Approval", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").first().arrowClick();
          cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.GetDocAggregatedAudit,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy=\"common.confirm\"]").arrowClick();
          });
          cy.checkToastMessage({ exists: false });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Approve and Release document", () => {
        it("Approve and release it", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          });
          cy.recApproveAndReleaseInlineRecord();
        });
      });

      context("Check only last record is shown on list and that it is in alpha state", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Clear filters", () => {
          SystemRequirement("REQ-1110");
          cy.dlClearFilters();
        });

        it("Check if there is only one record in list", () => {
          SystemRequirement("REQ-1110", "REQ-2790");
          cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        });

        it("Filter record by name and status, and select it", () => {
          SystemRequirement("REQ-0120");
          cy.recFilterByTitle({ revision: "Record Document Revision" });
          cy.wait(1000);
          cy.recFilterByStatus({ status: "Released" });
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.DocPreview,
            CyRoutes.GetRequiredApproversDocRev,
            CyRoutes.GetRequiredApproversDocRev,
          ], () => {
            cy.get("tr.k-master-row").first().arrowClick();
          });
        });

        it("Verify record is in alpha state", () => {
          SystemRequirement("REQ-1060");
          cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
            .contains("Revision A");
        });
      });
    });
  });
});

export { };


