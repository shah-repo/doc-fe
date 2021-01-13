import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFilePresenter, FBFileUploadProps, FBFileUploadState } from "..";
import FBFileViewPresenter from "../FBFilePresenter/FBFileViewPresenter";

export const withFBFileUpload = <T extends FBFileUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    filePresenters,
    disabled,
    name,
    defaultValue,
    withState,
    viewMode = false,
    attachmentIds,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);

    useObserver(() => {
      filePresenters = fileUploadState?.fetchedFiles.map((file) => {
        if (viewMode) {
          return (
            <FBFileViewPresenter
              key={`fb-file-presenter-${file.id}`}
              {...{ file, name, disabled }}
            />);
        }
        return (
          <FBFilePresenter
            key={`fb-file-presenter-${file.id}`}
            {...{ file, name, disabled }}
          />);
      });
    });

    React.useEffect(() => {
      const arrayOfFileIds = fileUploadState?.files.map((file) => file.id );
      if (isEmpty(arrayOfFileIds)) {
        return;
      }
      fileUploadState?.getAttachments(arrayOfFileIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (viewMode) {
        fileUploadState?.getAttachments(attachmentIds);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachmentIds]);

    React.useEffect(() => {
      reaction(
        () => fileUploadState?.files,
        (files) => {
          formState?.setFieldValue(name, files, withState);
          formState?.setFieldAutosave(name);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      fileUploadState,
      filePresenters,
      disabled,
      withState,
      viewMode,
      name,
    });
  };

  return (props: T) => Comp(props);
};
