import { Box, Button } from "@material-ui/core";
import React, { useMemo } from "react";
import { DocumentRevision, documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { AsyncStatus } from "../../../../state/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { checkIsDocumentRecord } from "../../helpers/checkDocumentGroup";

interface Props {
  documentRevision: DocumentRevision | undefined;
}
const VoidButton: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const dialog = useDialog();
  const async = useAsync();

  const isRecord = useMemo(() =>
    checkIsDocumentRecord(documentRevision?.document?.documentType?.groupOptions || []), [documentRevision]);

  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
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
        message={isRecord ? "documentRevision.record.void.alert" : "documentRevision.void.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default VoidButton;
