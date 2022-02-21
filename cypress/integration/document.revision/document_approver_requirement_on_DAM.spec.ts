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
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");


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

    it("Upload attachment 'image.jpg'", () => {
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
      cy.get(`[data-cy="validators.required_if_in.name"]`).arrowType("Checkbox{downarrow}{enter}" );
      cy.get(`input[type="checkbox"][value="3"]`).last().check();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.pause();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify `DAM request form` title", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should("have.text", "Form DAM");
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

  context("Verify email for DAM request form notification", () => {
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
          downloadFile  =  `${releasedFormId}${filetime}.zip`;
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
    it("Extract texts from PDF file content for DAM request form", () => {
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

    it("Verify page 1 of DAM request form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nForm DAM/);

        expect(el).match(/Output Document Type\nDocument Approval Matrix/);

        expect(el).match(/Attachments\nimage.jpg/);

        expect(el).match(/APPROVAL ROLES/);

        expect(el).match(/APPROVAL MATRIX/);

        expect(el).match(/PREFIX\nINTERNAL\nTYPE\nDOCUMENT\nTYPE\nTRAINING\nREQUIRED\nNEEDS\nSIGNATURE\nCATEGORY\nAPPROVALS\nNUMERIC\nAPPROVALS\nNUMERIC\nALPHA\nAPPROVALS\nALPHA\nAPPROVALS\nADMINISTRATIVE/);

        expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of DAM request form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nFORM DAM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}`, "gi" );
        expect(el).match(tmpRegex);


        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });


  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Fills in Title and Description", () => {
    it(`Type a title: ${DAMDocument}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMDocument}` });
    });

    it(`Type a description: ${DAMDocument}`, () => {
      cy.drEnterDocumentDescription({ description: DAMDocument });
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Checkbox option 2 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

  });

  context(`Add New Role: ${roleOne}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.drAddAnotherRoleBtn();
      });

    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
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
    });
  });

  context("Add New Document Type", () => {
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
    });
  });

  context("Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.pause();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.pause();
    });
  });

  context(`Create document of new doc type: ${docTypeOne}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
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

  context("Save document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
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

  context("Save document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: documentOne });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
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

    it(`Verify approver is marked for ${roleOne}`, () => {
      cy.arApproverRoleStatus({ roleName: roleOne, enabled: true });
    });

    it(`Verify approver is marked for ${roleTwo}`, () => {
      cy.arApproverRoleStatus({ roleName: roleTwo, enabled: true });
    });

    it(`Verify approver is marked for ${roleThree}`, () => {
      cy.arApproverRoleStatus({ roleName: roleThree, enabled: true });
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();

    });

    it("Add first approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverList({ approver: FIRST_USER.email });
    });

    it("Add second approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverList({ approver: SECOND_USER.email });
    });

    it("Add third approver to approval request on approver list", () => {
      SystemRequirement("REQ-4270");
      cy.arAddApproverOnApproverList({ approver: THIRD_USER.email });
      cy.pause();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status is 'In Review'", () => {
      cy.arVerifyStatus({ status: "In Review" });
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
      cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApproveNew,
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        });
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
      cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApproveNew, () => {
        cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
      });
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
      cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApproveNew,
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
        });
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
      cy.arVerifyStatus({ status: "Released" });
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
      cy.arVerifyStatus({ status: "Released" });
    });
  });

});
