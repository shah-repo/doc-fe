import React from "react";
import FBButton from "../../../components/inputs/button/FBButton";
import FBCheckbox from "../../../components/inputs/checkbox/FBCheckbox";
import FBTextField from "../../../components/inputs/textfield/FBTextField";
import { templateStore } from "../../../stores/templateStore";

export function withBasicConfig(
  Component: React.ComponentType<{}>,
) {

  const namePrefix = templateStore.namePrefix();
  return (props: any) => (
    <Component {...props}>
      <FBTextField label="Label" name={`${namePrefix}_label_field`} />
      <FBTextField label="Placeholder" name={`${namePrefix}_placeholder_field`} />
      {props.children}
      <FBCheckbox label="Required" name={`${namePrefix}_required_field`} />
      <FBButton type="submit" label="Add" />
    </Component>
  );
}
