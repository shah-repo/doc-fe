import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React from "react";
import { AsyncActionPayload, AsyncStatus } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";

interface Props {
  asyncState: AsyncActionPayload;
  voidDocument: () => void;
  dialog: DialogHandler;
}
const AssessmentFormVoidPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  voidDocument,
  dialog,
}) => {
  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
      </Box>
      <Button
        variant="outlined"
        color="primary"
        onClick={voidDocument}
        disabled={asyncState.status === AsyncStatus.Active}
      >
        <Text translation="common.void" />
      </Button>
      <Dialog
        open={dialog.isOpen}
        onClose={dialog.close}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle >
          <Box textAlign="center">
            <Text translation="common.alert" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" marginBottom="20px">
            <DialogContentText>
              <Text translation="changeRequest.void.alert" />
            </DialogContentText>
          </Box>
        </DialogContent>
        <Box textAlign="center" marginBottom="10px">
          <Button
            color="primary"
            variant="contained"
            onClick={dialog.close}
          >
            <Text translation="common.ok" />
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AssessmentFormVoidPresenter;
