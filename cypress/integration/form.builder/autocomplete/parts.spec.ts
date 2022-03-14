// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { IMAPEmailsInTesting } from "../../../support/commands/imap/commands";
import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let partsID;

let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");


context("Autocomplete 'Parts' test", () => {
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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });
  });

  // TODO: Create form for Parts with API, not through document list creation!
  context("Create Form Part document to create Part", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Parts' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add Checkbox group", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").last().arrowClick({ force: true });
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
      cy.get("[data-cy=\"form.builder.add.field\"]").last().arrowClick({ force: true });
      cy.get("button[data-cy=\"form.builder.textfield\"]").arrowClick();
      cy.get(`input[name="label"]`).clear().arrowType("TEXT FIELD").arrowClick();
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      // eslint-disable-next-line max-len
      cy.get(`[data-cy="validators.required_if_in.name"]`).arrowType("Checkbox",  { force: true }).wait(1500).arrowType("{downarrow}{enter}",  { force: true });
      cy.get(`input[type="checkbox"][value="3"]`).last().check();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check doc Draft status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Draft");
      cy.get("#HeaderInfo-name").should("have.text", "New Part Form");
      cy.get("#HeaderInfo-docId").then((x) => {
        releasedFormId = x.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Parts form notification", () => {
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
        subject: `Export for document ${releasedFormId}`,
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
    it("Download zip file containing form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_draft.zip`;
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
        `${releasedFormId}-1-New-Part-Form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content for draft form", () => {
    it("Extract texts from PDF file content for Parts form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-New-Part-Form.pdf`,
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

    it("Verify page 1 for Parts form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nNew Part Form description/);

        expect(el).match(/Output Document Type\nParts/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/Make vs Buy\nPrimary Supplier\nOther Suppliers/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Traceability required\nSerialized\n Yes No\nSelect serialization\nTraceability required`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for Parts form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/IQC Required\nLimited Shelf Life\nFAI Required/);

        expect(el).match(/Checkbox\nTEXT FIELD\nIQC Required\nLimited Shelf Life\nFAI Required\n1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for Parts form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Check doc Released status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should("have.text", "New Part Form");
      cy.get("#HeaderInfo-docId").then((x) => {
        releasedFormId = x.text();
      });
      cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").then((x) => {
        arId = x.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Parts form notification", () => {
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
        subject: `Export for document ${releasedFormId}`,
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
    it("Download zip file containing form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_rel.zip`;
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
        `${releasedFormId}-1-New-Part-Form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content for released form", () => {
    it("Extract texts from PDF file content for Parts form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-New-Part-Form.pdf`,
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

    it("Verify page 1 for Parts form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nNew Part Form description/);

        expect(el).match(/Output Document Type\nParts/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/Make vs Buy\nPrimary Supplier\nOther Suppliers/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Traceability required\nSerialized\n Yes No\nSelect serialization\nTraceability required`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for Parts form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/IQC Required\nLimited Shelf Life\nFAI Required/);

        expect(el).match(/Checkbox\nTEXT FIELD\nIQC Required\nLimited Shelf Life\nFAI Required\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for Parts form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW PART FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Autocomplete 'Parts' test", () => {
    context("Create 'Parts'", () => {
      it("Navigates to parts list", () => {
        cy.navigToParts();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocPreview], () => {
          cy.ptClickCreateNewPart();
        });
      });

      it("Enter document title 'Parts document title'", () => {
        cy.drEnterDocumentTitle({ name: "Parts document title" });
      });

      it("Enter document description 'Parts document description'", () => {
        cy.drEnterDocumentDescription({ description: "Parts document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select make vs buy", () => {
        cy.get("[id$=\"make-vs-buy\"]").arrowClick();
        cy.get("ul[role=listbox]>li").contains("Make").arrowClick();
      });

      it("Select traceability required", () => {
        cy.get("[value=\"Traceability required\"]").check();
      });

      it("Select 'No' for Serialized option", () => {
        cy.get("[name=\"serialized\"][value=\"Yes\"]").check();
      });

      it("Select serialization", () => {
        cy.get("[id$=\"select-serialization\"]").arrowClick();
        cy.get("ul[role=listbox]>li").contains("Select Provided Serialization").arrowClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Extract document Id", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Draft");
        cy.get("#HeaderInfo-name").should("have.text", "Parts document title");
        cy.get("#HeaderInfo-docId").contains("PRT-").then(($x) => {
          releasedFormId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Parts document notification", () => {
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
          subject: `Export for document ${releasedFormId}`,
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
      it("Download zip file containing form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${releasedFormId}${filetime}_draft.zip`;
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
          `${releasedFormId}-1-Parts-document-title.pdf`);
        cy.readFile(pdffile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content for draft document", () => {
      it("Extract texts from PDF file content for Parts document", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${releasedFormId}-1-Parts-document-title.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(2);
          expect(cdata.text).match(/Page 1 of 2/);
          expect(cdata.text).match(/Page 2 of 2/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 2")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 2")) {
              pages[1] = element;
            }
          });
        });
      });

      it("Verify page 1 for Parts document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Parts\n${releasedFormId}, Revision 1\nPARTS DOCUMENT TITLE`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\nNone`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nParts document description/);

          expect(el).match(/Attachments\nimage.jpg/);

          expect(el).match(/Make vs Buy\nNone\n/);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp( `Traceability required\nIQC Required\nLimited Shelf Life\nFAI Required`, "gi" );
          expect(el).match(tmpRegex);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp( `Checkbox\nTraceability required\nIQC Required\nLimited Shelf Life\nFAI Required\n1 2 3`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);
        }
      });

      it("Verify page 2 for Parts document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Parts\n${releasedFormId}, Revision 1\nPARTS DOCUMENT TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);
        }
      });
    });

    context("Approve and release FORM document", () => {
      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          cy.fbClickButton({ el: "updateRecord" });
        });
      });

      it("Get created Parts ID", () => {
        cy.get("#HeaderInfo-docId").then((part) => { partsID = part.text(); });
      });

      it("Check doc Released status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Released");
        cy.get("#HeaderInfo-name").should("have.text", "Parts document title");
        cy.get("#HeaderInfo-docId").contains("PRT-").then(($x) => {
          releasedFormId = $x.text();
        });
        cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").then((x) => {
          arId = x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Parts document notification", () => {
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
          subject: `Export for document ${releasedFormId}`,
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
      it("Download zip file containing form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${releasedFormId}${filetime}_rel.zip`;
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
          `${releasedFormId}-1-Parts-document-title.pdf`);
        cy.readFile(pdffile).its("length").should("be.gt", 500);
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content for released document", () => {
      it("Extract texts from PDF file content for Parts document", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${releasedFormId}-1-Parts-document-title.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(2);
          expect(cdata.text).match(/Page 1 of 2/);
          expect(cdata.text).match(/Page 2 of 2/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 2")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 2")) {
              pages[1] = element;
            }
          });
        });
      });

      it("Verify page 1 for Parts document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Parts\n${releasedFormId}, Revision 1\nPARTS DOCUMENT TITLE`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\n${arId}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nParts document description/);

          expect(el).match(/Attachments\nimage.jpg/);

          expect(el).match(/Make vs Buy\nNone\n/);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp( `Traceability required\nIQC Required\nLimited Shelf Life\nFAI Required`, "gi" );
          expect(el).match(tmpRegex);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp( `Checkbox\nTraceability required\nIQC Required\nLimited Shelf Life\nFAI Required\n1 2 3`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);
        }
      });

      it("Verify page 2 for Parts document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Parts\n${releasedFormId}, Revision 1\nPARTS DOCUMENT TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}\nReleased`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);
        }
      });
    });

    context("Add Autocomplete 'Parts'", () => {
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

          it("Select 'Partss' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Parts" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Preview FORM document", () => {
          it("Click Form Review", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });
        });
      });

      context("Verify Autocomplete 'Parts'", () => {
        it("Verify autocomplete 'Parts'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=PART`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.length > 0 ) {
              const parts = response.body;
              parts.forEach((part) => {
                cy.get("ul>li[role=option]")
                  .should("contain.text", part.document.docId);
              });
              cy.get("ul>li[role=option]")
                .then(($lis) => {
                  expect($lis).to.have.length(response.body.length);
                });
            } else {
              cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
            }
          });
        });

        it("Verify created 'Parts' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", partsID);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
