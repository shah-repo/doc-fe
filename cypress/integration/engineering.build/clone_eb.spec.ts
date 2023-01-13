/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { Material } from "../../utils/constants/documentTypes/material";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let createdPartDocument;
let EBDocumentType;
let createdEBform;

context("Clone EB Flow test", () => {
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
              Part,
              Material,
              EngineeringBuild,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          EBDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build Test");
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
                docId: "ET-00003",
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

    it("[API]Create materials document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Materials document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
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

    it("[API]Create part for eb document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part for EB document</p>",
          document: {
            docId: "PRT-00006",
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

    it("[API]Create EB form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>EB form</p>",
          document: {
            docId: "FM-00009",
            documentType: {
              id: formDocumentType[0].id,
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
          name: "EB form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: EBDocumentType[0].id,
            }],
            schema: [
              {
                type: "parts",
                name: "fb-parts-l42j5ayw",
                uniqueSchemaItem: true,
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "",
                rules: "",
                applicableOn: [],
                applicableValidationSchema: true,
                editorProperties: [],
                index: 0,
                tabId: "procedure",
              },
              {
                type: "section",
                name: "fb-procedure-section-l42j5ayw",
                label: "form.builder.procedure",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "",
                rules: "",
                applicableOn: [],
                applicableValidationSchema: true,
                editorProperties: [],
                index: 1,
                tabId: "procedure",
              },
              {
                index: 2,
                type: "procedure",
                tabId: "procedure",
                name: "-l42j5ayx",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "",
                rules: "",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [
                  "copyableValue",
                ],
                stepIndex: 1,
              },
              {
                name: "fb-approvals-l42iv0i2",
                type: "approvals",
                index: 3,
                label: "form.builder.approvals",
                tabId: "overview",
                deleteDisabled: true,
                uniqueSchemaItem: true,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEBform = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEBform.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
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
          addNewBtnLabel: "Create Engineering Build",
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Scenario 1:Verify that the user is able to clone EB linked to the previous build and release it", () => {
    context("Create EB form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "EB form" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build Test" });
        cy.unClick();
      });

      it("Click create document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Click on 'Create New'", () => {
      it("Click on 'Create new'", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Add Procedure1", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbAddNewFieldButton();
      });

      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Select a part in the Part field", () => {
        cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("Part document");
      });

      it("Upload attachment", () => {
        cy.atchUploadAttachment({ fileName: "image1.jpg" });
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Add attachment", () => {
        cy.get("[data-cy=\"albumMediaButton\"]").arrowClick({force: true});
        cy.wrapWithWaitOnApiCalls([ ], () => {
          cy.elUploadAttachment({
            fileName: "image.png",
            el: "fb-mediaalbum-upload-",
          });
        });
      });

      it("Add material document", () => {
        cy.ebAddMaterialDocument({ title: "Materials document", value: "2", name: "Each" });
      });

      it("Add equipment document ", () => {
        cy.ebAddEquipmentDocument({ title: "Equipment document" });
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Clone EB select 'Yes' and  Click on the CONTINUE button", () => {
      it("Click Clone EB button", () => {
        SystemRequirement("REQ-5230");
        cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
        cy.ebClickCloneEB();
        cy.ebCloneClickNo();
        cy.ebCloneClickYes();
        cy.ebCloneClickContinue();
        cy.wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Release previous EB", () => {
      it("Navigate to EB list", () => {
        cy.navigToEB();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00001" });
        cy.ebSelectFirstDocument();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Go to a new/cloned EB and check", () => {
      it("Navigate to EB list", () => {
        cy.navigToEB();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00002" });
        cy.ebSelectFirstDocument();
      });

      it("Verify title is copied", () => {
        cy.get("[data-cy=\"field-name\"]")
          .should("have.text", "Test Engineering Build");
      });

      it("Verify description is copied", () => {
        cy.get("[class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"]").eq(0)
          .should("have.text", "Test Engineering Build description");
      });

      it("Verify part revision", () => {
        cy.get("input[value=documentRevision]").should("have.attr", "checked");
      });

      it("Verify part document is same", () => {
        cy.get("[data-cy=childForRevise]")
          .should("have.attr", "value", "PRT-00005 - Part document");
      });

      it("Verify the Previous Build link", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.previous.build\"]")
          .should("have.text", "EB-00001 - Test Engineering Build");
      });

      it("Verify attachments are copied", () => {
        cy.get("[data-cy=\"attachment.title\"]").should("have.text", "image1.jpg");
      });
    });

    context("Make some changes in EB such as to add/remove Materials, Equipment, attachment", () => {
      it("Add reference to part", () => {
        cy.drSelectReferences("FM-00002 - 1 - EB form");
      });

      it("Add attachment", () => {

        cy.elUploadAttachment({
          fileName: "test.jpg",
          el: "fb-mediaalbum-upload-",
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Edit material document", () => {
        cy.get(`[data-cy="form.builder.procedure.materials.title"]`).eq(0).next().find("svg").arrowClick();
        cy.get(`[name="quantity"]`).clear().arrowType("4");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Go back to the previous build", () => {
      it("Navigate to EB list", () => {
        cy.navigToEB();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00001" });
        cy.ebSelectFirstDocument();
      });

      it("Verify the next Build link", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]")
          .should("have.text", "EB-00002 - Test Engineering Build");
      });
    });
  });

  context("Scenario 3: Verify that the user is able to clone EB NOT linked to the previous build and release it", () => {
    context("Create EB form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "EB form" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build Test" });
        cy.unClick();
      });

      it("Click create document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Click on 'Create New'", () => {
      it("Click on 'Create new'", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Add Procedure1", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbAddNewFieldButton();
      });

      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Choose an existing part from the list of available parts", () => {
        cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("PRT-00005 - rev 1 - Part document");
      });

      it("Upload attachment", () => {
        cy.atchUploadAttachment({ fileName: "image1.jpg" });
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Add attachment", () => {
        cy.get("[data-cy=\"albumMediaButton\"]").arrowClick({force: true});
        cy.wrapWithWaitOnApiCalls([ ], () => {
          cy.elUploadAttachment({
            fileName: "image.png",
            el: "fb-mediaalbum-upload-",
          });
        });
      });

      it("Add material document", () => {
        cy.ebAddMaterialDocument({ title: "Materials document", value: "2", name: "Each" });
      });

      it("Add equipment document ", () => {
        cy.ebAddEquipmentDocument({ title: "Equipment document" });
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Clone EB select 'No' and  Click on the CONTINUE button", () => {
      it("Click Clone EB button", () => {
        SystemRequirement("REQ-5230");
        cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
        cy.ebClickCloneEB();
        cy.ebCloneClickNo();
        cy.ebCloneClickContinue();
        cy.wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Go to a new/cloned EB and check", () => {
      it("Part Revision displays no values", () => {
        cy.get("input[value=document]").should("not.be.checked");
      });

      it("Verify part document is same", () => {
        cy.get("[data-cy=\"childrenParts\"]").should("be.empty");
      });
      it("Previous Build displays none", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.previous.build\"]")
          .should('not.exist');
      });

      it("Next Build displays none", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]")
          .should('not.exist');
      });

      it("Verify title is copied", () => {
        cy.get("[data-cy=\"field-name\"]")
          .should("have.text", "Test Engineering Build");
      });

      it("Verify description is copied", () => {
        cy.get("[class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"]").eq(0)
          .should("have.text", "Test Engineering Build description");
      });

      it("Verify attachments are copied", () => {
        cy.get("[data-cy=\"attachment.title\"]").should("have.text", "image1.jpg");
      });
    });

    context("Make some changes in EB such as to add/remove Materials, Equipment, attachment", () => {
      it("Select a part in the Part field", () => {
        cy.get("[data-cy=\"childrenParts\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[data-cy="childrenParts"]`).autocompleteSelect("PRT-00005 - rev 1 - Part document");
      });

      it("Add reference to part", () => {
        cy.drSelectReferences("FM-00002 - 1 - EB form");
      });

      it("Add attachment", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.elUploadAttachment({
          fileName: "test.jpg",
          el: "fb-mediaalbum-upload-",
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Edit material document", () => {
        cy.get(`[data-cy="form.builder.procedure.materials.title"]`).eq(0).next().find("svg").arrowClick();
        cy.get(`[name="quantity"]`).clear().arrowType("4");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Save doc", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Go back to the previous build", () => {
      it("Navigate to EB list", () => {
        cy.navigToEB();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00003" });
        cy.ebSelectFirstDocument();
      });

      it("Verify the next Build link", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]")
          .should('not.exist');
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
      });
    });
  });

  context("Scenario 4: Verify that the user is able to clone EB NOT linked to the previous build and release it", () => {
    context("Create EB form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "EB form" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "Description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build Test" });
        cy.unClick();
      });

      it("Click create document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Click on 'Create New'", () => {
      it("Click on 'Create new'", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Add Procedure1", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbAddNewFieldButton();
      });

      it("Enter title 'Test Engineering Build'", () => {
        cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
      });

      it("Enter description 'Test Engineering Build description'", () => {
        cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
      });

      it("Add the new part in the Part field", () => {
        cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("PRT-00006 - rev 1 - Part for EB document");
      });

      it("Upload attachment", () => {
        cy.atchUploadAttachment({ fileName: "image1.jpg" });
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Add attachment", () => {
        cy.get("[data-cy=\"albumMediaButton\"]").arrowClick({force: true});
        cy.wrapWithWaitOnApiCalls([ ], () => {
          cy.elUploadAttachment({
            fileName: "image.png",
            el: "fb-mediaalbum-upload-",
          });
        });
      });

      it("Add material document", () => {
        cy.ebAddMaterialDocument({ title: "Materials document", value: "2", name: "Each" });
      });

      it("Add equipment document ", () => {
        cy.ebAddEquipmentDocument({ title: "Equipment document" });
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Clone EB select 'No' and  Click on the CONTINUE button", () => {
      it("Click Clone EB button", () => {
        SystemRequirement("REQ-5230");
        cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
        cy.ebClickCloneEB();
        cy.ebCloneClickNo();
        cy.ebCloneClickContinue();
        cy.wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Go to a new/cloned EB and check", () => {
      it("Part Revision displays no values", () => {
        cy.get("input[value=document]").should("not.be.checked");
      });

      it("Verify part document is same", () => {
        cy.get("[data-cy=\"childrenParts\"]").should("be.empty");
      });
      it("Previous Build displays none", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.previous.build\"]")
          .should('not.exist');
      });

      it("Next Build displays none", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]")
          .should('not.exist');
      });

      it("Verify title is copied", () => {
        cy.get("[data-cy=\"field-name\"]")
          .should("have.text", "Test Engineering Build");
      });

      it("Verify description is copied", () => {
        cy.get("[class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"]").eq(0)
          .should("have.text", "Test Engineering Build description");
      });

      it("Verify attachments are copied", () => {
        cy.get("[data-cy=\"attachment.title\"]").should("have.text", "image1.jpg");
      });
    });

    context("Make some changes in EB such as to add/remove Materials, Equipment, attachment", () => {
      it("Select a part in the Part field", () => {
        cy.get("[data-cy=\"childrenParts\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[data-cy="childrenParts"]`).autocompleteSelect("PRT-00006 - rev 1 - Part for EB document");
      });

      it("Add reference to part", () => {
        cy.drSelectReferences("FM-00002 - 1 - EB form");
      });

      it("Add attachment", () => {
        cy.elUploadAttachment({
          fileName: "test.jpg",
          el: "fb-mediaalbum-upload-",
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Edit material document", () => {
        cy.get(`[data-cy="form.builder.procedure.materials.title"]`).eq(0).next().find("svg").arrowClick();
        cy.get(`[name="quantity"]`).clear().arrowType("4");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Approvers", () => {
        cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name});
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Go back to the previous build", () => {
      it("Navigate to EB list", () => {
        cy.navigToEB();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Select EB document", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "EB-00005" });
        cy.ebSelectFirstDocument();
      });

      it("Verify the next Build link", () => {
        cy.get("[data-cy=\"BuildsPresenter-link-common.next.build\"]")
          .should('not.exist');
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record button click", () => {
        cy.ebApproveWithoutApi();
      });
    });
  });
});

