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
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Add 'Required' validation on 'Checkboxes'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("Create 'Checkboxes'", () => {
      SystemRequirement("FB-0040");
      cy.fbSelectItemFromNewFieldList({ section: "Inputs",  field: "Checkbox group" });
    });

    it(`Give label to 'Checkbox' as 'Order'`, () => {
      cy.fbEnterLabel({ label: "Order" });
    });

    it("Add options to checbox group", () => {
      SystemRequirement("FB-0040");
      cy.fbGroupOptions("First", "Second", "Third");
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it(`Make 'Order' field required`, () => {
      SystemRequirement("FB-0220");
      cy.fbFieldRequired();
    });

    it("Add Checkbox Group", () => {
      cy.fbAddField();
    });
  });

  context("Add 'Required' validation on 'Autocomplete multiselect'", () => {
    it("Open add field dialogue", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Create 'Autocomplete' multi select", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
    });

    it(`Give label to 'Autocomplete' as 'Required doctypes'`, () => {
      SystemRequirement("FB-0010");
      cy.fbEnterLabel({ label: "Required doctypes" });
    });

    it("Select 'Document types' for  autocomplete multiselect", () => {
      cy.fbAutocompleteType({ autocompleteOption: "Document types" });
    });

    it("Select multi-select checkbox", () => {
      cy.get("input[value=multiple]").check();
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If In'", () => {
      SystemRequirement("FB-0240");
      cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").arrowClick();
    });

    it(`Select 'Order' field`, () => {
      SystemRequirement("FB-0240");
      cy.get("[data-cy=\"validators.required_if_in.name\"]").autocompleteSelect(`Order`);
    });

    it(`Check required if 'First' 'Second'`, () => {
      cy.get("div[name=\"validators.required_if_in.value\"] input[value=\"First\"]").check();
      cy.get("div[name=\"validators.required_if_in.value\"] input[value=\"Second\"]").check();
    });

    it("Add autocomplete multi-select", () => {
      cy.fbAddField();
    });
  });

  context("Add 'Required' validation on 'Text Field'", () => {
    it("Open add field dialogue", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it(`Give label to 'Text Field' as '${requiredFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it(`Make '${requiredFieldLabel}' field required`, () => {
      cy.fbFieldRequired();
    });

    it("Add text field", () => {
      cy.fbAddField();
    });

    it("Verify you can't enter data to textfield", () => {
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).should("have.attr", "disabled");
    });
  });

  context("Add 'Required If' validation on 'Text Field'", () => {

    it("Open add field dialogue", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it(`Give label to 'Text Field' as '${requiredIfFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredIfFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If'", () => {
      SystemRequirement("FB-0230");
      cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").arrowClick();
    });

    it(`Select '${requiredFieldLabel}' field`, () => {
      SystemRequirement("FB-0230");
      cy.get("[data-cy=\"validators.required_if.name\"]")
        .autocompleteSelect(`${requiredFieldLabel}`);
    });

    it(`Type value as '${requiredIfFieldValue}'`, () => {
      cy.get("[data-cy=\"validators.required_if.value\"]").arrowType(requiredIfFieldValue);
    });

    it(`Make '${requiredIfFieldLabel}' field required, if '${requiredFieldLabel}' 
field text equals '${requiredIfFieldValue}': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required With' validation on 'Text Field'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it(`Give label to 'Text Field' as '${requiredWithFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredWithFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required With'", () => {
      SystemRequirement("FB-0250");
      cy.get("[data-cy=\"fb-control-required_with:foo,bar,...\"]").arrowClick();
    });

    it(`Select 'Required doctypes' field`, () => {
      cy.get("[data-cy=\"validators.required_with.name\"]").autocompleteSelect(`Required doctypes`);
    });

    it(`Make '${requiredWithFieldLabel}' field required, if 'Required doctypes' 
    field is not empty': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Without' validation on 'Text Field'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
    });

    it(`Give label to 'Text Field' as '${requiredWithoutFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").arrowType(requiredWithoutFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Without'", () => {
      SystemRequirement("FB-0260");
      cy.get("[data-cy=\"fb-control-required_without:foo,bar,...\"]").arrowClick();
    });

    it(`Select '${requiredWithFieldLabel}' field`, () => {
      SystemRequirement("FB-0260");
      cy.get("[data-cy=\"validators.required_without.name\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(requiredWithFieldLabel).arrowClick();
    });

    it(`Make '${requiredWithoutFieldLabel}' field required, if '${requiredWithFieldLabel}' 
field is empty: Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Status' validation on 'Autocomplete'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
    });

    it("Create 'Autocomplete'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
    });

    it(`Give label to 'Autocomplete' as '${requiredDocStatusFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").arrowType(requiredDocStatusFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Status'", () => {
      SystemRequirement("FB-0270");
      cy.get("[data-cy=\"fb-control-required_document_status:value\"]").arrowClick();
    });

    it("Select Released status", () => {
      SystemRequirement("FB-0270");
      cy.get("[data-cy=\"validators.required_document_status.name\"]").autocompleteSelect("Draft");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Type' validation on 'Autocomplete'", () => {
    it("Open add field dialogue", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
    });

    it("Create 'Autocomplete'", () => {
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
    });

    it(`Give label to 'Autocomplete' as '${requiredDocTypeFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").arrowType(requiredDocTypeFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Type'", () => {
      SystemRequirement("FB-0280");
      cy.get("[data-cy=\"fb-control-required_document_type:value\"]").arrowClick();
    });

    it("Select Clinical Protocol", () => {
      SystemRequirement("FB-0280");
      cy.get("[data-cy=\"validators.required_document_type.name\"]").autocompleteSelect("Clinical Protocol");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Store DocId, Save document And 'Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
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
      cy.unClick();
    });

    it("Should show error for 'required if' field", () => {

      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredIfFieldLabel} field is required when ${requiredFieldLabel} is ${requiredIfFieldValue}.`);
      });
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

    it("Should show error for 'required without' field", () => {
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
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview, CyRoutes.DocPreview], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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


