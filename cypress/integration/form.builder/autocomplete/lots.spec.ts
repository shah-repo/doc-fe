// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
const lotsTitle = `Lots ${Cypress.moment().format("X")}`;

context("Autocomplete 'Lots' test", () => {
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
        cy.drEnterDocumentTitle({ name: "Lots title" });
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

      it("Select 'Component Specifications Lot' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Component Specifications Lot" });
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
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Click on Create new", () => {
        cy.poClickCreatePO();
      });

      it("Select 'Component Specifications Lot' from the dropdown", () => {
        cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
        cy.wait(500);
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview, CyRoutes.GetAvailableApprovers], () => {
          cy.get("div[id^=react-select]").contains("Component Specifications Lot").click();
        });
      });

      it("Add lot title", () => {
        cy.drEnterDocumentTitle({ name: lotsTitle });
      });

      it("Select 'Part document' in references", () => {
        cy.drSelectReferences( "Part document" );
      });

      it("Enter quantity received", () => {
        cy.get("[name=\"lot_quantity\"]").type("12");
      });

      it("Check 100% override", () => {
        cy.get("[value=\"100% Inspection Override\"]").check();
      });

      it("Create 'Preventative maintenance document'", () => {
        cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
        cy.wait(5000);
      });

      it("Add an Approval'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetDocAggregatedAudit, () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.get("[data-cy=\"fb-control-btn\"]").eq(1).click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

      it("Logs user in & Selects company", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
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
        });

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label" });
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
            cy.wait(3000);
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").click();

            if (response.body.length > 0 ) {
              cy.get(".MuiAutocomplete-popper ul li")
                .each(($li, index, $lis) => {
                  const res = response.body[index];
                  expect($li).to.have.text(`${res.document.docId} - rev ${res.displayRevision} - ${res.name}`);
                })
                .then(($lis) => {
                  expect($lis).to.have.length(response.body.length);
                });
            } else {
              cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
            }
          });
        });

        it("Verify created 'Lots' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", lotsTitle);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
