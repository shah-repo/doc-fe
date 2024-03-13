import { differenceBy, isNumber, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '../../form.builder/helpers';
import { DEFAULT_CURRENCY } from './constants';
import { Trainee, TrainingListTableProps } from './types';
import { useOptions } from './utils';

const prepareData = (list: Trainee[] = []) => orderBy(list, 'primary', 'desc');

export const withTrainingListTable = <T extends TrainingListTableProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [trainees, setTrainees] = useState<Trainee[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));
    const { statuses } = useOptions(trainees.map(v => v.trainee));

    const updateState = (state: Trainee[]) => {
      setTrainees(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const prepareTrainee = (trainee: Trainee): Trainee => ({
      ...trainee,
      cost: trainee.cost?.value ? {
        ...trainee.cost,
        currency: DEFAULT_CURRENCY,
      } : undefined,
      leadTime: isNumber(trainee.leadTime) ? trainee.leadTime : undefined,
      conversion: isNumber(trainee.conversion) ? trainee.conversion : undefined,
      trainee: {
        name: trainee.trainee.name,
        id: trainee.trainee.id,
      },
    });

    const deleteTrainee = (item: Trainee) => {
      const updatedTrainees = differenceBy(trainees, [item], 'id');
      updateState(updatedTrainees);
    };

    const updateTrainee = (item: Trainee) => {
      const newTrainees = unionBy([prepareTrainee(item)], trainees, 'id');
      const updatedTrainees = item.primary ? updatePrimaryTrainee(item.id, newTrainees) : newTrainees;
      updateState(updatedTrainees);
    };

    const updatePrimaryTrainee = (id: string, trainees: Trainee[]) => trainees.map(item => ({
      ...item,
      primary: item.id === id,
    }));

    const setPrimaryTrainee = (id: string) => {
      const updatedTrainees = updatePrimaryTrainee(id, trainees);
      updateState(updatedTrainees);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      trainees,
      statuses,
      updateTrainee,
      deleteTrainee,
      setPrimaryTrainee,
    });
  };

  return (props: T) => Comp(props);
};
