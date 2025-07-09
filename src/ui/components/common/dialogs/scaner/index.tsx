import { Box, List, ListItem } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { Document, DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { documentsActions } from '../../../../../state/ducks/documents';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { DialogHandler } from '../../../../hooks/useDialog';
import Dialog from '../../../dialogs/Dialog';
import { DialogCloseReason } from '../../../dialogs/Dialog.types';
import { Button } from '../../../forms/fields-next';
import { toastError } from '../../../notifications';
import ScanLotTable from './components/lot.table';
import { ScanLot } from './components/lot.table/types';
import useStyles from './styles';

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  partId: string
  partDocumentId: string
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onCancel, onClose, partId, partDocumentId }) => {
  const classes = useStyles();
  const [selectedPart, setSelectedPart] = useState<DocumentRevision>();
  const [scanLots, setScanLots] = useState<ScanLot[]>([]);
  // const getDocumentById = useActionCreator(documentRevisionsActions.getDocumentRevisionByRevId);
  const getDocumentById = useActionCreator(documentsActions.getDocumentById);

  const docByIdAsync = useAsync({
    onSuccess: (data?: Document) => {
      console.log('Document', data);
      const partRev = data?.documentRevisions?.find((data) => data.id === partId);
      setSelectedPart(partRev);
    },
  });

  useEffect(() => {
    docByIdAsync.start(getDocumentById, partDocumentId, docByIdAsync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('selectedPart', selectedPart);

  const keyValues = [
    { key: 'Item ID', value: 'FG-00100' },
    { key: 'Part Description', value: 'Sample Desc' },
    { key: 'Qty Needed', value: 20 },
    { key: 'Variance', value: 12 },
  ];

  const onScanLotAdd = () => {
    console.log('Final Lot scan payload', scanLots);
  };

  const [scannedValue, setScannedValue] = useState<string>('');

  const handleScan = (data: string) => {
    setScannedValue(data);
    // validate lot
  };

  const handleError = (error: Error) => {
    setScannedValue('');
    toastError(error);
  };

  const addBarcodeScanItem = () => {
    console.log('setScanLots');

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

  // once we do scanning will get the URL from that take the ID and filter in options and
  // select one lot and update scan lots and pass one extra parameter to the lot object so that that field is not at all editable

  console.log('scannedValue', scannedValue);

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      maxWidth="xl"
      hideCloseButton={false}
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
          {keyValues?.map((item, index) => (
            <ListItem key={index} disableGutters>
              <div className={classes.row}>
                <span className={classes.key}>{item.key}:</span>
                <span className={classes.value}>{item.value}</span>
              </div>
            </ListItem>
          ))}
        </List>
        <Button onClick={addBarcodeScanItem} size="small">scan item </Button>
        <ScanLotTable scanLots={scanLots} units={[]} lots={[]} partId={partId} setScanLots={setScanLots} />
        <BarcodeReader
          onError={handleError}
          onScan={handleScan}
        />
      </Box>
    </Dialog>
  );
};

export default ScanCaptureDialog;
