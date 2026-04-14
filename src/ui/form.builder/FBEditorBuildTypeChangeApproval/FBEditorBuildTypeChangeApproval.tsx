import React from 'react';
import { FBCheckbox, FBEditorLabel, FBEditorProps } from '..';

const FBEditorBuildTypeChangeApproval: React.FunctionComponent<FBEditorProps> = ({
  children,
  ...props
}) => (
  <FBEditorLabel {...props} >
    <FBCheckbox hidden={true} name="buildTypeChangeApproval" defaultValue={true} />
    {children}
  </FBEditorLabel>
);

export default FBEditorBuildTypeChangeApproval;
