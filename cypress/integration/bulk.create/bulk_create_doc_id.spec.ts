// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let testPrivateType;
let testPublicType;
let formDocumentType;
let createdDocumentForBulkCreation;
let testDocumentTypeDocument;
let BLCdocumentType;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;

const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");

context("Bulk create public, private and reserved doc-ids", () => {
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
                documentTypeName: "Test Private Pool",
                documentTypeAcronym: "TPP-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                canRedLine: true,
                privateNumberPool: true,
              },
              {
                documentTypeName: "Test Public Pool",
                documentTypeAcronym: "TPUP-",
                group: DOC_TYPE_GROUP.OTHER,
                isQms: true,
                canRedLine: true,
                privateNumberPool: false,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          testPrivateType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Private Pool");
          testPublicType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Public Pool");
          BLCdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Bulk Create");
          done();
        });
      });
    });

    context("[API]Create documents for bulk create", () => {
      it("[API]Login first tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          loginResponse = response;
          done();
        });
      });

      it("[API]Create Bulk Create form", (done: any) => {
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
                description: "<p>Document form for bulk create</p>",
                document: {
                  docId: "FM-00002",
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
                name: "Document for bulk creation",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [
                    {
                      id: testPublicType[0].id,
                    },
                    {
                      id: testPrivateType[0].id,
                    },
                  ],
                  schema: [
                    {
                      name: "blc-text-field-kv6ef2ii",
                      tabId: "overview",
                      rows: 1,
                      type: "textfield",
                      index: 0,
                      label: "BLC text field",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC text field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdDocumentForBulkCreation = response;
              cy.drAPIApproveAndRelease({
                documentId: createdDocumentForBulkCreation.id,
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

      it("[API]Create Private type document", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>test private document</p>",
            document: {
              docId: "TPP-00002",
              documentType: {
                id: testPrivateType[0].id,
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
            name: "Private document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
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

      it("[API]Create Private type document", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>test private document</p>",
            document: {
              docId: "TPP-00004",
              documentType: {
                id: testPrivateType[0].id,
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
            name: "Private document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
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


      it("[API]Create Public type document", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>public document</p>",
            document: {
              docId: "TPUP-00001",
              documentType: {
                id: testPublicType[0].id,
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
            name: "Public document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
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

      it("[API]Create Public type document", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>public document</p>",
            document: {
              docId: "TPUP-00003",
              documentType: {
                id: testPublicType[0].id,
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
            name: "Public document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
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

    context("[API]Update BLC document type", () => {
      it("Change fields config in BLC document type", () => {
        cy.drUpdateDocumentTypeName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          id: BLCdocumentType[0].id,
          payload: {
            fieldsConfig: {
              D: {
                visible: false,
                required: false,
              },
              E: {
                label: "Record Type",
                visible: false,
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
                label: "Approve and Release",
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create form for bulk create", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
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
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add Checkbox group", () => {
      cy.drSelectDetailsTab();
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.get("[data-cy=\"options\"]").arrowType("1{enter}" );
      cy.get("[data-cy=\"options\"]").arrowType("2{enter}" );
      cy.get("[data-cy=\"options\"]").arrowType("3{enter}" );
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-TEXT FIELD" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).check({ force: true });
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Verify Bulk Create form title report", () => {
    it("Check doc Released status and click on Send To Email", () => {
      cy.drSelectOverviewTab();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.drVerifyTitle({ title: "Bulk create form" });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email for bulk create form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
        .then((emails) => {
          emailsFromInbox = emails;
          expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
          downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
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
    it("Download zip file containing bulk create form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${releasedFormId}${filetime}.zip`;
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
        `${releasedFormId}-1-Bulk-create-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content for bulk create form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Bulk-create-form.pdf`,
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

    it("Verify page 1 for bulk create form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nBULK CREATE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nAR-00006/);

        expect(el).match(/Description\nBulk create form description/);

        expect(el).match(/Output Document Type\nBulk Create/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/Select Form Document For Import/);

        expect(el).match(/Select Output Document Type/);

        expect(el).match(/EXCEL FOR IMPORT/);

        tmpRegex = new RegExp( `Column Document\\/Record Id\\?\\n.*Yes.*No`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Upload excel with data for import/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for bulk create form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nBULK CREATE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/FM-00004, Revision 1/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Logs/);

        tmpRegex = new RegExp( `Checkbox\\n(.*)\\n1 2 3`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for bulk create form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nBULK CREATE FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        tmpRegex = new RegExp( `AR-000061N\\/A \\(Numeric Release\\)${footerDate}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Test private pool document type", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document{enter}" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.get("[name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
        cy.unClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("Document for bulk creation");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Test Private Pool");
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).last().check();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Add first Approver'", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      });

      it("Add second Approver'", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
      });

      it("Remove second Approver'", () => {
        cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
      });

      it("check first approvers exists and second Approver removed", () => {
        cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
          .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
        cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
          .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });
    });

    context("Upload template with existing doc-ids", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "privateBulkExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Check doc WIP status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
        cy.drVerifyTitle({ title: "Bulk Creation document" });
        cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
          releasedFormId = x.text();
        });
        cy.get(".MuiBox-root").contains(`${releasedFormId}`);
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for WIP bulk create notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${releasedFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
          .then((emails) => {
            emailsFromInbox = emails;
            expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];

          });
      });

      it("Verify the emails that should be received", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[1].email,
            contains: [`Hello <b>${USERS[1].name},</b>`,
              "Your documents are ready for download.",
              "<button type=\"button\">DOWNLOAD</button>",
              createdCompany.id,
            ],
          }];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });
    });

    context("Verify zip file downloaded", () => {
      it("Download zip file containing bulk create notification", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${releasedFormId}${filetime}_WIP.zip`;
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

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content for WIP document", () => {
      it("Extract texts from PDF file content for WIP document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A-Bulk-Creation-document.pdf`,
        }).then((cdata) => {
          expect(cdata.numpages).eq(2);
          expect(cdata.text).match(/Page 1 of 2/);
          expect(cdata.text).match(/Page 2 of 2/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 2")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 2")) {
              pages[1] = element;
            }
          });
        });
      });

      it("Verify page 1 for WIP document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new
          RegExp( `Bulk Create\n${releasedFormId}, Revision A\nBULK CREATION DOCUMENT`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/Select Form Document For Import\nFM-00002 - 1 Document for bulk creation/);

          expect(el).match(/Select Output Document Type\nTest Private Pool/);

          expect(el).match(/EXCEL FOR IMPORT/);

          tmpRegex = new RegExp( `Column Document\\/Record Id\\?\\n.*Yes.*No`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/\(file\) Upload excel with data for import/);

          expect(el).match(/privateBulkExistDocId\n.xlsx/);

          expect(el).match(/MASS CREATE LOGS\n\(file\) Logs\nNone/);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
      it("Verify page 2 for WIP document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new
          RegExp( `Bulk Create\n${releasedFormId}, Revision A\nBULK CREATION DOCUMENT`, "gi" );
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| DRAFT\\nCheckbox\\n1 2 3`);
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`${USERS[2].name} \\- .*@.*`);
          expect(el).not.match(tmpRegex);

          expect(el).not.match(/TEXT FIELD/);

          expect(el).not.match(/REJECTED/);

          expect(el).match(/WIP/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("Release the bulk create document", () => {
      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "These docIds: TPP-00002 already exists in your Enlil environment.",
        });
        cy.closeAllAlertMessages();
      });

      it("Remove file", () => {
        cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
          .find("button").arrowClick({ force: true });
      });
    });

    context("Create bulk documents wih no specified id-s", () => {
      it("Select 'no' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "privateBulkNoExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record", () => {
        cy.ebApproveWithoutApi();
      });

      it("Check doc Released status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.drVerifyTitle({ title: "Bulk Creation document" });
        cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
          releasedFormId = x.text();
        });
        cy.get(".MuiBox-root").contains(`${releasedFormId}`);
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for bulk create released notification", () => {
      it("Get emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${releasedFormId}`,
        };

        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting })
          .then((emails) => {
            emailsFromInbox = emails;
            expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
            downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
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

    context("Verify PDF file downloaded", () => {
      it("Extract download link from gmail", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  = `${releasedFormId}${filetime}_rel.zip`;
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

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });

      it("Verify attached file length more than 500 bytes", () => {
        const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
          downloadFile.replace(".zip", ""), "image.jpg");
        cy.readFile(attachedFile).its("length").should("be.gt", 500);
      });
    });

    context("Verify PDF file content", () => {
      it("Extract texts from PDF file content for released document", () => {
        cy.pdfparseFile(
          {
            directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
            fileName: `${releasedFormId}-A-Bulk-Creation-document.pdf`,
          }).then((cdata) => {
          expect(cdata.numpages).eq(2);
          expect(cdata.text).match(/Page 1 of 2/);
          expect(cdata.text).match(/Page 2 of 2/);
          tmpRegex = new RegExp( "\\n\\n");
          const arr = cdata.text.split(tmpRegex);
          arr.forEach((element) => {
            if (element.includes("Page 1 of 2")) {
              pages[0] = element;
            }
            if (element.includes("Page 2 of 2")) {
              pages[1] = element;
            }
          });
        });
      });

      it("Verify page 1 for released document", () => {
        const el = pages[0];
        if (el.includes("Page 1 of 2")) {
          tmpRegex = new
          RegExp( `Bulk Create\n${releasedFormId}, Revision A\nBULK CREATION DOCUMENT`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/Attachments/);

          expect(el).match(/image.jpg/);

          expect(el).match(/Select Form Document For Import\nFM-00002 - 1 Document for bulk creation/);

          expect(el).match(/Select Output Document Type\nTest Private Pool/);

          expect(el).match(/EXCEL FOR IMPORT/);

          tmpRegex = new RegExp( `Column Document\\/Record Id\\?\\n.*Yes.*No`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/\(file\) Upload excel with data for import/);

          expect(el).match(/privateBulkNoExistDo\ncId.xlsx/);

          expect(el).match(/MASS CREATE LOGS/);

          expect(el).match(/\(file\) Logs/);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 1 of 2/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });

      it("Verify page 2 for released document", () => {
        const el = pages[1];
        if (el.includes("Page 2 of 2")) {
          tmpRegex = new
          RegExp( `Bulk Create\n${releasedFormId}, Revision A\nBULK CREATION DOCUMENT`, "gi" );
          expect(el).match(tmpRegex);

          expect(el).match(/BulkProcessLogs.txt/);

          tmpRegex = new RegExp( `Checkbox\\n1 2 3`, "gi" );
          expect(el).match(tmpRegex);

          // eslint-disable-next-line max-len
          tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| APPROVED \\| ${docRelDate}`);
          expect(el).match(tmpRegex);

          expect(el).match(/Released/);

          tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          tmpRegex = new RegExp(`Form Info: FM-00004, Revision 1, ${footerDate}`, "gi");
          expect(el).match(tmpRegex);

          expect(el).match(/Page 2 of 2/);

          expect(el).not.match(/TEXT FIELD/);

          tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
          expect(el).not.match(tmpRegex);
        }
      });
    });

    context("Verify created docs", () => {
      it("Navigate to document list and verify count", () => {
        cy.navigToDashboard();
        cy.wait(30 * 1000);
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlVerifyDocCounter({ docCounterNumber: 9 });
      });

      it("Filter docs by type", () => {
        cy.dlFilterByType({ type: "TPP" });
      });

      it("Verify doc-ids are correct for created doc", () => {
        const documetsWhichShouldBeOnList: string[] = ["TPP-00001", "TPP-00002", "TPP-00003", "TPP-00004"];

        cy.get(`td[role=gridcell][data-grid-col-index="0"]`).each(($document) => {
          expect($document.text()).to.be.oneOf(documetsWhichShouldBeOnList);
        });
      });
    });
  });

  context("Test public pool document type", () => {
    it("Filter by doc-id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "FM-00004" });
    });

    it("Select first doc", () => {
      cy.dlSelectFirstDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.get("[name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
        cy.unClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("Document for bulk creation");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Test Public Pool");
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Checkbox option 1 checked", () => {
        cy.get(`input[type="checkbox"][value="1"]`).check();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });
    });

    context("Upload template with existing doc-ids", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "publicBulkExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });


      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "These docIds: TPUP-00001, TPUP-00003 already exists in your Enlil environment.",
        });
        cy.closeAllAlertMessages();
      });

      it("Remove file", () => {
        cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
          .find("button").arrowClick({ force: true });
      });
    });

    context("Create bulk documents wih no specified id-s", () => {
      it("Select 'no' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "publicBulkNoExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record", () => {
        cy.ebApproveWithoutApi();
      });
    });

    context("Verify created docs", () => {
      it("Navigate to document list and verify count", () => {
        cy.navigToDashboard();
        cy.wait(30 * 1000);
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlVerifyDocCounter({ docCounterNumber: 11 });
      });

      it("Filter docs by type", () => {
        cy.dlFilterByType({ type: "TPUP" });
      });

      it("Verify doc-ids are correct for created doc", () => {
        const documetsWhichShouldBeOnList: string[] = ["TPUP-00001", "TPUP-00003", "TPUP-00005", "TPUP-00006"];

        cy.get(`td[role=gridcell][data-grid-col-index="0"]`).each(($document) => {
          expect($document.text()).to.be.oneOf(documetsWhichShouldBeOnList);
        });
      });

      it("Verify first item on list is in DRAFT", () => {
        SystemRequirement("REQ-4730");
        cy.dlVerifyFilterByStatus({ status: "Draft" });
      });
    });
  });
});

export { };
