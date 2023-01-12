import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as CloneIcon } from "../../../assets/images/clone.svg";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface ClonePOButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
  renderAsButton?: boolean;
}

const ClonePOButton: React.FunctionComponent<ClonePOButtonProps> = ({
  documentRevision, renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;

  const clonePO = useActionCreator(documentRevisionsActions.cloneDoc);
  const history = useHistory();

  const asyncClone = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(
          documentRevision.id,
          documentRevision.document.id
        ),
      });
    },
  });

  const cloneAction = () => {
    asyncClone.start(clonePO, documentRevision.id, null, asyncClone);
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListIcon><CloneIcon/></StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="CloneEBButton"
            primary={<Text translation="documentRevision.clone" />}
            onClick={cloneAction}
          />
        </StyledMenuListItem>);
      }
      return (
        <StyledButton
          color="primary"
          data-cy="CloneEBButton"
          onClick={cloneAction}
        >
          <Text translation="documentRevision.clone" />
        </StyledButton>
      );
    }
    return (<Button
      variant="contained"
      color="secondary"
      data-cy="CloneEBButton"
      onClick={cloneAction}
    >
      <Text translation="documentRevision.clone" />
    </Button>);
  };

  return (
    <>
      {getUpdatedButton()}
    </>
  );
};

export default ClonePOButton;
