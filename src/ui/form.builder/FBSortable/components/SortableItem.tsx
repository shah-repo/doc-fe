import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import React, { CSSProperties } from 'react';
import { LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY, LHRS_START_QUANTITY } from '../../FBLHRStep/utils';
import { SortableItemProps } from '../types';
import { Field } from './Field';
import useStyles from './SortableItem.styles';

const SortableItem: React.FC<SortableItemProps> = ({
  item, isFirst, isDesignMode, isAutosaveEnabled,
}) => {
  const { name = '' } = item;
  const shouldApplyInlineStyle = [LHRS_START_QUANTITY, LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY].includes(name ?? '');
  const classes = useStyles();

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
      className={cx({ 'fb-sortable-ghost': isDragging }, { [classes.inlineStyle]: shouldApplyInlineStyle })}
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

export default SortableItem;
