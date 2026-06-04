import { Box, IconButton, Popper, TextField, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { GetTagProps, RenderInputParams } from '@material-ui/lab/Autocomplete';
import { get, includes } from 'lodash';
import { Observer } from 'mobx-react';
import React, { memo, useCallback } from 'react';
import { FB, FBAutocompleteProps, FBInput } from '..';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { DOC_TYPE_GROUP, WO_PART_KEY_NAME } from '../../../state/ducks/documentRevisions/documentType/types';
import { ApprovalStatus } from '../../../state/ducks/documents/types';
import Text from '../../components/Text';
import ListBoxComponent from '../../components/common/autocomplete/ListBoxComponent';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBAutocomplete } from './FBAutocomplete.wrap';
import { StyledAutoComplete, StyledChip, StyledPopupAutoComplete } from './StyledAutoComplete';

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  onInputChange,
  onOpen,
  getOptionDisabled,
  getOptionLabel,
  getTagLabel,
  renderOption,
  filterOptions,
  debounceFilterInput,
  groupBy,
  refresh,
  filterSelectedOptions = false,
  disableClearable = false,
  freeSolo = false,
  multiple = false,
  options,
  modifiedOptions,
  defaultValue,
  includeQRScan,
  optionLabelKey = '',
  getOptionSelected,
  placeholder,
  disabled = false,
  loading,
  groupByKey,
  value,
  inputStyle = {},
  inputPropStyle = {},
  inputPropStyleSize = 'medium',
  disabledOptions = [],
  disableBackspace = false,
  disableChipDelete = false,
  type,
  name,
  customStyles,
  autoCompleteClasses,
  onBlur,
  showErrorMsg,
  isTypeLhrBuild = false,
  renderEndAdornment,
  isCustomEndAdornment = false,
  renderStartAdornment,
  isCustomStartAdornment = false,
  ...props
}) => {
  const { workspaceState, dialogState } = FB.useStores();
  disableClearable = isTypeLhrBuild || disableClearable;

  const renderRefreshButton = useCallback((refresh: () => void, disabled?: boolean) => (
    <Box ml={-4} display="flex" alignItems="center">
      <IconButton size="small" onClick={refresh} {...{ disabled }}>
        <CachedIcon fontSize="small" />
      </IconButton>
    </Box>
  ), []);

  const renderAutoCompleteInput = useCallback((params: RenderInputParams) => (
    <Box display="flex">
      <Box width="100%">
        <TextField
          {...params}
          {...!params.InputProps.startAdornment && { placeholder }}
          onChange={onInputChange}
          onBlur={onBlur}
          onKeyDown={(event: React.KeyboardEvent) => {
            const key = event.keyCode || event.charCode;
            if (key === 8 && disableBackspace) {
              event.stopPropagation();
            }
          }}
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {renderStartAdornment?.(value)}
                {!isCustomStartAdornment && params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {renderEndAdornment?.(value)}
                {!isCustomEndAdornment && params.InputProps.endAdornment}
              </>
            ),
            ...{ style: { ...customStyles } },
            ...(refresh) && { style: { paddingRight: '33px', ...inputPropStyle } },
            ...(disabled && type === 'lhrstep') && { endAdornment: null },
          }}
          inputProps={{
            ...params.inputProps,
            style: {
              padding: '10.5px 0',
              ...inputStyle,
              marginRight: customStyles
                ? '10px' : disabled ? '28px' : '0px',
              fontSize: 14,
            },
            'data-cy': name,
          }}
          size={inputPropStyleSize}
        />
      </Box>
      {(refresh && type !== 'lhrstep') && renderRefreshButton(refresh, disabled)}
      {(refresh && type === 'lhrstep' && !disabled) && renderRefreshButton(refresh, disabled)}
    </Box>
  ), [
    type,
    name,
    value,
    placeholder,
    disabled,
    disableBackspace,
    refresh,
    renderRefreshButton,
    customStyles,
    inputStyle,
    inputPropStyle,
    inputPropStyleSize,
    onInputChange,
    onBlur,
    renderEndAdornment,
    isCustomEndAdornment,
    renderStartAdornment,
    isCustomStartAdornment,
  ]);

  const renderAutoCompleteTags = (value: Array<{ id: string }>, getTagProps: GetTagProps) =>
    value.map((option, index) => {
      const isAlreadyApproved = !!workspaceState?.changeRequest?.approvals.find(
        (e) => (e.approver.id === get(option, 'id')) && e.status === ApprovalStatus.Approved,
      );
      const isOptionDisabled = disableChipDelete && disabledOptions.includes(option.id);
      const isDisabled = disabled || name === 'approvers' ? isAlreadyApproved : isOptionDisabled;
      const key = get(option, optionLabelKey) as string;

      return (
        <StyledChip
          {...getTagProps({ index })}
          key={`fb-autocomplete-${key}-${index}`}
          label={getTagLabel?.(option) ?? getOptionLabel?.(option)}
          disabled={isDisabled}
        />
      );
    });

  const isShowErrorMsg = () => {
    const documentTypeLabel = get(workspaceState?.document?.formTemplate?.outputDocumentTypes[0], 'label') as string | undefined;
    const documentTypeGroup = get(workspaceState?.document?.formTemplate?.outputDocumentTypes[0], 'group') as DOC_TYPE_GROUP | undefined;
    const outputDocumentType = documentTypeLabel ?? documentTypeGroup;
    const documentType = workspaceState?.document?.document?.documentType?.group;
    const isLHRT = documentType === DOC_TYPE_GROUP.LHRT && (outputDocumentType === DOC_TYPE_GROUP.LHR || outputDocumentType === 'Lot History Record');
    const isLHRStep = name === 'lhr-selected-part' || name === 'lhrstep-built-in';
    if (dialogState?.open && isLHRT && isLHRStep) {
      return false;
    }

    if (documentType === DOC_TYPE_GROUP.PART && !showErrorMsg) {
      return showErrorMsg;
    }

    if (name === WO_PART_KEY_NAME) {
      return false;
    }

    return true;
  };

  disabled = includes(['fb-approvers-approvers', 'form.builder.approvers'], name)
    && includes([ChangeRequestStatus.Approved, ChangeRequestStatus.Closed], workspaceState?.changeRequest?.state)
    ? true : disabled;

  return (
    <>
      {includeQRScan && (
        <Box display="flex" flexDirection="row-reverse" mb={-3} position="relative" zIndex={1}>
          <Typography variant="button" display="block" color="primary">
            <Text message="form.builder.scan.qr" />
          </Typography>
        </Box>
      )}
      <Observer>{() =>
        <FBInput
          {...props}
          name={name}
          {...{ multiple, defaultValue, loading, showErrorMsg: isShowErrorMsg() }}
          type="autocomplete"
          disabled={name === 'approvers' ? false : disabled}
          labelProps={FBFontStyle.labelProps}
        >
          {/* hack for autocomplete, options are rendered after component is already shown */}
          {customStyles ? <StyledPopupAutoComplete
            {...{
              getOptionDisabled,
              getOptionLabel,
              renderOption,
              groupBy,
              multiple,
              defaultValue,
              freeSolo,
              filterOptions,
              disableClearable,
            }}
            filterSelectedOptions
            getOptionSelected={getOptionSelected}
            classes={autoCompleteClasses}
            options={modifiedOptions}
            onInputChange={debounceFilterInput}
            onOpen={onOpen}
            ListboxComponent={groupByKey ? undefined : ListBoxComponent }
            renderInput={(params: RenderInputParams) => renderAutoCompleteInput(params)}
            renderTags={(value, getTagProps) => renderAutoCompleteTags(value, getTagProps)}
            blurOnSelect={freeSolo}
          /> : <StyledAutoComplete
            key={!options?.some((value: unknown) => typeof value === 'object') ? 'disabled' : 'enabled'}
            {...{
              getOptionDisabled,
              getOptionLabel,
              renderOption,
              groupBy,
              multiple,
              defaultValue,
              freeSolo,
              filterOptions,
              disableClearable,
            }}
            filterSelectedOptions
            getOptionSelected={getOptionSelected}
            classes={autoCompleteClasses}
            options={modifiedOptions}
            onInputChange={debounceFilterInput}
            onOpen={onOpen}
            ListboxComponent={groupByKey ? undefined : ListBoxComponent }
            renderInput={(params: RenderInputParams) => renderAutoCompleteInput(params)}
            renderTags={(value, getTagProps) => renderAutoCompleteTags(value, getTagProps)}
            PopperComponent={(props) => (<Popper {...props} />)}
            blurOnSelect={freeSolo}
          />}
        </FBInput>}
      </Observer>
    </>
  );
};

export default memo(withFBAutocomplete(FBAutocomplete));
