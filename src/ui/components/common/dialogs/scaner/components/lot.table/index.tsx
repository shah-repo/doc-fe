import Typography from '@material-ui/core/Typography';
import cx from 'classnames';
import React, { useRef, useState } from 'react';
import { translate } from '../../../../../../../common/intl';
import { FBProcedureItemType } from '../../../../../../form.builder';
import useDialog from '../../../../../../hooks/useDialog';
import KendoDataGrid from '../../../../../KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../../KendoDataGrid/KendoDataGrid.types';
import DocumentRevisionDialog from '../../../DocumentRevisionDialog';
import { buildEqSchema } from './eqSchema';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableScanLot, ScanLotTableProps } from './types';
import { withFBScanLot } from './wrap';

const ScanLotTable: React.FC<ScanLotTableProps> = ({
  scanLots,
  isLoading,
  onUpdateScanLot,
  onDeleteScanLot,
  type,
  isSerialNumberHidden,
}) => {
  const classes = useStyles();
  const isEquipmentScan = type === FBProcedureItemType.equipment;
  const [selectedDataItem, setSelectedDataItem] = useState<EditableScanLot>();
  const quickViewDialog = useDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  const removeScanLot = (lot: EditableScanLot) => {
    onDeleteScanLot?.(lot);
  };

  const onOpenQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableScanLot) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender: DataGridProps<EditableScanLot>['rowRender'] = (row) => {
    return row;
  };

  const schema = (isEquipmentScan ? buildEqSchema : buildSchema)({
    isSerialNumberHidden,
    onUpdateScanLot,
    onDelete: removeScanLot,
    onOpenQuickView: onOpenQuickView,
  });

  return (
    <div ref={containerRef} data-cy="scan-lot-grid">
      <KendoDataGrid<EditableScanLot>
        className={cx(classes.grid, classes.gridWithButton)}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        containerRef={containerRef}
        loading={isLoading}
        data={scanLots as EditableScanLot[]}
        rowRender={rowRender}
        fallback={
          <Typography className={classes.emptyTableMessage}>{translate('scan.lot.grid.empty.message')}</Typography>
        }
      />
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: selectedDataItem?.lotNumber?.id }} />
    </div>
  );
};

export default withFBScanLot(ScanLotTable);
