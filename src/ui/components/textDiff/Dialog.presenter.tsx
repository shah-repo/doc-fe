import React from 'react';
import AsyncGate from '../AsyncGate';
import Dialog from '../dialogs';
import Diff from './Diff.container';
import { DialogPresenterProps } from './utils/types';

type Props = DialogPresenterProps;

const DialogPresenter: React.FunctionComponent<Props> = ({
  oldText, newText, loadChanges, dialogHandler, async,
}) => (
  <Dialog
    title="common.text.difference"
    open={dialogHandler.isOpen}
    onClose={dialogHandler.close}
    maxWidth="lg"
    fullWidth
  >
    <AsyncGate
      asyncState={async.asyncState}
      asyncAction={loadChanges}
      startActionOnMount
    >
      <Diff
        oldText={oldText}
        newText={newText}
      />
    </AsyncGate>
  </Dialog>
);

DialogPresenter.displayName = 'TextDiffDialogPresenter';

export default DialogPresenter;
