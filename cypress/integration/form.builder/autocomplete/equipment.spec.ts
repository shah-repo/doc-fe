// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import path from "path";
import { IMAPEmailsInTesting } from "../../../support/commands/imap/commands";
import { CONFIG } from "../../../support/config";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let formId;
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let equipmentTitle;
let emailsFromInbox;
let emailDateOffset;
let fileTimeFormat;
let pages;
let pdfFooterDate;

const equipmentTitle = `Equipment`;
const equipmentTitleForm = `Equipment Form`;

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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });
  });

  context("Create form for Preventative maintenance", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Preventative Maintenance form'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance form" });
    });

    it("Enter description 'Preventative Maintenance form description'", () => {
      cy.drEnterDocumentDescription({ description: "Preventative Maintenance form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create form for Calibration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Calibration form'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration form" });
    });

    it("Enter description 'Calibration form description'", () => {
      cy.drEnterDocumentDescription({ description: "Calibration form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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

      it("Add autocomplete of “Approvers” and set validation", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "Autocomplete-Approvers" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Approvers");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddField();
      });

      it("Add select field and set validation ", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.fbFieldRequiredIf();
        cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("Autocomplete-Approvers");
        cy.get(`[data-cy="validators.required_if.value"]`).autocompleteSelect(`${USERS[1].email }`);
        cy.fbAddField();
      });

      it("EQUIPMENT SECTIONS", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Equipment 1" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbAddField();
      });

      it("EQUIPMENT SECTIONS", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Equipment 2" });
        cy.get("input[value=\"calibration\"]").arrowClick();
        cy.fbAddField();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Select references", () => {
        cy.drSelectReferences( "FM-00002" );
        cy.drSelectReferences( "FM-00003" );
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify form Draft status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: "Draft" });
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
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      cy.pdfparseFile(
        {
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${formId}-1-${equipmentTitleForm}.pdf`,
        }).then((cdata) => {
        expect(cdata.numpages).eq(5);
        expect(cdata.text).match(/Page 1 of 5/);
        expect(cdata.text).match(/Page 2 of 5/);
        expect(cdata.text).match(/Page 3 of 5/);
        expect(cdata.text).match(/Page 4 of 5/);
        expect(cdata.text).match(/Page 5 of 5/);
        tmpRegex = new RegExp( "\\n\\n");
        const arr = cdata.text.split(tmpRegex);
        arr.forEach((element) => {
          if (element.includes("Page 1 of 5")) {
            pages[0] = element;
          }
          if (element.includes("Page 2 of 5")) {
            pages[1] = element;
          }
          if (element.includes("Page 3 of 5")) {
            pages[2] = element;
          }
          if (element.includes("Page 4 of 5")) {
            pages[3] = element;
          }
          if (element.includes("Page 5 of 5")) {
            pages[4] = element;
          }
        });
      });
    });

    it("Verify page 1 in document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/AR ID\nNone/);

        expect(el).match(/Description\nNew Document Revision description/);

        expect(el).match(/Output Document Type\nTest Document Type/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield1/);

        expect(el).match(/STEP #1\nDescription/);

        expect(el).match(/Attachments\nMaterials\nEquipment/);

        expect(el).match(/fb-instructions1/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 in document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/video.mp4/);

        expect(el).match(/FB-PO-APPROVAL-MATRIX1/);

        expect(el).match(/LEVEL NAMELIMITSIGNATURE 1SIGNATURE 2SIGNATURE 3/);

        expect(el).match(/APPROVAL ROLES/);

        expect(el).match(/APPROVAL MATRIX/);

        // eslint-disable-next-line max-len
        expect(el).match(/PREFIX\nINTERNAL\nTYPE\nDOCUMENT\nTYPE\nTRAINING\nREQUIRED\nNEEDS\nSIGNATURE\nCATEGORY\nAPPROVALS\nNUMERIC\nAPPROVALS\nNUMERIC\nALPHA\nAPPROVALS\nALPHA\nAPPROVALS\nADMINISTRATIVE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 in document", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Purchase Orders/);

        expect(el).match(/ITEMPART NUMBERSUPPLIER PART NUMBERDESCRIPTIONORDEREDRECEIPT QTYUNITSTAXSUM/);

        expect(el).match(/fb-quantity1/);

        expect(el).match(/FB-BLANK-TEMPLATE1/);

        expect(el).match(/TestTemplate.json/);

        expect(el).match(/fb-fileupload1/);

        expect(el).match(/fb-paragraph1/);

        tmpRegex = new RegExp( `fb-radiobutton-group1\n(.*)option1(.*)option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-select-field1\nfb-hyperlink1/);

        expect(el).match(/fb-datepicker1/);

        expect(el).match(/fb-text-editor1/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 in document", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-autocomplete-doc-approvers1/);

        expect(el).match(/fb-autocomplete-parts1/);

        expect(el).match(/fb-autocomplete-doc-revision1/);

        tmpRegex = new RegExp( `fb-checkbox-group1\n(.*)\n(.*)\n(.*)\n(.*)\noption1 option2`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/FB-SUBSECTION1/);

        expect(el).match(/FB-SECTION1/);

        expect(el).match(/FB-STEP #1/);

        expect(el).match(/fb-evidence/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 5 in document", () => {
      const el = pages[4];
      if (el.includes("Page 5 of 5")) {
        tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 5 of 5/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Create New Equipment", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Click create document", () => {
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
      cy.drSelectReferences( "FM-00002" );
      cy.drSelectReferences( "FM-00003" );
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[1].name}' for Coordinator`, () => {
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[2].name}' for Autocomplete-Approvers`, () => {
      cy.get(`input[data-cy=data-cy=\"autocomplete-approvers-l2r2phee\"]`).arrowClick();
      cy.get("ul>li[role=\"combobox\"]").contains(USERS[2].name).arrowClick();
    });

    it("Autocomplete-Approvers", () => {
      cy.get(`input[data-cy="autocomplete-approvers-l2r2phee"]`).autocompleteSelect(`${USERS[2].email }`);
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("365");
      cy.unClick();
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"preventative\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("365");
    });

    it("Type calibration maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();

    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("", () => {
    it("Verify form Draft status and click on Send To Email", () => {
      cy.drCheckDocumentStatus({ status: "Draft" });
      cy.arCheckTitleInEditableAndMatches({ name: "New Document Revision" });
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

  // context("Verify draft form email notification", () => {
  //   it("Get emails", () => {
  //     dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
  //     const getEmailSetting =  {
  //       to: CONFIG.TEST_EMAIL,
  //       // eslint-disable-next-line @typescript-eslint/camelcase
  //       wait_time_sec: 5,
  //       // eslint-disable-next-line @typescript-eslint/camelcase
  //       max_wait_time_sec: 50,
  //       // eslint-disable-next-line @typescript-eslint/camelcase
  //       include_body: true,
  //       after: dateAfterEmailShouldArrive,
  //       subject: `Export for document ${formId}`,
  //     };
  //     cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
  //       if (emails) {
  //         emailsFromInbox = emails;
  //         expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
  //         downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
  //       }
  //       else {
  //         assert.fail("No email found");
  //       }
  //     });
  //   });

  //   it("Verify the emails that should be received", () => {
  //     const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
  //       {
  //         sentToUser: USERS[1].email,
  //         contains: [`Hello <b>${USERS[1].name},</b>`,
  //           "Your documents are ready for download.",
  //           "<button type=\"button\">DOWNLOAD</button>",
  //           createdCompany.id],
  //       }];

  //     cy.imapVerifyEmailsInList({
  //       receivedEmails: emailsFromInbox,
  //       emailsToTest: emailsThatShouldBeReceived,
  //       getEmailsSincedate: dateAfterEmailShouldArrive,
  //       assertNumberOfEmailsFoundInList: 1,
  //     });
  //   });
  // });

  // context("Verify that zip file containing pdf downloaded", () => {
  //   it("Download zip file containing training form", () => {
  //     expect(downloadUrl).contains("exported_file_download");
  //     fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

  //     cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
  //       if (res.body !== "") {
  //         downloadUrl = res.body.url;
  //         downloadFile  =  `${formId}${fileTimeFormat}_draft.zip`;
  //         cy.downloadFile({
  //           url: downloadUrl,
  //           directory: CONFIG.DOWNLOADS_DIR,
  //           fileName: downloadFile,
  //         });
  //       }
  //     });
  //   });

  //   it("Verify file size of the downloaded zip file", () => {
  //     const zipfile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile);
  //     cy.readFile(zipfile).its("length").should("be.gt", 500);
  //   });

  //   it("unzip and extract pdf file from zip file", () => {
  //     cy.unzipFile(
  //       {
  //         directory: CONFIG.DOWNLOADS_DIR,
  //         fileName: downloadFile,
  //       });
  //     const pdffile = path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", ""),
  //       `${formId}-1-New-Document-Revision.pdf`);
  //     cy.readFile(pdffile).its("length").should("be.gt", 500);
  //   });

  //   it("Verify attached file length more than 500 bytes", () => {
  //     const attachedFile = path.join(CONFIG.DOWNLOADS_DIR,
  //       downloadFile.replace(".zip", ""), "image.jpg");
  //     cy.readFile(attachedFile).its("length").should("be.gt", 500);
  //   });
  // });

  // context("Verify PDF file content", () => {
  //   it("Extract texts from PDF file content", () => {
  //     cy.pdfparseFile(
  //       {
  //         directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
  //         fileName: `${formId}-1-New-Document-Revision.pdf`,
  //       }).then((cdata) => {
  //       expect(cdata.numpages).eq(5);
  //       expect(cdata.text).match(/Page 1 of 5/);
  //       expect(cdata.text).match(/Page 2 of 5/);
  //       expect(cdata.text).match(/Page 3 of 5/);
  //       expect(cdata.text).match(/Page 4 of 5/);
  //       expect(cdata.text).match(/Page 5 of 5/);
  //       tmpRegex = new RegExp( "\\n\\n");
  //       const arr = cdata.text.split(tmpRegex);
  //       arr.forEach((element) => {
  //         if (element.includes("Page 1 of 5")) {
  //           pages[0] = element;
  //         }
  //         if (element.includes("Page 2 of 5")) {
  //           pages[1] = element;
  //         }
  //         if (element.includes("Page 3 of 5")) {
  //           pages[2] = element;
  //         }
  //         if (element.includes("Page 4 of 5")) {
  //           pages[3] = element;
  //         }
  //         if (element.includes("Page 5 of 5")) {
  //           pages[4] = element;
  //         }
  //       });
  //     });
  //   });

  //   it("Verify page 1 in document", () => {
  //     const el = pages[0];
  //     if (el.includes("Page 1 of 5")) {
  //       tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/AR ID\nNone/);

  //       expect(el).match(/Description\nNew Document Revision description/);

  //       expect(el).match(/Output Document Type\nTest Document Type/);

  //       expect(el).match(/Attachments/);

  //       expect(el).match(/image.jpg/);

  //       expect(el).match(/fb-textfield1/);

  //       expect(el).match(/STEP #1\nDescription/);

  //       expect(el).match(/Attachments\nMaterials\nEquipment/);

  //       expect(el).match(/fb-instructions1/);

  //       expect(el).match(/Draft/);

  //       tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
  //       expect(el).match(tmpRegex);

  //       tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Page 1 of 5/);

  //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
  //       expect(el).not.match(tmpRegex);
  //     }
  //   });

  //   it("Verify page 2 in document", () => {
  //     const el = pages[1];
  //     if (el.includes("Page 2 of 5")) {
  //       tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/video.mp4/);

  //       expect(el).match(/FB-PO-APPROVAL-MATRIX1/);

  //       expect(el).match(/LEVEL NAMELIMITSIGNATURE 1SIGNATURE 2SIGNATURE 3/);

  //       expect(el).match(/APPROVAL ROLES/);

  //       expect(el).match(/APPROVAL MATRIX/);

  //       // eslint-disable-next-line max-len
  //       expect(el).match(/PREFIX\nINTERNAL\nTYPE\nDOCUMENT\nTYPE\nTRAINING\nREQUIRED\nNEEDS\nSIGNATURE\nCATEGORY\nAPPROVALS\nNUMERIC\nAPPROVALS\nNUMERIC\nALPHA\nAPPROVALS\nALPHA\nAPPROVALS\nADMINISTRATIVE/);

  //       expect(el).match(/Draft/);

  //       tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
  //       expect(el).match(tmpRegex);

  //       tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Page 2 of 5/);

  //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
  //       expect(el).not.match(tmpRegex);
  //     }
  //   });

  //   it("Verify page 3 in document", () => {
  //     const el = pages[2];
  //     if (el.includes("Page 3 of 5")) {
  //       tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Purchase Orders/);

  //       expect(el).match(/ITEMPART NUMBERSUPPLIER PART NUMBERDESCRIPTIONORDEREDRECEIPT QTYUNITSTAXSUM/);

  //       expect(el).match(/fb-quantity1/);

  //       expect(el).match(/FB-BLANK-TEMPLATE1/);

  //       expect(el).match(/TestTemplate.json/);

  //       expect(el).match(/fb-fileupload1/);

  //       expect(el).match(/fb-paragraph1/);

  //       tmpRegex = new RegExp( `fb-radiobutton-group1\n(.*)option1(.*)option2`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/fb-select-field1\nfb-hyperlink1/);

  //       expect(el).match(/fb-datepicker1/);

  //       expect(el).match(/fb-text-editor1/);

  //       expect(el).match(/Draft/);

  //       tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
  //       expect(el).match(tmpRegex);

  //       tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Page 3 of 5/);

  //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
  //       expect(el).not.match(tmpRegex);
  //     }
  //   });

  //   it("Verify page 4 in document", () => {
  //     const el = pages[3];
  //     if (el.includes("Page 4 of 5")) {
  //       tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/fb-autocomplete-doc-approvers1/);

  //       expect(el).match(/fb-autocomplete-parts1/);

  //       expect(el).match(/fb-autocomplete-doc-revision1/);

  //       tmpRegex = new RegExp( `fb-checkbox-group1\n(.*)\n(.*)\n(.*)\n(.*)\noption1 option2`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/FB-SUBSECTION1/);

  //       expect(el).match(/FB-SECTION1/);

  //       expect(el).match(/FB-STEP #1/);

  //       expect(el).match(/fb-evidence/);

  //       expect(el).match(/Draft/);

  //       tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
  //       expect(el).match(tmpRegex);

  //       tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Page 4 of 5/);

  //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
  //       expect(el).not.match(tmpRegex);
  //     }
  //   });

  //   it("Verify page 5 in document", () => {
  //     const el = pages[4];
  //     if (el.includes("Page 5 of 5")) {
  //       tmpRegex = new RegExp( `Form\n${formId}, Revision 1\nNEW DOCUMENT REVISION`, "gi" );
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

  //       expect(el).match(/Draft/);

  //       tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
  //       expect(el).match(tmpRegex);

  //       tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
  //       expect(el).match(tmpRegex);

  //       expect(el).match(/Page 5 of 5/);

  //       tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
  //       expect(el).not.match(tmpRegex);
  //     }
  //   });
  // });

  context("Create 'Equipment'", () => {
    it("Click create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter document title " + equipmentTitle, () => {
      cy.drEnterDocumentTitle({ name: equipmentTitle });
    });

    it("Enter document description 'Equipment document description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment document description" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
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

      it("Select 'Component Protocol' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      });

      context("Add form fields", () => {
        it("Add Autocomplete", () => {
          cy.fbAddNewField();
          cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
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
