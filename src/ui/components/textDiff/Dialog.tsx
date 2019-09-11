import React from "react";
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

const oldText = "<p>2.8.2019 a-1 <strong>bold</strong></p>";
const newText = "<p>2.8.2019 a-1 <em>italic</em> <u>underline</u></p>";

const Dialog: React.FunctionComponent<Props> = ({
  auditId, dialogHandler,
}) => {
  const async = useAsync({
    onSuccess: (arg) => {
      console.log(arg);
      console.log("success");
    }
  });

  const action = useActionCreator(auditActions.getChanges);
  //console.log(auditActions.getChanges);
  // const dispatchMethod = (auditId: string, async: Handlers) => dispatch(auditActions.getChanges(auditId, async))
  //const loadChanges = () => async.start(auditActions.getChanges, auditId, async);
  //const loadChanges = () => async.start(dispatch(auditActions.getChanges), auditId, async);
  //const loadChanges = () => dispatch(auditActions.getChanges(auditId, async));
  // const loadChanges = () => async.start(dispatchMethod, auditId, async);
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
