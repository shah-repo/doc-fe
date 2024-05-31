import { Field, FieldProps } from 'formik';
import React, { ReactNode } from 'react';
import { Accept } from 'react-dropzone';
import { withThemeNext } from '../../../../layout/theme-next';
import CustomDropzone from './Dropzone';

export interface FileWithPreview extends File {
  preview: string
}

interface DropzoneFieldProps {
  name: string
  accept?: Accept
  children?: ReactNode
  className?: string
  multiple?: boolean
  onDropCallback?: (files: FileWithPreview[]) => void
}

const DropzoneField: React.FC<DropzoneFieldProps> = ({ name, accept, children, onDropCallback, ...props }) => {
  return (
    <Field name={name}>
      {({ form }: FieldProps) => {
        const handleDrop = (acceptedFiles: File[]) => {
          form.setFieldValue(name, acceptedFiles);

          if (onDropCallback) {
            const filesWithPreview: FileWithPreview[] = acceptedFiles.map(file =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            );

            onDropCallback(filesWithPreview);
          }
        };

        return (<CustomDropzone onDrop={handleDrop} accept={accept} {...props}>{children}</CustomDropzone>);
      }}
    </Field>
  );
};

export default withThemeNext(DropzoneField);
