import { Button } from "@material-ui/core";
import { includes } from "lodash";
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
  const schema = documentRevision?.formDocument?.formTemplate?.schema;
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
    if (element.label === "form.builder.procedure" || element.label === "form.builder.section") {
      return;
    }
    if (element.type === "section") {
      itemsGroupedInSections.push([]);
    }
    itemsGroupedInSections[itemsGroupedInSections.length - 1]?.push(element);
  });

  const data = itemsGroupedInSections.map((sectionItems) => {
    const itemsUnderExport = sectionItems.filter((item) => !includes(omitExportFields, item.type));
    return Object.fromEntries(
      itemsUnderExport.map((item) => {
        if (item.type === "section") {
          return ["Sample",
            item.label,
          ];
        }
        if (item.type === "checkboxgroup") {
          return [item.label,
            item.inputValue.toString(),
          ];
        }
        if (item.type === "datepicker") {
          return [item.label,
            getFormattedDateString(item.inputValue, MomentFormats.MonthDateYear),
          ];
        }
        return [item.label,
          item.inputValue,
        ];
      })); });

  return (
    <>
      <Button data-cy="exportCSVButton" variant="outlined" color="secondary" onClick={dialog.open}>
        <Text translation="common.export" />
      </Button>
      <ExportListDialog
        {...{ data, dialog }}
        useKeysAsHeaders
      />
    </>
  );
};

export default ExportToCSVButton;
