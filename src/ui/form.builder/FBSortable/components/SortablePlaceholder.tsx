import React from 'react';
import { SortableItemProps } from '../types';
import { Field } from './Field';

export const SortablePlaceholder: React.FC<SortableItemProps> = React.forwardRef(({
  item, isFirst, isDesignMode, isAutosaveEnabled,
}, ref: React.Ref<HTMLDivElement>) => {
  const { name = '' } = item;

  return (
    <div ref={ref} className="fb-sortable-drag">
      <Field
        key={name}
        item={item}
        disabled={isDesignMode}
        autosave={isAutosaveEnabled}
        isFirst={isFirst}
        isDragging />
    </div>
  );
});
