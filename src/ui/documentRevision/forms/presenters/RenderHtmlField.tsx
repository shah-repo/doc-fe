import * as React from "react";
import { Permission } from "../../../../state/ducks/auth/types";
import InputField from "../../../components/forms/fields/Input";
import useGetHasPermission from "../../../hooks/useGetHasPermission";

const RenderHtmlField: React.FunctionComponent = () => {
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);

  if (!canUpdateHTML) {
    return null;
  }

  return (
    <InputField
      name="renderHTML"
      label="common.renderHTML"
      inputProps={{ id: "RenderHTML", rows: 5, multiline: true }}
    />
  );
};

export default RenderHtmlField;
