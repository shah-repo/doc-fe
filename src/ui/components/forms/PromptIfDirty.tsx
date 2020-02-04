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
  }, [dirty, doNotPrompt]);

  useEffect(() => {
    return () => {
      cancelBeforeUnload();
    };
  }, []);

  const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }; };
  const cancelBeforeUnload = () => window.onbeforeunload = () => { };

  return (
    <Prompt
      when={dirty && !doNotPrompt}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
