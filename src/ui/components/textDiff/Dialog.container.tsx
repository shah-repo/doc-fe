import React, { useState } from "react";
import { auditActions } from "../../../state/ducks/audit";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import DialogPresenter from "./Dialog.presenter";
import { DialogContainerProps } from "./utils/types";

type Props = DialogContainerProps;

const DialogContainer: React.FunctionComponent<Props> = ({
  auditId, dialogHandler,
}) => {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const async = useAsync({
    onSuccess: (data: any) => {
      setOldText(data.previousValue);
      setNewText(data.nextValue);
    },
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
};

DialogContainer.displayName = "TextDiffDialogContainer";

export default DialogContainer;
