import { pick } from 'lodash';
import { useObserver } from 'mobx-react';
import { useCallback, useEffect, useMemo } from 'react';
import { FB, FBLHRBuildOptions } from '..';
import { SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { useLhrsTitle } from '../../hooks/useLhrsTitle';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';
import FBDataStore from '../FBStore/FBDataStore';
import { LHRSInfo, LHRSSequenceInfo, LHRSSerialNumbers, LHRSStepSerialNumbersFormValue } from './types';

const useIsRnD = () => {
  const { workspaceState } = FB.useStores();

  return useMemo(() => {
    const smartRef = workspaceState?.document?.smartReferencesTo?.find(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
    );
    const buildTypeId = smartRef?.toDocRev?.formInput?.['lhr-build-type'] as string | undefined;
    const buildType = workspaceState?.buildTypeOptions?.find(
      (opt) => opt.id === buildTypeId,
    );
    return buildType?.internalType === FBLHRBuildOptions['R&D'];
  }, [workspaceState?.buildTypeOptions, workspaceState?.document?.smartReferencesTo]);
};

const useLhrsInfo = (): LHRSInfo => {
  const { workspaceState, formState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name ?? '', workspaceState?.document?.document.documentType.id ?? '');

  const formValues = useObserver(() => formState?.newValues ?? formState?.values ?? {});

  const sequences = useObserver(
    () => workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure').sort((a, b) => (a.stepIndex ?? 0) - (b.stepIndex ?? 0)),
  );

  const { rejectedSerials, acceptedSerials } = useMemo(
    () => {
      const defaultResult = { rejectedSerials: new Set<string>(), acceptedSerials: new Set<string>() };
      if (!sequences) { return defaultResult; }
      return sequences.reduce((acc, item) => {
        if (!item.name) {
          return acc;
        }
        const formValue = formValues[item.name] as LHRSStepSerialNumbersFormValue | undefined;
        const serialsNumbers = formValue?.serialsNumbers;
        if (!serialsNumbers) {
          return acc;
        }
        Object.entries(serialsNumbers).forEach(([serialNumber, data]) => {
          if (data.status === SerialNumberStatus.REJECTED) {
            acc.rejectedSerials.add(serialNumber);
            acc.acceptedSerials.delete(serialNumber);
          } else {
            acc.acceptedSerials.add(serialNumber);
            acc.rejectedSerials.delete(serialNumber);
          }
        });
        return acc;
      }, defaultResult);
    },
    [formValues, sequences],
  );

  const rejectedCount = rejectedSerials.size;
  const acceptedCount = acceptedSerials.size;

  return useMemo(() => ({
    stepIndex,
    isSynced: false,
    rejectedCount,
    acceptedCount,
  }), [acceptedCount, rejectedCount, stepIndex]);
};

const useLhrsSequenceInfo = (name: string): LHRSSequenceInfo => {
  const { workspaceState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name ?? '', workspaceState?.document?.document.documentType.id ?? '');
  const sequence = workspaceState?.schema?.find((item) => item.name === name);
  const sequenceIndex = sequence?.stepIndex;

  return useMemo(() => ({
    step: stepIndex,
    sequence: sequenceIndex,
  }), [sequenceIndex, stepIndex]);
};

export const useLHRSSerialNumbers = (name: string): LHRSSerialNumbers => {
  const { serialsState, formState } = FB.useStores();

  useEffect(() => {
    serialsState?.load();
  }, [serialsState]);

  const isRnD = useIsRnD();
  const getLHRSStepSerialNumbersValue = useCallback((): LHRSStepSerialNumbersFormValue | undefined => {
    if (formState?.newValues.has(name)) {
      return formState.newValues.get(name) as LHRSStepSerialNumbersFormValue | undefined;
    }

    return (
      FBDataStore.refreshData?.formInput?.[name]
      ?? formState?.getFieldValue(name)
    ) as LHRSStepSerialNumbersFormValue | undefined;
  }, [formState, name]);
  const value = useObserver(getLHRSStepSerialNumbersValue);
  const affectedSerialNumbers = useMemo(() => value?.serialsNumbers ?? {}, [value]);
  const lhrsInfo = useLhrsInfo();
  const lhrsSequenceInfo = useLhrsSequenceInfo(name);
  const { sequence, step } = lhrsSequenceInfo;

  const [
    allSerialNumbers,
    shouldShowSerials,
    isLoading,
  ] = useObserver(() => [
    serialsState?.serialNumbers ?? [],
    serialsState?.shouldShowSerials ?? false,
    serialsState?.isLoading ?? false,
  ]);

  const stepSerialNumbers = useMemo(() => {
    return allSerialNumbers.reduce<EditableSerialNumber[]>((acc, serial) => {
      const isRejected = serial.status === SerialNumberStatus.REJECTED;
      const isUpdatedInNextSteps
        = (serial.meta?.updatedIn?.step ?? 0) > (step ?? 0)
        || (serial.meta?.updatedIn?.sequence ?? 0) > (sequence ?? 0);
      const canUseForRnD = isRnD && serial.usage === SerialNumberUsage.RND;

      const shoupShow = !isRejected || canUseForRnD || isUpdatedInNextSteps || (serial.id in affectedSerialNumbers);
      if (!shoupShow) {
        return acc;
      }
      const existingSerial = affectedSerialNumbers[serial.id];

      return [...acc, {
        ...serial,
        status: existingSerial?.status ?? null,
        usage: existingSerial?.usage ?? null,
        notes: existingSerial?.notes ?? null,
        isDisabled: isRejected && !canUseForRnD && isUpdatedInNextSteps,
      }];
    }, []);
  }, [allSerialNumbers, affectedSerialNumbers, isRnD, sequence, step]);

  const setAffectedSerialNumbers = useCallback((payload: SerialNumberUpdatePayload[]) => {
    const currentValue = getLHRSStepSerialNumbersValue();
    const currentAffectedSerialNumbers = currentValue?.serialsNumbers ?? {};

    const updatedSerialNumbers = payload.reduce<Record<string, Partial<SerialNumberUpdateData>>>((acc, item) => {
      const dataToUpdate = pick(item, ['status', 'usage', 'notes']);
      const existingSerial = currentAffectedSerialNumbers[item.id] ?? {};

      acc[item.id] = {
        ...existingSerial,
        ...dataToUpdate,
      };

      return acc;
    }, {});

    formState?.setFieldValue(name, {
      ...currentValue,
      serialsNumbers: {
        ...currentAffectedSerialNumbers,
        ...updatedSerialNumbers,
      },
    });
  }, [formState, getLHRSStepSerialNumbersValue, name]);

  const updateSerialNumbers = useCallback(async (payload: SerialNumberUpdatePayload[]) => {
    const previousValue = getLHRSStepSerialNumbersValue();

    setAffectedSerialNumbers(payload);

    try {
      await serialsState?.updateSerialNumbers(payload.map((item) => ({
        ...item,
        meta: {
          updatedIn: {
            sequence,
            step,
          },
        },
      })));

      formState?.setFieldAutosave(name);
    } catch (error) {
      formState?.setFieldValue(name, previousValue);
      throw error;
    }
  }, [
    formState,
    getLHRSStepSerialNumbersValue,
    name,
    sequence,
    serialsState,
    setAffectedSerialNumbers,
    step,
  ]);

  const updateSerialNumber = useCallback(async (id: string, data: SerialNumberUpdateData) => {
    await updateSerialNumbers([{ id, ...data }]);
  }, [updateSerialNumbers]);

  return useMemo(() => ({
    isRnD,
    isLoading,
    shouldShowSerials,
    stepSerialNumbers,
    allSerialNumbers,
    lhrsInfo,
    lhrsSequenceInfo,
    updateSerialNumber,
    updateSerialNumbers,
  }), [
    allSerialNumbers,
    isLoading,
    isRnD,
    lhrsInfo,
    lhrsSequenceInfo,
    shouldShowSerials,
    stepSerialNumbers,
    updateSerialNumber,
    updateSerialNumbers,
  ]);
};
