import { reaction } from 'mobx';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBBlankTplFormProps, FBWorkspaceModeOptions } from '..';
import { companySelectors } from '../../../state/ducks/company';


export const withFBBlankTplForm = <T extends FBBlankTplFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    disabled,
    readonly,
    name,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const redlineActive = useSelector(companySelectors.getRedlineActive);
    disabled = ![FBWorkspaceModeOptions.DESIGN, FBWorkspaceModeOptions.FORM]
      .includes(workspaceState?.mode as FBWorkspaceModeOptions) && !redlineActive;
    readonly = disabled;

    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get(name || '')?.value?.length,
        () => {
          workspaceState?.setSchemaItem({
            ...props,
            name,
            defaultValue: formState?.inputState.get(name || '')?.value,
          });
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      disabled,
      readonly,
      name,
    });
  };

  Comp.displayName = 'withFBBlankTplForm';
  return Comp;
};
