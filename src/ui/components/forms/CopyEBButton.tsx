import { Button, Modal } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';
import { StyledButton } from '../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as CloneIcon } from '../../../assets/images/clone.svg';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import Text from '../../components/Text';
import CloneModal from './clone/CloneDialog';
import { styles } from './clone/CloneModal.styles';

interface CloneEBButtonProps extends ButtonProps {
  documentRevision: DocumentRevision
  renderAsButton?: boolean
}

const CloneEBButton: React.FunctionComponent<CloneEBButtonProps> = ({
  documentRevision, renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;

  const classes = styles();
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false);

  const openCloneModal = (e) => {
    e.stopPropagation();
    setCloneModalOpen(true);
  };

  const handleCloneModalClose = () => {
    setCloneModalOpen(false);
  };

  const onClose = () => {
    handleCloneModalClose();
  };
  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={openCloneModal}>
          <StyledMenuListIcon><CloneIcon /></StyledMenuListIcon>
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
          onClick={openCloneModal}
        >
          <Text translation="documentRevision.clone.eb" />
        </StyledButton>
      );
    }
    return (<Button
      variant="contained"
      color="secondary"
      data-cy="CloneEBButton"
      onClick={openCloneModal}
    >
      <Text translation="documentRevision.clone.eb" />
    </Button>);
  };

  return (
    <>
      {getUpdatedButton()}
      {cloneModalOpen && <Modal open={cloneModalOpen} onClose={onClose} className={classes.modal}>
        <CloneModal
          handleCloneModalClose={onClose}
          documentRevision={documentRevision}
        />
      </Modal>}
    </>
  );
};

export default CloneEBButton;
