import { Box } from "@material-ui/core";
import { BoxProps } from "@material-ui/core/Box";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import { FBEditorWrapperInjectedProps } from "../../types/editor";

type Props = FBEditorWrapperInjectedProps & BoxProps;

const FBEditorFieldToolbar: React.FunctionComponent<Props> = ({
  editField,
  removeField,
  ...props
}) => {

  return (
    <Box
      display="flex"
      flexDirection="row-reverse"
      {...props}
    >
      <Box>
        <RemoveCircleOutlineIcon color="error" onClick={removeField} />
      </Box>
      <Box pr={2}>
        <BorderColorIcon color="primary" onClick={editField} />
      </Box>
    </Box>
  );
};

export default FBEditorFieldToolbar;
