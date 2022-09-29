// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
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
let releasedDocId;
let asyncTasksGroup;

context("Training notifications for documents with approved and released revision", { tags: ["@timetool"] }, () => {
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
              ClinicalProtocolDocType,
              TrainingCurriculum,
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
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedDocId = x.text(); });
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
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("Training Curriculum test");
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

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click Refresh on 'Document to trained on'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get("[name=training-document-to-be-trained-on]").find("button").eq(2).arrowClick({ force: true });
      });
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released form");
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("30");
    });

    it("Trainee Details should be present", () => {
      cy.get("#training-details-section").should("have.text", "Trainees Details");
    });

    it("Select Users to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[2].name}`);
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListNw({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Verify Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.trainingRecords\"]").arrowClick();
    });

    it(`Training record for ${USERS[1].name} should be present`, () => {
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageDocId({ docId: releasedDocId });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });
  });

  context("Check training notifications", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDocId}Rev 1 released form` });
    });
  });

  context("Open assigned Training", () => {
    it("Click on the Training notification", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 1 released form` });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });

    it(`complete training for ${USERS[1].name}`, () => {
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
      cy.wait(2000);
      cy.arApproveARFromDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Check new training notification for ${USERS[2].name}`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it("Verify training notification", () => {
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDocId}Rev 2 released form` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDocId}Rev 1 released form` });
    });

    it(`Click training notification and check doc with ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
      SystemRequirement("REQ-4810");
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 2 released form` });
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Click training notification and check doc with ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      SystemRequirement("REQ-4810");
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 1 released form` });
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });
  });

  context(`Check new training notification for ${USERS[1].name}`, () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDocId}Rev 2 released form` });
    });

    it(`Click training notification and check doc with ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 2 released form` });
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context(`Login with ${USERS[2].name} and complete Rev 1 released form training`, () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Click on the Training notification", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 1 released form` });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });

    it(`complete training for ${USERS[2].name}`, () => {
      cy.trCompleteTraining();
    });
  });

  context("Check training records", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it("4 records should be created", () => {
      cy.get("tbody>tr").should("have.length", 4);
    });

    it(`Training record for ${USERS[1].name} Rev1`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "1" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").subtract(1, "days").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
      cy.get("tbody>tr").should("have.length", 1);
    });

    it(`Training record for ${USERS[1].name} Rev2`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "2" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("not.contain", completedDate);
      cy.get("tbody>tr").should("have.length", 1);
    });

    it(`Training record for ${USERS[2].name} Rev1`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "1" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[2].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
      cy.get("tbody>tr").should("have.length", 1);
    });

    it(`Training record for ${USERS[2].name} Rev2`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "2" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[2].name).and("contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("not.contain", completedDate);
      cy.get("tbody>tr").should("have.length", 1);
    });
  });

  context("Use time tool to travel by 29 days", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 29 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check new training records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it("5 records should be created", () => {
      cy.trClearFilters();
      cy.listLoadingElementShouldNotExist();
      cy.get("tbody>tr").should("have.length", 5);
    });

    it(`Training record for ${USERS[1].name} Rev1`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "1" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.contains("COMPLETED ON").arrowClick().wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").subtract(30, "days").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
      cy.get("tbody>tr").should("have.length", 2);

      cy.get(`[data-grid-row-index="1"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("contain", "Pending");
    });

    it(`Training record for ${USERS[1].name} Rev2`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "2" });
      cy.trLandingPageUsername({ username: USERS[1].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });

    it(`Training record for ${USERS[2].name} Rev1`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "1" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[2].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").subtract(29, "days").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
      cy.get("tbody>tr").should("have.length", 1);
    });

    it(`Training record for ${USERS[2].name} Rev2`, () => {
      cy.trClearFilters();
      cy.trLandingPageOwner({ owner: "2" });
      cy.trLandingPageUsername({ username: USERS[2].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[2].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });
  });

  context("Revise training", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select training", () => {
      cy.trSelectFirstDocument();
    });

    it(`Click on Revise Document`, () => {
      cy.get("#PreviewControlsContainer-revise").arrowClick();
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRev, CyRoutes.DocPreview, CyRoutes.DocRevPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Change frequency to 10 days", () => {
      cy.get("[name=training-validity]").clear().arrowType("10");
    });

    it("Save training", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListNw({ approver: USERS[1].name });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Open assigned Training", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it("Click on the Training notification", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDocId}Rev 2 released form` });
    });

    it("Button 'Complete training' should be visible", () => {
      cy.contains("Complete training").should("be.visible");
    });

    it(`complete training for ${USERS[1].name}`, () => {
      cy.trCompleteTraining();
    });
  });

  context("Check training records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it("5 records should be present", () => {
      cy.trClearFilters();
      cy.get("tbody>tr").should("have.length", 5);
    });
  });

  context("Use time tool to travel by 1 day", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check new training records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it("6 records should be created", () => {
      cy.get("tbody>tr").should("have.length", 6);
    });

    it(`New Training record for ${USERS[2].name} Rev1`, () => {
      cy.trClearFilters();
      cy.trLandingPagetrId({ trId: "TRN-00006" });
      cy.trLandingPageOwner({ owner: "1" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[2].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });
  });

  context("Use time tool to travel by 9 days", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 9 day to back in future", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 9 });
    });

    it("Select next task TRAINING_RECORDS_REFRESH", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
    });

    it("Select next task TRAINING_RECORDS_STATUS", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(10000);
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check new training records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it("7 records should be created", () => {
      cy.trClearFilters();
      cy.get("tbody>tr").should("have.length", 7);
    });

    it(`New Training record for ${USERS[1].name} Rev2`, () => {
      cy.trClearFilters();
      cy.trLandingPagetrId({ trId: "TRN-00007" });
      cy.trLandingPageOwner({ owner: "2" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDocId)
        .and("contain", USERS[1].name).and("contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });
  });
});
