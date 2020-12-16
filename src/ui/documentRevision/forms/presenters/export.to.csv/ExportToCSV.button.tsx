import { Button } from "@material-ui/core";
import { includes, isEmpty } from "lodash";
import * as React from "react";
import { getFormattedDateString, MomentFormats } from "../../../../../common/utils/date";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions";
import Text from "../../../../components/Text";
import ExportListDialog from "../../../../document.revision/list/ExportListDialog/ExportListDialog";
import useDialog from "../../../../hooks/useDialog";

interface Props {
  documentRevision: DocumentRevision;
}

const ExportToCSVButton: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const dialog = useDialog();
  const schema = documentRevision?.schema || documentRevision?.formDocument?.formTemplate?.schema;
  const input = documentRevision?.formInput || {};
  const omitExportFields = [
    "subsection",
    "stepsection",
    "teststep",
    "instructionsmediaupload",
    "evidencemediaupload",
    "testRequirement",
    "paragraph",
    "blanktplform",
    "fileupload",
    "hyperlink",
    "purchaseorder",
    "poreceive",
    "eqmaintenance",
    "procedure",
    "parts",
    "task",
    "approvals",
    "poApprovalMatrix",
    "approvalMatrix",
    "hellosign",
    "approval",
    "inlineapproval",
    "action",
    "createlabel",
    "checkpoint",
    "selectrequirement",
    "selectdocument",
    "instructionsdocument",
    "requestapproval",
    "documentRevisions",
    "documentRevisions",
  ];

  const itemsGroupedInSections: any[] = [];

  const valueWithKey = schema?.map((item) => {
    const inputNames = Object.keys(input);
    if (inputNames.includes(item.name as string)) {
      return { ...item, inputValue: input[item.name as string] };
    }
    return { ...item, inputValue: "" };
  }) || [];

  valueWithKey.forEach((element) => {
    if (element.type === "section" && !element.inspectionSection) {
      return;
    }
    if (element.type === "section" && element.inspectionSection) {
      itemsGroupedInSections.push([]);
    }
    itemsGroupedInSections[itemsGroupedInSections.length - 1]?.push(element);
  });

  const items = itemsGroupedInSections.map((sectionItems) => {
    const itemsUnderExport = sectionItems.filter((item) => !includes(omitExportFields, item.type));
    return Object.fromEntries(
      itemsUnderExport.map((item) => {
        if (item.type === "section" && item.inspectionSection) {
          return ["Sample",
            item.label,
          ];
        }
        if (item.type === "section" && !item.inspectionSection) {
          return [];
        }
        if (item.type === "checkboxgroup") {
          return [item.label,
            item.inputValue.toString(),
          ];
        }
        if (item.type === "datepicker") {
          return [item.label,
            item.inputValue ? getFormattedDateString(item.inputValue, MomentFormats.MonthDateYear) : "",
          ];
        }
        return [item.label,
          item.inputValue,
        ];
      })); });

  // by passing only empty array, library will return the error
  const data = isEmpty(items) ? [""] : items;

  return (
    <>
      <Button data-cy="exportCSVButton" variant="outlined" color="secondary" onClick={dialog.open}>
        <Text translation="common.export" />
      </Button>
      <ExportListDialog
        {...{ data, dialog }}
        useKeysAsHeaders
        customFileName="FBFieldsList"
      />
    </>
  );
};

export default ExportToCSVButton;
