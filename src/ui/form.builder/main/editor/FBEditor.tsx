import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import FBDialog from "../../components/feedback/FBDialog";
import { withEditorDefaults } from "../../hocs/withEditorDefaults";
import { FBEditorSectionProps } from "../../types/editor";

const FBEditor: React.FunctionComponent<FBEditorSectionProps> = ({
  generateSections,
  ...props
}) => {

  return (
    <Box>
      {generateSections()}
      <FBDialog
        title="Create a field"
        {...props}
      />
    </Box>
  );
};

export default withEditorDefaults(FBEditor);
