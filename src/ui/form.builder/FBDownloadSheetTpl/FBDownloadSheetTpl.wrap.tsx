import React from "react";
import { FB, FBDownloadSheetTplState } from "..";
import { FBDownloadSheetTplProps } from "./FBDownloadSheetTpl.types";

export const withFBDownloadSheetTpl = <T extends FBDownloadSheetTplProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAction,
    downloadSheetTplState,
    ...props
  }: T) => {

    downloadSheetTplState = FB.useRef<FBDownloadSheetTplState>(FBDownloadSheetTplState);
    const { workspaceState } = FB.useStores();
    const docRevId = workspaceState?.document?.id;

    handleAction = () => {
      downloadSheetTplState?.getBulkCreateTemplateId(docRevId);
    };

    return Component({
      ...(props as T),
      handleAction,
      downloadSheetTplState,
    });
  };

  return (props: T) => Comp(props);
};
