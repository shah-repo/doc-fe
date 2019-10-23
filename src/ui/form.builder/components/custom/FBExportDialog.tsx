import { Box, Button, TextField } from "@material-ui/core";
import Text from "../../../components/Text";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import React, { useState } from "react";
import FBDialog from "../feedback/FBDialog";
import formBuilderStore from "../../stores/FBStore";
import { FBDialogInjectedProps } from "../../types/dialog";
import { withDialogState } from "../../hocs/withDialogState";

export interface FBExportDialogProps extends FBDialogInjectedProps {
  Span: any;
}

const FBExportDialog: React.FunctionComponent<FBExportDialogProps> = ({
  setDialogOpen,
  setDialogClose,
  open,
  Span,
}) => {
  const [fileName, setFilename] = useState<string>("");

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const exportSchema = () => {
    formBuilderStore.exportSchema(fileName);
    setDialogClose();
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
    <React.Fragment>
      <FBDialog
        open={open}
        content={dialogContent}
        title={`form.builder.export`}
        setDialogClose={setDialogClose}
        setDialogOpen={setDialogOpen}
      />
      <Button
        component={Span}
        onClick={setDialogOpen}
        startIcon={<VerticalAlignTopIcon />}>
        <Text translation="common.export" />
      </Button>
    </React.Fragment>
  );
};

export default withDialogState(FBExportDialog);
