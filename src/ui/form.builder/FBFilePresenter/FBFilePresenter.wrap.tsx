import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFilePresenterDownloadType, FBFilePresenterProps, FBFilePresenterState, FBFilePreview } from "..";

export const withFBFilePresenter = <T extends FBFilePresenterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleDownload,
    handleRemove,
    filePresenterState,
    dialogState,
    disabled = false,
    menuItems,
    loading,
    name,
    file,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    filePresenterState?.setFile(file);

    const { fileUploadState } = FB.useStores();
    const { fileName, fileShortName, fileType } = filePresenterState;

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

    useObserver(() => {
      loading = filePresenterState?.loading;
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
      handleRemove,
      dialogState,
      disabled,
      menuItems,
      fileName,
      fileShortName,
      fileType,
      loading,
    });
  };

  return (props: T) => Comp(props);
};
