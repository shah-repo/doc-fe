import { differenceBy, orderBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FB } from '../helpers';
import { DocumentRevisionOption, Trainee, TrainingListTableProps } from './types';
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
      trainee: {
        name: trainee.name,
        id: trainee.id,
      },
    });

    const deleteTrainee = (item: Trainee) => {
      const updatedTrainees = differenceBy(trainees, [item], 'id');
      updateState(updatedTrainees);
    };

    const updateTrainee = (item: Trainee) => {
      const newTrainees = unionBy([prepareTrainee(item)], trainees, 'id');
      const updatedTrainees = item.name ? updatePrimaryTrainee(item.id, newTrainees) : newTrainees;
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

    const recordsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.records,
    });

    useEffect(() => {
      recordsAsync.load();
    }, [recordsAsync]);

    const records = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.records) as Map<string, DocumentRevisionOption[]>;
        return asyncData ? Array.from(asyncData.values()) : [];
      },
    );

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      trainees,
      statuses,
      records,
      updateTrainee,
      deleteTrainee,
      setPrimaryTrainee,
    });
  };

  return (props: T) => Comp(props);
};
