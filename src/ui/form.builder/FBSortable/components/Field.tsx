import { isEqual } from 'lodash';
import React from 'react';
import { FBFieldWrapper, FBSchemaState } from '../..';
import { SortableFieldProps } from '../types';

export const Field = React.memo<SortableFieldProps>(({
  item, autosave, disabled, isFirst, isDragging,
}) => {
  const { name = '' } = item;

  const schemaField = FBSchemaState.component({
    ...item,
    autosave,
    disabled,
    gutter: false,
  });

  return (
    <FBFieldWrapper
      key={`fb-sortable-wrapper-${name}`}
      inputProps={item}
      isFirst={isFirst}
      isDragging={isDragging}
    >
      {schemaField}
    </FBFieldWrapper>
  );
}, isEqual);
