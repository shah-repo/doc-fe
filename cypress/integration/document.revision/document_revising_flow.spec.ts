// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing revision";

context("Document Revising Flow", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
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
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Creates document revision for revison", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
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

  context("Start document revision flow", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filters document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Draft" });
    });

    it("Approves and releases document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Clicks on revise document", () => {
      SystemRequirement("REQ-0150");
      cy.drClickReviseDocument();
    });
  });

  context("Edit document attributes", () => {
    it("Edits document title", () => {
      SystemRequirement("REQ-0160");
      cy.drEnterDocumentTitle({ name: " :Edit" });
    });

    it("Edits document description", () => {
      SystemRequirement("REQ-0160");
      cy.drEnterDocumentDescription({ description: " Edit: " });
    });

    it("Edits training required", () => {
      SystemRequirement("REQ-0160");
      cy.drClickTrainingRequired();
    });

    context("Edit attachments", () => {
      it("Uploads text.docx", () => {
        cy.atchUploadAttachment({ fileName: "test.docx" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });

      it("Check test.docx attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "test.docx", attributes: "11.00 B Microsoft Word File" });
      });

      it("Uploads image.jpg", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Check image.jpg attachment atributes", () => {
        cy.atchCheckAtributes({ fileName: "image.jpg", attributes: "48.45 kB JPG File" });
      });

      it("Check two attachment are displayed: test.docx, image.jpg", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx", "image.jpg" ] });
      });

      it("Remove attachment image.jpg", () => {
        cy.atchRemoveAttachment({ fileName: "image.jpg" });
      });

      it("Check one attachment is displayed: test.docx", () => {
        cy.atchCheckDisplayedAttachments({ fileNames: [ "test.docx" ] });
      });
    });
  });

  context("Save document", () => {
    it("Checks Type of Revision Changes Options", () => {
      SystemRequirement("REQ-0370");
      cy.drCheckTypeOfRevisionChangeOptions();
    });

    it("Choose 'Upgrade to Next Revision Level' Type of Revision Change", () => {
      SystemRequirement("REQ-0160");
      cy.drChooseTypeOfRevisionChangeOption({ option: "Upgrade to Next Revision Level" });
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });
});

export { };

