import * as React from "react";
import InputField from "../../../components/forms/fields/Input";

interface Props {
  isDisabled: boolean;
}

const RenderHtmlField: React.FunctionComponent<Props> = ({ isDisabled = false }) => (
  <InputField
    name="renderHTML"
    label="common.renderHTML"
    inputProps={{ id: "RenderHTML", rows: 5, multiline: true, disabled: isDisabled }}
  />
);

export default RenderHtmlField;
