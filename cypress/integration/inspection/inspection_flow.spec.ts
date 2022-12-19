// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { DEFAUL_REV_STAGE } from "../../support/commands";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { Categories } from "../../utils/constants/categories";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let formDocumentType;
let subassemblyDocumentType;
let adminEmployee;
let group;
let initialArDocument;
let subassemblyDocumentForm;
let approvalRequestDocumentType;
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");
const FGLandSLSchema = [
  {
    name: "lot_quantity",
    type: "quantity",
    index: 0,
    label: "Quantity Received",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    editorProperties: [],
    validationAttribute: "Quantity Received",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
    tabId: "details",
  },
  {
    name: "100-inspection-override",
    type: "checkboxgroup",
    index: 1,
    label: "100% Inspection Override",
    options: [
      {
        text: "100% Inspection Override",
        value: "100% Inspection Override",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    validationMode: "default",
    editorProperties: [],
    validationAttribute: "100% Inspection Override",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
    tabId: "details",
  },
];
const FGLandSLFieldsConfig = {
  D: {
    visible: false,
    required: false,
  },
  E: {
    label: "Record Type",
    visible: true,
    required: true,
  },
  F: {
    label: "Record ID",
    visible: false,
    required: true,
  },
  G: {
    visible: false,
    required: false,
  },
  I: {
    visible: false,
  },
  J: {
    visible: false,
  },
  K: {
    label: "Void",
    visible: true,
  },
  L: {
    label: "Correction",
    visible: true,
  },
  N: {
    label: "Finalize and Release",
    visible: true,
  },
  O: {
    label: "Record History",
    visible: true,
  },
  R: {
    visible: false,
  },
  S: {
    label: "Update Record",
    visible: true,
  },
  A1: {
    label: "WIP",
    visible: true,
  },
  A2: {
    label: "Voided",
    visible: true,
  },
  A3: {
    label: "Archive",
    visible: true,
  },
  P1: {
    label: "WIP",
    visible: true,
  },
  P2: {
    label: "Voided",
    visible: true,
  },
  P3: {
    label: "Archive",
    visible: true,
  },
};
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
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
    tabId: "specification",
  },
];

xcontext("Inspection flow", () => {
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
                group: DOC_TYPE_GROUP.PART,
                isQms: true,
                category: Categories.Parts,
                schema: subassemblySchema,
              },
              {
                documentTypeName: "Subassembly Lot",
                documentTypeAcronym: "SA-",
                group: DOC_TYPE_GROUP.PART_LOT,
                privateNumberPool: true,
                isQms: true,
                category: Categories.Record,
                needsSignature: true,
                startingNumber: 1,
                defaultRevStage: DEFAUL_REV_STAGE.NUMERIC,
                schema: FGLandSLSchema,
                fieldsConfig: FGLandSLFieldsConfig,
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
      }).then((response) => {
        loginResponse = response;
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
                  label: "Change Orders",
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
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
                      tabId: "specification",
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
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

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
          cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
          cy.fbEnterNameValue({ name: "label", value: "Inspection template" });
          cy.fbSelectCheckboxValue("inspectionSection");
          cy.fbAddNewFieldButton();
        });

        it("Add Text field with range", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "Height" });
          cy.fbEnterNameValue({ name: "placeholder", value: "Enter Value" });
          cy.get(`[data-cy="fb-control-form.builder.range"]`).arrowClick();
          cy.fbSelectTextFieldRangeFromValue({ value: "20" });
          cy.fbSelectTextFieldRangeToValue({ value: "150" });
          cy.get(`[data-cy="fb-control-form.builder.critical.to.quality"]`).arrowClick();
          cy.get(`[data-cy="fb-control-form.builder.inspection"]`).arrowClick();
          cy.get(`[data-cy="fb-control-form.builder.pass.value"]`).arrowClick();
          cy.get("[name=\"editorConfig.pass.value.from\"]").arrowType("20");
          cy.get("[name=\"editorConfig.pass.value.to\"]").arrowType("150");
          cy.get("[id$=\"editorConfig.aql\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("1.0").arrowClick();
          cy.unClick();
          cy.fbSelectCheckboxValue("includeInInspection", "includeInFaiInspection");
          cy.fbAddNewFieldButton();
        });

        it("Add 'Width field'", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
          cy.fbEnterNameValue({ name: "label", value: "Width" });
          cy.fbEnterNameValue({ name: "placeholder", value: "Enter Value" });
          cy.get(`[data-cy="fb-control-form.builder.range"]`).arrowClick();
          cy.fbSelectTextFieldRangeFromValue({ value: "20" });
          cy.fbSelectTextFieldRangeToValue({ value: "150" });
          cy.get(`[data-cy="fb-control-form.builder.critical.to.quality"]`).arrowClick();
          cy.get(`[data-cy="fb-control-form.builder.inspection"]`).arrowClick();
          cy.get(`[data-cy="fb-control-form.builder.pass.value"]`).arrowClick();
          cy.get("[name=\"editorConfig.pass.value.from\"]").arrowType("20");
          cy.get("[name=\"editorConfig.pass.value.to\"]").arrowType("150");
          cy.get("[id$=\"editorConfig.aql\"]").arrowClick();
          cy.get("ul>li[role=option]").contains("1.0").arrowClick();
          cy.unClick();
          cy.fbSelectCheckboxValue("includeInInspection", "includeInFaiInspection");
          cy.fbAddNewFieldButton();
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

      it("Navigate to Specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Select make vs buy", () => {
        cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
        cy.get("ul>li[role=option]").contains("Make").arrowClick();
      });

      it("Select unit of measure", () => {
        cy.get("[id$=\"unit-of-measure\"]").arrowClick({ force: true });
        cy.get("ul>li[role=option]").contains("Batch").arrowClick();
      });

      it("Select traceability required", () => {
        cy.get("[value=\"Traceability required\"]").check({ force: true });
      });

      it("Select 'No' for Serialized option", () => {
        cy.get("[name=\"serialized\"][value=\"No\"]").check({ force: true });
      });

      it("Select 'IQC Required'", () => {
        cy.get("[value=\"IQC Required\"]").check({ force: true });
      });

      it("Select 'Limited Shelf Life'", () => {
        cy.get("[value=\"Limited Shelf Life\"]").check({ force: true });
      });

      it("Select 'FAI Required'", () => {
        cy.get("[value=\"FAI Required\"]").check({ force: true });
      });

      context("Release part document", () => {
        it("Save part document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

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
      cy.drCreateNewDocumentFromFormRecord();
    });

    it("Enters title 'Inspection Document'", () => {
      cy.drEnterDocumentTitle({ name: "Inspection Document" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get("[name=\"lot_quantity\"]").arrowType("12");
    });

    it("Check 100% override", () => {
      cy.get("[value=\"100% Inspection Override\"]").check();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on save", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Add reference to part", () => {
      cy.drSelectReferences("New Part for inspection");
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on save", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    context("Fill samples with values", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add 'Expiry Date'", () => {
        cy.xpath("//input[@name]/ ../div/button").arrowClick({ force: true });
        cy.get("button.MuiPickersDay-current").arrowClick();
      });

      it("Insert height for 'SAMPLE-1'", () => {
        cy.get("input[name^=height]").eq(0).arrowType("30");
      });

      it("Insert width for 'SAMPLE-1'", () => {
        cy.get("input[name^=width]").eq(0).arrowType("30");
      });

      it("Insert height for 'SAMPLE-2'", () => {
        cy.get("input[name^=height]").eq(1).arrowType("40");
      });

      it("Insert width for 'SAMPLE-2'", () => {
        cy.get("input[name^=width]").eq(1).arrowType("40");
      });

      it("Insert height for 'SAMPLE-3'", () => {
        cy.get("input[name^=height]").eq(2).arrowType("50");
      });

      it("Insert width for 'SAMPLE-3'", () => {
        cy.get("input[name^=width]").eq(2).arrowType("50");
      });

      it("Insert height for 'SAMPLE-4'", () => {
        cy.get("input[name^=height]").eq(3).arrowType("60");
      });

      it("Insert width for 'SAMPLE-4'", () => {
        cy.get("input[name^=width]").eq(3).arrowType("60");
      });

      it("Insert height for 'SAMPLE-5'", () => {
        cy.get("input[name^=height]").eq(4).arrowType("70");
      });

      it("Insert width for 'SAMPLE-5'", () => {
        cy.get("input[name^=width]").eq(4).arrowType("70");
      });

      it("Insert height for 'SAMPLE-6'", () => {
        cy.get("input[name^=height]").eq(5).arrowType("80");
      });

      it("Insert width for 'SAMPLE-6'", () => {
        cy.get("input[name^=width]").eq(5).arrowType("80");
      });
    });

    context("Fill lot summary", () => {
      it("Fill 'Accepted' textfield", () => {
        cy.get("[name=lot_summary_accepted]").arrowType("1");
      });

      it("Fill 'Scrapped' textfield", () => {
        cy.get("[name=lot_summary_scrapped]").arrowType("1");
      });

      it("Fill 'Rework' textfield", () => {
        cy.get("[name=lot_summary_rework]").arrowType("4");
      });

      it("Fill 'Use As Is' textfield", () => {
        cy.get("[name=lot_summary_use_as_is]").arrowType("2");
      });

      it("Fill 'Return To Vendor' textfield", () => {
        cy.get("[name=lot_summary_return_to_vendor]").arrowType("1");
      });

      it("Fill 'Restricted Use' textfield", () => {
        cy.get("[name=lot_summary_restricted_use]").arrowType("3");
      });
    });

    context("Release Inspection document", () => {
      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Add approvals", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.unClick();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve inspection document", () => {
        cy.ebApprove();
      });

      it(`Check status is ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Check referenced by parts", () => {
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", `LOT #${lotDateSuffix}04 - 1 - Inspection Document - 3 Restricted Use`);
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", `LOT #${lotDateSuffix}03 - 1 - Inspection Document - 2 Use as Is`);
        cy.get("[data-cy=\"common.referenced.by\"]")
          .should("contain.text", `LOT #${lotDateSuffix}02 - 1 - Inspection Document - 4 Rework`);
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
          cy.dlFilterByDocId({ docId: `LOT #${lotDateSuffix}04` });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.drSelectDetailsTab();
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

        it("Open 'Use as is' record", () => {
          cy.dlFilterByDocId({ docId: `LOT #${lotDateSuffix}03` });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.drSelectDetailsTab();
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

        it("Open 'Rework' record", () => {
          cy.dlFilterByDocId({ docId: `LOT #${lotDateSuffix}02` });
          cy.dlSelectFirstDocument();
        });

        it("Verify quantity value", () => {
          cy.drSelectDetailsTab();
          cy.get("[name=\"lot_quantity\"]").should("have.attr", "value", "4");
        });
      });
    });
  });
});

export { };

