import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { PromptProps } from 'react-router';
import { Prompt, useHistory } from 'react-router-dom';
import { translate } from '../../../common/intl';
import useDialog from '../../hooks/useDialog';
import { AlertDialog } from '../dialogs';

export interface Props {
  dirty: boolean
  message?: string
  doNotPrompt?: boolean
  isDialog?: boolean
  onConfirm?: () => Promise<void> | void
  onDirtyFlagChange?: (dirty: boolean) => void
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty,
  message = 'common.navigate.away.prompt',
  doNotPrompt,
  isDialog = false,
  onDirtyFlagChange,
  onConfirm,
}) => {
  const history = useHistory();
  const dialog = useDialog();
  const [lastLocation, setLastLocation] = useState<Location | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }; };
    const cancelBeforeUnload = () => { window.onbeforeunload = noop; };

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

  const handleBlockedNavigation: PromptProps['message'] = (nextLocation) => {
    dialog.open();
    // TODO check types after upgarading react-router
    setLastLocation(nextLocation as unknown as Location);
    return false;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    if (onConfirm) {
      await onConfirm();
    }
    setIsLoading(false);
    dialog.close();
    history.push(lastLocation?.pathname);
  };

  const handlePromptMessage: PromptProps['message'] = (args) => {
    return isDialog ? handleBlockedNavigation(args) : translate(message);
  };

  return (
    <>
      <Prompt
        when={dirty && !doNotPrompt}
        message={handlePromptMessage}
      />
      <AlertDialog
        handler={dialog}
        cancelLabel="common.no.stay"
        confirmLabel="common.yes.proceed"
        onCancel={dialog.close}
        loading={isLoading}
        onConfirm={handleConfirm}
        disableBackdropClick
      >
        {translate(message)}
      </AlertDialog>
    </>
  );
};

export default PromptIfDirty;
