import * as React from "react";
import InputField from "../../../components/forms/fields/Input";

const RenderHtmlField: React.FunctionComponent = () => (
  <InputField
    name="renderHTML"
    label="common.renderHTML"
    inputProps={{ id: "RenderHTML", rows: 5, multiline: true }}
  />
);

export default RenderHtmlField;
