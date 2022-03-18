import { Button } from "@material-ui/core";
import * as React from "react";
import { useEffect } from "react";
import { StyledMenuListIcon } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import { ReactComponent as VoidDocumentIcon } from "../../../../assets/images/void_document.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { checkIsDocumentRecord } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../helpers/documentRevisionStatus";

interface Props {
  documentRevision: DocumentRevision;
  setShouldDisplay: (value: boolean) => void;
  newVariant?: boolean;
}

const CancelButton: React.FunctionComponent<Props> = ({
  documentRevision,
  setShouldDisplay,
  newVariant = false,
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
        (!newVariant && canShowCancelButton) &&
        <Button id="cancelDraftButton" data-cy="cancelDraftButton" variant="outlined" onClick={dialog.open}>
          <Text translation="common.cancel.draft" />
        </Button>
      }
      {
        (newVariant && canShowCancelButton) &&
       ( <StyledMenuListItem button alignItems="flex-start">
         <StyledMenuListIcon>
           <VoidDocumentIcon />
         </StyledMenuListIcon>
         <StyledMenuListItemText
           id="cancelDraftButton"
           data-cy="cancelDraftButton"
           primary={<Text translation="common.cancel.draft" />}
           onClick={dialog.open}
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
