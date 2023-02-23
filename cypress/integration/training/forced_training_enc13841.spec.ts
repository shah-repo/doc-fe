// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { receivingReleasedDateMonth } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let thirdEmployee;
let fourthEmployee;
const doc1Id = "FM-00002";
const doc1Name = "One-Time training test title";
const doc1Desc = "One-Time training test desc";
const trainingGrp1 = "group 1";

context("Forced training ENC-12313", () => {
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
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[13].email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[14].email);
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

    it(`[API] Create ${trainingGrp1} with user 3 and user 4`, () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: trainingGrp1,
          permissions: [],
          employees: [{ id: thirdEmployee.id }, { id: fourthEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
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

  context("Create 'One-Time Training test' form and release it", () => {
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

    it("Enter document title 'One-Time Training test title'", () => {
      cy.drEnterDocumentTitle({ name: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter document description 'One-Time Training test desc'", () => {
      cy.drEnterDocumentDescription({ description: doc1Desc });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'One-Time Training test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Mark 'Training Required'", () => {
      cy.drClickTrainingRequired();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("As User 4, self train on the Document created on step 1", () => {
    it(`Login as user 4 and goto dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[14], employeeId: fourthEmployee.id });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear document filter", () => {
      cy.dlClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter the list by document title", () => {
      cy.dlFilterByDocTitle({ docTitle: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open the first document in the list", () => {
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Complete trainings", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Login user 1 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create 'Training Curriculum test' form and release it", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter document title 'Training Curriculum test form title'", () => {
      cy.drEnterDocumentTitle({ name: "Training Curriculum test form title" });
    });

    it("Enter document description 'Training Curriculum test form desc'", () => {
      cy.drEnterDocumentDescription({ description: "Training Curriculum test form desc" });
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

    it("Mark 'Training Required'", () => {
      cy.drClickTrainingRequired();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.wait(3000);
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create Training Curriculum document for two users and release it", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create Training Curriculum document", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test", { force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training title 'Training Curriculum test doc title'", () => {
      cy.drEnterDocumentTitle({ name: "Training Curriculum test doc title" });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Training Curriculum test doc desc" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect(doc1Id);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").type("5");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Users to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[12].name}`);
      cy.unClick();
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
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Confirm new pending training records have been created for User 1 and User 2", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    // eslint-disable-next-line max-len
    it(`Verify user 1 with 'Completed on' column should have one pending item should be present`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index]`).should("contain", USERS[11].name).and("contain", "Pending");
      cy.get("[data-grid-row-index]").should("have.length", 1);
    });

    it(`Verify user 2 with 'Completed on' column should have one pending item should be present`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index]`).should("contain", USERS[12].name).and("contain", "Pending");
      cy.get("[data-grid-row-index]").should("have.length", 1);
    });
  });

  context("Confirm both users have training notifications in their dashboards and completed their training", () => {
    it("Goto Dashboard for user 1", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notifications as 'A training is assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}A training is assigned to you` });
    });

    it(`Open assigned Training`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}` });
    });

    it("Click complete training button", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Login as user 2 and go to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Verify training notifications as 'A training is assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}A training is assigned to you` });
    });

    it(`Open assigned Training`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}` });
    });

    it("Complete trainings", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Login user 1 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  // eslint-disable-next-line max-len
  context(`Verify Training Records with timestamp on 'Completed On' column for user 1 should not have pending event`, () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`user 1 with timestamp on 'Completed on' column for ${doc1Name} should not have pending event`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageDocId({ docId: doc1Id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(2000);
      cy.get(`[data-grid-row-index="0"]`).should("contain", doc1Id)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      cy.get(`[data-grid-row-index="0"]`).should("contain", receivingReleasedDateMonth);
      cy.get(`[data-grid-row-index="0"]`).should("have.length", 1);
    });

    it(`Verify the number of documents is 1`, () => {
      cy.get(`[data-grid-row-index="0"]`).should("have.length", 1);
    });
  });

  // eslint-disable-next-line max-len
  context(`Verify Training Records with timestamp on 'Completed On' column for user 2 should not have pending event`, () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    // eslint-disable-next-line max-len
    it(`user 2 with timestamp on 'Completed on' column for ${doc1Name} should not have pending event`, () => {
      cy.trClearFilters();
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageDocId({ docId: doc1Id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(2000);
      cy.get(`[data-grid-row-index="0"]`).should("contain", doc1Id)
        .and("contain", USERS[12].name).and("not.contain", "Pending");
      cy.get(`[data-grid-row-index="0"]`).should("contain", receivingReleasedDateMonth);
      cy.get(`[data-grid-row-index="0"]`).should("have.length", 1);
    });
  });

  context("Create new Training Curriculum record for TF and Release it", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'One-Time Training Test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("One-Time Training Test", { force: true });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter training title 'Forced training title'", () => {
      cy.drEnterDocumentTitle({ name: "Forced training title" });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Forced training description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document to be trained on created in step 1", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect(doc1Id);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select force training option 'Yes'", () => {
      cy.get("[name=training-force-retraining-for-everyone]").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select group ${trainingGrp1} to train`, () => {
      cy.get(`[data-cy="training-select-groups-to-train"]`).arrowClick();
      cy.get(`[data-cy="training-select-groups-to-train"]`).autocompleteSelect(trainingGrp1);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Select Users to train ${USERS[11].name}`, () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });
  });

  // eslint-disable-next-line max-len
  context(`Confirm a new “Pending” training record on this item has been created for User 1, User 3. but not for User 2 and user 4`, () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trClearFilters();
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

    it(`user 1 with one Pending on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[11].name }).wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[11].name).and("contain", "Pending");
      cy.get("tr.k-master-row").should("have.length", 1);
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`user 3 with one Pending on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[13].name }).wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", USERS[13].name).and("contain", "Pending");
      cy.get("tr.k-master-row").should("have.length", 1);
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`user 2 with one Pending on 'Completed on' column should NOT be present`, () => {
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[12].name }).wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-master-row").should("have.length", 0);
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`user 4 with one Pending on 'Completed on' column should NOT be present`, () => {
      cy.trLandingPageDocRevTitle({ title: doc1Name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageUsername({ username: USERS[14].name }).wait(500);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.trLandingPageCompletedOn({ completed: "Pending" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-master-row").should("have.length", 0);
    });
  });

  // eslint-disable-next-line max-len
  context(`Confirm only User 1, User 3 have a new dashboard notification and complete training and no notification for user 2 and user 4`, () => {
    it("Goto Dashboard for user 1", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training notifications as 'A training is assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}A training is assigned to you` });
    });

    it(`Open assigned Training`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}` });
    });

    it("Complete trainings", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Login as user 3 and goto dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[13], employeeId: thirdEmployee.id });
    });

    it("Verify training notifications as 'A training is assigned to you'", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}A training is assigned to you` });
    });

    it(`Open assigned Training`, () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${doc1Id}Rev 1 ${doc1Name}` });
    });

    it("Complete trainings", () => {
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Login user 2 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });

    it("Login user 4 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[14], employeeId: fourthEmployee.id });
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });

    it("Login user 1 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
    });
  });

  // eslint-disable-next-line max-len
  context(`Verify User 1, User 3 training Record are now completed and user 2 and user 4 dashboard notifications are no longer there`, () => {
    it("Goto Dashboard for user 1", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });

    it(`Login as user 3 and goto dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[13], employeeId: thirdEmployee.id });
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });

    it("Login user 2 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[12], employeeId: secondEmployee.id });
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });

    it("Login user 4 again and goto dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[14], employeeId: fourthEmployee.id });
    });

    it("Verify training notifications 'A training is assigned to you' does not exist", () => {
      // eslint-disable-next-line max-len
      cy.cmpVerifyNoPendingActions();
    });
  });
});
export { };
