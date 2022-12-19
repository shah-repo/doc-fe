// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let releasedDoc1Id;
let releasedDoc2Id;
let releasedDoc3Id;

context("Add/Remove Training docs from Training Curriculum", () => {
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

    it("Enter document title 'test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "test training form title" });
      cy.unClick();
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "test training description" });
      cy.unClick();
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create 3 docs", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Release the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedDoc1Id = x.text(); });
    });

    it("Doc2 with Released status", () => {
      cy.navigToDocumentList();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc2" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedDoc2Id = x.text(); });
    });

    it("Doc3 with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc3" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedDoc3Id = x.text(); });
    });
  });

  context("Create Training Curriculum record", () => {
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
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click Refresh on 'Document to trained on'", () => {
      cy.get("[name=training-document-to-be-trained-on]").find("button").eq(2).arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select document 'released doc2' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc2");
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("5");
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select User to train", () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[12].name}`);
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.landingPageLoadingElementShouldNotExist();
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
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("4 records should be created", () => {
      cy.get("tbody>tr").should("have.length", 4);
    });
  });

  context("Verify training notifications on dashboard", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc2Id}Rev 1 released doc2` });
      cy.unClick();
    });
  });

  context("Complete trainings", () => {
    it("Open and complete second training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc2Id}Rev 1 released doc2` });
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open and complete first training", () => {
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify Training Records with timestamp on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.trainingRecords\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`${USERS[11].name} with timestamp on 'Completed on' column for 'released doc1' should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released doc1" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
    });

    it("Clear filters", () => {
      cy.trClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Revise training", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Find training 'test training title'", () => {
      cy.contains("test training title").arrowClick();
    });

    it("Click on 'Revise Document'", () => {
      cy.get("#PreviewControlsContainer-revise").arrowClick();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document 'released doc3' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc3");
    });

    it("Remove document 'released doc2' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").parent()
        .find(".MuiAutocomplete-tag").eq(1).find(".MuiSvgIcon-root.MuiChip-deleteIcon").arrowClick({ force: true });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
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


    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify Training Records", () => {
    it("Navigate to Training Records", () => {
      cy.get("[data-cy=\"navigation.documentControl\"]").arrowClick();
      cy.get("[data-cy=\"navigation.training\"]").should("be.exist");
      cy.get("[data-cy=\"navigation.trainingRecords\"]").arrowClick({ force: true });
    });

    it("Training record for doc1 should be as it is", () => {
      cy.trLandingPageDocId({ docId: releasedDoc1Id });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc1Id)
        .and("contain", USERS[12].name).and("contain", "Pending");
    });

    it("Training record for doc3", () => {
      cy.trLandingPageDocId({ docId: releasedDoc3Id });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc3Id)
        .and("contain", USERS[11].name).and("contain", "Pending");
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc3Id)
        .and("contain", USERS[12].name).and("contain", "Pending");
    });

    it("Training record for doc2", () => {
      cy.trLandingPageDocId({ docId: releasedDoc2Id });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedDoc2Id)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      cy.get("tbody>tr").should("have.length", 1);
    });
  });

  context(`Verify training notification for ${USERS[12].name}`, () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[12].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({
        name: createdCompany.name,
        multiple: multipleCompanies,
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification for doc 2 should not present`, () => {
      cy.dashVerifyListItemNotExistsOnDashboard({ listItem: `${releasedDoc2Id}Rev 1 released doc2` });
    });

    it(`Verify training notification for doc 3 should be present`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc3Id}Rev 1 released doc3` });
    });
  });
});
