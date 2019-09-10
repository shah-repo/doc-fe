import React from "react";
import DialogWindow from "../dialogs/Dialog";
import { DialogHandler } from "../../hooks/useDialog";
import Diff from "./Diff";

interface OwnProps {
  dialogHandler: DialogHandler;
}

type Props = OwnProps;

const oldText = "<p>2.8.2019 a-1 <strong>bold</strong></p>";
const newText = "<p>2.8.2019 a-1 <em>italic</em> <u>underline</u></p>";

const Dialog: React.FunctionComponent<Props> = ({
  dialogHandler,
}) => {
  const contentRenderer = () => (
    <Diff
      oldText={oldText}
      newText={newText}
    />
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
