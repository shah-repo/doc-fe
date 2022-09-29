/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let createdPartDocument;
let approvalRequestDocumentType;
let partDocumentType;
let initialArDocument;

context("Create new LHRT Layout Verification", () => {
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
              { ...LotHistoryRecordTest },
              MPITest,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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

    it("[API]Create part document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "CS-00005",
                documentType: {
                  id: partDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [],
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
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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
  });

  context("Fill LHRt document attributes", () => {
    it("Verify predefiend fields title description doc id revision output type", () => {
      cy.verifyPredefiendFields();
    });

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
      cy.drSelectOutputDocumentType({ documentType: "Lot History Record" });
    });
  });

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    context("verify default tabs are displayed", () => {
      it("Check 'Preview Layout' button gets colored", () => {
        cy.intPageVerifyPreviewLayoutButtonEnabled();
      });

      it("Click 'Preview Layout' button", () => {
        cy.intPageClickPreviewLayout();
      });

      it("Verify 'Details' tab is displayed", () => {
        cy.intPageVerifyDetailsTabExist();
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is displayed", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is displayed", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("select 'Training required' field", () => {
        cy.get("[id=\"Checkbox-box\"]").eq(1).arrowClick();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it("Verify Output document type is displayed", () => {
        cy.intPageVerifyOutputDocTypeExist();
      });
    });

    context("verify predefined fields are displayed", () => {
      it("Check 'Part to be Manufactured' is displayed", () => {
        cy.intPageVerifyPartToBeManufacturedExist();
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.intPageVerifyInitialQuantityExist();
      });

      it("Check 'End Quantity' is displayed", () => {
        cy.intPageVerifyEndQuantityExist();
      });

      it("Check 'Build Type' is displayed", () => {
        cy.intPageVerifyBuildTypeExist();
      });

      it("Check 'Due Date' is displayed", () => {
        cy.get(`[data-cy="Due Date"]`).should("exist");
      });

      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });

      it("Check 'Preview Layout' button gets colored", () => {
        cy.intPageVerifyPreviewLayoutButtonEnabled();
      });

      it("part to be manufactured is editable", () => {
        cy.get("[data-cy^=\"lhr-selected-part\"]").then(($el) => {
          $el.trigger("click");
          cy.unClick();
        });
      });

      it("Initial Quantity is editable", () => {
        cy.get("[data-cy^=\"lhr_initial_quantity\"]").then(($el) => {
          $el.trigger("click");
        });
      });

      it("End Quantity is editable", () => {
        cy.get("[data-cy^=\"lhr-end-quantity\"]").then(($el) => {
          $el.trigger("click");
        });
      });

      it("Build Type is editable", () => {
        cy.unClick();
        cy.get("[value=\"R&D\"]").check({ force: true });
      });

      it("Approval is editable", () => {
        cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").then(($el) => {
          $el.trigger("click");
          cy.unClick();
        });
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });

      it("Make sure that none of the changes made in “Preview” mode were saved", () => {
        cy.drIsTrainingRequired({ shouldBe: false });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("verify form preview button in Overview Tab", () => {
        cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("verify form preview button in Details Tab", () => {
        cy.get("[data-cy='FBWorkspace-clickView']").should("exist");
      });
    });

    context("click on form preview button", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("click on form preview button in Overview Tab", () => {
        cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
      });

      it("Check 'Part to be Manufactured' is displayed", () => {
        cy.intPageVerifyPartToBeManufacturedExist();
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.intPageVerifyInitialQuantityExist();
      });

      it("Check 'End Quantity' is displayed", () => {
        cy.intPageVerifyEndQuantityExist();
      });

      it("Check 'Build Type' is displayed", () => {
        cy.intPageVerifyBuildTypeExist();
      });

      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });
    });

    context("Verify the fields are editable", () => {
      it("part to be manufactured is editable", () => {
        cy.get("[data-cy^=\"lhr-selected-part\"]").then(($el) => {
          $el.trigger("click");
          cy.unClick();
        });
      });

      it("Initial Quantity is editable", () => {
        cy.get("[data-cy^=\"lhr_initial_quantity\"]").then(($el) => {
          $el.trigger("click");
        });
      });

      it("End Quantity is editable", () => {
        cy.get("[data-cy^=\"lhr-end-quantity\"]").then(($el) => {
          $el.trigger("click");
        });
      });

      it("Build Type is editable", () => {
        cy.unClick();
        cy.get("[value=\"R&D\"]").check({ force: true });
      });

      it("Approval is editable", () => {
        cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").then(($el) => {
          $el.trigger("click");
          cy.unClick();
        });
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });

      it("Navigate details tab", () => {
        cy.drSelectDetailsTab();
      });
      it("Check 'Step #1' is displayed", () => {
        cy.intPageVerifyLHRStepExist();
      });
    });

    context("Add fields", () => {
      it("Add TextField", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbOpenValidation();
        cy.get("[data-cy=\"fb-control-required\"]").arrowClick();
        cy.fbAddNewFieldButton();
      });

      it("Add Select field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
        cy.fbGroupOptions("A", "B", "C");
        cy.fbOpenValidation();
        cy.get("input[value^=\"visibility\"]").check();
        cy.fbFieldRequiredIf({ name: "fb-textfield", value: "Test" });
        cy.fbAddNewFieldButton();
      });

      it("Add LHR step", () => {
        cy.get("[data-cy='form.builder.add.step']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.unClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Click on Form Preview and verify the fields", () => {
      it("Click 'Preview Layout' button", () => {
        cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
      });

      it("Verify Step 2 Added to detail tab", () => {
        cy.get("[data-cy='LHR Step 2']").should("be.visible");
      });

      it("Verify fb-textfield tab", () => {
        cy.get("[data-cy='fb-textfield']").should("be.visible");
      });

      it("Verify Field1 is displayed and flagged as “Required”", () => {
        cy.get("[data-cy='textfield-6']").contains("The fb-textfield is a required field.")
          .should("exist");
      });

      it("Enter Add field 1 to visible add field 2 tab", () => {
        cy.get("div[data-cy^='fb-textfield']").eq(3).arrowType("Test");
      });

      it("Verify Select field tab", () => {
        cy.get("[data-cy='Select field']").should("be.visible");
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });

      it("Edit text field field ", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(1).arrowClick({ force: true });
        cy.fbOpenValidation();
        cy.get("[data-cy='fb-control-required']").arrowClick();
        cy.fbAddField();
      });

      it("Edit Select field ", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(2).arrowClick({ force: true });
        cy.fbOpenValidation();
        cy.get("input[value^=\"default\"]").check();
        cy.get("[data-cy='fb-control-required_if:anotherfield,value']").arrowClick();
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(2).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add field 4", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield 4" });
        cy.fbAddNewFieldButton();
      });

      it("Add field 5", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield 5" });
        cy.fbAddNewFieldButton();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Preview Layout' button", () => {
        cy.get("[data-cy='FBWorkspace-clickView']").arrowClick();
      });

      it("Verify Step 2 Added to detail tab", () => {
        cy.get("[data-cy='LHR Step 2']").should("be.visible");
      });

      it("Verify fb-textfield tab", () => {
        cy.get("[data-cy='fb-textfield']").should("be.visible");
      });

      it("Verify fb-textfield 4 tab", () => {
        cy.get("[data-cy='fb-textfield 4']").should("be.visible");
      });

      it("Verify fb-textfield 5 tab", () => {
        cy.get("[data-cy='fb-textfield 5']").should("be.visible");
      });
    });
  });
});
