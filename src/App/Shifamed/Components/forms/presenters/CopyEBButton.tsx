import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import Text from "../../../../../ui/components/Text";
import { documentVersionPath } from "../../../../../ui/document.revision/utils/paths";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";
import { StyledButton } from "./StyledListButton";

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
}

const NewCloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
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
    <StyledButton
      color="primary"
      data-cy="CloneEBButton"
      onClick={cloneAction}
    >
      <Text translation="documentRevision.clone.eb" />
    </StyledButton>
  );
};

export default NewCloneEBButton;
