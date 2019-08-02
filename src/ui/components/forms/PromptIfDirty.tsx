import React from "react";
import { Prompt } from "react-router-dom";

interface Props {
  dirty: boolean;
}

const PromptIfDirty: React.FunctionComponent<Props> = ({
  dirty,
}) => {
  return (
    <Prompt
      when={dirty}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default PromptIfDirty;
