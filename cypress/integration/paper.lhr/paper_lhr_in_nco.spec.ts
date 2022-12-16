/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { lotIdRef } from "../../utils/constants/dateHandler";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;
let partDocumentType;
let approvalRequestDocumentType;
let group;
let initialArDocument;
let createdPartDocument;

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const paperLhrDocType = "Paper Lot History Record";
const paperlhrTitle = "Paper LHR form";
const currentDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
const arID = "AR-00002";
const templateId = "FM-00003";
const firstLhrId = "LHR-00001";
const secondLhrId = "LHR-00002";
const fileUploadFieldTitle = "fb-fileupload";
const apiCreatedCompany: any = {
  employees: [],
  documentTypes: [],
};

context("Verify Paper LHR", () => {
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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", () => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
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
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context(`Check 'Paper lhr' exist in NCO`, () => {
    context("Create form for NCO document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enters title '${ncoFormName}'`, () => {
        cy.drEnterDocumentTitle({ name: ncoFormName });
      });

      it("Enters description 'New NCO Form description'", () => {
        cy.drEnterDocumentDescription({ description: "New NCO Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'New Company Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("'Approve and Release' the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create NCO document from Form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select released NCO Form", () => {
        cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
      });

      it("Create new document from form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enters title 'New Company'", () => {
        cy.drEnterDocumentTitle({ name: "New Company" });
      });

      it("Enters description 'New Company description'", () => {
        cy.drEnterDocumentDescription({ description: "New Company description" });
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it(`Enters company name '${newCompanyName}'`, () => {
        cy.get("[name^=company-name-]").arrowType(newCompanyName);
      });

      it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
        cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
      });

      it(`Enters company email '${USERS[11].email}'`, () => {
        cy.get("[name^=company-admin-email-]").arrowType(USERS[11].email);
      });

      it("Select 'Yes' for 'Approved DAM json is used'", () => {
        cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
      });

      it("Upload correct DAM JSON", () => {
        cy.atchUploadDOMJSONForNCO({ fileName: "dam_lhr_paper.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Page Details json is used'", () => {
        cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
      });

      it("Upload Page Details JSON", () => {
        cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Navigation json is used'", () => {
        cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
      });

      it("Upload Navigation JSON", () => {
        cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
      });

      it("Upload Users List JSON", () => {
        cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and release document - create company", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Log out user", () => {
        cy.authLogout();
      });
    });

    context("Login user", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[11].email,
        });
      });

      it("Intercept APIs", () => {
        cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              apiCreatedCompany.employees = response.employees;
              createdCompany = response;
              adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
            }
          });
        }).as("response");

        cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              apiCreatedCompany.documentTypes = res.body;
              partDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Component Specification");
              approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Approval Request");
            }
          });
        }).as("response1");

        cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              loginResponse = res.body;
            }
          });
        }).as("response2");

        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
        cy.wait("@response");
        cy.wait("@response1");
        cy.wait("@response2");
      });

      it("[API]Create part document", (done: any) => {
        cy.grpGetGroupByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          groupName: "All Users",
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
    });

    context("Navigate to Document Type Management and check 'Paper lhr' exist", () => {
      it("Navigate to Document Type Management", () => {
        cy.navigToDocumentTypeManagement();
      });

      it(`Filter by document type '${paperLhrDocType}'`, () => {
        cy.dtmClearFilters();
        cy.get(`[aria-colindex="2"] input`).arrowType(paperLhrDocType);
      });

      it("Verify document type", () => {
        cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="2"]`).should("have.text", paperLhrDocType);
      });

      it(`Verify acronym for '${paperLhrDocType}'`, () => {
        cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="3"]`).should("have.text", "LHR-");
      });

      it(`Verify internal group for '${paperLhrDocType}'`, () => {
        cy.get(`[data-grid-col-index="12"]`).prev().should("have.text", "PAPER_LHR");
      });
    });

    context("Navigate to Document List and check 'Paper lhr' exist in dam document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select DAM document", () => {
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      });

      it("navigate to matrix details tab", () => {
        cy.drSelectMatrixDetailsTab();
      });

      it(`Verify '${paperLhrDocType}' have acronym 'LHR-'`, () => {
        cy.contains(paperLhrDocType).parent()
          .prev().prev().should("have.text", "LHR-");
      });

      it(`Verify '${paperLhrDocType}' have internal group 'PAPER_LHR'`, () => {
        cy.contains(paperLhrDocType).parent()
          .prev().should("have.text", "PAPER_LHR");
      });
    });
  });

  context("Create 'Paper LHR' form and validate fields", () => {
    context("Create 'Paper LHR' form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title 'New Purchase Order Form'", () => {
        cy.drEnterDocumentTitle({ name: paperlhrTitle });
      });

      it("Enter description 'New Purchase Order Form description'", () => {
        cy.drEnterDocumentDescription({ description: "Paper LHR form description" });
      });

      it("Click on 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Purchase Order' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Paper Lot History Record" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify predefined fields are displayed", () => {
      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .should("not.contain", "The Part to be Manufactured is a required field.");
      });
      it("Check 'Build Type' is displayed", () => {
        cy.get(`[data-cy="Build Type"]`).should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Build Type is a required field.");
        cy.get(`[data-cy="Build Type"]`).parent().parent().parent().parent()
          .should("contain.html", `role="radiogroup"`);
        cy.get(`[name="lhr-build-type"]`).eq(0).should("have.value", "R&D");
        cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production");
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Initial Quantity is a required field.");
      });

      it("Check 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The End Quantity is a required field.");
      });

      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Navigate to document list and check data on landing page and open it", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter Released 'Paper LHR' form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
      });

      it("Verify data on landing page", () => {
        cy.dlVerifyFilterByRev({ revision: "1" });
        cy.dlVerifyFilterByType({ type: "FM" });
        cy.dlVerifyFilterByOwner({ owner: USERS[11].name });
        cy.dlVerifyFilterByStatus({ status: "Draft" });
      });

      it("Click and open the FM", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify all data and predefined fields are present", () => {
      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .should("not.contain", "The Part to be Manufactured is a required field.");
      });
      it("Verify 'Build Type' is displayed", () => {
        cy.get("[data-cy=\"Build Type\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Build Type is a required field.");

      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context("Add fields into the form", () => {
      it("Add File Upload", () => {
        cy.fbAddNewFieldWhenHidden2ndLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Approve and release form", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      });
    });

    context("Navigate to document list and check data on landing page and open it", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter Released 'Paper LHR' form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: paperlhrTitle });
      });

      it("Verify data on landing page", () => {
        cy.dlVerifyFilterByRev({ revision: "1" });
        cy.dlVerifyFilterByType({ type: "FM" });
        cy.dlVerifyFilterByOwner({ owner: USERS[11].name });
        cy.dlVerifyFilterByStatus({ status: "Released" });
        cy.dlVerifyFilterByArId({ arId: arID });
        cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
      });

      it("Click and open the FM", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Click to revise and Verify all data and predefined fields are present", () => {
      it("Click Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .should("not.contain", "The Part to be Manufactured is a required field.");
      });

      it("Verify 'Build Type' is displayed", () => {
        cy.get("[data-cy=\"Build Type\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Build Type is a required field.");
      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get("[data-cy=\"Initial Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get("[data-cy=\"End Quantity\"]").should("exist")
          .parent().parent().parent().parent().parent()
          .should("not.contain", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });
    });

    context(`Remove ${fileUploadFieldTitle} approve and verify Released form`, () => {
      it(`Remove ${fileUploadFieldTitle}`, () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(-1).arrowClick({ force: true });
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify File Upload is not diplayed", () => {
        cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("not.exist");
      });

      it("Approve and release form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      });
    });
  });

  context("'Paper LHR' creation flow from document list", () => {
    context("Create paper LHR document from newly created form", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter form by name and status, and select it", () => {
        cy.drFilterDocListByNameAndStatus({ title: "Paper LHR form", status: "Released" });
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Verify predefined fields and FB fields are present", () => {
      it(`Verify status is ${STATUS_TYPES_LABEL.WIP}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      });

      it(`Verify lot is assigned`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}01`);
      });

      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .contains("The Part to be Manufactured is a required field.");
      });

      it("Verify 'Build Type' is displayed", () => {
        cy.get(`[data-cy="Build Type"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Build Type is a required field.");
      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get(`[data-cy="Initial Quantity"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get(`[data-cy="End Quantity"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
      });
    });

    context("Fill the document", () => {
      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get(`[data-cy="lhr-selected-part"]`).arrowType("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        });

        cy.get(`[data-cy="Part to be Manufactured"]`)
          .parent().parent().parent().parent().next("p")
          .should("not.exist");
      });

      it("Upload attachement picture 'dummy.pdf'", () => {
        cy.atchUploadAttachment({ fileName: "dummy.pdf" });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.lhrSelectBuildTypeProduction();

        cy.get(`[data-cy="Build Type"]`)
          .parent().parent().parent().parent().next("p")
          .should("not.exist");
      });

      it("Select 'R&D' build type", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.lhrChangeBuildTypeToRnd();
        });
        cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production").should("be.disabled");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Intial Quantity field value", () => {
        cy.get(`[name="lhr_initial_quantity"]`).arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter End Quantity field value", () => {
        cy.get(`[name="lhr-end-quantity"]`).arrowType("20");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}01RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `WIP` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: `10` });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: `20` });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: firstLhrId });
      });
    });

    context("Click on 'Paper LHR' document and insert the Approval", () => {
      it("Select first LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Release LHR", () => {
      it("Add approval", () => {
        cy.wait(7000);
        cy.listLoadingElementShouldNotExist();
        cy.pmAddApproverOnApproverList({ approver: USERS[11].email });
      });

      it("Click save document", () => {
        cy.wait(2000);
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.lhrApprove();
      });

      it(`Verify lot is same as earlier release`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}01RD`);
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}01RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `Released` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Completion date'", () => {
        cy.lhrVerifyFilterByCompletionDate({ date: currentDate });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: "10" });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: "20" });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: firstLhrId });
      });
    });

    context("Select on 'Paper LHR' document", () => {
      it("Select first LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context(`Revise paper LHR document, make some changes and Approve`, () => {
      it("Click Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Enter End Quantity field value", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhr-end-quantity\"]").clear().arrowType("25");
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
        cy.listLoadingElementShouldNotExist();
      });

      it("Save it", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Submit for approval", () => {
        cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick({ force: true });
        cy.wait(1000);
      });

      it("Approve record", () => {
        cy.ebApprove();
      });

      it(`Verify that document status is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it(`Verify lot is same as earlier release`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}01RD`);
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify document is searchable with ID", () => {
        cy.dlClearFilters();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[aria-colindex="9"] input`).arrowType("LHR-00001").wait(500);
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}01RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `Released` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Completion date'", () => {
        cy.lhrVerifyFilterByCompletionDate({ date: currentDate });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: "10" });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: "25" });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: firstLhrId });
      });
    });
  });

  context("'Paper LHR' creation flow from 'LHR landing page'", () => {
    context("Create paper LHR document from newly created form", () => {
      it(`Click on 'Initiate new LHR'`, () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
      });

      it("Select 'Paper Lot History Record' form", () => {
        cy.get(`div[data-cy^="field-selectType"]`).click().focused()
          .arrowType("Paper Lot History Record{downarrow}{enter}", { force: true });
        cy.unClick();
      });
    });

    context("Verify predefined fields and FB fields are present", () => {
      it(`Verify status is ${STATUS_TYPES_LABEL.WIP}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      });

      it(`Verify lot is assigned`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}02`);
      });

      it(`Verify 'The Part to be Manufactured is required field' is displayed`, () => {
        cy.get(`[name="lhr-selected-part"]`).parent().parent()
          .contains("The Part to be Manufactured is a required field.");
      });

      it("Verify 'Build Type' is displayed", () => {
        cy.get(`[data-cy="Build Type"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Build Type is a required field.");
      });

      it("Verify 'Initial Quantity' is displayed", () => {
        cy.get(`[data-cy="Initial Quantity"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The Initial Quantity is a required field.");
      });

      it("Verify 'End Quantity' is displayed", () => {
        cy.get(`[data-cy="End Quantity"]`).should("exist")
          .parent().parent().parent().parent().next()
          .should("have.text", "The End Quantity is a required field.");
      });

      it("Verify 'Approvals' is displayed", () => {
        cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
      });
    });

    context("Fill the document", () => {
      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get(`[data-cy="lhr-selected-part"]`).arrowType("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        });

        cy.get(`[data-cy="Part to be Manufactured"]`)
          .parent().parent().parent().parent().next("p")
          .should("not.exist");
      });

      it("Upload attachement picture 'dummy.pdf'", () => {
        cy.atchUploadAttachment({ fileName: "dummy.pdf" });
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.lhrSelectBuildTypeProduction();

        cy.get(`[data-cy="Build Type"]`)
          .parent().parent().parent().parent().next("p")
          .should("not.exist");
      });

      it("Switch to 'R&D' build type and verify alert message", () => {
        cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").check();

        cy.get(".MuiDialogContent-root").should("have.text",
          "You are about to switch the build type from Production to R&D. Are you sure you want to make this change?");

        cy.get(".MuiDialogActions-root").find("button").should("have.length", 2);
        cy.get(`[data-cy="form.builder.lhr.build.switch"]`).should("exist");
        cy.get(`[data-cy="form.builder.cancel"]`).should("exist");

        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get(`[data-cy="form.builder.lhr.build.switch"]`).arrowClick();
        });
        cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production").should("be.disabled");
        cy.progressBarShouldNotExist();
      });

      it(`Verify system added RD in lot#`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}02RD`);
      });

      it("Enter Intial Quantity field value", () => {
        cy.get(`[name="lhr_initial_quantity"]`).arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter End Quantity field value", () => {
        cy.get(`[name="lhr-end-quantity"]`).arrowType("20");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify added attachment is present, remove it, add new one", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Select second LHR", () => {
        cy.dlClearFilters();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[aria-colindex="9"] input`).arrowType(secondLhrId).wait(500);
        cy.listLoadingElementShouldNotExist();

        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify added attachment is present", () => {
        cy.get(`[data-cy="attachment.title"]`).should("contain.text", "dummy.pdf");
      });

      it("Remove existing attachment", () => {
        cy.get(`[data-cy="attachment.title"]`).should("contain.text", "dummy.pdf")
          .parent().next().find("button").arrowClick({ force: true });
      });

      it("Verify existing attachment is removed", () => {
        cy.get(`[data-cy="attachment.title"]`).should("not.exist");
      });

      it("Upload new attachment", () => {
        cy.wait(7000);
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Verify newly added attachment is present", () => {
        cy.get(`[data-cy="attachment.title"]`).should("contain.text", "image.jpg");
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}02RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `WIP` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: `10` });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: `20` });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: secondLhrId });
      });
    });

    context("Release LHR", () => {
      it("Select second LHR", () => {
        cy.dlClearFilters();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[aria-colindex="9"] input`).arrowType(secondLhrId).wait(500);
        cy.listLoadingElementShouldNotExist();

        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.lhrApprove();
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}02RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `Released` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Completion date'", () => {
        cy.lhrVerifyFilterByCompletionDate({ date: currentDate });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: "10" });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: "20" });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: secondLhrId });
      });
    });

    context("Select on 'Paper LHR' document", () => {
      it("Select second LHR", () => {
        cy.dlClearFilters();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[aria-colindex="9"] input`).arrowType(secondLhrId).wait(500);
        cy.listLoadingElementShouldNotExist();

        cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
          cy.get("tr.k-master-row").first().arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });

    context(`Revise paper LHR document, make some changes and Approve`, () => {
      it("Click Revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Enter End Quantity field value", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhr-end-quantity\"]").clear().arrowType("25");
          cy.unClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[11].name });
        });
      });

      it("Save it", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Submit for approval", () => {
        cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick({ force: true });
      });

      it("Approve record", () => {
        cy.ebApprove();
      });

      it(`Verify that document status is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it(`Verify lot is same as earlier release`, () => {
        cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}02RD`);
      });
    });

    context("Verify 'Paper LHR' document details on LHR landing page", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Verify document is searchable with ID", () => {
        cy.dlClearFilters();
        cy.listLoadingElementShouldNotExist();
        cy.get(`[aria-colindex="9"] input`).arrowType(secondLhrId).wait(500);
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify 'Lot #'", () => {
        cy.lhrVerifyFilterByLot({ lot: `${lotIdRef}02RD` });
      });

      it("Verify 'Status'", () => {
        cy.lhrVerifyFilterByStatus({ status: `Released` });
      });

      it("Verify 'Owner'", () => {
        cy.lhrVerifyFilterByOwner({ owner: USERS[11].name });
      });

      it("Verify 'Part number/rev'", () => {
        cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document` });
      });

      it("Verify 'Completion date'", () => {
        cy.lhrVerifyFilterByCompletionDate({ date: currentDate });
      });

      it("Verify 'Start Quantily'", () => {
        cy.lhrVerifyFilterByStartQuantity({ quantity: "10" });
      });

      it("Verify 'End Quantily'", () => {
        cy.lhrVerifyFilterByEndQuantity({ quantity: "25" });
      });

      it("Verify 'Template'", () => {
        cy.lhrVerifyFilterByTemplate({ template: templateId });
      });

      it("Verify 'ID'", () => {
        cy.lhrVerifyFilterById({ id: secondLhrId });
      });
    });
  });
});

export { };

