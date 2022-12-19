// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let developersGroup;
let releasedFormId;
let forceTrainingRecordId;
let approvedFormId;

context("Training Flow test", () => {
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
                  label: "Change Orders",
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

  context("Create form doc with different statuses", () => {
    it(`Form with ${STATUS_TYPES_LABEL.DRAFT} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "draft form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it(`Form with ${STATUS_TYPES_LABEL.IN_REVIEW} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "review form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[12].name}`]);
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it(`Form with ${STATUS_TYPES_LABEL.PENDING_CHANGE} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "pending change form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[12].name}`]);
      cy.authLogout();
      cy.authLogin({ email: USERS[12].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      cy.trRejectAR();
      cy.authLogout();
      cy.authLogin({ email: USERS[11].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it(`Form with ${STATUS_TYPES_LABEL.OBSOLETE} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "obsolete form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drClickReviseDocument();
      cy.get("#RevisionTypeChange-obsolete").arrowClick();
      cy.recClickSaveBtn();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.OBSOLETE });
    });

    it(`Form with ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { releasedFormId = x.text(); });
    });

    it(`Form with ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "approved form" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { approvedFormId = x.text(); });
      cy.navigToApprovalRequestList();
      cy.cmpClickCreateApprovalRequest();
      cy.arEnterApprovalRequestTitle({ title: "AR form" });
      cy.drEnterDocumentDescription({ description: "Description" });
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "approved form" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "Document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "Justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
      cy.arSaveApiCall();
      cy.arAddApproverOnApproverList({ approver: USERS[11].email, noWait: true });
      cy.arSaveApiCall();
      cy.arClickSendToReview();
      cy.arApproveAR();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
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
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetAutocompleteOptions, CyRoutes.DocPreview,
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

    it("Periodic training should be displayed", () => {
      cy.get("#training-curriculum-details-section").should("have.text", "Periodic Training");
    });

    it("Verify training options document types", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).arrowClick();
      cy.get(".MuiAutocomplete-popper ul li").should("contain", "released form");
      cy.get(".MuiAutocomplete-popper ul li").should("contain", approvedFormId);
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "draft form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "review form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "pending change form");
      cy.get(".MuiAutocomplete-popper ul li").should("not.contain", "obsolete form");
    });

    it("Select document to be trained on", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).autocompleteSelect("released form");
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

    it("Select Groups to train 'Developers'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Developers");
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
        });
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Create One-Time Training form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test training form title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training form title" });
    });

    it("Enter document description 'test training description'", () => {
      cy.drEnterDocumentDescription({ description: "One-Time training description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'One-Time Training test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.unClick();
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

  context("One-Time Training record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'One-Time Training test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("One-Time Training test");
      });
    });

    it("Enter training title 'One-Time training title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training title" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Refresh training periodically should not exist for One-Time training", () => {
      cy.get(`[name="training-refresh-training-periodically"]`).should("not.exist");
    });

    it("Refresh period days should not exist for One-Time training", () => {
      cy.get("[name=training-validity]").should("not.exist");
    });

    it("Forced Retraining / One-Time Training should be displayed", () => {
      cy.get("#training-curriculum-details-section").should("have.text", "Forced Retraining / One-Time Training");
    });

    it("Select document to be trained on", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).autocompleteSelect("released form");
    });

    it("Select force training option 'Yes'", () => {
      cy.get(`[name="training-force-retraining-for-everyone"]`).eq(0).arrowClick();
    });

    it("Select training group 'Developers'", () => {
      cy.get(`[name="training-select-groups-to-train"]`).autocompleteSelect("Developers");
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get(`[data-cy="training-select-users-to-train"]`).autocompleteSelect(`${USERS[11].name}`);
        });
    });

    it("Save training", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Verify trainings present on Training Curriculum page", () => {
    it("'test training title' should be present", () => {
      cy.navigToTrainingCurriculums();
      cy.trLandingPageName({ name: "test training title" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", "test training title");
    });

    it("'One-Time training title' should be present", () => {
      cy.trLandingPageName({ name: "One-Time training title" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", "One-Time training title");
    });
  });

  context("Check columns on Training Curriculums page", () => {
    it("Check default columns on landing page", () => {
      cy.trVerifyElementByColumnName({ name: "TRAINING CURRICULUM ID" });
      cy.trVerifyElementByColumnName({ name: "TITLE" });
      cy.trVerifyElementByColumnName({ name: "OWNER" });
      cy.trVerifyElementByColumnName({ name: "STATE" });
      cy.trVerifyElementByColumnName({ name: "GROUP" });
    });
  });

  context("Verify Training Records with 'Pending' on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[11].name} with Pending on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedFormId)
        .and("contain", USERS[11].name).and("contain", "Pending");
    });

    it(`${USERS[12].name} with Pending on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[12].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedFormId)
        .and("contain", USERS[12].name).and("contain", "Pending");
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

  context("Open and complete Training", () => {
    it("Navigate to assigned training and verify due of 30 days", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            const dueOn = new Date(response.trainingRecords[0].dueOn);
            const todayDate = new Date();
            const diff = Math.ceil((dueOn - todayDate) / (1000 * 60 * 60 * 24));
            expect(diff).to.equal(30);
          }
        });
      }).as("response");
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedFormId}Rev 1 released form` });
      cy.wait("@response");
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });
  });

  context("Verify Training Records with timestamp on 'Completed On' column", () => {
    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[11].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedFormId)
        .and("contain", USERS[11].name).and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate);
    });
  });

  context("Forced Training", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'One-Time Training test' as document type", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev, CyRoutes.DocPreview,
        CyRoutes.GetFieldLocks], () => {
        cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
          .autocompleteSelect("One-Time Training test");
      });
    });

    it("Enter training title 'One-Time training title'", () => {
      cy.drEnterDocumentTitle({ name: "One-Time training title1" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).autocompleteSelect("released form");
    });

    it("Select force training option 'Yes'", () => {
      cy.get(`[name="training-force-retraining-for-everyone"]`).eq(0).arrowClick();
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[11].name}`);
        });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
    });

    it("Click Submit for Approval", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview, CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.DocPreview, CyRoutes.GetFieldLocks], () => {
        cy.contains("Submit for approval").arrowClick({ force: true });
      });
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });

    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("'One-Time training title1' should be present", () => {
      cy.trLandingPageName({ name: "One-Time training title1" });
      cy.get(`[data-grid-row-index="0"]`).should("contain", "One-Time training title1");
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Verify training notification`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedFormId}Rev 1 released form` });
    });

    it("Open assigned Training and get training Id", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const index = res.body.trainingRecords.length;
            forceTrainingRecordId = res.body.trainingRecords[index - 1].trId;
          }
        });
      }).as("response");

      cy.dashGoToListItemFromDashboard({ listItem: `${releasedFormId}Rev 1 released form` });

      cy.wait("@response");
    });

    it("click complete training button", () => {
      cy.trCompleteTraining();
    });

    it("Navigate to Training Records", () => {
      cy.navigToTrainingRecords();
    });

    it(`${USERS[11].name} with timestamp on 'Completed on' column should be present`, () => {
      cy.trLandingPageDocRevTitle({ title: "released form" });
      cy.trLandingPageUsername({ username: USERS[11].name });
      cy.trLandingPageDocId({ docId: releasedFormId });
      cy.trLandingPagetrId({ trId: forceTrainingRecordId });
      cy.get(`[data-grid-row-index="0"]`).should("contain", releasedFormId).and("contain", USERS[11].name)
        .and("not.contain", "Pending");
      const completedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
      cy.get(`[data-grid-row-index="0"]`).should("contain", completedDate).and("contain", forceTrainingRecordId);
    });

    it("Check if export button exist", () => {
      cy.get("[data-cy=\"document.revision.export.list\"]").should("exist");
    });

    it("Check if assign date filter contains expected values in dropdown", () => {
      cy.get(`[aria-colindex="6"] [class="k-input"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get("li").contains("Last 7 days");
      cy.get("li").contains("Last 14 days");
      cy.get("li").contains("Last 30 days").arrowClick().wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if due date filter contains expected values in dropdown", () => {
      cy.get(`[aria-colindex="7"] [class="k-input"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get("li").contains("Due in 7 days");
      cy.get("li").contains("Overdue").arrowClick().wait(1000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if completed on filter contains expected values in dropdown", () => {
      cy.get(`[aria-colindex="8"] [class="k-input"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get("li").contains("Last 7 days");
      cy.get("li").contains("Last 14 days");
      cy.get("li").contains("Last 30 days");
      cy.get("li").contains("Pending").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filter", () => {
      cy.unClick();
      cy.trClearFilters();
    });
  });
});
