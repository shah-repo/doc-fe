// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "./../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let RDdocumentType;

context("Record inline Flow", () => {
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
              RecordOne,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record one");
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
  });

  context("[API]Update record document type", () => {
    it("Change fields config in record document type", () => {
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        id: RDdocumentType[0].id,
        payload: {
          fieldsConfig: {
            D: {
              visible: false,
              required: false,
            },
            E: {
              label: "Record Type",
              visible: true,
              required: true,
            },
            F: {
              label: "Record ID",
              visible: false,
              required: true,
            },
            G: {
              visible: false,
              required: false,
            },
            I: {
              visible: false,
            },
            J: {
              visible: false,
            },
            K: {
              label: "Void",
              visible: true,
            },
            L: {
              label: "Correction",
              visible: true,
            },
            N: {
              label: "Finalize and Release",
              visible: true,
            },
            O: {
              label: "Record History",
              visible: true,
            },
            R: {
              visible: false,
            },
            S: {
              label: "Update Record",
              visible: true,
            },
            A1: {
              label: "WIP",
              visible: true,
            },
            A2: {
              label: "Voided",
              visible: true,
            },
            A3: {
              label: "Archive",
              visible: true,
            },
            P1: {
              label: "WIP",
              visible: true,
            },
            P2: {
              label: "Voided",
              visible: true,
            },
            P3: {
              label: "Archive",
              visible: true,
            },
          },
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("FORM document creation flow for migration", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Migration form title" });
      });

      it("Enter description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield for inline1" });
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

      it("Add radio button field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "Radio group" });
        cy.fbGroupOptions("R1", "R2");
        cy.fbAddNewFieldButton();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Inline field2" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });
    });

    context("Release document", () => {
      it("Approve and release document", () => {
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

    context("Verify Predefiend fields and tabs", () => {
      it("Verify form open to overview tab default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify Predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
      });

      it("Verify Tabs are fixed and order not changable", () => {
        cy.verifyFixedTab();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Inline Form Document Revision" });
      });

      it("Enter description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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

      it("Verify Overview Tab Selected by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");
        cy.verifyPredefiendFields();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Verify form option exist in detail Tab", () => {
        cy.drSelectDetailsTab();
        cy.get(".formOptionsBox").should("exist");
      });

      it("Add textfield", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Textfield for inline1" });
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

      it("Add radio button field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "Radio group" });
        cy.fbGroupOptions("R1", "R2");
        cy.fbAddNewFieldButton();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Inline field2" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Navigate to overview", () => {
        cy.drSelectOverviewTab();
      });
    });

    context("Create document", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Verify Overview  Tab", () => {
      it("Verify form open to overview tab default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify Predefiend fields up to attachment", () => {
        cy.verifyPredefiendFields();
        cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
      });

      it("Verify it contains approval block", () => {
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
      });

      it("Verify The top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.DRAFT,
          title: "Document List",
          docId: "FM-00003",
          revision: "Rev 1",
        });
      });

      it("Verify form option", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      });

      it("Verify Added fields are exist in detail tab or not", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        cy.get("[data-cy^='textfield-for-inline'] input").should("exist");
        cy.get("[data-cy='Radio group']").should("exist");
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify add field button exist in detail tab", () => {
        cy.get("[data-cy='form.builder.add.field']").should("exist");
      });

      it("Verify that Form Options should appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });
    });

    context("Release document", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and choose 'Record one'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.get("[data-cy=\"field-selectType\"]").arrowClick().wait(2000);
      cy.get("div[id^=react-select]").contains("Record one").arrowClick().wait(2000);
    });

    it("Select the form", () => {
      cy.get("[data-cy='field-selectForm']").arrowClick();
      cy.get("[id^='react-select']").eq(1).autocompleteSelect("Inline Form Document Revision");
    });

    it("Verify record is created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.WIP,
        title: "Records",
        docId: "RD-00004",
        revision: "Rev 1",
      });
    });

    context("Verify Layout After record creation", () => {
      it("Verify Overview Tab open by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify overview tab field and attachment", () => {
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("#AttachmentFieldPresenter-field").should("exist");
      });

      it("Verify it  should not contains approval block", () => {
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("not.exist");
      });

      it("Verify Predefiend Tabs Exist", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify Tabs are fixed and order not changable", () => {
        cy.verifyFixedTab();
      });

      it("Verify that Form Options should appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      context("Verify Overview  Tab", () => {
        it("Verify Header Info", () => {
          cy.verifyHeaderInfoContent({
            status: STATUS_TYPES_LABEL.WIP,
            title: "Records",
            docId: "RD-00004",
            revision: "Rev 1",
          });
        });

        it("Navigate to details Tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify Added fields are exist in detail tab or not", () => {
          cy.get(`input[type="checkbox"][value="1"]`).should("exist");
          cy.get("[data-cy^='textfield-for-inline'] input").should("exist");
          cy.get("[data-cy='Radio group']").should("exist");
          cy.get(".formOptionsBox").should("exist");
        });

        it("Clicking on details Tab other tabs should be closed and details tab should open", () => {
          cy.drSelectDetailsTab();
          cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
          cy.get("#sm-tabpanel-0").should("be.hidden");
          cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
        });

        it("Verify that Form Options should appear for this tab ", () => {
          cy.get(".formOptionsBox").should("exist");
        });
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Select approver for first inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[name*='fb-ia-inline-field'] input")
              .autocompleteSelect(`${USERS[2].name}`, { force: true });
          });
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Radio option R1 checked", () => {
        cy.get(`input[type="radio"][value="R1"]`).last().check();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.get("[data-cy^='textfield-for-inline'] input").arrowType("First entry");
        cy.unClick();
      });

      it("Click on Save", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Validate Right Side Panel", () => {
      it("Verify expand collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify  it is fixed as the user scrolls up or down", () => {
        cy.get("#SMBodyTmpl").scrollTo("top", { ensureScrollable: false });
        cy.get("[data-cy='References']").should("be.visible");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[2], formId: "FM-00003", shortName: "HB" });
      });

      it("Verify References selection Add Remove", () => {
        const docId = "FM-00001";
        cy.get("[data-cy='referenceTo']").arrowClick();
        cy.get("[data-cy='referenceTo'] input").arrowType(docId);
        cy.wait(2000);
        cy.contains(docId).arrowClick();
        cy.wait(2000);
        cy.drRemoveReferences({ reference: docId });
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
      });

      context("Verify Revision", () => {
        it("open revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("1");
        });
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

        it("Click on Save", () => {
          cy.drClickCreateDocumentWithoutApiCall();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Check document history", () => {
        const groupOne = "Developers";
        const history = [
          {
            owner: USERS[2].name,
            actions: [
              { key: "Access granted to group", value: `Developers` },
            ],
          },
          {
            owner: USERS[2].name,
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

      context("Verify book mark", () => {
        it("Verify Book Mark Navigation", () => {
          cy.drSelectBookmarksTab();
          cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
        });
      });
      // verify/ uncomment below block  after ENC-13023 fix
      // xcontext("Verify form migration", () => {
      //   it("Verify migrate form button is visible", () => {
      //     cy.get("[data-cy=references-icon]").arrowClick();
      //     cy.get("[data-cy='common.form.migration']").should("be.visible");
      //   });

      //   it("Click on migrate form button", () => {
      //     cy.get("[data-cy='common.form.migration']").arrowClick();
      //   });

      //   it("Select form to be migrated", () => {
      //     cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
      //     cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
      //   });

      //   xit(" Approvals Select form to be migrated", () => {
      //     cy.get("[data-cy^='field-fb-approvals']" ).arrowClick();
      //     cy.get("[id^='react-select']").eq(1).autocompleteSelect("form.builder.approvals");
      //   });

      //   it("Mapped text field", () => {
      //     cy.get("[data-cy^='field-textfield-for-inline-1']" ).arrowClick();
      //     cy.get("[id^='react-select']").eq(2).autocompleteSelect("Textfield for inline1");
      //   });

      //   it("Mapped checkbox", () => {
      //     cy.get("[data-cy^='field-checkbox']" ).arrowClick();
      //     cy.get("[id^='react-select']").eq(3).autocompleteSelect("checkbox");
      //   });

      //   it("Mapped TEXT FIELD", () => {
      //     cy.get("[data-cy^='field-radio-group']" ).arrowClick();
      //     cy.get("[id^='react-select']").eq(4).autocompleteSelect("Radio group");
      //   });

      //   it("Mapped in line approval field", () => {
      //     cy.get("[data-cy^='field-inline-field-2']" ).arrowClick();
      //     cy.get("[id^='react-select']").eq(5).autocompleteSelect("Inline field2");
      //   });

      //   it("Click on confirm change", () => {
      //     cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
      //   });

      //   it("Navigate to details tab", () => {
      //     cy.drSelectDetailsTab();
      //   });

      //   it("Verify the existing field after migration", () => {
      //     cy.get(`input[type="checkbox"][value="1"]`).should("be.checked");
      //     cy.get(`input[type="radio"][value="R1"]`).should("be.checked");
      //   });

      //   it("Verify Reference tab form info should have id 'FM-00002'", () => {
      //     cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      //   });
      // });
    });

    context("Verify revision history", () => {
      it("Click on revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get("[data-cy='Revision History']").should("be.visible");
      });
    });

    context("Verify all fields displayed in overview detail tab", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify overview tab field and attachment", () => {
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("#AttachmentFieldPresenter-field").should("exist");
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify it  should not contains approval block", () => {
        cy.get("[data-cy^='fb-approvals-fb-approvals']").should("not.exist");
      });

      it("Navigate to details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify Added fields are exist in detail tab or not", () => {
        cy.get("[data-cy^='fb-ia-inline-field-2']").should("exist");
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        cy.get("[data-cy^='textfield-for-inline'] input").should("exist");
        cy.get("[data-cy='Radio group']").should("exist");
        cy.get(".formOptionsBox").should("exist");
      });
    });

    context("Verify Scroll and training", () => {
      it("Navigate to history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Click and drag the scroll bar and verify that user can scroll history tab", () => {
        cy.get("[data-cy='History-detail']").realHover().wait(2000).scrollTo("bottom", { ensureScrollable: false });
      });

      it("Verify Training Required is unchecked, there should be no Training Tab", () => {
        cy.get("[data-cy='tabId.training]").should("not.exist");
      });
    });

    context("Approve Inline Approval", () => {
      it("Approve first Inline Approval", () => {
        cy.drSelectDetailsTab();
        cy.listLoadingElementShouldNotExist();
        cy.get("button[data-cy='fb-control-btn']").first().contains("Approve").first().arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.PostApprovalsApprove,
          CyRoutes.SessionDetails,
          CyRoutes.GetRequiredApproversDocRev,
        ], () => {
          cy.get("[data-cy='common.confirm']").arrowClick();
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Approve and Release document", () => {
        it("Approve and release it", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
          cy.wrapWithWaitOnApiCalls([ CyRoutes.ReleaseDocRevWithoutAr ],
            () => {
              cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick({ force: true });
            });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Revise record / update record ", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy='updateRecord']").click();
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Navigate to Overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Approval block should be displayed in the Overview tab", () => {
          cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[2].name}`);
          cy.get("[data-cy^='fb-approvals-fb-approvals']").should("exist");
          cy.get("[data-cy='ApproveAndRelease-button']").arrowClick();
        });

        it("Approve first Inline Approval", () => {
          cy.get("[data-cy='fb-control-btn']").contains("Approve").first().arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.get("input[name='password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.wrapWithWaitOnApiCalls([
            CyRoutes.PostApprovalsApprove,
            CyRoutes.GetRequiredApproversDocRev,
            CyRoutes.SessionDetails], () => {
            cy.get("[data-cy='common.confirm']").arrowClick();
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.checkToastMessage({ exists: false });
        });
      });
    });
  });

  context("Validate Released Record", () => {
    it("Navigate to Records", () => {
      cy.navigToDocumentList();
      cy.navigToRecords();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.contains("Released").arrowClick();
    });

    it("Verify Predefined Fields", () => {
      cy.get("[data-cy='field-name']").should("exist");
    });

    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify Form opens to the “Overview” tab by default had a Approval block", () => {
      cy.isTabActive({ name: "overview", index: 0 });
      cy.get("[data-cy^='fb-approvals-fb-approvals-']").should("exist");
    });

    it("Verify Header Info", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.RELEASED,
        title: "Records",
        docId: "RD-00004",
        revision: "Rev A.1",
      });
    });

    it("Click Details Tab, clicking on it should open that tab and close the other one", () => {
      cy.drSelectDetailsTab();
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
    });

    it("Verify that Details tab contains FB fields then Form Options should appear for this tab", () => {
      cy.get(".formOptionsBox").should("exist");
      cy.get("[data-cy='Checkbox']").should("be.visible");
    });

    it("Verify that right side panel opens by default to the References tab and that", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify Right side Pannel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference Tab", () => {
      cy.verifyReferenceTab({ user: USERS[2], formId: "", shortName: "HB" });
    });

    it("Verify Book Mark Navigation", () => {
      cy.drSelectBookmarksTab();
      cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
    });

    it("Click on approval block user should be navigated to the section", () => {
      cy.get("[data-cy='Bookmarks-detail'] p").eq(0).arrowClick();
      cy.get("[data-cy^='fb-approvals']").should("be.visible");
    });
  });
});

export { };


