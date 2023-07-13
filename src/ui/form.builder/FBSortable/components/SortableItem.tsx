import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import React, { CSSProperties } from 'react';
import { SortableItemProps } from '../types';
import { Field } from './Field';

export const SortableItem: React.FC<SortableItemProps> = ({
  item, isFirst, isDesignMode, isAutosaveEnabled,
}) => {
  const { name = '' } = item;

  const {
    setNodeRef, transform, transition, isDragging, isSorting,
  } = useSortable({ id: name });

  const style: CSSProperties = {
    position: 'relative',
    zIndex: isDragging ? 6 : undefined,
    pointerEvents: isSorting && !isDragging ? 'none' : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={cx({ 'fb-sortable-ghost': isDragging })}
      style={style}
      data-cy="sortable-item"
    >
      <Field
        key={name}
        item={item}
        disabled={isDesignMode}
        autosave={isAutosaveEnabled}
        isFirst={isFirst} />
    </div>
  );
};
