import { ListItemText } from "@material-ui/core";
import React, { useMemo } from "react";
import { ReactComponent as VoidDocumentIcon } from "../../../../../assets/images/void_document.svg";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../../../state/types";
import AlertDialog from "../../../../../ui/app/alert.dialog/AlertDialog";
import Text from "../../../../../ui/components/Text";
import { checkIsDocumentRecord } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";
import useDialog from "../../../../../ui/hooks/useDialog";
import { StyledMenuListIcon } from "./StyledMenuListIcon";
import { StyledMenuListItem } from "./StyledMenuListItem";

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
      <StyledMenuListItem
        button
        disabled={async.asyncState.status === AsyncStatus.Active}
        alignItems="flex-start"
      >
        <StyledMenuListIcon>
          <VoidDocumentIcon />
        </StyledMenuListIcon>
        <ListItemText
          primary={<Text translation="common.void" />}
          onClick={dialog.open}
          style={{
            fontFamily: "Sora",
            fontSize: "14px",
          }}
        />
      </StyledMenuListItem>
      <AlertDialog
        confirmAction={voidDocument}
        message={
          isRecord
            ? "documentRevision.record.void.alert"
            : "documentRevision.void.alert"
        }
        {...{ dialog }}
      />
    </>
  );
};

export default VoidButton;
