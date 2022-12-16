/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { lotIdRef } from "../../utils/constants/dateHandler";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let partDocumentType;
let createdPartDocument;
let MPIDocumentType;
let createdMPIDocument;
let developersGroup;

const paperlhrTitle = "Paper LHR form";
const paperlhrDesc = "Paper LHR form description";
const docType = "Paper Lot History Record";
const partDocumentTitle = "Part document";
const  lotTitle = "Lot from LHR";
const lotDesc = "lot Description";
const lotDocType = "Lots";

const saveFileNameOne = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameTwo = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameThree = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameFour = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameFive = (Math.round(Math.random() * 100000)) % 100000;
const saveFileNameSix = (Math.round(Math.random() * 100000)) % 100000;

context("Paper new process LHR", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
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


    it("[API]Creates document revision for approval", () => {
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

    it("[API]Create MPI document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>MPI created through API</p>",
          document: {
            docId: "PI-00001",
            documentType: {
              id: MPIDocumentType[0].id,
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
          name: "API MPI",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                tabId: "procedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                tabId: "procedure",
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: [
                  "includeNotes",
                ],
                includeNotes: true,
                editorConfig: {
                  description: "<p>Description for step 1</p>",
                  materials: [
                    {
                      id: "kvasuama",
                      title: createdPartDocument.id,
                      quantity: 3,
                      unit: "each",
                    },
                  ],
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                tabId: "procedure",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMPIDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMPIDocument.id,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create a lot form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${lotTitle}`, () => {
      cy.drEnterDocumentTitle({ name: lotTitle });
    });

    it(`Enter description ${lotDesc}`, () => {
      cy.drEnterDocumentDescription({ description: lotDesc });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it(`Click on ${lotDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: lotDocType });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Approve and release form", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });


  context("Create 'Paper LHR' form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${paperlhrTitle}`, () => {
      cy.drEnterDocumentTitle({ name: paperlhrTitle });
    });

    it(`Enter description ${paperlhrDesc}`, () => {
      cy.drEnterDocumentDescription({ description: paperlhrDesc });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it(`Click on ${docType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: docType });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Approve and release form", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create a new paper LHR", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it(`Click on 'Initiate new LHR'`, () => {
      cy.contains("Initiate new LHR").arrowClick();
    });
  });

  context(`Verify two options exist for document type and select ${docType}`, () => {
    it(`Verify 'Lot History Record' option is available`, () => {
      cy.get(`div[data-cy^="field-selectType"]`).click().focused()
        .arrowType("Lot History Record{downarrow}{enter}", { force: true });
      cy.unClick();
      cy.get(`div[data-cy^="field-selectType"]`).contains("Lot History Record");
    });

    it(`Verify ${docType} option is available and Select it`, () => {
      cy.get(`div[data-cy^="field-selectType"]`).click().focused()
        .arrowType(`${docType}{downarrow}{enter}`, { force: true });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Navigate to LHR and Verify paper LHR status WIP and subtitle in LOT#YYMMDDXX format", () => {
    it(`Navigate to LHR`, () => {
      cy.wait(5000);
      cy.navigToLHR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter 'Paper LHR' document", () => {
      cy.lhrClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Veirfy the number of documents", () => {
      cy.lhrVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter document by status", () => {
      cy.lhrVerifyFilterByStatus({ status: "WIP" });
    });

    it("Filter document by owner", () => {
      cy.lhrFilterByOwner({ owner: USERS[1].name });
    });

    it("Click on first document and open it", () => {
      cy.lhrSelectFirstDocument();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it(`Check doc in ${STATUS_TYPES_LABEL.WIP} status and subtitle contains LOT#YYMMDDXX`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.get("div[data-cy=\"HeaderInfo-status\"]>span").should("contain", STATUS_TYPES_LABEL.WIP);
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01");
    });
  });

  context("Verify all predefined fields are present", () => {
    it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
      cy.get(`[name="lhr-selected-part"]`).parent().parent()
        .contains("The Part to be Manufactured is a required field.");
    });

    it(`Verify 'The Part to be Manufactured is required field' is in RED(#F44336)`, () => {
      cy.get(".MuiFormHelperText-root.Mui-error")
        .contains("The Part to be Manufactured is a required field.")
        .should("have.css", "color", "rgb(244, 67, 54)");
    });

    it(`Verify 'The Part to be Manufactured is required field' is visible`, () => {
      cy.get(`[name="lhr-selected-part"]`).parent().parent()
        .contains("The Part to be Manufactured is a required field.")
        .should("be.visible");
    });

    it(`Select ${partDocumentTitle} for Part to be Manufactured`, () => {
      cy.get(`[name="lhr-selected-part"]`).arrowClick();
      cy.get(`[name="lhr-selected-part"]`).autocompleteSelect(`${partDocumentTitle}{downarrow}{enter}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check 'The Part to be Manufactured is a required field' is not displayed", () => {
      cy.get(`[name="lhr-selected-part"]`).parent().parent()
        .should("not.contain", "The Part to be Manufactured is a required field.");
    });

    it("Verify 'Build Type' with two options 'R&D' and 'Production' are displayed", () => {
      cy.get(`[data-cy="Build Type"]`).contains("Build Type");
      cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D");
      cy.get(`[name="lhr-build-type"]`).last().should("have.value", "Production");
    });

    it("Verify 'The Build Type is a required field.' is displayed", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Build Type is a required field.");
    });

    it("Verify 'The Build Type is a required field.' is in RED(#F44336)", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Build Type is a required field.")
        .should("have.css", "color", "rgb(244, 67, 54)");
    });

    it("Verify 'The Build Type is a required field.' is visible", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Build Type is a required field.")
        .should("be.visible");
    });

    it("Select build type as Production", () => {
      cy.get(`[name="lhr-build-type"]`).last().should("have.value", "Production").arrowClick();
    });

    it(`Save the document`, () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Verify 'The Build Type is a required field.' is disappeared", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Build Type is a required field.")
        .should("not.exist");
    });

    it("Switch build type as R&D", () => {
      cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").arrowClick();
    });

    it(`Verify the popup windows displays 'Build type change'`, () => {
      cy.get(`div[data-cy="form.builder.build.title"]`).contains("Build type change");
    });

    it(`Verify the popup windows contains 'You are about to switch the build type from form'`, () => {
      cy.get(`[data-cy="[object Object]"]`).contains("You are about to switch the build type from");
    });

    // eslint-disable-next-line max-len
    it(`Verify the popup windows contains 'Production to R&D. Are you sure you want to make this change?'`, () => {
      // eslint-disable-next-line max-len
      cy.get(`[data-cy="[object Object]"]`).contains("Production to R&D. Are you sure you want to make this change?");
    });

    it(`Verify the popup windows displays 'Cancel'`, () => {
      cy.get(`[data-cy="form.builder.cancel"]`).contains("Cancel");
    });

    it(`Verify the popup windows displays 'Yes switch build type'`, () => {
      cy.get(`[data-cy="form.builder.lhr.build.switch"]`).contains("Yes switch build type").arrowClick();
    });

    it(`Save the document`, () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it(`Verify switch build type to 'R&D' is checked`, () => {
      cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").should("be.checked");
    });

    it("Select build type 'Production' as disabled", () => {
      cy.get(`[name="lhr-build-type"]`).last().should("have.value", "Production").and("have.attr", "disabled");
    });

    it("Verify 'The Initial Quantity is a required field.' is displayed'", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Initial Quantity is a required field.");
    });

    it("Verify 'The Initial Quantity is a required field.' is in RED(#F44336)", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Initial Quantity is a required field.")
        .should("have.css", "color", "rgb(244, 67, 54)");
    });

    it("Verify 'The Initial Quantity is a required field.' is visible", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The Initial Quantity is a required field.")
        .should("be.visible");
    });

    it("Enter Intial Quantity field value to 1.5e-8", () => {
      cy.get(`[name="lhr_initial_quantity"]`).arrowType("1.5e-8");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify 'The Initial Quantity is a required field.' is disappeared", () => {
      cy.get(".MuiFormHelperText-root.Mui-error")
        .should("not.contain", "The Initial Quantity is a required field.");
    });

    it("Verify Initial Quantity is displayed as 1.5e-8", () => {
      cy.get(`[name="lhr_initial_quantity"]`).should("have.value", "1.5e-8");
    });

    it("Verify 'The End Quantity is a required field.' is displayed", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The End Quantity is a required field.");
    });

    it("Verify 'The End Quantity is a required field.' is in RED(#F44336)", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The End Quantity is a required field.")
        .should("have.css", "color", "rgb(244, 67, 54)");
    });

    it("Verify 'The End Quantity is a required field.' is visible", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").contains("The End Quantity is a required field.")
        .should("be.visible");
    });

    it("Enter End Quantity field value to 150000", () => {
      cy.get(`[name="lhr-end-quantity"]`).arrowType("150000");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify 'The End Quantity is a required field.' is disappeared", () => {
      cy.get(".MuiFormHelperText-root.Mui-error").should("not.exist");
    });

    it("Verify End Quantity is displayed as entered", () => {
      cy.get(`[name="lhr-end-quantity"]`).should("have.value", "150000");
    });
  });

  context("Verify upload file of different formats", () => {
    it("Upload video.mp4 files", () => {
      cy.atchUploadAttachment({ fileName: "video.mp4" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Upload dummy.pdf files", () => {
      cy.atchUploadAttachment({ fileName: "dummy.pdf" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload example.json files", () => {
      cy.atchUploadAttachment({ fileName: "example.json" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload users.csv files", () => {
      cy.atchUploadAttachment({ fileName: "users.csv" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload test.docx files", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Upload image.jpg files", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Download files and verify they exists in downloaded folder", () => {
    it("Download document image.jpg", () => {
      cy.atchDownloadFile({ fileName: "image.jpg", saveFileName: saveFileNameOne + "image.jpg" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameOne}image.jpg`).its("length").should("be.gt", 0);
    });

    it("Download document video.mp4", () => {
      cy.atchDownloadFile({ fileName: "video.mp4", saveFileName: saveFileNameTwo + "video.mp4" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameTwo}video.mp4`).its("length").should("be.gt", 0);
    });

    it("Download document dummy.pdf", () => {
      cy.atchDownloadFile({ fileName: "dummy.pdf", saveFileName: saveFileNameThree + "dummy.pdf" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameThree}dummy.pdf`).its("length").should("be.gt", 0);
    });

    it("Download document example.json", () => {
      cy.atchDownloadFile({ fileName: "example.json", saveFileName: saveFileNameFour + "example.json" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameFour}example.json`).its("length").should("be.gt", 0);
    });

    it("Download document users.csv", () => {
      cy.atchDownloadFile({ fileName: "users.csv", saveFileName: saveFileNameFive + "users.csv" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameFive}users.csv`).its("length").should("be.gt", 0);
    });

    it("Download document test.docx", () => {
      cy.atchDownloadFile({ fileName: "test.docx", saveFileName: saveFileNameSix + "test.docx" });
    });

    it("Check size of downloaded file greater than 0", () => {
      cy.readFile(`cypress/downloads/${saveFileNameSix}test.docx`).its("length").should("be.gt", 0);
    });
  });

  context("Click save document", () => {
    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Navigate LHR and open paper LHR", () => {
    it(`Navigate to LHR`, () => {
      cy.navigToLHR();
    });

    it("Filter 'Paper LHR' document", () => {
      cy.lhrClearFilters();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Veirfy the number of documents", () => {
      cy.lhrVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter document by status", () => {
      cy.lhrVerifyFilterByStatus({ status: "WIP" });
    });

    it("Filter document by owner", () => {
      cy.lhrFilterByOwner({ owner: USERS[1].name });
    });

    it("Click on first document and open it", () => {
      cy.lhrSelectFirstDocument();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context(`Check LHR status as ${STATUS_TYPES_LABEL.WIP} and 'RD' added to LOT#`, () => {
    it(`Check doc in ${STATUS_TYPES_LABEL.WIP} status and subtitle contains LOT#YYMMDDXXRD`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.get("div[data-cy=\"HeaderInfo-status\"]>span").should("contain", STATUS_TYPES_LABEL.WIP);
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
    });
  });

  context(`Verify predefined fields are displayed after saved`, () => {
    it(`Check Part to be Manufactured as ${partDocumentTitle}`, () => {
      cy.get(`[data-cy="lhr-selected-part"]`).should("have.value", "PRT-00005 - rev 1 - Part document");
    });

    it("Check 'Build Type' selected as R&D", () => {
      cy.get("[name=\"lhr-build-type\"]").first().should("have.value", "R&D");
    });

    it("Check 'Initial Quantity' as 1.5e-8", () => {
      cy.get(`[name="lhr_initial_quantity"]`).should("have.value", "1.5e-8");
    });

    it("Check 'End Quantity' as 150000", () => {
      cy.get(`[name="lhr-end-quantity"]`).should("have.value", "150000");
    });

    it("Verify dummy.pdf file exists", () => {
      cy.contains("dummy.pdf");
    });

    it("Verify example.json file exists", () => {
      cy.contains("example.json");
    });

    it("Verify users.csv file exists", () => {
      cy.contains("users.csv");
    });

    it("Verify test.docx file exists", () => {
      cy.contains("test.docx");
    });

    it("Verify video.mp4 file exists", () => {
      cy.contains("video.mp4");
    });

    it("Verify image.jpg file exists", () => {
      cy.contains("image.jpg");
    });

    it("Remove attachment image.jpg", () => {
      cy.atchRemoveAttachment({ fileName: "image.jpg" });
    });

    it("Verify image.jpg file does not exist", () => {
      cy.get("#sm-tabpanel-0").should("not.contain", "image.jpg");
    });

    it("Upload test_image.jpg files", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify test_image.jpg file exists", () => {
      cy.contains("test_image.jpg");
    });

    it("Add approver", () => {
      cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Approve and released paper LHR", () => {
    it("Submit for approval", () => {
      cy.lhrSubmitForApproval();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and Release document", () => {
      cy.ebApprove();
    });
  });

  context(`Verify paper LHR status as ${STATUS_TYPES_LABEL.RELEASED} and verify sub-title contains RD`, () => {
    it(`Check doc in ${STATUS_TYPES_LABEL.RELEASED} status and subtitle contains LOT#YYMMDDXX`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("div[data-cy=\"HeaderInfo-status\"]>span").should("contain", STATUS_TYPES_LABEL.RELEASED);
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
    });
  });

  context(`Revise paper LHR`, () => {
    it(`Navigate to LHR`, () => {
      cy.navigToLHR();
    });

    it("Filter 'Paper LHR' document", () => {
      cy.lhrClearFilters();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Veirfy the number of documents", () => {
      cy.lhrVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter document by status", () => {
      cy.lhrVerifyFilterByStatus({ status: "Released" });
    });

    it("Filter document by owner", () => {
      cy.lhrFilterByOwner({ owner: USERS[1].name });
    });

    it("Click on first document and open it", () => {
      cy.lhrSelectFirstDocument();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Change End Quantity field value to 3.0e6", () => {
      cy.get(`[name="lhr-end-quantity"]`).clear();
      cy.get(`[name="lhr-end-quantity"]`).arrowType("3.0e6");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("LHR Step does not appear in paper LHR", () => {
      cy.get("[data-cy*='LHR Step']").should("not.exist");
    });

    it("Add approver", () => {
      cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
    });
  });

  context("Approve and released paper LHR", () => {
    it("Submit for approval", () => {
      cy.lhrSubmitForApproval();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and Release document", () => {
      cy.ebApprove();
    });

    it(`Check doc in ${STATUS_TYPES_LABEL.RELEASED} status and subtitle contains same lot number`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("div[data-cy=\"HeaderInfo-status\"]>span").should("contain", STATUS_TYPES_LABEL.RELEASED);
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
    });
  });

  context(`Navigate LHR and Check landing page data`, () => {
    it(`Navigate to LHR`, () => {
      cy.navigToLHR();
    });

    it("Filter 'Paper LHR' document", () => {
      cy.lhrClearFilters();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify 'Lot #'", () => {
      cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}01RD` });
    });

    it("Veirfy the number of documents", () => {
      cy.lhrVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter document by status", () => {
      cy.lhrVerifyFilterByStatus({ status: "Released" });
    });

    it("Verify 'Owner'", () => {
      cy.lhrVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify 'Part number/rev'", () => {
      cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00005.1 Part document` });
    });

    it("Verify 'Start Quantily' as 1.5e-8", () => {
      cy.lhrVerifyFilterByStartQuantity({ quantity: `1.5e-8` });
    });

    it("Verify 'End Quantily' as 3000000", () => {
      cy.lhrVerifyFilterByEndQuantity({ quantity: `3000000` });
    });

    it("Verify 'Template'", () => {
      cy.lhrVerifyFilterByTemplate({ template: `FM-00003` });
    });

    it("Verify 'ID'", () => {
      cy.lhrVerifyFilterById({ id: `LHR-00001` });
    });
  });

  context(`Navigate to LOT and verify lot number is same as in Paper LHR`, () => {
    it(`Navigate to Lots`, () => {
      cy.navigToLots();
    });

    it("Clear Filter", () => {
      cy.lhrClearFilters();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify Lot #${lotIdRef}01RD`, () => {
      cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}01RD` });
    });

    it("Veirfy the number of documents is one", () => {
      cy.lhrVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter document by status as 'Accepted'", () => {
      cy.lhrVerifyFilterByStatus({ status: "Accepted" });
    });

    it("Verify 'Template' as 'FM-00002'", () => {
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "FM-00002");
    });
  });
});

export { };


