// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import path from "path";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let lhrDocUrl;

let lhrDocId;
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
const docRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");


context("Autosave LHR", () => {
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
                documentTypeName: "Lot History Record Test",
                documentTypeAcronym: "LHR-",
                group: "LHR",
                privateNumberPool: false,
                needsSignature: true,
                category: "Lhr",
                fieldsConfig: {
                  C: {
                    visible: false,
                  },
                  D: {
                    visible: false,
                  },
                  E: {
                    visible: false,
                  },
                  U: {
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                },
                schema: [
                  {
                    name: "lhr-selected-part",
                    type: "partsselection",
                    index: 0,
                    label: "Part to be Manufactured",
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "lhr_initial_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Initial Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-end-quantity",
                    type: "quantity",
                    index: 2,
                    label: "End Quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    outputDisabled: true,
                    validationAttribute: "End Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-build-type",
                    type: "radiogroup",
                    index: 3,
                    label: "Build Type",
                    options: [
                      {
                        text: "R&D",
                        value: "R&D",
                      },
                      {
                        text: "Production",
                        value: "Production",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Build Type",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhr-due-date",
                    type: "datepicker",
                    index: 4,
                    label: "Due Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Due Date",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrstep-built-in",
                    type: "lhrstep",
                    index: 5,
                    label: "LHR Step",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    applicableValidationSchema: true,
                  },
                ],
              },
              {
                documentTypeName: "Manufacturing Process Instructions Test",
                documentTypeAcronym: "PI-",
                group: "PI",
                schema: [
                  {
                    name: "fb-mpi-procedure-section-built-in",
                    type: "section",
                    index: 0,
                    label: "form.builder.mpiprocedure",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "mpi-procedure-built-in",
                    type: "mpiprocedure",
                    index: 1,
                    stepIndex: 1,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-start-quantity",
                    type: "quantity",
                    index: 2,
                    label: "Start quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Start quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-accepted-quantity",
                    type: "quantity",
                    index: 3,
                    label: "Accepted quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Accepted quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lhrs-rejected-quantity",
                    type: "quantity",
                    index: 4,
                    label: "Rejected quantity",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Rejected quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approvals-built-in",
                    type: "approvals",
                    index: 5,
                    label: "Approvals",
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
              {
                documentTypeName: "LHR template",
                documentTypeAcronym: "LHRT-",
                group: "FORM",
              },
              {
                documentTypeName: "Part",
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Fill step #1", () => {
        it("Fill step #1 description", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
          });
        });

        // it("Add attachment", () => {
        //   cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        //     cy.contains("Step #1").parentsUntil("li")
        //       .find("[data-cy=\"albumMediaButton\"]").arrowClick();
        //     cy.elUploadAttachment({
        //       fileName: "image.jpg",
        //       el: "fb-mediaalbum-upload-mpi-procedure-built-in.attachments",
        //     });
        //   });
        //   cy.progressBarShouldNotExist();
        //   cy.listLoadingElementShouldNotExist();
        // });

        it("Add 'Part document' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Part document", quntity: "3", unit: "Each" });
          });
        });

        it("Add 'Equipment one' to step #1", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
          });
        });
      });

      context("Fill step #2", () => {
        it("Add step #2", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddStep();
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Fill step #2 description", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Description of step two" });
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add 'Part document' to step #2", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddMaterialDocumentToStep({ numbOfStep: 2, material: "Material two", quntity: "5", unit: "Day(s)" });
          });
        });

        it("Add 'Equipment two' to step #2", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
            cy.mpiAddEquipmentToStep({ numbOfStep: 2, equipment: "Equipment two" });
          });
        });
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.pause();
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
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

      it("Select 'Lot History Record Test' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Add Checkbox group", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").last().arrowClick({ force: true });
        cy.get("[class=\"MuiButton-label\"]").contains("Checkbox group").arrowClick();
        cy.get(`input[name="label"]`).clear().arrowType("Checkbox").arrowClick();
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
        cy.get("[data-cy=\"form.builder.add.field\"]").last().arrowClick({ force: true });
        cy.get("button[data-cy=\"form.builder.textfield\"]").arrowClick();
        cy.get(`input[name="label"]`).clear().arrowType("TEXT FIELD").arrowClick();
        cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
        cy.get("input[value^=\"visibility\"]").check();
        cy.get(`input[name="validators.required_if_in"]`).check();
        cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
        cy.get(`input[type="checkbox"][value="3"]`).last().check();
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Part document");
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev], () => {
          cy.get("ul>li[role=option]").contains("Part document").arrowClick();
        });
      });

      context("Select created MPI in LHR template", () => {
        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("input[data-cy=\"lhrstep-built-in\"]").then(($el) => {
            $el.trigger("click");
          });
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.PatchDocRev], () => {
            cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect("MPI document");
          });
        });

        it("Verify form Draft status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: "Draft" });
          cy.arCheckTitleInEditableAndMatches({ name: "LHRt document" });
          cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
            lhrDocId = $docIdElement.text();
          });
          cy.sendToEmail();
        });

        it("Verify popup message \"File will be sent to your email shortly.\"", () => {
          cy.checkToastMessageContains({
            message: "File will be sent to your email shortly.",
          });
        });
      });

      context("Verify email for  LHRt notification", () => {
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
            subject: `Export for document ${lhrDocId}`,
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
        it("Download zip file", () => {
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${lhrDocId}${filetime}_draft.zip`;
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
            `${lhrDocId}-1-LHRt-document.pdf`);
          cy.readFile(pdffile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${lhrDocId}-1-LHRt-document.pdf`,
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

        it("Verify page 1 for LHRt", () => {
          const el = pages[0];
          if (el.includes("Page 1 of 3")) {
            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/AR ID\nNone/);

            expect(el).match(/Description\nLHRt document description/);

            expect(el).match(/Output Document Type\nLot History Record Test/);

            expect(el).match(/Attachments\nNone/);

            expect(el).match(/Part to be Manufactured\nPRT-00005 - Part document/);

            expect(el).match(/Initial Quantity/);

            expect(el).match(/End Quantity/);

            tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Due Date/);

            expect(el).match(/LHR STEP #1\nPI-00002 - MPI document/);

            expect(el).match(/Materials\nPRT-00005 - Part document \| Qty: 3 each/);

            expect(el).match(/Equipment\nET-00003 - Equipment one/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 3/);
          }
        });

        it("Verify page 2 of LHRt", () => {
          const el = pages[1];
          if (el.includes("Page 2 of 3")) {

            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/APPROVALS\nApprovers/);

            expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");

            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");

            expect(el).match(tmpRegex);

            expect(el).match(/Page 2 of 3/);
          }
        });

        it("Verify page 3 of LHRt", () => {
          const el = pages[2];
          if (el.includes("Page 3 of 3")) {

            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Draft/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 3 of 3/);
          }
        });
      });

      context("Release LHRt", () => {
        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });

        it("Verify form Released status and click on Send To Email", () => {
          cy.drCheckDocumentStatus({ status: "Released" });
          cy.arCheckTitleInEditableAndMatches({ name: "LHRt document" });
          cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
            lhrDocId = $docIdElement.text();
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

      context("Verify email for  LHRt notification", () => {
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
            subject: `Export for document ${lhrDocId}`,
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
        it("Download zip file", () => {
          expect(downloadUrl).contains("exported_file_download");
          fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];
          cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
            if (res.body !== "") {
              downloadUrl = res.body.url;
              const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
              downloadFile  =  `${lhrDocId}${filetime}_rel.zip`;
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
            `${lhrDocId}-1-LHRt-document.pdf`);
          cy.readFile(pdffile).its("length").should("be.gt", 500);
        });
      });

      context("Verify PDF file content", () => {
        it("Extract texts from PDF file content", () => {
          cy.pdfparseFile(
            {
              directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
              fileName: `${lhrDocId}-1-LHRt-document.pdf`,
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

        it("Verify page 1 for LHRt", () => {
          const el = pages[0];
          if (el.includes("Page 1 of 3")) {
            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp( `AR ID\n${arId}`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Description\nLHRt document description/);

            expect(el).match(/Output Document Type\nLot History Record Test/);

            expect(el).match(/Attachments\nNone/);

            expect(el).match(/Part to be Manufactured\nPRT-00005 - Part document/);

            expect(el).match(/Initial Quantity/);

            expect(el).match(/End Quantity/);

            expect(el).match(/Due Date/);

            tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/LHR STEP #1\nPI-00002 - MPI document/);

            expect(el).match(/Materials\nPRT-00005 - Part document \| Qty: 3 each/);

            expect(el).match(/Equipment\nET-00003 - Equipment one/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 1 of 3/);
          }
        });

        it("Verify page 2 of LHRt", () => {
          const el = pages[1];
          if (el.includes("Page 2 of 3")) {

            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/APPROVALS\nApprovers/);

            expect(el).match(/Checkbox\nTEXT FIELD\n1 2 3/);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 2 of 3/);
          }
        });

        it("Verify page 3 of LHRt", () => {
          const el = pages[2];
          if (el.includes("Page 3 of 3")) {

            tmpRegex = new RegExp( `LHR template\n${lhrDocId}, Revision 1\nLHRT DOCUMENT`, "gi" );
            expect(el).match(tmpRegex);

            expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
            tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${docRelDate}\nReleased`, "gi" );
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
            expect(el).not.match(tmpRegex);

            expect(el).match(/Released/);

            tmpRegex = new RegExp(`Print: ${footerDate}`, "gi");
            expect(el).match(tmpRegex);

            tmpRegex = new RegExp(`Effective Date: ${docRelDate}`, "gi");
            expect(el).match(tmpRegex);

            expect(el).match(/Page 3 of 3/);
          }
        });
      });
    });
  });

  context("Create LHR", () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });

    it("Enter end quantity", () => {
      cy.get("[name=\"lhr-end-quantity\"]").arrowType("10", { force: true });
    });

    it("While autosaving, select 'Production' build type", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.get("[value=\"Production\"]").check();
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });

    it("Change build type to 'R&D'", () => {
      cy.unClick();
      cy.get("[value=\"R&D\"]").check();
    });

    it("While autosaving, add 'Due Date'", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.unClick();
      cy.poAddDateRequired();
      cy.unClick();
      cy.url().then((url: any) => {
        lhrDocUrl = url;
      });
      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });
  });

  context("Add/remove approver and check autosave", () => {
    it("Add first Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("Remove second Approver'", () => {
      cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
    });

    it("check approvers after reload page", () => {
      cy.reload();
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get("[name^=\"fb-approvals-fb-approvals-\"]")
        .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("check end quantity", () => {
      cy.get("[name=\"lhr-end-quantity\"]").should("have.value", "10");
    });

    it("check build type", () => {
      cy.get("[name=\"lhr-build-type\"]").should("be.checked");
    });

    it("check due date", () => {
      cy.get("[name=\"lhr-due-date\"]").invoke("val").should("be.exist");
      cy.pause();
    });

  });

  context("Complete first step in LHR", () => {
    context("Start LHRs #1", () => {
      it("Navigate to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
        cy.unClick();
      });

      it("While autosaving, enter 'Accepted quntity' for LHRs #1", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("6");
        cy.unClick();
        cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
      });

      it("Change value in 'Accepted quntity' fields", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowClick({ force: true })
          .clear().arrowType("8");
        cy.unClick();
      });

      it("Upload attachment 'test_image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      });

      it("While autosaving, enter 'Rejected quntity' for LHRs #1", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
        cy.unClick();
        cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
        cy.pause();
      });
    });

    context("Add/remove approver and check autosave", () => {
      it("Add first Approver'", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        cy.unClick();
      });

      it("Add second Approver'", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.unClick();
      });

      it("Remove first Approver'", () => {
        cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
        cy.unClick();
      });

      it("check approvers", () => {
        cy.get("[name=\"fb-approvals-approvals-built-in\"]")
          .should("contain", `${USERS[1].name} - ${USERS[1].email}`);
        cy.get("[name=\"fb-approvals-approvals-built-in\"]")
          .should("not.contain", `${USERS[2].name} - ${USERS[2].email}`);
      });

      it("check Start quntity", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").should("have.value", "10");
      });

      it("check Accepted quntity", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").should("have.value", "8");
      });

      it("check Rejected quntity", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").should("have.value", "2");
      });

      // it("Check doc status for WIP and click on Send To Email", () => {
      //   cy.drCheckDocumentStatus({ status: "WIP" });
      //   cy.get("#HeaderInfo-subtitle").should("have.text", "LOT #" + lotDateSuffix + "01");
      //   cy.get("#HeaderInfo-docId").should("have.text", "LHR-00004");
      //   cy.drGetDocIdElementFromUI().should("contain.text", "RD-").then(($docIdElement: JQuery<HTMLElement>) => {
      //     lhrDocId = $docIdElement.text();
      //   });
      //   cy.sendToEmail();
      // });

      // it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      //   cy.checkToastMessageContains({
      //     message: "File will be sent to your email shortly.",
      //   });
      // });

    });
  });
});

export { };

