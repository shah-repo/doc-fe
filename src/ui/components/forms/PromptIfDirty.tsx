import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";

export interface Props {
  dirty: boolean;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty, doNotPrompt, onDirtyFlagChange,
}) => {
  useEffect(() => {
    const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }; };
    const cancelBeforeUnload = () => window.onbeforeunload = () => { };

    if (onDirtyFlagChange) {
      onDirtyFlagChange(dirty);
    }

    if (doNotPrompt) {
      cancelBeforeUnload();
      return;
    }

    if (dirty) {
      startBeforeUnload();
    } else {
      cancelBeforeUnload();
    }

    return () => {
      cancelBeforeUnload();
    };
  }, [dirty, doNotPrompt, onDirtyFlagChange]);

  return (
    <Prompt
      when={dirty && !doNotPrompt}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
