import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";

interface Props {
  dirty: boolean;
  doNotPrompt?: boolean;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty, doNotPrompt,
}) => {
  if (doNotPrompt) {
    return null;
  }
  const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }};
  const cancelBeforeUnload = () => window.onbeforeunload = () => {};

  useEffect(() => {
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

  return (
    <Prompt
      when={dirty}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
