import React from "react";
import DialogWindow from "../dialogs/Dialog";
import { DialogHandler } from "../../hooks/useDialog";
import Diff from "./Diff.container";
import AsyncGate from "../AsyncGate";
import { styles } from "./Dialog.styles";
import { Async } from "../../hooks/useAsync";

interface OwnProps {
  oldText: string;
  newText: string;
  loadChanges(): void;
  dialogHandler: DialogHandler;
  async: Async;
}

type Props = OwnProps;

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
