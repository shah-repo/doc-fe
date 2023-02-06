// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let loginResponse;
let createdCompany;
let secondEmployee;
let clinicalProtocolType;
let group;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;

const documentRevisionName = "New document for testing validators";

const requiredFieldLabel = "Name";
const requiredFieldSelector = `${requiredFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredIfFieldLabel = "Last Name";
const requiredIfFieldSelector = `${requiredIfFieldLabel.toLowerCase().split(" ").join("-")}-`;// "last-name-";
const requiredIfFieldValue = "Alex";

const requiredIfInFieldLabel = "Required doctypes";

const requiredWithFieldLabel = "State";
const requiredWithFieldSelector = `${requiredWithFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredWithoutFieldLabel = "Address";
const requiredWithoutFieldSelector = `${requiredWithoutFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredDocStatusFieldLabel = "Document Status";
const requiredDocStatusFieldSelector = `${requiredDocStatusFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredDocTypeFieldLabel = "Document Type";
const requiredDocTypeFieldSelector = `${requiredDocTypeFieldLabel.toLowerCase().split(" ").join("-")}-`;

const csDocTitle = "My CS Doc";

context("Validators tests", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          clinicalProtocolType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
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

    it("[API]Creates document revision for validators test", (done: any) => {
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
              docId: "CP-00099",
              documentType: {
                id: clinicalProtocolType[0].id,
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

  context("[API]Add employee to developers group", () => {
    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });

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

  context("Log in user, select company and open 'Create Document'", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });

    context("Open 'Create Document'", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });

  context("Create a Clinical Protocol Doc", () => {
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${csDocTitle}{enter}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Desription" });
    });

    it("Fill in document type as Clinical Protocol", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
      cy.get("h6").contains("Document Type").arrowClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Tries to submit empty form", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Shows error 'required’ below 'document type' field", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").find(".MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("Shows error 'required’ below 'document ID' field", () => {
      cy.get("[data-cy=\"field-document.docId\"]").find(".MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });
  });

  context("Fills in Title, Description and Document Type", () => {
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: "Form Title{enter}" });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Form Desription" });
    });

    it("Fill in document type as Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });
  });

  context("Tries to submit partially filled in form", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Shows error 'at least one required' below 'Output Document Type' field", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").find(".MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });
  });

  context("Adds Output Document Type and revision Stage", () => {
    it("Fill in output document type as Clinical Protocol", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowType("Clinical Protocol{enter}");
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click Create Document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Add 'Required' validation on 'Checkboxes'", () => {
    it("Add 'Required' validation on 'Checkboxes'", () => {
      cy.fbAddNewField();
      SystemRequirement("FB-0040");
      cy.fbSelectItemFromNewFieldList({ section: "Inputs",  field: "Checkbox group" });
      cy.fbEnterLabel({ label: "Order" });
      SystemRequirement("FB-0040");
      cy.fbGroupOptions("First", "Second", "Third");
      cy.fbOpenValidation();
      SystemRequirement("FB-0220");
      cy.fbFieldRequired();
      cy.fbAddField();
    });
  });

  context("Add 'Required' validation on 'Autocomplete multiselect'", () => {
    it("Add 'Required' validation on 'Autocomplete multiselect'", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      SystemRequirement("FB-0010");
      cy.fbEnterLabel({ label: "Required doctypes" });
      cy.fbAutocompleteType({ autocompleteOption: "Document types" });
      cy.get("input[value=multiple]").check();
      cy.fbOpenValidation();
      SystemRequirement("FB-0240");
      cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").arrowClick();
      SystemRequirement("FB-0240");
      cy.get("[data-cy=\"validators.required_if_in.name\"]").autocompleteSelect(`Order`);
      cy.get("div[name=\"validators.required_if_in.value\"] input[value=\"First\"]").check();
      cy.get("div[name=\"validators.required_if_in.value\"] input[value=\"Second\"]").check();
      cy.fbAddField();
    });
  });

  context("Add 'Required' validation on 'Text Field'", () => {
    it("Add 'Required' validation on 'Text Field'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredFieldLabel);
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddField();
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).should("have.attr", "disabled");
    });
  });

  context("Add 'Required If' validation on 'Text Field'", () => {
    it("Add 'Required If' validation on 'Text Field'", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredIfFieldLabel);
      cy.fbOpenValidation();
      SystemRequirement("FB-0230");
      cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").arrowClick();
      SystemRequirement("FB-0230");
      cy.get("[data-cy=\"validators.required_if.name\"]")
        .autocompleteSelect(`${requiredFieldLabel}`);
      cy.get("[data-cy=\"validators.required_if.value\"]").arrowType(requiredIfFieldValue);
      cy.wait(1000);
      cy.fbAddField();
    });
  });

  context("Add 'Required With' validation on 'Text Field'", () => {
    it("Add 'Required With' validation on 'Text Field'", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredWithFieldLabel);
      cy.fbOpenValidation();
      SystemRequirement("FB-0250");
      cy.get("[data-cy=\"fb-control-required_with:foo,bar,...\"]").arrowClick();
      cy.get("[data-cy=\"validators.required_with.name\"]").autocompleteSelect(`Required doctypes`);
      cy.fbAddField();
    });

  });

  context("Add 'Required Without' validation on 'Text Field'", () => {
    it("Add 'Required Without' validation on 'Text Field'", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredWithoutFieldLabel);
      cy.fbOpenValidation();
      SystemRequirement("FB-0260");
      cy.get("[data-cy=\"fb-control-required_without:foo,bar,...\"]").arrowClick();
      SystemRequirement("FB-0260");
      cy.get("[data-cy=\"validators.required_without.name\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(requiredWithFieldLabel).arrowClick();
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Status' validation on 'Autocomplete'", () => {
    it("Add 'Required Document Status' validation on 'Autocomplete'", () => {
      SystemRequirement("FB-0270");
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.get("[data-cy=\"label\"]").arrowType(requiredDocStatusFieldLabel);
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      SystemRequirement("FB-0270");
      cy.fbOpenValidation();
      SystemRequirement("FB-0270");
      cy.get("[data-cy=\"fb-control-required_document_status:value\"]").arrowClick();
      cy.get("[data-cy=\"validators.required_document_status.name\"]").autocompleteSelect("Draft");
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Type' validation on 'Autocomplete'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.get("[data-cy=\"label\"]").arrowType(requiredDocTypeFieldLabel);
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbOpenValidation();
      SystemRequirement("FB-0280");
      cy.get("[data-cy=\"fb-control-required_document_type:value\"]").arrowClick();
      SystemRequirement("FB-0280");
      cy.get("[data-cy=\"validators.required_document_type.name\"]").autocompleteSelect("Clinical Protocol");
      cy.fbAddField();
    });

  });

  context("Store DocId, Save document And 'Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and Release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Tries to submit empty form", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Fills in Title and Description", () => {
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: "Doc Title" });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Doc Desription" });
    });
  });

  context("Validation errors on custom fields should not prevent from saving document", () => {
    it("saving the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Validation errors should prevent from releasing document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
    });


    it("Check returned toast error message", () => {
      cy.checkToastMessageContains({
        message: "The Order is a required field." +
        ",The Name is a required field." +
        ",The Address field is required when State is empty.,No document selected,No document selected",
      });
      cy.closeAllAlertMessages();
    });

    it("Cancel release of document", () => {
      cy.drCloseApproveAndReleaseDialog();
    });
  });

  context(`Test Order (required) and Required doctypes (required if in) Field`, () => {
    it("Order field should show error for 'required' field", () => {
      cy.xpath("//div[starts-with(@name, 'order')]/../.. //p/span")
        .should("have.text", "The Order is a required field.");
    });

    it("Check 'Third' checkbox", () => {
      cy.get(`[value='Third']`).check();
    });

    it("Order should not have required message", () => {
      cy.xpath("//div[starts-with(@name, 'order')]/../.. //p/span")
        .should("not.exist");
    });

    it("Required doctypes should not be required", () => {
      cy.xpath("//div[starts-with(@name, 'required-doctypes')]/../.. //p/span")
        .should("not.exist");
    });

    it("Check 'First' checkbox", () => {
      cy.get(`[value='First']`).check();
    });

    it("Required doctypes should be required", () => {
      cy.xpath("//div[starts-with(@name, 'required-doctypes')]/../.. //p/span")
        .should("have.text", "The Required doctypes is a required field.");
    });

    it("Uncheck 'First' checkbox", () => {
      cy.get(`[value='First']`).uncheck();
    });

    it("Required doctypes should not be required", () => {
      cy.xpath("//div[starts-with(@name, 'required-doctypes')]/../.. //p/span")
        .should("not.exist");
    });

    it("Select 'Required doctypes", () => {
      cy.get(`[data-cy^="required-doctypes"]`).autocompleteSelect("Equipment");
    });
  });

  context(`Test ${requiredIfFieldLabel} (required if) Field`, () => {
    it(`Remove text from ${requiredFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).clear();
    });

    it(`Type '${requiredIfFieldValue}' in '${requiredFieldLabel}' field`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}']`).arrowType(requiredIfFieldValue);
    });

    it("Click on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Should show error for 'required if' field", () => {
      cy.reload();
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredIfFieldLabel} field is required when ${requiredFieldLabel} is ${requiredIfFieldValue}.`);
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Fill in 'required' custom text field", () => {
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).arrowType("added");
    });
  });

  context(`Test ${requiredWithFieldLabel} (required with) Field`, () => {
    it(`${requiredWithFieldLabel} field should show error when 'Required types' have value`, () => {
      cy.xpath("//input[starts-with(@name, 'state')]/../../../.. //p/span")
        .should("have.text", "The State field is required when Required doctypes is not empty.");
    });

    it(`Remove type from ${requiredIfInFieldLabel}`, () => {
      cy.get("div[name^=\"required-doctypes\"]").arrowClick();
      cy.get("div[name^=\"required-doctypes\"] svg").first().arrowClick();
    });

    it(`${requiredWithFieldLabel} field should not show error when 'Required types' don't value`, () => {
      cy.xpath("//input[starts-with(@name, 'state')]/../../../.. //p/span")
        .should("not.exist");
    });

    it("Select 'Required doctypes", () => {
      SystemRequirement("FB-0250");

      cy.get(`[data-cy^="required-doctypes-"]`).autocompleteSelect("Equipment");
    });

    it("Should show error for 'required with' field", () => {

      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredWithFieldLabel} field is required when Required doctypes is not empty.`);
      });
    });

    it("Fill in 'required with' custom text field", () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).arrowType("California");
      cy.unClick();
    });

    it(`${requiredWithFieldLabel} field should show error when 'Required types' have value`, () => {
      cy.xpath("//input[starts-with(@name, 'state')]/../../../.. //p/span")
        .should("not.exist");
    });
  });

  context(`Test ${requiredWithoutFieldLabel} (required without) Field`, () => {
    it(`Remove text from ${requiredWithFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}'] input`).clear();
    });

    it("Click on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Should show error for 'required without' field", () => {
      cy.reload();
      cy.get(`[data-cy^='${requiredWithoutFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredWithoutFieldLabel} field is required when ${requiredWithFieldLabel} is empty.`);
      });
    });

    it(`Fill in '${requiredWithFieldLabel}' field only`, () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).arrowType("California");
    });
  });

  context(`Test ${requiredDocStatusFieldLabel} (required document status) Field`, () => {
    it("Add incorrect document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocStatusFieldSelector}']`).autocompleteSelect("AR Form");
      });
    });

    it("Should show error for 'Incorrect document status' field", () => {
      cy.get(`[name^='${requiredDocStatusFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("contain.text", `is not in DRAFT status.`);
      });
    });

    it(`Fill in '${requiredDocStatusFieldLabel}' with draft CS Document`, () => {
      cy.get(`[data-cy^='${requiredDocStatusFieldSelector}']`).clear();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocStatusFieldSelector}']`).autocompleteSelect(`${documentRevisionName}`);
      });
    });
  });

  context(`Test ${requiredDocTypeFieldLabel} (required document type) Field`, () => {
    it("Add incorrect document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).autocompleteSelect("AR Form").wait(500);
        cy.unClick();
      });
    });

    it("Should show error for 'Incorrect document type' field", () => {
      cy.get(`[name^='${requiredDocTypeFieldSelector}']`).parent().siblings("p")
        .should("have.text", `Incorrect document type.`);
    });

    it(`Fill in '${requiredDocTypeFieldLabel}' with our CS Document`, () => {
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).clear();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).autocompleteSelect(`${csDocTitle}`);
      });
    });
  });

  context("Release document", () => {
    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview, CyRoutes.DocPreview], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("No validation error, submission is successful", () => {
    // No need to check if validation pop-up is shown.
    // If doc status is released that means there were no validation errors.
    it(`Check document status is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };


