// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let formDocumentType;
let subassemblyDocumentType;
let adminEmployee;
let group;
let initialArDocument;
let subassemblyDocumentForm;
let approvalRequestDocumentType;

const subassemblySchema = [
  {
    name: "make-vs-buy",
    type: "select",
    index: 0,
    label: "Make vs Buy",
    options: [
      {
        text: "Make",
        value: "Make",
      },
      {
        text: "Buy",
        value: "Buy",
      },
      {
        text: "Make and buy",
        value: "Make and buy",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "Make vs Buy",
    applicableValidationSchema: true,
  },
  {
    name: "primary-supplier",
    type: "autocomplete",
    index: 1,
    label: "Primary Supplier",
    rules: "required_if_in:make-vs-buy,Buy,Make and buy",
    multiple: true,
    optionId: "5",
    placeholder: "Start typing to see the list",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    showErrorMsg: false,
    validationMode: "visibility",
    editorProperties: [
      "multiple",
    ],
    omitFinalValidation: true,
    validationAttribute: "Primary Supplier",
    applicableValidationSchema: true,
  },
  {
    name: "other-suppliers",
    type: "autocomplete",
    index: 2,
    label: "Other Suppliers",
    rules: "required_if_in:make-vs-buy,Buy,Make and buy",
    multiple: true,
    optionId: "5",
    placeholder: "Start typing to see the list",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    showErrorMsg: false,
    validationMode: "visibility",
    editorProperties: [
      "multiple",
    ],
    omitFinalValidation: true,
    validationAttribute: "Other Suppliers",
    applicableValidationSchema: true,
  },
  {
    name: "unit-of-measure",
    type: "select",
    index: 3,
    label: "Unit of measure",
    options: [
      {
        text: "Each",
        value: "Each",
      },
      {
        text: "Roll(s)",
        value: "Roll(s)",
      },
      {
        text: "Spool(s)",
        value: "Spool(s)",
      },
      {
        text: "Set(s)",
        value: "Set(s)",
      },
      {
        text: "Box(s)",
        value: "Box(s)",
      },
      {
        text: "Case(s)",
        value: "Case(s)",
      },
      {
        text: "Lot(s)",
        value: "Lot(s)",
      },
      {
        text: "Pack(s)",
        value: "Pack(s)",
      },
      {
        text: "Pail(s)",
        value: "Pail(s)",
      },
      {
        text: "Unit(s)",
        value: "Unit(s)",
      },
      {
        text: "Bobbin(s)",
        value: "Bobbin(s)",
      },
      {
        text: "Bottle(s)",
        value: "Bottle(s)",
      },
      {
        text: "Sample(s)",
        value: "Sample(s)",
      },
      {
        text: "Batch",
        value: "Batch",
      },
      {
        text: "foot",
        value: "foot",
      },
      {
        text: "inch",
        value: "inch",
      },
      {
        text: "mm.",
        value: "mm.",
      },
      {
        text: "cm.",
        value: "cm.",
      },
      {
        text: "m.",
        value: "m.",
      },
      {
        text: "sqft.",
        value: "sqft.",
      },
      {
        text: "ar",
        value: "ar",
      },
      {
        text: "gram",
        value: "gram",
      },
      {
        text: "kilogram",
        value: "kilogram",
      },
      {
        text: "pounds",
        value: "pounds",
      },
      {
        text: "gallon",
        value: "gallon",
      },
      {
        text: "ounce",
        value: "ounce",
      },
    ],
    placeholder: "Enter",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "Unit of measure",
    applicableValidationSchema: true,
  },
  {
    name: "traceability-required",
    type: "checkboxgroup",
    index: 4,
    label: "Traceability required",
    options: [
      {
        text: "Traceability required",
        value: "Traceability required",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "Traceability required",
    applicableValidationSchema: true,
  },
  {
    name: "serialized",
    type: "radiogroup",
    index: 5,
    label: "Serialized",
    rules: "required_if_in:traceability-required,Traceability required",
    options: [
      {
        text: "Yes",
        value: "Yes",
      },
      {
        text: "No",
        value: "No",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "visibility",
    editorProperties: [],
    validationAttribute: "Serialized",
    applicableValidationSchema: true,
  },
  {
    name: "select-serialization",
    type: "select",
    index: 6,
    label: "Select serialization",
    rules: "required_if_in:serialized,Yes",
    options: [
      {
        text: "Select Provided Serialization",
        value: "Select Provided Serialization",
      },
      {
        text: "In-house Generated Serialization",
        value: "In-house Generated Serialization",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "visibility",
    editorProperties: [],
    validationAttribute: "Select serialization",
    applicableValidationSchema: true,
  },
  {
    name: "iqc-required",
    type: "checkboxgroup",
    index: 7,
    label: "IQC Required",
    options: [
      {
        text: "IQC Required",
        value: "IQC Required",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "IQC Required",
    applicableValidationSchema: true,
  },
  {
    name: "limited-shelf-life",
    type: "checkboxgroup",
    index: 8,
    label: "Limited Shelf Life",
    options: [
      {
        text: "Limited Shelf Life",
        value: "Limited Shelf Life",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "Limited Shelf Life",
    applicableValidationSchema: true,
  },
  {
    name: "fai-required",
    type: "checkboxgroup",
    index: 9,
    label: "FAI Required",
    options: [
      {
        text: "FAI Required",
        value: "FAI Required",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "FAI Required",
    applicableValidationSchema: true,
  },
];

context("Inspection flow", () => {
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
              {
                documentTypeName: "Test Subassembly",
                documentTypeAcronym: "SA-",
                group: "PART",
                isQms: true,
                category: "Parts",
                schema: subassemblySchema,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          subassemblyDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Subassembly");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
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

  context("[API]Update navigation", () => {
    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
          ],
        },
      }).then(() => {
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

  context("Create Part for Inspection", () => {
    context("[API]Create Subassembly for Inspection part", () => {
      it("[API]Create Subassembly form with API request", (done: any) => {
        cy.grpGetGroupByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          groupName: "Everyone",
        }).then((response) => {
          group = response;
          cy.arGetArDocumentByName({
            sessionId: loginResponse.sessionId,
            employeeId: adminEmployee.id,
            name: "AR Form",
          }).then((response) => {
            initialArDocument = response;
            cy.drCreateDocumentRevision({
              payload: {
                attachments: [],
                description: "<p>Form for subassembly part</p>",
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
                name: "Subassembly part form",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: subassemblyDocumentType[0].id,
                  }],
                  schema: [
                    {
                      name: "make-vs-buy",
                      type: "select",
                      index: 0,
                      label: "Make vs Buy",
                      options: [
                        {
                          text: "Make",
                          value: "Make",
                        },
                        {
                          text: "Buy",
                          value: "Buy",
                        },
                        {
                          text: "Make and buy",
                          value: "Make and buy",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "Make vs Buy",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "primary-supplier",
                      type: "autocomplete",
                      index: 1,
                      label: "Primary Supplier",
                      rules: "required_if_in:make-vs-buy,Buy,Make and buy",
                      multiple: true,
                      optionId: "5",
                      placeholder: "Start typing to see the list",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      validationMode: "visibility",
                      editorProperties: [
                        "multiple",
                      ],
                      validationAttribute: "Primary Supplier",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "other-suppliers",
                      type: "autocomplete",
                      index: 2,
                      label: "Other Suppliers",
                      rules: "required_if_in:make-vs-buy,Buy,Make and buy",
                      multiple: true,
                      optionId: "5",
                      placeholder: "Start typing to see the list",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      validationMode: "visibility",
                      editorProperties: [
                        "multiple",
                      ],
                      validationAttribute: "Other Suppliers",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "unit-of-measure",
                      type: "select",
                      index: 3,
                      label: "Unit of measure",
                      options: [
                        {
                          text: "Each",
                          value: "Each",
                        },
                        {
                          text: "Roll(s)",
                          value: "Roll(s)",
                        },
                        {
                          text: "Spool(s)",
                          value: "Spool(s)",
                        },
                        {
                          text: "Set(s)",
                          value: "Set(s)",
                        },
                        {
                          text: "Box(s)",
                          value: "Box(s)",
                        },
                        {
                          text: "Case(s)",
                          value: "Case(s)",
                        },
                        {
                          text: "Lot(s)",
                          value: "Lot(s)",
                        },
                        {
                          text: "Pack(s)",
                          value: "Pack(s)",
                        },
                        {
                          text: "Pail(s)",
                          value: "Pail(s)",
                        },
                        {
                          text: "Unit(s)",
                          value: "Unit(s)",
                        },
                        {
                          text: "Bobbin(s)",
                          value: "Bobbin(s)",
                        },
                        {
                          text: "Bottle(s)",
                          value: "Bottle(s)",
                        },
                        {
                          text: "Sample(s)",
                          value: "Sample(s)",
                        },
                        {
                          text: "Batch",
                          value: "Batch",
                        },
                        {
                          text: "foot",
                          value: "foot",
                        },
                        {
                          text: "inch",
                          value: "inch",
                        },
                        {
                          text: "mm.",
                          value: "mm.",
                        },
                        {
                          text: "cm.",
                          value: "cm.",
                        },
                        {
                          text: "m.",
                          value: "m.",
                        },
                        {
                          text: "sqft.",
                          value: "sqft.",
                        },
                        {
                          text: "ar",
                          value: "ar",
                        },
                        {
                          text: "gram",
                          value: "gram",
                        },
                        {
                          text: "kilogram",
                          value: "kilogram",
                        },
                        {
                          text: "pounds",
                          value: "pounds",
                        },
                        {
                          text: "gallon",
                          value: "gallon",
                        },
                        {
                          text: "ounce",
                          value: "ounce",
                        },
                      ],
                      placeholder: "Enter",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "Unit of measure",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "traceability-required",
                      type: "checkboxgroup",
                      index: 4,
                      label: "Traceability required",
                      options: [
                        {
                          text: "Traceability required",
                          value: "Traceability required",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "Traceability required",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "serialized",
                      type: "radiogroup",
                      index: 5,
                      label: "Serialized",
                      rules: "required_if_in:traceability-required,Traceability required",
                      options: [
                        {
                          text: "Yes",
                          value: "Yes",
                        },
                        {
                          text: "No",
                          value: "No",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      validationMode: "visibility",
                      editorProperties: [],
                      validationAttribute: "Serialized",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "select-serialization",
                      type: "select",
                      index: 6,
                      label: "Select serialization",
                      rules: "required_if_in:serialized,Yes",
                      options: [
                        {
                          text: "Select Provided Serialization",
                          value: "Select Provided Serialization",
                        },
                        {
                          text: "In-house Generated Serialization",
                          value: "In-house Generated Serialization",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      validationMode: "visibility",
                      editorProperties: [],
                      validationAttribute: "Select serialization",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "iqc-required",
                      type: "checkboxgroup",
                      index: 7,
                      label: "IQC Required",
                      options: [
                        {
                          text: "IQC Required",
                          value: "IQC Required",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "IQC Required",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "limited-shelf-life",
                      type: "checkboxgroup",
                      index: 8,
                      label: "Limited Shelf Life",
                      options: [
                        {
                          text: "Limited Shelf Life",
                          value: "Limited Shelf Life",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "Limited Shelf Life",
                      applicableValidationSchema: true,
                    },
                    {
                      name: "fai-required",
                      type: "checkboxgroup",
                      index: 9,
                      label: "FAI Required",
                      options: [
                        {
                          text: "FAI Required",
                          value: "FAI Required",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "FAI Required",
                      applicableValidationSchema: true,
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              subassemblyDocumentForm = response;
              cy.drAPIApproveAndRelease({
                documentId: subassemblyDocumentForm.id,
                payload: {
                  effectiveDate: (new Date()).toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                  approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => { done(); });
            });
          });
        });
      });
    });

    context("Revise subassembly for Part", () => {
      it("Navigate to documents", () => {
        cy.navigToDocumentList();
      });

      it("Select 'Subassembly part form'", () => {
        cy.dlSelectFirstDocument();
      });

      it("Click revise document", () => {
        cy.drClickReviseDocument();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Add Inspection fields", () => {
        it("Add inspection section", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectCustomFieldToAdd({ name: "Section" });
          cy.fbEnterLabel({ label: "Inspection template" });
          cy.get("[value=\"inspectionSection\"]").check();
          cy.fbAddField();
        });

        it("Add 'Height field'", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectCustomFieldToAdd({ name: "Text field with range" });
          cy.fbEnterLabel({ label: "Height" });
          cy.fbEnterPlaceholder({ placeholder: "Enter Value" });
          cy.get("[name$=\"rangeOption\"]").check();
          cy.get("[name=\"editorConfig.range.from\"]").type("20");
          cy.get("[name=\"editorConfig.range.to\"]").type("150");
          cy.get("[name=\"editorConfig.criticalToQuality\"]").check();
          cy.get("[name=\"editorConfig.inspection\"]").check();
          cy.get("[name=\"editorConfig.passValue\"]").check();
          cy.get("[name=\"editorConfig.pass.value.from\"]").type("20");
          cy.get("[name=\"editorConfig.pass.value.to\"]").type("150");
          cy.get("[id$=\"editorConfig.aql\"]").click();
          cy.get("ul[role=listbox]>li").contains("1.0").click();
          cy.get("[value=\"includeInInspection\"]").check();
          cy.get("[value=\"includeInFaiInspection\"]").check();
          cy.fbAddField();
        });

        it("Add 'Width field'", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectCustomFieldToAdd({ name: "Text field with range" });
          cy.fbEnterLabel({ label: "Width" });
          cy.fbEnterPlaceholder({ placeholder: "Enter Value" });
          cy.get("[name$=\"rangeOption\"]").check();
          cy.get("[name=\"editorConfig.range.from\"]").type("20");
          cy.get("[name=\"editorConfig.range.to\"]").type("150");
          cy.get("[name=\"editorConfig.criticalToQuality\"]").check();
          cy.get("[name=\"editorConfig.inspection\"]").check();
          cy.get("[name=\"editorConfig.passValue\"]").check();
          cy.get("[name=\"editorConfig.pass.value.from\"]").type("20");
          cy.get("[name=\"editorConfig.pass.value.to\"]").type("150");
          cy.get("[id$=\"editorConfig.aql\"]").click();
          cy.get("ul[role=listbox]>li").contains("1.0").click();
          cy.get("[value=\"includeInInspection\"]").check();
          cy.get("[value=\"includeInFaiInspection\"]").check();
          cy.fbAddField();
        });
      });

      context("Save form and release it", () => {
        it("Click save", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Create Part for Inspection", () => {
      it("Navigate to Parts", () => {
        cy.navigToParts();
      });

      it("Click 'ADD NEW PART'", () => {
        cy.recCreateRecordFromLandingPage();
        cy.inspecSelectRecordFormFromMultiSelect({ recordType: "Test Subassembly" });
      });

      it("Enter title 'New Part for inspection'", () => {
        cy.drEnterDocumentTitle({ name: "New Part for inspection" });
      });

      it("Enters description 'New Part for inspection description'", () => {
        cy.drEnterDocumentDescription({ description: "New Part for inspection description" });
      });

      it("Click on save", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Select make vs buy", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[id$=\"make-vs-buy\"]").click();
          cy.get("ul[role=listbox]>li").contains("Make").click();
        });
      });

      it("Select unit of measure", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[id$=\"unit-of-measure\"]").click();
          cy.get("ul[role=listbox]>li").contains("Batch").click();
        });
      });

      it("Select traceability required", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[value=\"Traceability required\"]").check();
        });
      });

      it("Select 'No' for Serialized option", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"serialized\"][value=\"No\"]").check();
        });
      });

      it("Select 'IQC Required'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[value=\"IQC Required\"]").check();
        });
      });

      it("Select 'Limited Shelf Life'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[value=\"Limited Shelf Life\"]").check();
        });
      });

      it("Select 'FAI Required'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[value=\"FAI Required\"]").check();
        });
      });

      context("Release part document", () => {
        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });

  context("Create Inspection Form", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Inscpection Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Inscpection Form" });
    });

    it("Enters description 'New Inspection Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Inspection Form description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Add output type named 'Test Component Specifications Lot'", () => {
      cy.drSelectOutputDocumentType({ documentType: "Component Specifications Lot" });
    });

    it("Add output type named 'Test Finished Good Lot'", () => {
      cy.drSelectOutputDocumentType({ documentType: "Finished Good Lot" });
    });

    it("Add output type named 'Subassembly Lot'", () => {
      cy.drSelectOutputDocumentType({ documentType: "Subassembly Lot" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Inspection document", () => {
    it("Create inspection from Form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'Inspection Document'", () => {
      cy.drEnterDocumentTitle({ name: "Inspection Document" });
    });

    it("Change document type", () => {
      cy.drSelectDocumentType({ documentType: "Subassembly Lot" });
    });

    it("Add reference to part", () => {
      cy.drSelectReferences("New Part for Inspection");
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").type("12");
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("Add 'Expiry Date'", () => {
      cy.poAddDateRequired();
    });

    context("Fill samples with values", () => {
      it("Insert height for 'SAMPLE-1'", () => {
        cy.get("input[name^=height]").eq(0).type("30");
      });

      it("Insert width for 'SAMPLE-1'", () => {
        cy.get("input[name^=width]").eq(0).type("30");
      });

      it("Insert height for 'SAMPLE-2'", () => {
        cy.get("input[name^=height]").eq(1).type("40");
      });

      it("Insert width for 'SAMPLE-2'", () => {
        cy.get("input[name^=width]").eq(1).type("40");
      });

      it("Insert height for 'SAMPLE-3'", () => {
        cy.get("input[name^=height]").eq(2).type("50");
      });

      it("Insert width for 'SAMPLE-3'", () => {
        cy.get("input[name^=width]").eq(2).type("50");
      });

      it("Insert height for 'SAMPLE-4'", () => {
        cy.get("input[name^=height]").eq(3).type("60");
      });

      it("Insert width for 'SAMPLE-4'", () => {
        cy.get("input[name^=width]").eq(3).type("60");
      });

      it("Insert height for 'SAMPLE-5'", () => {
        cy.get("input[name^=height]").eq(4).type("70");
      });

      it("Insert width for 'SAMPLE-5'", () => {
        cy.get("input[name^=width]").eq(4).type("70");
      });

      it("Insert height for 'SAMPLE-6'", () => {
        cy.get("input[name^=height]").eq(5).type("80");
      });

      it("Insert width for 'SAMPLE-6'", () => {
        cy.get("input[name^=width]").eq(5).type("80");
      });
    });

    context("Fill lot summary", () => {
      it("Fill 'Accepted' textfield", () => {
        cy.get("[name=lot_summary_accepted]").type("1");
      });

      it("Fill 'Scrapped' textfield", () => {
        cy.get("[name=lot_summary_scrapped]").type("1");
      });

      it("Fill 'Rework' textfield", () => {
        cy.get("[name=lot_summary_rework]").type("4");
      });

      it("Fill 'Use As Is' textfield", () => {
        cy.get("[name=lot_summary_use_as_is]").type("2");
      });

      it("Fill 'Return To Vendor' textfield", () => {
        cy.get("[name=lot_summary_return_to_vendor]").type("1");
      });

      it("Fill 'Restricted Use' textfield", () => {
        cy.get("[name=lot_summary_restricted_use]").type("3");
      });
    });


    context("Release Inspection document", () => {
      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Add approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve inspection document", () => {
        cy.ebApprove();
      });

      it("Check status is 'Released'", () => {
        cy.drCheckDocumentStatus({ status: "Released" });
      });

      it("Check referenced by parts", () => {
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", "SAL-00004 - A - Inspection Document - 3 Restricted Use");
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", "SAL-00003 - A - Inspection Document - 2 Use as Is");
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", "SAL-00002 - A - Inspection Document - 4 Rework");
      });
    });

    context("Check created parts to verify correct quantity", () => {
      context("Verify created record for 'Restricted Use'", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Clear filter", () => {
          cy.dlClearFilters();
        });

        it("Open 'Restricted Use' record", () => {
          cy.dlFilterByDocId({ docId: "SAL-00004" });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.get("[name=\"lot_quantity\"]").should("have.attr", "value", "3");
        });
      });

      context("Verify created record for 'Use as is'", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Clear filter", () => {
          cy.dlClearFilters();
        });

        it("Open 'Restricted Use' record", () => {
          cy.dlFilterByDocId({ docId: "SAL-00003" });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.get("[name=\"lot_quantity\"]").should("have.attr", "value", "2");
        });
      });

      context("Verify created record for 'Rework'", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Clear filter", () => {
          cy.dlClearFilters();
        });

        it("Open 'Restricted Use' record", () => {
          cy.dlFilterByDocId({ docId: "SAL-00002" });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.get("[name=\"lot_quantity\"]").should("have.attr", "value", "4");
        });
      });
    });
  });
});

export { };

