/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let initialArDocument;
let approvalRequestDocumentType;

const owner = USERS[1].name;
const userOne = USERS[2].name;
const userTwo = USERS[3].name;
const userThree = USERS[4].name;
const groupOne = "Developers";
const groupTwo = "Company Admin";
const groupThree = "User Management";
const docTitle = "Test EB";
const docDescription = "Test EB Description";
const formTitle = "New EB Form";
const formDescription = "New EB Form Description";

const FIELD_HEADERS = [
  "form.builder.approvals",
  "fb-textfield",
  "form.builder.procedure",
  "Step #1",
];

context("Verify New Layout for EB Document", () => {
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
            documentTypes: [EngineeringBuild],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
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
                  icon: "/navigation_icons/eb_icon.svg",
                  type: "CATEGORY",
                  label: "Engineering Builds",
                  category: "EB",
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
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]POST EB page details", (done: any) => {
      cy.request({
        method: "POST",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
        body: {
          category: "EB",
          addNewBtnLabel: "Create EB",
          config: {},
          columns: [
            {
              label: "EB ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
            {
              fn: "DOCUMENT_REVISION_VERSION",
              label: "Revision",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.revision",
              sourcePath: ["revisionStage:revision"],
              showOnAndroid: true,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "status",
              showOnAndroid: true,
            },
            {
              label: "Title",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "name",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Released Date",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "releasedAt",
              showOnAndroid: true,
            },
            {
              fn: "FORM_DOC_ID",
              label: "Form ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.formDocId",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
            {
              fn: "PART_ID_FROM_EB",
              label: "Part ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.partFromEb",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
          ],
        },
      }).then(() =>  done());
    });

    it("[API]Create equipment document", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment document</p>",
              document: {
                docId: "ET-00001",
                documentType: {
                  id: equipmentDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [
                    {
                      id: group.body[0].id,
                    },
                  ],
                },
              },
              name: "Equipment document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00001",
            documentType: {
              id: partDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create part for EB document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part for EB document</p>",
          document: {
            docId: "PRT-00002",
            documentType: {
              id: partDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "Part for EB document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });
  });

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create EB migration form", () => {
    context("Create EB  migration form", () => {
      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter title "EB Migration Form"`, () => {
        cy.drEnterDocumentTitle({ name: "EB Migration Form" });
      });

      it(`Enter description "EB migration form Description"`, () => {
        cy.drEnterDocumentDescription({ description: "EB migration form Description" });
      });

      it("Click on 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Engineering Build Test' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build Test" });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Add Text Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbAddNewFieldButton();
      });

      it("Save Form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Navigate to Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Add EB Procedure", () => {
        cy.fbAddNewField();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbAddNewFieldButton();
      });

      it("Save Form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create EB form", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${formTitle}`, () => {
      cy.drEnterDocumentTitle({ name: formTitle });
    });

    it(`Enter description ${formDescription}`, () => {
      cy.drEnterDocumentDescription({
        description: formDescription,
      });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Engineering Build Test' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Engineering Build Test" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add Text Field", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Save Form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify created form document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.verifyDefaultFields();
      cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "procedure", "materialsandequipment");
    });

    it("Verify Overview as default selected tab", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify tab as fixed", () => {
      cy.verifyFixedTab();
    });

    context("Verify tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview tab default fields", () => {
          cy.get("#sm-tabpanel-0").should("exist");
          cy.verifyDefaultFields();
          cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
        });

        it("Verify Approvals field as predefined schema", () => {
          cy.verifyApprovalsField();
        });

        it("Verify that Form Options should appear for Overview tab", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").should("be.visible");
          cy.verifyFormOptionsVisibility();
        });
      });

      context("Verify and add field", () => {
        it("Navigate to Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Verify 'Add A Field' button", () => {
          cy.get("#sm-tabpanel-1").find("button[data-cy=\"form.builder.add.field\"]").should("exist");
        });

        it("Add EB Procedure", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
          cy.fbAddNewFieldButton();
        });

        it("Save Form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Verify Procedure tab content", () => {
        it("Verify EB Procedure", () => {
          cy.get("#sm-tabpanel-1").should("exist");
          cy.contains("Step #1").should("exist");
          cy.contains("Materials").should("exist");
          cy.contains("Equipment").should("exist");
          cy.contains("EB Procedure").should("exist");
        });

        it("Verify that Form Options should appear for Procedure tab", () => {
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").should("be.visible");
          cy.verifyFormOptionsVisibility();
        });
      });

      context("Verify Materials&Equipment tab content", () => {
        it("Navigate to Materials&Equipment tab", () => {
          cy.drSelectMaterialsAndEquipmentTab();
        });

        it("Verify expansion panel for Material and Equipment", () => {
          cy.get("#sm-tabpanel-2").should("exist");
          cy.contains("Expand All").should("exist");
          cy.get(`[data-cy="common.expand.all"]`).arrowClick();
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "Material")
            .and("contain.text", "Equipment");
        });

        it("Verify that Form Options should not appear for Materials&Equipment tab", () => {
          cy.get("#sm-tabpanel-2").find(".formOptionsBox").should("not.exist");
        });
      });

      context("Verify Right side panel", () => {
        it("Verify that right side panel opens by default to the References tab", () => {
          cy.verifyReferencesTabAsActive();
        });

        context("Verify References tab", () => {
          it("Verify References tab General Info", () => {
            cy.verifyReferencesGeneralInfo({ user: owner });
          });

          it("Verify References", () => {
            cy.get(`[data-cy="field-referenceTo"]`).should("exist");
          });

          it("Verify Referenced By, Training, Release Date and Form Info", () => {
            cy.verifyReferencesOtherInfo();
          });
        });

        context("Verify Right side panel tabs", () => {
          it("Verify other tabs", () => {
            cy.verifyRightSidePanelOtherTabs();
          });
        });
      });
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create EB document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to Engineering Build", () => {
      cy.navigToEB();
    });

    it("Click on create Engineering Builds", () => {
      cy.get(`button[id="DocumentByTypeListPresenter-openDocRev"]`).arrowClick();
      cy.get("[id='MultipleFormTemplate-selectDocType']").type("New EB Form");
      cy.wait(1500);
      cy.get(`div[id^="react-select"]`).contains("New EB Form").arrowClick({ force: true });
      cy.unClick();
    });

    it(`Enter title ${docTitle}`, () => {
      cy.drEnterDocumentTitle({ name: docTitle });
    });

    it(`Enter description ${docDescription}`, () => {
      cy.drEnterDocumentDescription({ description: docDescription });
    });

    it("Enter fb-textfield", () => {
      cy.get("[name^=\"fb-textfield-\"]").arrowType("fb-textfield");
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify created engineering build document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      cy.get(`[data-cy="form.builder.part.revision"]`).should("exist");
      cy.get(`[data-cy="form.builder.part"]`).should("exist");
      cy.get(`[data-cy="BuildsPresenter-label"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "procedure", "materialsandequipment");
    });

    context("Verify created engineering build document tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
            cy.get("[data-cy=\"field-document.docId\"]").should("exist");
            cy.get(`[data-cy="form.builder.part.revision"]`).should("exist");
            cy.get(`[data-cy="form.builder.part"]`).should("exist");
            cy.get(`[data-cy="BuildsPresenter-label"]`).should("exist");
            cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
          });

          it("Verify Approvals field", () => {
            cy.verifyApprovalsField();
          });

          it("Verify that Form Options should appear for Overview tab", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").should("be.visible");
            cy.verifyFormOptionsVisibility();
          });
        });
      });

      context("Verify and add field in Procedure tab", () => {
        it("Navigate to Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Verify 'Add A Field' button", () => {
          cy.get("#sm-tabpanel-1").find("button[data-cy=\"form.builder.add.field\"]").should("exist");
        });

        it("Enter description to Step #1", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Step #1 description" });
        });

        it("Add Text Field", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "textfield" });
          cy.fbAddNewFieldButton();
        });

        it("Save Form", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });
      });

      context("Verify Procedure tab content", () => {
        context("Verify Procedure tab predefined fields", () => {
          it("Verify EB Procedure", () => {
            cy.get("#sm-tabpanel-1").should("exist");
            cy.get(`[data-cy="form.builder.step.number"]`).contains("Step #1").should("exist");
            cy.get(`[data-cy="form.builder.materials"]`).eq(0).contains("Materials").should("exist");
            cy.get(`[data-cy="form.builder.equipment"]`).eq(0).contains("Equipment").should("exist");
            cy.get(`[data-cy="form.builder.procedure"]`).contains("EB Procedure").should("exist");
          });

          it("Verify Add/Clone Step button", () => {
            cy.get(`[data-cy="form.builder.add.step"]`).should("exist");
            cy.get(`[data-cy="form.builder.add.step"]`).should("not.have.attr", "disabled");
            cy.get(`[data-cy="form.builder.clone.step"]`).should("exist");
            cy.get(`[data-cy="form.builder.clone.step"]`).should("not.have.attr", "disabled");
          });

          it("Verify Attachments", () => {
            cy.get(`[data-cy="form.builder.attachments"]`).should("contain.text", "Attachments");
            cy.get(`[data-cy="mediaUploadField"]`).should("exist");
            cy.get(`[data-cy="albumMediaButton"]`).should("exist");
          });

          it("Verify Add Material/Equipment button", () => {
            cy.get(`[data-cy="form.builder.materials.btn"]`).should("exist");
            cy.get(`[data-cy="form.builder.equipment.btn"]`).should("exist");
          });
        });

        context("Verify Procedure tab added fields", () => {
          it("Navigate to Procedure tab", () => {
            cy.drSelectProcedureTab();
          });

          it("Verify Text Field", () => {
            cy.contains("textfield").should("exist");
          });

          it("Verify that Form Options should appear for Procedure tab", () => {
            cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });

      });

      context("Verify Materials&Equipment tab content", () => {
        it("Navigate to Materials&Equipment tab", () => {
          cy.drSelectMaterialsAndEquipmentTab();
        });

        it("Verify expansion panel for Material and Equipment", () => {
          cy.get("#sm-tabpanel-2").should("exist");
          cy.contains("Expand All").should("exist");
          cy.get(`[data-cy="common.expand.all"]`).arrowClick();
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "Material")
            .and("contain.text", "Equipment");
        });

        it("Verify that Form Options should not appear for Materials&Equipment tab", () => {
          cy.get("#sm-tabpanel-2").find(".formOptionsBox").should("not.exist");
        });
      });
    });
  });

  context("Verify Right side panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.verifyReferencesTabAsActive();
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: owner });
      });

      it("Verify Add/Remove References", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify form migration", () => {
      it("Verify migrate form button is visible", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.get("[data-cy='common.form.migration']").should("be.visible");
      });

      it("Click on migrate form button", () => {
        cy.get("[data-cy='common.form.migration']").arrowClick();
      });

      it("Select form to be migrated", () => {
        cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
        cy.get("[id^='react-select']").contains("FM-00003").arrowClick();
      });

      FIELD_HEADERS.forEach( (fieldHeader, i) => {
        it(`Mapped '${fieldHeader}' field`, () => {
          cy.get("[id='formMigrationField']" ).eq(i).arrowClick();
          cy.get("[id^='react-select']").eq(i + 1).autocompleteSelect(fieldHeader);
        });
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify 'fb-textfield' value after migration", () => {
        cy.get("[value='fb-textfield']").should("exist");
      });

      it("Verify form info should have migrated form 'FM-00003'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00003");
      });

      it("Navigate to procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Verify 'Step #1' value after migration", () => {
        cy.get("div[id^=\"fb-mpiprocedure\"] p")
          .should("have.text", "Step #1 description");
        cy.wait(2000);
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(userOne);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab(groupOne);
        });
      });
    });

    context("Verify History tab", () => {
      const history = [
        {
          owner,
          actions: [
            { key: "Access granted to group", value: groupOne },
          ],
        },
        {
          owner,
          actions: [
            { key: "Access granted to user", value: userOne },
          ],
        },
        {
          owner,
          actions: [
            { key: "Form Set To", value: "FM-00003 - revision 1 - EB Migration Form" },
          ],
        },
        {
          owner,
          actions: [
            { key: "Description changed", value: docDescription },
            { key: "Name changed", value: docTitle },
          ],
        },
      ];

      it("Open history tab and verify changes are being captured", () => {
        cy.drSelectHistoryTab();
        cy.get(`[data-cy="History-detail"]`).should("be.visible");
      });

      verifyHistoryContent(history, groupOne);
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
      });
    });

    context("Verify History tab content scroll", () => {
      it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
        cy.verifyHistoryScroll();
      });
    });
  });

  context("Fill in the fields", () => {
    context("Enter values for Overview tab fields", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add the new part in the Part field", () => {
        cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("PRT-00001 - rev 1 - Part document");
      });

      it("Upload attachment", () => {
        cy.atchUploadAttachment({ fileName: "image1.jpg" });
      });
    });

    context("Enter values for Procedure tab predefined schema fields", () => {
      it("Navigate to Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.get("[data-cy=\"albumMediaButton\"]").scrollIntoView().arrowClick();
        cy.pmUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add material document", () => {
        cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
        cy.get("[data-cy=\"title\"]").arrowClick();
        cy.get("ul>li[role=option]").contains("Part for EB document").arrowClick({ force: true });
        cy.get("[name=\"quantity\"]").arrowType("2");
        cy.get("[data-cy=\"unit\"]").arrowClick();
        cy.get("ul>li[role=option]").contains("Each").arrowClick();
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      });

      it("Add equipment document", () => {
        cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
        cy.get("[data-cy=\"title\"]").arrowClick();
        cy.get("ul>li[role=option]").contains("Equipment document").arrowClick();
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      });
    });

    context("Enter values for Procedure tab added fields", () => {
      it("Fill text field", () => {
        cy.get("[name^=textfield-]").arrowType("EB Text Field");
        cy.unClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });
  });

  context("Select existing draft engineering build document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to Engineering Build", () => {
      cy.navigToEB();
    });

    it("Filter by EB Id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "EB-00001" });
    });

    it("Select first document", () => {
      cy.ebSelectFirstDocument();
    });
  });

  context("Verify draft engineering build document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      cy.get(`[data-cy="form.builder.part.revision"]`).should("exist");
      cy.get(`[data-cy="form.builder.part"]`).should("exist");
      cy.get(`[data-cy="BuildsPresenter-label"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
      cy.get(`[data-cy="attachment"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "procedure", "materialsandequipment");
    });

    context("Verify created engineering build document tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
            cy.get("[data-cy=\"field-document.docId\"]").should("exist");
            cy.get(`[data-cy="form.builder.part.revision"]`).should("exist");
            cy.get(`[data-cy="form.builder.part"]`).should("exist");
            cy.get(`[data-cy="BuildsPresenter-label"]`).should("exist");
            cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
            cy.get(`[data-cy="attachment"]`).should("exist");
          });

          it("Verify Approvals field", () => {
            cy.verifyApprovalsField();
          });

          it("Verify that Form Options should appear for Overview tab", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });
      });

      context("Verify Procedure tab content", () => {
        it("Navigate to Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        context("Verify Procedure tab predefined fields", () => {
          it("Verify EB Procedure", () => {
            cy.get("#sm-tabpanel-1").should("exist");
            cy.contains("Step #1").should("exist");
            cy.contains("Step #1 description").should("exist");
            cy.contains("Materials").should("exist");
            cy.contains("Equipment").should("exist");
            cy.contains("EB Procedure").should("exist");
          });

          it("Verify Add/Clone Step button", () => {
            cy.get(`[data-cy="form.builder.add.step"]`).should("exist");
            cy.get(`[data-cy="form.builder.add.step"]`).should("not.have.attr", "disabled");
            cy.get(`[data-cy="form.builder.clone.step"]`).should("exist");
            cy.get(`[data-cy="form.builder.clone.step"]`).should("not.have.attr", "disabled");
          });

          it("Verify Attachments", () => {
            cy.get(`[data-cy="form.builder.attachments"]`).should("contain.text", "Attachments");
            cy.get(`[data-cy="mediaUploadField"]`).should("exist");
          });

          it("Verify Add Material/Equipment button", () => {
            cy.get(`[data-cy="form.builder.materials.btn"]`).should("exist");
            cy.get(`[data-cy="form.builder.equipment.btn"]`).should("exist");
          });

          it("Verify added Materials and Equipment", () => {
            cy.get("[data-cy=\"form.builder.procedure.materials.title\"]")
              .eq(0).should("have.text", "PRT-00002 - Part for EB document | ? | Qty: 2 each");
            cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]")
              .eq(0).should("have.text", "ET-00001 - Equipment document ");
          });
        });

        context("Verify Procedure tab added fields", () => {
          it("Verify Text Field", () => {
            cy.contains("textfield").should("exist");
          });

          it("Verify that Form Options should appear for Procedure tab", () => {
            cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });

      });

      context("Verify Materials&Equipment tab content", () => {
        it("Navigate to Materials&Equipment tab", () => {
          cy.drSelectMaterialsAndEquipmentTab();
        });

        it("Verify expansion panel for Material and Equipment", () => {
          cy.get("#sm-tabpanel-2").should("exist");
          cy.contains("Expand All").should("exist");
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "Material")
            .and("contain.text", "Equipment");
        });

        it("Expand and verify added Material and Equipment", () => {
          cy.get(`[data-cy="common.expand.all"]`).arrowClick();
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "PRT-00002 - Part for EB document | each : 2")
            .and("contain.text", "ET-00001 - Equipment document");
        });

        it("Verify that Form Options should not appear for Materials&Equipment tab", () => {
          cy.get("#sm-tabpanel-2").find(".formOptionsBox").should("not.exist");
        });
      });
    });
  });

  context("Verify Right side panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.verifyReferencesTabAsActive();
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: owner });
      });

      it("Verify Add/Remove References", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(userTwo);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab(groupTwo);
        });
      });
    });

    context("Verify History tab", () => {
      const history = [
        {
          owner,
          actions: [
            { key: "Access granted to group", value: groupTwo },
          ],
        },
        {
          owner,
          actions: [
            { key: "Access granted to user", value: userTwo },
          ],
        },
      ];

      it("Open history tab and verify changes are being captured", () => {
        cy.drSelectHistoryTab();
        cy.get(`[data-cy="History-detail"]`).should("be.visible");
      });

      verifyHistoryContent(history, groupTwo);
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
      });
    });

    context("Verify History tab content scroll", () => {
      it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
        cy.verifyHistoryScroll();
      });
    });
  });

  context("Approve and Release engineering build document", () => {
    it("Add Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: owner });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve engineering build document", () => {
      cy.ebApprove();
    });
  });

  context("Select existing released engineering build document", () => {
    it("Navigate to Engineering Build", () => {
      cy.navigToEB();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Filter by EB Id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "EB-00001" });
    });

    it("Select first document", () => {
      cy.ebSelectFirstDocument();
    });
  });

  context("Verify released engineering build document", () => {
    it("Verify predefined fields", () => {
      cy.get("#field-name").contains(docTitle);
      cy.get(`[data-cy="BaseWithhtml-editor"]`).contains(docDescription);
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "procedure", "materialsandequipment");
    });

    context("Verify released engineering build document tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get(`[data-cy="BuildsPresenter-link-form.builder.part"]`)
              .should("contain.text", "PRT-00001 - Part document");
            cy.get(`[data-cy="BuildsPresenter-label"]`).should("exist");
            cy.get(`[data-cy="attachment"]`).should("exist");
          });

          it("Verify Approvals field", () => {
            cy.verifyApprovalsField();
          });

          it("Verify added approver", () => {
            cy.get(`[data-cy="approved-${owner}"]`).should("exist");
          });

          it("Verify that Form Options should appear for Overview tab", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });
      });

      context("Verify Procedure tab content", () => {
        it("Navigate to Procedure tab", () => {
          cy.drSelectProcedureTab();
        });

        context("Verify Procedure tab predefined fields", () => {
          it("Verify EB Procedure", () => {
            cy.get("#sm-tabpanel-1").should("exist");
            cy.contains("Step #1").should("exist");
            cy.contains("Step #1 description").should("exist");
            cy.contains("Materials").should("exist");
            cy.contains("Equipment").should("exist");
            cy.contains("EB Procedure").should("exist");
          });

          it("Verify Attachments", () => {
            cy.get(`[data-cy="form.builder.attachments"]`).should("contain.text", "Attachments");
            cy.get(`[data-cy="mediaUploadField"]`).should("exist");
          });

          it("Verify added Materials and Equipment", () => {
            cy.get("[data-cy=\"form.builder.procedure.materials.title\"]")
              .eq(0).should("have.text", "PRT-00002 - Part for EB document | ? | Qty: 2 each");
            cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]")
              .eq(0).should("have.text", "ET-00001 - Equipment document ");
          });
        });

        context("Verify Procedure tab added fields", () => {
          it("Verify Text Field", () => {
            cy.contains("textfield").should("exist");
          });

          it("Verify that Form Options should appear for Procedure tab", () => {
            cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });

      });

      context("Verify Materials&Equipment tab content", () => {
        it("Navigate to Materials&Equipment tab", () => {
          cy.drSelectMaterialsAndEquipmentTab();
        });

        it("Verify expansion panel for Material and Equipment", () => {
          cy.get("#sm-tabpanel-2").should("exist");
          cy.contains("Expand All").should("exist");
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "Material")
            .and("contain.text", "Equipment");
        });

        it("Expand and verify added Material and Equipment", () => {
          cy.get(`[data-cy="common.expand.all"]`).arrowClick();
          cy.get(".MuiExpansionPanel-root")
            .should("contain.text", "PRT-00002 - Part for EB document | each : 2")
            .and("contain.text", "ET-00001 - Equipment document");
        });

        it("Verify that Form Options should not appear for Materials&Equipment tab", () => {
          cy.get("#sm-tabpanel-2").find(".formOptionsBox").should("not.exist");
        });
      });
    });

    context("Verify Right side panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.verifyReferencesTabAsActive();
      });

      it("Verify Right side panel Can be expanded or collapsed", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify References tab is fixed as the user scrolls up or down", () => {
        cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
      });

      context("Verify References tab", () => {
        it("Verify References tab General Info", () => {
          cy.verifyReferencesGeneralInfo({ user: owner });
        });

        it("Verify References", () => {
          cy.get(`[data-cy="generalInfo"]`).should("contain.text", "References");
        });

        it("Verify Referenced By, Training, Release Date and Form Info", () => {
          cy.verifyReferencesOtherInfo();
        });
      });

      context("Verify Revisions tab", () => {
        it("Open revisions tab, click and verify current revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
        });
      });

      context("Verify Access Permissions tab", () => {
        it("Open access permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(userThree);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab(groupThree);
          });
        });
      });

      context("Verify History tab", () => {
        const history = [
          {
            owner,
            actions: [
              { key: "Access granted to group", value: groupThree },
            ],
          },
          {
            owner,
            actions: [
              { key: "Access granted to user", value: userThree },
            ],
          },
        ];

        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });

        verifyHistoryContent(history, groupThree);
      });

      context("Verify Bookmarks tab", () => {
        it("Open bookmarks tab", () => {
          cy.drSelectBookmarksTab();
          cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
        });
      });

      context("Verify Revision History tab", () => {
        it("Open revision history tab", () => {
          cy.drSelectRevisionHistoryTab();
          cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
        });
      });

      context("Verify History tab content scroll", () => {
        it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
          cy.verifyHistoryScroll();
        });
      });
    });
  });
});

export { };
