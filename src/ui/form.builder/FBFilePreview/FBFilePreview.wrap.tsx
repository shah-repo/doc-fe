import React from "react";
import { FBFilePreviewProps } from "..";
import { SUPPORTED_VIDEO_FILES } from "../../components/common/view.file/utils/constants";

export const withFBFilePreview = <T extends FBFilePreviewProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    file,
    previewType,
    ...props
  }: T) => {

    const { type } = file;

    switch (true) {
      case SUPPORTED_VIDEO_FILES.includes(type):
        previewType = "video";
        break;
      case type === "pdf":
        previewType = "pdf";
        break;
      default:
        previewType = "image";
    }

    return Component({
      ...(props as T),
      file,
      previewType,
    });
  };

  return (props: T) => Comp(props);
};
