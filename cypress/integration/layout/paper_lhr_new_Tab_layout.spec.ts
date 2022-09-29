// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let adminEmployeeLoginResponse;
let adminEmployee;
let loginResponse;

let group;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;
let createdPartDocument2;
let initialArDocument;
let formDocumentType;
let approvalRequestDocumentType;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";

context("Paper LHR tab Layout", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/document_revisions/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(100);
      });
    }).as("Search");
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [
              Part,
              PurchaseOrderTest,
              ReceivableTest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
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

    it("[API]Create Supplier form", (done: any) => {
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
              description: "<p>Supplier Form document</p>",
              document: {
                docId: "FM-00010",
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
              name: SupplierFormTitle,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: supplierDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdSupplierFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdSupplierFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              cy.poAPICreatePO({
                payload: {
                  name: "API Supplier Document",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdSupplierFormDocument.id },
                  description: "API Supplier document",
                  revisionChangeType: RevisionChangeType.NextRevision,
                  document: {
                    docId: "SUP-00001",
                    documentType: {
                      id: supplierDocumentType[0].id,
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
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then((response) => {
                createdSupplierDocument = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdSupplierDocument.id,
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
          });
        });
      });
    });

    it("[API]Create part documents", (done: any) => {
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
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part second document</p>",
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
              name: "Part second document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument2 = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument2.id,
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
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: SECOND_USER.email,
      }).then(() => {
        done();
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Sample FORM for migration", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Paper LHR Document Title'", () => {
        cy.drEnterDocumentTitle({ name: "Paper LHR Document For migration" });
      });

      it("Enter description 'Paper LHR Document form  description'", () => {
        cy.drEnterDocumentDescription({ description: "Paper LHR Document form  description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Paper LHR' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
      });

      it("Click on Save", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield from migration" });
        cy.fbAddNewFieldButton();
      });

      it("Approve and released", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Verify form and tabs", () => {
      it("Verify Predefined fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='field-retrain']").should("exist");
      });

      it("Verify Title, Description, Document Type, References, Document ID, output document", () => {
        cy.verifyPredefiendFields();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Paper LHR Document Title'", () => {
        cy.drEnterDocumentTitle({ name: "Paper LHR Document Title" });
      });

      it("Enter description 'Paper LHR Document form  description'", () => {
        cy.drEnterDocumentDescription({ description: "Paper LHR Document form  description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Paper LHR' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Click on Save", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });
    });
  });

  context("Verification of the created form", () => {
    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Textfield for inline" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });
    it("Verify that it contains only Details tab", () => {
      cy.get("[data-cy='tabId.details']").should("exist");
      cy.get("#sm-tabpanel-1").should("not.exist");
    });

    it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00003",
        revision: "Rev 1",
      });
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the Details tab by default and it contains", () => {
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      cy.get("#sm-tabpanel-0").should("be.visible");
    });

    context("Verify Fields", () => {

      it("Verify Default fields up to attachment", () => {
        cy.verifyPredefiendFields();
      });

      it("Verify Added FB Fields checkbox, textfield", () => {
        cy.get("[name^='textfield-for-inline']").should("exist");
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify schema fields Part,Initial Quantity end quantity,approvals", () => {
        cy.get("[data-cy='lhr-selected-part']").scrollIntoView();
        cy.get("[data-cy='lhr-selected-part']").should("exist");
        cy.get("[name='lhr_initial_quantity']").should("exist");
        cy.get("[name='lhr-end-quantity']").should("exist");
        cy.get("#sm-tabpanel-0").scrollTo("bottom");
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
      });

      it("Verify Form option", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Submit for approval", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create LHR from Previous form In Draft/WIP state", () => {
    it("Navigate to LHR page", () => {
      cy.navigToLHR();
    });

    it("Click 'Initiate New LHR'", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select a document type Paper Lot History Record and select a Form released", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Paper Lot History Record");
    });

    it("Select a form Paper Lot History Record", () => {
      cy.get("#MultipleFormTemplate-selectDocType input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Paper LHR Document Title");
    });

    context("Fill in the fields", () => {

      it("Select Part 0005", () => {
        cy.get("[data-cy='lhr-selected-part']").autocompleteSelect("PRT-00005 - rev 1 - Part document");
      });

      it("Enter value in textfield", () => {
        cy.get("[data-cy^='textfield-for-inline']").arrowType("Test");
      });

      it("Select 'R&D' build type", () => {
        cy.unClick();
        cy.get("[value='R&D']").check();
      });

      it("Enter initial quantity", () => {
        cy.get("[name='lhr_initial_quantity']").arrowType("10");
      });

      it("Enter end quantity", () => {
        cy.get("[data-cy='lhr-end-quantity'] input").arrowType("10");
      });


      it("Checked chebox value", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Save the document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Fill in Approval block and  Approve and release Record", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
      });

    });
  });

  context("Create LHR from Previous form", () => {
    it("Navigate to LHR page", () => {
      cy.navigToLHR();
    });

    it("Click 'Initiate New LHR'", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select a document type Paper Lot History Record and select a Form released", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Paper Lot History Record");
    });

    it("Select a form Paper Lot History Record", () => {
      cy.get("#MultipleFormTemplate-selectDocType input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Paper LHR Document Title");
    });

    context("Verify Created LHR Doc", () => {
      it("Verify that it contains only Details tab", () => {
        cy.get("[data-cy='tabId.details']").should("exist");
        cy.get("#sm-tabpanel-1").should("not.exist");
      });

      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (WIP)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "LHR",
          docId: "LHR-00002",
          revision: "Rev A",
        });
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify Form opens to the Details tab by default and it contains", () => {
        cy.isTabActive({ name: "details", index: 0 });
      });

      context("Verify Schema Fields", () => {
        it("Verify Default fields up to attachment", () => {
          cy.get("[data-cy='field-document.docId']").should("exist");
        });

        it("Verify Added FB Fields checkbox, textfield", () => {
          cy.get("[name^='textfield-for-inline']").should("exist");
          cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        });

        it("Verify schema fields Part,Initial Quantity end quantity,approvals", () => {
          cy.get("[data-cy='lhr-selected-part']").should("exist");
          cy.get("[name='lhr_initial_quantity']").should("exist");
          cy.get("[name='lhr-end-quantity']").should("exist");
          cy.get("#sm-tabpanel-0").scrollTo("bottom");
          cy.get("[name^='fb-approvals-fb-approvals']").should("exist");
        });

        it("Verify Form option", () => {
          cy.get(".formOptionsBox").should("exist");
        });

        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy='References']").should("exist");
          cy.get("[data-cy='generalInfo']").should("be.visible");
        });
      });
    });
  });

  context("Validate Right Side Panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Eye Icon", () => {
      cy.get("[data-cy='references-icon']").should("exist");
    });

    it("Verify Expand and collapse", () => {
      cy.verifyExpandCollpase();
    });

    it("It is fixed as the user scrolls up or down", () => {
      cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
      cy.get("[data-cy='References']").should("be.visible");
    });

    it("Verify References selection Add Remove", () => {
      cy.verifyAddRemoveReference({ formId: "FM-00001" });
    });

    it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
      cy.verifyReferenceInfo();
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00003");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
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
        cy.get("[id^=react-select]").contains("FM-00002").arrowClick();
      });

      it("Click on cancel changes", () => {
        cy.get("[data-cy='common.cancel']").arrowClick();
      });

      it("Verify the existing field after migration", () => {
        cy.get("[name='lhr_initial_quantity']").should("exist");
      });

      // steps : Required after blocker fixed ENC-12588
      // it("Click on confirm change", () => {
      //   cy.get("[data-cy='common.confirm.change']").arrowClick();
      // });

      // it("Verify text field from migrated form added here", () => {
      //   cy.get("[name^='textfield-from-migration']").should("exist").wait(2000);
      // });

    });

    context("Verify User able to add Groups or other user permissions", () => {
      it("Open permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Developers");
        });
      });
    });

    context("Check document history", () => {
      const groupOne = "Developers";
      const history = [
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to group", value: `Developers` },
          ],
        },
        {
          owner: USERS[1].name,
          actions: [
            { key: "Access granted to user", value: `${USERS[3].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      verifyHistoryContent(history, groupOne);
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });

      it("Click on book mark verify user is navigate to the bookmarked field", () => {
        cy.get("[data-cy='Bookmarks-detail'] p").arrowClick();
        cy.get("[data-cy^='fb-approvals']").should("be.visible");
      });
    });
  });


  context("Fill in the fields and Release", () => {
    it("Select Part 0005", () => {
      cy.get("[data-cy='lhr-selected-part']").autocompleteSelect("PRT-00005 - rev 1 - Part document");
    });

    it("Enter value in textfield", () => {
      cy.get("[data-cy^='textfield-for-inline']").arrowType("Test");
    });

    it("Select 'R&D' build type", () => {
      cy.unClick();
      cy.get("[value='R&D']").check();
    });

    it("Enter initial quantity", () => {
      cy.get("[name='lhr_initial_quantity']").arrowType("10");
    });

    it("Enter end quantity", () => {
      cy.get("[data-cy='lhr-end-quantity'] input").arrowType("10");
    });

    it("Checked chebox value", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Save the document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Fill in Approval block and  Approve and release Record", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick({ force: true });
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });

      it("Approve and Release", () => {
        cy.get("[data-cy='fb-control-btn']").contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.GetRequiredApproversDocRev,
          CyRoutes.SessionDetails], () => {
          cy.get("[data-cy='common.confirm']").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  // verification of exisitng records in draft and relase state

  context("Verify Layout for Draft state", () => {
    it("Navigate to Record landing Page", () => {
      cy.navigToLHR();
      cy.dlClearFilters();
    });

    it("Select the LHR", () => {
      cy.get(`[aria-colindex="9"] input`).arrowType("LHR-00001").wait(500);
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlSelectFirstDocument();
    });

    context("Verify Created LHR Doc", () => {
      it("Verify that it contains only Details tab", () => {
        cy.get("[data-cy='tabId.details']").should("exist");
        cy.get("#sm-tabpanel-1").should("not.exist");
      });

      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage,(IN_REVIEW)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.IN_REVIEW,
          title: "LHR",
          docId: "LHR-00001",
          revision: "Rev A",
        });
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify Form opens to the Details tab by default and it contains", () => {
        cy.isTabActive({ name: "details", index: 0 });
      });

      context("Verify Schema Fields", () => {

        it("Verify Added FB Fields checkbox, textfield", () => {
          cy.get("[name^='textfield-for-inline']").should("exist");
          cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        });

        it("Verify schema fields Part,Initial Quantity end quantity,approvals", () => {
          cy.get("[data-cy='lhr-selected-part']").scrollIntoView();
          cy.get("[data-cy='lhr-selected-part']").should("be.visible");
          cy.get("[name='lhr_initial_quantity']").should("be.visible");
          cy.get("[name='lhr-end-quantity']").should("be.visible");
        });

        it("Verify Form option", () => {
          cy.get(".formOptionsBox").should("exist");
        });

        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy='References']").should("exist");
          cy.get("[data-cy='generalInfo']").should("be.visible");
        });
      });

    });

    context("Validate Right Side Panel", () => {

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("It is fixed as the user scrolls up or down", () => {
        cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
        cy.get("[data-cy='References']").should("be.visible");
      });


      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00003");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      });

      context("Verify Revision", () => {
        it("open revision tab", () => {
          cy.get("[data-cy='note-icon']").arrowClick();
        });

        it("Verify revision Rev Document open or not", () => {
          cy.get("[data-cy='DocumentRevisionList-item']").eq(0).arrowClick();
          cy.wait(2000);
          cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev A");

        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(USERS[4].name);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab("Developers");
          });
        });

      });

      context("Check document history", () => {
        const groupOne = "Developers";
        const history = [
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to group", value: `Developers` },
            ],
          },
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to user", value: `${USERS[4].name}` },
            ],
          },
        ];
        it("Verify Doc history", () => {
          cy.drSelectHistoryTab();
        });
        verifyHistoryContent(history, groupOne);
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });

        it("Click on book mark verify user is navigate to the bookmarked field", () => {
          cy.get("[data-cy='Bookmarks-detail'] p").arrowClick();
          cy.get("[data-cy^='fb-approvals']").should("be.visible");
        });
      });
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });

      it("Approve and Release", () => {
        cy.get("[data-cy='fb-control-btn']").contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.GetRequiredApproversDocRev,
          CyRoutes.SessionDetails], () => {
          cy.get("[data-cy='common.confirm']").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Verify Layout for Released record", () => {
    it("Navigate to Record landing Page", () => {
      cy.navigToLHR();
      cy.dlClearFilters();
    });

    it("Select the LHR", () => {
      cy.get(`[aria-colindex="9"] input`).arrowType("LHR-00002").wait(500);
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlSelectFirstDocument();
    });

    context("Verify Created LHR Doc", () => {
      it("Verify that it contains only Details tab", () => {
        cy.get("[data-cy='tabId.details']").should("exist");
        cy.get("#sm-tabpanel-1").should("not.exist");
      });

      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage,(Released)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "LHR",
          docId: "LHR-00002",
          revision: "Rev A",
        });
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify Form opens to the Details tab by default and it contains", () => {
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
        cy.get("#sm-tabpanel-0").should("be.visible");
      });

      context("Verify Schema Fields", () => {

        it("Verify Added FB Fields checkbox, textfield", () => {
          cy.get("[name^='textfield-for-inline']").should("exist");
          cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        });

        it("Verify schema fields Part,Initial Quantity end quantity,approvals", () => {
          cy.get("[data-cy='lhr-selected-part']").should("be.visible");
          cy.get("[name='lhr_initial_quantity']").should("be.visible");
          cy.get("[name='lhr-end-quantity']").should("be.visible");
        });

        it("Verify Form option", () => {
          cy.get(".formOptionsBox").should("exist");
        });

        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy='References']").should("exist");
          cy.get("[data-cy='generalInfo']").should("be.visible");
        });
      });

    });

    context("Validate Right Side Panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("It is fixed as the user scrolls up or down", () => {
        cy.get("#sm-tabpanel-0").scrollIntoView().should("be.visible");
        cy.get("[data-cy='References']").should("be.visible");
      });


      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00003");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      });

      context("Verify Revisions tab", () => {
        it("Open revisions tab, click and verify current revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(USERS[5].name);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab("Can be approver");
          });
        });

      });

      context("Check document history", () => {
        const groupOne = "Can be approver";
        const history = [
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to group", value: `Developers` },
            ],
          },
          {
            owner: USERS[1].name,
            actions: [
              { key: "Access granted to user", value: `${USERS[5].name}` },
            ],
          },
        ];
        it("Verify Doc history", () => {
          cy.drSelectHistoryTab();
        });
        verifyHistoryContent(history, groupOne);
      });

      context("Verify Book Mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.get("[data-cy='bookmark-icon']").arrowClick();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });

        it("Click on book mark verify user is navigate to the bookmarked field", () => {
          cy.get("[data-cy='Bookmarks-detail'] p").arrowClick();
          cy.get("[data-cy^='fb-approvals']").should("be.visible");
        });
      });
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });
    });

    context("Verify Scroll", () => {
      it("Navigate to history tab", () => {
        cy.get("[data-cy='timeline-icon']").arrowClick();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom");
      });
    });
  });
});

export { };

