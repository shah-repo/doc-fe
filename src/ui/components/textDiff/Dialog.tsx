import React, { useState } from "react";
import DialogWindow from "../dialogs/Dialog";
import { DialogHandler } from "../../hooks/useDialog";
import Diff from "./Diff";
import useAsync from "../../hooks/useAsync";
import { auditActions } from "../../../state/ducks/audit";
import AsyncGate from "../AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import { styles } from "./Dialog.styles";

interface OwnProps {
  auditId: string;
  dialogHandler: DialogHandler;
}

type Props = OwnProps;

const oldTextHard = '<p>2.8.2019 a-1 <strong>bold </strong>so much text</p><p><br></p><p>Just adding stuff.</p><p><br></p><p>New line in <span style="color: rgb(230, 0, 0);">red</span></p><p><br></p><p><br></p><p>New line in <em>italic</em></p><p><br></p><p>And it goes on</p><p><br></p><p>On and <strong>on</strong> and on</p>';
const newTextHard = '<p>2.8.2019 a-2 <strong>bold </strong>so much text</p><p><br></p><p>Just adding stuff.</p><p><br></p><p>New line in <span style="color: rgb(230, 0, 0);">red</span></p><p><br></p><p><br></p><p>New line in <em>italic</em></p><p><br></p><p>And it goes on</p><p><br></p><p>On and <strong>on</strong> and on</p>';

const Dialog: React.FunctionComponent<Props> = ({
  auditId, dialogHandler,
}) => {
  const classes = styles();
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

Dialog.displayName = "TextDiffDialog";

export default Dialog;
