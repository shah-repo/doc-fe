import React from 'react';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import AuditItemsContainer from '../audit.panel/container';
import AddEmployeeDialogPresenter from './dialog.presenter';
import AddEmployeeFormContainer from './form.container';

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
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);
  const onHistoryPanelClick = () => { setHistoryPanel(!openHistoryPanel); };
  return (
    <>
      <Button
        kind="secondary"
        onClick={onHistoryPanelClick}
        data-cy="um-open-history-panel"
      >
        {translate('user.management.audit')}
      </Button>
      <Button
        kind="primary"
        onClick={openDialog}
        id="AddEmployeePresenter-openDialog"
      >
        {translate('user.management.add.employee')}
      </Button>
      {openHistoryPanel && (
        <AuditItemsContainer
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      )}
      <AddEmployeeDialogPresenter isOpen={isOpen} closeDialog={closeDialog}>
        <AddEmployeeFormContainer />
      </AddEmployeeDialogPresenter>
    </>
  );
};

export default AddEmployeePresenter;
