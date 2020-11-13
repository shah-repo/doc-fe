// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;

context("Procedure and parts flow test", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Equipment",
                documentTypeAcronym: "ET-",
                group: "OTHER",
                isQms: true,
                needsSignature: true,
                category: "Equipment",
              },
              {
                documentTypeName: "Material",
                documentTypeAcronym: "MT-",
                group: "OTHER",
                isQms: true,
                needsSignature: true,
                category: "Materials",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });

    it("[API]Create equipment document", () => {
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
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
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
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
          },
          employeeId: secondEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });
  });

  context("Login second user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create equipment document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'New Equipment for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "New Equipment for procedure" });
      });

      it("Enters description 'Equipment description'", () => {
        cy.drEnterDocumentDescription({ description: "Equipment description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Equipment' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Equipment" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create materials document", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'New Material for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "New Material for procedure" });
      });

      it("Enters description 'Material description'", () => {
        cy.drEnterDocumentDescription({ description: "Material description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Equipment' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Material" });
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create document with procedure field", () => {
    context("Fill document attributes", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "Form document for procedure" });
      });

      it("Enters description 'Procedure description'", () => {
        cy.drEnterDocumentDescription({ description: "Procedure description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });

      it("Add procedure field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectCustomFieldToAdd({ name: "Procedure" });
        cy.fbAddField();
      });
    });

    context("Create document and release it", () => {
      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });


  context("Create procedure document", () => {
    it("Click create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });
    context("Fill procedure document attributes", () => {
      it("Enters title 'Form document for procedure'", () => {
        cy.drEnterDocumentTitle({ name: "Procedure document" });
      });

      it("Enters description 'Procedure description'", () => {
        cy.drEnterDocumentDescription({ description: "Procedure description" });
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Add material document", () => {
        cy.pmAddMaterialDocumentToProcedure({
          materialDoc: "Materials document",
          numberOfMaterial: 2,
          typeOfMaterial: "gram",
        });
      });

      it("Add free material text", () => {
        cy.pmAddFreeTextMaterial({
          material: "Free text material",
          numberOfMaterial: 3,
          typeOfMaterial: "pounds",
        });
      });

      it("Add equipment document", () => {
        cy.pmAddEquipmentDocument({ equipmentDoc: "Equipment document" });
      });

      it("Add free equipment text", () => {
        cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
      });

      it("Upload attachment 'image.jpg'", () => {
        cy.get("[data-cy=\"media.upload\"]>div>div>button").click();
        cy.pmUploadAttachment({ fileName: "image.jpg" });
      });

      it("Upload attachment 'test.docx'", () => {
        cy.pmUploadAttachment({ fileName: "test.docx" });
      });
    });

    context("Create procedure and release it", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve procedure", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovalsApprove, () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });
  });

  context("Copy to EB and verify materials and equipment tracking", () => {
    it("Click copy to EB", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFileUploadCandidates, CyRoutes.GetFileUploadCandidates], () => {
        cy.get("[data-cy=\"PreviewControlsContainer-copy-to\"]").click();
      });
    });

    context("Add materials and equipments", () => {
      it("Add material document", () => {
        cy.pmAddMaterialDocumentToProcedure({
          materialDoc: "New Material for procedure",
          numberOfMaterial: 3,
          typeOfMaterial: "gram",
        });
      });

      it("Add free material text", () => {
        cy.pmAddFreeTextMaterial({
          material: "Free text material",
          numberOfMaterial: 2,
          typeOfMaterial: "pounds",
        });
      });

      it("Add equipment document", () => {
        cy.pmAddEquipmentDocument({ equipmentDoc: "New Equipment for procedure" });
      });

      it("Add free equipment text", () => {
        cy.pmAddFreeTextEquipment({ equipment: "Free text equipment" });
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify change from previous build", () => {
      it("Click 'Show changes from previous build'", () => {
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'New Material for procedure' is added to materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(0)
          .should("contain.text", "New Material for procedure")
          .should("contain.text", "Qty: 3")
          .should("contain.text", "gram");
      });

      it("Verify 'Free text material' has increased number of materials to '5'", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(2)
          .should("contain.text", "Free text material")
          .should("contain.text", "Qty: 5 pounds");
      });

      it("Verify 'New Equipment for procedure' is added to equipments", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(0)
          .should("contain.text", "New Equipment for procedure");
      });
    });

    context("Create procedure and release it", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve procedure", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovalsApprove, () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });
  });

  context("Copy to EB and verify materials and equipment tracking", () => {
    it("Click copy to EB", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetFileUploadCandidates, CyRoutes.GetFileUploadCandidates], () => {
        cy.get("[data-cy=\"PreviewControlsContainer-copy-to\"]").click();
      });
    });

    context("Add materials and equipments", () => {
      it("Remove 'Materials document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(1).click();
      });

      it("Remove 'Free text material'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.materials.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Free text equipment'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(2).click();
      });

      it("Remove 'Equipment document'", () => {
        cy.xpath("//div[@data-cy=\"form.builder.procedure.equipment.title\"]/../div[3]/button").eq(1).click();
      });

      it("Add approver to approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify change from previous build", () => {
      it("Click 'Show changes from previous build'", () => {
        cy.pmToggleChangesFromPrevBuild();
      });

      it("Verify 'Materials document' is removed from materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(2)
          .should("contain.text", "MT-00004 - Materials document | Qty: 2 gram");
      });

      it("Verify 'Free text material' is removed from materials", () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").eq(1)
          .should("contain.text", "Free text material | Qty: 5 pounds");
      });

      it("Verify 'Equipment document' is removed from equipment", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(1)
          .should("contain.text", "ET-00003 - Equipment document");
      });

      it("Verify 'Free text equipment' is removed from equipment", () => {
        cy.get("[data-cy=\"form.builder.procedure.equipment.title\"]").eq(2)
          .should("contain.text", "Free text equipment");
      });
    });

    context("Create procedure and release it", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve procedure", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovalsApprove, () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });
  });
});

export { };

