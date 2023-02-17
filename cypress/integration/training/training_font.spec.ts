/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16, FONT_SIZE_24, FONT_WT_400, FONT_WT_500, FONT_WT_600, FONT_WT_700, LINE_HT_20_02, LINE_HT_21, LINE_HT_22_88, LINE_HT_24, LINE_HT_36, soraSansserif } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let releasedFormId;

context("Training font test", { tags: ["@timetool"] }, () => {
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
            users: [USERS[12], USERS[13], USERS[4]],
            documentTypes: [
              ClinicalProtocolDocType,
              TrainingCurriculum,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
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
        done();
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

    it("Click Refresh on 'Document to trained on'", () => {
      cy.get("[name=training-document-to-be-trained-on]").find("button").eq(2).arrowClick({ force: true });
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select First User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
    });

    it(`${USERS[11].name} with Pending on 'COMPLETED ON' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name }).wait(500);
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[11].name).and("contain", "Pending");
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
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

  context("Navigate to Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open the first document in the list", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Training Record page font", () => {
    it(`Verify 'Training Record' font-size ${FONT_SIZE_24} font-family ${soraSansserif} line-height ${LINE_HT_36} font-weight ${FONT_WT_500}`, () => {
      cy.get(`[class="MuiDialogTitle-root"]`).find(".MuiTypography-body1").contains("Training Record").should("have.css", "font-size", FONT_SIZE_24);
      cy.get(`[class="MuiDialogTitle-root"]`).find(".MuiTypography-body1").contains("Training Record").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiDialogTitle-root"]`).find(".MuiTypography-body1").contains("Training Record").should("have.css", "line-height", LINE_HT_36);
      cy.get(`[class="MuiDialogTitle-root"]`).find(".MuiTypography-body1").contains("Training Record").should("have.css", "font-weight", FONT_WT_500);
    });

    it(`Verify 'TRN ID' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(0)
        .contains("TRN ID").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(0)
        .contains("TRN ID").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(0)
        .contains("TRN ID").should("have.css", "line-height", LINE_HT_24);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(0)
        .contains("TRN ID").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'TRN-00001' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(0)
        .contains("TRN-00001").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(0)
        .contains("TRN-00001").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(0)
        .contains("TRN-00001").should("have.css", "line-height", LINE_HT_24);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(0)
        .contains("TRN-00001").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'Doc ID Rev' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(1)
        .contains("Doc ID Rev").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(1)
        .contains("Doc ID Rev").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(1)
        .contains("Doc ID Rev").should("have.css", "line-height", LINE_HT_24);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(1)
        .contains("Doc ID Rev").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'FM-00003 Rev 1' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_22_88} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2)
        .contains("FM-00003 Rev 1").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2)
        .contains("FM-00003 Rev 1").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2)
        .contains("FM-00003 Rev 1").should("have.css", "line-height", LINE_HT_22_88);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2)
        .contains("FM-00003 Rev 1").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'Title' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(2)
        .contains("Title").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(2)
        .contains("Title").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(2)
        .contains("Title").should("have.css", "line-height", LINE_HT_24);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiTypography-body1"]`).eq(2)
        .contains("Title").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'released form' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(2)
        .contains("released form").should("have.css", "font-size", FONT_SIZE_14);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(2)
        .contains("released form").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(2)
        .contains("released form").should("have.css", "line-height", LINE_HT_20_02);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(2).find(`[class*="MuiBox-root"]`).eq(2)
        .contains("released form").should("have.css", "font-weight", FONT_WT_400);
    });

    it(`Verify 'I completed training on' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_22_88} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("I completed training on").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("I completed training on").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("I completed training on").should("have.css", "line-height", LINE_HT_22_88);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("I completed training on").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'FM-00003 Rev 1' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_22_88} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("FM-00003 Rev 1").should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("FM-00003 Rev 1").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("FM-00003 Rev 1").should("have.css", "line-height", LINE_HT_22_88);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("FM-00003 Rev 1").should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify ${USERS[11].name} font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_22_88} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains(USERS[11].name).should("have.css", "font-size", FONT_SIZE_16);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains(USERS[11].name).should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains(USERS[11].name).should("have.css", "line-height", LINE_HT_22_88);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains(USERS[11].name).should("have.css", "font-weight", FONT_WT_700);
    });

    it(`Verify 'Send To Email' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("Send To Email").should("have.css", "font-size", FONT_SIZE_12);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("Send To Email").should("have.css", "font-family", soraSansserif);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("Send To Email").should("have.css", "line-height", LINE_HT_21);
      cy.get(`[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6"]`).eq(3)
        .contains("Send To Email").should("have.css", "font-weight", FONT_WT_600);
    });
  });
});
