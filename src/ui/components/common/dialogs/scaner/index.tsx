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
import { ScanLot, ScanSelectedPartItem } from './components/lot.table/types';
import useStyles from './styles';

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  selectedPart: ScanSelectedPartItem
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onCancel, onClose, selectedPart }) => {
  const classes = useStyles();
  const [scanLots, setScanLots] = useState<ScanLot[]>([]);

  const keyValues = useCallback(() => [
    {
      key: translate('scan.lot.grid.item.id.message'),
      value: `${selectedPart?.docId}.${selectedPart?.displayRevision}`,
    },
    {
      key: translate('scan.lot.grid.part.description.message'),
      value: convertHtmlEntities(
        (selectedPart?.partDescription ?? '').replace(/(<([^>]+)>|\/n)/g, ''),
      ),
    },
    {
      key: translate('scan.lot.grid.quantity.needed.message'),
      value: selectedPart?.quantityNeeded ?? 0,
    },
    {
      key: translate('scan.lot.grid.variance.message'),
      value: selectedPart?.variance ?? 0,
    },
  ], [selectedPart]);

  const validateScanLot = useActionCreator(allocationActions.validateScannedLot);
  const validateScanLotAsync = useAsync({
    onSuccess: (data?: Document) => {
      console.log('Document', data);
      addBarCodeItemTOTable();
    },
    onError: (error) => {
      addBarCodeItemTOTable();
      toastError(error);
    },
  });

  const addBarCodeItemTOTable = () => {
    const lot = {
      id: '3b801e7a-67f3-4d45-8fd7-dae413815939',
      lotNumber: {
        id: '2894a1d2-e004-4cae-bd45-fe7485092daa',
        name: 'LOT #23120406',
        documentId: '6844670c-722e-4c1b-b899-87d847e253ff',
      },
      serialNumber: 'Serial Number #324',
      quantityAssigned: 2,
      unitOfMeasure: 'Pack(s)',
    };

    setScanLots([lot] as unknown as ScanLot[]);
  };

  const extractRevision = (url: string): string | null => {
    const match = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.exec(url);
    return match ? match[0] : null;
  };

  // validateScannedLot
  const onScanLotAdd = () => {
    console.log('Final Lot scan payload', scanLots);
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

  const addBarcodeScanItem = () => {
    console.log('setScanLots');
    // const sampleLOT = 'http://localhost:3000/document_revision/adb675a2-97ac-4ed0-9ae6-e7f20a7c7e47/version/674ba013-5454-4132-9e83-73df8f53c31d';
    // validateScanLotAsync.start(validateScanLot, selectedPart.partRevId, extractRevision(sampleLOT), validateScanLotAsync);
    validateScanLotAsync.start(validateScanLot, '61b18bb5-5ee3-4eb5-83c3-0ef61cb2ef1d', 'b82bb579-60eb-4d21-abbd-d6e9b4ec6c81', validateScanLotAsync);
  };

  // once we do scanning will get the URL from that take the ID and filter in options and
  // select one lot and update scan lots and pass one extra parameter to the lot object so that that field is not at all editable

  console.log('scannedValue', scannedValue);

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      maxWidth="xl"
      hideCloseButton
      // loading={loading}
      cancelLabel="common.cancel"
      title="scan.lot.dialog.title.message"
      confirmLabel="common.add"
      confirmProps={{
        id: 'dialog-add',
        'data-cy': 'dialog-add',
        // disabled: loading,
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
        <Button onClick={addBarcodeScanItem} size="small">
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
