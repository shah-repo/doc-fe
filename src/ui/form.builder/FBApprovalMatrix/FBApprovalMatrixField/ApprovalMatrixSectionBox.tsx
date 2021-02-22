import { Box, Button, Grid } from "@material-ui/core";
import React from "react";
import { ReactComponent as ExitExpandIcon } from "../../../../assets/images/expand_exit_icon.svg";
import { ReactComponent as ExpandIcon } from "../../../../assets/images/expand_icon.svg";
import { ReactComponent as EditIcon } from "../../../../assets/images/pen_edit.svg";
import Text from "../../../components/Text";
import { FBFormDefaultProps } from "../../types/common";

interface Props extends FBFormDefaultProps {
  openDialog: () => void;
  closeDialog: () => void;
  alreadyOpened?: boolean;
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  addMode: boolean;
  disabled: boolean;
}

const ApprovalMatrixSectionBox: React.FunctionComponent<Props> = ({
  openDialog,
  closeDialog,
  alreadyOpened,
  toggleEditMode,
  editMode,
  addMode,
  disabled,
}) => (
  <Box
    mb={4}
    bgcolor="primary.main"
    color="primary.contrastText"
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    fontWeight={100}
    display="flex"
  >
    <Grid item={true} xs={6}><Text translation={"form.builder.approvalMatrix"} /></Grid>
    <Grid item={true} xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
      <Box paddingRight={2}>
        <Button color="inherit" style={{ padding: 0, margin: 0 }}
          onClick={() => toggleEditMode(!editMode)}
          disabled={addMode || disabled}
        >
          <EditIcon style={{ paddingRight: 5 }}  />
          <Box>
            <Text message={editMode ? "Close edit mode" : "Edit Matrix"} />
          </Box>
        </Button>
      </Box>
      <Box>
        <Button
          color="inherit"
          style={{ padding: 0, margin: 0 }}
          onClick={() => alreadyOpened ? closeDialog() : openDialog()}
        >
          {alreadyOpened ? <ExitExpandIcon style={{ paddingRight: 5 }}/> : <ExpandIcon style={{ paddingRight: 5 }}/> }
          <Box>
            <Text message={alreadyOpened ? "Exit fullscreen" : "Fullscreen Mode"} />
          </Box>
        </Button>
      </Box>
    </Grid>
  </Box>
);

export default ApprovalMatrixSectionBox;
