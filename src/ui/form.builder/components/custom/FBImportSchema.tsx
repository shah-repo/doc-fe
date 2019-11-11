import { Box } from "@material-ui/core";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import React from "react";
import { FBImportSchemaProps } from "../../types/transport";
import FBButton from "../inputs/FBButton";

const FBImportSchema: React.FunctionComponent<FBImportSchemaProps> = ({
  importSchema,
}) => (
  <Box>
    <input
      hidden={true}
      id="fb-upload-file"
      type="file"
      accept=".json"
      onChange={importSchema}
    />
    <label htmlFor="fb-upload-file">
      <FBButton
        component={(props) => <span {...props} />}
        color="default"
        startIcon={<VerticalAlignBottomIcon />}
        label="form.builder.import.template"
      />
    </label>
  </Box>
);

export default FBImportSchema;
