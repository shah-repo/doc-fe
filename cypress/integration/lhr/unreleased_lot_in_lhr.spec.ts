// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;
let secondEmployee;
const currentDate = moment().tz("America/Los_Angeles").format("YYMMDD");

context("Unreleased LOT in LHR", () => {
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
            companyAdminEmail: USERS[5].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[5].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[5].email,
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
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[5], employeeId: adminEmployee.id });
    });
  });

  context("Create Part form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the Part attributes", () => {
      it("Enter title Part document", () => {
        cy.drEnterDocumentTitle({ name: "Part Form" });
      });

      it("Enter description 'Part document description'", () => {
        cy.drEnterDocumentDescription({ description: "Part document description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lots' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Parts" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      context("Release Parts", () => {
        it("Approve and release Lots document", () => {
          cy.drApproveAndReleaseDialog();
          cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });
      });
    });
  });

  context("Start Part creation flow", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Click on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Enter title 'Part document'", () => {
      cy.drEnterDocumentTitle({ name: "Part document" });
    });

    it("Enter description 'Test Part description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Part description" });
      cy.saveBarShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    context("Release Part", () => {
      it("Approve and release Part document", () => {
        cy.drApproveAndReleaseDialog();
        cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });
    });
  });

  context("Create LOT form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the LOT attributes", () => {
      it("Enter title LOT document", () => {
        cy.drEnterDocumentTitle({ name: "LOT Form" });
      });

      it("Enter description 'LOT document description'", () => {
        cy.drEnterDocumentDescription({ description: "LOT document description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lots' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lots" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      context("Release Lots", () => {
        it("Approve and release Lots document", () => {
          cy.drApproveAndReleaseDialog();
          cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
        });
      });
    });
  });

  context("Create lot document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Click on Create new", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Lot' from the dropdown", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.get("div[id^=react-select]").contains("Lots").arrowClick();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add lot title", () => {
      cy.drEnterDocumentTitle({ name: "lot document" });
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
    });

    it("Enter Usable Quantity", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("12");
    });

    it("Select 'Part document' for Part lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"lot_part\"]").autocompleteSelect("Part document");
    });

    it("Record is in WIP status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });
  });

  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });
    });

    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Procedure Tab", () => {
        cy.drSelectProcedureTab();
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add 'Part document' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Part document", quntity: "3", unit: "Each" });
        });

        it("Save MPI document", () => {
          cy.get("[data-cy=DocumentRevisionForm-submit] > .MuiButton-label").arrowClick();
        });
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });
    });
  });

  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: "LHRt document" });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").autocompleteSelect("Part document");
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.wait(2000);
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.listLoadingElementShouldNotExist();
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(1000);
        });

        it("Save LHRT document", () => {
          cy.get("[data-cy=DocumentRevisionForm-submit] > .MuiButton-label").arrowClick();
          cy.wait(1000);
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDialog();
          cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
          cy.wait(1000);
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.drCreateNewDocumentFromForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify initial state of build type is unchecked", () => {
      cy.get("[value=\"R&D\"]").should("not.be.checked");
      cy.get("[value=\"Production\"]").should("not.be.checked");
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(3000);
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Click on Procedure", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").should("not.contain.value", `LOT #${currentDate}01`);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });

  context("Release lot document", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Search for specific LOT", () => {
      cy.get("[aria-colindex=\"1\"] > .k-filtercell > .k-filtercell-wrapper > .k-textbox")
        .arrowType(`LOT #${currentDate}01`);
    });

    it("Click on LOT", () => {
      cy.get("[data-grid-col-index=\"0\"]").arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist().wait(2000);
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[5].email });
      cy.unClick();
    });

    it("Click on approve and submit", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick({ force: true }).wait(1000);
    });

    it("Click on approve", () => {
      cy.ebApproveWithoutApi();
    });

    it("Record is in Accepted status", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.ACCEPTED });
    });
  });

  context("Update LHR", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it("Select created LHR record", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy=\"LHR Step 1 - Rev A\"] > .MuiBox-root > span").arrowClick();
    });

    it("Click View step", () => {
      cy.get(`[data-cy="form.builder.view.step"]`).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Click on Procedure", () => {
      cy.drSelectProcedureTab();
    });

    it("Click on Select from Materials", () => {
      cy.get("[data-cy=\"form.builder.select\"]").eq(0).arrowClick({ force: true });
    });

    it("Lot dialog should open", () => {
      cy.get("[data-cy=\"form.builder.lot.number\"]").should("exist");
    });

    it("Select Lot", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"usedOverride\"]").arrowType(`LOT #${currentDate}01`);
      cy.get("ul>li[role=option]").contains(`LOT #${currentDate}01`).arrowClick();
      cy.get("[data-cy=\"usedOverride\"]").should("contain.value", `LOT #${currentDate}01 | `);
    });

    it("Lot dialog should close", () => {
      cy.get("[data-cy=\"dialog-close\"]").arrowClick();
    });
  });
});


export { };
