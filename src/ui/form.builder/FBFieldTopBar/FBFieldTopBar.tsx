import { Box, Grid } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import React from "react";
import { FBFieldTopBarProps } from "..";
import { ReactComponent as DragHandleIcon } from "../../../assets/images/drag_handle.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/edit.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/images/remove.svg";
import Colors from "../../layout/theme/utils/colors";
import useStyles from "./FBFieldTopBar.styles";
import { withFBFieldTopBar } from "./FBFieldTopBar.wrap";

const FBFieldTopBar: React.FunctionComponent<FBFieldTopBarProps> = ({
  editSchemaItem,
  removeSchemaItem,
  markDownSchemaItem,
  inputProps: { deleteDisabled } = {},
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container className={classes.tools}>
        <DragHandleIcon className="drag-handle" />
        <CodeIcon onClick={markDownSchemaItem} />
        <EditIcon onClick={editSchemaItem} data-cy={"edit-schema-item"} />
        <RemoveIcon
          fill={deleteDisabled ? Colors.hint_gray : "none"}
          className={deleteDisabled ? "schema-delete-disabled" : "schema-delete-enabled"}
          {...!deleteDisabled && { onClick: removeSchemaItem }}
          data-cy={"remove-schema-item"}
        />
      </Grid>
    </Box>
  );
};

export default withFBFieldTopBar(FBFieldTopBar);
