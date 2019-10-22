import { Box, Button, TextField } from "@material-ui/core";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import Text from "../../../components/Text";
import React, { useState } from "react";
import FBDialog from "../feedback/FBDialog";
import formBuilderStore from "../../stores/FBStore";

const FBImportExport: React.FunctionComponent = () => {
  const Span = (props: any) => <span {...props} />;
  const [exportDialog, setExportDialog] = useState<boolean>(false);
  const [fileName, setFilename] = useState<string>("");

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const openDialog = () => setExportDialog(true);
  const closeDialog = () => setExportDialog(false);

  const exportSchema = () => {
    formBuilderStore.exportSchema(fileName);
    setExportDialog(false);
  };

  const importSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const schema = JSON.parse(event.target.result);
      formBuilderStore.importSchema(schema);
    };
    reader.readAsText(e.currentTarget.files![0]);
  };

  const dialogContent = (
    <Box my={3}>
      <TextField
        label={<Text translation="form.builder.filename" />}
        onChange={handleOnchange}
        fullWidth={true}
        variant="outlined"
      />
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={exportSchema} color="primary" variant="contained">
          <Text translation="common.download" />
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <FBDialog
        open={exportDialog}
        content={dialogContent}
        title={`form.builder.export`}
        setDialogClose={closeDialog}
        setDialogOpen={openDialog}
      />
      <input
        hidden={true}
        id="upload-file"
        type="file"
        onChange={importSchema}
        onBlur={importSchema}
      />
      <label htmlFor="upload-file">
        <Button component={Span} startIcon={<VerticalAlignTopIcon />}>
          <Text translation="common.import" />
        </Button>
      </label>

      <Button
        component={Span}
        onClick={openDialog}
        startIcon={<VerticalAlignBottomIcon />}
      >
        <Text translation="common.export" />
      </Button>
    </Box>
  );
};

export default FBImportExport;
