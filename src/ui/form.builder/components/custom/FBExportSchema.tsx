import { Box } from "@material-ui/core";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import React from "react";
import { FBExportSchemaProps } from "../../types/transport";
import FBDialog from "../feedback/FBDialog";
import FBButton from "../inputs/FBButton";
import FBTextField from "../inputs/FBTextField";

const FBExportSchema: React.FunctionComponent<FBExportSchemaProps> = ({
  exportSchema,
  setSchemaName,
  ...props
}) => (
  <Box>
    <FBButton
      color="default"
      onClick={props.setDialogOpen}
      startIcon={<VerticalAlignTopIcon />}
      label="form.builder.export.template"
      id="FBExportSchema-export"
    />
    <FBDialog {...props} title="form.builder.export.template">
      <FBTextField
        afterChange={(setSchemaName)}
        name="export_field"
        label="form.builder.template.name"
        id="FBExportSchema-name"
      />
      <Box display="flex" justifyContent="flex-end">
        <FBButton onClick={exportSchema} label="common.export" id="FBExportSchema-exportSchema" />
      </Box>
    </FBDialog>
  </Box>
);

export default FBExportSchema;
