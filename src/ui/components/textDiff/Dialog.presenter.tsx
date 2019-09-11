import React from "react";
import DialogWindow from "../dialogs/Dialog";
import Diff from "./Diff.container";
import AsyncGate from "../AsyncGate";
import { styles } from "./Dialog.styles";
import { DialogPresenterProps } from "./types";

type Props = DialogPresenterProps;

const DialogPresenter: React.FunctionComponent<Props> = ({
  oldText, newText, loadChanges, dialogHandler, async
}) => {
  const classes = styles();
  
  const contentRenderer = () => (
    <div className={classes.container}>
      <AsyncGate
        asyncState={async.asyncState}
        asyncAction={loadChanges}
        startActionOnMount={true}
      >
        <Diff
          oldText={oldText}
          newText={newText}
        />
      </AsyncGate>
    </div>
  );

  return (
    <DialogWindow
      title={"common.changes"}
      contentRenderer={contentRenderer}
      dialogHandler={dialogHandler}
    />
  );
}

DialogPresenter.displayName = "TextDiffDialogPresenter";

export default DialogPresenter;
