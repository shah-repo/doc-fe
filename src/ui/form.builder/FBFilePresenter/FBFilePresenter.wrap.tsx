import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { FB, FBDialogState, FBFileDescription, FBFilePresenterColor, FBFilePresenterDownloadType, FBFilePresenterProps, FBFilePresenterState, FBFilePreview } from "..";

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
    fileExtension,
    fileDescription,
    omitDescription = false,
    fileColor,
    menuItems,
    loading,
    name,
    file,
    ...props
  }: T) => {

    const intl = useIntl();
    const { formState } = FB.useStores();
    filePresenterState = FB.useRef<FBFilePresenterState>(FBFilePresenterState, file);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    const { fileUploadState } = FB.useStores();
    const { fileName, fileShortName, fileType } = filePresenterState;

    fileSize = useMemo(() => {
      const size = filePresenterState?.fileSize;
      if (!size) { return; }
      const i = Math.floor( Math.log(size) / Math.log(1024) );
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`;
    }, [filePresenterState]);

    fileExtension = useMemo(() => {
      const microsoftFiles = ["XLSX", "XLS", "DOCX", "DOC"];
      const type = fileType?.toUpperCase();
      if (!type) { return; }
      if (microsoftFiles.includes(type)) {
        return intl.formatMessage({ id: `file.type.${type}` });
      }
      return intl.formatMessage({ id: "file.type" }, { type });
    }, [fileType, intl]);

    fileType && (fileColor = FBFilePresenterColor[fileType.toUpperCase()]);

    useObserver(() => {
      fileDescription = filePresenterState?.attachmentApi.data?.description || file.description;
    });

    const fileDescriptionTitle = isEmpty(fileDescription)
      ? "form.builder.add.description"
      : "form.builder.edit.description";

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
          window.open(file.url);
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

    function handleDescription() {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: fileDescriptionTitle,
        content: (
          <FBFileDescription
            boxProps={{ width: "100%" }}
            omitDescription={true}
            {...{
              file,
              fileName,
              fileColor,
              fileType,
              fileShortName,
              fileSize,
              fileExtension,
              fileDescription,
            }}
          />
        ),
      });
    }

    // File menu items
    menuItems = [{
      id: FB.uniqid,
      text: fileDescriptionTitle,
      onClick: () => handleDescription(),
    }, {
      id: FB.uniqid,
      text: "form.builder.download.file",
      textValues: { fileShortName },
      onClick: () => handleDownload?.("download"),
    }, {
      id: FB.uniqid,
      text: "form.builder.download.clean.copy",
      textValues: { fileShortName },
      hidden: !filePresenterState?.isCleanCopy,
      onClick: () => handleDownload?.("download"),
    }, {
      id: FB.uniqid,
      text: "common.view.file",
      hidden: !filePresenterState?.isFileViewable,
      onClick: () => handleDownload?.("view"),
    }];

    return Component({
      ...(props as T),
      filePresenterState,
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
      fileExtension,
      fileDescription,
      omitDescription,
      fileColor,
      fileType,
      fileSize,
      loading,
    });
  };

  return (props: T) => Comp(props);
};
