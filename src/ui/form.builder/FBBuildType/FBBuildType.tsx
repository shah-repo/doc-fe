import { isEmpty, isNull, isUndefined } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncProps, FBAutocompleteAsyncState, FBInput, FBLHRBuildOptions, FBWorkspaceModeOptions } from '..';
import { SMText } from '../../../App';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import Dialog from '../../components/dialogs';
import { Autocomplete } from '../../components/forms/fields-next';
import useDialog from '../../hooks/useDialog';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBFontStyle } from '../styles/FBFont.styles';

const FBBuildType: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  optionId,
  name,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = React.useState<undefined | LHRBuild>(undefined);
  const [defaultValue, setDefaultValue] = React.useState<undefined | LHRBuild>(undefined);
  const [prevValue, setPrevValue] = React.useState<undefined | LHRBuild>(undefined);
  const [options, setOptions] = React.useState<LHRBuild[]>([]);
  const lhrBuildDialog = useDialog();
  const { formState, workspaceState } = FB.useStores();

  const buildsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.buildType,
  });

  React.useEffect(() => {
    buildsAsync.load(true);
  }, [buildsAsync]);

  React.useEffect(() => {
    const dispose = reaction(
      (): LHRBuild[] => {
        const map = FBAutocompleteAsyncStore.data.get(
          FBAutocompleteAsyncOption.buildType,
        );
        return map ? Array.from(map.values()) : [];
      },
      (options) => {
        setOptions(options);
        const selectedId = formState?.getFieldValue(name);
        const value = options.find((opt) => opt.id === selectedId);
        setPrevValue(value);
        setDefaultValue(value);
      },
      { fireImmediately: true },
    );
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
      formState?.setFieldValue(name, selectedValue?.id);
      formState?.setFieldAutosave(name);
      setDefaultValue(selectedValue);
      workspaceState?.saveDocRev(formState?.getValues());
    } else {
      setDefaultValue(prevValue);
      forceRerender();
    }
    formState?.getInputState(name ?? '')?.setRender();
    setSelectedValue(undefined);
    lhrBuildDialog.close();
  };
  const [refresh, setRefresh] = React.useState(false);

  const forceRerender = () => {
    setRefresh((x) => !x);
  };
  const isDisabled = (defaultValue && defaultValue.internalType !== FBLHRBuildOptions.Production) || workspaceState?.mode !== FBWorkspaceModeOptions.FORM;
  const showError = !isDisabled && isUndefined(defaultValue);
  return (
    <>
      <FBInput
        {...props}
        {...{ defaultValue, showErrorMsg: isUndefined(defaultValue) }}
        type="autocomplete"
        name={name}
        disabled={isDisabled}
        labelProps={FBFontStyle.labelProps}
      >
        <Autocomplete
          key={refresh ? 'enable' : 'disable'}
          error={showError}
          blurOnSelect
          disableClearable
          options={options}
          onInputChange={onChange}
          onChange={onChange}
          data-cy={`${name}-field`}
          value={defaultValue ?? null}
          getOptionLabel={option => option.displayLabel}
        />
      </FBInput>
      <Dialog
        hideCloseButton
        title="form.builder.build.title"
        open={lhrBuildDialog?.isOpen ?? false}
        onCancel={() => onDialogActionClick?.('cancel')}
        onConfirm={() => onDialogActionClick?.('confirm')}
        cancelLabel="form.builder.cancel"
        confirmLabel="form.builder.lhr.build.switch"
      > <SMText
          label={{
            locale: 'form.builder.build.production.msg',
            values: {
              prod: (defaultValue)?.displayLabel ?? '',
              rd: selectedValue?.displayLabel ?? '',
            },
          }}
        />
      </Dialog>
    </>
  );
};

export default FBBuildType;
