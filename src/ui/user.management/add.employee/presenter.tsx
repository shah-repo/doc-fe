import { Box, Button } from '@material-ui/core';
import React from 'react';
import Text from '../../components/Text';
import AuditItemsContainer from '../audit.panel/container';
import AddEmployeeDialogPresenter from './dialog.presenter';
import AddEmployeeFormContainer from './form.container';
import styles from './styles';

interface Props {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const AddEmployeePresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => {
  const classes = styles();
  // load history panel
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);
  const onHistoryPanelClick = () => { setHistoryPanel(!openHistoryPanel); };
  return (
    <Box>
      <Button
        variant="contained"
        onClick={onHistoryPanelClick}
        className={classes.historyButton}
        data-cy="um-open-history-panel"
      >
        <Text message="user.management.audit" />
      </Button>
      <Button
        variant="contained"
        onClick={openDialog}
        id="AddEmployeePresenter-openDialog"
        className={classes.Button}
      >
        <Text message="user.management.add.employee" />
      </Button>
      {openHistoryPanel
        && <AuditItemsContainer
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      }
      <AddEmployeeDialogPresenter isOpen={isOpen} closeDialog={closeDialog}>
        <AddEmployeeFormContainer />
      </AddEmployeeDialogPresenter>
    </Box>
  ); };

export default AddEmployeePresenter;
