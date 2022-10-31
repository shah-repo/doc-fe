// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../../support/commands/imap/commands";
import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate } from "../../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { Part } from "../../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let partDocumentType;
let adminEmployee;
let group;
let createdPartDocument;
let approvalRequestDocumentType;
let initialArDocument;
let arId;
let formId;
let emailsFromInbox;
const pages = ["", "", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;

const lotsTitle = "Lots title";
const PART_DOCUMENT_TYPE_NAME = "Part";
const multipleCompanies = true;

context("Autocomplete 'Lots' test", () => {
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
              ClinicalProtocolDocType,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00005",
                documentType: {
                  id: partDocumentType[0].id,
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
              name: "Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });
  });

  context("Autocomplete 'Lots' test", () => {
    context("Create 'Lots' document", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter document title as ${lotsTitle}`, () => {
        cy.drEnterDocumentTitle({ name: lotsTitle });
      });

      it("Enter document description 'Lots document description'", () => {
        cy.drEnterDocumentDescription({ description: "Lots document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Component Specification Lot' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Component Specification Lot" });
      });

      it("Click create a document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add Text field with range", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "fb-range" });
        cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
        cy.get(`[data-cy="fb-control-form.builder.range"]`).arrowClick();
        cy.fbSelectTextFieldRangeFromValue({ value: "0" });
        cy.fbSelectTextFieldRangeToValue({ value: "10" });
        cy.unClick();
        cy.get(`[data-cy="fb-control-form.builder.critical.to.quality"]`).arrowClick();
        cy.fbAddNewFieldButton();
      });

      it("Add Radio Button group", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("X", "Y", "Z");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });

      it("Add Text Editor", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get("input[name=\"validators.required_if\"]").arrowClick();
        cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-radiobutton-group");
        cy.fbSelectCheckboxValue("X");
        cy.fbAddNewFieldButton();
      });

      it("Add Text Field", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-field" });
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get("input[name=\"validators.required_if\"]").arrowClick();
        cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-radiobutton-group");
        cy.fbSelectCheckboxValue("Y");
        cy.fbAddNewFieldButton();
      });

      it("Add a reference ", () => {
        cy.drSelectReferences("FM-00001");
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify `Lots document` status and send email", () => {
      it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.arCheckTitleInEditableAndMatches({ name: lotsTitle });
        cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
          formId = $formIdElement.text();
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
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${formId}`,
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
      it("Download zip file", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${formId}${fileTimeFormat}_draft.zip`;
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
          `${formId}-1-Lots-title.pdf`);
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
            fileName: `${formId}-1-Lots-title.pdf`,
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

      it("Verify page 1 in document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nLOTS TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/AR ID\nNone/);

          expect(el).match(/Description\nLots document description/);

          expect(el).match(/Output Document Type\nComponent Specification Lot/);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Initial Quantity/);

          expect(el).match(/Usable Quantity/);

          expect(el).match(/Expiration Date/);

          expect(el).match(/Part Selection/);

          expect(el).match(/100% Inspection Override/);

          expect(el).match(/fb-range\nAllowed Range: 0 - 10/);

          expect(el).match(/Critical to quality/);

          tmpRegex = new RegExp(`fb-radiobutton-group\n(.*)X(.*)Y(.*)Z`);
          expect(el).match(tmpRegex);

          expect(el).match(/fb-text-editor/);

          expect(el).match(/fb-text-field/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });

      it("Verify page 2 in document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nLOTS TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History/);

          expect(el).match(/AR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          expect(el).match(/Draft/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("Approve and Release form", () => {
      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Verify `Lots document` status and send email", () => {
      it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: lotsTitle });
        cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
          formId = $formIdElement.text();
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

    context("Verify Released form email notification", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${formId}`,
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
      it("Download zip file containing training form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${formId}${fileTimeFormat}_rel.zip`;
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
          `${formId}-1-Lots-title.pdf`);
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
            fileName: `${formId}-1-Lots-title.pdf`,
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

      it("Verify page 1 in document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nLOTS TITLE`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp( `AR ID\n${arId}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Description\nLots document description/);

          expect(el).match(/Output Document Type\nComponent Specification Lot/);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Initial Quantity/);

          expect(el).match(/Usable Quantity/);

          expect(el).match(/Expiration Date/);

          expect(el).match(/Part Selection/);

          expect(el).match(/100% Inspection Override/);

          expect(el).match(/fb-range\nAllowed Range: 0 - 10/);

          expect(el).match(/Critical to quality/);

          tmpRegex = new RegExp(`fb-radiobutton-group\n(.*)X(.*)Y(.*)Z`);
          expect(el).match(tmpRegex);

          expect(el).match(/fb-text-editor/);

          expect(el).match(/fb-text-field/);

          expect(el).match(/APPROVALS\nApprovers/);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });

      it("Verify page 2 in document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nLOTS TITLE`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Approval History/);

          expect(el).match(/AR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

          tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("Create 'Lots'", () => {
      it("Navigate to Lots", () => {
        cy.navigToLots();
      });

      it("Click on Create new", () => {
        cy.poClickCreatePO();
      });

      it("Select 'Component Specification Lot' from the dropdown", () => {
        cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
          cy.get("div[id^=react-select]").contains("Component Specification Lot").arrowClick();
        });
      });

      it("Add lot title", () => {
        cy.drEnterDocumentTitle({ name: lotsTitle });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter quantity received", () => {
        cy.get("[name=\"lot_quantity\"]").arrowType("12");
      });

      it("Enter Usable Quantity", () => {
        cy.get("[name=\"lot_usable_quantity\"]").arrowType("12");
      });

      it("Enter Expiration date", () => {
        cy.get("input[name^=\"lot_expiry_date\"]").parent().find("button").arrowClick({ force: true });
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Select Part", () => {
        cy.get("[data-cy=\"lot_part\"]").autocompleteSelect("Part document");
      });

      it("Check 100% override", () => {
        cy.get("[value=\"100% Inspection Override\"]").check();
      });

      it("Enter FB range", () => {
        cy.get("[name*=\"fb-range-\"]").arrowType("2");
      });

      it("select option for radio group", () => {
        cy.fbSelectRadioButtonValue({ value: "X" });
      });

      it("Fill text editor field", () => {
        cy.fbEnterTextEditor({ value: "Some text for Text editor" });
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add two approvers", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("remove one approver", () => {
        cy.pmDeleteApproverFromApproverList({ approver: `${USERS[1].name} - ${USERS[1].email}` });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.pause();
      });

      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Log out from the current user", () => {
      it("Log out", () => {
        cy.authLogout();
      });

      it("Login as Approver", () => {
        cy.authLogin({ email: USERS[2].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Reject the submission", () => {
      it("Reject Lots document from dashboard", () => {
        cy.progressBarShouldNotExist();
        cy.get("[data-cy=dashboardFeedList]>div").contains(`${USERS[1].name}needs your approval for`)
          .parent()
          .parent()
          .parent().trigger("mouseover")
          .find(`[data-cy="transition-reject"]`).first()
          .arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Log out from Approver", () => {
      it("Log out", () => {
        cy.authLogout();
      });

      it("Login as Part_lot Owner", () => {
        cy.authLogin({ email: USERS[1].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Open Lots document after rejection", () => {
      it("Navigate to Lots", () => {
        cy.navigToLots();
      });

      it("Select lot document", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify `Lots document` status and send email", () => {
      it("Verify form Draft status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: "WIP" });
        cy.arCheckTitleInEditableAndMatches({ name: lotsTitle });
        cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
          formId = $formIdElement.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify Lots document email notification", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${formId}`,
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
      it("Download zip file containing training form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${formId}${fileTimeFormat}_WIP.zip`;
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
          `${formId.replace(" #", "-")}-A-Lots-title.pdf`);
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
            fileName: `${formId.replace(" #", "-")}-A-Lots-title.pdf`,
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

      it("Verify page 1 in document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 1")) {
          tmpRegex = new RegExp( `Component Specification Lot\n${formId}, Revision A\n${lotsTitle}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Initial Quantity\n12/);

          expect(el).match(/Usable Quantity\n12/);

          tmpRegex = new RegExp(`Expiration Date\n${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Part Selection\nPRT-00005 - 1 Part document/);

          expect(el).match(/100% Inspection Override/);

          expect(el).match(/fb-range\n2\nAllowed Range: 0 - 10/);

          expect(el).match(/Critical to quality/);

          tmpRegex = new RegExp(`fb-radiobutton-group\n(.*)X(.*)Y(.*)Z`);
          expect(el).match(tmpRegex);

          expect(el).match(/fb-text-editor/);

          expect(el).not.match(/fb-text-field/);

          tmpRegex = new RegExp(`APPROVALS\n${USERS[2].name} - ${USERS[2].email} | DRAFT`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`APPROVALS\n${USERS[1].name} - ${USERS[1].email}`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 1/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields|fb-text-field`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("resubmit document for Approval", () => {
      it("Click on submit for Approval", () => {
        cy.pmSubmitForApproval();
      });
    });

    context("Log out and login as Approver", () => {
      it("Log out", () => {
        cy.authLogout();
      });

      it("Login as Approver", () => {
        cy.authLogin({ email: USERS[2].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Approve record", () => {
      it("Approve record", () => {
        cy.dashApproverFirstFromList();
      });
    });

    context("Log out and login as Part_lot Owner", () => {
      it("Log out", () => {
        cy.authLogout();
      });

      it("Login as Part_lot Owner", () => {
        cy.authLogin({ email: USERS[1].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Open lot document", () => {
      it("Navigate to Lots", () => {
        cy.navigToLots();
      });

      it("Select lot document", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify `Lots document` status and send email", () => {
      it(`Verify document ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: lotsTitle });
        cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
          formId = $formIdElement.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify document Released email notification", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${formId}`,
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
      it("Download zip file containing training form", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            downloadFile  =  `${formId}${fileTimeFormat}_rel.zip`;
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
          `${formId.replace(" #", "-")}-A-Lots-title.pdf`);
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
            fileName: `${formId.replace(" #", "-")}-A-Lots-title.pdf`,
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

      it("Verify page 1 in document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 1")) {
          tmpRegex = new RegExp( `Component Specification Lot\n${formId}, Revision A\n${lotsTitle}`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);
          expect(el).match(/image.jpg/);

          expect(el).match(/Initial Quantity\n12/);

          expect(el).match(/Usable Quantity\n12/);

          tmpRegex = new RegExp(`Expiration Date\n${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Part Selection\nPRT-00005 - 1 Part document/);

          expect(el).match(/100% Inspection Override/);

          expect(el).match(/fb-range\n2\nAllowed Range: 0 - 10/);

          expect(el).match(/Critical to quality/);

          tmpRegex = new RegExp(`fb-radiobutton-group\n(.*)X(.*)Y(.*)Z`);
          expect(el).match(tmpRegex);

          expect(el).match(/fb-text-editor/);

          expect(el).not.match(/fb-text-field/);

          tmpRegex = new RegExp(`APPROVALS\n${USERS[2].name} - ${USERS[2].email} | APPROVED | ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`APPROVALS\n${USERS[1].name} - ${USERS[1].email}`, "gi");
          expect(el).not.match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfDocRelDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 1/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields|fb-text-field`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("Add Autocomplete 'Lots'", () => {
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

        it("Select 'Clinical Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        it("Click create a document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        context("Add form fields", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
          });
        });

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label" });
          });

          it("Select 'Lots' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Lots" });
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

      context("Verify Autocomplete 'Lots'", () => {
        it("Verify autocomplete 'Lots'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroupOptions%5B%5D=CAN_CREATE_INSPECTION&status%5B%5D=DRAFT&status%5B%5D=PENDING_CHANGE&status%5B%5D=SUBMITTED&status%5B%5D=IN_REVIEW&status%5B%5D=APPROVED&status%5B%5D=RELEASED`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.length > 0 ) {
              const lots = response.body;
              lots.forEach((lot) => {
                cy.get("ul>li[role=option]")
                  .should("contain.text", `${lot.document.docId} - rev ${lot.displayRevision} - ${lot.name}`);
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

        it("Verify created 'Lots' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", lotsTitle);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
