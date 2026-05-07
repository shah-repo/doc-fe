import { pick } from 'lodash';
import { useObserver } from 'mobx-react';
import { useCallback, useEffect, useMemo } from 'react';
import { FB, FBWorkspaceState } from '..';
import { useCurrentFormValue } from '../../hooks/useCurrentFormValue';
import { useLhrsTitle } from '../../hooks/useLhrsTitle';
import { LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY } from '../FBLHRStep/utils';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';
import FBDataStore from '../FBStore/FBDataStore';
import { LHRSInfo, LHRSSequenceInfo, LHRSSerialNumbers, LHRSStepSerialNumbersFormValue, LHRSStepSerialNumbersFormValues } from './types';

const isLHRSStepSerialNumbersFormValue = (value: unknown): value is LHRSStepSerialNumbersFormValue => {
  return typeof value === 'object' && value !== null && 'serialsNumbers' in value;
};

const calculateLhrsQuantities = (formValues: LHRSStepSerialNumbersFormValues, sequences?: string[]) => {
  if (!sequences || sequences.length === 0) { return { rejectedCount: 0, acceptedCount: 0 }; }

  const serials = sequences.reduce((acc, sequence) => {
    const formValue = formValues[sequence];
    if (!isLHRSStepSerialNumbersFormValue(formValue) || !formValue.serialsNumbers) {
      return acc;
    }
    const serialsNumbers = formValue.serialsNumbers;
    Object.entries(serialsNumbers).forEach(([serialNumber, data]) => {
      if (data.status === SerialNumberStatus.REJECTED) {
        acc.rejected.add(serialNumber);
        acc.accepted.delete(serialNumber);
      } else {
        acc.accepted.add(serialNumber);
        acc.rejected.delete(serialNumber);
      }
    });
    return acc;
  }, { rejected: new Set<string>(), accepted: new Set<string>() });

  return {
    rejectedCount: serials.rejected.size,
    acceptedCount: serials.accepted.size,
  };
};

const useLhrsSequences = (workspaceState?: FBWorkspaceState) => {
  return useMemo(() => workspaceState?.schema?.reduce<string[]>((acc, item) => {
    if (item.type === 'mpiprocedure' && item.name && !item.deleted) {
      return [...acc, item.name];
    }
    return acc;
  }, []), [workspaceState]);
};

const useLhrsInfo = (): LHRSInfo => {
  const { workspaceState, formState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name, workspaceState?.document?.document.documentType.id);
  const sequences = useLhrsSequences(workspaceState);
  const formRejectedCount = useCurrentFormValue<number>(LHRS_REJECTED_QUANTITY);
  const formAcceptedCount = useCurrentFormValue<number>(LHRS_ACCEPTED_QUANTITY);

  const formValues = sequences?.reduce<LHRSStepSerialNumbersFormValues>((acc, sequence) => {
    const value = (
      FBDataStore.refreshData?.formInput?.[sequence] ?? formState?.newValues.get(sequence) ?? formState?.values[sequence]
    ) as LHRSStepSerialNumbersFormValue | undefined;
    if (isLHRSStepSerialNumbersFormValue(value)) {
      acc[sequence] = value;
    }
    return acc;
  }, {});

  const {
    rejectedCount,
    acceptedCount,
  } = useMemo(
    () => calculateLhrsQuantities(formValues ?? {}, sequences ?? []),
    [formValues, sequences],
  );

  const isSynced = useMemo(() => {
    const rejectedQuantity = formRejectedCount ?? 0;
    const acceptedQuantity = formAcceptedCount ?? 0;
    return rejectedCount === rejectedQuantity && acceptedCount === acceptedQuantity;
  }, [formRejectedCount, formAcceptedCount, rejectedCount, acceptedCount]);

  return useMemo(() => ({
    stepIndex,
    isSynced,
    rejectedCount,
    acceptedCount,
  }), [acceptedCount, isSynced, rejectedCount, stepIndex]);
};

const useLhrsSequenceInfo = (name: string): LHRSSequenceInfo => {
  const { workspaceState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name, workspaceState?.document?.document.documentType.id);
  const sequence = workspaceState?.schema?.find((item) => item.name === name);
  const sequenceIndex = sequence?.stepIndex;

  return useMemo(() => ({
    step: stepIndex,
    sequence: sequenceIndex,
  }), [sequenceIndex, stepIndex]);
};

export const useLHRSSerialNumbers = (
  name: string,
  shouldDisableInSubsequentSteps = false,
): LHRSSerialNumbers => {
  const { serialsState, formState, workspaceState } = FB.useStores();
  const isRnD = useObserver(() => workspaceState?.isLHRRnDBuild ?? false);
  const formValues = useObserver(() => formState?.values ?? {});
  const sequences = useLhrsSequences(workspaceState);
  const value = useCurrentFormValue<LHRSStepSerialNumbersFormValue>(name);
  const affectedSerialNumbers = useMemo(() => value?.serialsNumbers ?? {}, [value]);
  const lhrsInfo = useLhrsInfo();
  const lhrsSequenceInfo = useLhrsSequenceInfo(name);
  const { sequence, step } = lhrsSequenceInfo;
  const { isSynced } = lhrsInfo;

  useEffect(() => {
    serialsState?.load();
  }, [serialsState]);

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
      const existingSerial = affectedSerialNumbers[serial.id];

      const stepDiff = (serial.meta?.updatedIn?.step ?? 0) - (step ?? 0);
      const sequenceDiff = (serial.meta?.updatedIn?.sequence ?? 0) - (sequence ?? 0);

      const isRejected = serial.status === SerialNumberStatus.REJECTED;
      const isUpdatedInSubsequent = stepDiff > 0 || (stepDiff === 0 && sequenceDiff > 0);
      const isUpdatedInCurrent = stepDiff === 0 && sequenceDiff === 0;
      const canUseForRnD = isRnD && serial.usage === SerialNumberUsage.RND;

      const isDisabled = shouldDisableInSubsequentSteps
        ? isRejected && !canUseForRnD && !isUpdatedInCurrent
        : isRejected && !canUseForRnD && isUpdatedInSubsequent;

      const shoupShow = !isRejected || canUseForRnD || isUpdatedInSubsequent || existingSerial;
      if (!shoupShow) {
        return acc;
      }

      return [...acc, {
        ...serial,
        status: existingSerial?.status ?? null,
        usage: existingSerial?.usage ?? null,
        notes: existingSerial?.notes ?? null,
        isDisabled,
      }];
    }, []);
  }, [allSerialNumbers, affectedSerialNumbers, isRnD, sequence, step, shouldDisableInSubsequentSteps]);

  const buildLhrsStepFormValue = useCallback((payload: SerialNumberUpdatePayload[]) => {
    const currentValue = value;
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

    return {
      ...currentValue,
      serialsNumbers: {
        ...currentAffectedSerialNumbers,
        ...updatedSerialNumbers,
      },
    };
  }, [value]);

  const updateSerialNumbers = useCallback(async (payload: SerialNumberUpdatePayload[]) => {
    const previousValue = value;
    const updatedValue = buildLhrsStepFormValue(payload);
    formState?.setFieldValue(name, updatedValue);

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

      if (isSynced) {
        const updatedFormValues = {
          ...formValues,
          [name]: updatedValue,
        };

        const {
          rejectedCount,
          acceptedCount,
        } = calculateLhrsQuantities(updatedFormValues, sequences);

        formState?.setFieldValue(LHRS_REJECTED_QUANTITY, rejectedCount);
        formState?.setFieldValue(LHRS_ACCEPTED_QUANTITY, acceptedCount);
      }

      formState?.setFieldAutosave(name);
    } catch (error) {
      formState?.setFieldValue(name, previousValue);
      throw error;
    }
  }, [
    formState,
    value,
    formValues,
    buildLhrsStepFormValue,
    name,
    sequence,
    serialsState,
    step,
    sequences,
    isSynced,
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
