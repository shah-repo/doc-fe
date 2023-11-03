import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import useDialog from '../../hooks/useDialog';
import { AlertDialog } from '../dialogs';
export interface Props {
  message?: string
}
const TabChangePromptIfDirty: React.FunctionComponent<Props> = ({ message = 'common.navigate.away.prompt' }) => {
  const { _tabsState } = SM.useStores();
  const dialog = useDialog();
  const handleClose = () => {
    dialog.close();
    _tabsState?.setTabChangePrompt({ tabId: '', event: undefined, isOpen: false });
  };
  const handleConfirm = () => {
    dialog.close();
    _tabsState?.setTabChangePrompt({ ..._tabsState?.tabChangePrompt, isOpen: false });
  };
  useEffect(() => reaction(
    () => _tabsState?.tabChangePrompt,
    (tabChangePrompt) => {
      if (tabChangePrompt?.isOpen && tabChangePrompt?.tabId) {
        dialog.open();
      }
    },
  ), [_tabsState?.tabChangePrompt, dialog]);
  return (
    <AlertDialog
      handler={dialog}
      cancelLabel="common.no.stay"
      confirmLabel="common.yes.proceed"
      onCancel={handleClose}
      onConfirm={handleConfirm}
      disableBackdropClick
    >
      {translate(message)}
    </AlertDialog>
  );
};
export default TabChangePromptIfDirty;
