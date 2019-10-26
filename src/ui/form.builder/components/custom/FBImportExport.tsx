import { Box, Button } from "@material-ui/core";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import Text from "../../../components/Text";
import React from "react";
import formBuilderStore from "../../stores/FBStore";
import FBExportDialog from "./FBExportDialog";
import { FBDialogProps } from "../../types/dialog";
import { withDialogState } from "../../hocs/withDialogState";
import FBButton from "../inputs/FBButton";

const FBImportExport: React.FunctionComponent<FBDialogProps> = ({
  setDialogClose,
  setDialogOpen,
  open,
}) => {
  const Span = (props: any) => <span {...props} />;

  const importSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    formBuilderStore.importSchema(e);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="flex-end">
      <FBExportDialog
        setDialogClose={setDialogClose}
        setDialogOpen={setDialogOpen}
        open={open}
      />
      <input
        hidden={true}
        id="upload-file"
        type="file"
        onChange={importSchema}
      />
      <label htmlFor="upload-file">
        <FBButton
          component={Span}
          color="default"
          startIcon={<VerticalAlignBottomIcon />}
          label={"common.import"}
        />
      </label>

      <FBButton
        component={Span}
        color="default"
        onClick={setDialogOpen}
        startIcon={<VerticalAlignTopIcon />}
        label={"common.export"}
      />
    </Box>
  );
};

export default withDialogState(FBImportExport);
