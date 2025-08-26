import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { FB, FBFileFieldProps } from '..';
import AttachmentsActions from '../../../state/ducks/attachments/actions';
import { Attachment, AttachmentUploadError } from '../../../state/ducks/attachments/types';
import { useAsyncDispatch } from '../../../state/store';
import { getValidSizedFiles } from '../../components/common/attachment.field/utils';
import { toastError } from '../../components/notifications';
import { checkIsDocumentWO } from '../../documentRevision/helpers/checkDocumentGroup';

export const withFBAttachmentField = <T extends FBFileFieldProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    onUploadClick,
    forceFileUpload = false,
    onClick,
    onChange,
    name = '',
    ...props
  }: T) => {
    const { fileUploadState, workspaceState, formState } = FB.useStores();
    const { id } = workspaceState ?? {};
    const groupOptions = workspaceState?.document?.document?.documentType?.groupOptions;
    const isWORecord = checkIsDocumentWO(groupOptions) && isEmpty(workspaceState?.document?.formTemplate);
    const dispatch = useAsyncDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const fileUploadEl = document.getElementById(`fb-attachment-field-${name}`);

    const shouldUploadFiles = workspaceState?.mode !== 'preview' || isWORecord || forceFileUpload;

    if (fileUploadEl) {
      fileUploadEl.onclick = registerCancel;
    }

    function registerCancel () {
      document.body.onfocus = removeLock;
    }

    function removeLock () {
      if (fileUploadEl?.nodeValue?.length) { return; }
      setTimeout(() => {
        formState?.unlockField(name);
      }, 1000);
    }

    function handleLockField () {
      if (formState?.isBackdropOpen) { return; }
      if (!id) { return; }
      if (!name) { return; }
      formState?.lockField({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    }

    onUploadClick = () => {
      handleLockField();
    };

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.currentTarget.files) {
        return;
      }
      const filesToUpload = getValidSizedFiles(event.currentTarget.files);

      if (shouldUploadFiles) {
        setIsLoading(true);
        dispatch(AttachmentsActions.uploadFilesAsync(filesToUpload))
          .then(results => {
            const attachments = results.reduce<{ attachments: Attachment[], errors: string[] }>((acc, result) => {
              if (result.status === 'fulfilled' && result.value.attachment) {
                acc.attachments.push(result.value.attachment);
              } else {
                const error = result.status === 'rejected' ? (result.reason as AttachmentUploadError).message : 'Unknown error';
                acc.errors.push(error);
              }
              return acc;
            }, { attachments: [], errors: [] });
            fileUploadState?.addFiles(attachments.attachments);
            if (attachments.errors.length) {
              toastError(attachments.errors.join('\n'));
            }
          }).finally(() => setIsLoading(false));
      }
    };

    onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const element = event.target as HTMLInputElement;
      element.value = '';
    };

    return useObserver(() => Component({
      ...(props as T),
      onUploadClick,
      onClick,
      onChange,
      formState,
      isLoading,
      name,
    }));
  };

  return (props: T) => Comp(props);
};
