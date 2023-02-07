// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { LINE_ITEMS_STATUS_TYPES, STATUS_TYPES_LABEL, TrainingStatus } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, momentInPST, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let releasedFormId;
let trnId;
let emailsFromInbox;
let downloadUrl;
let tmpRegex;
let downloadFile;
let fileId;
let dateAfterEmailShouldArrive;
let asyncTasksGroup;

const approvalRequestName = "Releasing FM-00003, released form";
const aRID = "AR-00003";
const assignDate = momentInPST().format("l");
const dueDate = momentInPST().add(30, "days").format("l");

const adjAssignDate = momentInPST().subtract(23, "days").format("l");
const adjDueDate = momentInPST().add(30, "days").subtract(23, "days").format("l");

context("Training notification test", { tags: ["@timetool"] }, () => {
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
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[13], USERS[14]],
            documentTypes: [
              ClinicalProtocolDocType,
              TrainingCurriculum,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[12].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              menu: [
                {
                  icon: "/navigation_icons/computer.svg",
                  path: "/training",
                  type: "LINK",
                  label: "Training Records",
                },
                {
                  icon: "/navigation_icons/receipt_list.svg",
                  path: "/document_by_category/Training Curriculums",
                  type: "LINK",
                  label: "Training Curriculums",
                },
              ],
              type: "MENU",
              label: "Training",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create Training Curriculum form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document title 'test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "test training form title" });
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "test training description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum test" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create a document", () => {
    it("Document with Released status", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedFormId = x.text(); });
    });
  });

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training title 'training title'", () => {
      cy.drEnterDocumentTitle({ name: "test training title" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("5");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Trainee Details should be present", () => {
      cy.get("#training-details-section").should("have.text", "Trainees Details");
    });

    it("Select First User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Second User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[12].name}`);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Third User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[13].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.wait(10000);
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Navigate to Training Records and check separate training record for each user", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`${USERS[11].name} with Pending on 'COMPLETED ON' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name }).wait(500);
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[11].name).and("contain", "Pending");
    });

    it(`${USERS[12].name} with Pending on 'COMPLETED ON' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[12].name }).wait(500);
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[12].name).and("contain", "Pending");
    });

    it(`${USERS[13].name} with Pending on 'COMPLETED ON' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[13].name }).wait(500);
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[13].name).and("contain", "Pending");
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedFormId}Rev 1 released form` });
    });
  });

  context("Open assigned Training", () => {
    it(`Click on the Training notification`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedFormId}Rev 1 released form` });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });
  });

  context("Check for training text inside dialog box and complete training", () => {
    it("Check if 'Send To Email' button is displayed", () => {
      cy.sendToEmail();
    });

    it("Check for training complete and check training ID, Title", () => {
      cy.get("button[data-cy=\"training-complete\"]").contains("Complete training").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("form>div").should("contain.text", "TRN ID");
      cy.get("form>div>div:nth-child(1)").should("contain.text", "TRN-00001");
      cy.get("form>div>div:nth-child(1)").should("be.visible");
      cy.get("form>div").should("contain.text", "Title");
    });

    it("Check if 'I completed training on' message is displayed", () => {
      cy.get("form>div>div:nth-child(2)>div>").contains("I acknowledge I am trained on");
    });

    it("Check if 'FM-00003 Rev 1' revision is displayed", () => {
      cy.get("form>div").should("contain.text", "Doc ID Rev");
      cy.get("[role='dialog']").then(($el) => {
        const text = $el.text();
        expect(text.replace(/\u00a0/g, " ")).to.contain("FM-00003  Rev  1");
      });
    });

    it("Check if trainee name is correct", () => {
      cy.get("[role='dialog']").should("contain.text", USERS[11].name);
      cy.get("[role='dialog']").contains(USERS[11].name).should("be.visible");
    });

    it("Click on acknowladge", () => {
      cy.get("[data-cy=\"training.acknowladge.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Revise document and goes it to Approved status", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filters document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "released form", status: "Released" });
    });

    it("Clicks on revise document", () => {
      cy.drClickReviseDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Edit document description", () => {
      cy.drEnterDocumentDescription({ description: "Edit description" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[12].name}`]);
    });

    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[12].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Approve AR", () => {
      cy.arApproveARFromDashboard();
    });

    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[11].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Check pending training notification", () => {
    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedFormId}Rev 2 released form` });
    });

    it(`Click training notification and check doc with Approved status`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedFormId}Rev 2 released form` });
      cy.arVerifyStatus({ status: LINE_ITEMS_STATUS_TYPES.APPROVED });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`${USERS[11].name} with Pending on 'COMPLETED ON' column should be present`, () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.wait(5000);
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.get("[data-grid-row-index]").should("have.length", 1);
      cy.get(`[data-grid-row-index]`).should("contain", releasedFormId)
        .and("contain", USERS[11].name).and("contain", "Pending");
      cy.get(`[data-grid-col-index="0"]`).invoke("text").then(($el) => {
        trnId = $el;
      });
    });

    it(`Open the training link and verify 'SEND TO EMAIL' button`, () => {
      cy.get(`[data-grid-col-index="0"]`).contains(`${trnId}`).arrowClick();
      cy.get("div.MuiDialogTitle-root").contains("Training Record");
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      SystemRequirement("REQ-3750");
      cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it("Close training dialog", () => {
      cy.get(`button>span>svg[role="presentation"]`).last().arrowClick();
    });
  });

  context("Verify email for pending training notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${trnId}`,
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

    it("Download zip file containing pending training notification", () => {
      SystemRequirement("REQ-4860");
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${trnId}${fileTimeFormat}.zip`;
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

    it("Verify PDF file for pending training notification", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${trnId}.pdf`,
        }).then((cdata) => {
        tmpRegex = new RegExp( "Training Record", "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp( trnId, "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[11].name}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc ID Rev\\n${releasedFormId} Rev 2`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Title\nreleased form`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`I completed training on ${releasedFormId} Rev 2\\n${USERS[11]
          .name} \\| Trainee \\| Not Completed`, "gi");
        expect(cdata.text).match(tmpRegex);

        expect(cdata.text).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(cdata.text).not.match(tmpRegex);
      });
    });
  });

  context("Check the completed training notification", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.contains(`${releasedFormId}`).should("exist");
      cy.contains(`released form`).should("exist");
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`${USERS[11].name} with timestamp on 'COMPLETED ON' column should be present`, () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
      cy.trLandingPageCompletedOn({ completed: "Last 7 days" });
      cy.get("[data-grid-row-index]").should("have.length", 1);
      cy.get(`[data-grid-row-index]`).should("contain", releasedFormId)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      cy.get(`[data-grid-col-index="0"]`).invoke("text").then(($el) => {
        trnId = $el;
      });
    });

    it(`Open the training link and verify 'SEND TO EMAIL' button`, () => {
      cy.get(`[data-grid-col-index="0"]`).contains(`${trnId}`).arrowClick();
      cy.get("div.MuiDialogTitle-root").contains("Training Record");
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it("Close training dialog", () => {
      cy.get(`button>span>svg[role="presentation"]`).last().arrowClick();
    });
  });

  context("Verify email for completed training notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${trnId}`,
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

    it("Download zip file containing completed training notification", () => {
      SystemRequirement("REQ-4860");
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${trnId}${fileTimeFormat}.zip`;
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

    it("Verify PDF file for completed training notification", () => {
      SystemRequirement("REQ-4880", "REQ-4850");
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${trnId}.pdf`,
        }).then((cdata) => {
        tmpRegex = new RegExp( "Training Record", "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp( trnId, "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[11].name}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc ID Rev\\n${releasedFormId} Rev 1`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Title\nreleased form`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`I completed training on ${releasedFormId} Rev 1\\n${USERS[11]
          .name} \\| Trainee \\| ${pdfDocRelDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        expect(cdata.text).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(cdata.text).not.match(tmpRegex);
      });
    });
  });

  context("Verify email for completed training notification", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify ASSIGN DATE is Today", () => {
      cy.get(`th[aria-colindex="6"] span.k-column-title`).contains("ASSIGN DATE").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="5"]`)
        .should("have.text", `${assignDate}`);
      cy.get(`th[aria-colindex="6"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="5"]`)
        .should("have.text", `${assignDate}`);
    });

    it("Verify DUE DATE is 30 days from Now", () => {
      cy.get(`th[aria-colindex="7"] span.k-column-title`).contains("DUE DATE").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="6"]`)
        .should("have.text", `${dueDate}`);
      cy.get(`th[aria-colindex="7"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="6"]`)
        .should("have.text", `${dueDate}`);
    });
  });

  context("Navigate to approval request list and set effective date to 23 days from now", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter list by status", () => {
      cy.alFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.APPROVED });
    });

    it("Verify filter by TITLE", () => {
      cy.alVerifyFilterByTitle({ title: approvalRequestName });
    });

    it(`Verify AR ID as ${aRID}`, () => {
      cy.dlVerifyFilterByDocId({ docId: aRID });
    });

    it(`Open AR filtered request`, () => {
      cy.get("#root").contains(approvalRequestName).arrowClick();
    });

    it("Click Close button", () => {
      cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
    });

    it("Select option No", () => {
      cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
    });

    it("Advance Effective Date to 23 days from now", () => {
      const effectiveDate = momentInPST().add(23, "days");
      const month = effectiveDate.format("MMM");
      const day = effectiveDate.format("D");

      cy.get("[aria-label=\"change date\"]").arrowClick();

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
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 23 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 23 });
    });

    it("On Next Task, SELECT_ALL", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get("tr.k-master-row").should("have.length", 1);
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", SQS_TYPES.TIME_TRAVEL_COMPANY);
      cy.get(`td[data-grid-col-index="2"]`).eq(0).should("contain.text", "23 days");
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", SQS_TYPES.CLOSE_CR_BY_EFFECTIVE_DATE);
      cy.get(`td[data-grid-col-index="4"]`).eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 3 }, () => {
      cy.wait(10000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("tr.k-master-row").should("have.length", 1);
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", SQS_TYPES.TIME_TRAVEL_COMPANY);
      cy.get(`td[data-grid-col-index="2"]`).eq(0).should("contain.text", "23 days");
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", SQS_TYPES.CLOSE_CR_BY_EFFECTIVE_DATE);
      cy.get(`td[data-grid-col-index="4"]`).eq(0).should("contain.text", "COMPLETE");
    });
  });

  context("Verify ASSIGN DATE and Due Date are adjusted accordingly", () => {
    it("Navigate to Training Records", () => {
      cy.wait(60000);
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify ASSIGN DATE is adjusted by 23 days", { retries: 3 }, () => {
      cy.get(`th[aria-colindex="6"] span.k-column-title`).contains("ASSIGN DATE").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="5"]`)
        .should("have.text", `${adjAssignDate}`);
      cy.get(`th[aria-colindex="6"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="6"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="5"]`)
        .should("have.text", `${adjAssignDate}`);
    });

    it("Verify DUE DATE is adjusted by 23 days", () => {
      cy.get(`th[aria-colindex="7"] span.k-column-title`).contains("DUE DATE").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-asc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="6"]`)
        .should("have.text", `${adjDueDate}`);
      cy.get(`th[aria-colindex="7"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="7"] span.k-i-sort-desc-sm`).should("exist");
      cy.get(`[data-grid-row-index="0"]>td[data-grid-col-index="6"]`)
        .should("have.text", `${adjDueDate}`);
    });
  });

  context(`Check training notifications as ${TrainingStatus.DUE_IN_7_DAYS}`, () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.get("[status=\"DUE\"]").eq(0).should("have.text", TrainingStatus.DUE_IN_7_DAYS);
    });
  });

  context("Verify the AR in CLOSED State", () => {
    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify AR ID as ${aRID}`, () => {
      cy.dlFilterByDocId({ docId: aRID });
    });

    it("Verify first AR is: " + approvalRequestName, () => {
      cy.alVerifyFilterByTitle({ title: approvalRequestName });
    });

    it(`Verify filter by STATUS as ${LINE_ITEMS_STATUS_TYPES.CLOSED}`, () => {
      cy.alVerifyFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.CLOSED });
    });
  });
});
