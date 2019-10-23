import { Box, Button } from "@material-ui/core";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import Text from "../../../components/Text";
import React from "react";
import formBuilderStore from "../../stores/FBStore";
import FBExportDialog from "./FBExportDialog";

const FBImportExport: React.FunctionComponent = () => {
  const Span = (props: any) => <span {...props} />;

  const importSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const schema = JSON.parse(event.target.result);
      formBuilderStore.importSchema(schema);
    };
    reader.readAsText(e.currentTarget.files![0]);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="flex-end">
      <input
        hidden={true}
        id="upload-file"
        type="file"
        onChange={importSchema}
      />
      <label htmlFor="upload-file">
        <Button component={Span} startIcon={<VerticalAlignBottomIcon />}>
          <Text translation="common.import" />
        </Button>
      </label>
      <FBExportDialog Span={Span} />
    </Box>
  );
};

export default FBImportExport;
