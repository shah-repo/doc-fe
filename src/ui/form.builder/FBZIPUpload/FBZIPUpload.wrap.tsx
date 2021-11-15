import { isEmpty } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFileUploadState, FBFZIPUploadProps } from "..";

export const withFBZIPUpload = <T extends FBFZIPUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    disabled,
    name = "",
    defaultValue,
    withState,
    files,
    isInputOwner,
    gutter,
    disableFileUpload,
    startUnzip,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);
    isInputOwner = workspaceState?.getIsInputOwner(name);
    disableFileUpload = fileUploadState.files.length === 1;
    const docRevisionId = workspaceState?.document?.id || "";

    const getZIPAttachmentStatus = () => {
      if (!files) {
        return;
      }
      fileUploadState?.getZIPStatus(files[0].id);
    };

    useObserver(() => {
      files = fileUploadState?.files;
    });

    React.useEffect(() => {
      if (isEmpty(files)) {
        return;
      }
      getZIPAttachmentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => fileUploadState?.getZIPStatusApi.data,
        (data) => {
          console.log(data);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get(name)?.value?.length,
        (files) => {
          if (!fileUploadState) { return; }
          fileUploadState.files = formState?.inputState.get(name)?.value;
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => fileUploadState?.files,
        (files) => {
          formState?.setFieldValue(name, files, withState);
          formState?.setFieldAutosave(name);
          formState?.unlockField(name);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    startUnzip = () => {
      const files = formState?.getFieldValue(name);
      fileUploadState?.startUnzipping({ docRevisionId, attachmentId: files?.[0].id });
    };

    return Component({
      ...(props as T),
      fileUploadState,
      files,
      disabled,
      withState,
      name,
      gutter,
      disableFileUpload,
      docRevisionId,
      startUnzip,
    });
  };

  return (props: T) => Comp(props);
};
