import { Field, FieldProps, useFormikContext } from 'formik';
import React, { ReactNode } from 'react';
import { Accept, FileRejection } from 'react-dropzone';
import { withThemeNext } from '../../../../layout/theme-next';
import CustomDropzone from './Dropzone';
import { FileWithPreview } from './Dropzone.types';

interface DropzoneFieldProps {
  name: string
  accept?: Accept
  children?: ReactNode
  className?: string
  isMultiple?: boolean
  maxSize?: number
  onDropCallback?: (files: FileWithPreview[]) => void
  onMaxSizeExceeded?: () => void
}

const DropzoneField: React.FC<DropzoneFieldProps> = ({ name, children, onDropCallback, onMaxSizeExceeded, ...restProps }) => {
  const { setFieldValue } = useFormikContext();

  const handleDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (onMaxSizeExceeded) {
      const oversizedFiles = rejectedFiles
        .filter(rejection => rejection.errors.some(error => error.code === 'file-too-large'));

      if (oversizedFiles.length > 0) {
        onMaxSizeExceeded();
        return;
      }
    }

    setFieldValue(name, acceptedFiles);

    if (onDropCallback) {
      const filesWithPreview: FileWithPreview[] = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      onDropCallback(filesWithPreview);
    }
  };

  return (
    <Field name={name}>
      {({ form }: FieldProps) => (
        <CustomDropzone onDrop={handleDrop} {...restProps}>
          {children}
        </CustomDropzone>
      )}
    </Field>
  );
};

export default withThemeNext(DropzoneField);
