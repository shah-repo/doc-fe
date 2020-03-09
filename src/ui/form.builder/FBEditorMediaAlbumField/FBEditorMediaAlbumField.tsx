import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBTextField from "../components/inputs/FBTextField";
import FBStore from "../stores/ui/FBStore";

const FBEditorMediaAlbumField: React.FunctionComponent<{}> = () => (
  <Box>
    <FBTextField rows={2} label="common.description" name="label" />
    <FBCheckbox
      label="form.builder.is.template"
      name="isTemplate"
      disabled={!_.isEmpty(FBStore.documentId)}
    />
  </Box>
);

export default FBEditorMediaAlbumField;
