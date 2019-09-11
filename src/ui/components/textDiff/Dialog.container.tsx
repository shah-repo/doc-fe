import React, { useState } from "react";
import { DialogHandler } from "../../hooks/useDialog";
import useAsync from "../../hooks/useAsync";
import { auditActions } from "../../../state/ducks/audit";
import useActionCreator from "../../hooks/useActionCreator";
import DialogPresenter from "./Dialog.presenter";
import { DialogContainerProps } from "./types";

type Props = DialogContainerProps;

const oldTextHard = '<p>2.8.2019 a-1 <strong>bold </strong>so much text</p><p><br></p><p>Just adding stuff.</p><p><br></p><p>New line in <span style="color: rgb(230, 0, 0);">red</span></p><p><br></p><p><br></p><p>New line in <em>italic</em></p><p><br></p><p>And it goes on</p><p><br></p><p>On and <strong>on</strong> and on</p>';
const newTextHard = '<p>2.8.2019 a-2 <strong>bold </strong>so much text</p><p><br></p><p>Just adding stuff.</p><p><br></p><p>New line in <span style="color: rgb(230, 0, 0);">red</span></p><p><br></p><p><br></p><p>New line in <em>italic</em></p><p><br></p><p>And it goes on</p><p><br></p><p>On and <strong>on</strong> and on</p>';

const DialogContainer: React.FunctionComponent<Props> = ({
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
  
  return (
    <DialogPresenter
      dialogHandler={dialogHandler}
      oldText={oldText}
      newText={newText}
      async={async}
      loadChanges={loadChanges}
    />
  );
}

DialogContainer.displayName = "TextDiffDialogContainer";

export default DialogContainer;
