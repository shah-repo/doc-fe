// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");
let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let thirdEmployee;
let RDdocumentType;

let recFormId;
let recDocId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

context("Records flow", () => {
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
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
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
                visible: false,
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
                label: "Approve and Release",
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

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });
  });

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeToDevs.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });
  });

  context("Create first Record with form", () => {
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
      it("Enters title 'Lot History Record'", () => {
        cy.drEnterDocumentTitle({ name: "Lot History Record" });
      });

      it("Enters description 'Lot History Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Lot History Record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Upload attachement picture 'image.jpg'", () => {
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
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify approvals field is automatically added", () => {
        SystemRequirement("REQ-0980");
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Creates document and Draft it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.arCheckTitleInEditableAndMatches({ name: "Lot History Record" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
        });
        cy.sendToEmail();
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for recordform notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recFormId}`,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
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
          `${recFormId}-1-Lot-History-Record.pdf`);
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
            fileName: `${recFormId}-1-Lot-History-Record.pdf`,
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

      it("Verify page 1 for record form", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nLOT HISTORY RECORD`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/AR ID\nNone/);

          expect(el).match(/Description\nLot History Record description/);

          expect(el).match(/Output Document Type\nRecord Document/);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);
        }
      });

      it("Verify page 2 of record form", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nLOT HISTORY RECORD`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);
        }
      });
    });

    context("Approve and Release document", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: "Lot History Record" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          recFormId = $docIdElement.text();
        });
        cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
          arId = $lnEl.text();
        });
        cy.sendToEmail();
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
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
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
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
          `${recFormId}-1-Lot-History-Record.pdf`);
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
            fileName: `${recFormId}-1-Lot-History-Record.pdf`,
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

      it("Verify page 1 for record form", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nLOT HISTORY RECORD`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nLot History Record description/);

          expect(el).match(/Output Document Type\nRecord Document/);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);
        }
      });

      it("Verify page 2 of record form", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Form\n${recFormId}, Revision 1\nLOT HISTORY RECORD`, "gi" );
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

          expect(el).match(/Page 2 of 2/);
        }
      });
    });
  });

  context("Create second Record with form", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title 'Approval Record'", () => {
        cy.drEnterDocumentTitle({ name: "Approval Record" });
      });

      it("Enters description 'Approval Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Approval Record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify approvals field is automatically added", () => {
          SystemRequirement("REQ-0980");
          cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Check if there are multiple record forms to select", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    it("Create new record button click", () => {
      SystemRequirement("REQ-2770");
      cy.recCreateRecordFromLandingPage();
    });

    it("Check if multiple record forms exist", () => {
      SystemRequirement("REQ-0970");
      cy.recCheckIfMultilpeFormsAreAvailable({
        recordType: "Record Document",
        recordForms: ["Approval Record", "Lot History Record"],
      });
    });
  });

  context("Create new record without inline approval form and check if they are in alpha revision", () => {
    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Lot History Record' form", () => {
      cy.get(`div[data-cy^="field-selectType"]`).click().focused()
        .arrowType("Record Document{downarrow}{enter}", { force: true });
      cy.unClick();
      cy.get("[data-cy=\"field-selectForm\"]").click().focused()
        .arrowType("Lot History Record{downarrow}{enter}", { force: true });
    });

    it("Check if revision is in alpha revision stage", () => {
      SystemRequirement("REQ-1030");
      cy.drClickRevisionsSidePanel();
      cy.recCheckRevisionStage({ stage: "Revision A" });
    });
  });

  context("Fill in record attributes and release document", () => {
    it("Enters title 'Approval Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Approval Record title" });
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.get("input[id=\"attachments-button-file\"]").attachFile("image.jpg");
      cy.listLoadingElementShouldNotExist();
    });

    it("Checkbox option 1 checked", () => {
      cy.get("[data-cy=\"Checkbox\"]").should("be.visible");
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it(`Add first Approver as ${USERS[1].name}`, () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it(`Add 2nd Approver as ${USERS[3].name}`, () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
    });

    it(`Remove first Approver as ${USERS[1].name}`, () => {
      cy.contains(`${USERS[1].name} - ${USERS[1].email}`).parent().next().arrowClick();
    });

    it("check first approvers removed and 2nd Approver exists", () => {
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("not.contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[3].name} - ${USERS[3].email}`);
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("release button click'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });

    it("Get the document Id", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        recDocId = $docIdElement.text();
      });
    });

    it("Logout the user", () => {
      cy.authLogout();
    });

    it(`Login user ${USERS[3].name} as to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Reject document", () => {
      cy.get(`.MuiListItemText-dense`).first().trigger("mouseover").wait(2000);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover").wait(2000);
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
    });

    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });

    it(`Verify reject notification`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", "REJECTED")
        .and("contain", recDocId);
    });

    it(`Open doc`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .contains(recDocId).first().arrowClick();
    });

    it("Remove 2nd Approver'", () => {
      cy.contains(`${USERS[3].name} - ${USERS[3].email}`).parent().next().arrowClick();
    });

    it("Add Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Save Record'", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Check doc WIP status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
      cy.arCheckTitleInEditableAndMatches({ name: "Approval Record title" });
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

  context("Verify email for WIP Approval Record notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
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
    it("Download zip file containing Approval Record notification", () => {
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
        fileName: `${recDocId}-A-Approval-Record-title.pdf`,
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
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new
        RegExp( `Record Document\n${recDocId}, Revision A\nAPPROVAL RECORD TITLE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`${USERS[1].name} \\- .*@.*`);
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[2].name} \\- .*@.* \\| DRAFT`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Checkbox\\n1 2 3`);
        expect(el).match(tmpRegex);

        expect(el).not.match(/TEXT FIELD/);

        expect(el).not.match(/REJECTED/);

        expect(el).match(/WIP/);

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

  context("Approve form and close it", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record button click", () => {
      cy.ebApprove();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Approval Record title" });
      cy.drGetDocIdElementFromUI().should("contain.text", "RD-").then(($docIdElement: JQuery<HTMLElement>) => {
        recDocId = $docIdElement.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmailFromHeader();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    context("Verify email for Released Approval Record notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${recDocId}`,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
          .then((emails) => {
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
      it("Download zip file containing Approval Record notification", () => {
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
          fileName: `${recDocId}-A-Approval-Record-title.pdf`,
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
        const el = pages[0];
        if (el.includes("Page 1 of 1")) {
          tmpRegex = new
          RegExp( `Record Document\n${recDocId}, Revision A\nAPPROVAL RECORD TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          tmpRegex = new RegExp(`${USERS[1].name} \\- .*@.*`);
          expect(el).not.match(tmpRegex);

          tmpRegex = new RegExp(`APPROVALS\\n${USERS[2].name} \\- .*@.* \\| APPROVED \\| ${pdfDocRelDate}`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Checkbox\\n1 2 3`);
          expect(el).match(tmpRegex);

          expect(el).not.match(/TEXT FIELD/);

          expect(el).not.match(/REJECTED/);

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

    it("Check if approved date exists", () => {
      SystemRequirement("REQ-1010");
      cy.get("[data-cy^=\"approve\"]").contains(currentDate);
    });

    context("Check for Landing page columns and values", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Check if most recent added item is fist on list", () => {
        cy.filterGetFirstValueFromList({ value: "RD-00004" });
      });

      it("Check for Landing page default columns", () => {
        SystemRequirement("REQ-2740");
        cy.filterCheckHeaderValues("ID",
          "REVISION", "STATE",
          "TITLE",
          "OWNER",
          "RELEASED DATE",
          "FORM ID");
      });
    });

    context("Test the filter inside Records landing page", () => {
      it("Enter all fields to check if all filter fields are working", () => {
        SystemRequirement("REQ-2750");
        cy.filterRecords({
          docId: "RD-00004", revision: "A", state: "Released", title: "Approval Record title", owner: USERS[2].name,
          releasedDate: "Last 7 days", formId: "FM-00003",
        });
      });

      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
      });

      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Check if all filter values persist after changing landing page", () => {
        cy.filterCheckIfRecordsFilterPersists({
          docId: "RD-00004", revision: "A", state: "Released", title: "Approval Record title", owner: USERS[2].name,
          releasedDate: "Last 7 days", formId: "FM-00003",
        });
      });

      it("Clear filter", () => {
        cy.filterClear();
      });
    });
  });
});


export { };

