/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../../support/commands/imap/commands";
import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { emailDateOffset, equimentDueDays, equimentDueDaysFmt, fileTimeFormat, pdfDocDraftDay, pdfDocDraftMonth, pdfDocDraftyear, pdfDocRelDate, pdfFooterDate } from "../../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPMForm;
let createdCalibrationForm;
let group;
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let formId;
let emailsFromInbox;
let arId;
let equipmentURL;
let calDocId;
let calId;

const pages = ["", "", "", ""];
const ADMIN_USER = USERS[1];
const equipmentTitle = `Equipment`;
const equipmentTitleForm = `Equipment-Form`;

context("Autocomplete 'Equipment' test", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

    it("[API]Create PM form", (done: any) => {
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
              description: "<p>PM form</p>",
              document: {
                docId: "FM-00004",
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
              name: "Preventative Maintenance form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: maintenanceRecordDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-maintenance-details-section",
                    type: "section",
                    index: 0,
                    label: "Maintenance Details",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "equipment_id",
                    type: "autocomplete",
                    index: 1,
                    label: "Equipment",
                    tabId: "details",
                    rules: "required",
                    optionId: "20",
                    placeholder: "[Select revision here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "equipment_maintainer",
                    type: "autocomplete",
                    index: 2,
                    label: "Maintainer",
                    tabId: "details",
                    rules: "required",
                    optionId: "13",
                    placeholder: "[Select name here]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-equipment_due_date",
                    type: "datepicker",
                    index: 3,
                    label: "Completion Date",
                    tabId: "details",
                    rules: "required",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-requipment-maintenance-section",
                    type: "textfield",
                    index: 4,
                    label: "Equipment Maintenance Section",
                    tabId: "details",
                    rules: "required",
                    hidden: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    deleteInFormDisabled: true,
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "overview",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-kybkhbpt",
                    uniqueSchemaItem: true,
                    index: 5,
                  },
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPMForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPMForm.id,
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

    it("[API]Create Calibration form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Calibration form</p>",
          document: {
            docId: "FM-00005",
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
          name: "Calibration form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType[0].id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                tabId: "details",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                tabId: "details",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                tabId: "details",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                tabId: "details",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "overview",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationForm.id,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Autocomplete 'Equipment' test", () => {
    context("Create 'Equipment Form'", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title " + equipmentTitleForm, () => {
        cy.drEnterDocumentTitle({ name: equipmentTitleForm });
      });

      it("Enter document description 'Equipment document description'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment Form document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Equipment' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Equipment" });
      });

      it("Click create a document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Add autocomplete of “Approvers” and set validation", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddField();
      });

      it("Add select field and set validation ", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.fbFieldRequiredIf({ name: "Autocomplete-Approvers", value: USERS[1].email });
        cy.fbAddField();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.listLoadingElementShouldNotExist();
      });

      it("Select references", () => {
        cy.drSelectReferences( "FM-00004" );
        cy.drSelectReferences( "FM-00005" );
        cy.unClick();
      });

      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("EQUIPMENT SECTIONS FOR PM", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbAddField();
      });

      it("EQUIPMENT SECTIONS FOR CAL", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
        cy.get("input[value=\"calibration\"]").arrowClick();
        cy.fbAddField();
      });

      it("Click create document", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }).as("response");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
    it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: equipmentTitleForm });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for equipment notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_draft.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-${equipmentTitleForm}.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-${equipmentTitleForm}.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(4);
        expect(cdata.text).match(/Page 1 of 4/);
        expect(cdata.text).match(/Page 2 of 4/);
        expect(cdata.text).match(/Page 3 of 4/);
        expect(cdata.text).match(/Page 4 of 4/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 4")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 4")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 4")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 4")) {
            pages[3] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nEquipment Form document description/);

        expect(el).match(/Output Document Type\nEquipment/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`EQ Status\n.*Active.*Inactive`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Primary Owner\nCoordinator\nAutocomplete-Approvers\nSelect field/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/PREVENTATIVE MAINTENANCE/);

        tmpRegex = new RegExp(`Preventative Maintenance required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/The Preventative Maintenance required\? is a required field/);

        // eslint-disable-next-line max-len
        expect(el).match(/Justifications\nThe justifications field is required when Preventative Maintenance required\? is No/);

        expect(el).match(/Preventative Maintenance Form/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`The Preventative Maintenance Form field is required when Preventative Maintenance\nrequired\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Preventative Maintenance Frequency \\(Days\\)`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`The Preventative Maintenance Frequency \\(Days\\) field is required when Preventative\nMaintenance required\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        expect(el).match(/Instructions\nThe Instructions field is required when Preventative Maintenance required\? is Yes/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/CALIBRATION/);

        tmpRegex = new RegExp(`Calibration required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/The Calibration required\? is a required field/);

        expect(el).match(/Justifications\nThe justifications field is required when Calibration required\? is No/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Calibration Form\nThe Calibration Form field is required when Calibration required\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Calibration Frequency \\(Days\\)\nThe Calibration Frequency \\(Days\\) field is required when Calibration required?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Instructions\nThe Instructions field is required when Calibration required\\?.*is.*Yes.`);
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: equipmentTitleForm });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for equipment notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_rel.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-${equipmentTitleForm}.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-${equipmentTitleForm}.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(4);
        expect(cdata.text).match(/Page 1 of 4/);
        expect(cdata.text).match(/Page 2 of 4/);
        expect(cdata.text).match(/Page 3 of 4/);
        expect(cdata.text).match(/Page 4 of 4/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 4")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 4")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 4")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 4")) {
            pages[3] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEquipment Form document description/);

        expect(el).match(/Output Document Type\nEquipment/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`EQ Status\n.*Active.*Inactive`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Primary Owner\nCoordinator\nAutocomplete-Approvers\nSelect field/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/PREVENTATIVE MAINTENANCE/);

        tmpRegex = new RegExp(`Preventative Maintenance required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/The Preventative Maintenance required\? is a required field/);

        // eslint-disable-next-line max-len
        expect(el).match(/Justifications\nThe justifications field is required when Preventative Maintenance required\? is No/);

        expect(el).match(/Preventative Maintenance Form/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`The Preventative Maintenance Form field is required when Preventative Maintenance\nrequired\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Preventative Maintenance Frequency \\(Days\\)`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`The Preventative Maintenance Frequency \\(Days\\) field is required when Preventative\nMaintenance required\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        expect(el).match(/Instructions\nThe Instructions field is required when Preventative Maintenance required\? is Yes/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/CALIBRATION/);

        tmpRegex = new RegExp(`Calibration required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/The Calibration required\? is a required field/);

        expect(el).match(/Justifications\nThe justifications field is required when Calibration required\? is No/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Calibration Form\nThe Calibration Form field is required when Calibration required\\?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Calibration Frequency \\(Days\\)\nThe Calibration Frequency \\(Days\\) field is required when Calibration required?.*is.*Yes`);
        expect(el).match(tmpRegex);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`Instructions\nThe Instructions field is required when Calibration required\\?.*is.*Yes.`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nEQUIPMENT-FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Create 'Equipment'", () => {
    it("Click create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Select references", () => {
      cy.drSelectReferences( "FM-00004" );
      cy.drSelectReferences( "FM-00005" );
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Autocomplete-Approvers", () => {
      cy.get(`input[data-cy^="autocomplete-approvers"]`).autocompleteSelect(`${USERS[2].name }`);
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").autocompleteSelect(USERS[1].name);
    });

    it(`Select '${USERS[2].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").autocompleteSelect(USERS[2].name);
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick({ force: true });
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").autocompleteSelect("Preventative Maintenance form");
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType(`${equimentDueDays}`);
      cy.unClick();
    });

    it("Type preventative maintenance instruction", () => {
      // eslint-disable-next-line max-len
      cy.get("div[data-cy^=\"preventative-maintenance-\"]:eq(-1)>div>div>div>div>div[contenteditable]").click({ force: true }).clear().arrowType("Instructions for preventative maintenance");
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick({ force: true });
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType(`${equimentDueDays}`);
    });

    it("Type calibration maintenance instruction", () => {
      // eslint-disable-next-line max-len
      cy.get("div[data-cy^=\"calibration\"]:eq(-1)>div>div>div>div>div[contenteditable]").click({ force: true }).clear().arrowType("Instructions for calibration");
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it(`Verify form ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.arCheckTitleInEditableAndMatches({ name: "Equipment document" });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Draft document notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_draft.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-Equipment-document.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-Equipment-document.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEquipment description/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`EQ Status\n.*Active.*Inactive`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Autocomplete-Approvers\n${USERS[2].name}.*@.*`, "gi");
        expect(el).match(tmpRegex);

        expect(el).not.match(/Select field/);

        tmpRegex = new RegExp(`Primary Owner\n${USERS[1].name}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Coordinator\n${USERS[2].name}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/PREVENTATIVE MAINTENANCE/);

        tmpRegex = new RegExp(`Preventative Maintenance required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Preventative Maintenance Form\nFM-00004 - rev 1 - Preventative Maintenance form/);

        tmpRegex = new RegExp(`Preventative Maintenance Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for preventative maintenance/);

        expect(el).match(/CALIBRATION/);

        tmpRegex = new RegExp(`Calibration required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Calibration Form\nFM-00005 - rev 1 - Calibration form/);

        tmpRegex = new RegExp(`Calibration Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for calibration/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context(`Verify document ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Equipment document" });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Released document notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_rel.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-Equipment-document.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-Equipment-document.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEquipment description/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`EQ Status\n.*Active.*Inactive`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Autocomplete-Approvers\n${USERS[2].name}.*@.*`, "gi");
        expect(el).match(tmpRegex);

        expect(el).not.match(/Select field/);

        tmpRegex = new RegExp(`Primary Owner\n${USERS[1].name}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Coordinator\n${USERS[2].name}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/PREVENTATIVE MAINTENANCE/);

        tmpRegex = new RegExp(`Preventative Maintenance required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Preventative Maintenance Form\nFM-00004 - rev 1 - Preventative Maintenance form/);

        tmpRegex = new RegExp(`Preventative Maintenance Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for preventative maintenance/);

        expect(el).match(/CALIBRATION/);

        tmpRegex = new RegExp(`Calibration required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Calibration Form\nFM-00005 - rev 1 - Calibration form/);

        tmpRegex = new RegExp(`Calibration Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for calibration/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Navig to released 'Equipment maintenance document'", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill new calbration form", () => {
    it("Switch to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Click 'NEW CAL' on calibration section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.calibration']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          calId = response.id;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${calId}`;
          cy.visit(newUrl);
          cy.landingPageLoadingElementShouldNotExist();
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").autocompleteSelect(ADMIN_USER.name);
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();

      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Calibration document' and approve", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(ADMIN_USER.name);
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve record", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Fill new PM form", () => {
    it("Navigate to EQ document", () => {
      cy.visit(equipmentURL);
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Click 'NEW PM' on Preventative Maintenance section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
          cy.visit(newUrl);
          cy.landingPageLoadingElementShouldNotExist();
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative Maintenance'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance" });
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Preventative Maintenance' and approve it", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(ADMIN_USER.name);
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve record", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Fill second new PM form", () => {
    it("Navigate to EQ document", () => {
      cy.visit(equipmentURL);
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Click 'NEW PM' on Preventative Maintenance section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          calDocId = response.documentId;
          const newUrl = `${CONFIG.FE_URL}/document_revision/${calDocId}/version/${response.id}`;
          cy.visit(newUrl);
          cy.landingPageLoadingElementShouldNotExist();
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Second Preventative Maintenance", () => {
      cy.drEnterDocumentTitle({ name: "Second Preventative Maintenance" });
    });

    it("Navigate to details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").autocompleteSelect(ADMIN_USER.name);
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Create 'Second Preventative Maintenance'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: false });
    });
  });

  context("Check equipment calibration history on preventative maintenance history in equipment", () => {
    it("Navig to Equipment", () => {
      cy.navigToEquipment();
    });

    it("Select 'Equipment maintenance document'", () => {
      cy.get("tr.k-master-row").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Verify history for pm", () => {
      cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "2");
      cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
    });

    it("Verify history for calibration", () => {
      cy.get("[data-cy=\"document.revision.history\"]").eq(1).should("have.text", "History");
    });
  });

  context(`Verify equipment ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Equipment document" });
      cy.drGetDocIdElementFromUI().then(($formIdElement: JQuery<HTMLElement>) => {
        formId = $formIdElement.text();
      });
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for Released document notification", () => {
    it("Get emails", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        // eslint-disable-next-line @typescript-eslint/camelcase
        wait_time_sec: 5,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_wait_time_sec: 50,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${formId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [`Hello <b>${USERS[1].name},</b>`,
            "Your documents are ready for download.",
            "<button type=\"button\">DOWNLOAD</button>",
            createdCompany.id],
        }];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify that zip file containing pdf downloaded", () => {
    SystemRequirement("REQ-4860");
    it("Download zip file", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${formId}${fileTimeFormat}_rel_history.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      });
    });

    it("Verify file size of the downloaded zip file", () => {
      const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
      cy.readFile(zipfile).its("length").should("be.gt", 500);
    });

    it("unzip and extract pdf file from zip file", () => {
      cy.unzipFile(
        {
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });
      const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
        `${formId}-1-Equipment-document.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-Equipment-document.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(3);
        expect(cdata.text).match(/Page 1 of 3/);
        expect(cdata.text).match(/Page 2 of 3/);
        expect(cdata.text).match(/Page 3 of 3/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 3")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 3")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 3")) {
            pages[2] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEquipment description/);

        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);

        tmpRegex = new RegExp(`EQ Status\n.*Active.*Inactive`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Autocomplete-Approvers\n${USERS[2].name}.*@.*`, "gi");
        expect(el).match(tmpRegex);

        expect(el).not.match(/Select field/);

        tmpRegex = new RegExp(`Primary Owner\n${USERS[1].name}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Coordinator\n${USERS[2].name}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/PREVENTATIVE MAINTENANCE/);

        tmpRegex = new RegExp(`Preventative Maintenance required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Preventative Maintenance Form\nFM-00004 - rev 1 - Preventative Maintenance form/);

        tmpRegex = new RegExp(`Preventative Maintenance Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for preventative maintenance/);

        expect(el).match(/History/);
        // eslint-disable-next-line @typescript-eslint/camelcase
        tmpRegex = new RegExp( `MR-00003 Second Preventative Maintenance \\| ${USERS[1].name} \\| DRAFT \\| ${pdfDocDraftMonth}[ |\n]?${pdfDocDraftDay},[ |\n]?${pdfDocDraftyear}`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/camelcase
        tmpRegex = new RegExp( `MR-00002 Preventative Maintenance \\| ${USERS[1].name} \\| RELEASED \\| ${pdfDocDraftMonth}[ |\n]?${pdfDocDraftDay},[ |\n]?${pdfDocDraftyear}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `Preventative Maintenance Done - Due Date: ${equimentDueDaysFmt}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/CALIBRATION/);

        tmpRegex = new RegExp(`Calibration required\\?\n.*Yes.*No`);
        expect(el).match(tmpRegex);

        expect(el).match(/Calibration Form\nFM-00005 - rev 1 - Calibration form/);

        tmpRegex = new RegExp(`Calibration Frequency \\(Days\\)\n${equimentDueDays}`);
        expect(el).match(tmpRegex);

        expect(el).match(/Instructions\nInstructions for calibration/);

        expect(el).match(/History/);
        tmpRegex = new RegExp( `MR-00001 Calibration document \\| ${USERS[1].name} \\| RELEASED \\| ${pdfDocDraftMonth} [\n]?${pdfDocDraftDay}, [\n]?${pdfDocDraftyear}`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `Calibration Done - Due Date: ${equimentDueDaysFmt}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Equipment\n${formId}, Revision 1\nEQUIPMENT DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        expect(el).not.match(/Select field/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Add Autocomplete 'Equipment'", () => {
    context("Create FORM document", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'FORM document'", () => {
        cy.drEnterDocumentTitle({ name: "FORM document" });
      });

      it("Enter document description 'FORM document description'", () => {
        cy.drEnterDocumentDescription({ description: "FORM document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Clinical Protocol' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      });

      it("Click create a document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      context("Add form fields", () => {
        it("Add Autocomplete", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        });
      });

      context("Fill in Autocomplete attributes", () => {
        it("Enter label 'test label'", () => {
          cy.fbEnterNameValue({ name: "label", value: "test label" });
        });

        it("Select 'Equipment' as options", () => {
          cy.fbAutocompleteType({ autocompleteOption: "Equipment" });
        });

        it("Click 'Add' button", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Preview FORM document", () => {
        it("Click Form Review", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });
      });
    });

    context("Verify Autocomplete 'Equipment'", () => {
      it("Verify autocomplete 'Equipment'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?documentTypeCategory=Equipment`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {

          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").arrowClick();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });

      it("Verify created 'Equipment' in the list", () => {
        cy.get(".MuiAutocomplete-popper ul li").should("contain", equipmentTitle);
      });

      it("Verify count in the list", () => {
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
      });
    });
  });
});
