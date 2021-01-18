import { isEmpty, map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBFilesPresenterProps, FBFilesPresenterState } from "..";

export const withFBFilesPresenter = <T extends FBFilesPresenterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    filesPresenterState,
    attachments,
    files,
    ...props
  }: T) => {

    filesPresenterState = FB.useRef(FBFilesPresenterState);

    useEffect(() => {
      const ids = map(files, "id");
      if (!isEmpty(ids)) {
        filesPresenterState?.getFiles(ids);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    useObserver(() => {
      attachments = filesPresenterState?.filesApi.data;
    });

    return Component({
      ...(props as T),
      attachments,
    });
  };

  return (props: T) => Comp(props);
};
