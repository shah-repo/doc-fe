// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let asyncTasksGroup;
let downloadUrl;
let releasedFormId;
let emailsFromInbox;
let dateAfterEmailShouldArrive;
let downloadFile;
let fileId;

const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request implementation tasks", { tags: ["@timetool"] }, () => {
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
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
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
                id: componentSpecificationDocumentType[0].id,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });
  });

  context("Create new AR form with implementation task", () => {
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
      cy.drEnterDocumentDescription({ description: "New form template for approval request" });
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
    // Removed due to ENC-12907 : after requirement changes need to change
    // it("Add 'Implementation Task' to AR", () => {
    //   cy.fbClickAddNewHiddenBtn();
    //   cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
    //   cy.get("[data-cy=\"label\"]").arrowType("Implementation Task");
    //   cy.fbAddField();
    // });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0680");
      cy.navigToApprovalRequestList();
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
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Select document tab", () => {
      cy.arSelectDocumentTab();
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      SystemRequirement("REQ-0730");
      cy.arSaveApiCall();
    });

    it("Select change detail tab", () => {
      cy.arSelectChangeDetailsTab();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Click on Save", () => {
      cy.arSaveApiCall();
    });
  });

  context("Add implementation task and continue AR creation flow", () => {
    it("Select Change Details Tab", () => {
      cy.arSelectChangeDetailsTab();
      // cy.get("[data-cy=\"fb-control-btn\"]").arrowClick({ force: true });
    });
    // Removed due to ENC-12907 : after requirement changes need to change
    // it("Fill all fields and add 'Implementation Task'", () => {
    //   SystemRequirement("REQ-0710");
    //   cy.get("[data-cy=\"fb-control-btn\"]").arrowClick({ force: true });
    //   cy.get("[data-cy=\"title\"]").arrowType("Task One");
    //   cy.get("[data-cy=\"description\"]").next().arrowType("Task Description");
    //   cy.get("[data-cy=\"assigned\"]").autocompleteSelect(`${USERS[1].email}`);
    //   cy.poAddDateRequired();
    //   cy.wrapWithWaitOnApiCall(CyRoutes.PostTasks, () => {
    //     cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).arrowClick();
    //   });
    // });

    // it("Add description 'Test' to trigger autosave", () => {
    //   cy.get("[class^=\"public-DraftStyleDefault-block\"]").clear()
    //     .arrowType("CR from New form template for approval request", { force: true });
    //   cy.unClick();
    // });

    // it(`Check 'Implementation task' status is '${STATUS_TYPES_LABEL.DRAFT}'`, () => {
    //   SystemRequirement("REQ-0710");
    //   cy.arCheckImplementationTaskStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    // });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Approve AR", () => {
      SystemRequirement("REQ-0920");
      cy.arApproveAR();
      cy.landingPageLoadingElementShouldNotExist();
    });
    // Removed due to ENC-12907 : after requirement changes need to change
    // it(`Check approval request status is ${STATUS_TYPES_LABEL.IMPLEMENTATION}`, () => {
    //   SystemRequirement("REQ-0020", "REQ-0730");
    //   cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IMPLEMENTATION });
    // });
  });

  context("Verify export", () => {
    it(`Check doc status as ${STATUS_TYPES_LABEL.IMPLEMENTATION} and click on Send To Email`, () => {
      // Removed due to ENC-12907 : after requirement changes need to change
      // cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IMPLEMENTATION });
      cy.get(`[data-cy="field-name"]`).should("have.text", approvalRequestTitle);
      cy.get(`[data-cy="HeaderInfo-docId"]`).then(($x) => {
        releasedFormId = $x.text();
      });
      cy.sendToEmail();
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

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

    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_im.zip`;
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
        }).wait(2000);

      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${releasedFormId}-Approval-request-from-newly-created-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Extract texts from PDF file content for Approval request form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-Approval-request-from-newly-created-form.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).gt(0);
        // expect(cdata.text).to.have.string(STATUS_TYPES_LABEL.IMPLEMENTATION);
      });
    });
  });
  // Removed due to ENC-12907 : after requirement changes need to change
  // context("Check Implementation Task Status", () => {
  //   it(`Check Implementation task' status is ${STATUS_TYPES_LABEL.PENDING}`, () => {
  //     SystemRequirement("REQ-0710");
  //     cy.arCheckImplementationTaskStatus({ status: STATUS_TYPES_LABEL.PENDING });
  //   });

  //   it("Complete Implementation Task'", () => {
  //     SystemRequirement("REQ-0710");
  //     cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Done$", "g")).arrowClick();
  //     cy.get("[data-cy=\"description\"]").next().arrowType("Task is done");
  //     cy.wrapWithWaitOnApiCall(CyRoutes.PostTaskDone, () => {
  //       cy.get("[data-cy=\"fb-control-btn\"]").contains(new RegExp("^Add$", "g")).arrowClick();
  //     });
  //   });

  //   it(`Check 'Implementation task' status is DONE`, () => {
  //     SystemRequirement("REQ-0710");
  //     cy.arCheckImplementationTaskStatus({ status: "DONE" });
  //   });

  //   it("Navigate to AR list", () => {
  //     cy.navigToApprovalRequestList();
  //     cy.arClearFilters();
  //   });

  //   it(`Filter ${STATUS_TYPES_LABEL.APPROVED} by name and status, and select it`, () => {
  //     cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: STATUS_TYPES_LABEL.APPROVED });
  //   });

  //   it(`Check approval request status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
  //     SystemRequirement("REQ-0020", "REQ-0730");
  //     cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
  //   });
  // });

  context("Create a document with revision as Numeric", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Create a new document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title", () => {
      cy.drEnterDocumentTitle({ name: "AR express release form" });
    });

    it("Enter document description", () => {
      cy.drEnterDocumentDescription({ description: "AR form description" });
    });

    it("Select document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select document revision as Numeric", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select document revision", () => {
      cy.drClickTrainingRequired();
    });

    it("Select training required", () => {
      cy.drClickTrainingRequired();
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click on ‘Approve & Release’", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick().wait(1000);
    });

    it("Set effective date to 10 days", () => {
      const effectiveDate = momentInPST().add(10, "days");
      const month = effectiveDate.format("MMM");
      const day = effectiveDate.format("D");

      cy.get("[aria-label=\"change date\"]").find("svg").arrowClick().wait(1000);
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

    it("Select document template as 'AR form'", () => {
      cy.get(`[data-cy="field-formDocument"]`).autocompleteSelect("AR form");
    });

    it("Enter password", () => {
      cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("Approve and Release the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
  });

  context(`Verify document Approval status as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
    it("Verify document Approval status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      cy.arCheckTitleInEditableAndMatches({ name: "AR express release form" });
    });
  });

  context("Verify AR Approval status as 'Approved'", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Select first document", () => {
      cy.alClearFilters();
      cy.arSelectFirstDocument();
    });

    it(`Verify AR status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });
  });

  context("Set time travel to Day 9", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 9 days to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 9 });
    });

    it("On Next Task, SELECT_ALL", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get("tr.k-master-row").should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`).eq(0)
        .should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`)
        .eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 3 }, () => {
      cy.wait(5000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`).eq(0)
        .should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context(`Verify the document is still in Approved State`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filter list by document title", () => {
      cy.dlFilterByDocTitle({ docTitle: "AR express release form" });
    });

    it("Verify filter by document title", () => {
      cy.dlVerifyFilterByDocTitle({ docTitle: "AR express release form" });
    });

    it("Filter list by owner", () => {
      cy.dlFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify filter by owner", () => {
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify document counter on document list", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter by revision", () => {
      cy.dlVerifyFilterByRev({ revision: "1" });
    });

    it("Filter list by status", () => {
      cy.dlFilterByStatus({ status: "Approved" });
    });

    it("Verify filter by status", () => {
      cy.dlVerifyFilterByStatus({ status: "Approved" });
    });
  });

  context(`Verify the AR is still in ${STATUS_TYPES_LABEL.APPROVED} State`, () => {
    it("Navigate to AR list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter AR by title as 'AR express release form'", () => {
      cy.alFilterByTitle({ title: "AR express release form" });
    });

    it(`Filter list by OWNER as ${USERS[1].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[1].name });
    });

    it(`Filter list by STATUS as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      cy.alFilterByStatus({ status: STATUS_TYPES_LABEL.APPROVED  });
    });

    it(`Verify filter by STATUS as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      cy.alVerifyFilterByStatus({ status: STATUS_TYPES_LABEL.APPROVED  });
    });
  });

  context("", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("On Next Task, SELECT_ALL", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get("tr.k-master-row").should("have.length", 2);
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`).eq(0)
        .should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`)
        .eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 3 }, () => {
      cy.wait(5000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`).eq(0)
        .should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context(`Verify the document is in Released State`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filter list by document title", () => {
      cy.dlFilterByDocTitle({ docTitle: "AR express release form" });
    });

    it("Verify filter by document title", () => {
      cy.dlVerifyFilterByDocTitle({ docTitle: "AR express release form" });
    });

    it("Filter list by owner", () => {
      cy.dlFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify filter by owner", () => {
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify document counter on document list", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Filter list by status", () => {
      cy.dlFilterByStatus({ status: "Released" });
    });

    it("Verify filter by status", () => {
      cy.dlVerifyFilterByStatus({ status: "Released" });
    });
  });

  context(`Verify the AR is in auto ${STATUS_TYPES_LABEL.CLOSED} State`, () => {
    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter AR by title as 'AR express release form'", () => {
      cy.alFilterByTitle({ title: "AR express release form" });
    });

    it(`Filter list by OWNER as USERS[1].name`, () => {
      cy.alFilterByOwner({ owner: USERS[1].name });
    });

    it(`Filter list by STATUS as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
      cy.alFilterByStatus({ status: STATUS_TYPES_LABEL.CLOSED  });
    });

    it(`Verify filter by STATUS as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
      cy.alVerifyFilterByStatus({ status: STATUS_TYPES_LABEL.CLOSED });
    });
  });
});

export { };
