import React from "react";
import { FBFilePresenterProps, FBFilePresenterState } from ".";
import { FB } from "..";

export const withFBFilePresenter = <T extends FBFilePresenterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    disabled = false,
    menuItems,
    handleRemove,
    handleDownload,
    filePresenterState,
    name,
    file,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState);
    filePresenterState?.setFile(file);

    const { fileUploadState } = FB.useStores();
    const { fileName, fileShortName, fileType } = filePresenterState;

    handleRemove = () => {
      fileUploadState?.removeFile(file);
      formState?.setFieldValue(name, fileUploadState?.files);
    };

    handleDownload = () => {
      filePresenterState?.download();
    };

    // File menu items
    menuItems = [{
      text: "form.builder.download.file",
      textValues: { fileShortName },
      onClick: handleDownload,
    }, {
      text: "form.builder.download.clean.copy",
      textValues: { fileShortName },
      hidden: !filePresenterState?.isCleanCopy,
      onClick: handleDownload,
    }, {
      text: "attachment.download.watermark",
      hidden: !filePresenterState.canWatermark,
      onClick: filePresenterState?.watermakDownload,
    }, {
      text: "common.view.file",
      hidden: !filePresenterState?.isFileViewable,
      onClick: filePresenterState?.viewFile,
    }];

    return Component({
      ...(props as T),
      disabled,
      menuItems,
      fileName,
      fileShortName,
      fileType,
      handleRemove,
      handleDownload,
    });
  };

  return (props: T) => Comp(props);
};
