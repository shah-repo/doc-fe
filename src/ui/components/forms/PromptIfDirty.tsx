import React, { useEffect } from "react";
import { Prompt } from "react-router-dom";

interface Props {
  dirty: boolean;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty,
}) => {
  const beforeUnload = (e: Event) => {
    e.preventDefault();
    e.returnValue = true;
  }

  if (dirty) {
    window.addEventListener('beforeunload', beforeUnload);
  } else {
    window.removeEventListener("beforeunload", beforeUnload);
  }

  useEffect(() => {
    window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  return (
    <Prompt
      when={dirty}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
