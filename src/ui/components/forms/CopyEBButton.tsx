import { Button, Modal } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import CloneModal from "./clone/CloneDialog";
import { styles } from "./clone/CloneModal.styles";

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
}

const CloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
  documentRevision,
}) => {
  const isNewLayout = SM.isNewLayout;

  const classes = styles();
  const [cloneModelopen, setCloneModelopen] = React.useState(false);

  const openCloneModel = (e) => {
    e.stopPropagation();
    setCloneModelopen(true);
  };

  const handleCloneModelClose = () => {
    setCloneModelopen(false);
  };

  const onClose = () => {
    handleCloneModelClose();
  };
  const getUpdatedButton = () => {
    if (isNewLayout) {
      return (
        <StyledButton
          color="primary"
          data-cy="CloneEBButton"
          onClick={openCloneModel}
        >
          <Text translation="documentRevision.clone.eb" />
        </StyledButton>
      );
    }
    return (<Button
      variant="contained"
      color="secondary"
      data-cy="CloneEBButton"
      onClick={openCloneModel}
    >
      <Text translation="documentRevision.clone.eb" />
    </Button>);
  };

  return (
    <>
      {getUpdatedButton()}
      <Modal open={cloneModelopen} onClose={onClose} className={classes.modal}>
        <CloneModal
          handleCloneModelClose={onClose}
          documentRevision={documentRevision}
        />
      </Modal>
    </>
  );
};

export default CloneEBButton;
