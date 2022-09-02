import "moment-timezone";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let RDdocumentType;

context(
  `Scenario 2.1 Status bar design of new items approved via approval block (Regular Record, PO, 
  Supplier, RC, EB TC).`,
  () => {
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
              documentTypes: [RecordDocumentType],
            },
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
            RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
            done();
          });
        });
      });

      context("[API]Update record document type", () => {
        it("Change fields config in record document type", () => {
          cy.drUpdateDocumentTypeName({
            sessionId: loginResponse.sessionId,
            employeeId: adminEmployee.id,
            id: RDdocumentType[0].id,
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

      it("[API]Login second tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[2].email,
        }).then((response) => {
          loginResponse = response;
          done();
        });
      });

      it("[API]Login admin tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          loginResponse = response;
          adminSessionId = loginResponse.sessionId;
          done();
        });
      });
    });

    context("[API]Add employee to developers group", () => {
      it("[API]Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          developersGroup = response;
          done();
        });
      });

      it("[API]Patch group", () => {
        cy.grpPatchGroup({
          groupId: developersGroup.body[0].id,
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: employeeToDevs.id }],
          },
        });
      });
    });

    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
      });
    });

    context(`Create a new form with an output of internal type Record`, () => {
      context("Create Record with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Regular Record Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Regular Record Form Title" });
          });

          it("Enters description 'Regular Record Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Regular Record Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Record Document' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Record Document" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });

          it("Upload attachement picture 'image.jpg'", () => {
            cy.atchUploadAttachment({ fileName: "image.jpg" });
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context(`Create a new form with an output of internal type PO`, () => {
      context("Create PO with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'PO Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "PO Form Title" });
          });

          it("Enters description 'PO Form description'", () => {
            cy.drEnterDocumentDescription({ description: "PO Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Purchase Order' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context(`Create a new form with an output of internal type Suppliers`, () => {
      context("Create Suppliers with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Suppliers Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Suppliers Form Title" });
          });

          it("Enters description 'Suppliers Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Suppliers Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Suppliers' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Suppliers" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context(`Create a new form with an output of internal type Receivable`, () => {
      context("Create Receivable with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Receivable Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Receivable Form Title" });
          });

          it("Enters description 'Receivable Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Receivable Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Receivable' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Receivable" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context(`Create a new form with an output of internal type Engineering Build`, () => {
      context("Create Engineering Build with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Engineering Build Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Engineering Build Form Title" });
          });

          it("Enters description 'Engineering Build Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Engineering Build Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Engineering Build' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context(`Create a new form with an output of internal type Training Curriculum`, () => {
      context("Create Training Curriculum with form", () => {
        context("Start document creation flow", () => {
          it("Navigates to document list", () => {
            cy.navigToDocumentList();
          });

          it("Clicks on 'create a document' button", () => {
            cy.cmpClickCreateNewDocument();
          });
        });

        context("Fill in Form attributes", () => {
          it("Enters title 'Training Curriculum Form Title'", () => {
            cy.drEnterDocumentTitle({ name: "Training Curriculum Form Title" });
          });

          it("Enters description 'Training Curriculum Form description'", () => {
            cy.drEnterDocumentDescription({ description: "Training Curriculum Form description" });
          });

          it("Select 'Form' document type from dropdown", () => {
            cy.drSelectDocumentType({ documentType: "Form" });
          });

          it("Select 'Training Curriculum' output document type from dropdown", () => {
            cy.drSelectOutputDocumentType({ documentType: "Training Curriculum" });
          });

          it("Select 'Numeric' revision stage", () => {
            cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
          });

          it("Click create document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });

        context("Approve and Release Form", () => {
          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  }
);

export { };

