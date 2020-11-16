import { Button } from "@material-ui/core";
import { chunk, uniqBy } from "lodash";
import * as React from "react";
import { DocumentRevision, HeaderTableType } from "../../../../../state/ducks/documentRevisions";
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
  const schema = documentRevision.formDocument?.formTemplate?.schema;
  const input = documentRevision.formInput || {};

  const headers =
  uniqBy(schema?.map((item) => {
    switch (item.type) {
      case "section":
        return {
          label: "Sample",
          key: "sample",
        };
      default:
        return {
          label: item.label,
          key: item.label,
        };
    }
  }), "key") as HeaderTableType[];

  const DEFAULT_DATA = [];
  const valueWithKey = schema?.map((item) => {
    const inputNames = Object.keys(input);
    if (inputNames.includes(item.name as string)) {
      return { ...item, inputValue: input[item.name as string] };
    }
    return { ...item, inputValue: item.label };
  }) || DEFAULT_DATA;
  const dataSplitedToRows = chunk(valueWithKey, headers.length);
  const data = dataSplitedToRows.map((item) => item.map((e) => e.inputValue)).map((e) => Object.assign({}, e));

  return (
    <>
      <Button data-cy="exportCSVButton" variant="outlined" color="secondary" onClick={dialog.open}>
        <Text translation="common.export" />
      </Button>
      <ExportListDialog
        {...{ headers, data, dialog  }}
      />
    </>
  );
};

export default ExportToCSVButton;
