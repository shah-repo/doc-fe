/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { GeneralDocumentDocType } from "../../utils/constants/documentTypes/generalDocument";
import { OneTimeTrainingTest, TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let thirdEmployee;
let developersGroup;
let releasedDoc1Id;

context("Export training curriculum", () => {
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
    it("[API]Create company", (done: any) => {
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
              ClinicalProtocolNotRedline,
              TrainingCurriculum,
              GeneralDocumentDocType,
              OneTimeTrainingTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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

    it("[API] Create Group1", () => {
      cy.grpAPICreateNewGroup({
        payload: {
          name: "Group1",
          permissions: [],
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvals Section", () => {
      cy.get(`input[data-cy^="fb-approvals-fb-approvals"]`).should("exist");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Periodic Training", () => {
      cy.get(`[data-cy="Periodic Training"]`).should("exist");
    });

    it("Verify Documents to Train on", () => {
      cy.get(`[data-cy="Documents to Train on"]`).should("exist");
    });

    it("Verify Refresh/repeat training periodically?", () => {
      cy.get(`[data-cy="Refresh/repeat training periodically?"]`).should("exist");
    });

    it("Verify Training Frequency (in days)", () => {
      cy.get(`[data-cy="Training Frequency (in days)"]`).should("exist");
    });

    it("Verify Trainees Details", () => {
      cy.get(`[data-cy="Trainees Details"]`).should("exist");
    });

    it("Verify Groups to Train", () => {
      cy.get(`[data-cy="Groups to Train"]`).should("exist");
    });

    it("Verify Users to Train (if applicable)", () => {
      cy.get(`[data-cy="Users to Train (if applicable)"]`).should("exist");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("Add Form fields and Release", () => {
    it("Add TextField 1", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbAddNewFieldButton();
    });

    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.get(`[data-cy="edit-schema-item"]`).last().arrowClick({ force: true });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.get(`[data-cy="remove-schema-item"]`).last().arrowClick({ force: true });
    });

    it("Move component", () => {
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("export here", () => {
    it("Export template", () => {
      cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("TC_Template");
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Create Training Curriculum form 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test training form title 2'", () => {
      cy.drEnterDocumentTitle({ name: "test training form title 2" });
    });

    it("Enter document description 'test training description 2'", () => {
      cy.drEnterDocumentDescription({ description: "test training description 2" });
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

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("import here", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/TC_Template.json");
    });
  });

  context("verify fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });
  });

  context("Verify predefined fields size", () => {
    it("Verify Approvals Section", () => {
      cy.get(`input[data-cy^="fb-approvals-fb-approvals"]`).should("exist").should("have.length", "1");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Periodic Training", () => {
      cy.get(`[data-cy="Periodic Training"]`).should("exist").should("have.length", "1");
    });

    it("Verify Documents to Train on", () => {
      cy.get(`[data-cy="Documents to Train on"]`).should("exist").should("have.length", "1");
    });

    it("Verify Refresh/repeat training periodically?", () => {
      cy.get(`[data-cy="Refresh/repeat training periodically?"]`).should("exist").should("have.length", "1");
    });

    it("Verify Training Frequency (in days)", () => {
      cy.get(`[data-cy="Training Frequency (in days)"]`).should("exist").should("have.length", "1");
    });

    it("Verify Trainees Details", () => {
      cy.get(`[data-cy="Trainees Details"]`).should("exist").should("have.length", "1");
    });

    it("Verify Groups to Train", () => {
      cy.get(`[data-cy="Groups to Train"]`).should("exist").should("have.length", "1");
    });

    it("Verify Users to Train (if applicable)", () => {
      cy.get(`[data-cy="Users to Train (if applicable)"]`).should("exist").should("have.length", "1");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("add and verify", () => {
    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
    });

    it("Move component", () => {
      cy.get("[data-cy='approvals-1']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });
  });

  context("Create One time training form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'One time training form title'", () => {
      cy.drEnterDocumentTitle({ name: "One time training form title" });
    });

    it("Enter document description 'One time training description'", () => {
      cy.drEnterDocumentDescription({ description: "One time training description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvals Section", () => {
      cy.get(`input[data-cy^="fb-approvals-fb-approvals"]`).should("exist");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Forced Retraining One Time Training", () => {
      cy.get(`[data-cy="Forced Retraining / One-Time Training"]`).should("exist");
    });

    it("Verify Documents to Train on", () => {
      cy.get(`[data-cy="Documents to Train on"]`).should("exist");
    });

    it("Verify Force retraining (everyone will be retrained regardless of their current status)", () => {
      cy.get(`[data-cy="Force retraining (everyone will be retrained regardless of their current status)"]`)
        .should("exist");
    });

    it("Verify Trainees Details", () => {
      cy.get(`[data-cy="Trainees Details"]`).should("exist");
    });

    it("Verify Groups to Train", () => {
      cy.get(`[data-cy="Groups to Train"]`).should("exist");
    });

    it("Verify Users to Train (if applicable)", () => {
      cy.get(`[data-cy="Users to Train (if applicable)"]`).should("exist");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("Add Form fields and Release", () => {
    it("Add TextField 1", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbAddNewFieldButton();
    });

    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });


    it("Verify Edit, Move and Remove", () => {
      cy.get(`[data-cy="edit-schema-item"]`).last().arrowClick({ force: true });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.get(`[data-cy="remove-schema-item"]`).last().arrowClick({ force: true });
    });

    it("Move component", () => {
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("export here", () => {
    it("Export template", () => {
      cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("One_Time_Training_Template");
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Create One time training form 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'One time training form title 2'", () => {
      cy.drEnterDocumentTitle({ name: "One time training form title 2" });
    });

    it("Enter document description 'One time training description 2'", () => {
      cy.drEnterDocumentDescription({ description: "One time training description 2" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Training Curriculum test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "One-Time Training test" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("import here", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/One_Time_Training_Template.json");
    });
  });

  context("verify fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvals Section", () => {
      cy.get(`input[data-cy^="fb-approvals-fb-approvals"]`).should("exist").should("have.length", "1");
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Forced Retraining One Time Training", () => {
      cy.get(`[data-cy="Forced Retraining / One-Time Training"]`).should("exist").should("have.length", "1");
    });

    it("Verify Documents to Train on", () => {
      cy.get(`[data-cy="Documents to Train on"]`).should("exist").should("have.length", "1");
    });

    it("Verify Force retraining (everyone will be retrained regardless of their current status)", () => {
      cy.get(`[data-cy="Force retraining (everyone will be retrained regardless of their current status)"]`)
        .should("exist").should("have.length", "1");
    });

    it("Verify Trainees Details", () => {
      cy.get(`[data-cy="Trainees Details"]`).should("exist").should("have.length", "1");
    });

    it("Verify Groups to Train", () => {
      cy.get(`[data-cy="Groups to Train"]`).should("exist").should("have.length", "1");
    });

    it("Verify Users to Train (if applicable)", () => {
      cy.get(`[data-cy="Users to Train (if applicable)"]`).should("exist").should("have.length", "1");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });
  });

  context("add and verify", () => {
    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
    });

    it("Move component", () => {
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(".drag-handle").eq(0)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });
  });

  context("Create a document", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc1" });
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
      cy.get(`[data-cy="HeaderInfo-docId"]`).then((x) => { releasedDoc1Id = x.text(); });
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
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test");
    });

    it("Verify Text Field 1", () => {
      cy.get(`[data-cy="fb-textfield-1"]`).should("exist");
    });

    it("Enter training title 'training'", () => {
      cy.drEnterDocumentTitle({ name: "test training" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Periodic training should be displayed", () => {
      cy.get("#training-curriculum-details-section").should("have.text", "Periodic Training");
    });

    it("Validate Documents to train On", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).parent().parent()
        .should("contain.text", "The Documents to Train on is a required field.");
    });

    it("Select document to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
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

    it("Select Groups to train 'Group 1'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group1");
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[3].name}`);
        });
    });

    it(`Verify training status should be '${STATUS_TYPES_LABEL.DRAFT}'`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
      cy.wait(3000);
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notification for user 1", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Verify training notification ${releasedDoc1Id}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Check training notifications for other users", () => {
    it(`Login user ${USERS[2].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it(`Login user ${USERS[3].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });

  context(`Complete Training for ${USERS[2].name}`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it(`Complete training for ${USERS[2].name}`, () => {
      cy.contains("My Feed").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dashGoToListItemFromDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
      cy.trCompleteTraining();
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context(`Login for ${USERS[1].name}`, () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create One Time Training record", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'One-Time Training test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("One-Time Training test");
    });

    it("Verify Text Field 1", () => {
      cy.get(`[data-cy="fb-textfield-1"]`).should("exist");
    });

    it("Enter training title 'training'", () => {
      cy.drEnterDocumentTitle({ name: "one time test training" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select document to be trained on", () => {
      cy.get(`[name="training-document-to-be-trained-on"]`).autocompleteSelect("released doc1");
    });

    it("Select force training option 'Yes'", () => {
      cy.get(`[name="training-force-retraining-for-everyone"]`).eq(0).arrowClick();
    });

    it("Select Groups to train 'Group1'", () => {
      cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Group1");
    });

    it("Select User to train", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.PatchDocRev, () => {
          cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[2].name}`);
        });
    });

    it(`Verify training status should be '${STATUS_TYPES_LABEL.DRAFT}'`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Click Approve", () => {
      cy.trApproveTraining();
    });
  });

  context("Check training notification for user 1", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboard();
    });

    it(`Verify training notification ${releasedDoc1Id}`, () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Check training notifications for other users", () => {
    it(`Login user ${USERS[2].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });

    it(`Login user ${USERS[3].name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
    });

    it("Verify training notification", () => {
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${releasedDoc1Id}Rev 1 released doc1` });
    });
  });
});
