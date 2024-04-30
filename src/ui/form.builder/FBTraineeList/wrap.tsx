import { differenceBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FB } from '../helpers';
import { DocumentOption, Trainee, TraineeListProps } from './types';

export const withTraineeList = <T extends TraineeListProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [trainees, setTrainees] = useState<Trainee[]>(workspaceState?.formInputSync.get(name) ?? []);

    const updateState = (state: Trainee[]) => {
      setTrainees(state);
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    // @todo
    const prepareTrainee = (trainee: Trainee): Trainee => ({
      ...trainee,
    });

    const deleteTrainee = (item: Trainee) => {
      const updatedTrainees = differenceBy(trainees, [item], 'id');
      updateState(updatedTrainees);
    };

    const updateTrainee = (item: Trainee) => {
      const updatedTrainees = unionBy([prepareTrainee(item)], trainees, 'id');
      updateState(updatedTrainees);
    };

    const documentOptionsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.trainingDocuments,
    });

    useEffect(() => {
      documentOptionsAsync.load();
    }, [documentOptionsAsync]);

    const documentOptions = useObserver(
      () => {
        const asyncData = FBAutocompleteAsyncStore.data.get(
          FBAutocompleteAsyncOption.trainingDocuments,
        ) as Map<string, DocumentOption[]>;
        return asyncData ? Array.from(asyncData.values()) : [];
      },
    );

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      trainees,
      documentOptions,
      documentOptionsAsync,
      updateTrainee,
      deleteTrainee,
    });
  };

  return (props: T) => Comp(props);
};
