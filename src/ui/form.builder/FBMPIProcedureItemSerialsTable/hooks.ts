import { useObserver } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { FB, FBLHRBuildOptions } from '..';
import { SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { useFormValue } from '../../hooks/useFormValue';
import { useLhrsTitle } from '../../hooks/useLhrsTitle';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload, SerialNumberUsage } from '../FBSerials/types';
import { LHRSSerialNumbers, LHRSStepSerialNumbersFormValue } from './types';

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

const useLhrsInfo = (name: string) => {
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
  const lhrsInfo = useLhrsInfo(name);

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
      const isUpdatedInNextSteps = (serial.meta?.updatedIn?.step ?? 0) > (lhrsInfo?.step ?? 0) || (serial.meta?.updatedIn?.sequence ?? 0) > (lhrsInfo?.sequence ?? 0);
      const canUseForRnD = isRnD && serial.usage === SerialNumberUsage.RND;

      const shoupShow = !isRejected || canUseForRnD || isUpdatedInNextSteps || (serial.id in affectedSerialNumbers);
      if (!shoupShow) {
        return acc;
      }
      return [...acc, {
        ...serial,
        status: affectedSerialNumbers[serial.id]?.status ?? null,
        usage: affectedSerialNumbers[serial.id]?.usage ?? null,
        notes: affectedSerialNumbers[serial.id]?.notes ?? null,
        isDisabled: isRejected && isUpdatedInNextSteps,
      }];
    }, []);
  }, [allSerialNumbers, affectedSerialNumbers, isRnD, lhrsInfo]);

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, {
      ...data,
      meta: {
        updatedIn: lhrsInfo,
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
        updatedIn: lhrsInfo,
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
    updateSerialNumber,
    updateSerialNumbers,
  };
};
