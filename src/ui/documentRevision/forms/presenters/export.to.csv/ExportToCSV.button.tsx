import { Button } from "@material-ui/core";
import * as React from "react";
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

  const DEFAULT_DATA = [];
  const arrayOfData: any[] = [];

  const valueWithKey = schema?.map((item) => {
    const inputNames = Object.keys(input);
    if (inputNames.includes(item.name as string)) {
      return { ...item, inputValue: input[item.name as string] };
    }
    return { ...item, inputValue: "" };
  }) || DEFAULT_DATA;

  valueWithKey.forEach((element) => {
    if (element.type === "section") {
      arrayOfData.push([]);
      arrayOfData[arrayOfData.length - 1].push(element);
      return;
    }
    arrayOfData[arrayOfData.length - 1].push(element);
  });

  const data = arrayOfData.map((e) => Object.fromEntries(
    e.map((i) => {
      if (i.type === "section") {
        return ["Sample",
          i.label,
        ];
      }
      return [i.label,
        i.inputValue,
      ];
    })));

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
