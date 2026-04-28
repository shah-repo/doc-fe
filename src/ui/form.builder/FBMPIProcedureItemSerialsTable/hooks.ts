import { useObserver } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { FB, FBLHRBuildOptions } from '..';
import { SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { useFormValue } from '../../hooks/useFormValue';
import { useLhrsTitle } from '../../hooks/useLhrsTitle';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';
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
  const { workspaceState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name ?? '', workspaceState?.document?.document.documentType.id ?? '');

  const sequences = useObserver(
    () => workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure').sort((a, b) => (a.stepIndex ?? 0) - (b.stepIndex ?? 0)),
  );

  const { rejectedSerials, acceptedSerials } = useMemo(
    () => {
      const defaultResult = { rejectedSerials: new Set<string>(), acceptedSerials: new Set<string>() };
      if (!sequences) { return defaultResult; }
      return sequences.reduce((acc, item) => {
        return acc;
      }, defaultResult);
    },
    [sequences],
  );

  return {
    stepIndex,
    isSynced: false,
    rejectedCount: rejectedSerials.size,
    acceptedCount: acceptedSerials.size,
  };
};

const useLhrsSequenceInfo = (name: string): LHRSSequenceInfo => {
  const { workspaceState } = FB.useStores();
  const { stepIndex } = useLhrsTitle(workspaceState?.document?.name ?? '', workspaceState?.document?.document.documentType.id ?? '');
  const sequence = workspaceState?.schema?.find((item) => item.name === name);
  return {
    step: stepIndex,
    sequence: sequence?.stepIndex,
  };
};

export const useLHRSSerialNumbers = (name: string): LHRSSerialNumbers => {
  const { serialsState, formState } = FB.useStores();

  useEffect(() => {
    serialsState?.load();
  }, [serialsState]);

  const isRnD = useIsRnD();
  const value = useFormValue<LHRSStepSerialNumbersFormValue | undefined>(name);
  const affectedSerialNumbers = useMemo(() => value?.serialsNumbers ?? {}, [value]);
  const lhrsInfo = useLhrsInfo();
  const lhrsSequenceInfo = useLhrsSequenceInfo(name);

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
        = (serial.meta?.updatedIn?.step ?? 0) > (lhrsSequenceInfo?.step ?? 0)
        || (serial.meta?.updatedIn?.sequence ?? 0) > (lhrsSequenceInfo?.sequence ?? 0);
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
        isDisabled: isRejected && isUpdatedInNextSteps,
      }];
    }, []);
  }, [allSerialNumbers, affectedSerialNumbers, isRnD, lhrsSequenceInfo]);

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, {
      ...data,
      meta: {
        updatedIn: lhrsSequenceInfo,
      },
    });

    formState?.setFieldValue(name, {
      ...value,
      serialsNumbers: {
        ...affectedSerialNumbers,
        [id]: {
          status: data.status,
          usage: data.usage,
          notes: data.notes,
        },
      },
    });

    formState?.setFieldAutosave(name);
  };

  const updateSerialNumbers = async (payload: SerialNumberUpdatePayload[]) => {
    await serialsState?.updateSerialNumbers(payload.map((item) => ({
      ...item,
      meta: {
        updatedIn: lhrsSequenceInfo,
      },
    })));

    const updatedSerialNumbers = payload.reduce((acc, item) => {
      acc[item.id] = {
        status: item.status,
        usage: item.usage,
        notes: item.notes,
      };
      return acc;
    }, {});

    formState?.setFieldValue(name, {
      ...value,
      serialsNumbers: {
        ...affectedSerialNumbers,
        ...updatedSerialNumbers,
      },
    });

    formState?.setFieldAutosave(name);
  };

  return {
    isRnD,
    isLoading,
    shouldShowSerials,
    stepSerialNumbers,
    allSerialNumbers,
    lhrsInfo,
    lhrsSequenceInfo,
    updateSerialNumber,
    updateSerialNumbers,
  };
};
