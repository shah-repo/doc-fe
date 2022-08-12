import { Box, Grid } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import React from "react";
import { FBFieldTopBarProps } from "..";
import { ReactComponent as DragHandleIcon } from "../../../assets/images/drag_handle.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/edit.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/images/remove.svg";
import Colors from "../../layout/theme/utils/colors";
import FBFieldTopBarStyles from "./FBFieldTopBar.styles";
import { withFBFieldTopBar } from "./FBFieldTopBar.wrap";

const FBFieldTopBar: React.FunctionComponent<FBFieldTopBarProps> = ({
  editSchemaItem,
  removeSchemaItem,
  markDownSchemaItem,
  inputProps: { deleteDisabled } = {},
  visibility,
  mb,
}) => {
  const classes = FBFieldTopBarStyles();
  return (
    <Box display="flex" flexDirection="row-reverse" {...{ visibility, mb }}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        direction="row-reverse"
        className={classes.toolsBox}
      >
        <Box zIndex={1000}>
          <RemoveIcon
            fill={deleteDisabled ? Colors.hint_gray : "none"}
            className={deleteDisabled ? "schema-delete-disabled" : "schema-delete-enabled"}
            data-cy={"remove-schema-item"}
            {...!deleteDisabled && { onClick: removeSchemaItem }}
          />
        </Box>
        <Box zIndex={1000}>
          <EditIcon data-cy={"edit-schema-item"} onClick={editSchemaItem} />
        </Box>
        <Box zIndex={1000}>
          <CodeIcon style={{ fill: Colors.white }} onClick={markDownSchemaItem} />
        </Box>
        <Box zIndex={1000}>
          <DragHandleIcon className="drag-handle" data-cy={"drag-schema-item"} />
        </Box>
      </Grid>
    </Box>
  ); };

export default withFBFieldTopBar(FBFieldTopBar);
