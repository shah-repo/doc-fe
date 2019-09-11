import React, { useState } from "react";
import DialogWindow from "../dialogs/Dialog";
import { DialogHandler } from "../../hooks/useDialog";
import Diff from "./Diff";
import useAsync from "../../hooks/useAsync";
import { auditActions } from "../../../state/ducks/audit";
import AsyncGate from "../AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";

interface OwnProps {
  auditId: string;
  dialogHandler: DialogHandler;
}

type Props = OwnProps;

const oldTextHard = "<p>2.8.2019 a-1 <strong>bold</strong></p>";
const newTextHard = "<p>2.8.2019 a-1 <em>italic</em> <u>underline</u></p>";

const Dialog: React.FunctionComponent<Props> = ({
  auditId, dialogHandler,
}) => {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const async = useAsync({
    onSuccess: (arg) => {
      setOldText(oldTextHard);
      setNewText(newTextHard);
    }
  });

  const action = useActionCreator(auditActions.getChanges);
  const loadChanges = () => async.start(action, auditId, async);
  
  const contentRenderer = () => (
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
  );

  return (
    <DialogWindow
      title={"common.changes"}
      contentRenderer={contentRenderer}
      dialogHandler={dialogHandler}
    />
  );
}

Dialog.displayName = "TextDiffDialog";

export default Dialog;
