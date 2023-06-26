import React from 'react';
import { FBCheckbox, FBEditorLabel, FBEditorProps } from '..';

const FBEditorZIPUpload: React.FunctionComponent<FBEditorProps> = ({
  children,
  ...props
}) => (
  <FBEditorLabel {...props} >
    <FBCheckbox hidden={true} name="uniqueSchemaItem" defaultValue={true} />
    {children}
  </FBEditorLabel>
);

export default FBEditorZIPUpload;
