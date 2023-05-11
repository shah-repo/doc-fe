import React, { useEffect } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { getPOIndexDbInstance } from '../../../indexDb';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import { FB } from '../../form.builder';
import useDialog from '../../hooks/useDialog';

export interface Props {
  dirty: boolean
  doNotPrompt?: boolean
  isPOEditState?: boolean
  onDirtyFlagChange?: (dirty: boolean) => void
  setDoNotPrompt?: (value: boolean) => void
  setDocumentRevision?: (documentRevision?: DocumentRevision) => void
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty, doNotPrompt, isPOEditState, onDirtyFlagChange, setDoNotPrompt, setDocumentRevision,
}) => {
  const history = useHistory();
  const dialog = useDialog();
  const { workspaceState } = FB.useStores();
  const [lastLocation, setLastLocation] = React.useState<Location | null | undefined>(null);

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
    dialog.close();
    setDoNotPrompt?.(true);
    let prevPODoc;
    try {
      prevPODoc = await getPOIndexDbInstance().toArray();
    } catch (e) {}

    if (!prevPODoc.length) {
      history.push(lastLocation?.pathname);
      return;
    }
    const data = await workspaceState?.undoPO(
      prevPODoc[0] as DocumentRevision);

    history.push(lastLocation?.pathname);
    getPOIndexDbInstance().clear();
    setDocumentRevision?.(data);
  };

  return (
    <>
      <Prompt
        when={dirty && !doNotPrompt}
        message={isPOEditState ? handleBlockedNavigation : translate('common.navigate.away.prompt') }
      />
      <AlertDialog
        confirmAction={handleConfirmNavigationClick}
        cancelAction={dialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.no.stay"
        message="common.navigate.away.po.prompt"
        {...{ dialog }}
      />
    </>
  );
};

export default PromptIfDirty;
