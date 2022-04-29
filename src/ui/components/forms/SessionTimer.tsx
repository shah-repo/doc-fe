import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../../state/ducks/auth";
import { ARFormSaveContext } from "../../change.request/form/assessmentForm/Actions";
import { FormSaveContext } from "../../documentRevision/forms/presenters/Actions";
import FBStore from "../../form.builder/stores/ui/FBStore";
import { DialogHandler } from "../../hooks/useDialog";
import UnsavedChangesSessionDialog from "./UnsavedChangesSessionDialog/UnsavedChangesDialog";

interface Props {
  sessionDialog: DialogHandler;
  isFormDirty: boolean;
  isAR?: boolean;
}

export let SessionTimerDialogContext = React.createContext<() => void>(
  // eslint-disable-next-line arrow-body-style
  () => { return; },
);

const SessionTimer: React.FunctionComponent<Props> = ({
  sessionDialog,
  isFormDirty,
  isAR,
}) => {
  const dispatch = useDispatch();
  const onFormClick = React.useContext(FormSaveContext);
  const onARFormClick = React.useContext(ARFormSaveContext);

  const [value, setRadioValue] = React.useState("true");

  SessionTimerDialogContext = React.createContext<() => void>(sessionDialog.close);

  const handleCancel = () => {
    sessionDialog.close();
    dispatch(authActions.logout());
    FBStore.clearStores();
  };

  const handleConfirm = () => {
    if (value === "false") {
      return handleClose();
    }

    if (isFormDirty) {
      isAR ?  onARFormClick() : onFormClick();
      return;
    }
    return handleClose();
  };

  const handleClose = () => {
    dispatch(authActions.pingServer());
    sessionDialog.close();
  };

  return (
    <UnsavedChangesSessionDialog
      visible={sessionDialog.isOpen}
      onCancel={handleCancel}
      onClose={handleClose}
      onConfirm={handleConfirm}
      value={value}
      setValue={setRadioValue}
      content={"document.revision.unsaved.changes.alert"}
      title={"document.revision.unsaved.changes.title"}
      optionsTitle={"document.revision.session.unsaved.save.work"}
      confirmText={"common.extend"}
      cancelText={"common.log.off"}
    />
  );
};

export default SessionTimer;
