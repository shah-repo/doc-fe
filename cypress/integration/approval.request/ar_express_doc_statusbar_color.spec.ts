// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;
let developersGroup;

context("Status Bar of New Enlil items approved via express AR", () => {
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
              {
                ...MPITestProcedureDeletable,
                documentTypeAcronym: "MPI-",
              },
              QPITest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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

    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
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
              name: "Equipment one",
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

    it("[API]Create material one", () => {
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
          name: "Material one",
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
  });


  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create MPI document", () => {
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
      SystemRequirement("REQ-3040");
      cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.get("[data-cy=\"options\"]").arrowType("1{enter}" );
      cy.get("[data-cy=\"options\"]").arrowType("2{enter}" );
      cy.get("[data-cy=\"options\"]").arrowType("3{enter}" );
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbAddNewFieldButton();
    });

    it("Add Hyperlink", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbAddNewFieldButton();
    });

    it("Add Select Field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Paragraph", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph");
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbAddNewFieldButton();
      cy.elUploadAttachment({ fileName: "TestTemplate.json", el: "fb-attachment-field-fb-blank-template-" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
    });

    it("Add Timer", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
      cy.fbAddNewFieldButton();
    });
  });

  context("Fill step #1", () => {
    it("Fill step #1 description", () => {
      cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
    });

    it("Add 'Material one' to step #1", () => {
      cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
    });

    it("Add 'Material parameter' to step #1", () => {
      SystemRequirement("REQ-3620");
      const params = { numbOfStep: 1, material: "Parameter for material two" };

      cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"title\"]").arrowType(params.material, { force: true });
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Equipment one' to step #1", () => {
      cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
    });

    it("Add 'Equipment parameter' to step #1", () => {
      SystemRequirement("REQ-3620");
      cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
    });
  });

  context("Click save document and verify DRAFT Statusbar items", () => {
    it("Click save document", () => {
      SystemRequirement("REQ-3120");
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });
    });

    it("Verify user1 DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListMPI-00002 Rev 1DRAFT`,
        breadcrump: true,
      });
    });

    it(`Verify 'Last saved' exist in statusbar with time-duration`, () => {
      cy.verifyLastSavedExists();
    });

    it(`Click on 3 dots and verify 'Void' option exists`, () => {
      SystemRequirement("REQ-2800");
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"void-button\"]").should("be.visible");
      cy.get("[data-cy=\"void-button\"]").arrowClick();
      cy.get("button[data-cy=\"AlertDialog-cancelButton\"]").arrowClick();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it("Check if 'Send To Email' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it("Scroll down to the bottom of the page", () => {
      cy.get("[data-cy='form-options-text']").scrollIntoView();
    });

    it(`Verify statusbar conataining DRAFT is still visible`, () => {
      cy.get("div[data-cy=\"HeaderInfo-status\"]").should("be.visible");
    });

    it(`Verify DRAFT statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
    });
  });

  context("Click on save button and check for 'Last saved' exists in statusbar", () => {
    it(`Change document description as 'Change description'`, () => {
      cy.drEnterDocumentDescription({ description: "Change description" });
    });

    it("Click on Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it(`Verify again user1 'Last saved' exist in statusbar with time-duration`, () => {
      cy.verifyLastSavedExists();
    });
  });

  context("Login as user2 and check for 'Last saved' exists in statusbar with time duration", () => {
    it("Logout and login", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter PART ID as MPI-00002 and open it", () => {
      cy.dlClearFilters();
      cy.get(`td[data-grid-col-index="0"]`).contains("MPI-00002").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListMPI-00002 Rev 1DRAFT`,
        breadcrump: true,
      });
    });

    it(`Verify 'Last saved' exist in statusbar with time-duration`, () => {
      cy.verifyLastSavedExists();
    });
  });

  context("Login back to user1 Release MPI and check RELEASED status", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify filter for PART ID as MPI-00002 and open it", () => {
      cy.dlClearFilters();
      cy.get(`td[data-grid-col-index="0"]`).contains("MPI-00002").arrowClick();
    });

    it("Approve and release MPI document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Check MPI doc released status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });
    });
  });

  context("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
    it("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListMPI-00002 Rev 1RELEASED`,
        breadcrump: true,
      });
    });

    it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
    });

    it(`Verify 'Revise Document' exists in statusbar`, () => {
      cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
    });

    it(`Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it(`Verify 'Change Owner' exists in statusbar`, () => {
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
    });

    it(`Verify 'Last saved: ' does not exist in Released statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });
  });

  context("Click on the AR ID link and verify AR opens in new tab", () => {
    it(`Click on the AR ID link`, () => {
      cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").invoke("removeAttr", "target").click();
    });

    it(`Verify AR opens in a new tab`, () => {
      cy.url().should("include", "/preview");
      cy.go("back");
    });
  });

  context("Click on 'Revise Document' 'Save' and 'Approve and Release'", () => {
    it("Click on 'Revise document'", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Open the Superseded revision and check the content of the status bar", () => {
    it("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListMPI-00002 Rev 2RELEASED`,
        breadcrump: true,
      });
    });

    it(`Verify 'Revise Document' exists in statusbar`, () => {
      cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
    });

    it(`Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it(`Verify 'Change Owner' exists in statusbar`, () => {
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
    });

    it(`Verify 'Last saved' does not exist in Released statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
    });
  });

  context("Click on 'Revise Document' again select 'Obsolete' Approve and release document", () => {
    it("Click on 'Revise document'", () => {
      cy.drClickReviseDocument();
    });

    it("Select 'Obsolete' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
    it("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListMPI-00002 Rev OBSOBSOLETE`,
        breadcrump: true,
      });
    });

    it(`Verify 'Revise Document' does not exists in statusbar`, () => {
      cy.contains("[data-cy=\"updateRecord\"]").should("not.be.exist");
    });

    it(`Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it(`Verify 'Change Owner' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
    });

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
    });
  });

  context("Create a Form in DRAFT state", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Bulk create form'", () => {
      cy.drEnterDocumentTitle({ name: "Bulk create form" });
    });

    it("Enter description 'Bulk create form description'", () => {
      cy.drEnterDocumentDescription({ description: "Bulk create form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context(`Click on 'Void' and verify document status as VOIDED`, () => {
    it(`Click 'Void' and 'Yes, Im sure'`, () => {
      SystemRequirement("REQ-2800");
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"void-button\"]").arrowClick();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").contains("Yes, I'm sure").arrowClick();
    });

    it(`Check doc status as ${STATUS_TYPES_LABEL.VOIDED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.VOIDED });
      cy.arCheckTitleInEditableAndMatches({ name: "Void" });
    });
  });

  context(`Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
    it("Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document ListFM-00003 Rev 1VOIDED`,
        breadcrump: true,
      });
    });

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it("Check if 'Send To Email' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick({ force: true });
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it(`Verify VOIDED statusbar background-color as RED(${Colors.latest_red_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
    });
  });
});

export { };

