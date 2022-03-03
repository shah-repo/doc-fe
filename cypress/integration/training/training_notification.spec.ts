// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");

context("Training notification test", () => {
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Training Curriculum test",
                documentTypeAcronym: "TC-",
                group: "TRAINING_CURRICULUM",
                privateNumberPool: true,
                canRedLine: false,
                isQms: true,
                needsSignature: true,
                defaultTraining: false,
                startingNumber: 1,
                hiddenForCreationForUsersWithoutTags: [],
                fieldsConfig: {
                  E: {
                    visible: false,
                    required: true,
                  },
                  G: {
                    label: "Training Required",
                    visible: false,
                  },
                  N: {
                    label: "Finalize and Release",
                    visible: false,
                  },
                },
                defaultRevStage: "Alpha",
                schema: [
                  {
                    name: "training-curriculum-details-section",
                    type: "section",
                    index: 0,
                    label: "Periodic Training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Periodic Training",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-document-to-be-trained-on",
                    type: "autocomplete",
                    index: 1,
                    label: "Documents to Train on",
                    rules: "|required",
                    multiple: true,
                    optionId: "36",
                    validators: {
                      required: true,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    placeholder: "Select documents for training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "visibility",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Documents to Train on",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-refresh-training-periodically",
                    type: "radiogroup",
                    index: 2,
                    label: "Refresh/repeat training periodically?",
                    rules: "required||",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                    ],
                    validators: {
                      required: true,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if: false,
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if_in: false,
                    },
                    rulesObject: {},
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Refresh/repeat training periodically?",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-validity",
                    type: "quantity",
                    index: 3,
                    label: "Training Frequency (in days)",
                    rules: "required_if:training-refresh-training-periodically,Yes",
                    validators: {
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      required_if: {
                        name: "training-refresh-training-periodically",
                        value: [
                          "Yes",
                        ],
                      },
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "visibility",
                    validationAttribute: "Training Frequency (in days)",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-details-section",
                    type: "section",
                    index: 4,
                    label: "Trainees Details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Trainees Details",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-select-groups-to-train",
                    type: "autocomplete",
                    index: 5,
                    label: "Groups to Train",
                    multiple: true,
                    optionId: "10",
                    placeholder: "Select groups",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Groups to Train",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-select-users-to-train",
                    type: "autocomplete",
                    index: 6,
                    label: "Users to Train (if applicable)",
                    multiple: true,
                    optionId: "13",
                    placeholder: "Select users",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Users to Train (if applicable)",
                    applicableValidationSchema: true,
                  },
                ],
                category: "Training Curriculums",
                active: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create Training Curriculum form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
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
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create a document", () => {
    it("Document with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: "Released" });
      cy.get("#HeaderInfo-docId").then((x) => { releasedFormId = x.text(); });
    });
  });

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks, CyRoutes.GetRequiredApprovers, CyRoutes.GetDocRevs], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .arrowType("Training Curriculum test{downarrow}{enter}");
      });
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

    it("Click Refresh on 'Document to trained on'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("[name=training-document-to-be-trained-on]").find("button").eq(2).arrowClick({ force: true });
      });
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowType("released form{downarrow}{enter}");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("5");
    });

    it("Trainee Details should be present", () => {
      cy.get("#training-details-section").should("have.text", "Trainees Details");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").arrowType(`${USERS[1].name}{downarrow}{enter}`);
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboard();
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

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });
  });

  context("Revise document and goes it to Approved status", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filters document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "released form", status: "Released" });
    });

    it("Clicks on revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Edit document description", () => {
      cy.drEnterDocumentDescription({ description: "Edit description" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[2].name}`]);
    });

    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
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
        email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
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
      cy.get(`[data-cy="HeaderInfo-status"]`).should("have.text", "Approved");
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[1].name} with Pending on 'Completed on' column should be present`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.get("[data-grid-row-index]").should("have.length", 1);
      cy.get(`[data-grid-row-index]`).should("contain", releasedFormId)
        .and("contain", USERS[1].name).and("contain", "Pending");
      cy.get(`[data-grid-col-index="0"]`).invoke("text").then(($el) => {
        trnId = $el;
      });
    });

    it(`Open the training link and verify 'SEND TO EMAIL' button`, () => {
      cy.get(`[data-grid-col-index="0"]`).contains(`${trnId}`).arrowClick();
      cy.get("div.MuiDialogTitle-root").contains("Training Record");
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      cy.sendToEmail();
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
        subject: `Export for document ${trnId}`,
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

    it("Download zip file containing pending training notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${trnId}${filetime}.zip`;
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
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${trnId}.pdf`,
        }).then((cdata) => {
        tmpRegex = new RegExp( "Training Record", "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp( trnId, "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[1].name}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc ID Rev\\n${releasedFormId} Rev 2`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Title\nreleased form`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`I completed training on ${releasedFormId} Rev 2\\n${USERS[1]
          .name} \\| Trainee \\| Not Completed`, "gi");
        expect(cdata.text).match(tmpRegex);

        expect(cdata.text).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(cdata.text).not.match(tmpRegex);
      });
    });
  });

  context("Check the completed training notification", () => {
    it("Goto Dashboard", () => {
      cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
    });

    it("Verify training notification", () => {
      cy.contains(`${releasedFormId}`).should("exist");
      cy.contains(`released form`).should("exist");
    });

    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.documentControl\"]").arrowClick();
      cy.get("[data-cy=\"navigation.training\"]").should("be.exist");
      cy.get("[data-cy=\"navigation.trainingRecords\"]").arrowClick();
    });

    it(`${USERS[1].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.trLandingPageCompletedOn({ completed: "Last 7 days" });
      cy.get("[data-grid-row-index]").should("have.length", 1);
      cy.get(`[data-grid-row-index]`).should("contain", releasedFormId)
        .and("contain", USERS[1].name).and("not.contain", "Pending");
      cy.get(`[data-grid-col-index="0"]`).invoke("text").then(($el) => {
        trnId = $el;
      });
    });

    it(`Open the training link and verify 'SEND TO EMAIL' button`, () => {
      cy.get(`[data-grid-col-index="0"]`).contains(`${trnId}`).arrowClick();
      cy.get("div.MuiDialogTitle-root").contains("Training Record");
      cy.get(".MuiBox-root").contains(`${releasedFormId}`);
      cy.sendToEmail();
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
        subject: `Export for document ${trnId}`,
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

    it("Download zip file containing completed training notification", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${trnId}${filetime}.zip`;
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
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${trnId}.pdf`,
        }).then((cdata) => {
        tmpRegex = new RegExp( "Training Record", "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp( trnId, "gi" );
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`${USERS[1].name}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc ID Rev\\n${releasedFormId} Rev 1`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Title\nreleased form`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`I completed training on ${releasedFormId} Rev 1\\n${USERS[1]
          .name} \\| Trainee \\| ${docRelDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        expect(cdata.text).match(/Page 1 of 1/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(cdata.text).match(tmpRegex);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(cdata.text).not.match(tmpRegex);
      });
    });
  });
});
