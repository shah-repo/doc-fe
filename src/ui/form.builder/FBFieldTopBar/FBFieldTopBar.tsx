import { Box } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import CodeIcon from "@material-ui/icons/Code";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import { FBFieldTopBarProps } from ".";
import { withFBFieldTopBar } from "./FBFieldTopBar.wrap";

const FBFieldTopBar: React.FunctionComponent<FBFieldTopBarProps> = ({
  editSchemaItem,
  removeSchemaItem,
  markDownSchemaItem,
  inputProps: { deleteDisabled } = {},
  visibility,
  mb,
}) => (
  <Box display="flex" flexDirection="row-reverse" {...{ visibility, mb }}>
    <Box zIndex={1000}>
      <RemoveCircleOutlineIcon
        color={deleteDisabled ? "disabled" : "error"}
        data-cy={"remove-schema-item"}
        {...!deleteDisabled && { onClick: removeSchemaItem }}
      />
    </Box>
    <Box pr={2} zIndex={1000}>
      <BorderColorIcon color="primary" onClick={editSchemaItem} />
    </Box>
    <Box pr={2} zIndex={1000}>
      <CodeIcon color="primary" onClick={markDownSchemaItem} />
    </Box>
  </Box>
);

export default withFBFieldTopBar(FBFieldTopBar);
