import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFilePresenter, FBFileUploadProps, FBFileUploadState } from "..";

export const withFBFileUpload = <T extends FBFileUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    filePresenters,
    disabled,
    name,
    ...props
  }: T) => {

    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);

    useObserver(() => {
      filePresenters = _.map(fileUploadState?.files, (file) => (
        <FBFilePresenter key={`fb-file-presenter-${file.id}`} {...{ file, name, disabled }} />
      ));
    });

    return Component({
      ...(props as T),
      fileUploadState,
      filePresenters,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
