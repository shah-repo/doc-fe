import React from "react";
import { useIntl } from "react-intl";
import { FB, FBDownloadSheetTplState } from "..";
import { toastSuccess } from "../../components/notifications";
import { FBDownloadSheetTplProps } from "./FBDownloadSheetTpl.types";

export const withFBDownloadSheetTpl = <T extends FBDownloadSheetTplProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAction,
    downloadSheetTplState,
    ...props
  }: T) => {

    const intl = useIntl();

    downloadSheetTplState = FB.useRef<FBDownloadSheetTplState>(FBDownloadSheetTplState);
    const { workspaceState } = FB.useStores();
    const docRevId = workspaceState?.document?.id;

    handleAction = () => {
      downloadSheetTplState?.getBulkCreateTemplateId(docRevId as string, () => {
        toastSuccess(
          intl.formatMessage({ id: "document.revision.bulkCreate.download.excelTemplate" }),
          { position: "bottom-right" }
        );
        window.onfocus = null;
      });
    };

    return Component({
      ...(props as T),
      handleAction,
      downloadSheetTplState,
    });
  };

  return (props: T) => Comp(props);
};
