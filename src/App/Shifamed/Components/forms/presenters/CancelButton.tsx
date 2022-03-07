import { ListItemText } from "@material-ui/core";
import * as React from "react";
import { useEffect } from "react";
import { ReactComponent as VoidDocumentIcon } from "../../../../../assets/images/void_document.svg";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import AlertDialog from "../../../../../ui/app/alert.dialog/AlertDialog";
import Text from "../../../../../ui/components/Text";
import { checkIsDocumentRecord } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";
import useDialog from "../../../../../ui/hooks/useDialog";
import { StyledMenuListIcon } from "./StyledMenuListIcon";
import { StyledMenuListItem } from "./StyledMenuListItem";

interface Props {
  documentRevision: DocumentRevision;
  setShouldDisplay: (value: boolean) => void;
}

const CancelButton: React.FunctionComponent<Props> = ({
  documentRevision,
  setShouldDisplay,
}) => {
  const dialog = useDialog();
  const async = useAsync();
  const { status = "", version = 0, id, document } = documentRevision || [];

  const canShowCancelButton = isDocumentRevisionInDraft(status) && version > 1;
  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions || []);

  useEffect(() => {
    setShouldDisplay(canShowCancelButton);
  }, [canShowCancelButton, setShouldDisplay]);

  const cancelDraft = useActionCreator(documentRevisionsActions.cancelDraft);
  const handleCancelDraft = () => {
    async.start(cancelDraft, id, async);
  };

  return (
    <>
      {
        canShowCancelButton &&
       ( <StyledMenuListItem button alignItems="flex-start">
         <StyledMenuListIcon>
           <VoidDocumentIcon />
         </StyledMenuListIcon>
         <ListItemText
           id="cancelDraftButton"
           data-cy="cancelDraftButton"
           primary={<Text translation="common.cancel.draft" />}
           onClick={dialog.open}
           style={{
            fontFamily: "Sora",
            fontSize: "14px",
          }}
         />
       </StyledMenuListItem>)
      }
      <AlertDialog
        confirmAction={handleCancelDraft}
        message={isRecord ? "record.cancel.draft.alert" : "document.revision.cancel.draft.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default CancelButton;
