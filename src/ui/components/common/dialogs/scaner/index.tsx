import { Box, List, ListItem } from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { translate } from '../../../../../common/intl';
import { convertHtmlEntities } from '../../../../../common/utils/helpers';
import { allocationActions } from '../../../../../state/ducks/Allocation';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { DialogHandler } from '../../../../hooks/useDialog';
import Dialog from '../../../dialogs/Dialog';
import { DialogCloseReason } from '../../../dialogs/Dialog.types';
import { Button } from '../../../forms/fields-next';
import { toastError } from '../../../notifications';
import ScanLotTable from './components/lot.table';
import { ScanLot, ScanSelectedPartItem, ValidateLot } from './components/lot.table/types';
import useStyles from './styles';

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  selectedPart: ScanSelectedPartItem
  reloadGrid?: () => void
  addScanLotsToPart?: (item: ScanLot[]) => void
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onCancel, onClose, reloadGrid, addScanLotsToPart, selectedPart }) => {
  const classes = useStyles();
  const [scanLots, setScanLots] = useState<ScanLot[]>([]);

  const keyValues = useCallback(
    () => [
      {
        key: translate('scan.lot.grid.item.id.message'),
        value: `${selectedPart?.docId}.${selectedPart?.displayRevision}`,
      },
      {
        key: translate('scan.lot.grid.part.description.message'),
        value: convertHtmlEntities((selectedPart?.partDescription ?? '').replace(/(<([^>]+)>|\/n)/g, '')),
      },
      {
        key: translate('scan.lot.grid.quantity.needed.message'),
        value: selectedPart?.quantityNeeded ?? 0,
      },
      {
        key: translate('scan.lot.grid.variance.message'),
        value: selectedPart?.variance ?? 0,
      },
    ],
    [selectedPart],
  );
  console.log('selectedPart', selectedPart);

  const validateScanLot = useActionCreator(allocationActions.validateScannedLot);
  const validateScanLotAsync = useAsync({
    onSuccess: (data?: ValidateLot) => {
      const lot = {
        ...data,
        id: data?.lotRevId,
        lotNumber: {
          id: data?.lotRevId,
          name: data?.docId,
          documentId: data?.documentId,
        },
        serialNumber: data?.serialNumber,
        quantityAssigned: data?.onHand,
        unitOfMeasure: data?.lotUsedUnit,
      };

      setScanLots((prevLots) => [...prevLots, lot as ScanLot]);
    },
    onError: toastError,
  });

  const extractRevision = (url: string): string | null => {
    const match = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.exec(url);
    return match ? match[0] : null;
  };

  const partAsync = useAsync({
    onSuccess: reloadGrid,
    onError: toastError,
  });

  const createLot = useActionCreator(allocationActions.addLot);

  const onScanLotAdd = () => {
    const lotPayload = scanLots.map((lot: ScanLot) => {
      return {
        workOrderId: selectedPart.woId,
        lotQuantityNeeded: lot.quantityAssigned,
        partRevId: selectedPart.partRevId,
        lotRevId: lot.lotRevId,
        serialNumber: lot.serialNumber,
      };
    });

    if (addScanLotsToPart) {
      addScanLotsToPart?.(scanLots);
      return;
    }

    partAsync.start(createLot, lotPayload, partAsync);
  };

  const [scannedValue, setScannedValue] = useState<string>('');

  const handleScan = (data: string) => {
    setScannedValue(data);
    validateScanLotAsync.start(validateScanLot, selectedPart.partRevId, extractRevision(data), validateScanLotAsync);
  };

  const handleError = (error: Error) => {
    setScannedValue('');
    toastError(error);
  };

  const validateScannedLot = () => {
    const sampleLOT = [
      'http://localhost:3000/document_revision/adb675a2-97ac-4ed0-9ae6-e7f20a7c7e47/version/674ba013-5454-4132-9e83-73df8f53c31d',
      'http://localhost:3000/document_revision/98e8abb0-1b99-4b4b-9f38-ec3e2ae89ebb/version/5b22dbc8-91ac-491c-9fa2-3171615c75de',
    ];
    let lotRevId = '';
    if (scannedValue) {
      lotRevId = extractRevision(scannedValue) ?? '';
    } else {
      const lotIndex = scanLots.length ? 1 : 0;
      lotRevId = extractRevision(sampleLOT[lotIndex]) ?? '';
    }
    validateScanLotAsync.start(validateScanLot, selectedPart.partRevId, lotRevId, validateScanLotAsync); // partRevId -> 'b82bb579-60eb-4d21-abbd-d6e9b4ec6c81'
  };

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      maxWidth="xl"
      hideCloseButton
      cancelLabel="common.cancel"
      title="scan.lot.dialog.title.message"
      confirmLabel="common.add"
      confirmProps={{
        id: 'dialog-add',
        'data-cy': 'dialog-add',
        disabled: partAsync.isLoading,
      }}
      cancelProps={{
        id: 'dialog-cancel',
        'data-cy': 'dialog-cancel',
      }}
      PaperProps={{
        id: 'dialog',
      }}
      onClose={onClose}
      onCancel={onCancel}
      loading={partAsync.isLoading}
      onConfirm={onScanLotAdd}
    >
      <Box className={classes.contentWrapper}>
        <List>
          {keyValues()?.map((item, index) => (
            <ListItem key={index} disableGutters>
              <div className={classes.row}>
                <span className={classes.key}>{item.key}:</span>
                <span className={classes.value}>{item.value}</span>
              </div>
            </ListItem>
          ))}
        </List>
        <Button onClick={validateScannedLot} size="small">
          scan item{' '}
        </Button>

        <ScanLotTable
          scanLots={scanLots}
          units={[]}
          lots={[]}
          loading={validateScanLotAsync.isLoading}
          partId={selectedPart?.partRevId}
          setScanLots={setScanLots}
        />
        <BarcodeReader onError={handleError} onScan={handleScan} />
      </Box>
    </Dialog>
  );
};

export default memo(ScanCaptureDialog);
