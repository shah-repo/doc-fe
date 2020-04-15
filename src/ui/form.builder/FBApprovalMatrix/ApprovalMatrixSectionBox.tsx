import { Box, Button, Grid } from "@material-ui/core";
import React from "react";
import { ReactComponent as ExitExpandIcon } from "../../../assets/images/expand_exit_icon.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/pen_edit.svg";
import Text from "../../components/Text";
import { FBFormDefaultProps } from "../types/common";

export interface Props extends FBFormDefaultProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  alreadyOpened?: boolean;
}

const ApprovalMatrixSectionBox: React.FunctionComponent<Props> = ({
  label,
  isOpen,
  openDialog,
  closeDialog,
  alreadyOpened,
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
    <Grid item={true} xs={6}>{label && <Text message={(label as string).toUpperCase()} />}</Grid>
    <Grid item={true} xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
      <Box paddingRight={2}>
        <Button color="inherit" style={{ padding: 0, margin: 0 }}>
          <EditIcon style={{ paddingRight: 5 }}  />
          <Box>
            <Text message="Edit Matrix" />
          </Box>
        </Button>
      </Box>
      <Box>
        <Button
          color="inherit"
          style={{ padding: 0, margin: 0 }}
          onClick={() => alreadyOpened ? closeDialog() : openDialog()}
        >
          <ExitExpandIcon style={{ paddingRight: 5 }}/>
          <Box>
            <Text message={alreadyOpened ? "Exit fullscreen" : "Fullscreen Mode"} />
          </Box>
        </Button>
      </Box>
    </Grid>
  </Box>
);

export default ApprovalMatrixSectionBox;
