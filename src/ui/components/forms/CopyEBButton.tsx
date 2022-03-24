import { Button, Modal } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import CloneModal from "./clone/CloneDialog";

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
}

const CloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
  documentRevision,
}) => {
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

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        data-cy="CloneEBButton"
        onClick={openCloneModel}
      >
        <Text translation="documentRevision.clone.eb" />
      </Button>
      <Modal
        open={cloneModelopen}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <CloneModal
          handleCloneModelClose={onClose}
          documentRevision={documentRevision}
        />
      </Modal>
    </>
  );
};

export default CloneEBButton;
