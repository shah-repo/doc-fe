import React from 'react';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import AuditItemsContainer from '../audit.panel/container';
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
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);
  const onHistoryPanelClick = () => { setHistoryPanel(!openHistoryPanel); };
  return (
    <>
      <Button
        kind="secondary"
        onClick={onHistoryPanelClick}
        data-cy="gm-open-history-panel"
      >
        {translate('user.management.audit')}
      </Button>
      <Button
        kind="primary"
        onClick={openDialog}
        id="Group-openDialog"
        data-cy="group-open-dialog"
      >
        {translate('group.management.add.group')}
      </Button>
      <AddGroup
        isOpen={isOpen}
        closeDialog={closeDialog}
        title="group.management.create.group"
        isCreateMode={true}
      />
      {openHistoryPanel && (
        <AuditItemsContainer
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      )}
    </>
  );
};

export default AddGroupPresenter;
