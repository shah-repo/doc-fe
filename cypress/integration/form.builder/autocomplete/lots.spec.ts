// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
const lotsTitle = `Lots ${Cypress.moment().format('X')}`;
let lotsNo;

context("FORM Field test", () => {
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
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Autocomplete 'Lots' test", () => {
    context("Create 'Lots' document", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'Lots title'", () => {
        cy.drEnterDocumentTitle({ name: 'Lots title' });
      });

      it("Enter document description 'Lots document description'", () => {
        cy.drEnterDocumentDescription({ description: "Lots document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lots" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          cy.fbClickButton({ el: "updateRecord" });
        });
      });
    });

    context("Create 'Lots'", () => {
      it("Click on 'Lots' in Manufacturing on sidebar", () => {
        cy.fbClickButton({ el: "navigation.manufacturing"});
        cy.fbClickButton({ el: "navigation.lots" });
      });

      it("Click on 'Add New Lot' button", () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });

      it("Enter Lot title "+ lotsTitle, () => {
        cy.get("#Title-field").type(lotsTitle);
      });

      it("Enter Quantity '1'", () => {
        cy.get("[name=\"lot_quantity\"]").type("1");
      });

      it("Click 'Create document'", () => {
        cy.fbClickButton({ el: "DocumentRevisionForm-submit" });
      });

      it("Get lots no", () => {
        cy.get("#HeaderInfo-docId").then((lot) => { lotsNo = lot.text() });
      });

      it("Click 'Accept Lot & confirm' button", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostOrPatchDocRev, CyRoutes.EmployeesGet], () => {
            cy.fbClickButton({ el: "ApproveAndRelease-button" });
            cy.wait(1000);
            cy.fbClickButton({ el: "ApproveAndRelease-submit" });

          });
      });

      it("Reload company", () => {
        cy.fbClickButton({ el: "UserMenuButton" });
        cy.get("#switchCompanyButton").click();
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });

    context("Add Autocomplete 'Lots'", () => {
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
        })

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label" });
          });

          it("Select 'Lots' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Lots{downarrow}{enter}");
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

      context("Verify Autocomplete 'Lots'", () => {
        it("Verify autocomplete 'Lots'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroupOptions%5B%5D=CAN_CREATE_INSPECTION&status%5B%5D=DRAFT&status%5B%5D=PENDING_CHANGE&status%5B%5D=SUBMITTED&status%5B%5D=IN_REVIEW&status%5B%5D=APPROVED&status%5B%5D=RELEASED`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[data-cy^=\"test-label-\"]").click();

            if(response.body.length > 0 ){
              cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(`${response.body[index].document.docId} - rev ${response.body[index].displayRevision} - ${response.body[index].name}`);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              })
             } else {
               cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
             }
          });
        });

        it("Verify created 'Lots' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", lotsNo).and("contain", lotsTitle);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should('have.length', 1);
        });
      });
    });
  });
});
