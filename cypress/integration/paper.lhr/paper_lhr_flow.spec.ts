// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, fileTimeFormat, lotIdRef, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let company;
let loginResponse;
let adminEmployeeLoginResponse;
let secondEmployee;
let adminEmployee;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let materialsDocumentType;
let materialsDocument;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let developersGroup;
let equipmentDocumentType;
let equipmentDocument;
let imageFile;


const paperlhrTitle = "Paper LHR form";
const txtFieldTitle1 = "fb-textfield";
const txtFieldTitle2 = "fb-textfield-1";
const fileUploadFieldTitle = "fb-fileupload";
const currentDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
const arID = "AR-00003";
const partDocumentTitle = "Material one";

context("Document Approval Matrix Revise", () => {
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                ...MPITestProcedureDeletable,
                documentTypeAcronym: "MPI-",
              },
              QPITest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = company.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(company, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(company, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(company, "Parts");
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: partDocumentTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create 'Paper LHR' form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: paperlhrTitle });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Navigate to document list and check data on landing page", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByType({ type: "FM" });
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Draft" });
    });

    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify predefined fields are displayed", () => {
    it("Check 'Part to be Manufactured' is not displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Check 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
      cy.get("[data-cy=\"Build Type\"]").parent().parent().parent().parent()
        .should("contain.html", `role="radiogroup"`);
      cy.get("[name=\"lhr-build-type\"]").eq(0).should("have.value", "R&D");
      cy.get("[name=\"lhr-build-type\"]").eq(1).should("have.value", "Production");
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Add TextField with validation", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle1 });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add another one TextField without validation", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle2 });
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
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
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
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

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`Verify paper LHR form in ${STATUS_TYPES_LABEL.DRAFT} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
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

  context.skip("Verify email form notification", () => {
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

  context.skip("Verify that zip file containing pdf downloaded", () => {
    it("Download zip file containing Approval request form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_draft.zip`;
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
        `${releasedFormId}-1-Paper-LHR-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context.skip("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Paper-LHR-form.pdf`,
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

    it("Verify page 1 for paper LHR form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nPaper LHR form description/);

        expect(el).match(/Output Document Type\nPaper Lot History Record/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\nEnd Quantity/);

        expect(el).match(/fb-textfield\nfb-textfield-1\nfb-fileupload/);

        expect(el).match(/Checkbox/);

        expect(el).match(/1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for paper LHR form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for paper LHR form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context.skip("Verify all data and predefined fields are present", () => {
    it("Verify 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Approve and release form", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Navigate to document list and check data on landing page", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
    });

    it("Filter draft 'Paper LHR' document", () => {
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByType({ type: "FM" });
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Released" });
      cy.dlVerifyFilterByArId({ arId: arID });
      cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
    });

    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context(`Verify paper LHR form in ${STATUS_TYPES_LABEL.RELEASED} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
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

  context.skip("Verify email form notification", () => {
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

  context.skip("Verify that zip file containing pdf downloaded", () => {
    it("Download zip file containing Approval request form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_rel.zip`;
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
        `${releasedFormId}-1-Paper-LHR-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context.skip("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Paper-LHR-form.pdf`,
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

    it("Verify page 1 for paper LHR form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arID}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPaper LHR form description/);

        expect(el).match(/Output Document Type\nPaper Lot History Record/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\nEnd Quantity/);

        expect(el).match(/fb-textfield\nfb-textfield-1\nfb-fileupload/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for paper LHR form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for paper LHR form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arID}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Click to revise Verify all data and predefined fields are present", () => {
    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Part to be Manufactured is a required field.");
    });

    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Build Type is a required field.");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The Initial Quantity is a required field.");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist")
        .parent().parent().parent().parent().next()
        .should("have.text", "The End Quantity is a required field.");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context(`Remove ${fileUploadFieldTitle} and approve and release form`, () => {
    it(`Remove ${fileUploadFieldTitle}`, () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(-4).arrowClick({ force: true });
    });

    it("Save it", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify File Upload is not diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("not.exist");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
    });
  });

  context(`Revise form and Add upload and approve and release form`, () => {
    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Save it", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it(`Verify that FM status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
    });
  });

  context("Create LHR document form the FM", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filters document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "Paper LHR form", status: "Released" });
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select ${partDocumentTitle} for Part to be Manufactured`, () => {
      cy.get("[name=\"lhr-selected-part\"]").arrowClick();
      cy.get("[name=\"lhr-selected-part\"]").autocompleteSelect(`${partDocumentTitle}{downarrow}{enter}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload attachment and check for autosave", () => {
      cy.fixture("test.docx").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).attachFile({
            fileContent: fileContent.toString(),
            fileName: "image.jpg",
            mimeType: "*",
            filePath: `fixtures/image.jpg`,
          });
        });
      });
      cy.unClick();
    });

    it("Enter Intial Quantity field value", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter End Quantity field value", () => {
      cy.get("[name=\"lhr-end-quantity\"]").arrowType("20");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'R&D' build type", () => {
      cy.get("[name=\"lhr-build-type\"]").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`[type="checkbox"][value="1"]`).last().check();
    });

    it("Enter text in fb-textfield", () => {
      cy.get(`[name^="fb-textfield"]`).first().arrowType("LHR textfield");
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`Verify paper LHR document is in ${STATUS_TYPES_LABEL.WIP} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.WIP} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
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

  context("Verify email notification for LHR", () => {
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
    it("Download zip file containing Approval request form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_WIP.zip`;
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
        `${releasedFormId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A.pdf`,
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

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nMT-00004, REV 1, MATERIAL ONE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured\nMT-00004 - 1 Material one/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );

        expect(el).match(/Initial Quantity\n10/);

        expect(el).match(/End Quantity\n20/);

        expect(el).match(/fb-textfield\nLHR textfield/);

        expect(el).match(/fb-textfield-1\nNone/);

        expect(el).not.match(/TEXT FIELD/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/fb-fileupload/);

        tmpRegex = new RegExp( `\\((.*)\\) fb-fileupload`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        tmpRegex  = (el).match(/\((.*)\)\sfb-fileupload/);
        imageFile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""), tmpRegex[1], "image.jpg");

        expect(el).match(/image.jpg/);

        expect(el).match(/APPROVALS\nNone/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);
      }
    });

    it(`Verify uploaded file exists in downloaded directory`, () => {
      cy.readFile(imageFile).its("length").should("be.gt", 0);
    });
  });

  context("Release LHR", () => {

    it("Checkbox option 3 checked only", () => {
      cy.get(`[type="checkbox"][value="1"]`).last().uncheck();
      cy.get(`[type="checkbox"][value="2"]`).last().uncheck();
      cy.get(`[type="checkbox"][value="3"]`).last().check();
    });

    it("Enter text in TEXT FIELD", () => {
      cy.get(`[name^="text-field"]`).first().arrowType("TEXT FIELD");
    });

    it("Enter text in fb-textfield", () => {
      cy.get(`[name^="fb-textfield"]`).first().arrowType("LHR textfield");
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });
  });

  context(`Verify paper LHR document is in ${STATUS_TYPES_LABEL.RELEASED} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
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

  context("Verify email notification for LHR", () => {
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
    it("Download zip file containing Approval request form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_rel.zip`;
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
        `${releasedFormId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A.pdf`,
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

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nMT-00004, REV 1, MATERIAL ONE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured\nMT-00004 - 1 Material one/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );

        expect(el).match(/Initial Quantity\n10/);

        expect(el).match(/End Quantity\n20/);

        expect(el).match(/fb-textfield\nLHR textfield/);

        expect(el).match(/fb-textfield-1\nNone/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/TEXT FIELD\nTEXT FIELD/);

        expect(el).match(/fb-fileupload/);

        tmpRegex = new RegExp( `\\((.*)\\) fb-fileupload`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        tmpRegex  = (el).match(/\((.*)\)\sfb-fileupload/);
        imageFile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""), tmpRegex[1], "image.jpg");

        expect(el).match(/image.jpg/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 for paper LHR", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nMT-00004, REV 1, MATERIAL ONE`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| APPROVED \\| ${pdfDocRelDate}.*`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });

    it(`Verify uploaded file exists in downloaded directory`, () => {
      cy.readFile(imageFile).its("length").should("be.gt", 0);
    });
  });

  context(`Void LHR and verify document status as VOIDED and Send to Email`, () => {
    it(`Click 'Void' and 'Yes, Im sure'`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"void-button\"]").arrowClick();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").contains("Yes, I'm sure").arrowClick();
    });

    it(`Check doc status as ${STATUS_TYPES_LABEL.VOIDED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.VOIDED });
      cy.arCheckTitleInEditableAndMatches({ name: "Void" });
    });

    it("Check if 'Send To Email' button exists", () => {
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email notification for LHR", () => {
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
    it("Download zip file containing Approval request form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_rel.zip`;
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
        `${releasedFormId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A.pdf`,
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

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nMT-00004, REV 1, MATERIAL ONE`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured\nMT-00004 - 1 Material one/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );

        expect(el).match(/Initial Quantity\n10/);

        expect(el).match(/End Quantity\n20/);

        expect(el).match(/fb-textfield\nLHR textfield/);

        expect(el).match(/fb-textfield-1\nNone/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        tmpRegex = new RegExp( `\\((.*)\\) fb-fileupload`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        tmpRegex  = (el).match(/\((.*)\)\sfb-fileupload/);
        imageFile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""), tmpRegex[1], "image.jpg");

        expect(el).match(/image.jpg/);

        expect(el).match(/APPROVALS\nNone/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);
      }
    });

    it(`Verify uploaded file exists in downloaded directory`, () => {
      cy.readFile(imageFile).its("length").should("be.gt", 0);
    });
  });
});

export { };

