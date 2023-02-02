
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let adminEmployee;
let createdCompany;
let adminEmployeeLoginResponse;
let equipmentURL;

const multipleCompanies = true;
let pMFormId;
let pMDocId;
let calFormId;
let calDocId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

const ADMIN_USER = USERS[11];
const FIRST_USER = USERS[12];
const SECOND_USER = USERS[13];
const THIRD_USER = USERS[14];

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

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    context("Add preventative maintenance section", () => {
      it("Click add a field", () => {
        cy.fbClickAddNewHiddenBtn();
      });

      it("Select equipment", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
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
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
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
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }).as("response");

        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();

        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Add Checkbox group", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify form draft status and Send To Email", () => {
    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "Preventative Maintenance form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        pMFormId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify draft form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${pMFormId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing training form", () => {
      cy.wait(2000);
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${pMFormId}${filetime}_draft.zip`;
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
        `${pMFormId}-1-Preventative-Maintenance-form.pdf`);
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
          fileName: `${pMFormId}-1-Preventative-Maintenance-form.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPreventative Maintenance form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date\nEquipment Maintenance Section/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for PM form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for PM form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
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
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Preventative Maintenance form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        pMFormId = $docIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify released form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${pMFormId}`,
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
          sentToUser: ADMIN_USER.email,
          contains: [`Hello <b>${ADMIN_USER.name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.wait(2000);
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
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${pMFormId}${filetime}_rel.zip`;
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
        `${pMFormId}-1-Preventative-Maintenance-form.pdf`);
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
          fileName: `${pMFormId}-1-Preventative-Maintenance-form.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPreventative Maintenance form description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date\nEquipment Maintenance Section/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for PM form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for PM form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4870");
      SystemRequirement("REQ-4880");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${pMFormId}, Revision 1\nPREVENTATIVE MAINTENANCE FORM`, "gi" );
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

  context("Create form for Calibration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
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

    it("Enter description 'Calibration description'", () => {
      cy.drEnterDocumentDescription({ description: "Calibration description" });
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

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Add Checkbox group", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "Calibration form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        calFormId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify draft form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${calFormId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing training form", () => {
      cy.wait(2000);
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${calFormId}${filetime}_draft.zip`;
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
        `${calFormId}-1-Calibration-form.pdf`);
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
          fileName: `${calFormId}-1-Calibration-form.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nCalibration description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date\nEquipment Maintenance Section/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for CAL form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for CAL form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
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
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify form released status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Calibration form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        calFormId = $docIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify released form email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${calFormId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing training form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${calFormId}${filetime}_rel.zip`;
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
        `${calFormId}-1-Calibration-form.pdf`);
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
          fileName: `${calFormId}-1-Calibration-form.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nCalibration description/);

        expect(el).match(/Output Document Type\nMaintenance Record/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS\nEquipment\nMaintainer\nCompletion Date\nEquipment Maintenance Section/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for CAL form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for CAL form", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${calFormId}, Revision 1\nCALIBRATION FORM`, "gi" );
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

    it("navigate to Specification", () => {
      cy.drSelectSpecificationTab();
    });

    it(`Select '${ADMIN_USER.name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it(`Select '${ADMIN_USER.name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("navigate to overview", () => {
      cy.drSelectOverviewTab();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
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
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick({ force: true });
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
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context("Create Preventative Maintenance record", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
            CyRoutes.GetAvailableApprovers], () => {
            cy.visit(newUrl);
          });
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
      cy.wait(2000);
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
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
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Extract document Id", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.arCheckTitleInEditableAndMatches({ name: "Preventative maintenance document" });
      cy.drGetDocIdElementFromUI().should("contain.text", "MR-").then(($docIdElement: JQuery<HTMLElement>) => {
        pMDocId = $docIdElement.text();
      });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first Approver", () => {
      cy.wait(2000);
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Rejecting request", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
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
        .and("contain", pMDocId);
    });

    it("Open doc to check WIP state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(pMDocId).last().arrowClick();
    });
  });

  context("Check doc WIP status and click on Send To Email", () => {
    it("Check doc WIP status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.arCheckTitleInEditableAndMatches({ name: "Preventative maintenance document" });
      cy.drGetDocIdElementFromUI().should("contain.text", "MR-").then(($docIdElement: JQuery<HTMLElement>) => {
        pMDocId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify email receive for 'Export for document'", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${pMDocId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing PM request notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${pMDocId}${filetime}_WIP.zip`;
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
        fileName: `${pMDocId}-A-Preventative-maintenance-document.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${pMDocId}, Revision A\nPREVENTATIVE MAINTENANCE DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS/);

        expect(el).match(/Equipment\nEQ-00001 - 1 Equipment document/);

        tmpRegex = new RegExp(`Maintainer\n${ADMIN_USER.name}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Completion Date\n${footerDate}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${FIRST_USER.name} \\- .*@.* \\| DRAFT`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${SECOND_USER.name}`, "gi" );
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
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Login as first approver", () => {
      cy.wait(2000);
      cy.authLogin({
        email: FIRST_USER.email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Accept Approval Request with password prompt", () => {
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      SystemRequirement("REQ-0920");
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Verify there is no dashboard notifications", () => {
      SystemRequirement("REQ-2200");
      cy.wait(1000);
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
        .and("contain", pMDocId);
    });

    it("Open doc to check released state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(pMDocId).last().arrowClick();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Check doc Released status and click on Send To Email", () => {
    it("Check doc released status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Preventative maintenance document" });
      cy.drGetDocIdElementFromUI().should("contain.text", "MR-").then(($docIdElement: JQuery<HTMLElement>) => {
        pMDocId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify email receive for 'Export for document'", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${pMDocId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing approval request notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${pMDocId}${filetime}_rel.zip`;
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
        fileName: `${pMDocId}-A-Preventative-maintenance-document.pdf`,
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

    it("Verify page 1 in Released document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${pMDocId}, Revision A\nPREVENTATIVE MAINTENANCE DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS/);

        expect(el).match(/Equipment\nEQ-00001 - 1 Equipment document/);

        tmpRegex = new RegExp(`Maintainer\n${ADMIN_USER.name}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Completion Date\n${footerDate}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`APPROVALS\\n${FIRST_USER.name} \\- .*@.* \\| APPROVED \\| ${docRelDate}.*`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${SECOND_USER.name}`, "gi" );
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
      cy.visit(equipmentURL);
    });

    it("Click on New CAL", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
            CyRoutes.GetAvailableApprovers], () => {
            cy.visit(newUrl);
          });
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
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
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Extract document Id", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.arCheckTitleInEditableAndMatches({ name: "Calibration document" });
      cy.drGetDocIdElementFromUI().should("contain.text", "MR-").then(($docIdElement: JQuery<HTMLElement>) => {
        calDocId = $docIdElement.text();
      });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
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
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Rejecting request", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
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
        .and("contain", calDocId);
    });

    it("Open doc to check WIP state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(calDocId).last().arrowClick();
    });
  });

  context("Check doc WIP status and click on Send To Email", () => {
    it("Check doc WIP status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.arCheckTitleInEditableAndMatches({ name: "Calibration document" });
      cy.drGetDocIdElementFromUI().should("contain.text", "MR-").then(($docIdElement: JQuery<HTMLElement>) => {
        calDocId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify email receive for 'Export for document'", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${calDocId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing Calibration document", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${calDocId}${filetime}_WIP.zip`;
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
        fileName: `${calDocId}-A-Calibration-document.pdf`,
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
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${calDocId}, Revision A\nCALIBRATION DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS/);

        expect(el).match(/Equipment\nEQ-00001 - 1 Equipment document/);

        tmpRegex = new RegExp(`Maintainer\n${ADMIN_USER.name}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Completion Date\n${footerDate}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${FIRST_USER.name} \\- .*@.* \\| DRAFT`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${SECOND_USER.name}`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve record and release", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
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
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Accept Approval Request with password prompt", () => {
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      SystemRequirement("REQ-0920");
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
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
        .and("contain", calDocId);
    });

    it("Open doc to check released state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(calDocId).last().arrowClick();
    });

    it("Verify status is 'Released'", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Check doc Released status and click on Send To Email", () => {
    it("Check doc released status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Calibration document" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        calDocId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify email receive for 'Export for document'", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase,

        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${calDocId}`,
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
    SystemRequirement("REQ-4860");
    it("Download zip file containing Calibration notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${calDocId}${filetime}_rel.zip`;
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
        fileName: `${calDocId}-A-Calibration-document.pdf`,
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

    it("Verify page 1 in Released document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Maintenance Record\n${calDocId}, Revision A\nCALIBRATION DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/MAINTENANCE DETAILS/);

        expect(el).match(/Equipment\nEQ-00001 - 1 Equipment document/);

        tmpRegex = new RegExp(`Maintainer\n${ADMIN_USER.name}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Completion Date\n${footerDate}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`APPROVALS\\n${FIRST_USER.name} \\- .*@.* \\| APPROVED \\| ${docRelDate}.*`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${SECOND_USER.name}`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Verify Maintenance History is now only History", () => {
    it("Navigate to Equipment document", () => {
      cy.visit(equipmentURL);
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
          expect(text).to.contain(`PMDone - Due date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from now", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(365, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDone - Due date: ${calibrationComplianceDate}`);
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
      cy.drClickReviseDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
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
      cy.drClickReviseDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add approver", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.email });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve record", () => {
      cy.ebApprove();
      cy.wait(10000);
    });
  });

  context("Verify Due date calculation", () => {
    it("Navigate to Equipment document", () => {
      cy.visit(equipmentURL);
    });

    it("Check preventative maintenance due date calculation is 365 days from completion date", () => {
      const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
        .add(355, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(0).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`PMDone - Due date: ${prevMaintenanceComplianceDate}`);
        });
    });

    it("Check calibration due date calculation is 365 days from completion date", () => {
      const calibrationComplianceDate = moment().tz("America/Los_Angeles")
        .add(375, "days")
        .format("ddd, MMMM D, YYYY");
      cy.get("[data-cy=\"maintenance.status\"]")
        .eq(1).then(($el) => {
          const text = $el.text().replace(/\u00a0/g, "");
          expect(text).to.contain(`CALDue - Due date: ${calibrationComplianceDate}`);
        });
    });
  });
});
