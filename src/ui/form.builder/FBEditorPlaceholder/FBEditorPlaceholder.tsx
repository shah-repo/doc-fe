import React from 'react';
import { FBTextField } from '..';
import { FBEditorPlaceholderProps } from './FBEditorPlaceholder.types';

const FBEditorPlaceholder: React.FunctionComponent<FBEditorPlaceholderProps> = ({
  boxProps,
  labelProps,
  className,
  isFbEditorField,
}) => (
  <FBTextField
    label="form.builder.placeholder"
    name="placeholder"
    {...{ boxProps, labelProps, className, isFbEditorField }}
  />
);

export default FBEditorPlaceholder;
