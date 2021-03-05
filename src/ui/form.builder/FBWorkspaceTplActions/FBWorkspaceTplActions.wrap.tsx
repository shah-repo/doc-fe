import React from "react";
import { FB, FBFieldName, FBWorkspaceTplActionsProps } from "..";

export const withFBWorkspaceTplActions = <T extends FBWorkspaceTplActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleCancel,
    handleTplName,
    ...props
  }: T) => {

    const { dialogState, workspaceState, formState } = FB.useStores();

    handleTplName = () => {
      const name = formState?.getFieldValue(FBFieldName.TemplateName);
      exportTemplate(name);
    };

    const exportTemplate = (name = "template") => {
      const schema = JSON.stringify(workspaceState?.getSchema());
      const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(schema)}`;
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.download = `${name}.json`;
      anchor.href = dataStr;
      anchor.click();
      dialogState?.closeDialog();
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleTplName,
    });
  };

  return (props: T) => Comp(props);
};
