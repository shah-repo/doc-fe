import { Button, Modal } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as CloneIcon } from "../../../assets/images/clone.svg";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Text from "../../components/Text";
import CloneModal from "./clone/CloneDialog";
import { styles } from "./clone/CloneModal.styles";

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision;
  renderAsButton?: boolean;
}

const CloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
  documentRevision, renderAsButton,
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
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={openCloneModel}>
          <StyledMenuListIcon><CloneIcon/></StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="CloneEBButton"
            primary={<Text translation="documentRevision.clone.eb" />}
          />
        </StyledMenuListItem>);
      }
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
