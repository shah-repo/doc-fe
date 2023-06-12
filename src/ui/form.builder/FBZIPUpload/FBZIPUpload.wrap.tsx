import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBFileUploadState, FBFZIPUploadProps, FBUnzipStatus } from '..';

export const withFBZIPUpload = <T extends FBFZIPUploadProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fileUploadState,
    disabled,
    name = '',
    defaultValue,
    withState,
    files,
    isInputOwner,
    gutter,
    disableFileUpload,
    disableUnzipButton,
    unzipStatus,
    startUnzip,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || defaultValue;
    const docRevisionId = workspaceState?.document?.id || '';

    fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState, formValue);
    isInputOwner = workspaceState?.getIsInputOwner(name);
    useObserver(() => {
      files = fileUploadState?.files;
    });

    disableFileUpload = fileUploadState?.files.length === 1;
    disableUnzipButton = fileUploadState?.unzipStatus === FBUnzipStatus.FAILED ||
    fileUploadState?.unzipStatus === FBUnzipStatus.DONE ||
    fileUploadState?.unzipStatus === FBUnzipStatus.PROCESSING;

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
          if (!data) {
            return;
          }
          fileUploadState?.setUnzipStatus(data[0]?.status);
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
          if (isEmpty(files)) {
            formState?.validate();
            const isUnderWorkspace = workspaceState?.getSchemaItem(name);
            if (!isUnderWorkspace) { return; }
            workspaceState?.saveDocRev(formState?.getValues());
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getZIPAttachmentStatus = () => {
      if (!files) {
        return;
      }
      fileUploadState?.getZIPStatus(files[0].id);
    };

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
      disableUnzipButton,
      docRevisionId,
      unzipStatus,
      startUnzip,
    });
  };

  return (props: T) => Comp(props);
};
