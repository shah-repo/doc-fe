import { concat, isUndefined, uniqBy } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FB, FBMPIProcedureSelectState, FBMPIProcedureSelectValue } from '../..';
import { intl } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, SmartReferenceType } from '../../../../state/ducks/documentRevisions/types';
import { toastError } from '../../../components/notifications';
import { isMoreDigitsAfterDecimal } from '../../../dashboard.new/line.items/common/Utils';
import { EditableMaterial, MaterialTableProps } from './types';

export const withMaterialsTable = <T extends MaterialTableProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({ name, isDisabled, mpiProcedureSelectState, type, partsSelected, ...props }: T) => {
    const { mpiProcedureState, workspaceState } = FB.useStores();
    const { id, document } = workspaceState || {};
    const dispatch = useDispatch();
    const isDocPIInstance = document?.document.documentType.group === DOC_TYPE_GROUP.PI_INSTANCE;
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState);
    partsSelected = useObserver(() => mpiProcedureState?.partsSelected);
    const [scannedLots, setScannedLots] = useState<EditableMaterial[]>([]);

    useEffect(() => {
      const disposer = reaction(
        () => mpiProcedureSelectState?.useOverrideApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const refs = isDocPIInstance
            ? data.smartReferencesTo
            : uniqBy(concat(data.smartReferencesTo, data.document.smartReferencesTo), 'id');
          const partsSelected = refs?.reduce((selected, ref) => {
            if (ref?.metadata?.fieldId === name
                    && ref?.active
                    && (ref?.type === SmartReferenceType.EquipmentReplacement || ref?.type === SmartReferenceType.LotUsage)) {
              selected.push({
                ...ref?.metadata,
                refId: ref?.id,
                pmDueDate: ref?.toDocRev?.precalc?.pm_due_date,
                calDueDate: ref?.toDocRev?.precalc?.cali_due_date,
                overrideDocId: ref?.toDocRev?.document.docId,
                lotPartRevision: ref?.toDocRev?.precalc?.lot_part_revision,
                lotId: ref?.toDocRevId ?? '',
              });
            }
            return selected;
          }, [] as Array<Partial<FBMPIProcedureSelectValue>>);

              mpiProcedureState?.setPartsSelected(partsSelected);
              if (scannedLots.length) {
                saveLot(scannedLots[0]);
                setScannedLots(prev => [...prev.slice(1)]);
              } else {
                id && dispatch(documentRevisionsActions.loadAudit(id));
                id && dispatch(documentRevisionsActions.reload(id));
              }
        },
      );
      return disposer;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scannedLots]);

    function saveLot (values: EditableMaterial) {
      if (!id) { return; }
      const { quantity, unit, lotId } = values;

      if (isUndefined(quantity)) { return; }
      if (!lotId) { return; }
      if (quantity && quantity <= 0) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.positive.error' }));
        return;
      }
      if (quantity && isMoreDigitsAfterDecimal(quantity, 10)) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.decimals.error' },
          { name: intl.formatMessage({ id: 'form.builder.quantity' }) }));
        return;
      }
      const part = {
        fieldId: name ?? '',
        forPreselected: { id: values.parentPartPlannedId ?? '' },
        quantity,
        unit: unit,
        // actualId: values.actualId,
        usedOverride: { id: values.lotId },
        type: type.toUpperCase() as 'MATERIAL' | 'EQUIPMENT',
      };
      mpiProcedureSelectState?.useOverride(id, part);
    }

    function editLot (values: EditableMaterial) {
      if (!id) { return; }
      const { id: refId, quantity, unit } = values;

      if (isUndefined(quantity)) { return; }
      if (!refId) { return; }
      if (quantity && quantity <= 0) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.positive.error' }));
        return;
      }
      if (quantity && isMoreDigitsAfterDecimal(quantity, 10)) {
        toastError(intl.formatMessage({ id: 'document.revision.quantity.decimals.error' },
          { name: intl.formatMessage({ id: 'form.builder.quantity' }) }));
        return;
      }
      const part = {
        quantity,
        unit: unit,
        type: type.toUpperCase() as 'MATERIAL' | 'EQUIPMENT',
      };
      mpiProcedureSelectState?.editOverride(id, refId, part);
    }

    function saveScannedLots (lots: EditableMaterial[]) {
      if (!lots?.length) {
        return;
      }
      if (lots?.length > 1) {
        setScannedLots(lots.slice(1));
      }
      saveLot(lots[0]);
    }

    return Component({
      ...(props as T),
      name,
      type,
      isDisabled: isDisabled ?? workspaceState?.isPreview,
      partsSelected,
      saveLot,
      editLot,
      saveScannedLots,
    });
  };

  Comp.displayName = 'withFBEquipmentTable';

  return (props: T) => Comp(props);
};
