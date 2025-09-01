import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, List, ListItem } from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { translate } from '../../../../../common/intl';
import { convertHtmlEntities } from '../../../../../common/utils/helpers';
import { allocationActions } from '../../../../../state/ducks/Allocation';
import { FBProcedureItemType } from '../../../../form.builder/FBProcedureItem/FBProcedureItem.types';
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

interface Item {
  [key: string]: string | number
}

interface Props {
  children?: JSX.Element
  handler: DialogHandler
  selectedPart: ScanSelectedPartItem
  isSerialNumberHidden?: boolean
  reloadGrid?: () => void
  addScanLotsToPart?: (item: ScanLot[] | Item[]) => void
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose?: (event: {}, reason: DialogCloseReason) => void
}

const ScanCaptureDialog: React.FC<Props> = ({ handler, onCancel, onClose, reloadGrid, addScanLotsToPart, selectedPart, isSerialNumberHidden }) => {
  const classes = useStyles();
  const [scanLots, setScanLots] = useState<ScanLot[]>([]);
  const [scannedValue, setScannedValue] = useState<string>('');

  const isEquipmentScan = selectedPart?.type === FBProcedureItemType.equipment;
  const isLotScan = selectedPart?.type === FBProcedureItemType.materials;
  const validateScanLot = useActionCreator(allocationActions.validateScannedLot);
  const validateEQScan = useActionCreator(allocationActions.validateEQScannedItem);

  const keyValues = useCallback(() => {
    const values = [
      {
        key: translate('scan.lot.grid.item.id.message'),
        value: `${selectedPart?.docId}.${selectedPart?.displayRevision}`,
      },
      {
        key: translate(isEquipmentScan ? 'scan.lot.grid.eq.description.message' : 'scan.lot.grid.part.description.message'),
        value: convertHtmlEntities((selectedPart?.partDescription ?? '').replace(/(<([^>]+)>|\/n)/g, '')),
      },
    ];

    if (!isEquipmentScan) {
      values.push(
        {
          key: translate('scan.lot.grid.quantity.needed.message'),
          value: String(selectedPart?.quantityNeeded || 0),
        },
        {
          key: translate('scan.lot.grid.variance.message'),
          value: String(selectedPart?.variance || 0),
        },
      );
    }

    return values;
  }, [selectedPart]);

  const validateScanLotAsync = useAsync({
    onSuccess: (data?: ValidateLot) => {
      let lot: ScanLot;
      if (isEquipmentScan) {
        const calibrationKey = Object.keys(data?.formInput || {}).find((key) => key.startsWith('section-ii-calibration'));
        const preventiveMaintenanceKey = Object.keys(data?.formInput || {}).find((key) => key.startsWith('section-iii-preventative-maintenance'));
        const calibrationData = calibrationKey ? data?.formInput?.[calibrationKey] : {};
        const preventiveMaintenanceData = preventiveMaintenanceKey ? data?.formInput?.[preventiveMaintenanceKey] : {};

        lot = {
          ...data,
          id: data?.id,
          lotNumber: {
            id: data?.id,
            name: data?.document?.docId,
            documentId: data?.document?.id,
          },
          onHand: data?.onHand,
          calDueDate: calibrationData.complianceDueDate,
          pmDueDate: preventiveMaintenanceData.complianceDueDate,
        };
      } else {
        lot = {
          ...data,
          id: data?.lotRevId,
          lotNumber: {
            id: data?.lotRevId,
            name: data?.docId,
            documentId: data?.documentId,
          },
          onHand: data?.onHand,
          serialNumber: data?.serialNumber,
          quantityAssigned: data?.onHand,
          unitOfMeasure: data?.lotUsedUnit,
        };
      }

      setScanLots((prevLots) => [...prevLots, lot]);
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

    if (isEquipmentScan) {
      const equipPayload = scanLots.map((lot: ScanLot) => {
        return {
          actualId: lot.id,
        };
      });

      addScanLotsToPart?.(equipPayload as Item[]);
      return;
    }

    if (isLotScan) {
      const lotPayload = scanLots.map((lot: ScanLot) => {
        return {
          lotId: lot.id,
          unit: lot.unitOfMeasure,
          quantity: Number(lot.quantityAssigned),
        };
      });

      addScanLotsToPart?.(lotPayload as Item[]);
      return;
    }

    if (addScanLotsToPart) {
      addScanLotsToPart?.(scanLots);
      return;
    }

    partAsync.start(createLot, lotPayload, partAsync);
  };

  const handleScan = (data: string) => {
    setScannedValue(data);

    if (isEquipmentScan) {
      validateScanLotAsync.start(validateEQScan, extractRevision(data), validateScanLotAsync);
      return;
    }

    validateScanLotAsync.start(validateScanLot, selectedPart.partRevId, extractRevision(data), validateScanLotAsync);
  };

  const handleError = (error: Error) => {
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

  const validateEQScanItem = () => {
    const sampleLOT = [
      'http://localhost:3000/document_revision/cb85c705-8472-4960-8786-234d756a8fc4/version/4561ba79-3fdc-46ca-953c-940d9eb086d0',
      'http://localhost:3000/document_revision/3c984d43-357c-47fc-9af6-d7fa7451e19a/version/3a6deb34-5d98-4834-9279-6383bc1ab50f',
    ];

    let lotRevId = '';
    if (scannedValue) {
      lotRevId = extractRevision(scannedValue) ?? '';
    } else {
      const lotIndex = scanLots.length ? 1 : 0;
      lotRevId = extractRevision(sampleLOT[lotIndex]) ?? '';
    }

    validateScanLotAsync.start(validateEQScan, lotRevId, validateScanLotAsync);
  };

  return (
    <Dialog
      className={classes.root}
      open={handler?.isOpen}
      maxWidth="xl"
      cancelLabel="common.cancel"
      title={isEquipmentScan ? 'scan.eq.dialog.title.message' : 'scan.lot.dialog.title.message'}
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
      <Button onClick={validateScannedLot} size="small">
        scan item{' '}
      </Button>
      <Button onClick={validateEQScanItem} size="small">
        EQ scan item{' '}
      </Button>
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
          <Box component="span" ml={1.5}>
            {translate(isEquipmentScan ? 'scan.lot.grid.scan.eq.info.message' : 'scan.lot.grid.scan.lot.info.message')}
          </Box>
        </Box>
        <ScanLotTable
          scanLots={scanLots}
          units={[]}
          lots={[]}
          isSerialNumberHidden={isSerialNumberHidden}
          loading={validateScanLotAsync.isLoading}
          partId={selectedPart?.partRevId}
          type={selectedPart?.type}
          setScanLots={setScanLots}
        />
        <BarcodeReader onError={handleError} onScan={handleScan} />
      </Box>
    </Dialog>
  );
};

export default memo(ScanCaptureDialog);
