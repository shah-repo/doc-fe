// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL, TrainingStatus } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, pdfDocRelDate, pdfFooterDate, trAssignedDate, trCompleteDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;
let asyncTasksGroup;

const trainingFormId = "FM-00001";
const trainingFormId2 = "FM-00003";
const asyncDelay = 80 * 1000;

context("Repeat Training with Training Curriculum", { tags: ["@timetool"] }, () => {
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
              OneTimeTrainingTest,
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

    it("[API]Login first tester", (done: any) => {
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

  context("Created document with training required", () => {
    it("Form with Released status", () => {
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
      cy.drClickTrainingRequired();
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

    it("Enter document title 'Test Form-Training Curriculum Refresh-Repeat'", () => {
      cy.drEnterDocumentTitle({ name: "Test Form-Training Curriculum Refresh-Repeat" });
    });

    it("Enter document description 'Test Refresh Repeat Print export'", () => {
      cy.drEnterDocumentDescription({ description: "Test Refresh Repeat Print export" });
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

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "Radio BTN req" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbAddNewFieldButton();
    });

    it("Add Select Field", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "Select" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if"]`).first().check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("Radio BTN req" );
      cy.get(`input[type="checkbox"][value="2"]`).last().check();
      cy.fbAddNewFieldButton();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify Refresh/Repeat Training form title report", () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy='field-name']").should("have.text", "Test Form-Training Curriculum Refresh-Repeat");
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

  context("Verify email for training released notification", () => {
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

  context("Verify PDF file downloaded", () => {
    it("Extract download link from gmail", () => {
      SystemRequirement("REQ-4860");
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

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Test-Form-Training-Curriculum-Refresh-Repeat.pdf`,
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

    it("Verify page 1 of training form", () => {
      SystemRequirement("REQ-4850", "REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new
        RegExp( `Form\n${releasedFormId}, Revision 1\nTEST FORM-TRAINING CURRICULUM REFRESH-REPEAT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nTest Refresh Repeat Print export/);

        tmpRegex = new RegExp( `Output Document Type\\nTraining Curriculum test`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/PERIODIC TRAINING/);

        expect(el).match(/Documents to Train on/);

        expect(el).match(/Refresh\/repeat training periodically\?\n Yes/);

        expect(el).match(/Training Frequency \(in days\)/);

        expect(el).match(/TRAINEES DETAILS/);

        expect(el).match(/Groups to Train/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 of training form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new
        RegExp( `Form\n${releasedFormId}, Revision 1\nTEST FORM-TRAINING CURRICULUM REFRESH-REPEAT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Users to Train \(if applicable\)/);

        tmpRegex = new RegExp(`Radio BTN req\\n 1\\s+2\\s+3`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Select/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 of training form", () => {
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new
        RegExp( `Form\n${releasedFormId}, Revision 1\nTEST FORM-TRAINING CURRICULUM REFRESH-REPEAT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfFooterDate}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.reload();
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

    it("Enter training title 'Training Curricula'", () => {
      cy.drEnterDocumentTitle({ name: "Training Curricula" });
    });

    it("Enter description 'test training curricula refresh / repeat'", () => {
      cy.drEnterDocumentDescription({ description: "test training curricula refresh / repeat" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.get("[data-cy=\"common.Numeric\"]").first().arrowClick();
      cy.get("label").contains("Numeric").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("radio button group option 3 checked", () => {
      cy.get("[data-cy=\"Radio BTN req\"]").arrowClick();
      cy.get("label").contains("3").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training options document types", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "AR Form");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("AR Form");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      SystemRequirement("REQ-4540");
      cy.get("[name=training-validity]").arrowType("40");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Groups to train 'Owner as approver'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Owner as approver");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[12].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[13].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
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
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy='field-name']").should("have.text", "Training Curricula");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
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

  context("Verify email for draft training notification", () => {
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

  context("Verify PDF file downloaded", () => {
    it("Extract download link from gmail", () => {
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

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-1-Training-Curricula.pdf`,
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

    it("Verify page 1 of draft document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new
        RegExp( `Training Curriculum test\n${releasedFormId}, Revision 1\nTRAINING CURRICULA`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\ntest training curricula refresh \/ repeat/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/PERIODIC TRAINING/);

        expect(el).match(/Documents to Train on\n1 - AR Form/);

        expect(el).match(/Refresh\/repeat training periodically\?\n Yes/);

        expect(el).match(/Training Frequency \(in days\)\n40/);

        expect(el).match(/TRAINEES DETAILS/);

        expect(el).match(/Groups to Train\nOwner as approver/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Users to Train \\(if applicable\\)\n${USERS[11].name}\n${USERS[12].name}\n${USERS[13].name}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: ${trainingFormId2}, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of draft document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new
        RegExp( `Training Curriculum test\n${releasedFormId}, Revision 1\nTRAINING CURRICULA`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Radio BTN req\\n 1\\s+2\\s+3`, "gi");
        expect(el).match(tmpRegex);

        expect(el).not.match(/Select/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[11].name} \\- (.*) \\| DRAFT`);
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: ${trainingFormId2}, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("Submit for approval", () => {
    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick();
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy='field-name']").should("have.text", "Training Curricula");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
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

  context("Verify email for Released training notification", () => {
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

  context("Verify PDF file downloaded", () => {
    it("Extract download link from gmail", () => {
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

    it("extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile({
        directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
        fileName: `${releasedFormId}-1-Training-Curricula.pdf`,
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

    it("Verify page 1 of released document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new
        RegExp( `Training Curriculum test\n${releasedFormId}, Revision 1\nTRAINING CURRICULA`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\ntest training curricula refresh \/ repeat/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/PERIODIC TRAINING/);

        expect(el).match(/Documents to Train on\n1 - AR Form/);

        expect(el).match(/Refresh\/repeat training periodically\?\n Yes/);

        expect(el).match(/Training Frequency \(in days\)\n40/);

        expect(el).match(/TRAINEES DETAILS/);

        expect(el).match(/Groups to Train\nOwner as approver/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Users to Train \\(if applicable\\)\n${USERS[11].name}\n${USERS[12].name}\n${USERS[13].name}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: ${trainingFormId2}, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of released document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new
        RegExp( `Training Curriculum test\n${releasedFormId}, Revision 1\nTRAINING CURRICULA`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Radio BTN req\\n 1\\s+2\\s+3`, "gi");
        expect(el).match(tmpRegex);

        expect(el).not.match(/Select/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`APPROVALS\\n${USERS[11].name} \\- (.*) \\| APPROVED \\| ${pdfDocRelDate}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: ${trainingFormId2}, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

  context("Verify Training Records should be created for all users and they are in Pending state", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[11].name} 'Completed on' column should be Pending`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: "AR form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: trainingFormId });
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId)
        .and("contain", USERS[11].name).and("contain", "Pending");
    });

    it(`Verigy ${USERS[12].name} 'Completed on' column should have Pending`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: "AR form" });
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.trLandingPageDocId({ docId: trainingFormId });
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId)
        .and("contain", USERS[12].name).and("contain", "Pending");
    });

    it(`Verify ${USERS[13].name} 'Completed on' column should have Pending`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: "AR form" });
      cy.trLandingPageUsername({ username: USERS[13].name });
      cy.trLandingPageDocId({ docId: trainingFormId });
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId)
        .and("contain", USERS[13].name).and("contain", "Pending");
    });
  });

  context(`Check for first user no ${TrainingStatus.OVERDUE} training notification exists`, () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: "A training is assigned to you" });
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: TrainingStatus.OVERDUE });
    });
  });

  context("Set Time Travel tool for 10 days and submit", () => {
    it("Set Time Travel tool for 10 days and submit", () => {
      cy.trSetTimeTravelInDays({ days: 10 });
      cy.wait(asyncDelay);
    });
  });

  context("Complete Training for first user and verify expire on 40 days", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Open assigned Training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
    });

    it("Click complete training button", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training expires on 40 days", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            const expireOn = new Date(response.trainingRecords[0].expireOn);
            const todayDate = new Date();
            const diff = Math.ceil((expireOn - todayDate) / (1000 * 60 * 60 * 24));
            expect(diff).to.equal(40);
          }
        });
      }).as("response");
      cy.wait(15000);
      cy.reload();
      cy.wait("@response");
    });
  });

  context(`Check first user notifications as ${TrainingStatus.COMPLETED} and no ${TrainingStatus.OVERDUE}`, () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify old notification should disappear and new notification as ${TrainingStatus.COMPLETED}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: TrainingStatus.OVERDUE  });
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: "A training is assigned to you" });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[11].name} with 'Completed on' column should have date as ${trCompleteDate}`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[11].name);
      cy.get(`[data-grid-row-index="0"]`).find(`[data-grid-col-index="7"]`).should("contain", trCompleteDate);
    });
  });

  // eslint-disable-next-line max-len
  context("Verify new Training Record with 'Completed On' column Pending for 2nd and 3rd users. A valid entry for 1st user", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    // eslint-disable-next-line max-len
    it(`Verify ${USERS[11].name} with 'Completed on' column should have date as ${trCompleteDate}`, () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[11].name }).wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Last 30 days" });
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId);
      cy.get(`[data-grid-row-index="0"]`).find(`[data-grid-col-index="7"]`).should("contain", trCompleteDate);
    });

    it(` Verify ${USERS[12].name} with'Completed on' column should have Pending item`, () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[12].name }).wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId)
        .and("contain", USERS[12].name).and("contain", "Pending");
    });

    it(`Verify ${USERS[13].name} with 'Completed on' column should have Pending item`, () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[13].name }).wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("contain", trainingFormId)
        .and("contain", USERS[13].name).and("contain", "Pending");
    });
  });

  context("Log in as second user and check for Pending training and nortification as 'assigned to you'", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[12].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify training notification as 'assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: "A training is assigned to you" });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: trAssignedDate });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[12].name} with 'Completed on' column should have Pending item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[12].name).and("contain", "Pending");
    });
  });

  context("Log in as third user and check for Pending training and notification as 'assigned to you'", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[13].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify training notification as 'assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: "A training is assigned to you" });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: trAssignedDate });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[13].name} with 'Completed on' column should have Pending item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[13].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[13].name).and("contain", "Pending");
    });
  });

  context("Log in as first user and Set time travel to Day 30", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 20 days to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 20 });
      cy.wait(asyncDelay);
    });
  });

  context(`Log in as second user and check Pending training notification as ${TrainingStatus.DUE_IN_7_DAYS}`,
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[12].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it(`Verify training notification as ${TrainingStatus.DUE_IN_7_DAYS}`, () => {
        cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.DUE_IN_7_DAYS });
      });

      it("Navigate to Training Records", () => {
        cy.navigToTrainingRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ${USERS[12].name} with 'Completed on' column should show Pending item`, () => {
        cy.trLandingPageDocRevTitle({ title: "AR Form" });
        cy.trLandingPageUsername({ username: USERS[12].name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[12].name).and("contain", "Pending");
      });
    });

  context(`Log in as third user and check Pending training and notification as ${TrainingStatus.DUE_IN_7_DAYS}`,
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[13].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it(`Verify training notification as ${TrainingStatus.DUE_IN_7_DAYS}`, () => {
        cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.DUE_IN_7_DAYS });
      });

      it("Navigate to Training Records", () => {
        cy.navigToTrainingRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ${USERS[13].name} with 'Completed on' column should have Pending item`, () => {
        cy.trLandingPageDocRevTitle({ title: "AR Form" });
        cy.trLandingPageUsername({ username: USERS[13].name });
        cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[13].name).and("contain", "Pending");
      });
    });

  context("Log in as first user and Set time travel to Day 31", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 1 day to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 1 });
      cy.wait(asyncDelay);
    });
  });

  context(`Log in as second user and check training notification is ${TrainingStatus.OVERDUE}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[12].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify training notification is ${TrainingStatus.OVERDUE}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE });
    });
  });

  context(`Log in as third user and check training notification is ${TrainingStatus.OVERDUE}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[13].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify training notification is ${TrainingStatus.OVERDUE}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE });
    });
  });

  context("Log in as first user and Set time travel to Day 40", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 9 days to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 9 });
      cy.wait(asyncDelay);
    });
  });

  context(`Complete Training for second user and verify notification as ${TrainingStatus.COMPLETED}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[12].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Open assigned Training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
    });

    it("Click complete training button", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify that the notification as ${TrainingStatus.COMPLETED}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
    });

    it("Verify that the older notification disappeared", () => {
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: "A training is assigned to you" });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`${USERS[12].name} with 'Completed on' column should have date as ${trCompleteDate} and no Pending item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[12].name);
      cy.get(`[data-grid-row-index="0"]`).find(`[data-grid-col-index="7"]`).should("contain", trCompleteDate);
    });
  });

  context("Log in as first user and Set time travel to Day 49", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 9 days to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 9 });
      cy.wait(asyncDelay);
    });
  });

  context(`Check for first user the training notifications as ${TrainingStatus.COMPLETED}`, () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify that the notification as ${TrainingStatus.COMPLETED}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[11].name} with 'Completed on' column should have a valid item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[11].name).and("not.contain", "Pending");
      cy.get("[data-grid-row-index]").should("have.length", 1);
    });
  });

  context("Log in as first user and Set time travel to Day 50", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 1 day to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 1 });
      cy.wait(asyncDelay);
    });
  });

  context(`Check for first user two training notifications - ${TrainingStatus.COMPLETED} and Pending`, () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify that the notification as ${TrainingStatus.COMPLETED} and another notification 'assigned to you'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Your training on${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: "A training is assigned to you" });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    // eslint-disable-next-line max-len
    it(`Verify ${USERS[11].name} with 'Completed on' column should have one pending item and another valid item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-grid-row-index]").should("have.length", 2);
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index]`).should("contain", USERS[11].name).and("contain", "Pending");
      cy.get("[data-grid-row-index]").should("have.length", 1);
    });
  });

  context(`Log in as third user and check notification as ${TrainingStatus.OVERDUE}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[13].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify training notification as ${TrainingStatus.OVERDUE}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE });
    });
  });

  context("Log in as first user and Set time travel to Day 79", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 29 days to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 29 });
      cy.wait(asyncDelay);
    });
  });

  context(`Check training for second user notifications as ${TrainingStatus.COMPLETED}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[12].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification as ${TrainingStatus.COMPLETED}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`${USERS[12].name} 'Completed on' column should have a valid item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[12].name).and("not.contain", "Pending");
      cy.get(`[data-grid-row-index="0"]`).should("have.length", 1);
    });
  });

  context("Log in as first user and Set time travel to Day 80", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 1 day to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 1 });
      cy.wait(asyncDelay);
    });
  });

  context(`Check first user has two notifications- ${TrainingStatus.DUE_IN_7_DAYS}, ${TrainingStatus.COMPLETED}`,
    () => {
      it("Goto Dashboard", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Verify two training notifications - ${TrainingStatus.DUE_IN_7_DAYS} and ${TrainingStatus.COMPLETED}`, () => {
        cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.DUE_IN_7_DAYS });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
      });

      it("Navigate to Training Records", () => {
        cy.navigToTrainingRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ${USERS[11].name} with 'Completed on' column should have one pending and another valid item`, () => {
        cy.trLandingPageDocRevTitle({ title: "AR Form" });
        cy.trLandingPageUsername({ username: USERS[11].name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-grid-row-index]").should("have.length", 2);
        cy.wait(5000);
        cy.trLandingPageCompletedOn({ completed: "Pending" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[data-grid-row-index]`).should("contain", USERS[11].name).and("contain", "Pending");
        cy.get("[data-grid-row-index]").should("have.length", 1);
      });
    });

  context(`Check second user has two training notifications - ${TrainingStatus.COMPLETED} and 'assigned to you'`,
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[12].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Goto Dashboard", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Verify that the notification as ${TrainingStatus.COMPLETED}`, () => {
        cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.COMPLETED });
        cy.dashVerifyListItemExistsOnDashboard({ listItem: "A training is assigned to you" });
      });

      it("Navigate to Training Records", () => {
        cy.navigToTrainingRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ${USERS[12].name} with 'Completed on' column should have one pending and another valid item`, () => {
        cy.trLandingPageDocRevTitle({ title: "AR Form" });
        cy.trLandingPageUsername({ username: USERS[12].name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-grid-row-index]").should("have.length", 2);
        cy.wait(5000);
        cy.trLandingPageCompletedOn({ completed: "Pending" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[data-grid-row-index]`).should("contain", USERS[12].name).and("contain", "Pending");
        cy.get("[data-grid-row-index]").should("have.length", 1);
      });
    });

  context(`Log in as third user and check training notification as ${TrainingStatus.OVERDUE}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[13].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify training notification as ${TrainingStatus.OVERDUE}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE  });
    });
  });

  context("Log in as first user and Set time travel to Day 81 finally", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Select 1 day to time travel and submit", () => {
      cy.trSetTimeTravelInDays({ days: 1 });
      cy.wait(asyncDelay);
    });
  });

  context(`Log in as first user and check training notification as ${TrainingStatus.OVERDUE}`, () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification as ${TrainingStatus.OVERDUE}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE  });
    });
  });

  context(`Log in as third user and verify notification as ${TrainingStatus.OVERDUE}`, () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[13].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Verify that ${TrainingStatus.OVERDUE} notification appeared in dashboard`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${trainingFormId}Rev 1 AR Form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: TrainingStatus.OVERDUE  });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify ${USERS[13].name} with 'Completed on' column should have Pending item`, () => {
      cy.trLandingPageDocRevTitle({ title: "AR Form" });
      cy.trLandingPageUsername({ username: USERS[13].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[13].name).and("contain", "Pending");
    });
  });
});

export { };
