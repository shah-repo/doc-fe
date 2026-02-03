import { isEmpty, isNull } from 'lodash';
import React from 'react';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBLHRBuildOptions } from '..';
import { DocumentStatus } from '../../../state/ducks/documents/types';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import useDialog from '../../hooks/useDialog';
import { FBBuildTypeState } from './FBBuildType.state';
import { FBBuildTypeProps } from './FBBuildType.types';

export const withFBBuildType = <T extends FBBuildTypeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    optionId,
    name,
    ...props
  }: T) => {
    const [selectedValue, setSelectedValue] = React.useState<undefined | LHRBuild>(undefined);
    const [defaultValue, setDefaultValue] = React.useState<undefined | LHRBuild>(undefined);
    const [prevValue, setPrevValue] = React.useState<undefined | LHRBuild>(undefined);
    const [options, setOptions] = React.useState<LHRBuild[]>([]);
    const [refresh, setRefresh] = React.useState(false);
    const lhrBuildDialog = useDialog();
    const approvalDialog = useDialog();
    const isDialogOpen = lhrBuildDialog.isOpen;
    const isApprovalDialogOpen = approvalDialog.isOpen;
    const { formState, workspaceState } = FB.useStores();
    const documentStatus = DocumentStatus.Draft;

    const buildsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.buildType,
    });

    React.useEffect(() => {
      buildsAsync.load(true);
    }, [buildsAsync]);

    React.useEffect(() => {
      const dispose = FBBuildTypeState.getBuildOptions((options) => {
        const activeOptions = options.filter(item => item.isActive);
        setOptions(activeOptions);
        const selectedId = formState?.getFieldValue(name);
        const value = options.find((opt) => opt.id === selectedId);
        setPrevValue(value);
        setDefaultValue(value);
      });
      return dispose;
    }, [name, formState]);

    const onChange = (event: React.ChangeEvent<{}>, inputValue: string) => {
      const lhrBuildType = options?.find(opt => opt.id === defaultValue?.id);
      const selectedLhrBuild = options?.find(value => value.displayLabel === inputValue);
      if (!isEmpty(selectedLhrBuild) && selectedLhrBuild?.internalType !== FBLHRBuildOptions.Production && lhrBuildType?.internalType === FBLHRBuildOptions.Production && !isNull(event)) {
        setSelectedValue(selectedLhrBuild);
        lhrBuildDialog.open();
      } else if (!isNull(event)) {
        formState?.setFieldValue(name, selectedLhrBuild?.id);
        formState?.setFieldAutosave(name);
        formState?.getInputState(name ?? '')?.setRender();
        setDefaultValue(selectedLhrBuild);
        setPrevValue(selectedLhrBuild);
        workspaceState?.saveDocRev(formState?.getValues());
      }
    };

    const onDialogActionClick = (action: 'cancel' | 'confirm') => {
      if (action === 'confirm') {
        // Close first dialog and open approval dialog
        lhrBuildDialog.close();
        approvalDialog.open();
      } else {
        setDefaultValue(prevValue);
        forceRerender();
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        lhrBuildDialog.close();
      }
    };

    const onApprovalDialogActionClick = (action: 'cancel' | 'confirm') => {
      if (action === 'confirm') {
        formState?.setFieldValue(name, selectedValue?.id);
        formState?.setFieldAutosave(name);
        setDefaultValue(selectedValue);
        workspaceState?.saveDocRev(formState?.getValues());
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        approvalDialog.close();
      } else {
        setDefaultValue(prevValue);
        forceRerender();
        formState?.getInputState(name ?? '')?.setRender();
        setSelectedValue(undefined);
        approvalDialog.close();
      }
    };

    const forceRerender = () => {
      setRefresh((x) => !x);
    };

    const approvalTransition = () => {
      // Placeholder for approval transition logic
    };

    const isDisabled = false;// (defaultValue && defaultValue.internalType !== FBLHRBuildOptions.Production) || workspaceState?.mode !== FBWorkspaceModeOptions.FORM;

    return Component({
      ...(props as T),
      selectedValue,
      defaultValue,
      prevValue,
      options,
      isDialogOpen,
      isApprovalDialogOpen,
      onChange,
      onDialogActionClick,
      onApprovalDialogActionClick,
      refresh,
      isDisabled,
      name,
      optionId,
      documentStatus,
      approvalTransition,
    });
  };

  Comp.displayName = 'withFBBuildType';
  return Comp;
};
