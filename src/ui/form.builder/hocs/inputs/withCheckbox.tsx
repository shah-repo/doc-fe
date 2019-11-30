import React from 'react';
import Text from '../../../components/Text';
import { withInput } from '../common/withInput';
import FormLabel from '@material-ui/core/FormLabel/FormLabel';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FBStore from '../../stores/ui/FBStore';
import { FBCheckboxProps } from '../../types/inputs/checkbox';

export const withCheckbox = <T extends FBCheckboxProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withInput(({ label, onChange, value, includeNote, ...props }: T) => {
    (label as string) &&
      (label = (
        <FormLabel>
          <Text message={label as string} />
        </FormLabel>
      ));
    const control = <Checkbox name={props.name} onChange={onChange} />;
    const showNote: boolean =
      (FBStore.mode === 'form' && (value as boolean) && includeNote) ||
      FBStore.mode === 'preview';

    return Component({
      ...(props as T),
      label,
      control,
      showNote,
    });
  });
};
