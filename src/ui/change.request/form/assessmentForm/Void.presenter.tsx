import { Box, Button, Dialog, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React from "react";
import { AsyncActionPayload, AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import { styles } from "./Void.styles";

interface Props {
  asyncState: AsyncActionPayload;
  voidDocument: () => void;
}
const AssessmentFormVoidPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  voidDocument,
}) => {
  const classes = styles();
  const dialog = useDialog();
  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
      </Box>
      <Button
        id="void"
        variant="outlined"
        color="secondary"
        onClick={dialog.open}
        disabled={asyncState.status === AsyncStatus.Active}
      >
        <Text translation="common.void" />
      </Button>
      {
        dialog.isOpen &&
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="xs"
          PaperProps={{ id: "voidAlertDialog" }}
        >
          <DialogContent>
            <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
              <Box textAlign="center">
                <span className={classes.iconContainer}>
                  <ReportProblemOutlinedIcon color="error"  />
                </span>
                <Typography variant="h6" style={{ marginTop: 20, marginBottom: 5 }}>
                  <Text translation="common.alert" />
                </Typography>
              </Box>
              <DialogContentText>
                <Text translation="change.request.void.alert" />
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction} >
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="VoidCR-cancelButton"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="VoidCR-continueButton"
              onClick={voidDocument}
            >
              <Text translation="common.yes.im.sure" />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default AssessmentFormVoidPresenter;
