import React from "react";
import { FBFormDefaultProps } from "../../types/common";
import FBTextField from "../inputs/FBTextField";

const FBNoteTextField: React.FunctionComponent<FBFormDefaultProps> = ({
  name,
}) => (
  <FBTextField name={`${name}_optionNote_field`}/>
);

export default FBNoteTextField;
