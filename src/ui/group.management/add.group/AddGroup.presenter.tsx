import { Box, Button } from '@material-ui/core';
import React from 'react';
import Text from '../../components/Text';
import AuditItemsContainer from '../audit.panel/container';
import AddGroupStyles from './AddGroup.styles';
import AddGroup from './Group';

interface OwnProps {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

type Props = OwnProps;

const AddGroupPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => {
  const classes = AddGroupStyles();
  // load history panel
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);
  const onHistoryPanelClick = () => { setHistoryPanel(!openHistoryPanel); };
  return (
    <Box>
      <Button
        variant="contained"
        onClick={onHistoryPanelClick}
        data-cy="gm-open-history-panel"
        className={classes.historyButton}
      >
        <Text message="user.management.audit" />
      </Button>
      <Button
        variant="contained"
        onClick={openDialog}
        id="Group-openDialog"
        data-cy="Group-openDialog"
        className={classes.Button}
      >
        <Text message="group.management.add.group" />
      </Button>
      <AddGroup
        isOpen={isOpen}
        closeDialog={closeDialog}
        title="group.management.create.group"
        isCreateMode={true}
      />
      {openHistoryPanel
        && <AuditItemsContainer
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      }
    </Box>
  ); };

export default AddGroupPresenter;
