import { Box, Button } from "@material-ui/core";
import React from "react";
import { DocumentRevision, documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { AsyncStatus } from "../../../../state/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  documentRevision: DocumentRevision | undefined;
}
const VoidButton: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const dialog = useDialog();
  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  const async = useAsync();
  const voidDocument = () => {
    documentRevision
    && async.start(
      voidAction,
      documentRevision.id,
      async,
    );
  };

  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} />
      </Box>
      <Button
        id="void"
        variant="outlined"
        color="secondary"
        onClick={dialog.open}
        disabled={async.asyncState.status === AsyncStatus.Active}
      >
        <Text translation="common.void" />
      </Button>
      <AlertDialog
        confirmAction={voidDocument}
        message={"documentRevision.void.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default VoidButton;
