// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;
let MPIDocId;
let QPIDocId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;


const dateOffset = (5 * 1000);
const footerDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");

context("Mpi/Qpi test", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
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

      it("Close the sidebar", () => {
        cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add attachment to step #1", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.elUploadAttachment({
            fileName: "test_image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
          cy.listLoadingElementShouldAppear();
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Material parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Parameter for material two" });
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

        it("Click save document", () => {
          SystemRequirement("REQ-3120");
          cy.drClickSaveWithoutApiCall();
        });

        it("Check doc Draft status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
          cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });

          cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
            MPIDocId = $docIdElement.text();
          });
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          cy.sendToEmail();
        });
      });

      context("Verify email for Draft MPI notification", () => {
        it("Get emails", () => {
          const getEmailSetting =  {
            to: CONFIG.TEST_EMAIL,
            after: dateAfterEmailShouldArrive,
            subject: `Export for document ${MPIDocId}`,
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
          SystemRequirement("REQ-4860");
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${MPIDocId}${filetime}_draft.zip`;
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

        it("Verify attached image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });

        it("Verify attached test_image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "Step 1 - in", "test_image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${MPIDocId}-1-MPI-document.pdf`,
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

        it("Verify page 1 of MPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[0];
          if (el.includes("Page 1 of 3")) {
            tmpRegex = new
            RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Description\nMPI document description/);

            expect(el).match(/Attachments/);

            expect(el).match(/image.jpg/);

            expect(el).match(/PI PROCEDURE/);

            expect(el).match(/STEP #1\nDescription of step one/);

            expect(el).match(/\(Step 1 - in\) Attachments/);

            expect(el).match(/test_image.jpg/);

            expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 3 each\nA: Parameter for material two/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 3/);
          }
        });

        it("Verify page 2 of MPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[1];
          if (el.includes("Page 2 of 3")) {
            tmpRegex = new
            RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Equipment\nET-00003 - Equipment one\nB: Equipment parameter/);
            expect(el).match(/Start quantity\nAccepted quantity\nRejected quantity/);


            expect(el).match(/APPROVALS\nApprovers\nCheckbox\nfb-TEXT FIELD\n1 2 3/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 2 of 3/);
          }
        });

        it("Verify page 3 of MPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          SystemRequirement("REQ-4870");
          const el = pages[2];
          if (el.includes("Page 3 of 3")) {
            tmpRegex = new
            RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 3 of 3/);
          }
        });
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Check MPI doc released status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
          cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });
          cy.drGetDocIdElementFromUI().should("contain.text", "MPI-").then(($docIdElement: JQuery<HTMLElement>) => {
            MPIDocId = $docIdElement.text();
          });
          cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
            arId = $lnEl.text();
          });
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          cy.sendToEmail();
        });
      });
    });
  });

  context("Verify email for Released MPI notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${MPIDocId}`,
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
      SystemRequirement("REQ-4860");
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${MPIDocId}${filetime}_rel.zip`;
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

    it("Verify attached image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });

    it("Verify attached test_image.jpg file length more than 500 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "Step 1 - in", "test_image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${MPIDocId}-1-MPI-document.pdf`,
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

    it("Verify page 1 of MPI document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new
        RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nMPI document description/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/PI PROCEDURE/);

        expect(el).match(/STEP #1\nDescription of step one/);

        expect(el).match(/\(Step 1 - in\) Attachments/);

        expect(el).match(/test_image.jpg/);

        expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 3 each\nA: Parameter for material two/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 of MPI document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new
        RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nET-00003 - Equipment one\nB: Equipment parameter/);
        expect(el).match(/Start quantity\nAccepted quantity\nRejected quantity/);

        expect(el).match(/APPROVALS\nApprovers\nCheckbox\nfb-TEXT FIELD\n1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 of MPI document", () => {
      SystemRequirement("REQ-4850");
      SystemRequirement("REQ-4880");
      SystemRequirement("REQ-4870");
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new
        RegExp( `Manufacturing Process Instructions Test\n${MPIDocId}, Revision 1\nMPI DOCUMENT`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}`, "gi" );
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

  context("Create QPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill QPI document attributes", () => {
      it("Enter document title 'QPI document'", () => {
        cy.drEnterDocumentTitle({ name: "QPI document" });
      });

      it("Fill QPI document description", () => {
        cy.drEnterDocumentDescription({ description: "QPI document description" });
      });

      it("Select 'Quantity Process Instructions Test' document type", () => {
        SystemRequirement("REQ-3040");
        cy.drSelectDocumentType({ documentType: "Quantity Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
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
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get(`input[name="validators.required_if_in"]`).check();
        cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
        cy.get(`input[type="checkbox"][value="3"]`).check({ force: true });
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Close the sidebar", () => {
        cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
        });

        it("Add attachment to step #1", () => {
          cy.contains("Step #1").parentsUntil("li")
            .find("[data-cy=\"albumMediaButton\"]").arrowClick();
          cy.elUploadAttachment({
            fileName: "test_image.jpg",
            el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
          });
          cy.listLoadingElementShouldAppear();
        });

        it("Add 'Material one' to step #1", () => {
          cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
        });

        it("Add 'Material parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.mpiAddMaterialParameterToStep({ numbOfStep: 1, material: "Parameter for material two" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
        });

        it("Add 'Equipment parameter' to step #1", () => {
          SystemRequirement("REQ-3620");
          cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Save QPI document and verify status", () => {
        it("Click save document", () => {
          SystemRequirement("REQ-3120");
          cy.drClickSaveWithoutApiCall();
        });

        it("Check QPI doc Draft status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
          cy.arCheckTitleInEditableAndMatches({ name: "QPI document" });
          cy.drGetDocIdElementFromUI().should("contain.text", "QPI-").then(($docIdElement: JQuery<HTMLElement>) => {
            QPIDocId = $docIdElement.text();
          });
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          cy.sendToEmail();
        });
      });

      context("Verify email for Draft QPI notification", () => {
        it("Get emails", () => {
          const getEmailSetting =  {
            to: CONFIG.TEST_EMAIL,
            after: dateAfterEmailShouldArrive,
            subject: `Export for document ${QPIDocId}`,
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
          SystemRequirement("REQ-4860");
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${QPIDocId}${filetime}_draft.zip`;
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

        it("Verify attached test_image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "Step 1 - in", "test_image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${QPIDocId}-1-QPI-document.pdf`,
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

        it("Verify page 1 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[0];
          if (el.includes("Page 1 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp( `AR ID\\nNone`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Description\nQPI document description/);

            expect(el).match(/Attachments/);

            expect(el).match(/image.jpg/);

            expect(el).match(/PI PROCEDURE/);

            expect(el).match(/STEP #1\nDescription of step one/);

            expect(el).match(/\(Step 1 - in\) Attachments/);

            expect(el).match(/test_image.jpg/);

            expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 3 each\nA: Parameter for material two/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 3/);
          }
        });

        it("Verify page 2 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[1];
          if (el.includes("Page 2 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Equipment\nET-00003 - Equipment one\nB: Equipment parameter/);
            expect(el).match(/APPROVALS\nApprovers\nCheckbox\nTEXT FIELD\n1 2 3/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 2 of 3/);
          }
        });

        it("Verify page 3 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          SystemRequirement("REQ-4870");
          const el = pages[2];
          if (el.includes("Page 3 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 3 of 3/);
          }
        });
      });

      context("Release QPI document", () => {
        it("Approve and release QPI document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });

        it("Check QPI doc released status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
          cy.arCheckTitleInEditableAndMatches({ name: "QPI document" });
          cy.drGetDocIdElementFromUI().should("contain.text", "QPI-").then(($docIdElement: JQuery<HTMLElement>) => {
            QPIDocId = $docIdElement.text();
          });
          cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
            arId = $lnEl.text();
          });
          dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);
          cy.sendToEmail();
        });
      });

      context("Verify email for Released QPI notification", () => {
        it("Get emails", () => {
          const getEmailSetting =  {
            to: CONFIG.TEST_EMAIL,
            after: dateAfterEmailShouldArrive,
            subject: `Export for document ${QPIDocId}`,
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
          SystemRequirement("REQ-4860");
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${QPIDocId}${filetime}_rel.zip`;
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

        it("Verify attached test_image.jpg file length more than 500 bytes", () => {
          const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
            downloadFile.replace(".zip", ""), "Step 1 - in", "test_image.jpg");
          cy.readFile(attachedFile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${QPIDocId}-1-QPI-document.pdf`,
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

        it("Verify page 1 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[0];
          if (el.includes("Page 1 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Description\nQPI document description/);

            expect(el).match(/Attachments/);

            expect(el).match(/image.jpg/);

            expect(el).match(/PI PROCEDURE/);

            expect(el).match(/STEP #1\nDescription of step one/);

            expect(el).match(/\(Step 1 - in\) Attachments/);

            expect(el).match(/test_image.jpg/);

            expect(el).match(/Materials\nMT-00004 - Material one \| Qty: 3 each\nA: Parameter for material two/);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 3/);
          }
        });

        it("Verify page 2 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          const el = pages[1];
          if (el.includes("Page 2 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Equipment\nET-00003 - Equipment one\nB: Equipment parameter/);
            expect(el).match(/APPROVALS\nApprovers\nCheckbox\nTEXT FIELD\n1 2 3/);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 2 of 3/);
          }
        });

        it("Verify page 3 of QPI document", () => {
          SystemRequirement("REQ-4850");
          SystemRequirement("REQ-4880");
          SystemRequirement("REQ-4870");
          const el = pages[2];
          if (el.includes("Page 3 of 3")) {
            tmpRegex = new
            RegExp( `Quantity Process Instructions Test\n${QPIDocId}, Revision 1\nQPI DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
            tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${footerDate}`, "gi" );
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
    });
  });
});

export { };

