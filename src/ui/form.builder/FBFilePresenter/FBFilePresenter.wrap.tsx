import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { FB, FBDialogState, FBFilePresenterColor, FBFilePresenterDownloadType, FBFilePresenterProps, FBFilePresenterState, FBFilePreview } from "..";

export const withFBFilePresenter = <T extends FBFilePresenterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleDownload,
    handleIconClick,
    handleRemove,
    onMouseOver,
    onMouseLeave,
    filePresenterState,
    dialogState,
    toolsVisible,
    disabled = false,
    fileSize,
    fileDescription,
    fileColor,
    menuItems,
    loading,
    name,
    file,
    ...props
  }: T) => {

    const intl = useIntl();
    const { formState } = FB.useStores();
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    filePresenterState?.setFile(file);

    const { fileUploadState } = FB.useStores();
    const { fileName, fileShortName, fileType } = filePresenterState;

    fileSize = useMemo(() => {
      const size = filePresenterState?.fileSize;
      if (!size) { return; }
      const i = Math.floor( Math.log(size) / Math.log(1024) );
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`;
    }, [filePresenterState]);

    fileDescription = useMemo(() => {
      const microsoftFiles = ["XLSX", "XLS", "DOCX", "DOC"];
      const type = fileType?.toUpperCase();
      if (!type) { return; }
      if (microsoftFiles.includes(type)) {
        return intl.formatMessage({ id: `file.type.${type}` });
      }
      return intl.formatMessage({ id: "file.type" }, { type });
    }, [fileType, intl]);

    fileType && (fileColor = FBFilePresenterColor[fileType.toUpperCase()]);

    React.useEffect(() => {
      reaction(
        () => filePresenterState?.data,
        (data) => {
          if (!data?.url) { return; }
          file.url = filePresenterState?.data?.url;
          handleLoaded();
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleLoaded() {
      switch (filePresenterState?.downloadType) {
        case "view":
          dialogState?.config({
            open: true,
            maxWidth: "lg",
            title: fileName,
            content: <FBFilePreview {...{ file }} />,
          });
          break;
        default:
          window.onbeforeunload = null;
          window.open(file.url, "_parent");
      }
    }

    handleRemove = () => {
      fileUploadState?.removeFile(file);
      formState?.setFieldValue(name, fileUploadState?.files);
    };

    handleDownload = (type: FBFilePresenterDownloadType = "download") => {
      filePresenterState?.setDownloadType(type);
      if (!file.url) { return; }
      handleLoaded();
    };

    handleIconClick = () => {
      if (filePresenterState?.isFileViewable) {
        return handleDownload?.("view");
      }
      handleDownload?.("download");
    };

    onMouseOver = () => filePresenterState?.setToolsVisible(true);
    onMouseLeave = () => filePresenterState?.setToolsVisible(false);

    useObserver(() => {
      loading = filePresenterState?.loading;
      toolsVisible = filePresenterState?.toolsVisible;
    });

    // File menu items
    menuItems = [{
      text: "form.builder.download.file",
      textValues: { fileShortName },
      onClick: () => handleDownload?.("download"),
    }, {
      text: "form.builder.download.clean.copy",
      textValues: { fileShortName },
      hidden: !filePresenterState?.isCleanCopy,
      onClick: () => handleDownload?.("download"),
    }, {
      text: "common.view.file",
      hidden: !filePresenterState?.isFileViewable,
      onClick: () => handleDownload?.("view"),
    }];

    return Component({
      ...(props as T),
      handleDownload,
      handleIconClick,
      handleRemove,
      onMouseOver,
      onMouseLeave,
      dialogState,
      toolsVisible,
      disabled,
      menuItems,
      fileName,
      fileShortName,
      fileDescription,
      fileColor,
      fileType,
      fileSize,
      loading,
    });
  };

  return (props: T) => Comp(props);
};
