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
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let supplierDocumentType;
let adminEmployee;
let secondEmployee;
let thirdEmployee;
let group;
let supplierDocument;
let dateOfApproval1;
let dateOfApproval1MinuteAfter;
let dateOfApproval2;
let dateOfApproval2MinuteAfter;
let dateOfApproval3;
let dateOfApproval3MinuteAfter;

let supFormId;
let supDocId;
let arId;
const multipleCompanies = true;
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
const CheckForSome = (bits) => (string) => bits.some((bit) => string.includes(bit));

context("Create company via API and create Suppliers document", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });


  it("[API] Creates company", (done: any) => {
    SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
    cy.authApiLogin({
      email: CONFIG.SUPERADMIN_EMAIL,
      password: CONFIG.SUPERADMIN_PASSWORD,
    }).then((response: any) => {
      loginResponse = response;

      cy.cmpCreateCompany({
        specFilePath: __filename,
        payload: {
          companyAdminEmail: USERS[11].email,
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: IMPORTER_USER.email,
          numOfRevStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [USERS[12], USERS[13], USERS[14]],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response: any) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
        secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[12].email);
        thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[13].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        done();
      });
    });
  });

  it("[API] Login admin tester", (done: any) => {
    cy.authApiLogin({
      email: USERS[11].email,
      password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    }).then((response) => {
      loginResponse = response;
      done();
    });
  });

  it("[API]Creates supplier document", (done: any) => {
    cy.grpGetGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: adminEmployee.id,
      groupName: "Everyone",
    }).then((response) => {
      group = response;
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Supplier Document</p>",
          document: {
            docId: "SUP-00004",
            documentType: {
              id: supplierDocumentType[0].id,
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
          name: "API supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });

  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
  });

  context("Create supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Supplier' document type", () => {
      SystemRequirement("REQ-2400");
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Verify approval field is added as result of predefined schema", () => {
      SystemRequirement("REQ-2400");
      cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
      cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
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

    it(`Add 'Text Field' labelled as 'TEXT FIELD'`, () => {
      cy.fbClickAddNewHiddenBtn();
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it(`Check form status as ${STATUS_TYPES_LABEL.DRAFT} and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "New Supplier Form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        supFormId = $docIdElement.text();
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

  context("Verify email for Supplier form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${supFormId}`,
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
          sentToUser: USERS[11].email,
          contains: [`Hello <b>${USERS[11].name},</b>`,
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
      SystemRequirement("REQ-4860");
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${supFormId}${filetime}_draft.zip`;
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
        `${supFormId}-1-New-Supplier-Form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for Supplier form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${supFormId}-1-New-Supplier-Form.pdf`,
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

    it("Verify page 1 of Supplier form", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new RegExp( `Form\n${supFormId}, Revision 1\nNEW SUPPLIER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nNew Supplier Form description/);

        expect(el).match(/Output Document Type\nSuppliers/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of Supplier form", () => {
      SystemRequirement("REQ-4870");
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new RegExp( `Form\n${supFormId}, Revision 1\nNEW SUPPLIER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("Release supplier form and verify status as Released", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it(`Check form status as ${STATUS_TYPES_LABEL.RELEASED} and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "New Supplier Form" });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        supFormId = $docIdElement.text();
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
    });
  });

  context("Verify email for Supplier form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${supFormId}`,
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
          sentToUser: USERS[11].email,
          contains: [`Hello <b>${USERS[11].name},</b>`,
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
    it("Download zip file containing Supplier form", () => {
      SystemRequirement("REQ-4860");
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${supFormId}${filetime}_rel.zip`;
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
        `${supFormId}-1-New-Supplier-Form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for Supplier form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${supFormId}-1-New-Supplier-Form.pdf`,
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

    it("Verify page 1 for Supplier form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new RegExp( `Form\n${supFormId}, Revision 1\nNEW SUPPLIER FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nNew Supplier Form description/);

        expect(el).match(/Output Document Type\nSuppliers/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 for Supplier form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new RegExp( `Form\n${supFormId}, Revision 1\nNEW SUPPLIER FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("Create supplier document", () => {
    it("Navigate to supplier list", () => {
      SystemRequirement("REQ-2230");
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      SystemRequirement("REQ-2330");
      cy.supCreateNew();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Enter 'Supplier Address/Phone'", () => {
      SystemRequirement("REQ-2360");
      cy.drEnterDocumentDescription({ description: "Test Supplier address" });
    });

    it("Enter 'Supplier Name'", () => {
      SystemRequirement("REQ-2360");
      cy.supEnterSuppName({ name: "Test Supplier" });
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });

    it("Add approver to approvers list", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].email });
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[12].email });
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[13].email });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.wait(2000);
      cy.url().then((url: any) => {
        supplierDocument = url;
      });
    });

    context(`Approve supplier with approval block for user ${USERS[12].name}`, () => {
      it(`Logout ${USERS[11].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[12].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
      });

      it("Navigate to Supplier", () => {
        SystemRequirement("REQ-4800");
        cy.visit(supplierDocument);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        SystemRequirement("REQ-4800");
        cy.ebApproveWithoutApi();
        dateOfApproval2 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval2MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute")
          .format("MMMM D, YYYY hh:mm A");
      });
    });

    context(`Approve supplier with approval block for user ${USERS[13].name}`, () => {
      it(`Logout ${USERS[12].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[13].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[13], employeeId: thirdEmployee.id });
      });

      it("Navigate to Supplier", () => {
        SystemRequirement("REQ-4800");
        cy.visit(supplierDocument);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        SystemRequirement("REQ-4800");
        cy.ebApproveWithoutApi();
        dateOfApproval3 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval3MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute")
          .format("MMMM D, YYYY hh:mm A");
      });
    });

    context(`Approve supplier with approval block for user ${USERS[11].name}`, () => {
      it(`Logout ${USERS[13].name}`, () => {
        cy.authLogout();
      });

      it(`Login ${USERS[11].name}`, () => {
        cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
      });

      it("Navigate to Supplier", () => {
        cy.visit(supplierDocument);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve supplier document", () => {
        cy.ebApproveWithoutApi();
        dateOfApproval1 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfApproval1MinuteAfter = moment().tz("America/Los_Angeles").add(1, "minute")
          .format("MMMM D, YYYY hh:mm A");
      });
    });

    context("Verify approval data", () => {
      it(`Verify approval data for ${USERS[11].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[11].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[11].name,);
          expect(elementText).to.include(USERS[11].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval1, dateOfApproval1MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });

      it(`Verify approval data for ${USERS[12].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[12].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[12].name,);
          expect(elementText).to.include(USERS[12].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval2, dateOfApproval2MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });

      it(`Verify approval data for ${USERS[13].name}`, () => {
        cy.get(`[data-cy="approved-${USERS[13].name}"]`).then(($el) => {
          const elementText = $el.text();
          expect(elementText).to.include(USERS[13].name,);
          expect(elementText).to.include(USERS[13].email);
          expect(elementText).to.include("APPROVED");
          const containsSome = CheckForSome([dateOfApproval3, dateOfApproval3MinuteAfter]);
          expect(elementText).to.satisfy(containsSome);
        });
      });
    });
  });

  context("Verify supplier is created", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Filter supplier Title/Name", () => {
      cy.filterSupplierTitle({ name: "Test" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for filtered values", () => {
      SystemRequirement("REQ-2320");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-2310");
      cy.filterClear();
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
    });

    it("Click on existing supplier file from list", () => {
      SystemRequirement("REQ-2340");
      cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00001" });
    });
  });

  context("Create another supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form 2" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description 2" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Verify there is two forms to create supplier", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click on create supplier to prompt option of which supplier form we should use", () => {
      SystemRequirement("REQ-2350");
      cy.supCreateNew();
    });

    it("Check if forms are suggested on creating new supplier", () => {
      SystemRequirement("REQ-2350");
      cy.supCheckForSuggestedForms("New Supplier Form", "New Supplier Form 2");
    });
  });

  context("Verify life cycle of supplier document", () => {
    it("Navigate to created supplier", () => {
      cy.unClick();
      cy.get("[data-cy=\"suggestFormCancelBtn\"]").arrowClick();
      cy.dlFilterByDocId({ docId: "SUP-00001" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    context("Verify next revision update of supplier document", () => {
      it("Press button update record", () => {
        cy.drClickReviseDocument();
      });

      it("Update supplier address", () => {
        cy.drEnterDocumentDescription({ description: "Updated Supplier address" });
      });

      it("Leave Update for Type of Change and save", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].email });
      });

      it("Click 'Save' button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("exist");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.wait(2000);
      });

      it("Approve supplier document", () => {
        cy.ebApproveWithoutApi();
      });

      it("Verify revision after update is equal to 2", () => {
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
      });
    });

    context("Verify correction revision update of supplier document", () => {
      it("Press button update record", () => {
        cy.drClickReviseDocument();
      });

      it("Update supplier address", () => {
        cy.drEnterDocumentDescription({ description: "Updated for second time, Supplier address" });
      });

      it("Select correction upgrade type 2.1", () => {
        cy.drChooseTypeOfRevisionChangeOption({ option: "Correction" });
      });

      it("Leave Update for Type of Change and save", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Add approver", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[13].email });
      });

      it("Click 'Save' button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.wait(2000);
      });

      it("Get the pending approval document Id", () => {
        cy.arVerifyStatus({ status: "PENDING APPROVAL" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          supDocId = $docIdElement.text();
        });
      });

      it("Log out from current user", () => {
        cy.authLogout();
      });

      it(`Logs user in as ${USERS[13].name}`, () => {
        cy.authLogin({
          email: USERS[13].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Rejecting request gives prompt", () => {
        cy.get(`.MuiListItemText-root.MuiListItemText-dense`).trigger("mouseover").wait(1000);
        cy.get(`[data-cy="transition-reject"]`).trigger("mouseover").wait(1000);
        cy.get(`[data-cy="transition-reject"]`).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Log out from current user", () => {
        cy.authLogout();
      });

      it(`Logs user in as ${USERS[11].name}`, () => {
        cy.authLogin({
          email: USERS[11].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Switch to myfeed tab", () => {
        cy.dashOpenMyFeedTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Verify reject notification`, () => {
        cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
          .should("contain", "REJECTED")
          .and("contain", supDocId);
      });

      it(`Open doc`, () => {
        cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
          .contains(supDocId).first().arrowClick();
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldAppear();
      });

      it("turnoff autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Add first approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].email });
      });

      it("Add second approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[12].email });
      });

      it("Remove second Approver'", () => {
        cy.contains(`${USERS[12].email}`).parent().next().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Remove Approver who rejected request", () => {
        cy.contains(`${USERS[13].email}`).parent().next().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.DRAFT} and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.arCheckTitleInEditableAndMatches({ name: "Test Supplier" });
        cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
          supDocId = $docIdElement.text();
        });
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });


      context("Verify email for Supplier document notification", () => {
        it("Get emails", () => {
          const getEmailSetting =  {
            to: CONFIG.TEST_EMAIL,
            after: dateAfterEmailShouldArrive,
            subject: `Export for document ${supDocId}`,
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
              sentToUser: USERS[11].email,
              contains: [`Hello <b>${USERS[11].name},</b>`,
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
        it("Download zip file containing Supplier form", () => {
          SystemRequirement("REQ-4860");
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles")
                .format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${supDocId}${filetime}_draft.zip`;
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

        it("unzip and extract pdf from zip file", () => {
          cy.unzipFile(
            {
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });

          const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
            `${supDocId}-2-1-Test-Supplier.pdf`);
          cy.readFile(pdffile).its("length").should("be.gt", 500);
        });

        it("Verify attached image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content for Supplier document", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${supDocId}-2-1-Test-Supplier.pdf`,
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

        it("Verify page 1 for Supplier document", () => {
          const el = pages[0];
          if (el.includes("Page 1 of 1")) {
            tmpRegex = new RegExp( `Suppliers\n${supDocId}, Revision 2.1\nTEST SUPPLIER`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Supplier Address\/Phone\nUpdated for second time, Supplier address/);

            expect(el).match(/Attachments/);

            expect(el).match(/image.jpg/);

            // eslint-disable-next-line max-len
            tmpRegex = new RegExp(`APPROVALS\\n${USERS[11].name} -.*@.*| DRAFT`);
            expect(el).match(tmpRegex);

            expect(el).match(/Checkbox\n1 2 3/);

            tmpRegex = new RegExp(`${USERS[12].name}`);
            expect(el).not.match(tmpRegex);

            expect(el).not.match(/REJECTED/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 1/);
          }
        });
      });

      context("Approve supplier and release document", () => {
        it("Submit for approval", () => {
          cy.pmSubmitForApprovalWithoutAPI();
          cy.wait(2000);
        });

        it("Approve supplier document", () => {
          cy.ebApproveWithoutApi();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify revision after update is equal to 2", () => {
          cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2.1", status: STATUS_TYPES_LABEL.RELEASED });
        });

        it(`Check doc status as ${STATUS_TYPES_LABEL.RELEASED} and click on Send To Email`, () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
          cy.arCheckTitleInEditableAndMatches({ name: "Test Supplier" });
          cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
            supDocId = $docIdElement.text();
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

      context("Verify email for Supplier document notification", () => {
        it("Get emails", () => {
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          const getEmailSetting =  {
            to: CONFIG.TEST_EMAIL,
            after: dateAfterEmailShouldArrive,
            subject: `Export for document ${supDocId}`,
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
              sentToUser: USERS[11].email,
              contains: [`Hello <b>${USERS[11].name},</b>`,
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
        it("Download zip file containing Supplier form", () => {
          SystemRequirement("REQ-4860");
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${supDocId}${filetime}_rel.zip`;
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

        it("unzip and extract pdf from zip file", () => {
          cy.unzipFile(
            {
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });

          const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
            `${supDocId}-2-1-Test-Supplier.pdf`);
          cy.readFile(pdffile).its("length").should("be.gt", 500);
        });

        it("Verify attached image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content for Supplier document", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${supDocId}-2-1-Test-Supplier.pdf`,
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

        it("Verify page 1 for Supplier document", () => {
          const el = pages[0];
          if (el.includes("Page 1 of 1")) {
            tmpRegex = new RegExp( `Suppliers\n${supDocId}, Revision 2.1\nTEST SUPPLIER`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Supplier Address\/Phone\nUpdated for second time, Supplier address/);

            expect(el).match(/Attachments/);

            expect(el).match(/image.jpg/);

            // eslint-disable-next-line max-len
            tmpRegex = new RegExp(`APPROVALS\\n${USERS[11].name} \\- (.*) \\| APPROVED \\| ${docRelDate}`);
            expect(el).match(tmpRegex);

            expect(el).match(/Checkbox\n1 2 3/);

            tmpRegex = new RegExp(`${USERS[12].name}`);
            expect(el).not.match(tmpRegex);

            expect(el).not.match(/REJECTED/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${docRelDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 1/);
          }
        });
      });
    });
  });
});

export { };

