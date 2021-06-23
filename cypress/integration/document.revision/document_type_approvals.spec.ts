// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let company;
let adminEmployeeLoginResponse;
let multipleCompanies = false;
let adminEmployee;
let group;
let initialArDocument;
let createdPOFormDocument;
let formDocumentType;
let purchaseOrderDocumentType;
let approvalRequestDocumentType;
let POAMDocumentType;
let SupplierDocumentType;
let createdSupplierFormDocument;

const DAMTitle = "My DAM";
const roleOne = "Role One";
const FormTitle = "New Form";
const POAMFormTitle = "POAM form";
const SupplierFormTitle = "Supplier form";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];
const INDIVIDUAL_USER = USERS[14];

context("Check DAM enforcement rules for document types", () => {
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
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
                privateNumberPool: true,
                startingNumber: 1,
              },
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(company, "Purchase Order");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(company, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(company, "Form");
          POAMDocumentType = cmpFilterDocumentTypeIdByName(company, "PO Approval Matrix");
          SupplierDocumentType = cmpFilterDocumentTypeIdByName(company, "Suppliers");
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Create PO form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: adminEmployeeLoginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: adminEmployeeLoginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>PO Form document</p>",
              document: {
                docId: "FM-00003",
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
              name: "PO Form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: purchaseOrderDocumentType[0].id,
                }],
                schema: [{
                  index: 0,
                  type: "purchaseorder",
                  label: "PO",
                  name: "po-kdpqvhc7",
                  applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                },
                {
                  label: "form.builder.approvals",
                  type: "poapprovals",
                  deleteDisabled: false,
                  name: "fb-po-approvals-kpmd2alc",
                  uniqueSchemaItem: true,
                  index: 1,
                }],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPOFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPOFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: adminEmployeeLoginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });

    it("[API]Create POAM form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>POAM Form document</p>",
          document: {
            docId: "FM-00004",
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
          name: POAMFormTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: POAMDocumentType[0].id,
            }],
            schema: [{
              index: 0,
              type: "poApprovalMatrix",
              label: "POAM",
              name: "poam-keva19by",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            }],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPOFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPOFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: adminEmployeeLoginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create Supplier form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Supplier Form document</p>",
          document: {
            docId: "FM-00005",
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
          name: SupplierFormTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: SupplierDocumentType[0].id,
            }],
            schema: [{
            }],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdSupplierFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdSupplierFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: adminEmployeeLoginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: multipleCompanies });
    });
  });

  context("Create DAM", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${FormTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("fill in document type: Form", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("fill in output document type: Document Approval Matrix", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("select 'Approval Matrix'", () => {
      cy.fbSelectApprovalMatrix();
    });

    it("add 'Approval Matrix' field", () => {
      cy.fbAddField();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context("Add New Role: Role One", () => {
    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.drAddAnotherRoleBtn();
      });
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name, SECOND_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
    });
  });

  context("Select 'Role One' is needed for 'Approvals Numeric' on all document types", () => {
    it("Click edit DAM", () => {
      cy.drOpenCloseSidebarDrawer();
      cy.drClickDAMEditBtn();
    });

    it("Check all checkboxes for 'Approvals Numeric'", () => {
      cy.get("div:nth-child(2) > div> table > tbody > tr > td:nth-child(1)")
        .each(($el) => {
          cy.wrap($el).click();
        });
    });

    it("Click edit DAM", () => {
      cy.drClickDAMEditBtn();
    });
  });

  context("'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and Release the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Test enforced approvals for all internal document types", () => {
    context("Test 'Dynamic Form' approvals for 'Dynamic Form' internal type", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Dynamic Form approvals" });
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Dynamic Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drCheckApprovalsEnforcment();
      });
    });

    context("Test 'Clinical Protocol' approvals for 'OTHER' internal type", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Clinical Protocol approvals" });
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drCheckApprovalsEnforcment();
      });
    });

    context("Test 'Form' approvals for 'FORM' internal type", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Form approvals" });
        cy.get("[data-cy=field-name]").click();
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Test approvals" });
      });

      it("Select document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drCheckApprovalsEnforcment();
      });
    });

    context("Test 'Document Approval Matrix' approvals for 'DAM' internal type", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it(`Select document named '${DAMTitle}'`, () => {
        cy.drClickOnSpecificDocFromList({ item: DAMTitle });
      });

      it("Click revise", () => {
        cy.drClickReviseDocument();
      });

      it("Create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check approvals enfocment", () => {
        cy.drCheckApprovalsEnforcment();
      });
    });

    context("Test 'PO Approval Matrix' approvals for 'POAM' internal type", () => {

      it("Navigate to PO list", () => {
        cy.navigToDocumentList();
      });

      it(`Select document named '${POAMFormTitle}'`, () => {
        cy.drClickOnSpecificDocFromList({ item: POAMFormTitle });
      });

      it("Create new POAM document from Form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title 'New POAM'", () => {
        cy.drEnterDocumentTitle({ name: "New POAM" });
      });

      it("Enter description 'New POAM description'", () => {
        cy.drEnterDocumentDescription({ description: "New POAM description" });
      });

      it("Click 'Save' document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Check approvals enfocment", () => {
        cy.drCheckApprovalsEnforcment();
      });
    });

    context("Test 'Purchase order' approvals for 'PO' internal type", () => {

      it("Navigate to PO list", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click create new PO", () => {
        cy.poClickCreatePO();
      });

      it("Enter description 'POAM test'", () => {
        SystemRequirement("REQ-1290");
        cy.drEnterDocumentDescriptionWithWait({ description: "PO enfocment test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });
      });

      it("Add approver to approvals", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.poAddApproverOnApproverList({ approver: USERS[1].email });
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        });
      });

      // it("Check approval role is present", () => {
      //   cy.get("[data-cy=\"Role One\"]").should("exist");
      // });

      it("Submit for approvals and check enfocment", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        cy.checkToastMessageContains({ message: "at least one approver from group Role One has to be selected" });
        cy.closeAllAlertMessages();
      });
    });

    context("Test 'Suppliers' approvals for 'SUPPLIER' internal type", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it(`Select document named '${SupplierFormTitle}'`, () => {
        cy.drClickOnSpecificDocFromList({ item: SupplierFormTitle });
      });

      it("Create new Supplier document from Form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Fill document name", () => {
        cy.drEnterDocumentTitle({ name: "Suppliers doc" });
      });

      it("Fill document description", () => {
        cy.drEnterDocumentDescription({ description: "Suppliers address" });
      });

      it("Click 'Save' document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Check approvals enfocment", () => {
        SystemRequirement("REQ-0520");
        cy.drCheckApprovalsEnforcment();
      });
    });
  });
});
