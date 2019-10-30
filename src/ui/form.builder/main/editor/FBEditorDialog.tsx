import { observer } from "mobx-react";
import React from "react";
import FBDialog from "../../components/feedback/FBDialog";
import editorStore from "../../stores/FBEditorStore";

const FBEditorDialog: React.FunctionComponent<{}> = () => (
  <FBDialog
    open={editorStore.open}
    content={editorStore.content}
    title={editorStore.title}
    setDialogClose={editorStore.reset}
  />
);

export default observer(FBEditorDialog);
