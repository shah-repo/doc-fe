import { throttle } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { FB, FBLHRBuildOptions } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY } from '../FBLHRStep/utils';
import { SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';
import { LHRSSerialNumbers, LHRSStepSerialNumbersFormValue } from './types';

const UPDATE_STEP_QTY_INTERVAL = 1000;

export const useLHRSSerialNumbers = (name: string, stepIndex: number): LHRSSerialNumbers => {
  const { workspaceState, serialsState, formState } = FB.useStores();

  const value = useObserver<LHRSStepSerialNumbersFormValue | undefined>(
    () => (formState?.newValues.get(name) ?? formState?.getFieldValue(name)) as LHRSStepSerialNumbersFormValue | undefined,
  );

  const affectedSerialNumbers = useMemo(() => {
    return value?.serialsNumbers ?? {};
  }, [value]);

  useEffect(() => {
    serialsState?.load();
  }, [serialsState]);

  const allSerialNumbers = useObserver(() => serialsState?.serialNumbers ?? []);
  const isLoading = useObserver(() => serialsState?.isLoading ?? false);
  const shouldShowSerials = useObserver(() => serialsState?.shouldShowSerials ?? false);

  const isRnD = useMemo(() => {
    const smartRef = workspaceState?.document?.smartReferencesTo?.find(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
    );
    const buildTypeId = smartRef?.toDocRev?.formInput?.['lhr-build-type'] as string | undefined;
    const buildType = workspaceState?.buildTypeOptions?.find(
      (opt) => opt.id === buildTypeId,
    );
    return buildType?.internalType === FBLHRBuildOptions['R&D'];
  }, [workspaceState?.buildTypeOptions, workspaceState?.document?.smartReferencesTo]);

  const stepSerialNumbers = useMemo(() => {
    return allSerialNumbers.filter((serial) => {
      const isRejected = serial.status === SerialNumberStatus.REJECTED;
      const canUseForRnD = isRnD && serial.usage === SerialNumberUsage.RND;
      return !isRejected || canUseForRnD || (serial.id in affectedSerialNumbers);
    }).map((serial) => ({
      ...serial,
      ...(serial.id in affectedSerialNumbers ? affectedSerialNumbers[serial.id] : {}),
    }));
  }, [allSerialNumbers, affectedSerialNumbers, isRnD]);

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, data);

    formState?.setFieldValue(name, {
      ...value,
      serialsNumbers: {
        ...affectedSerialNumbers,
        [id]: data,
      },
    });

    formState?.setFieldAutosave(name);
  };

  const updateSerialNumbers = async (payload: SerialNumberUpdatePayload[]) => {
    await serialsState?.updateSerialNumbers(payload);
  };

  const updateStepQty = throttle(
    (serialNumbers?: SerialNumber[]) => {
      if (!serialNumbers || serialNumbers.length === 0) { return; }
      const acceptedQty = serialNumbers.filter((serial) => serial.status === SerialNumberStatus.ACCEPTED).length;
      const rejectedQty = serialNumbers.filter((serial) => serial.status === SerialNumberStatus.REJECTED).length;
      formState?.setFieldValue(LHRS_ACCEPTED_QUANTITY, acceptedQty);
      formState?.setFieldValue(LHRS_REJECTED_QUANTITY, rejectedQty);
      // formState?.setFieldAutosave(LHRS_ACCEPTED_QUANTITY);
      // formState?.setFieldAutosave(LHRS_REJECTED_QUANTITY);
    },
    UPDATE_STEP_QTY_INTERVAL,
    { trailing: false },
  );

  SM.reaction(
    () => serialsState?.serialNumbers,
    updateStepQty,
  );

  return {
    isRnD,
    isLoading,
    shouldShowSerials,
    stepSerialNumbers,
    allSerialNumbers,
    updateSerialNumber,
    updateSerialNumbers,
  };
};
