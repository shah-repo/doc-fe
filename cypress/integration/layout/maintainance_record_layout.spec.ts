/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let equipmentDocumentType;
let formDocumentType;
let initialArDocument;
let group;
let createdEquipmentFormDocument;

context("Layout Verification of maintainance records", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    it("[API]Create Equipment form", (done: any) => {
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
              description: "<p>Maintenance and Calibration form</p>",
              document: {
                docId: "FM-00003",
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
              name: "Maintenance and calibration form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: equipmentDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-default-eq-status",
                    type: "radiogroup",
                    index: 0,
                    label: "EQ Status",
                    tabId: "overview",
                    rules: "required",
                    options: [
                      {
                        text: "Active",
                        value: "Active",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    index: 1,
                    label: "Primary Owner",
                    tabId: "specification",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    index: 2,
                    label: "Coordinator",
                    tabId: "specification",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEquipmentFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEquipmentFormDocument.id,
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
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create migration MR document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });
  context("Fill MR document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'MR document'", () => {
      cy.drEnterDocumentTitle({ name: "Migration" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "Maintenance Record  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Maintenance Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Add FB Fields and released form for migration", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Maintainance Record Textfield" });
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

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and released", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

  });

  context("Create MR form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });

  context("Fill MR document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

    it("Enter document title 'MR document'", () => {
      cy.drEnterDocumentTitle({ name: "Maintenance Record" });
    });

    it("Fill MR document description", () => {
      cy.drEnterDocumentDescription({ description: "Maintenance Record  description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Maintenance Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify Layout of document and Tabs", () => {
    it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (Draft)", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "FM-00004",
        revision: "Rev 1",
      });
    });

    it("Verify that it contains Overview, Detail", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify this row is fixed, user should not be able to add/edit new rows", () => {
      cy.verifyFixedTab();
    });

    it("Verify MR opens to the Overview tab by default", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify overview tab predefiend fields up to attachment", () => {
      cy.verifyPredefiendFields();
      cy.get("#AttachmentFieldPresenter-field").should("exist");
    });

    it("Verify approval", () => {
      cy.get("[data-cy='form.builder.approvals']").should("exist");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Add FB Fields", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Maintainance Record Textfield" });
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

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify detail tab", () => {
    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Click on details Tab, clicking on it should open that tab and close the other one", () => {
      cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
      cy.get("#sm-tabpanel-0").should("not.exist");
      cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
    });

    it("Verify EQ,Maintainer,completion date fields", () => {
      cy.get("[data-cy='equipment_id']").should("exist");
      cy.get("[data-cy='equipment_maintainer']").should("exist");
      cy.get("[name='fb-equipment_due_date']").should("exist");
    });

    it("Verify Add field button Exist in detail tab", () => {
      cy.get("[data-cy='form.builder.add.field']").should("exist");
    });

    it("Verify added FB Field Checked chebox", () => {
      cy.get(`input[type="checkbox"][value="1"]`).should("exist");
    });

    it("Verify added FB Field  textfield", () => {
      cy.get("[name^='maintainance-record-textfield']").should("exist");
    });

    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy='References']").should("exist");
      cy.get("[data-cy='generalInfo']").should("be.visible");
    });

    it("Verify that Form Options should  appear for this tab ", () => {
      cy.get(".formOptionsBox").should("exist");
    });
  });

  context("Release MR Form", () => {
    it("Approve and release  document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
    });
  });

  context("Navigate to EQ landing page and initiate new EQ", () => {
    it("Navigate to Equipment tab", () => {
      cy.navigToEquipment();
    });

    it("Click on Add New Equipment button", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify equipment is created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Equipment",
        docId: "EQ-00001",
        revision: "Rev 1",
      });
    });
  });

  context("Fill the equipent document", () => {
    it("Navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Fill the record details'", () => {
      cy.drEnterDocumentTitle({ name: "New Equipment Title" });
    });

    it("Fill the Description details'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Fill the Eq status'", () => {
      cy.get("[name='fb-default-eq-status']").eq(0).arrowClick().wait(2000);
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on Save", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Add Cal", () => {
      cy.get("button[data-cy='form.builder.add.field']").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "Calibration" });
      cy.get("input[value='calibration']").arrowClick();
      cy.fbAddField();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist().wait(2000);
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy='fb-primary-owner-eq']").autocompleteSelect(USERS[1].name);
    });

    it(`Select '${USERS[2].name}' for Coordinator`, () => {
      cy.get("input[data-cy='fb-coordinator-eq']").autocompleteSelect(USERS[2].name);
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value='Yes']").eq(0).arrowClick({ force: true }).wait(2000);
    });

    it("Select 'Maintenance Record' for calibration required", () => {
      cy.get("[data-cy*='preventativeForm']").autocompleteSelect("FM-00004");
    });

    it("Select calibration frequency", () => {
      cy.get("[name*='frequency']").eq(0).arrowType(`5`);
    });

    it("Type calibration maintenance instruction", () => {
      cy.get("[data-cy^='calibration']>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("Instructions for calibration");
      cy.unClick();
    });

    it("Click on Save", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and released", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Verify Button 'New Cal' should be visible", () => {
      cy.get("[data-cy='form.builder.new.calibration']").should("be.visible");
    });
  });

  context("Create a required document from release form Verify the layout and Release It", () => {
    context("Click on new Cal", () => {
      it("Click on New CAL", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
        cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
        cy.wait("@response").then((res) => {
          if (res.response) {
            const response = res.response.body;
            const calDocId = response.documentId;
            const calId = response.id;
            const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
            cy.visit(newUrl);
            cy.listLoadingElementShouldExist();
            cy.progressBarShouldNotExist();
          }
        });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify Cal is created in Alfa revision", () => {
        cy.get("[data-cy='HeaderInfo-Rev']").should("have.text", "Rev A");
      });
    });

    context("Verify Layout of document and Tabs", () => {
      it("Verify The top left of the page displays: Icon and type, ID, Rev stage, status (WIP)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "Records",
          docId: "MR-00001",
          revision: "Rev A",
        });
      });

      it("Verify that it contains Overview, details tab", () => {
        cy.verifyTabs("overview", "details");
      });

      it("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        cy.verifyFixedTab();
      });

      it("Verify MR opens to the Overview tab by default", () => {
        cy.isTabActive({ name: "overview", index: 0 });
      });

      it("Verify overview tab predefiend fields up to attachment", () => {
        cy.get("[data-cy='field-name']").should("exist");
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("#AttachmentFieldPresenter-field").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });
    });

    context("Verify Detail tab", () => {
      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify Click detail Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.overview']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("not.exist");
        cy.get("[data-cy='tabCon-tabId.details']").should("have.attr", "aria-selected", "true");
      });

      it("Verify schema field EQ,Maintainer,completion date fields", () => {
        cy.get("[data-cy='equipment_id']").should("exist");
        cy.get("[data-cy='equipment_maintainer']").should("exist");
        cy.get("[name='fb-equipment_due_date']").should("exist");
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify add FB Field  textfield", () => {
        cy.get("[name^='maintainance-record-textfield']").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });
    });

    context("Fill the form", () => {
      it("Fill the record details'", () => {
        cy.drEnterDocumentTitle({ name: "MR Test title" });
        cy.listLoadingElementShouldExist();
        cy.progressBarShouldNotExist();
      });

      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist().wait(500);
      });

      it("fill EQ,Maintainer,completion date fields", () => {
        cy.get("[data-cy='equipment_id']").autocompleteSelect("EQ-00001");
        cy.get("[data-cy='equipment_maintainer']").autocompleteSelect(USERS[1].name);
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Save the detail", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Fill 'Completion Date'", () => {
        const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
        cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();
            if (dayOfTheMonth.toString() === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
        cy.progressBarShouldNotExist();
      });

      it("Verify add FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
        cy.get(`input[type="checkbox"][value="1"]`).check();
        cy.progressBarShouldNotExist();
        cy.wait(1000);
      });

      it("Verify add FB Field textfield", () => {
        cy.get("[name^='maintainance-record-textfield']").should("exist");
        cy.get("[name^='maintainance-record-textfield']").arrowType("Test");
        cy.unClick();
        cy.progressBarShouldNotExist();
      });

      it("Select Approval", () => {
        cy.drSelectOverviewTab();
        cy.progressBarShouldNotExist();
        cy.wait(3000);
        cy.ebAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      });
    });


    context("Validate Right Side Panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Verify it is fixed when user scroll", () => {
        cy.get("[data-cy='generalInfo'").scrollTo("top", { ensureScrollable: false });
        cy.get("[data-cy='References'").should("be.visible");
      });

      it("Verify Right side pannel Expand and collapse", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify Eye Icon", () => {
        cy.get("[data-cy='references-icon']").should("exist");
      });

      it("Verify Reference tab Info", () => {
        cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
      });

      it("Verify References selection Add Remove", () => {
        const docId = "FM-00001";
        cy.verifyAddRemoveReference({ formId: docId });
      });

      it("Verify if the MR is Referenced by", () => {
        cy.get("[data-cy='generalInfo']").should("contain.text", "Referenced By");
        cy.contains("None").eq(0).should("exist");
      });

      it("Verify training info should be visible", () => {
        cy.get("[data-cy='training']").should("be.visible");
        cy.contains("None").should("exist");
      });

      it("Verify released date is None", () => {
        cy.get("[data-cy='releaseDate']").should("be.visible");
        cy.get("[data-cy='releaseDate']").parent().parent().should("contain.text", "None");
      });

      it("Verify form info formId,Revision, Release date", () => {
        cy.get("[data-cy='output.info']").should("be.visible");
        cy.contains("Form Info").should("be.visible");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00004");
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "1");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
        cy.verifyReferenceInfo();
        cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
        cy.get("[data-cy='common.revision']").parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });

      context("Verify Revision", () => {
        it("On click of revision Selcted revision should be open", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
          cy.progressBarShouldNotExist();
        });
      });

      context("Verify User able to add Groups or other user permissions", () => {
        it("Open permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wait(2000);
          cy.drAddUserFromPermissionTab(USERS[3].name);
          cy.progressBarShouldAppear();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add another group permission", () => {
          cy.drAddGroupFromPermissionTab("Developers");
          cy.progressBarShouldAppear();
          cy.listLoadingElementShouldNotExist();
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

        it("Verify navigation on click of 'Approvals' book mark", () => {
          cy.get("[data-cy='Bookmarks-detail']").contains("Approvals").arrowClick();
          cy.get("[data-cy='form.builder.approvals']").should("be.visible");
        });
      });

      context("Verify Revison history", () => {
        it("Verify revision icon ", () => {
          cy.get("[data-cy='cr-icon']").should("be.visible");
        });

        it("Click on revision icon history tab should open", () => {
          cy.drSelectRevisionHistoryTab();
          cy.get("[data-cy='Revision History-detail']").should("be.visible");
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
        cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
      });

      it("Mapped Maintenance Details field", () => {
        cy.get("[data-cy='field-fb-maintenance-details-section']" ).arrowClick();
        cy.get("[id^='react-select']").eq(1).autocompleteSelect("Maintenance Details");
      });

      it("Mapped MR textfield field", () => {
        cy.get("[data-cy^='field-maintainance-record-textfield']" ).arrowClick();
        cy.get("[id^='react-select']").eq(2).autocompleteSelect("Maintainance Record Textfield");
      });

      it("Mapped Equipment field", () => {
        cy.get("[data-cy='field-equipment_id']" ).arrowClick();
        cy.get("[id^='react-select']").eq(3).autocompleteSelect("Equipment");
      });

      it("Mapped Maintainer field", () => {
        cy.get("[data-cy='field-equipment_maintainer']" ).arrowClick();
        cy.get("[id^='react-select']").eq(4).autocompleteSelect("Maintainer");
      });

      it("Mapped Completion Date field", () => {
        cy.get("[data-cy='field-fb-equipment_due_date']" ).arrowClick();
        cy.get("[id^='react-select']").eq(5).autocompleteSelect("Completion Date");
      });

      it("Mapped Equipment Maintenance Section field", () => {
        cy.get("[data-cy='field-fb-requipment-maintenance-section']" ).arrowClick();
        cy.get("[id^='react-select']").eq(6).autocompleteSelect("Equipment Maintenance Section");
      });

      it("Mapped Approvals field", () => {
        cy.get("[data-cy^='field-fb-approvals']" ).arrowClick();
        cy.get("[id^='react-select']").eq(7).autocompleteSelect("form.builder.approvals");
      });

      it("Mapped checkbox field", () => {
        cy.get("[data-cy^='field-checkbox']" ).arrowClick();
        cy.get("[id^='react-select']").eq(8).autocompleteSelect("Checkbox");
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify the checkbox field data after migration", () => {
        cy.get("[value='1']").should("be.checked");
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });
    });

    context("Verify all the fields is displayed in overview and detail tab", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify overview tab predefiend fields up to attachment", () => {
        cy.get("[data-cy='field-name']").should("exist");
        cy.get("[data-cy='select.document.documentType.id']").should("exist");
        cy.get("#AttachmentFieldPresenter-field").should("exist");
      });

      it("Verify approval", () => {
        cy.get("[data-cy='form.builder.approvals']").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify detail tab  EQ Id ,Maintainer,completion date fields", () => {
        cy.get("[data-cy='equipment_id']").should("exist");
        cy.get("[data-cy='equipment_maintainer']").should("exist");
        cy.get("[name='fb-equipment_due_date']").should("exist");
      });

      it("Verify added FB Field Checked chebox", () => {
        cy.get(`input[type="checkbox"][value="1"]`).should("exist");
      });

      it("Verify added FB Field  textfield", () => {
        cy.get("[name^='maintainance-record-textfield']").should("exist");
      });

      it("Verify that Form Options should  appear for this tab ", () => {
        cy.get(".formOptionsBox").should("exist");
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

    context("Approve and Released", () => {
      it("click for approval", () => {
        cy.get("[data-cy='ApproveAndRelease-button']").arrowClick({ force: true });
      });

      it("Approve first Inline Approval", () => {
        cy.ebApproveWithoutApi();
      });

      it("Verify document is released The top left of the page displays: status(Released)", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.RELEASED,
          title: "Records",
          docId: "MR-00001",
          revision: "Rev A",
        });
      });

      it("Verify released date from right side references tab", () => {
        cy.get("[data-cy='references-icon']").arrowClick();
        cy.get("[data-cy='releaseDate']").should("be.visible");
        cy.get("[data-cy='releaseDate']").parent().parent().should("contain.text",
          moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
      });
    });
  });
});

export { };

