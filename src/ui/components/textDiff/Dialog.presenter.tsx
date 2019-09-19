import React from "react";
import AsyncGate from "../AsyncGate";
import DialogWindow from "../dialogs/Dialog";
import Diff from "./Diff.container";
import { DialogPresenterProps } from "./utils/types";

type Props = DialogPresenterProps;

const DialogPresenter: React.FunctionComponent<Props> = ({
  oldText, newText, loadChanges, dialogHandler, async,
}) => {
  const contentRenderer = () => (
    <div>
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
      title={"common.text.difference"}
      contentRenderer={contentRenderer}
      dialogHandler={dialogHandler}
      maxWidth="lg"
      fullWidth={true}
    />
  );
};

DialogPresenter.displayName = "TextDiffDialogPresenter";

export default DialogPresenter;
