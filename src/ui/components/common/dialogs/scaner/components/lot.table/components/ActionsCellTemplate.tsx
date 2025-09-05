import React, { useCallback } from 'react';
import { CellTemplateProps } from '../../../../../../KendoDataGrid/KendoDataGrid.types';
import { EditableScanLot } from '../types';
import ActionsButtons from './ActionButtons';

interface Props<T extends EditableScanLot> extends CellTemplateProps<T> {
  scrollBehavior?: ScrollBehavior
  isLoading?: boolean
  onDelete?: (item: T) => void
  onOpenQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: T) => void
}

function ActionsCellTemplate<T extends EditableScanLot> ({
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
        onOpenQuickView={onOpenQuickView && ((event) => onOpenQuickView(event, dataItem))}
      />
    </>
  );
}

export default ActionsCellTemplate;
