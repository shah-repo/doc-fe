// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Checkboxes test2", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'eb-title'", () => {
      cy.drEnterDocumentTitle({ name: "eb-title" });
    });

    it("Enter document description 'eb description'", () => {
      cy.drEnterDocumentDescription({ description: "eb description" });
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

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Add Fields with Checkboxes", () => {
      it("Add PO Approval Matrix with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
        cy.fbEnterNameValue({ name: "label", value: "poam-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "poam-wi-ch" } );
      });

      it("Add PO Approval Matrix without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
        cy.fbEnterNameValue({ name: "label", value: "poam-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "poam-wo-ch" } );
      });

      it("Add Instructions Media upload with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "imu-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "imu-wi-ch" } );
      });

      it("Add Instructions Media upload without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "imu-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "imu-wo-ch" } );
      });

      it("Add Evidence Media upload with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "emu-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "emu-wi-ch" } );
      });

      it("Add Evidence Media upload without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "emu-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "emu-wo-ch" } );
      });

      it("Add Procedure with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #1" } );
      });

      it("Add Procedure without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #2" } );
      });

      it("Add Equipment with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wi-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wi-ch" } );
      });

      it("Add Equipment without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wo-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wo-ch" } );
      });

      it("Add Text field with range with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "twr-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "twr-wi-ch" } );
      });

      it("Add Text field with range without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "twr-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "twr-wo-ch" } );
      });

      it("Add Inline Approval with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "ia-wi-ch" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "ia-wi-ch" } );
      });

      it("Add Inline Approval without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "ia-wo-ch" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "ia-wo-ch" } );
      });

      it("Add Request Approval with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Request Approval" });
        cy.fbEnterNameValue({ name: "label", value: "ra-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "ra-wi-ch" } );
      });

      it("Add Request Approval without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Request Approval" });
        cy.fbEnterNameValue({ name: "label", value: "ra-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "ra-wo-ch" } );
      });

      it("Add Checkpoint with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Checkpoint" });
        cy.fbEnterNameValue({ name: "label", value: "cp-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cp-wi-ch" } );
      });

      it("Add Checkpoint without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Checkpoint" });
        cy.fbEnterNameValue({ name: "label", value: "cp-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cp-wo-ch" } );
      });

      it("Add Create a Label with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Create a Label" });
        cy.fbEnterNameValue({ name: "label", value: "cl-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cl-wi-ch" } );
      });

      it("Add Create a Label without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Create a Label" });
        cy.fbEnterNameValue({ name: "label", value: "cl-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cl-wo-ch" } );
      });

      it("Add Implementation Task with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
        cy.fbEnterNameValue({ name: "label", value: "it-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "it-wi-ch" } );
      });

      it("Add Implementation Task without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
        cy.fbEnterNameValue({ name: "label", value: "it-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "it-wo-ch" } );
      });

      it("Add Instructions 'MPI' with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "MPI" });
        cy.fbEnterNameValue({ name: "label", value: "mpi-wi-ch" });
        cy.get("[data-cy=\"instructionsDocument\"]").autocompleteSelect("AR Form");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "mpi-wi-ch" } );
      });

      it("Add Instructions 'MPI' without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "MPI" });
        cy.fbEnterNameValue({ name: "label", value: "mpi-wo-ch" });
        cy.get("[data-cy=\"instructionsDocument\"]").autocompleteSelect("AR Form");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "mpi-wo-ch" } );
      });

      it("Add Instructions 'Select Document(s)' with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "Select Document(s)" });
        cy.fbEnterNameValue({ name: "label", value: "sd-wi-ch" });
        cy.get("[data-cy=\"options\"]").autocompleteSelect("AR Form");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "sd-wi-ch" } );
      });

      it("Add Instructions 'Select Document(s)' without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "Select Document(s)" });
        cy.fbEnterNameValue({ name: "label", value: "sd-wo-ch" });
        cy.get("[data-cy=\"options\"]").autocompleteSelect("AR Form");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "sd-wo-ch" } );
      });
    });
  });

  context("Create & Approve Document", () => {
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

  context("Verify 'Revision Disabled' checkbox property", () => {
    it("Verify PO Approval Matrix without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "poam-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "poam-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "poam-wo-ch", el: "remove-schema-item" });
    });

    it("Verify PO Approval Matrix with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "poam-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "poam-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "poam-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Instructions Media upload without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "imu-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "imu-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "imu-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Instructions Media upload with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "imu-wi-ch" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "imu-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "imu-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Evidence Media upload without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "emu-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "emu-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "emu-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Evidence Media upload with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "emu-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "emu-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "emu-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Procedure without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "Step #1" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "Step #1", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "Step #1", el: "remove-schema-item" });
    });

    it("Verify Procedure with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "Step #2" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "Step #2", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "Step #2", el: "remove-schema-item" });
    });

    it("Verify Equipment without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "eq-wo-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "eq-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "eq-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Equipment with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "eq-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "eq-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "eq-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Text field with range without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "twr-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "twr-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "twr-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Text field with range with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "twr-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "twr-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "twr-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Inline Approval without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ia-wo-ch" } );

      cy.contains("ia-wi-ch").arrowClick();
      cy.fbVerifyElementVisibileByLabel({ label: "ia-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "ia-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Inline Approval with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ia-wi-ch" } );

      cy.fbVerifyElementNotVisibileByLabel({ label: "ia-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "ia-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Request Approval without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ra-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "ra-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "ra-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Request Approval with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ra-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "ra-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "ra-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Checkpoint without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cp-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "cp-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "cp-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Checkpoint with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cp-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "cp-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "cp-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Create a Label without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cl-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "cl-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "cl-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Create a Label with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cl-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "cl-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "cl-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Implementation Task without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "it-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "it-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "it-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Implementation Task with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "it-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "it-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "it-wi-ch", el: "remove-schema-item" });
    });

    it("Verify MPI without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "mpi-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "mpi-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "mpi-wo-ch", el: "remove-schema-item" });
    });

    it("Verify MPI with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "mpi-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "mpi-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "mpi-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Select Document(s) without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "sd-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "sd-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "sd-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Select Document(s) with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "sd-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "sd-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "sd-wi-ch", el: "remove-schema-item" });
    });
  });

  context("Create a new document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filters form by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "eb-title", status: "Released" });
    });

    it("Click to Create document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter eb document title 'eb-doc-title'", () => {
      cy.drEnterDocumentTitle({ name: "eb-doc-title" });
    });

    it("Enter document description 'eb document description'", () => {
      cy.drEnterDocumentDescription({ description: "eb description" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify 'Deletion Disabled' checkbox property", () => {
    it("Verify PO Approval Matrix without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "poam-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify PO Approval Matrix with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "poam-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Instructions Media upload without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "imu-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Instructions Media upload with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "imu-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Evidence Media upload without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "emu-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Evidence Media upload with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "emu-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Procedure without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "Step #1", el: "remove-schema-item", class:
        "schema-delete-disabled",
      });
    });

    it("Verify Procedure with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "Step #2", el: "remove-schema-item", class:
        "schema-delete-enabled",
      });
    });

    it("Verify Text field with range without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "twr-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Text field with range with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "twr-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Equipment without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "eq-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Equipment with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "eq-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Inline Approval without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ia-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Inline Approval with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ia-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Request Approval without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ra-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Request Approval with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ra-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Checkpoint without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cp-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Checkpoint with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cp-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Create a Label without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cl-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Create a Label with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cl-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Implementation Task without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "it-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Implementation Task with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "it-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify MPI without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "mpi-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify MPI with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "mpi-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Select Document(s) without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "sd-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Select Document(s) with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "sd-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });
  });

  context("Create Document", () => {
    it("Click create document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });
});
