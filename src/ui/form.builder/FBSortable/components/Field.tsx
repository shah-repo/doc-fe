import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FBFieldWrapper, FBSchemaState } from '../..';
import { SortableFieldProps } from '../types';

export const Field = React.memo<SortableFieldProps>(({
  item, autosave, disabled, isFirst, isDragging,
}) => {
  const { name = '' } = item;

  // To avoid UI-freezes on rendering huge list of fields.
  const [rendered, setRendered] = useState(isFirst);
  useEffect(
    () => {
      setTimeout(() => setRendered(true));
    },
    [],
  );

  const schemaField = rendered && FBSchemaState.component({
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
