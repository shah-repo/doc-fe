import React, { useEffect, useState } from 'react';
import { PromptProps } from 'react-router';
import { Prompt, useHistory } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { clearPOSavedInfo, getPOSavedInfo } from '../../../indexDb';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FB } from '../../form.builder';
import FBDataStore from '../../form.builder/FBStore/FBDataStore';
import useDialog from '../../hooks/useDialog';
import { AlertDialog } from '../dialogs';

export interface Props {
  dirty: boolean
  doNotPrompt?: boolean
  isPOEditState?: boolean
  isDialog?: boolean
  onConfirm?: () => Promise<void> | void
  onDirtyFlagChange?: (dirty: boolean) => void
  setDoNotPrompt?: (value: boolean) => void
  setDocumentRevision?: (documentRevision?: DocumentRevision) => void
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty,
  doNotPrompt,
  isPOEditState = false,
  isDialog = false,
  onDirtyFlagChange,
  setDoNotPrompt,
  onConfirm,
  setDocumentRevision,
}) => {
  const history = useHistory();
  const dialog = useDialog();
  const [lastLocation, setLastLocation] = useState<Location | null | undefined>(null);
  const { workspaceState } = FB.useStores();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }; };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const cancelBeforeUnload = () => window.onbeforeunload = () => {};

    if (onDirtyFlagChange) {
      onDirtyFlagChange(dirty);
    }

    if (doNotPrompt) {
      cancelBeforeUnload();
      return;
    }

    if (dirty) {
      startBeforeUnload();
    } else {
      cancelBeforeUnload();
    }

    return () => {
      cancelBeforeUnload();
    };
  }, [dirty, doNotPrompt, onDirtyFlagChange]);

  const handleBlockedNavigation = (nextLocation) => {
    dialog.open();
    setLastLocation(nextLocation);
    return false;
  };

  const handleConfirmNavigationClick = async () => {
    setDoNotPrompt?.(true);
    let prevPODoc;
    try {
      prevPODoc = await getPOSavedInfo();
    } catch (e) {}

    if (!prevPODoc.length) {
      history.push(lastLocation?.pathname);
      return;
    }

    await workspaceState?.undoPO(prevPODoc[0]);
    await clearPOSavedInfo();
    FBDataStore.setRefreshData(undefined);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    if (isPOEditState) {
      await handleConfirmNavigationClick();
    }
    if (onConfirm) {
      await onConfirm();
    }
    setIsLoading(false);
    dialog.close();
    history.push(lastLocation?.pathname);
  };

  const handlePromptMessage: PromptProps['message'] = (args) => {
    return isPOEditState || isDialog ? handleBlockedNavigation(args) : translate('common.navigate.away.prompt');
  };

  return (
    <>
      <Prompt
        when={dirty && !doNotPrompt}
        message={handlePromptMessage}
      />
      {/*
      <AlertDialog
        confirmAction={handleConfirmNavigationClick}
        cancelAction={dialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.no.stay"
        message="common.navigate.away.po.prompt"
        {...{ dialog }}
      />
      */}
      <AlertDialog
        handler={dialog}
        cancelLabel="common.no.stay"
        confirmLabel="common.yes.proceed"
        onCancel={dialog.close}
        loading={isLoading}
        onConfirm={handleConfirm}
        disableBackdropClick
      >
        {translate('common.navigate.away.prompt')}
        {/* common.navigate.away.po.prompt */}
      </AlertDialog>
    </>
  );
};

export default PromptIfDirty;
