import * as React from "react";
import { TextProps } from "../Text";

const Text: React.FunctionComponent<TextProps> = (props: TextProps) => {
  return (
    <span>
      {props.translation || props.message}
    </span>
  );
};

export default Text;
