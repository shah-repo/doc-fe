import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

export interface CopyEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
}

const CopyEBButton: React.FunctionComponent<CopyEBButtonProps> = ({
  documentRevision,
}) => {
  const history = useHistory();
  const asyncCopyTo = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(documentRevision.id, documentRevision.document.id),
      });
    },
  });
  const copyTo = useActionCreator(documentRevisionsActions.copyTo);
  const copyToAction = () => {
    asyncCopyTo.start(
      copyTo,
      documentRevision.id,
      asyncCopyTo,
    );
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      data-cy="CopyEBButton"
      onClick={copyToAction}
    >
      <Text translation="documentRevision.copy.to" />
    </Button>
  );
};

export default CopyEBButton;
