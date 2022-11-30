// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, fileTimeFormat, lotIdRef, pdfDocRelDate, pdfFooterDate } from "../../utils/constants/dateHandler";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let company;
let loginResponse;
let adminEmployeeLoginResponse;
let secondEmployee;
let adminEmployee;
let releasedFormId;
let emailsFromInbox;
const pages = ["", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let partsDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let developersGroup;
let imageFile;
let createdPartDocument;

const paperlhrTitle = "Paper LHR form";
const txtFieldTitle1 = "fb-textfield";
const txtFieldTitle2 = "fb-textfield-1";
const fileUploadFieldTitle = "fb-fileupload";
const currentDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
const arID = "AR-00002";

context("Paper Lot History Record", () => {
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
        adminEmployeeLoginResponse = response;
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
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = company.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(company, "Change Order");
          partsDocumentType = cmpFilterDocumentTypeIdByName(company, "Parts");
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

    it("[API]Create part document", () => {
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
              description: "<p>Part document1</p>",
              document: {
                docId: "PRT-00001",
                documentType: {
                  id: partsDocumentType[0].id,
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
              name: "Part document1",
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

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
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Draft" });
    });

    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify predefined fields are displayed", () => {
    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist");
    });

    it("Check 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist");
      cy.get("[data-cy=\"Build Type\"]").parent().parent().parent().parent()
        .should("contain.html", `role="radiogroup"`);
      cy.get("[name=\"lhr-build-type\"]").eq(0).should("have.value", "R&D");
      cy.get("[name=\"lhr-build-type\"]").eq(1).should("have.value", "Production");
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist");
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Add fields into the form", () => {
    it("Add TextField with validation", () => {
      cy.fbAddNewFieldWhenHidden3rdLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle1 });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add another one TextField without validation", () => {
      cy.fbAddNewFieldWhenHidden3rdLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: txtFieldTitle2 });
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden3rdLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden3rdLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHidden3rdLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[value^=\"visibility\"]").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`Verify paper LHR form in ${STATUS_TYPES_LABEL.DRAFT} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.DRAFT} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email form notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
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
            company.id],
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
    it("Download zip file containing Change order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_draft.zip`;
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
        `${releasedFormId}-1-Paper-LHR-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Paper-LHR-form.pdf`,
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

    it("Verify page 1 for paper LHR form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nPaper LHR form description/);

        expect(el).match(/Output Document Type\nPaper Lot History Record/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\nEnd Quantity/);

        expect(el).match(/fb-textfield\nfb-textfield-1\nfb-fileupload/);

        expect(el).match(/Checkbox/);

        expect(el).match(/1 2 3/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for paper LHR form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for paper LHR form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Verify all data and predefined fields are present", () => {
    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context("Approve and release form", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
      cy.dlVerifyFilterByOwner({ owner: USERS[1].name });
      cy.dlVerifyFilterByStatus({ status: "Released" });
      cy.dlVerifyFilterByArId({ arId: arID });
      cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
    });

    it("Click and open the FM", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context(`Verify paper LHR form in ${STATUS_TYPES_LABEL.RELEASED} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email notification", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
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
            company.id],
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
    it("Download zip file containing Change order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_rel.zip`;
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
        `${releasedFormId}-1-Paper-LHR-form.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-1-Paper-LHR-form.pdf`,
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

    it("Verify page 1 for paper LHR form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arID}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nPaper LHR form description/);

        expect(el).match(/Output Document Type\nPaper Lot History Record/);

        expect(el).match(/Attachments\nNone/);

        expect(el).match(/Part to be Manufactured/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\nEnd Quantity/);

        expect(el).match(/fb-textfield\nfb-textfield-1\nfb-fileupload/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 3/);
      }
    });

    it("Verify page 2 for paper LHR form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/TEXT FIELD/);

        expect(el).match(/APPROVALS\nApprovers/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 3/);
      }
    });

    it("Verify page 3 for paper LHR form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 3")) {
        tmpRegex = new RegExp( `Form\n${releasedFormId}, Revision 1\nPAPER LHR FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arID}1N\\/A \\(Numeric Release\\)${pdfDocRelDate}\nReleased`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 3/);
      }
    });
  });

  context("Click to revise and Verify all data and predefined fields are present", () => {
    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist");
    });

    it("Verify 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
    });

    it("Verify 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist");
    });

    it("Verify TextField with validation is diplayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });
  });

  context(`Remove ${fileUploadFieldTitle} approve and verify Released form`, () => {
    it(`Remove ${fileUploadFieldTitle}`, () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(-4).arrowClick({ force: true });
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

  context(`Revise the form, upload file, approve and release it`, () => {
    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden2ndLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: fileUploadFieldTitle });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Verify File Upload is diplayed", () => {
      cy.get(`[data-cy="${fileUploadFieldTitle}"]`).should("exist");
    });

    it("Approve and release form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it(`Verify that FM status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get(`[data-cy="field-name"]`).should("have.text", paperlhrTitle);
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
    });
  });

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

    it("Verify TextField with validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle1}"]`).should("exist");
    });

    it("Verify TextField without validation is displayed", () => {
      cy.get(`[data-cy="${txtFieldTitle2}"]`).should("exist");
    });

    it("Verify 'Approvals' is displayed", () => {
      cy.get(`[data-cy="form.builder.approvals"]`).should("exist");
    });
  });

  context("Fill the document", () => {
    it("Select 'Part document' for Part to be Manufactured", () => {
      cy.get("[data-cy=\"lhr-selected-part\"]").arrowType("Part document");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("ul>li[role=option]").contains("Part document").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"Part to be Manufactured\"]")
        .parent().parent().parent().parent().next("p")
        .should("not.exist");
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Production' build type", () => {
      cy.get(`[name="lhr-build-type"]`).last().should("have.value", "Production").check();
      cy.get(`[data-cy="Build Type"]`)
        .parent().parent().parent().parent().next("p")
        .should("not.exist");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select 'R&D' build type", () => {
      cy.get(`[name="lhr-build-type"]`).first().should("have.value", "R&D").check();
      cy.get(`[data-cy="form.builder.lhr.build.switch"]`).last().arrowClick();
      cy.get(`[name="lhr-build-type"]`).eq(1).should("have.value", "Production").should("be.disabled");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Enter Intial Quantity field value", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter End Quantity field value", () => {
      cy.get("[name=\"lhr-end-quantity\"]").arrowType("20");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Checkbox option 1 checked", () => {
      cy.get(`[type="checkbox"][value="1"]`).last().check();
    });

    it("Enter text in fb-textfield", () => {
      cy.get(`[name^="fb-textfield"]`).first().arrowType("LHR textfield");
      cy.unClick();
    });

    it("Upload attachment test.docx", () => {
      cy.fixture("test.docx").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).attachFile({
            fileContent: fileContent.toString(),
            fileName: "test.docx",
            mimeType: "*",
            filePath: `fixtures/test.docx`,
          });
        });
      });
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
      cy.lhrVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify 'Part number/rev'", () => {
      cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document1` });
    });

    it("Verify 'Start Quantily'", () => {
      cy.lhrVerifyFilterByStartQuantity({ quantity: `10` });
    });

    it("Verify 'End Quantily'", () => {
      cy.lhrVerifyFilterByEndQuantity({ quantity: `20` });
    });

    it("Verify 'Template'", () => {
      cy.lhrVerifyFilterByTemplate({ template: `FM-00002` });
    });

    it("Verify 'ID'", () => {
      cy.lhrVerifyFilterById({ id: `LHR-00001` });
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

  context(`Verify paper LHR document is in ${STATUS_TYPES_LABEL.WIP} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.WIP} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email notification for paper LHR", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
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
            company.id],
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
    it("Download zip file containing Change order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_WIP.zip`;
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
        `${releasedFormId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });


    it("Verify attached file length more than 50 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 50);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(2);
        expect(cdata.text).match(/Page 1 of 2/);
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

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nPRT-00001, REV 1, PART DOCUMENT1`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/image.jpg\nAttachments/);

        expect(el).match(/Part to be Manufactured\nPRT-00001 - 1 Part document1/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\n10/);

        expect(el).match(/End Quantity\n20/);

        expect(el).match(/fb-textfield\nLHR textfield/);

        expect(el).match(/fb-textfield-1\nNone/);

        expect(el).not.match(/TEXT FIELD/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/APPROVALS\nNone/);

        expect(el).match(/fb-fileupload/);

        tmpRegex = new RegExp( `\\((.*)\\) fb-fileupload`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        tmpRegex  = (el).match(/\((.*)\)\sfb-fileupload/);
        imageFile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""), tmpRegex[1], "test.docx");

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 for paper LHR", () => {
      const el = pages[2];
      if (el.includes("Page 2 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nMT-00004, REV 1, MATERIAL ONE`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/test.docx/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });

    it(`Verify uploaded file exists in downloaded directory`, () => {
      cy.readFile(imageFile).its("length").should("be.gt", 0);
    });
  });

  context("Release LHR", () => {
    it("Checkbox option 3 checked only", () => {
      cy.get(`[type="checkbox"][value="1"]`).last().uncheck();
      cy.get(`[type="checkbox"][value="2"]`).last().uncheck();
      cy.get(`[type="checkbox"][value="3"]`).last().check();
    });

    it("Enter text in TEXT FIELD", () => {
      cy.get(`[name^="text-field"]`).first().arrowType("TEXT FIELD");
    });

    it("Enter text in fb-textfield", () => {
      cy.get(`[name^="fb-textfield"]`).first().arrowType("LHR textfield");
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.lhrApprove();
    });
  });

  context(`Verify paper LHR document is in ${STATUS_TYPES_LABEL.RELEASED} state`, () => {
    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status and click on Send To Email`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.get("#HeaderInfo-subtitle").contains(lotIdRef + "01RD");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => {
        releasedFormId = x.text();
      });
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.sendToEmail();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email notification for LHR", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
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
            company.id],
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
    it("Download zip file containing Change order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}${fileTimeFormat}_rel.zip`;
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
        `${releasedFormId}-A.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });

    it("Verify attached file length more than 50 bytes", () => {
      const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
        downloadFile.replace(".zip", ""), "image.jpg");
      cy.readFile(attachedFile).its("length").should("be.gt", 50);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A.pdf`,
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

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nPRT-00001, REV 1, PART DOCUMENT1`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/image.jpg\nAttachments/);

        expect(el).match(/Part to be Manufactured\nPRT-00001 - 1 Part document1/);

        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Initial Quantity\n10/);

        expect(el).match(/End Quantity\n20/);

        expect(el).match(/fb-textfield\nLHR textfield/);

        expect(el).match(/fb-textfield-1\nNone/);

        expect(el).match(/Checkbox/);
        expect(el).match(/1 2 3/);

        expect(el).match(/TEXT FIELD\nTEXT FIELD/);

        // eslint-disable-next-line max-len
        tmpRegex = new RegExp(`APPROVALS\\n${USERS[1].name} \\- .*@.* \\| APPROVED \\| ${pdfDocRelDate}.*`);
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 for paper LHR", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        // eslint-disable-next-line max-len
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nPRT-00001, REV 1, PART DOCUMENT1`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-fileupload/);

        tmpRegex = new RegExp( `\\((.*)\\) fb-fileupload`, "gi" );
        expect(el).match(tmpRegex);

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        tmpRegex  = (el).match(/\((.*)\)\sfb-fileupload/);
        imageFile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""), tmpRegex[1], "test.docx");

        expect(el).match(/test.docx/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });

    it(`Verify uploaded file exists in downloaded directory`, () => {
      cy.readFile(imageFile).its("length").should("be.gt", 0);
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
      cy.lhrVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify 'Part number/rev'", () => {
      cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document1` });
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
      cy.lhrVerifyFilterByTemplate({ template: `FM-00002` });
    });

    it("Verify 'ID'", () => {
      cy.lhrVerifyFilterById({ id: `LHR-00001` });
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
      cy.get("[name=\"lhr-end-quantity\"]").clear().arrowType("25");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save it", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Submit for approval", () => {
      cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });

    it(`Verify that FM is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it(`Verify lot is same as earlier release`, () => {
      cy.get("#HeaderInfo-subtitle").should("contain.text", `${lotIdRef}01`);
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
      cy.lhrVerifyFilterByOwner({ owner: USERS[1].name });
    });

    it("Verify 'Part number/rev'", () => {
      cy.lhrVerifyFilterByPartNumberRev({ part: `PRT-00001.1 Part document1` });
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
      cy.lhrVerifyFilterByTemplate({ template: `FM-00002` });
    });

    it("Verify 'ID'", () => {
      cy.lhrVerifyFilterById({ id: `LHR-00001` });
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

  context(`Revise paper LHR document`, () => {
    it("Click Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Choose 'Void OBS' option", () => {
      cy.get(`[name="revisionChangeType"][value="OBSOLETE"]`).arrowClick();
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save it", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Submit for approval", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it("Enter description in the dialog box", () => {
      cy.get(`[name="voidDescription"]`).arrowType("void description entered");
    });

    it("Click on Yes button", () => {
      cy.get(`button[data-cy="fb-control-btn"]`).contains("Yes").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });
  });

  context(`Verify document status as ${STATUS_TYPES_LABEL.OBSOLETE} and Send to Email`, () => {
    it(`Check doc status as ${STATUS_TYPES_LABEL.OBSOLETE}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.OBSOLETE });
      cy.get("[data-cy='HeaderInfo-Rev']").should("contain.text", "Rev Void");
    });

    it("Check if 'Send To Email' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });
  });

  context("Verify email notification for paper LHR", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Export for document ${releasedFormId}`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
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
            company.id],
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
    it("Download zip file containing Change order form", () => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          downloadFile  =  `${releasedFormId}-A-2__${fileTimeFormat}_void.zip`;
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
        `${releasedFormId}-A-2-Void.pdf`);
      cy.readFile(pdffile).its("length").should("be.gt", 500);
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content from form", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${releasedFormId}-A-2-Void.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(1);
        expect(cdata.text).match(/Page 1 of 1/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 1")) {
            pages[0] = element;
          }
        });
      });
    });

    it("Verify page 1 for paper LHR", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 1")) {
        tmpRegex = new RegExp( `Paper Lot History Record\n${lotIdRef}01RD\nN/A`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Attachments\nNone/);

        expect(el).not.match(/Part to be Manufactured\nPRT-00001 - 1 Part document1/);
        tmpRegex = new RegExp( `Build Type\\n R&D(.*)Production`, "gi" );
        expect(el).not.match(tmpRegex);

        expect(el).not.match(/image.jpg/);

        expect(el).match(/Obsolete/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 3, ${pdfDocRelDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 1/);
      }
    });
  });
});

export { };

