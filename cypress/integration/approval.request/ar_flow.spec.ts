// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let clinicalProtocolDocumentType;
let group;
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
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request form", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response: any) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response: any) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: clinicalProtocolDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Creates another document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description 2 </p>",
            document: {
              docId: "CP-00005",
              documentType: {
                id: clinicalProtocolDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
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

  context("Create new AR form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Approval request form template'", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description 'New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "New form template for approval request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Document tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewField();
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
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").first().contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify `Approval request form` title", () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", approvalRequestFormName);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Approval request form notification", () => {
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
    it("Download zip file containing Approval request form", () => {
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
      SystemRequirement("REQ-4860");
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
        `${releasedFormId}-1-New-Approval-request-form-template.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for Approval request form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-New-Approval-request-form-template.pdf`,
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

    it("Verify page 1 for Approval request form", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW APPROVAL REQUEST FORM TEMPLATE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nAR-00001/);

        expect(el).match(/Description\nNew form template for approval request/);

        expect(el).match(/Output Document Type\nApproval Request/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/APPROVAL REQUEST DETAILS/);

        expect(el).match(/DOCUMENT #1\nDescription of change\nJustification of change/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for Approval request form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW APPROVAL REQUEST FORM TEMPLATE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/DOCUMENT #2/);

        expect(el).match(/Description of change\nJustification of change/);

        expect(el).match(/APPROVERS\nNone\nCheckbox\nTEXT FIELD\n/);

        tmpRegex = new RegExp( `1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for Approval request form", () => {
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nNEW APPROVAL REQUEST FORM TEMPLATE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `AR-000011N\\/A \\(Numeric Release\\)${footerDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0680");
      cy.navigToApprovalRequestListWithoutApi();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      SystemRequirement("REQ-0690", "REQ-0700");
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.get(`#SMHeaderTmpl>[data-cy="description"]`).click();
      cy.arEnterApprovalRequestDescription({ description: "AR from New form template for approval request" });
      cy.unClick();
    });

    it("Add created document revision", () => {
      cy.drSelectDocumentTab();
      cy.arClickAddDocumentWithoutApi();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Checkbox option 2 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Click on Save", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add first Approver'", () => {
      cy.arSelectChangeDetailsTab();
      cy.wait(1000);
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[1].name });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add second Approver'", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].name });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Remove second Approver'", () => {
      cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick({ force: true });
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("check first approvers exists and second Approver removed", () => {
      cy.get("[name^=\"fb-approvers-approvers\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvers-approvers\"]")
        .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("Click on Save", () => {
      cy.arSaveApiCallWithoutApi();
    });
  });

  context("Click Send To Review", () => {
    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it(`Verify AR status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      SystemRequirement("REQ-0020", "REQ-0730", "REQ-0740");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then(($x) => {
        releasedFormId = $x.text();
      });
    });
  });

  context("Check document revision is 'In Review'", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "In Review" });
    });

    it(`Check document revision status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Reject AR and verify email notification", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Reject AR from dashboard", () => {
      cy.get("[data-cy=dashboardFeedList]>div").contains(`${USERS[1].name}needs your approval for`)
        .parent()
        .parent()
        .parent().trigger("mouseover")
        .find(`[data-cy="transition-reject"]`).first()
        .arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });

    it(`Verify reject notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", USERS[1].name)
        .and("contain", STATUS_TYPES_LABEL.REJECTED)
        .and("contain", releasedFormId);
    });

    it("Open doc to check draft state", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(releasedFormId).first().arrowClick();
    });
  });

  context("Check doc status and click on Send To Email", () => {
    it(`Check doc status as ${STATUS_TYPES_LABEL.DRAFT} and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get(`div[data-cy="field-title"]`).should("have.text", approvalRequestTitle);
      cy.get(`[data-cy="HeaderInfo-docId"]`).then(($x) => {
        releasedFormId = $x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for draft approval request notification", () => {
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing approval request notification", () => {
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

  context("Verify PDF file content for draft document", () => {
    it("Extract texts from PDF file content for draft document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-Approval-request-from-newly-created-form.pdf`,
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

    it("Verify page 1 for draft document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Approval Request\n${releasedFormId}\nAPPROVAL REQUEST FROM NEWLY CREATED FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nAR from New form template for approval request/);

        expect(el).match(/APPROVAL REQUEST DETAILS/);

        expect(el).match(/DOCUMENT #1/);

        expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        expect(el).match(/Description of change\nadded document description/);

        expect(el).match(/Justification of change\njustification for added document/);

        tmpRegex = new RegExp(`APPROVERS\\n${USERS[1].name} \\n(.*)\\nCheckbox\\n1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[2].name}`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).not.match(/REJECTED/);

        expect(el).match(/DRAFT/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Add approvers to approval request on approver list", () => {
    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it(`Verify AR status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      SystemRequirement("REQ-0020", "REQ-0730", "REQ-0740");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Check document revision is 'In Review'", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "In Review" });
    });

    it(`Check document revision status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Approve created AR", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToApprovalRequestListWithoutApi();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatusWithoutApi({ title: approvalRequestTitle, status: "IN_REVIEW" });
    });

    it("Approve AR", () => {
      SystemRequirement("REQ-0920", "REQ-4150", "REQ-4140", "REQ-4170");
      cy.arApproveARWithoutApi();
    });

    it(`Check approval request status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      SystemRequirement("REQ-0020", "REQ-0730", "REQ-4050");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });
  });

  context("Check document revision is 'Released'", () => {
    it("Navigate to added document in AR", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Approved" });
    });

    it(`Check document revision status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      SystemRequirement("REQ-4070");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });

    it("Navigate to AR list", () => {
      cy.navigToApprovalRequestListWithoutApi();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.alClearFilters();
      cy.arFilterARListByNameAndStatusWithoutApi({ title: approvalRequestTitle, status: STATUS_TYPES_LABEL.APPROVED });
    });

    it("Close AR and confirm pop-up for effective date", () => {
      SystemRequirement("REQ-2720", "REQ-4310", "REQ-4300");
      cy.arCloseAR();
    });

    it(`Check approval request status is ${STATUS_TYPES_LABEL.CLOSED}`, () => {
      SystemRequirement("REQ-0020", "REQ-0730", "REQ-2710", "REQ-4050", "REQ-4310", "REQ-4300");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.CLOSED });
    });

    it("Get document ID and Send To Email", () => {
      cy.get(`[data-cy="field-name"]`).should("have.text", approvalRequestTitle);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then(($x) => {
        releasedFormId = $x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

  });

  context("Verify email for Closed approval request notification", () => {
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

  context("Verify zip file downloaded", () => {
    it("Download zip file containing closed approval request notification", () => {
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

  context("Verify PDF file content for closed document", () => {
    it("Extract texts from PDF file content for closed document", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-Approval-request-from-newly-created-form.pdf`,
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
        RegExp( `Approval Request\n${releasedFormId}\nAPPROVAL REQUEST FROM NEWLY CREATED FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nAR from New form template for approval request/);

        expect(el).match(/APPROVAL REQUEST DETAILS/);

        expect(el).match(/DOCUMENT #1/);

        expect(el).match(/Document\nCP-00004 - rev 1 - New document for testing AR/);

        expect(el).match(/Description of change\nadded document description/);

        expect(el).match(/Justification of change\njustification for added document/);

        tmpRegex = new
        RegExp(`APPROVERS\\n${USERS[1].name} \\| APPROVED \\| ${docRelDate} (.*) \\n(.*)\\nCheckbox\\n1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[2].name}`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).match(/CLOSED/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Navigate to document list to check if document is 'Released'", () => {
    it("Navigate to document list to check if document is 'Released'", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Released" });
    });
  });

  context("Create AR and move it to 'Void'", () => {
    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0680");
      cy.navigToDashboardWithoutApi();
      cy.navigToApprovalRequestListWithoutApi();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      SystemRequirement("REQ-0690", "REQ-0700");
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: 'AR for Void'", () => {
      cy.arEnterApprovalRequestTitle({ title: "AR for Void" });
    });

    it("Enter description 'CR from New form template for voided approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for voided approval request" });
    });

    it("Add created document revision with description", () => {
      SystemRequirement("REQ-4290", "REQ-4280");
      cy.arSelectDocumentTab();
      cy.arClickAddDocumentWithoutApi();
      cy.arChoseSpecificProposedDocument({ name: "CP-00005" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Click 'Void'", () => {
      cy.arVoidAR();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it(`Verify AR status is ${STATUS_TYPES_LABEL.VOIDED}`, () => {
      SystemRequirement("REQ-0020", "REQ-0730", "REQ-0740");
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.VOIDED });
    });
  });
});

export { };
