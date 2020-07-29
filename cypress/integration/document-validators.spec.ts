// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
let company;
let docId;

const requiredFieldLabel = "Name";
const requiredFieldSelector = `${requiredFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredIfFieldLabel = "Last Name";
const requiredIfFieldSelector = `${requiredIfFieldLabel.toLowerCase().split(" ").join("-")}-`;// "last-name-";
const requiredIfFieldValue = "Alex";

const requiredIfInFieldLabel = "Country";
const requiredIfInFieldSelector = `${requiredIfInFieldLabel.toLowerCase().split(" ").join("-")}-`;// "country-";
const requiredIfInFieldValues = "Alpha,Bravo";

const requiredWithFieldLabel = "State";
const requiredWithFieldSelector = `${requiredWithFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredWithoutFieldLabel = "Address";
const requiredWithoutFieldSelector = `${requiredWithoutFieldLabel.toLowerCase().split(" ").join("-")}-`;

const requiredDocStatusFieldLabel = "Document Status";

const requiredDocTypeFieldLabel = "Document Type";
const requiredDocTypeFieldSelector = `${requiredDocTypeFieldLabel.toLowerCase().split(" ").join("-")}-`;

const csDocTitle = "My CS Doc";

context("Validators tests", () => {

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response: any) => {

        cy.cmpCreateCompany({
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "enlil.testmail+cy15@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [{
              name: "Second Tester",
              email: "enlil.testmail+cy2@gmail.com",
            },
            {
              name: "Third Tester",
              email: "enlil.testmail+cy3@gmail.com",
            },
            {
              name: "Fourth Tester",
              email: "enlil.testmail+cy4@gmail.com",
            }],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            whiteLabeling: null,
            documentTypes: [],
          }, sessionId: response.sessionId,
        }).then((response) => {
          company = response;
          done();
        });
      });
    });
  });

  context("Log in user, select company and open 'Create Document'", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: "enlil.testmail+cy15@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });

    context("Open 'Create Document'", () => {
      it("Navigate to document list", () => {
        cy.cmpNavigateToDocumentList();
      });

      it("Click on 'create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });
    });
  });

  context("Create a Component Specification Doc", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${csDocTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Desription" });
    });

    it("fill in document type as Component Specification", () => {
      cy.drSelectDocumentType({ documentType: "Component Specification" });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocument();
      cy.wait(3000);
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 1000 }).click();
      cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.wait(3000);
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Tries to submit empty form", () => {

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocument();
      cy.wait(3000);
    });

    it("shows error 'required’ below title field", () => {
      cy.get("[data-cy=\"field-name\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("shows error 'required’ below description field", () => {
      cy.get("[data-cy=\"field-description\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("shows error 'required’ below 'document type' field", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("shows error 'required’ below 'document ID' field", () => {
      cy.get("[data-cy=\"field-document.docId\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

  });

  context("fills in Title, Description and Document Type", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: "Form Title{enter}" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Form Desription" });
    });

    it("fill in document type as Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });
  });

  context("Tries to submit partially filled in form", () => {

    it("click on 'Save' button", () => {
      cy.drClickCreateDocument();
    });

    it("shows error 'at least one required' below 'Output Document Type' field", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "At least one input required");
    });

  });

  context("Adds Output Document Type", () => {
    it("fill in output document type as Component Specification", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").type("Component Specification{enter}");
    });
  });

  context("Add 'Required' validation on 'Text Field'", () => {
    it("open add field dialogue", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").click();
    });

    it("create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`give label to 'Text Field' as '${requiredFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredFieldLabel);
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it(`Make '${requiredFieldLabel}' field required`, () => {
      cy.get("[data-cy=\"fb-control-required\"]").click();
    });

    it("Add text field", () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required If' validation on 'Text Field'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").click({ force: true });
    });

    it("create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`give label to 'Text Field' as '${requiredIfFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredIfFieldLabel);
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If'", () => {
      cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").click();
    });

    it(`select '${requiredFieldLabel}' field`, () => {
      cy.get("[data-cy=\"validators.required_if.name\"]").type(`${requiredFieldLabel}{downarrow}{enter}`);
    });

    it(`type value as '${requiredIfFieldValue}'`, () => {
      cy.get("[data-cy=\"validators.required_if.value\"]").type(requiredIfFieldValue);
    });

    it(`Make '${requiredIfFieldLabel}' field required, if '${requiredFieldLabel}' field text equals '${requiredIfFieldValue}': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required If In' validation on 'Text Field'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`give label to 'Text Field' as '${requiredIfInFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredIfInFieldLabel);
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required If In'", () => {
      cy.get("[data-cy=\"fb-control-required_if_in:anotherfield,[value]\"]").click();
    });

    it(`select '${requiredIfFieldLabel}' field`, () => {
      cy.get("[data-cy=\"validators.required_if_in.name\"]").type(`${requiredIfFieldLabel}{downarrow}{enter}`);
    });

    it(`type value as '${requiredIfInFieldValues}'`, () => {
      cy.get("[data-cy=\"validators.required_if_in.value\"]").type(requiredIfInFieldValues);
    });

    it(`Make '${requiredIfInFieldLabel}' field required, if '${requiredIfFieldLabel}' field text includes '${requiredIfInFieldValues.split(",").join(" or ")}': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required With' validation on 'Text Field'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`give label to 'Text Field' as '${requiredWithFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredWithFieldLabel);
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required With'", () => {
      cy.get("[data-cy=\"fb-control-required_with:foo,bar,...\"]").click();
    });

    it(`select '${requiredIfInFieldLabel}' field`, () => {
      cy.get("[data-cy=\"validators.required_with.name\"]").type(`${requiredIfInFieldLabel}{downarrow}{enter}`);
    });

    it(`Make '${requiredWithFieldLabel}' field required, if '${requiredIfInFieldLabel}' field is not empty': Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Without' validation on 'Text Field'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("create 'Text Field'", () => {
      cy.fbSelectTextField();
    });

    it(`give label to 'Text Field' as '${requiredWithoutFieldLabel}'`, () => {
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").type(requiredWithoutFieldLabel);
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Without'", () => {
      cy.get("[data-cy=\"fb-control-required_without:foo,bar,...\"]").click();
    });

    it(`select '${requiredWithFieldLabel}' field`, () => {
      cy.get("[data-cy=\"validators.required_without.name\"]")
        .type("{downarrow}{downarrow}{downarrow}{downarrow}{enter}");
    });

    it(`Make '${requiredWithoutFieldLabel}' field required, if '${requiredWithFieldLabel}' field is empty: Add text field`, () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Status' validation on 'Autocomplete'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("create 'Autocomplete'", () => {
      cy.fbSelectAutoComplete();
    });

    it(`give label to 'Autocomplete' as '${requiredDocStatusFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").type(requiredDocStatusFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Status'", () => {
      cy.get("[data-cy=\"fb-control-required_document_status:value\"]").click();
    });

    it("select Released status", () => {
      cy.get("[data-cy=\"validators.required_document_status.name\"]").type("Released{downarrow}{enter}");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Add 'Required Document Type' validation on 'Autocomplete'", () => {

    it("open add field dialogue", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("create 'Autocomplete'", () => {
      cy.fbSelectAutoComplete();
    });

    it(`give label to 'Autocomplete' as '${requiredDocTypeFieldLabel}'`, () => {
      cy.get("[data-cy=\"label\"]").type(requiredDocTypeFieldLabel);
    });

    it("Select 'Document revision' as options", () => {
      cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
    });

    it("open validations", () => {
      cy.fbOpenValidation();
    });

    it("Mark as 'Required Document Type'", () => {
      cy.get("[data-cy=\"fb-control-required_document_type:value\"]").click();
    });

    it("select Component Specification", () => {
      cy.get("[data-cy=\"validators.required_document_type.name\"]").type("Component Specification{downarrow}{enter}");
    });

    it("Add autocomplete", () => {
      cy.fbAddField();
    });

  });

  context("Store DocId, Save document And 'Approve & Release Document", () => {

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocument();
    });

    it("Store Document Id", () => {
      cy.get("[data-cy=\"common.docId\"]").then((element) => {
        const text = element.text();
        docId = text.split(":")[1].trim();
        cy.log(docId);
      });
    });

    it("Approve and Release", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 1000 }).click();
      cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    });

  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]", { timeout: 50 * 1000 }).click();
    });
  });

  context("Tries to submit empty form", () => {

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocument();
    });

    it("shows error 'required’ below title field", () => {
      cy.get("[data-cy=\"field-name\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

    it("shows error 'required’ below description field", () => {
      cy.get("[data-cy=\"field-description\"] .MuiFormHelperText-root.Mui-error")
        .should("have.text", "Required");
    });

  });

  context("fills in Title and Description", () => {
    it("type a title", () => {
      cy.get("#Title-field", { timeout: 10000 }).type("Doc Title{enter}");
    });

    it("type a description", () => {
      cy.get("[data-cy=\"RichTextEditor.description\"]", { timeout: 10000 }).type("Doc Desription");
    });
  });

  context("Validation errors on custom fields should not prevent from saving document", () => {
    it("saving the document", () => {
      cy.drClickCreateDocument();
    });
  });

  context("Validation errors should prevent from releasing document", () => {
    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 1000 }).click();
      cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click().wait(3000);
    });

    it("Check returned errors are not empty", () => {
      cy.checkToastMessage({ exists: true });
    });

    it("Cancel release of document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]", { timeout: 20 * 1000 }).click();
    });
  });

  context(`Test ${requiredFieldLabel} (required) Field`, () => {
    it("fill in 'required' custom text field", () => {
      cy.get(`[data-cy^='${requiredFieldSelector}']`).type("abc");
    });

    it("remove text", () => {
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).clear();
    });

    it("should show error for 'required' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `The ${requiredFieldLabel} field is required.`);
      });
    });

    it("fill in 'required' custom text field", () => {
      cy.get(`[data-cy^='${requiredFieldSelector}']`).type("Required field added.");
    });
  });

  context(`Test ${requiredIfFieldLabel} (required if) Field`, () => {
    it(`remove text from ${requiredFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}'] input`).clear();
    });

    it(`type '${requiredIfFieldValue}' in '${requiredFieldLabel}' field`, () => {
      cy.get(`[data-cy^='${requiredFieldSelector}']`).type(requiredIfFieldValue);
    });

    it("should show error for 'required if' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `The ${requiredIfFieldLabel} field is required when ${requiredFieldLabel} is ${requiredIfFieldValue}.`);
      });
    });

    it("fill in 'required' custom text field", () => {
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).type("added");
    });
  });

  context(`Test ${requiredIfInFieldLabel} (required if in) Field`, () => {
    it(`remove text from ${requiredIfFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredIfFieldSelector}'] input`).clear();
    });

    it(`type '${requiredIfInFieldValues.split(",").join(" or ")}' in '${requiredIfFieldLabel}' field`, () => {
      cy.get(`[data-cy^='${requiredIfFieldSelector}']`).type(requiredIfInFieldValues.split(",")[0]);
    });

    it("should show error for 'required if in' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredIfInFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `The ${requiredIfInFieldLabel} field is required when ${requiredIfFieldLabel} includes , .`);
      });
    });

    it("fill in text field", () => {
      cy.get(`[data-cy^='${requiredIfInFieldSelector}']`).type("added");
    });
  });

  context(`Test ${requiredWithFieldLabel} (required with) Field`, () => {
    it(`remove text from ${requiredIfInFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredIfInFieldSelector}'] input`).clear();
    });

    it(`type anything in '${requiredIfInFieldLabel}' field`, () => {
      cy.get(`[data-cy^='${requiredIfInFieldSelector}']`).type("USA");
    });

    it("should show error for 'required with' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `The ${requiredWithFieldLabel} field is required when ${requiredIfInFieldLabel} is not empty.`);
      });
    });

    it("fill in 'required with' custom text field", () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).type("California");
    });
  });

  context(`Test ${requiredWithoutFieldLabel} (required without) Field`, () => {
    it(`remove text from ${requiredWithFieldLabel}`, () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}'] input`).clear();
    });

    it("should show error for 'required without' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredWithoutFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", `The ${requiredWithoutFieldLabel} field is required when ${requiredWithFieldLabel} is empty.`);
      });
    });

    it(`fill in '${requiredWithFieldLabel}' field only`, () => {
      cy.get(`[data-cy^='${requiredWithFieldSelector}']`).type("California");
    });
  });

  context(`Test ${requiredDocTypeFieldLabel} (required document type) Field`, () => {
    it("Add incorrect document", () => {
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}'] input`).type("initial AR Form{downarrow}{enter}");
    });

    it("should show error for 'required document type' field", () => {
      cy.wait(1000);
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).then(($elem) => {
        const errorBlock = $elem.offsetParent().siblings("p");

        cy.wrap(errorBlock)
          .should("have.text", "Incorrect document type.");
      });
    });

    it(`fill in '${requiredDocTypeFieldLabel}' with our CS Document`, () => {
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}'] input`).clear();
      cy.get(`[data-cy^='${requiredDocTypeFieldSelector}']`).type(`${csDocTitle}{downarrow}{enter}`);
    });
  });

  context("Release document", () => {

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocument();
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 1000 }).click();
      cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click().wait(3000);
    });
  });

  context("No validation error, submission is successful", () => {

    it("Check returned errors are empty", () => {
      cy.checkToastMessage({ exists: false });
    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

