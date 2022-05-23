/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { pdfFooterDate } from "../../utils/constants/dateHandler";
import { Material } from "../../utils/constants/documentTypes/material";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let docId;
let pdfContent;
const pages = ["", "", "", "", ""];
let arId;
let tmpRegex;
let ebUrl;
let equipmentDocument;
let createdEquipmentFormDocument;
let materialsDocument;
let createdPartDocument;

context("Export Engineering Build doc", () => {
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
              Part,
              Material,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
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

    it("[API]Create equipment document", () => {
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
              description: "<p>Equipment document</p>",
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
              name: "Equipment document",
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

    it("[API]Create Equipment form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment Form document</p>",
          document: {
            docId: "FM-00009",
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
          name: "Equipment form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: equipmentDocumentType[0].id,
            }],
            schema: [],
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
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create materials document", () => {
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
          name: "Materials document",
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

    it("[API]Create part for eb document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part for EB document</p>",
          document: {
            docId: "PRT-00006",
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
          name: "Part for EB document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
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

  context("Create EB form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "EB form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Engineering Build' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      cy.unClick();
    });

    it("Add TextField", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.get("button[data-cy=\"fb-editor-mode-validation-1\"]").arrowClick();
      cy.get("input[name=\"validationMode\"]").eq(1).arrowClick();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-textfield" );
      cy.get(`[data-cy="validators.required_if.value"]`).arrowType("Y" );
      cy.fbAddNewFieldButton();
    });

    it("Add Procedure1", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
      cy.fbAddNewFieldButton();
    });

    it("Add Procedure2", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
      cy.fbAddNewFieldButton();
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchOtherUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Get ids", () => {
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        docId = $docIdElement.text();
      });
    });
  });

  context("Check pdf email and get content", () => {
    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: "Draft", filename: "-1-EB-form" }).then((data) => {
        pdfContent = data;
      });
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(5);
      expect(pdfContent.text).match(/Page 1 of 5/);
      expect(pdfContent.text).match(/Page 2 of 5/);
      expect(pdfContent.text).match(/Page 3 of 5/);
      expect(pdfContent.text).match(/Page 4 of 5/);
      expect(pdfContent.text).match(/Page 5 of 5/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
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

    it("Verify page 1 of EB form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\nNone`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nDescription/);

        expect(el).match(/Output Document Type\nEngineering Build/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield/);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/fb-checkbox-group/);
        expect(el).match(/MATERIALS/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 5/);
      }
    });

    it("Verify page 2 of EB form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/EQUIPMENT/);
        expect(el).match(/EB PROCEDURE/);
        expect(el).match(/STEP #1/);
        expect(el).match(/Description/);
        expect(el).match(/Attachments/);
        expect(el).match(/Materials/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 5/);
      }
    });

    it("Verify page 3 of EB form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment/);
        expect(el).match(/EB PROCEDURE/);
        expect(el).match(/STEP #2/);
        expect(el).match(/Description/);
        expect(el).match(/Attachments/);
        expect(el).match(/Materials/);
        expect(el).match(/Equipment/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 5/);
      }
    });

    it("Verify page 4 of EB form", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 5/);
      }
    });

    it("Verify page 5 of EB form", () => {
      const el = pages[4];
      if (el.includes("Page 5 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Draft/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: N/A`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 5 of 5/);
      }
    });
  });

  context("Verify pdf content after released", () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });
    });

    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: "Released", filename: "-1-EB-form" }).then((data) => {
        pdfContent = data;
      });
    });

    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(5);
      expect(pdfContent.text).match(/Page 1 of 5/);
      expect(pdfContent.text).match(/Page 2 of 5/);
      expect(pdfContent.text).match(/Page 3 of 5/);
      expect(pdfContent.text).match(/Page 4 of 5/);
      expect(pdfContent.text).match(/Page 5 of 5/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
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

    it("Verify page 1 of EB form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nDescription/);

        expect(el).match(/Output Document Type\nEngineering Build/);

        expect(el).match(/Attachments/);

        expect(el).match(/image.jpg/);

        expect(el).match(/fb-textfield/);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/fb-checkbox-group/);
        expect(el).match(/MATERIALS/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 5/);
      }
    });

    it("Verify page 2 of EB form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/EQUIPMENT/);
        expect(el).match(/EB PROCEDURE/);
        expect(el).match(/STEP #1/);
        expect(el).match(/Description/);
        expect(el).match(/Attachments/);
        expect(el).match(/Materials/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 5/);
      }
    });

    it("Verify page 3 of EB form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment/);
        expect(el).match(/EB PROCEDURE/);
        expect(el).match(/STEP #2/);
        expect(el).match(/Description/);
        expect(el).match(/Attachments/);
        expect(el).match(/Materials/);
        expect(el).match(/Equipment/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 5/);
      }
    });

    it("Verify page 4 of EB form", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 5/);
      }
    });

    it("Verify page 5 of EB form", () => {
      const el = pages[4];
      if (el.includes("Page 5 of 5")) {
        tmpRegex = new
        RegExp( `Form\n${docId}, Revision 1\nEB FORM`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 5 of 5/);
      }
    });
  });

  context("Create new Eb doc from form", () => {
    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromFormRecord();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'EB doc'", () => {
      cy.drEnterDocumentTitle({ name: "EB doc" });
    });

    it("Enter description 'EB doc description'", () => {
      cy.drEnterDocumentDescription({ description: "EB doc description" });
    });

    it("Add 2 Approvers", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
      cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
    });

    it("Remove one approver", () => {
      cy.get("[name^=fb-approvals-fb-approvals-]").find(".MuiChip-deleteIcon").eq(1).arrowClick();
    });

    it("Upload video.mp4 as attachment", () => {
      cy.atchUploadAttachment({ fileName: "video.mp4" });
    });

    it("Fill fields", () => {
      cy.get("[data-cy^=fb-textfield-] input").arrowType("textfield");
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
    });

    it("Choose an existing part from the list of available parts", () => {
      cy.get("[data-cy=\"childrenParts\"]").autocompleteSelect("Part document");
    });

    it("Enter description to step #1", () => {
      cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Step #1 description" });
    });

    it("Add material document to step #1", () => {
      cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Materials document").arrowClick();
      cy.get("[name=\"quantity\"]").arrowType("2");
      cy.get("[data-cy=\"unit\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Each").arrowClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Add equipment document to step #1", () => {
      cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Equipment document").arrowClick();
      cy.unClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Upload attachment 'test_image.jpg' to step #1", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
        cy.pmUploadAttachment({ fileName: "test_image.jpg" });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description to step #2", () => {
      cy.mpiEnterDescriptionToStep({ numbOfStep: 2, description: "Step #2 description" });
    });

    it("Add material document to step #2", () => {
      cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(1).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Part document").arrowClick();
      cy.get("[name=\"quantity\"]").arrowType("3");
      cy.get("[data-cy=\"unit\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Each").arrowClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Add equipment document to step #2", () => {
      cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(1).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Equipment document").arrowClick();
      cy.unClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Upload attachment 'image.jpg' to step #2", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
        cy.fixture("image.jpg").then((fileContent) => {
          cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
            cy.get("[id^=\"fb-mediaalbum-upload\"]").eq(1).attachFile({
              fileContent: fileContent.toString(),
              fileName: "image.jpg",
              mimeType: "*",
              filePath: `fixtures/${"image.jpg"}`,
            });
          });
        });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Step #3", () => {
      cy.get("[data-cy=\"form.builder.add.step\"]").eq(1).arrowClick();
    });

    it("Save the EB", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for Approval", () => {
      cy.pmSubmitForApproval();
      cy.url().then((url: any) => {
        ebUrl = url;
      });
    });
  });

  context(`Login as ${USERS[2].name} approver`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Open EB", () => {
      cy.visit(ebUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Reject button", () => {
      cy.get("[data-cy=\"common.reject\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Login as EB owner`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Open EB and export pdf by send mail", () => {
    it("Open EB", () => {
      cy.visit(ebUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Get ids", () => {
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        docId = $docIdElement.text();
      });
    });
  });

  context("Verify pdf content", () => {
    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: "WIP", filename: "-A-EB-doc" }).then((data) => {
        pdfContent = data;
      });
    });

    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(4);
      expect(pdfContent.text).match(/Page 1 of 4/);
      expect(pdfContent.text).match(/Page 2 of 4/);
      expect(pdfContent.text).match(/Page 3 of 4/);
      expect(pdfContent.text).match(/Page 4 of 4/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
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

    it("Verify page 1 of EB form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEB doc description/);
        expect(el).match(/Part\nPRT-00005 Part document/);
        expect(el).match(/Attachments/);
        expect(el).match(/video.mp4/);

        tmpRegex = new RegExp(`APPROVALS\n${USERS[2].name} - ${USERS[2].email} | DRAFT`);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/test.docx/);
        expect(el).match(/fb-textfield\ntextfield/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 of EB form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/MATERIALS/);
        expect(el).match(/MT-00004 - Materials document | ? | Qty: 2 each/);
        expect(el).match(/PRT-00005 - Part document | ? | Qty: 3 each/);
        expect(el).match(/EQUIPMENT\nET-00003 - Equipment document/);
        expect(el).match(/EB PROCEDURE\nSTEP #1/);
        expect(el).match(/Step #1 description/);
        expect(el).match(/Attachments/);
        expect(el).match(/test_image.jpg/);
        expect(el).match(/Materials\nMT-00004 - Materials document | ? | Qty: 2 each/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 of EB form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nET-00003 - Equipment document/);
        expect(el).match(/EB PROCEDURE\nSTEP #2/);
        expect(el).match(/Step #2 description/);
        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);
        expect(el).match(/Materials\nPRT-00005 - Part document | ? | Qty: 3 each/);
        expect(el).match(/Equipment\nET-00003 - Equipment document/);
        expect(el).match(/STEP #3/);
        expect(el).match(/Attachments\nNone\nMaterials\nNone/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 of EB form", () => {
      const el = pages[3];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nNone/);

        expect(el).match(/WIP/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

  context("Add Step #3 and approve EB", () => {
    it("Enter description to step #3", () => {
      cy.get("div[contenteditable]").eq(3).arrowClick({ force: true });
      cy.get("div[contenteditable]").eq(3)
        .clear().arrowType("Step #3 description");
      cy.unClick();
    });

    it("Add material document to step #3", () => {
      cy.get("[data-cy=\"form.builder.materials.btn\"]").eq(2).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Part document").arrowClick();
      cy.get("[name=\"quantity\"]").arrowType("4");
      cy.get("[data-cy=\"unit\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Each").arrowClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Add equipment document to step #3", () => {
      cy.get("[data-cy=\"form.builder.equipment.btn\"]").eq(2).arrowClick();
      cy.get("[data-cy=\"title\"]").arrowClick();
      cy.get("ul>li[role=option]").contains("Equipment document").arrowClick();
      cy.unClick();
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
    });

    it("Upload attachment 'dummy.pdf' to step #3", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAttachmentsAttached], () => {
        cy.fixture("dummy.pdf").then((fileContent) => {
          cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
            cy.get("[id^=\"fb-mediaalbum-upload\"]").eq(2).attachFile({
              fileContent: fileContent.toString(),
              fileName: "dummy.pdf",
              mimeType: "*",
              filePath: `fixtures/${"dummy.pdf"}`,
            });
          });
        });
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the EB", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for Approval", () => {
      cy.pmSubmitForApproval();
      cy.url().then((url: any) => {
        ebUrl = url;
      });
    });
  });

  context(`Login as ${USERS[2].name} approver`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Open EB", () => {
      cy.visit(ebUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Approve button", () => {
      cy.ebApprove();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Login as EB owner`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Open EB and export pdf by send mail", () => {
    it("Open EB", () => {
      cy.visit(ebUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Get ids", () => {
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        docId = $docIdElement.text();
      });
    });
  });

  context("Verify pdf content", () => {
    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: "Released", filename: "-A-EB-doc" }).then((data) => {
        pdfContent = data;
      });
    });

    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(4);
      expect(pdfContent.text).match(/Page 1 of 4/);
      expect(pdfContent.text).match(/Page 2 of 4/);
      expect(pdfContent.text).match(/Page 3 of 4/);
      expect(pdfContent.text).match(/Page 3 of 4/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
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
        if (element.includes("Page 3 of 4")) {
          pages[3] = element;
        }
      });
    });

    it("Verify page 1 of EB form", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nEB doc description/);
        expect(el).match(/Part\nPRT-00005 Part document/);
        expect(el).match(/Attachments/);
        expect(el).match(/video.mp4/);

        tmpRegex = new RegExp(`APPROVALS\n${USERS[2].name} - ${USERS[2].email} | APPROVED`);
        expect(el).match(/fb-fileupload/);
        expect(el).match(/test.docx/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 2 of EB form", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/fb-textfield\ntextfield/);
        expect(el).match(/MATERIALS/);
        expect(el).match(/MT-00004 - Materials document | ? | Qty: 2 each/);
        expect(el).match(/PRT-00005 - Part document | ? | Qty: 3 each/);
        expect(el).match(/EQUIPMENT\nET-00003 - Equipment document/);
        expect(el).match(/EB PROCEDURE\nSTEP #1/);
        expect(el).match(/Step #1 description/);
        expect(el).match(/Attachments/);
        expect(el).match(/test_image.jpg/);
        expect(el).match(/Materials\nMT-00004 - Materials document | ? | Qty: 2 each/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 3 of EB form", () => {
      const el = pages[2];
      if (el.includes("Page 3 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Equipment\nET-00003 - Equipment document/);
        expect(el).match(/EB PROCEDURE\nSTEP #2/);
        expect(el).match(/Step #2 description/);
        expect(el).match(/Attachments/);
        expect(el).match(/image.jpg/);
        expect(el).match(/Materials\nPRT-00005 - Part document | ? | Qty: 3 each/);
        expect(el).match(/Equipment\nET-00003 - Equipment document/);
        expect(el).match(/STEP #3/);
        expect(el).match(/Step #3 description/);
        expect(el).match(/Attachments/);
        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 3 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });

    it("Verify page 4 of EB form", () => {
      const el = pages[2];
      if (el.includes("Page 4 of 4")) {
        tmpRegex = new
        RegExp( `Engineering Build\n${docId}, Revision A\nEB DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/dummy.pdf/);
        expect(el).match(/Materials\nMT-00005 - Part document | ? | Qty: 4 each/);
        expect(el).match(/Equipment\nET-00003 - Equipment document/);
        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Form Info: FM-00002, Revision 1, ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 4 of 4/);

        tmpRegex = new RegExp(`Doc status|Reference|Reference by|Training Required fields`, "gi");
        expect(el).not.match(tmpRegex);
      }
    });
  });

});

export { };

