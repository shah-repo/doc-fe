import React, { useCallback } from 'react';
import { CellTemplateProps, EditableItem } from '../../../../../../KendoDataGrid/KendoDataGrid.types';
import ActionsButtons from './ActionButtons';

interface Props<T extends EditableItem> extends CellTemplateProps<T> {
  scrollBehavior?: ScrollBehavior
  isLoading?: boolean
  onDelete?: (item: T) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: T) => void
}

function ActionsCellTemplate<T extends EditableItem> ({
  dataItem,
  scrollBehavior = 'auto',
  isLoading,
  onDelete,
  onOpenQuickView,
}: Props<T>): React.ReactElement {
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
      }
    },
    [scrollBehavior],
  );

  return (
    <>
      <ActionsButtons
        ref={ref}
        isLoading={isLoading}
        onDelete={onDelete && (() => onDelete(dataItem))}
        openQuickView={onOpenQuickView && ((event) => onOpenQuickView(event, dataItem))}
      />
    </>
  );
}

export default ActionsCellTemplate;
