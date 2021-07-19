// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let docId;
let loginResponse;
let multipleCompanies;
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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
      cy.get("h6").contains("Document Type").click();
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

    it("Shows error 'required’ below title field", () => {
      cy.get("[data-cy=\"field-name\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("Shows error 'required’ below description field", () => {
      cy.get("[data-cy=\"field-description\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("Shows error 'required’ below 'document type' field", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("Shows error 'required’ below 'document ID' field", () => {
      cy.get("[data-cy=\"field-document.docId\"] .MuiFormHelperText-root.Mui-error")
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
      SystemRequirement("FB-0010", "FB-0030");
      cy.drSelectDocumentType({ documentType: "Form" });
    });
  });

  context("Tries to submit partially filled in form", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Shows error 'at least one required' below 'Output Document Type' field", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "At least one input required");
    });
  });

  context("Adds Output Document Type and revision Stage", () => {
    it("Fill in output document type as Clinical Protocol", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").type("Clinical Protocol{enter}");
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Add 'Required' validation on 'Checkboxes'", () => {
    it("Open add field dialogue", () => {
      SystemRequirement("FB-0020");
      cy.fbAddNewField();
    });

    it("Create 'Checkboxes'", () => {
      SystemRequirement("FB-0370");
      cy.fbSelectCustomFieldToAdd({ name: "Checkbox group" });
    });

    it(`Give label to 'Checkbox' as 'Order'`, () => {
      cy.fbEnterLabel({ label: "Order" });
    });

    it("Add options to checbox group", () => {
      SystemRequirement("FB-0370");
      cy.fbGroupOptions("First", "Second", "Third");
    });

    it("Open validations", () => {
      SystemRequirement("FB-0030");
      cy.fbOpenValidation();
    });

    it(`Make 'Order' field required`, () => {
      SystemRequirement("FB-0100");
      cy.get("[data-cy=\"fb-control-required\"]").click();
    });

    it("Add Checkbox Group", () => {
      cy.fbAddField();
    });
  });

  context("Add 'Required' validation on 'Autocomplete multiselect'", () => {
    it("Open add field dialogue", () => {
      SystemRequirement("FB-0030");
      cy.fbClickAddNewHiddenBtn();
    });

    it("Create 'Autocomplete' multi select", () => {
      cy.fbSelectCustomFieldToAdd({ name: "Autocomplete" });
    });

    it(`Give label to 'Autocomplete' as 'Required doctypes'`, () => {
      SystemRequirement("FB-0050");
      cy.fbEnterLabel({ label: "Required doctypes" });
    });

    it("Select 'Document types' for  autocomplete multiselect", () => {
      cy.fbAutocompleteType({ autocompleteOption: "Document types" });
    });

    it("Select multi-select checkbox", () => {
      cy.get("input[value=multiple]").check();
    });

    it("Open validations", () => {
      SystemRequirement("FB-0050");
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If In'", () => {
      SystemRequirement("FB-0050", "FB-0120");
      cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").click();
    });

    it(`Select 'Order' field`, () => {
      SystemRequirement("FB-0120");
      cy.get("[data-cy=\"validators.required_if_in.name\"]").type(`Order{downarrow}{enter}`);
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
      cy.fbSelectTextField();
    });

    it(`Give label to 'Text Field' as '${requiredFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it(`Make '${requiredFieldLabel}' field required`, () => {
      cy.get("[data-cy=\"fb-control-required\"]").click();
    });

    it("Add text field", () => {
      cy.fbAddField();
    });

    it("Verify you can't enter data to textfield", () => {
      SystemRequirement("FB-0330");
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).should("have.attr", "disabled");
    });
  });

  context("Add 'Required If' validation on 'Text Field'", () => {

    it("Open add field dialogue", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`Give label to 'Text Field' as '${requiredIfFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredIfFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If'", () => {
      SystemRequirement("FB-0110");
      cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").click();
    });

    it(`Select '${requiredFieldLabel}' field`, () => {
      SystemRequirement("FB-0110");
      cy.get("[data-cy=\"validators.required_if.name\"]").type(`${requiredFieldLabel}{downarrow}{enter}`);
    });

    it(`Type value as '${requiredIfFieldValue}'`, () => {
      cy.get("[data-cy=\"validators.required_if.value\"]").type(requiredIfFieldValue);
    });

    it(`Make '${requiredIfFieldLabel}' field required, if '${requiredFieldLabel}' 
field text equals '${requiredIfFieldValue}': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required With' validation on 'Text Field'", () => {
    it("Open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`Give label to 'Text Field' as '${requiredWithFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredWithFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required With'", () => {
      SystemRequirement("FB-0130");
      cy.get("[data-cy=\"fb-control-required_with:foo,bar,...\"]").click();
    });

    it(`Select 'Required doctypes' field`, () => {
      cy.get("[data-cy=\"validators.required_with.name\"]").type(`Required doctypes{downarrow}{enter}`);
    });

    it(`Make '${requiredWithFieldLabel}' field required, if 'Required doctypes' 
field is not empty': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Without' validation on 'Text Field'", () => {
    it("Open add field dialogue", () => {
      cy.get("button[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("Create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`Give label to 'Text Field' as '${requiredWithoutFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredWithoutFieldLabel);
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Without'", () => {
      SystemRequirement("FB-0140");
      cy.get("[data-cy=\"fb-control-required_without:foo,bar,...\"]").click();
    });

    it(`Select '${requiredWithFieldLabel}' field`, () => {
      SystemRequirement("FB-0140");
      cy.get("[data-cy=\"validators.required_without.name\"]").click();
      cy.get("ul[role=listbox]>li").contains(requiredWithFieldLabel).click();
    });

    it(`Make '${requiredWithoutFieldLabel}' field required, if '${requiredWithFieldLabel}' 
field is empty: Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Status' validation on 'Autocomplete'", () => {
    it("Open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("Create 'Autocomplete'", () => {
      cy.fbSelectAutoComplete();
    });

    it(`Give label to 'Autocomplete' as '${requiredDocStatusFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").type(requiredDocStatusFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Status'", () => {
      SystemRequirement("FB-0150");
      cy.get("[data-cy=\"fb-control-required_document_status:value\"]").click();
    });

    it("Select Released status", () => {
      SystemRequirement("FB-0150");
      cy.get("[data-cy=\"validators.required_document_status.name\"]").type("Draft{downarrow}{enter}");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Type' validation on 'Autocomplete'", () => {
    it("Open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("Create 'Autocomplete'", () => {
      cy.fbSelectAutoComplete();
    });

    it(`Give label to 'Autocomplete' as '${requiredDocTypeFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").type(requiredDocTypeFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
    });

    it("Open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Type'", () => {
      SystemRequirement("FB-0160");
      cy.get("[data-cy=\"fb-control-required_document_type:value\"]").click();
    });

    it("Select Clinical Protocol", () => {
      SystemRequirement("FB-0160");
      cy.get("[data-cy=\"validators.required_document_type.name\"]").type("Clinical Protocol{downarrow}{enter}");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Store DocId, Save document And 'Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Store Document Id", () => {
      cy.get("[data-cy=\"common.docId\"]").then((element) => {
        const text = element.text();
        docId = text.split(":")[1].trim();
        cy.log(docId);
      });
    });

    it("Approve and Release", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]", { timeout: 50 * 1000 }).click();
    });
  });

  context("Tries to submit empty form", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Shows error 'required’ below title field", () => {
      cy.get("[data-cy=\"field-name\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("Shows error 'required’ below description field", () => {
      cy.get("[data-cy=\"field-description\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

  });

  context("Fills in Title and Description", () => {
    it("Type a title", () => {
      cy.get("#Title-field", { timeout: 10000 }).type("Doc Title{enter}");
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Doc Desription" });
    });
  });

  context("Validation errors on custom fields should not prevent from saving document", () => {
    it("saving the document", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        });
    });
  });

  context("Validation errors should prevent from releasing document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
    });

    it("Check returned errors are not empty", () => {
      SystemRequirement("FB-0070");
      cy.checkToastMessageIsNotEmpty({ exists: true });
    });

    it("Check returned toast error message", () => {
      SystemRequirement("FB-0070");
      cy.checkToastMessageContains({
        message: "The Order is a required field." +
        ",The Name is a required field." +
        ",The Address field is required when State is empty.,No document selected,No document selected",
      });
    });

    it("Cancel release of document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]", { timeout: 20 * 1000 }).click();
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
      cy.get(`[data-cy^="required-doctypes"]`).click();
      cy.get("ul[role=listbox]>li").contains("Equipment").click();
    });
  });

  context(`Test ${requiredIfFieldLabel} (required if) Field`, () => {
    it(`Remove text from ${requiredFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).clear();
    });

    it(`Type '${requiredIfFieldValue}' in '${requiredFieldLabel}' field`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}']`).type(requiredIfFieldValue);
      cy.unClick();
    });

    it("Should show error for 'required if' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredIfFieldLabel} field is required when ${requiredFieldLabel} is ${requiredIfFieldValue}.`);
      });
    });

    it("Fill in 'required' custom text field", () => {
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).typeFieldLock("added");
    });
  });

  context(`Test ${requiredWithFieldLabel} (required with) Field`, () => {
    it(`${requiredWithFieldLabel} field should show error when 'Required types' have value`, () => {
      cy.xpath("//input[starts-with(@name, 'state')]/../../../.. //p/span")
        .should("have.text", "The State field is required when Required doctypes is not empty.");
    });

    it(`Remove type from ${requiredIfInFieldLabel}`, () => {
      cy.get("div[name^=\"required-doctypes\"] svg").first().click();
    });

    it(`${requiredWithFieldLabel} field should not show error when 'Required types' don't value`, () => {
      cy.xpath("//input[starts-with(@name, 'state')]/../../../.. //p/span")
        .should("not.exist");
    });

    it("Select 'Required doctypes", () => {
      SystemRequirement("FB-0130");
      cy.get(`[data-cy^="required-doctypes"]`).click();
      cy.get("ul[role=listbox]>li").contains("Equipment").click();
    });

    it("Should show error for 'required with' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text",
            `The ${requiredWithFieldLabel} field is required when Required doctypes is not empty.`);
      });
    });

    it("Fill in 'required with' custom text field", () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).type("California");
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
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).type("California");
    });
  });

  context(`Test ${requiredDocStatusFieldLabel} (required document status) Field`, () => {
    it("Add incorrect document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocStatusFieldSelector}']`).type("AR Form{downarrow}{enter}");
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
        cy.get(`[data-cy^='${requiredDocStatusFieldSelector}']`).type(`${documentRevisionName}{downarrow}{enter}`);
      });
    });
  });

  context(`Test ${requiredDocTypeFieldLabel} (required document type) Field`, () => {
    it("Add incorrect document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).type("AR Form{downarrow}{enter}");
      });
    });

    it("Should show error for 'Incorrect document type' field", () => {
      cy.get(`[name^='${requiredDocTypeFieldSelector}']`).then((elem) => {
        const errorBlock = elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `Incorrect document type.`);
      });
    });

    it(`Fill in '${requiredDocTypeFieldLabel}' with our CS Document`, () => {
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).clear();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostRemoteValidatorsHelper], () => {
        cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).type(`${csDocTitle}{downarrow}{enter}`);
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
    it("Check document status is released", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };


