import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import useDialog from "../../hooks/useDialog";
import { useFormContext } from "./FormContext";
import UnsavedChangesDialog from "./UnsavedChangesDialog";

interface Props {
  when: boolean;
  navigate: (path: any) => void;
  shouldBlockNavigation: (value?: any) =>  boolean;
}

interface UnsavedChangesDialogProps {
  handleCloseDialogAfterSave: () => void;
  closeModal: (cb?: any) => void;
}

export let UnsavedChangesDialogContext = React.createContext<UnsavedChangesDialogProps>({
  handleCloseDialogAfterSave: () => { return; },
  closeModal: () => { return; },
});

const PromptIfDirty: React.FunctionComponent<Props> = ({
  navigate,
  when,
  shouldBlockNavigation,
}) => {
  const dialogPrompt = useDialog();
  const { submitForm } = useFormContext();

  const [lastLocation, updateLastLocation] = useState<any>(null);
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false);
  const [value, setValue] = React.useState("true");

  const showModal = (location) => {
    dialogPrompt.open();
    updateLastLocation(location);
  };

  const handleCloseDialogAfterSave = () => {
    closeModal(() => {
      if (lastLocation) {
        updateConfirmedNavigation(true);
      }
    });
  };

  const closeModal = (cb) => {
    dialogPrompt.close();
    if (cb) {
      cb();
    }
    updateLastLocation(null);
  };

  UnsavedChangesDialogContext = React.createContext<UnsavedChangesDialogProps>({
    handleCloseDialogAfterSave,
    closeModal,
  });

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      showModal(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick =  () => {
    if (value === "true") {
      submitForm();
      return;
    }
    handleCloseDialogAfterSave();
  };

  useEffect(() => {
    if (confirmedNavigation) {
      lastLocation && navigate(lastLocation.pathname);
      updateConfirmedNavigation(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <UnsavedChangesDialog
        visible={dialogPrompt.isOpen}
        onCancel={closeModal}
        onConfirm={handleConfirmNavigationClick}
        value={value}
        setValue={setValue}
      />
    </>
  );
};

export default PromptIfDirty;
