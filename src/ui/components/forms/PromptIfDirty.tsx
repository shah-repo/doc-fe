import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";

interface Props {
  dirty: boolean;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty, doNotPrompt, onDirtyFlagChange,
}) => {
  useEffect(() => {
    if (onDirtyFlagChange) {
      onDirtyFlagChange(dirty);
    }

    if (doNotPrompt) {
      return;
    }

    if (dirty) {
      startBeforeUnload();
    } else {
      cancelBeforeUnload();
    }
  }, [dirty]);

  useEffect(() => {
    return () => {
      cancelBeforeUnload();
    };
  }, []);

  const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }};
  const cancelBeforeUnload = () => window.onbeforeunload = () => {};

  return (
    <Prompt
      when={dirty}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
