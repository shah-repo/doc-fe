import { Button } from "@material-ui/core";
import * as React from "react";
import { useEffect } from "react";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  documentStatus?: DocumentRevisionStatus;
  version?: number;
  docRevId?: string;
  shouldDisplay: boolean;
  setShouldDisplay: (value: boolean) => void;
}

const CancelButton: React.FunctionComponent<Props> = ({
  documentStatus,
  version = 0,
  docRevId,
  shouldDisplay,
  setShouldDisplay,
}) => {
  const canShowCancelButton = documentStatus === DocumentRevisionStatus.Draft && version > 1;
  useEffect(() => {
    setShouldDisplay(canShowCancelButton);
  }, [canShowCancelButton, setShouldDisplay]);

  const async = useAsync();
  const cancelDraft = useActionCreator(documentRevisionsActions.cancelDraft);
  const handleCancelDraft = () => {
    async.start(cancelDraft, docRevId, async);
  };

  return (
    <>
      {
        canShowCancelButton &&
        <Button id="cancelDraftButton" variant="outlined" onClick={handleCancelDraft}>
          <Text translation="common.cancel.draft" />
        </Button>
      }
    </>
  );
};

export default CancelButton;
