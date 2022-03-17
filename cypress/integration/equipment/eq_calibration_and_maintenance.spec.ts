// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let adminEmployee;
let createdCompany;
let adminEmployeeLoginResponse;
let equipmentURL;
let createdPMFormDocumentId;
let createdCalibrationFormDocumentId;
let pmSchemaFieldName;
let calibrationSchemaFieldName;

let loginResponse;
let multipleCompanies;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");

context("Equipment maintenance and calibration", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          done();
        });
      });
    });

    it("[API]Login first user", (done: any) => {
      cy.authApiLogin({
        email: FIRST_USER.email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Create form for Equipment", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equpment form'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment form" });
    });

    it("Enter description 'Equpment formdescription'", () => {
      cy.drEnterDocumentDescription({ description: "Equpment form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
      cy.unClick();
    });

    context("Add preventative maintenance section", () => {
      it("Click add a field", () => {
        cy.fbClickAddNewHiddenBtn();
      });

      it("Select equipment", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
      });

      it("Add label for preventative maintenance", () => {
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
      });

      it("Mark Preventative Maintenance radio button", () => {
        cy.get("input[value=preventativeMaintenance]").check();
      });

      it("Add field", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add calibration section", () => {
      it("Click add a field", () => {
        cy.fbClickAddNewHiddenBtn();
      });

      it("Select equipment", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
      });

      it("Add label for Calibration", () => {
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
      });

      it("Mark Calibration radio button", () => {
        cy.get("input[value=calibration]").check();
      });

      it("Add field", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");

        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();

        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            pmSchemaFieldName = response.formTemplate.schema[3].name;
            calibrationSchemaFieldName = response.formTemplate.schema[4].name;
          }
        });

        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create form for Preventative maintenance", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative Maintenance form'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance form" });
    });

    it("Enter description 'Preventative Maintenance form description'", () => {
      cy.drEnterDocumentDescription({ description: "Preventative Maintenance form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
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
      cy.get(`[data-cy="validators.required_if_in.name"]`).arrowType("Checkbox{downarrow}{enter}" );
      cy.get(`input[type="checkbox"][value="3"]`).last().check();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify form draft status and Send To Email", () => {
    it("Verify form Draft status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Draft");
      cy.get("#HeaderInfo-name").should("have.text", "Preventative Maintenance form");
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

  context("Verify draft form email notification", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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
        `${releasedFormId}-1-Preventative-Maintenance-form.pdf`);
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
          fileName: `${releasedFormId}-1-Preventative-Maintenance-form.pdf`,
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

    it("Verify page 1 for PM form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPreventative Maintenance form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for PM form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Checkbox\nTEXT FIELD\nEquipment Maintenance Section/);

        expect(el).match(/APPROVALS\nApprovers\n1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for PM form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Approve and release form", () => {
    it("Approve and release form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        createdPMFormDocumentId = url.split("/").pop();
      });
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should("have.text", "Preventative Maintenance form");
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

  context("Verify released form email notification", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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
        `${releasedFormId}-1-Preventative-Maintenance-form.pdf`);
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
          fileName: `${releasedFormId}-1-Preventative-Maintenance-form.pdf`,
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

    it("Verify page 1 for PM form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPreventative Maintenance form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for PM form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Checkbox\nTEXT FIELD\nEquipment Maintenance Section/);

        expect(el).match(/APPROVALS\nApprovers\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for PM form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${docRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Create Calibration record", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration form'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration form" });
    });

    it("Enter description 'Calibration form description'", () => {
      cy.drEnterDocumentDescription({ description: "Calibration form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
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
      cy.get(`[data-cy="validators.required_if_in.name"]`).arrowType("Checkbox{downarrow}{enter}" );
      cy.get(`input[type="checkbox"][value="3"]`).last().check();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Draft");
      cy.get("#HeaderInfo-name").should("have.text", "Calibration form");
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

  context("Verify draft form email notification", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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
        `${releasedFormId}-1-Calibration-form.pdf`);
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
          fileName: `${releasedFormId}-1-Calibration-form.pdf`,
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

    it("Verify page 1 for CAL form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nCalibration form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for CAL form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Checkbox\nTEXT FIELD\nEquipment Maintenance Section/);

        expect(el).match(/APPROVALS\nApprovers\n1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for CAL form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Approve and release form", () => {
    it("Approve and release CAL form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        createdCalibrationFormDocumentId = url.split("/").pop();
      });
      cy.pause();

      it("Verify form released status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Released");
        cy.get("#HeaderInfo-name").should("have.text", "Calibration form");
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
  });

  context("Verify released form email notification", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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
        `${releasedFormId}-1-Calibration-form.pdf`);
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
          fileName: `${releasedFormId}-1-Calibration-form.pdf`,
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

    it("Verify page 1 for CAL form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nCalibration form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for CAL form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Checkbox\nTEXT FIELD\nEquipment Maintenance Section/);

        expect(el).match(/APPROVALS\nApprovers\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for CAL form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Create Equipment document", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Click add new Equipment", () => {
      cy.equipClickCreateNew();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[1].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"preventative\")]/../div[2]")
        .type("Instructions for preventative maintenance").wait(500);
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context("Create Preventative Maintenance record", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdPMFormDocumentId}/create_maintenance/${docIdFromUrl}/${pmSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Add first Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: FIRST_USER.name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: SECOND_USER.name });
    });

    it("Remove second Approver'", () => {
      cy.contains(`${SECOND_USER.name} - ${SECOND_USER.email}`).parent().next().arrowClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Extract document Id", () => {
      cy.get("#HeaderInfo-status").should("have.text", "WIP");
      cy.get("#HeaderInfo-name").should("have.text", "Preventative maintenance document");
      cy.get("#HeaderInfo-docId").contains("MR-").then(($x) => {
        releasedFormId = $x.text();
      });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first Approver", () => {
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.log(createdCompany.name);
      cy.log(multipleCompanies);
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Rejecting request", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
    });

    it("Verify there is no dashboard notifications", () => {
      cy.cmpVerifyNoPendingActions();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as admin user", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify reject notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", FIRST_USER.name)
        .and("contain", "REJECTED")
        .and("contain", releasedFormId);
    });

    it("Open doc to check WIP state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(releasedFormId).last().arrowClick();
    });
  });

  context("Check doc WIP status and click on Send To Email", () => {
    it("Check doc WIP status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "WIP");
      cy.get("#HeaderInfo-name").should("have.text", "Preventative maintenance document");
      cy.get("#HeaderInfo-docId").then(($x) => {
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

  context("Verify email receive for 'Export for document'", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing PM request notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_WIP.zip`;
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

    it("Verify attached image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-A-Preventative-maintenance-document.pdf`,
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

    it("Verify page 1 in WIP document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${releasedFormId}, Revision A\nPREVENTATIVE MAINTENANCE DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nimage.jpg/);

        // expect(el).match(/APPROVAL REQUEST DETAILS/);

        // expect(el).match(/DOCUMENT #1/);

        // expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        // expect(el).match(/Description of change\nadded document description/);

        // expect(el).match(/Justification of change\njustification for added document/);

        // tmpRegex = new RegExp(`Checkbox\\nAPPROVERS\\n${USERS[2].name} \\n(.*)\\n1 2 3`, "gi" );
        // expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`${USERS[1].name}`, "gi" );
        // expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`REJECTED`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00003, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve record and release", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first approver", () => {
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.log(createdCompany.name);
      cy.log(multipleCompanies);
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Accept Approval Request with password prompt", () => {
      SystemRequirement("REQ-0920");
      cy.wrapWithWaitOnApiCall(
        CyRoutes.ChangeRequestApprove, () => {
          cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Verify there is no dashboard notifications", () => {
      SystemRequirement("REQ-2200");
      cy.cmpVerifyNoPendingActions();
    });

    it("Logout from existing user", () => {
      cy.authLogout();
    });

    it("Login as admin user", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify approval notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", FIRST_USER.name)
        .and("contain", "APPROVED")
        .and("contain", releasedFormId);
    });

    it("Open doc to check released state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(releasedFormId).last().arrowClick();
      cy.pause();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Check doc Released status and click on Send To Email", () => {
    it("Check doc released status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should("have.text", "Preventative maintenance document");
      cy.get("#HeaderInfo-docId").then(($x) => {
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

  context("Verify email receive for 'Export for document'", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing approval request notification", () => {
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

    it("extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
    });

    it("Verify attached image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-A-Preventative-maintenance-document.pdf`,
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

    it("Verify page 1 in released document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${releasedFormId}, Revision A\nPREVENTATIVE MAINTENANCE DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nimage.jpg/);

        // expect(el).match(/APPROVAL REQUEST DETAILS/);

        // expect(el).match(/DOCUMENT #1/);

        // expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        // expect(el).match(/Description of change\nadded document description/);

        // expect(el).match(/Justification of change\njustification for added document/);

        // tmpRegex = new RegExp(`Checkbox\\nAPPROVERS\\n${USERS[2].name} \\n(.*)\\n1 2 3`, "gi" );
        // expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`${USERS[1].name}`, "gi" );
        // expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`REJECTED`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00003, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Create Calibration record", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview, CyRoutes.EmployeesGet], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click 'NEW PM' on calibration section", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdCalibrationFormDocumentId}/create_maintenance/${docIdFromUrl}/${calibrationSchemaFieldName}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Select document type 'Maintenance Record'", () => {
      cy.drSelectDocumentType({ documentType: "Maintenance Record" });
    });

    it("Select revision stage 'Numeric'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();

      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Add first Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: FIRST_USER.name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: SECOND_USER.name });
    });

    it("Remove second Approver'", () => {
      cy.contains(`${SECOND_USER.name} - ${SECOND_USER.email}`).parent().next().arrowClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Extract document Id", () => {
      cy.get("#HeaderInfo-status").should("have.text", "WIP");
      cy.get("#HeaderInfo-name").should("have.text", "Calibration document");
      cy.get("#HeaderInfo-docId").contains("MR-").then(($x) => {
        releasedFormId = $x.text();
      });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first Approver", () => {
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.log(createdCompany.name);
      cy.log(multipleCompanies);
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Rejecting request", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
    });

    it("Verify there is no dashboard notifications", () => {
      cy.cmpVerifyNoPendingActions();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as admin user", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify reject notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", FIRST_USER.name)
        .and("contain", "REJECTED")
        .and("contain", releasedFormId);
    });

    it("Open doc to check WIP state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(releasedFormId).last().arrowClick();
    });
  });

  context("Check doc WIP status and click on Send To Email", () => {
    it("Check doc WIP status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "WIP");
      cy.get("#HeaderInfo-name").should("have.text", "Calibration document");
      cy.get("#HeaderInfo-docId").then(($x) => {
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

  context("Verify email receive for 'Export for document'", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing Calibration document", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_WIP.zip`;
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

    it("Verify attached image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-A-Calibration-document.pdf`,
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

    it("Verify page 1 in CAL document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${releasedFormId}, Revision A\nCALIBRATION DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nimage.jpg/);

        // expect(el).match(/APPROVAL REQUEST DETAILS/);

        // expect(el).match(/DOCUMENT #1/);

        // expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        // expect(el).match(/Description of change\nadded document description/);

        // expect(el).match(/Justification of change\njustification for added document/);

        // tmpRegex = new RegExp(`Checkbox\\nAPPROVERS\\n${USERS[2].name} \\n(.*)\\n1 2 3`, "gi" );
        // expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`${USERS[1].name}`, "gi" );
        // expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`REJECTED`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00003, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve record and release", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first approver", () => {
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.log(createdCompany.name);
      cy.log(multipleCompanies);
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Accept Approval Request with password prompt", () => {
      SystemRequirement("REQ-0920");
      cy.wrapWithWaitOnApiCall(
        CyRoutes.ChangeRequestApprove, () => {
          cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
          cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
          cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Verify there is no dashboard notifications", () => {
      SystemRequirement("REQ-2200");
      cy.cmpVerifyNoPendingActions();
    });

    it("Logout from existing user", () => {
      cy.authLogout();
    });

    it("Login as admin user", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify approval notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", FIRST_USER.name)
        .and("contain", "APPROVED")
        .and("contain", releasedFormId);
    });

    it("Open doc to check released state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(releasedFormId).last().arrowClick();
      cy.pause();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

  context("Check doc Released status and click on Send To Email", () => {
    it("Check doc released status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should("have.text", "Calibration document");
      cy.get("#HeaderInfo-docId").then(($x) => {
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

  context("Verify email receive for 'Export for document'", () => {
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing Calibration notification", () => {
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

    it("extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
    });

    it("Verify attached image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-A-Calibration-document.pdf`,
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

    it("Verify page 1 in released document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${releasedFormId}, Revision A\nCALIBRATION DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nimage.jpg/);

        // expect(el).match(/APPROVAL REQUEST DETAILS/);

        // expect(el).match(/DOCUMENT #1/);

        // expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        // expect(el).match(/Description of change\nadded document description/);

        // expect(el).match(/Justification of change\njustification for added document/);

        // tmpRegex = new RegExp(`Checkbox\\nAPPROVERS\\n${USERS[2].name} \\n(.*)\\n1 2 3`, "gi" );
        // expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`${USERS[1].name}`, "gi" );
        // expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`REJECTED`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00003, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Verify Maintenance History is now only History", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Verify Maintenance History is changed to History", () => {
      it("Verify for pm", () => {
        cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
        cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
      });

      it("Verify for calibration", () => {
        cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
      });
    });
  });

  context("Verify Due date calculation", () => {
    it("Check preventative maintenance due date calculation is 365 days from now", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(365, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDone - Due Date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from now", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(365, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDone - Due Date: ${calibrationComplianceDate}`);
        });
    });
  });

  context("Revise PM completion date to 10 days earlier", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Select PM document", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "Preventative maintenance", status: "Released" });
    });

    it("Click revise on maintenance record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drClickReviseDocument();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Change 'Completion Date' to 10 days prior", () => {
      const completionDate = moment().tz("America/Los_Angeles").subtract(10, "days");
      const month = completionDate.format("MMMM");
      const day = completionDate.format("D");

      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();

        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(0).arrowClick();
        }

        cy.wait(500);

        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();

            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });
  });

  context("Revise Calibration completion date to 10 days later", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Select PM document", () => {
      cy.recFilterRecordListByNameAndStatus({ title: "Calibration document", status: "Released" });
    });

    it("Click revise on maintenance record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.drClickReviseDocument();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Change 'Completion Date' to 10 days later", () => {
      const completionDate = moment().tz("America/Los_Angeles").add(10, "days");
      const month = completionDate.format("MMMM");
      const day = completionDate.format("D");

      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();

        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(1).arrowClick();
        }

        cy.wait(500);

        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();

            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
      cy.wait(10000);
    });
  });

  context("Verify Due date calculation", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Check preventative maintenance due date calculation is 365 days from completion date", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(355, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDone - Due Date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from completion date", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(375, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDue - Due Date: ${calibrationComplianceDate}`);
        });
    });
  });
});
