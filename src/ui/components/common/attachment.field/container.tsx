import { difference, map, pick } from 'lodash';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { attachmentsActions } from '../../../../state/ducks/attachments';
import { LINE_TYPES } from '../../../../state/ducks/attachments/constants';
import { Attachment } from '../../../../state/ducks/attachments/types';
import FBDynamicValidatorStore from '../../../form.builder/stores/ui/FBDynamicValidatorStore';
import FBStore from '../../../form.builder/stores/ui/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { useFormContext } from '../../forms/FormContext';
import { withFormik } from '../../hoc/formik';
import { toastError } from '../../notifications';
import Presenter from './presenter';
import { calculateTotalFileSize, FILE_UPLOAD_LIMIT, handleFileSizeExceedLimit } from './utils';
import { AttachmentContainerProps } from './utils/types';

const AttachmentFieldContainer: React.FunctionComponent<AttachmentContainerProps> = ({
  name = '',
  upload,
  component = 'button',
  multiple = true,
  field,
  form,
  ...other
}) => {
  const { submitForm } = useFormContext();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const intl = useIntl();

  const uploadAction = useActionCreator(attachmentsActions.upload);

  const async = useAsync<Attachment>({
    onSuccess: (attachment?: Attachment) => {
      setIsUploading(false);
      if (!attachment && !form && !field) {
        return;
      }
      if (!multiple) {
        return form?.setFieldValue(name, attachment);
      }
      const attachments: Attachment[] = field?.value ? [...field.value] : [];
      attachment && attachments.push(attachment);

      FBStore.setValues({
        ...FBStore.values,
        [name]: map(attachments, (attach) =>
          pick(attach, ['id', 'name', 's3link', 'type']),
        ),
      });

      if (FBStore.mode === 'form') {
        FBStore.setValues({
          ...FBStore.values,
          [name]: map(attachments, (attach) =>
            pick(attach, ['id', 'name', 's3link', 'type']),
          ),
        });
        FBDynamicValidatorStore.validate();
      }
      form?.setFieldValue(name, attachments);
      submitForm();
    },
    onError: (error) => {
      setIsUploading(false);
      toastError(error as string);
    },
  });

  const handleUpload = (files: File[], lineType: string, cleanCopyRequired: boolean, index: number) => {
    if (!files.length) {
      return;
    }

    if (lineType === LINE_TYPES.RED_LINE) {
      cleanCopyRequired = false;
    }

    const file = files.pop();
    if (!file) {
      return;
    }
    setIsUploading(true);
    const attachmentIndex = index + 1;
    async.start(uploadAction, file, lineType, index, async, cleanCopyRequired);
    handleUpload(files, lineType, cleanCopyRequired, attachmentIndex);
  };

  const onChange = (lineType: string, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) {
      return;
    }
    const filesToUpload = Array.from(event.currentTarget.files);

    const filesSize = calculateTotalFileSize(filesToUpload);
    if (filesSize > FILE_UPLOAD_LIMIT) {
      const names = filesToUpload.map(file => file.name);
      handleFileSizeExceedLimit(names, filesSize, event);
      return;
    }

    const invalidCleanCopyFiles = filesToUpload.filter(
      (file) => {
        const type = file.name.split('.').pop();
        return type !== 'docx' && cleanCopyRequired;
      },
    );
    const validFiles = difference(filesToUpload, invalidCleanCopyFiles);

    if (invalidCleanCopyFiles.length) {
      toastError(intl.formatMessage({ id: 'common.attachment.form.create.clean.copy.error' }));
    }

    if (!validFiles.length) {
      return;
    }
    const index = (field?.value?.length ?? 0) + 1;
    handleUpload(validFiles, lineType, cleanCopyRequired, index);
  };

  return (
    <Presenter
      {...{
        name,
        isUploading,
        upload,
        component,
        multiple,
        form,
        field,
        onChange,
      }}
      {...other}
    />
  );
};

export default withFormik(AttachmentFieldContainer);
