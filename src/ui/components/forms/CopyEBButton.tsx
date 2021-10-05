import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
}

const CloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
  documentRevision,
}) => {
  const history = useHistory();
  const asyncClone = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(documentRevision.id, documentRevision.document.id),
      });
    },
  });
  const cloneEB = useActionCreator(documentRevisionsActions.cloneEB);
  const cloneAction = () => {
    asyncClone.start(
      cloneEB,
      documentRevision.id,
      asyncClone,
    );
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      data-cy="CloneEBButton"
      onClick={cloneAction}
    >
      <Text translation="documentRevision.clone.eb" />
    </Button>
  );
};

export default CloneEBButton;
