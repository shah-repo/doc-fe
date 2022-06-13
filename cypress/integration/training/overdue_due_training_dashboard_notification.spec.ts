import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
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
let multipleCompanies;
let adminEmployee;
let secondEmployee;
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
              OneTimeTrainingTest,
            ],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[1].email
          );
          secondEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[2].email
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
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
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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

  context("Create Training Curriculum record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.reload();
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls(
        [
          CyRoutes.GetRequiredApproversDocRev,
          CyRoutes.DocPreview,
          CyRoutes.GetFieldLocks,
        ],
        () => {
          cy.get("#MultipleFormTemplate-selectDocForm input[type='text']")
            .arrowClick({ force: true })
            .autocompleteSelect("Training Curriculum test");
        }
      );
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
    });

    it("Verify training options document types", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").arrowClick();
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "AR Form");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect(
        "AR Form"
      );
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]")
        .eq(0)
        .arrowClick();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("60");
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[2].name}`
      );
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[3].name}`
      );
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(
        `${USERS[4].name}`
      );
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Check doc Draft status", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Draft");
      cy.get("#HeaderInfo-name").should(
        "have.text",
        "Training Dashboard Notification"
      );
    });
  });

  context("Submit for approval", () => {
    it("Click Submit for Approval", () => {
      cy.contains("Submit for approval").arrowClick();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Check doc Released status", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Released");
      cy.get("#HeaderInfo-name").should(
        "have.text",
        "Training Dashboard Notification"
      );
    });
  });

  context("Log in as first user and check training notifications", () => {
    it("Logout user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
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

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[3].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
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

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[4].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
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

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
    });

    context("Use time tool to travel user back to future", () => {
      it("Navigate to async tasks", () => {
        cy.navigToAsyncTasks();
      });

      it("Select task TIME_TRAVEL_USER", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
      });

      it("Select 24 day to back in future", () => {
        cy.asyncSelectBackToTheFutureTime({ day: 24 });
      });

      it("Select next task TRAINING_RECORDS_REFRESH", () => {
        cy.asyncTaskSelectNextTaskType({
          taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH,
        });
      });

      it("Select next task TRAINING_RECORDS_STATUS", () => {
        cy.asyncTaskSelectNextTaskType({
          taskType: SQS_TYPES.TRAINING_RECORDS_STATUS,
        });
      });

      it("Submit async task", () => {
        cy.asyncTaskClickSubmit();
        cy.wait(2000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
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

      it("Verify training notification", () => {
        cy.get("[trainingstatus=\"DUE\"]")
          .eq(0)
          .should("have.text", "DUE IN 7 DAYS");
      });
    });
  });

  context(
    "Log in as First user and check training notifications should now have the Due in 7 Days tag",
    () => {
      it("Logout user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[2].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({
          name: createdCompany.name,
          multiple: multipleCompanies,
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

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[3].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({
          name: createdCompany.name,
          multiple: multipleCompanies,
        });
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

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[4].email,
          password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({
          name: createdCompany.name,
          multiple: multipleCompanies,
        });
      });

      it("Verify training notification", () => {
        cy.get("[status=\"DUE\"]").eq(0).should("have.text", "DUE IN 7 DAYS");
      });
    }
  );
});
