import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const QPITest: IdocumentTypeDto = {
  documentTypeName: "Quantity Process Instructions Test",
  documentTypeAcronym: "QPI-",
  group: DOC_TYPE_GROUP.PI,
  schema: [
    {
      name: "fb-mpi-procedure-section-built-in",
      type: "section",
      index: 0,
      label: "form.builder.mpiprocedure",
      deleteDisabled: false,
      deleteInFormDisabled: true,
      tabId: "details",
    },
    {
      name: "mpi-procedure-built-in",
      type: "mpiprocedure",
      index: 1,
      stepIndex: 1,
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "approvals-built-in",
      type: "approvals",
      index: 2,
      label: "Approvals",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      uniqueSchemaItem: true,
      validationAttribute: "Approvals",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
  ],
};
