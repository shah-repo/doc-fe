// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;

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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

  context("Autocomplete 'Document Revision' test", () => {
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

        it("Select 'Document revisions' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
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

    context("Verify Autocomplete 'Document Revision'", () => {
      it("Verify autocomplete 'Document Revision'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.contain.text(response.body[index].document.docId);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Approval requests' test", () => {
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

        it("Select 'Approval requests' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Approval requests{downarrow}{enter}");
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

    context("Verify Autocomplete 'Approval requests'", () => {
      it("Verify autocomplete 'Approval requests'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/change_requests`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.contain.text(response.body[index].crId);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Approvers' test", () => {
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

        it("Select 'Approvers' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Approvers{downarrow}{enter}");
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

    context("Verify Autocomplete 'Approvers'", () => {
      it("Verify autocomplete 'Approvers'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/change_requests/available_approvers`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.optionalApprovers.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                const res = response.body.optionalApprovers[index];
                expect($li).to.have.text(`${res.user.name} - ${res.user.email}`);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.optionalApprovers.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Document types' test", () => {
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

        it("Select 'Document types' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document types{downarrow}{enter}");
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

    context("Verify Autocomplete 'Document types'", () => {
      it("Verify autocomplete 'Document types'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_type`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].documentTypeName);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Supplier list' test", () => {
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

        it("Select 'Supplier list' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Supplier list{downarrow}{enter}");
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

    context("Verify Autocomplete 'Supplier list'", () => {
      it("Verify autocomplete 'Supplier list'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=SUPPLIER`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'TL numbers list' test", () => {
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

        it("Select 'TL numbers list' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("TL numbers list{downarrow}{enter}");
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

    context("Verify Autocomplete 'TL numbers list'", () => {
      it("Verify autocomplete 'TL numbers list'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?documentTypeAcronym=TL`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Company addresses' test", () => {
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

        it("Select 'Company addresses' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Company addresses{downarrow}{enter}");
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

    context("Verify Autocomplete 'Company addresses'", () => {
      it("Verify autocomplete 'Company addresses'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/company/mine`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].addresses);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'GL codes' test", () => {
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

        it("Select 'GL codes' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("GL codes{downarrow}{enter}");
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

    context("Verify Autocomplete 'GL codes'", () => {
      it("Verify autocomplete 'GL codes'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/company/mine`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].acctCodes);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Groups' test", () => {
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

        it("Select 'Groups' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Groups{downarrow}{enter}");
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

    context("Verify Autocomplete 'Groups'", () => {
      it("Verify autocomplete 'Groups'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/groups`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].name);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Parts' test", () => {
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

        it("Select 'Parts' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Parts{downarrow}{enter}");
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

    context("Verify Autocomplete 'Parts'", () => {
      it("Verify autocomplete 'Parts'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=PART`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].document.docId);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Purchase Order list' test", () => {
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

        it("Select 'Purchase Order list' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Purchase Order list{downarrow}{enter}");
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

    context("Verify Autocomplete 'Purchase Order list'", () => {
      it("Verify autocomplete 'Purchase Order list'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=PO&status%5B%5D=RELEASED`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Employees' test", () => {
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

        it("Select 'Employees' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Employees{downarrow}{enter}");
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

    context("Verify Autocomplete 'Employees'", () => {
      it("Verify autocomplete 'Employees'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/employees?active=true`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].user.name);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Official Groups' test", () => {
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

        it("Select 'Official Groups' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Official Groups{downarrow}{enter}");
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

    context("Verify Autocomplete 'Official Groups'", () => {
      it("Verify autocomplete 'Official Groups'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/groups`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].name);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Part Number in WO' test", () => {
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

        it("Select 'Part Number in WO' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Part Number in WO{downarrow}{enter}");
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

    context("Verify Autocomplete 'Part Number in WO'", () => {
      it("Verify autocomplete 'Part Number in WO'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=PART`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Document Revisions In Draft without Records' test", () => {
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

        it("Select 'Document Revisions In Draft without Records' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document Revisions In Draft without Records{downarrow}{enter}");
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

    context("Verify Autocomplete 'Document Revisions In Draft without Records'", () => {
      it("Verify autocomplete 'Document Revisions In Draft without Records'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=FORM&docTypeGroups%5B%5D=SUPPLIER&docTypeGroups%5B%5D=OTHER&docTypeGroups%5B%5D=MPI&docTypeGroups%5B%5D=DYNAMIC_FORM&docTypeGroups%5B%5D=POAM&docTypeGroups%5B%5D=PO&docTypeGroups%5B%5D=WORK_ORDER&docTypeGroups%5B%5D=PART&docTypeGroups%5B%5D=DAM&docTypeGroups%5B%5D=EQUIPMENT&docTypeGroups%5B%5D=MATERIAL&status%5B%5D=DRAFT`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Approval Roles' test", () => {
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

        it("Select 'Approval Roles' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Approval Roles{downarrow}{enter}");
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

    context("Verify Autocomplete 'Approval Roles'", () => {
      it("Verify autocomplete 'Approval Roles'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/groups/approval_roles`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body[index].name);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'Document revisions (all versions)' test", () => {
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

        it("Select 'Document revisions (all versions)' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Document revisions (all versions){downarrow}{enter}");
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

    context("Verify Autocomplete 'Document revisions (all versions)'", () => {
      it("Verify autocomplete 'Document revisions (all versions)'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Materials' test", () => {
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

        it("Select 'Materials' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Materials{downarrow}{enter}");
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

    context("Verify Autocomplete 'Materials'", () => {
      it("Verify autocomplete 'Materials'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroupOptions%5B%5D=MATERIAL&status%5B%5D=DRAFT&status%5B%5D=PENDING_CHANGE&status%5B%5D=SUBMITTED&status%5B%5D=IN_REVIEW&status%5B%5D=APPROVED&status%5B%5D=RELEASED`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Available Parts' test", () => {
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

        it("Select 'Available Parts' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Available Parts{downarrow}{enter}");
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

    context("Verify Autocomplete 'Available Parts'", () => {
      it("Verify autocomplete 'Available Parts'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions/available_parts`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
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
    });
  });

  context("Autocomplete 'Lots' test", () => {
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
    });
  });

  context("Autocomplete 'Available Part Documents' test", () => {
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

        it("Select 'Available Part Documents' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Available Part Documents{downarrow}{enter}");
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

    context("Verify Autocomplete 'Available Part Documents'", () => {
      it("Verify autocomplete 'Available Part Documents'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/documents/available_parts`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

          if (response.body.length > 0 ) {
            cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                const res = response.body[index];
                expect($li).to.have.text(`${res.docId} - ${res.documentRevisions[0].name}`);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.length);
              });
          } else {
            cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
          }
        });
      });
    });
  });

  context("Autocomplete 'CSL numbers list' test", () => {
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

        it("Select 'CSL numbers list' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("CSL numbers list{downarrow}{enter}");
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

    context("Verify Autocomplete 'CSL numbers list'", () => {
      it("Verify autocomplete 'CSL numbers list'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions?documentTypeAcronym=CSL`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

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
    });
  });

  context("Autocomplete 'Equipment' test", () => {
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
          cy.get("[data-cy=\"optionId\"]").type("Equipment{downarrow}{enter}");
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
            .find("[data-cy^=\"test-label-\"]").click();

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
    });
  });

  context("Autocomplete 'Preventative Maintenance Forms' test", () => {
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

        it("Select 'Preventative Maintenance Forms' as options", () => {
          cy.get("[data-cy=\"optionId\"]").type("Preventative Maintenance Forms{downarrow}{enter}");
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

    context("Verify Autocomplete 'Preventative Maintenance Forms'", () => {
      it("Verify autocomplete 'Preventative Maintenance Forms'", () => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_revisions/forms_group_option?docTypeGroupOption=MAINTENANCE`,
          headers: {
            Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((response) => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").click();

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
    });
  });
});
