// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import {
  OneTimeTrainingTest,
  TrainingCurriculum,
} from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let firstEmployee;
let secondEmployee;
let thirdEmployee;
let developersGroup;
let asyncTasksGroup;
let caGroup;

context("Overdue and Due in 7 Days Training Dashboard Notification", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", { tags: ["@timetool"] }, () => {
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
              OneTimeTrainingTest,
            ],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[1].email
          );
          firstEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[2].email
          );
          secondEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[3].email
          );
          thirdEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[4].email
          );
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
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
          employees: [{ id: adminEmployee.id }],
          tags: [
            ...developersGroup.body[0].tags,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Company Admin",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        caGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: caGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [GroupTag.DASHBOARD_ADMIN],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as string,
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
              restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [GroupTag.DOCUMENT_TYPE_MANAGEMENT],
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
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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

    it("Enter document title 'Form-TC Training Dashboard Notification'", () => {
      cy.drEnterDocumentTitle({
        name: "Form-TC Training Dashboard Notification",
      });
    });

    it("Enter document description 'Overdue and Due in 7 Days Training Dashboard Notification'", () => {
      cy.drEnterDocumentDescription({
        description:
          "Overdue and Due in 7 Days Training Dashboard Notification",
      });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.drSelectOutputDocumentType({
        documentType: "Training Curriculum test",
      });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']")
        .arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test");
      cy.unClick();
    });

    it("Enter training title 'Training Dashboard Notification'", () => {
      cy.drEnterDocumentTitle({ name: "Training Dashboard Notification" });
    });

    it("Enter description 'Overdue and Due in 7 Days Training Dashboard Notification'", () => {
      cy.drEnterDocumentDescription({
        description:
          "Overdue and Due in 7 Days Training Dashboard Notification",
      });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.get("[data-cy=\"common.Numeric\"]").first().arrowClick();
      cy.get("label").contains("Numeric").first().arrowClick();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect(
        "AR Form"
      );
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]")
        .eq(0)
        .arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("60");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[2].name}`
      );
      cy.unClick();
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[3].name}`
      );
      cy.unClick();
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[4].name}`
      );
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click on 'Overview' tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.DRAFT} status`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.drVerifyTitle({ title: "Training Dashboard Notification" });
    });
  });

  context("Submit for approval", () => {
    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Approve", () => {
      cy.get("[data-cy='form.builder.request.approve']").contains("Approve").click();
      cy.get("input[name=\"password\"]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"common.confirm\"]").click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.drVerifyTitle({ title: "Training Dashboard Notification" });
    });
  });

  context("Log in as first user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: firstEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: "FM-00001Rev 1 AR Form",
      });
    });
  });

  context("Log in as second user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({
        USER: USERS[3],
        employeeId: secondEmployee.id,
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: "FM-00001Rev 1 AR Form",
      });
    });
  });

  context("Log in as third user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: thirdEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: "FM-00001Rev 1 AR Form",
      });
    });
  });

  context("Log in as Admin user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Use time tool to travel user back to future", () => {
      it("Select 24 day to back in future", () => {
        cy.trSetTimeTravelInDays({ days: 24 });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.setTimeTravelToComplete({
          tasktype: "TIME_TRAVEL_COMPANY",
          days: "24 days",
          status: "COMPLETE",
        });
      });
    });

    context("Check training notifications", () => {
      it("Goto Dashboard", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Trainings' tab", () => {
        cy.contains("Trainings").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Training for Doc A show pending training of Users 1, 2 and 3", () => {
        cy.get("[trainingstatus=\"DUE\"]")
          .eq(0)
          .should("have.text", "DUE IN 7 DAYS")
          .arrowClick();
        cy.get("[class='MuiCollapse-wrapperInner']")
          .should("contain.text", USERS[2].name)
          .and("contain.text", USERS[3].name)
          .and("contain.text", USERS[4].name);
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });

      it("Verify training notification", () => {
        cy.get("[trainingstatus=\"DUE\"]")
          .eq(0)
          .should("have.text", "DUE IN 7 DAYS");
      });
    });

    context("Check Outstanding Trainings", () => {
      it("Select 'My Feed' tab", () => {
        cy.contains("My Feed").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'ALL' tab", () => {
        cy.contains("ALL").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Total Outstanding trainings should be +3`, () => {
        cy.get("div[id=\"full-width-tabpanel-0\"]")
          .children()
          .find("li")
          .should("have.length", 3);
      });

      it("Select 'DUE IN 7 DAYS' tab", () => {
        cy.contains("DUE IN 7 DAYS").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Count for Due in 7 Days should be + 3`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .find("li")
          .should("have.length", 3);
      });

      it(`List of trainings Due in 7 Days should show the additional entries for the 3 users`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .find("li")
          .should("contain.text", USERS[2].name.split(" ")[0])
          .and("contain.text", USERS[3].name.split(" ")[0])
          .and("contain.text", USERS[4].name.split(" ")[0]);
      });
    });
  });

  context(
    "Log in as First user and check training notifications should now have the Due in 7 Days tag",
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({
          USER: USERS[2],
          employeeId: firstEmployee.id,
        });
      });

      it("Verify training notification", () => {
        cy.get("[status=\"DUE\"]").eq(0).should("have.text", "DUE IN 7 DAYS");
      });
    }
  );

  context(
    "Log in as Second user and check training notifications should now have the Due in 7 Days tag",
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({
          USER: USERS[3],
          employeeId: secondEmployee.id,
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify training notification", () => {
        cy.get("[status=\"DUE\"]").eq(0).should("have.text", "DUE IN 7 DAYS");
      });
    }
  );

  context(
    "Log in as Third user and check training notifications should now have the Due in 7 Days tag",
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({
          USER: USERS[4],
          employeeId: thirdEmployee.id,
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify training notification", () => {
        cy.get("[status=\"DUE\"]").eq(0).should("have.text", "DUE IN 7 DAYS");
      });
    }
  );

  context("Log in as Admin user and Set the QA tool to Day 30", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Use time tool to travel user back to future", () => {
      it("Select 30 day to back in future", () => {
        cy.trSetTimeTravelInDays({ days: 6 });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.setTimeTravelToComplete({
          tasktype: "TIME_TRAVEL_COMPANY",
          days: "6 days",
          status: "COMPLETE",
        });
      });
    });
  });

  context("Log in as Third user and Complete training", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[4], employeeId: thirdEmployee.id });
    });

    it("Open assigned Training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: "FM-00001Rev 1 AR Form" });
    });

    it("Click complete training button", () => {
      cy.trCompleteTrainingWithoutApi();
    });
  });

  context("Log in as Admin user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    context("Check training notifications", () => {
      it("Goto Dashboard", () => {
        cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
      });

      it("Select 'Trainings' tab", () => {
        cy.contains("Trainings").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Training notification show pending training of User 1 and 2", () => {
        cy.get("[trainingstatus=\"DUE\"]")
          .eq(0)
          .should("have.text", "DUE IN 7 DAYS")
          .arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[class='MuiCollapse-wrapperInner']")
          .should("contain.text", USERS[2].name)
          .and("contain.text", USERS[3].name);
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });
    });

    context("Check Outstanding Trainings", () => {
      it("Select 'My Feed' tab", () => {
        cy.contains("My Feed").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'ALL' tab", () => {
        cy.contains("ALL").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Total Outstanding trainings should be +2`, () => {
        cy.get("div[id=\"full-width-tabpanel-0\"]")
          .children()
          .find("li")
          .should("have.length", 2);
      });

      it("Select 'DUE IN 7 DAYS' tab", () => {
        cy.contains("DUE IN 7 DAYS").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Count for Due in 7 Days should be 2`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .find("li")
          .should("have.length", 2);
      });

      it(`Line item for User 3 should be removed from Due in 7 Days list`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .should("not.contain.text", USERS[4].name.split(" ")[0]);
      });
    });
  });

  context("Set the QA tool to Day 31", () => {
    context("Use time tool to travel user back to future", () => {
      it("Select 31 day to back in future", () => {
        cy.trSetTimeTravelInDays({ days: 1 });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.setTimeTravelToComplete({
          tasktype: "TIME_TRAVEL_COMPANY",
          days: "a day",
          status: "COMPLETE",
        });
      });
    });

    context("Check training notifications", () => {
      it("Goto Dashboard", () => {
        cy.navigToDashboardWithoutApi();
      });

      it("Select 'Trainings' tab", () => {
        cy.contains("Trainings").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify training notification update to Overdue", () => {
        cy.get("[trainingstatus=\"OVERDUE\"]")
          .eq(0)
          .should("have.text", "OVERDUE");
      });
    });

    context("Check Outstanding Trainings", () => {
      it("Select 'My Feed' tab", () => {
        cy.contains("My Feed").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'ALL' tab", () => {
        cy.contains("ALL").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Total Outstanding trainings should be +2`, () => {
        cy.get("div[id=\"full-width-tabpanel-0\"]")
          .children()
          .find("li")
          .should("have.length", 2);
      });

      it("Select 'Overdue' tab", () => {
        cy.contains("Overdue").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Count for Overdue should be +2`, () => {
        cy.get("div[id=\"full-width-tabpanel-1\"]")
          .children()
          .find("li")
          .should("have.length", 2);
      });

      it(`Line items for User 1 and 2 should be moved to Overdue`, () => {
        cy.get("div[id=\"full-width-tabpanel-1\"]")
          .children()
          .find("li")
          .should("contain.text", USERS[2].name.split(" ")[0])
          .and("contain.text", USERS[3].name.split(" ")[0]);
      });

      it("Select 'DUE IN 7 DAYS' tab", () => {
        cy.contains("DUE IN 7 DAYS").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Count for DUE IN 7 DAYS should be 0`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .find("li")
          .should("have.length", 0);
      });

      it(`Line items for User 1 and 2 should be removed from Due in 7 Days`, () => {
        cy.get("div[id=\"full-width-tabpanel-2\"]")
          .children()
          .should("not.contain.text", USERS[2].name.split(" ")[0])
          .and("not.contain.text", USERS[3].name.split(" ")[0]);
      });
    });

    context(
      "Log in as First user and check training notifications should now have the Overdue tag",
      () => {
        it("Logout user", () => {
          cy.authLogout();
        });

        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({
            USER: USERS[2],
            employeeId: firstEmployee.id,
          });
        });

        it("Verify training notification", () => {
          cy.get("[status=\"OVERDUE\"]").eq(0).should("have.text", "OVERDUE");
        });
      }
    );
    context(
      "Log in as Second user and check training notifications should now have the Overdue tag",
      () => {
        it("Logout user", () => {
          cy.authLogout();
        });

        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({
            USER: USERS[3],
            employeeId: secondEmployee.id,
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify training notification", () => {
          cy.get("[status=\"OVERDUE\"]").eq(0).should("have.text", "OVERDUE");
        });
      }
    );
  });

  context("Log in as Admin user and Set the QA tool to Day 40", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Use time tool to travel user back to future", () => {
      it("Select 40 day to back in future", () => {
        cy.trSetTimeTravelInDays({ days: 9 });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.setTimeTravelToComplete({
          tasktype: "TIME_TRAVEL_COMPANY",
          days: "9 days",
          status: "COMPLETE",
        });
      });
    });
  });

  context("Log in as Second user and Complete training", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({
        USER: USERS[3],
        employeeId: secondEmployee.id,
      });
    });

    it("Open assigned Training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: "FM-00001Rev 1 AR Form" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click complete training button", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Log in as Admin user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    context("Check training notifications", () => {
      it("Goto Dashboard", () => {
        cy.get("[data-cy=\"navigation.dashboard\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Trainings' tab", () => {
        cy.contains("Trainings").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Training notification show overdue training of User 1", () => {
        cy.get("[trainingstatus=\"OVERDUE\"]")
          .eq(0)
          .should("have.text", "OVERDUE")
          .arrowClick();
        cy.get("[class='MuiCollapse-wrapperInner']").should(
          "contain.text",
          USERS[2].name
        );
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check Outstanding Trainings", () => {
      it("Select 'My Feed' tab", () => {
        cy.contains("My Feed").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'ALL' tab", () => {
        cy.contains("ALL").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Total Outstanding trainings should be +1`, () => {
        cy.get("div[id=\"full-width-tabpanel-0\"]")
          .children()
          .find("li")
          .should("have.length", 1);
      });

      it("Select 'Overdue' tab", () => {
        cy.contains("Overdue").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Count for Overdue should be +1`, () => {
        cy.get("div[id=\"full-width-tabpanel-1\"]")
          .children()
          .find("li")
          .should("have.length", 1);
      });

      it(`Line item for User 2 should be removed from overdue list`, () => {
        cy.get("div[id=\"full-width-tabpanel-1\"]")
          .children()
          .find("li")
          .should("not.contain.text", USERS[3].name.split(" ")[0]);
      });
    });
  });
});
