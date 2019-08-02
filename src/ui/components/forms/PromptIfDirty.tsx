import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";

interface Props {
  dirty: boolean;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty,
}) => {
  const startBeforeUnload = () => { window.onbeforeunload = (e: Event) => { e.returnValue = true; }};
  const cancelBeforeUnload = () => window.onbeforeunload = () => {};

  if (dirty) {
    startBeforeUnload();
  } else {
    cancelBeforeUnload();
  }

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
