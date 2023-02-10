// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginAdmin;
let employeeLoginFirst;
let employeeLoginSecond;
let employeeLoginThird;
let arId;
let arIdRev1;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];

const ARDocument = "AR Document";
const FormDAM = "Form DAM";
const DAMDocument = "DAM Document";
const documentOne = "Document One";
const documentTwo = "Document Two";

const docTypeOne = "Design Document";
const docTypeTwo = "Clinical Document";
const docTypeOnePrefix = "DD";
const docTypeTwoPrefix = "CD";

const roleOne = "Role One";
const roleTwo = "Role Two";
const roleThree = "Role Three";

context("Document Approver Requirement on Document Approval Matrix", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
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
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          employeeLoginAdmin = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          employeeLoginFirst = company.employees.find((employee) => employee.user.email === FIRST_USER.email);
          employeeLoginSecond = company.employees.find((employee) => employee.user.email === SECOND_USER.email);
          employeeLoginThird = company.employees.find((employee) => employee.user.email === THIRD_USER.email);
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        done();
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginAdmin.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create DAM", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Type a title: '${FormDAM}'`, () => {
      cy.drEnterDocumentTitle({ name: `${FormDAM}` });
    });

    it(`Type a description: '${FormDAM}'`, () => {
      cy.drEnterDocumentDescription({ description: FormDAM });
    });

    it("Fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Fill in output document type: Document Approval Matrix", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
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
      cy.fbAddNewFieldWhenHiddenLastPlace();
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

  context("Save DAM form", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Verify `Draft DAM request form` title", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
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

  context("Verify email for draft DAM request form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing DAM request form", () => {
      SystemRequirement("REQ-4860");
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
    });

    it("Verify pdf file length more than 500 bytes", () => {
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${releasedFormId}-1-Form-DAM.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for draft DAM request form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Form-DAM.pdf`,
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

    it("Verify page 1 of draft DAM request form", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nForm DAM/);

        expect(el).match(/Output Document Type\nDocument Approval Matrix/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/APPROVAL ROLES/);

        expect(el).match(/APPROVAL MATRIX/);

        // eslint-disable-next-line max-len
        expect(el).match(/PREFIX\nINTERNAL\nTYPE\nDOCUMENT\nTYPE\nTRAINING\nREQUIRED\nNEEDS\nSIGNATURE\nCATEGORY\nAPPROVALS\nNUMERIC\nAPPROVALS\nNUMERIC\nALPHA\nAPPROVALS\nALPHA\nAPPROVALS\nADMINISTRATIVE/);

        expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Effective Date: N\/A/);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of released DAM request form", () => {
      SystemRequirement("REQ-4870");
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Effective Date: N\/A/);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("'Approve and Release' the document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Verify `Released DAM request form` title", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.drVerifyTitle({ title: "Form DAM" });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").then((x) => {
        arId = x.text();
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

  context("Verify email for released DAM request form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing DAM request form", () => {
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
    });

    it("Verify zip file length more than 500 bytes", () => {
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${releasedFormId}-1-Form-DAM.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for released DAM request form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Form-DAM.pdf`,
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

    it("Verify page 1 of released DAM request form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nForm DAM/);

        expect(el).match(/Output Document Type\nDocument Approval Matrix/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/APPROVAL ROLES/);

        expect(el).match(/APPROVAL MATRIX/);

        // eslint-disable-next-line max-len
        expect(el).match(/PREFIX\nINTERNAL\nTYPE\nDOCUMENT\nTYPE\nTRAINING\nREQUIRED\nNEEDS\nSIGNATURE\nCATEGORY\nAPPROVALS\nNUMERIC\nAPPROVALS\nNUMERIC\nALPHA\nAPPROVALS\nALPHA\nAPPROVALS\nADMINISTRATIVE/);

        expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of released DAM request form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfFooterDate}`, "gi" );
        expect(el).match(tmpRegex);


        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Fills in Title and Description", () => {
    it(`Type a title: ${DAMDocument}`, () => {
      cy.drEnterDocumentTitle({ name: DAMDocument });
    });

    it(`Type a description: ${DAMDocument}`, () => {
      cy.drEnterDocumentDescription({ description: DAMDocument });
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Checkbox option 2 checked", () => {
      cy.get(`input[type="checkbox"][value="2"]`).last().check();
      cy.wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Add New Role: ${roleOne}`, () => {
    it("Open approval roles tab", () => {
      cy.drSelectApprovalRolesTab();
    });

    it(`Open 'Add Role' dialog`, () => {
      cy.drAddAnotherRoleBtn();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Add New Role: ${roleTwo}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleTwo}`, () => {
      cy.drEnterApprovalRole({ name: roleTwo });
    });

    it(`Add approving users: ${SECOND_USER.name}`, () => {
      cy.drEnterApprovingUsers(SECOND_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Add New Role: ${roleThree}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleThree}`, () => {
      cy.drEnterApprovalRole({ name: roleThree });
    });

    it(`Add approving users: ${THIRD_USER.name}`, () => {
      cy.drEnterApprovingUsers(THIRD_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Add New Document Type", () => {
    it("Open matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it(`Add prefix: ${docTypeOnePrefix}`, () => {
      cy.drAddAMItemValue({ identity: "prefix", value: docTypeOnePrefix });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it(`Add document type: ${docTypeOne}`, () => {
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeOne });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 0 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 1 });
    });

    it(`Mark 'Approvals Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 0 });
    });

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 1 });
    });

    it(`Mark 'Approvals Administrative' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 0 });
    });

    it(`Mark 'Approvals Administrative' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 1 });
    });

    it("Save Approval Matrix Item", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Add Another Document Type", () => {
    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it(`Add prefix: ${docTypeTwoPrefix}`, () => {
      cy.drAddAMItemValue({ identity: "prefix", value: docTypeTwoPrefix });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it(`Add document type: ${docTypeTwo}`, () => {
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeTwo });
    });

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
    });

    it(`Mark 'Approvals Numeric' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 2 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 1 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 2 });
    });

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 1 });
    });

    it(`Mark 'Approvals Alpha' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 2 });
    });

    it(`Mark 'Approvals Administrative' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 1 });
    });

    it(`Mark 'Approvals Administrative' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 2 });
    });

    it("Save Approval Matrix Item", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Clicks on 'Save' button", () => {
    it("Check doc Draft status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.drVerifyTitle({ title: DAMDocument });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("DAM-").then((x) => {
        releasedFormId = x.text();
      });
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for draft document notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing document notification", () => {
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

  context("Verify PDF file content draft document", () => {
    it("Extract texts from PDF file content draft document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-1-DAM-Document.pdf`,
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

    it("Verify page 1 for draft document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        tmpRegex = new
        RegExp( `Description\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 for draft document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVAL ROLES/);

        tmpRegex = new
        RegExp( `Approval Role\nRole One\nApproving Users\n${FIRST_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Approval Role\nRole Two\nApproving Users\n${SECOND_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Approval Role\nRole Three\nApproving Users\n${THIRD_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).not.match(/TEXT FIELD/);

        tmpRegex = new RegExp( `Checkbox\n1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 for draft document", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 1\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).not.match(/TEXT FIELD/);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("'Approve and Release' the document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Check doc rev 1 released status", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.drVerifyTitle({ title: DAMDocument });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("DAM-").then((x) => {
        releasedFormId = x.text();
      });
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").then((x) => {
        arIdRev1 = x.text();
      });
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Check revised doc released status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.drVerifyTitle({ title: DAMDocument });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("DAM-").then((x) => {
        releasedFormId = x.text();
      });
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").then((x) => {
        arId = x.text();
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

  context("Verify email for release document notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing document notification", () => {
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

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content release document", () => {
    it("Extract texts from PDF file content release document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-2-DAM-Document.pdf`,
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

    it("Verify page 1 for released document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 2\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Description\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 for released document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 2\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/APPROVAL ROLES/);

        tmpRegex = new
        RegExp( `Approval Role\nRole One\nApproving Users\n${FIRST_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Approval Role\nRole Two\nApproving Users\n${SECOND_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Approval Role\nRole Three\nApproving Users\n${THIRD_USER.name}\nApproving Groups`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).not.match(/TEXT FIELD/);

        tmpRegex = new RegExp( `Checkbox\n1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 for released document", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new
        RegExp( `Document Approval Matrix\n${releasedFormId}, Revision 2\n${DAMDocument}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).not.match(/TEXT FIELD/);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}2N\\/A \\(Numeric Release\\)${pdfFooterDate}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `${arIdRev1}1N\\/A \\(Numeric Release\\)${pdfFooterDate}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context(`Create document of new doc type: ${docTypeOne}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${documentOne}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: documentOne });
    });

    it(`Fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeOne });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Create document", () => {
    it("Clicks on 'Create Document' button", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context(`Create document of new doc type: ${docTypeTwo}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${documentTwo}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: documentTwo });
    });

    it(`Fill in document type: ${docTypeTwo}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeTwo });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Create document", () => {
    it("Clicks on 'Create Document' button", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context(`Create approval request: ${ARDocument}`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.cmpClickCreateApprovalRequest();
    });

    it(`Enter title AR title: ${ARDocument}`, () => {
      cy.arEnterApprovalRequestTitle({ title: ARDocument });
    });

    it(`Enter description: ${ARDocument}`, () => {
      cy.arEnterApprovalRequestDescription({ description: ARDocument });
    });

    it("Add created document revision", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.arChoseSpecificProposedDocument({ name: documentOne });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add created document revision", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.arChoseSpecificProposedDocument({ name: documentTwo });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it(`Verify approver is disabled for ${roleOne}`, () => {
      cy.arApproverRoleStatus({ roleName: roleOne, enabled: false });
    });

    it(`Verify approver is disabled for ${roleTwo}`, () => {
      cy.arApproverRoleStatus({ roleName: roleTwo, enabled: false });
    });

    it(`Verify approver is disabled for ${roleThree}`, () => {
      cy.arApproverRoleStatus({ roleName: roleThree, enabled: false });
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Add first approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: FIRST_USER.email });
    });

    it("Add second approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: SECOND_USER.email });
    });

    it("Add third approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: THIRD_USER.email });
    });

    it(`Verify approver is marked for ${roleOne}`, () => {
      cy.arApproverRoleStatus({ roleName: roleOne, enabled: true });
    });

    it(`Verify approver is marked for ${roleTwo}`, () => {
      cy.arApproverRoleStatus({ roleName: roleTwo, enabled: true });
    });

    it(`Verify approver is marked for ${roleThree}`, () => {
      cy.arApproverRoleStatus({ roleName: roleThree, enabled: true });
    });

    it("Clicks on 'Save' button", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Check approval request document draft status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get(`[id="doc-header-title"]`).contains(ARDocument);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("AR-").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });
  });

  context("Verify email for approval request document notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for approval request ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing document notification", () => {
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

    it("extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
    });
  });

  context("Verify PDF file content document", () => {
    it("Extract texts from PDF file content document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-AR-Document.pdf`,
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

    it("Verify page 1 for approval request document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Approval Request\n${releasedFormId}\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Description\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #1\nDocument\nDD00004 - rev 1 - Document One\nDescription of change\ndescription\nJustification of change\njustification/);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #2\nDocument\nCD00005 - rev 1 - Document Two\nDescription of change\ndescription\nJustification of change\njustification/);

        expect(el).match(/Role One/);
        expect(el).match(/Role Two/);
        expect(el).match(/Role Three/);

        tmpRegex = new
        RegExp( `${FIRST_USER.name} \n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${SECOND_USER.name} \n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${THIRD_USER.name} \n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/DRAFT/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`Form Info: FM-00001, Revision 1, ${pdfFooterDate}`, "gi");
        // expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Send To Review", () => {
    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status is 'In Review'", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Check AR status in review and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.arCheckTitleInEditableAndMatches({ name: ARDocument });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("AR-").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });
  });

  context("Verify email for In Review approval request document notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for approval request ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing document notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_inreview.zip`;
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
  });

  context("Verify PDF file content document", () => {
    it("Extract texts from PDF file content document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-AR-Document.pdf`,
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

    it("Verify page 1 for In Review approval request document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Approval Request\n${releasedFormId}\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Description\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #1\nDocument\nDD00004 - rev 1 - Document One\nDescription of change\ndescription\nJustification of change\njustification/);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #2\nDocument\nCD00005 - rev 1 - Document Two\nDescription of change\ndescription\nJustification of change\njustification/);

        expect(el).match(/Role One/);
        expect(el).match(/Role Two/);
        expect(el).match(/Role Three/);

        tmpRegex = new
        RegExp( `${FIRST_USER.name} | PENDING ${pdfDocRelDate}\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${SECOND_USER.name} | PENDING ${pdfDocRelDate}\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${THIRD_USER.name} | PENDING ${pdfDocRelDate}\n\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/In Review/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`Form Info: FM-00001, Revision 1, ${pdfFooterDate}`, "gi");
        // expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context(`Login ${FIRST_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: employeeLoginFirst.id });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
    });

    it("Confirm password", () => {
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Login ${SECOND_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: SECOND_USER, employeeId: employeeLoginSecond.id });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
    });

    it("Confirm password", () => {
      SystemRequirement("REQ-0910");
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context(`Login ${THIRD_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: THIRD_USER, employeeId: employeeLoginThird.id });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
    });

    it("Confirm password", () => {
      cy.get(`[data-cy="transition.action.password"]`).arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("No validation error, submission is successful", () => {
    it("Check returned errors are empty", () => {
      cy.checkToastMessage({ exists: false });
    });
  });

  context(`Login admin '${ADMIN_USER.name}' user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginAdmin.id });
    });
  });

  context(`Open AR Doc: ${ARDocument}`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it(`Select '${ARDocument}'`, () => {
      cy.alClearFilters();
      cy.get("#root").contains(ARDocument).arrowClick();
    });

    it("Close Approval Request", () => {
      cy.arCloseAR();
    });

    it("Check Approval Request closed status and click on Send To Email", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.CLOSED });
      cy.arCheckTitleInEditableAndMatches({ name: ARDocument });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("AR-").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });
  });

  context("Verify email for approval request document notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for approval request ${releasedFormId}`,
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
            company.id],
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
    it("Download zip file containing document notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}_closed.zip`;
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
  });

  context("Verify PDF file document content", () => {
    it("Extract texts from PDF file document content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-AR-Document.pdf`,
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

    it("Verify page 1 for closed document", () => {
      const el = pages[0];

      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Approval Request\n${releasedFormId}\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `Description\n${ARDocument}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #1\nDocument\nDD00004 - rev 1 - Document One\nDescription of change\ndescription\nJustification of change\njustification/);

        // eslint-disable-next-line max-len
        expect(el).match(/DOCUMENT #2\nDocument\nCD00005 - rev 1 - Document Two\nDescription of change\ndescription\nJustification of change\njustification/);

        expect(el).match(/Role One/);
        expect(el).match(/Role Two/);
        expect(el).match(/Role Three/);

        tmpRegex = new
        RegExp( `${FIRST_USER.name} | APPROVED | ${pdfDocRelDate}\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${SECOND_USER.name} | APPROVED | ${pdfDocRelDate}\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new
        RegExp( `${THIRD_USER.name} | APPROVED | ${pdfDocRelDate}\n(.*)@(.*)`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/CLOSED/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        // tmpRegex = new RegExp(`Form Info: FM-00001, Revision 1, ${pdfFooterDate}`, "gi");
        // expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context(`Open created documents, ${documentOne} and ${documentTwo}`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Released documents", () => {
      cy.dlFilterByStatus({ status: "Released" });
    });

    it(`select '${documentOne}'`, () => {
      cy.get("#root").contains(documentOne).arrowClick();
    });

    it("Verify Document status is 'Released'", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Released document", () => {
      cy.dlFilterByStatus({ status: "Released" });
    });

    it(`Select '${documentTwo}'`, () => {
      cy.get("#root").contains(documentTwo).arrowClick();
    });

    it("Verify Document status is 'Released'", () => {
      SystemRequirement("REQ-0870", "REQ-2700");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});
