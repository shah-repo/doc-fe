import { concat, uniqBy } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FB, FBMPIProcedureSelectState, FBMPIProcedureSelectValue } from '../../..';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, SmartReferenceType } from '../../../../../state/ducks/documentRevisions/types';
import { EditableEquipmentItem } from '../../interface';
import { FBEquipmentProps } from './interface';

export const withFBEquipmentTable = <T extends FBEquipmentProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({ name, type, isDisabled, mpiProcedureSelectState, equipsSelected, ...props }: T) => {
    const { mpiProcedureState, workspaceState } = FB.useStores();
    const { id, document } = workspaceState || {};
    const dispatch = useDispatch();
    const isDocPIInstance = document?.document.documentType.group === DOC_TYPE_GROUP.PI_INSTANCE;
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState);
    equipsSelected = useObserver(() => mpiProcedureState?.partsSelected);

    useEffect(() => {
      reaction(
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
                actualId: ref?.toDocRev?.id,
              });
            }
            return selected;
          }, [] as Array<Partial<FBMPIProcedureSelectValue>>);

          mpiProcedureState?.setPartsSelected(partsSelected);
          id && dispatch(documentRevisionsActions.loadAudit(id));
          id && dispatch(documentRevisionsActions.reload(id));
        },
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function saveActualEquipment (values: EditableEquipmentItem) {
      if (!id) { return; }
      const { actualId, parentEquipPlannedId } = values;

      if (!actualId) { return; }

      const part = {
        fieldId: name ?? '',
        forPreselected: { id: parentEquipPlannedId ?? '' },
        usedOverride: { id: actualId },
        type: type.toUpperCase() as 'MATERIAL' | 'EQUIPMENT',
      };
          mpiProcedureSelectState?.useOverride(id, part);
    }

    return Component({
      ...(props as T),
      name,
      type,
      isDisabled: isDisabled ?? workspaceState?.isPreview,
      equipsSelected,
      saveActualEquipment,
    });
  };

  Comp.displayName = 'withFBEquipmentTable';

  return (props: T) => Comp(props);
};
