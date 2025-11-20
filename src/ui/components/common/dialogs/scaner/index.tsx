import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, List, ListItem } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React, { memo, useCallback, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { translate } from '../../../../../common/intl';
import { convertHtmlEntities } from '../../../../../common/utils/helpers';
import Config from '../../../../../config';
import { allocationActions } from '../../../../../state/ducks/Allocation';
import ExpiredLOTDialog, { DialogTypes } from '../../../../change.request/dialogs/ExpiredLOTDialog';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog, { DialogHandler } from '../../../../hooks/useDialog';
import Dialog from '../../../dialogs/Dialog';
import { DialogCloseReason } from '../../../dialogs/Dialog.types';
import { toastError } from '../../../notifications';
import ScanLotTable from './components/lot.table';
import { ScanLot, ScanSelectedPartItem, ValidateLot } from './components/lot.table/types';
import useStyles from './styles';

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  selectedPart: ScanSelectedPartItem
  parentRevId: string | undefined
  reloadGrid?: () => void
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}
declare global {
  interface Window {
    simulateBarcodeScan: (data: string) => void
  }
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onCancel, onClose, reloadGrid, selectedPart, parentRevId }) => {
  const classes = useStyles();
  const [scanLots, setScanLots] = useState<ScanLot[]>([]);
  const expiredDialog = useDialog();

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
        value: selectedPart?.quantityNeeded,
      },
      {
        key: translate('scan.lot.grid.variance.message'),
        value: selectedPart?.variance ?? '-',
      },
    ],
    [selectedPart],
  );

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

  const addLotToAllocation = () => {
    const lotPayload = scanLots.map((lot: ScanLot) => {
      return {
        workOrderId: selectedPart.woId,
        lotQuantityNeeded: lot.quantityAssigned,
        partRevId: selectedPart.partRevId,
        lotRevId: lot.lotRevId,
        serialNumber: lot.serialNumber,
      };
    });
    partAsync.start(createLot, lotPayload, partAsync);
  };

  const onScanLotAdd = () => {
    if (isEmpty(scanLots)) {
      toastError(translate('scan.lot.grid.empty.lots.message'));
      return;
    }

    const hasExpiredLot = scanLots.some((lot: ScanLot) => lot.isExpired === true);

    if (hasExpiredLot) {
      expiredDialog.open();
    } else {
      addLotToAllocation();
    }
  };

  const handleScan = (data: string) => {
    const lotRevId = extractRevision(data);
    const isDuplicateScan = scanLots?.some((lot: ScanLot) => lot.lotRevId === lotRevId);
    if (isDuplicateScan) {
      toastError(translate('scan.lot.grid.scan.duplicate.error.message'));
      return;
    }

    validateScanLotAsync.start(validateScanLot, parentRevId, selectedPart.partRevId, lotRevId, validateScanLotAsync);
  };

  const handleError = () => {
    toastError(translate('scan.lot.grid.scan.barcode.error.message'));
  };

  if (typeof window !== 'undefined' && !Config.isProduction) {
    // Enables test automation to trigger fake barcode and lot-scan events.
    window.simulateBarcodeScan = handleScan;
  }

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      maxWidth="xl"
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
        <Box className={classes.infoContainer}>
          <FontAwesomeIcon className={classes.infoIcon} icon={light('circle-exclamation')} />
          <Box component="span" className={classes.infoMessage}>
            {translate('scan.lot.grid.scan.lot.info.message')}
          </Box>
        </Box>

        <ScanLotTable
          scanLots={scanLots}
          units={[]}
          lots={[]}
          isLoading={validateScanLotAsync.isLoading}
          partId={selectedPart?.partRevId}
          setScanLots={setScanLots}
        />
        <BarcodeReader onError={handleError} onScan={handleScan} />
      </Box>
      <ExpiredLOTDialog
        dialog={expiredDialog}
        message="allocation.scan.lot.expired.confirm.prompt.message"
        type={DialogTypes.Warning}
        title="common.warning"
        confirmLabel="common.yes.continue"
        cancelLabel="common.no.go.back"
        confirmAction={addLotToAllocation}
      />
    </Dialog>
  );
};

export default memo(ScanCaptureDialog);
