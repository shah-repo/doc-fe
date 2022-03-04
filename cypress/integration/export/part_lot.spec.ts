/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;
let CSLDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let createdCSLFormDocument;
let wipCSLId;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
let downloadUrl;
let fileId;
let downloadFile;
let lastSignedCSLId;
let archiveCSLId;
let releasedCSLId;
let canceledCSLId;
let inReviewCSLId;
let voidedCSLId;

const dateOffset = (5 * 1000);

context("Export Part Lot", () => {
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
              {
                documentTypeName: "CSL Document",
                documentTypeAcronym: "CSL-",
                category: "Record",
                group: "PART_LOT",
                isQms: true,
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create and release inline form for CSL", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>CSL inline form</p>",
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
              name: "CSL inline form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: CSLDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "lot_quantity",
                    type: "quantity",
                    index: 0,
                    label: "Initial Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_usable_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Usable Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Usable Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_expiry_date",
                    type: "datepicker",
                    index: 2,
                    label: "Expiration Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Expiration Date",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_part",
                    type: "autocomplete",
                    index: 3,
                    label: "Part Selection",
                    optionId: "21",
                    placeholder: "Select the appropriate part for this lot",
                    deleteDisabled: true,
                    deleteInFormDisabled: true
                  },
                  {
                    name: "100-inspection-override",
                    type: "checkboxgroup",
                    index: 4,
                    label: "100% Inspection Override",
                    options: [
                      {
                        text: "100% Inspection Override",
                        value: "100% Inspection Override"
                      }
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    editorProperties: [],
                    validationAttribute: "100% Inspection Override",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 5,
                  },
                  {
                    index: 6,
                    type: "section",
                    name: "textfield-kn7fc209",
                    validationMode: "default",
                    label: "Section 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 7,
                    type: "textfield",
                    name: "textfield1-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 8,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwm",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
                  },
                  {
                    index: 9,
                    type: "section",
                    name: "textfield-kn7fc208",
                    validationMode: "default",
                    label: "Section 2",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 10,
                    type: "textfield",
                    name: "textfield2-kn7fc7w5",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 2",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 11,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwn",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
                  },
                ],
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCSLFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdCSLFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create and release form for CSL", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>CSL form</p>",
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
              name: "CSL form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: CSLDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "lot_quantity",
                    type: "quantity",
                    index: 0,
                    label: "Initial Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_usable_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Usable Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Usable Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_expiry_date",
                    type: "datepicker",
                    index: 2,
                    label: "Expiration Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Expiration Date",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    name: "lot_part",
                    type: "autocomplete",
                    index: 3,
                    label: "Part Selection",
                    optionId: "21",
                    placeholder: "Select the appropriate part for this lot",
                    deleteDisabled: true,
                    deleteInFormDisabled: true
                  },
                  {
                    name: "100-inspection-override",
                    type: "checkboxgroup",
                    index: 4,
                    label: "100% Inspection Override",
                    options: [
                      {
                        text: "100% Inspection Override",
                        value: "100% Inspection Override"
                      }
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW"
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    editorProperties: [],
                    validationAttribute: "100% Inspection Override",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true
                  },
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 0,
                  },
                ],
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCSLFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdCSLFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a CSL from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the CSL inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "CSL inline form" });

      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "CSL inline form" });
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("2");
    });

    it("Enter usable received", () => {
      cy.get("[name=\"lot_usable_quantity\"]").arrowType("1");
    });

    it("Enter text in textfield", () => {
      cy.get("[name^=\"textfield1\"]").arrowType("Test one");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall({requiredApproversDocRev: true});
    });
  });

  context("CSL with WIP status", () => {
    context("Check status should be WIP", () => {
      it("Check doc WIP status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "WIP");
        cy.get("#HeaderInfo-docId").then(($x) => {
          wipCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for WIP", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${wipCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing WIP CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${wipCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for WIP document", () => {
      it("Extract texts from PDF file content for WIP document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${wipCSLId.replace(" #", "-")}-1-CSL-inline-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/WIP/);
        });
      });
    });
  });

  context("CSL with Last Signed status", () => {
    context("Add CSL with Last Signed", () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).arrowType(`${USERS[1].email }{downarrow}{enter}`);
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.ebApprove();
      });

      it("Select Last Signed", () => {
        cy.contains("Last Signed").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check status should be Last Signed", () => {
      it("Check doc Last Signed status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Last Signed");
        cy.get("#HeaderInfo-docId").then(($x) => {
          lastSignedCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Last Signed", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${lastSignedCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing Last Signed CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${lastSignedCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for Last Signed document", () => {
      it("Extract texts from PDF file content for Last Signed document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${lastSignedCSLId.replace(" #", "-")}-1-CSL-inline-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/Last Signed/);
        });
      });
    });
  });

  context("CSL with Archive status", () => {
    context("Add CSL with Archive", () => {
      it("Click WIP status CSL", () => {
        cy.contains("WIP").arrowClick();
      });

      it("Update section", () => {
        cy.get("[name^=\"textfield1\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.ebApprove();
      });

      it("Select Archive", () => {
        cy.contains("Archive").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check status should be Archive", () => {
      it("Check doc Archive status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Archive");
        cy.get("#HeaderInfo-docId").then(($x) => {
          archiveCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Archive", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${archiveCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing Archive CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${archiveCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for Archive document", () => {
      it("Extract texts from PDF file content for Archive document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${archiveCSLId.replace(" #", "-")}-1-CSL-inline-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/Archive/);
        });
      });
    });
  });

  context("CSL with Released status", () => {
    context("Add CSL with Released", () => {
      it("Click WIP status CSL", () => {
        cy.contains("WIP").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Fill section", () => {
        cy.get("[name^=\"textfield2\"]").arrowType("Test two");
      });

      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-ia-inline-approval-]").eq(1).arrowType(`${USERS[1].email }{downarrow}{enter}`);
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.ebApprove();
      });

      it("Finalize and release button click'", () => {
        cy.recApproveAndReleaseInlineRecord();
      });
    });

    context("Check status should be Released", () => {
      it("Check doc Released status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Released");
        cy.get("#HeaderInfo-docId").then(($x) => {
          releasedCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Released", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${releasedCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing Released CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${releasedCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for Released document", () => {
      it("Extract texts from PDF file content for Released document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedCSLId.replace(" #", "-")}-A-CSL-inline-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/Released/);
        });
      });
    });
  });

  context("CSL with Canceled status", () => {
    context("Add CSL with Canceled", () => {
      it("Click Update CSL", () => {
        cy.drClickReviseDocument();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click Cancel draft", () => {
        cy.drCancelDraftButton();
      });
    });

    context("Check status should be Canceled", () => {
      it("Check doc Canceled status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Canceled");
        cy.get("#HeaderInfo-docId").then(($x) => {
          canceledCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Canceled", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${canceledCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing Canceled CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${canceledCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for Canceled document", () => {
      it("Extract texts from PDF file content for Canceled document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${canceledCSLId.replace(" #", "-")}-A-1-CSL-inline-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/Canceled/);
        });
      });
    });
  });

  context("CSL with In Review status", () => {
    context("Create a CSL from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the CSL form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "CSL form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "CSL form" });
      });

      it("Enter quantity received", () => {
        cy.get("[name=\"lot_quantity\"]").arrowType("2");
      });

      it("Enter usable received", () => {
        cy.get("[name=\"lot_usable_quantity\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCall({requiredApproversDocRev: true});
      });
    });

    context("Add CSL with In Review", () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).arrowType(`${USERS[1].email }{downarrow}{enter}`);
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save and submit for Approval", () => {
        cy.pmSubmitForApproval();
      });
    });

    context("Check status should be In Review", () => {
      it("Check doc In Review status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "In Review");
        cy.get("#HeaderInfo-docId").then(($x) => {
          inReviewCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for In Review", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${inReviewCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing In Review CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${inReviewCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for In Review document", () => {
      it("Extract texts from PDF file content for In Review document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${inReviewCSLId.replace(" #", "-")}-A-CSL-form.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/In Review/);
        });
      });
    });
  });

  context("CSL with Voided status", () => {
    context("Create a CSL from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the CSL form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "CSL form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "CSL form" });
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Enter quantity received", () => {
        cy.get("[name=\"lot_quantity\"]").arrowType("2");
      });

      it("Enter usable received", () => {
        cy.get("[name=\"lot_usable_quantity\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCall({requiredApproversDocRev: true});
      });
    });

    context("Add CSL with Voided", () => {
      it("Click Void button", () => {
        cy.arVoidAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check status should be Voided", () => {
      it("Check doc Voided status and click on Send To Email", () => {
        cy.get("#HeaderInfo-status").should("have.text", "Voided");
        cy.get("#HeaderInfo-docId").then(($x) => {
          voidedCSLId = $x.text();
        });
        cy.sendToEmail();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Verify email for Voided", () => {
      it("Get emails", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          // eslint-disable-next-line @typescript-eslint/camelcase
          wait_time_sec: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          max_wait_time_sec: 50,
          // eslint-disable-next-line @typescript-eslint/camelcase
          include_body: true,
          after: dateAfterEmailShouldArrive,
          subject: `Export for document ${voidedCSLId}`,
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

    context("Verify zip file downloaded", () => {
      it("Download zip file containing Voided CSL", () => {
        expect(downloadUrl).contains("exported_file_download");
        fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

        cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
          if (res.body !== "") {
            downloadUrl = res.body.url;
            const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
            downloadFile  =  `${voidedCSLId}${filetime}_closed.zip`;
            cy.downloadFile({
              url: downloadUrl,
              directory: CONFIG.DOWNLOADS_DIR,
              fileName: downloadFile,
            });
          }
        });
      });

      it("extract pdf file from zip file", () => {
        cy.unzipFile(
          {
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
      });
    });

    context("Verify PDF file content for Voided document", () => {
      it("Extract texts from PDF file content for Voided document", () => {
        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${voidedCSLId.replace(" #", "-")}-A-Void.pdf`,
        }).then((cdata) => {
          expect(cdata.text).match(/Voided/);
          expect(cdata.text).match(/Attachments\nNone/);
        });
      });
    });
  });

});

export { };

