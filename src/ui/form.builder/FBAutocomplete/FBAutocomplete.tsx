import { Box, IconButton, Popper, TextField, Typography } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { get } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteProps, FBInput, FBMapWrapper } from "..";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { ApprovalStatus } from "../../../state/ducks/documents/types";
import ListBoxComponent from "../../components/common/autocomplete/ListBoxComponent";
import Text from "../../components/Text";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";
import { StyledAutoComplete, StyledChip, StyledPopupAutoComplete } from "./StyledAutoComplete";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  onInputChange,
  getOptionDisabled,
  getOptionLabel,
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
  optionLabelKey = "",
  placeholder,
  disabled,
  loading,
  groupByKey,
  value,
  inputStyle = {},
  inputPropStyle = {},
  inputPropStyleSize = "",
  disabledOptions = [],
  disableBackspace = false,
  disableChipDelete = false,
  type,
  customStyles,
  autoCompleteClasses,
  ...props
}) => {
  const { workspaceState, dialogState } = FB.useStores();
  const renderRefreshButton = (refresh, disabled) => (
    <Box ml={-4} display="flex" alignItems="center">
      <IconButton size="small" onClick={refresh} {...{ disabled }}>
        <CachedIcon fontSize="small" />
      </ IconButton>
    </Box>
  );

  const renderAutoCompleteInput = (params) => (<Box display="flex">
    <Box width="100%">
      <TextField
        {...params}
        {...!params.InputProps.startAdornment && { placeholder }}
        onChange={onInputChange}
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
          ...{ style: { ...customStyles } },
          ...(refresh) && { style: { paddingRight: "33px", ...inputPropStyle } },
          ...(disabled && type === "lhrstep") && { endAdornment: null },
        }}
        inputProps={{
          ...params.inputProps,
          "style": {
            padding: "10.5px 0", ...inputStyle, marginRight: customStyles ?
              "10px" : disabled  ? "28px" : "0px",
            fontSize: 14,
          },
          "data-cy": props.name,
        }}
        size={inputPropStyleSize}
      />
    </Box>
    {(refresh && type !== "lhrstep") && renderRefreshButton(refresh, disabled)}
    {(refresh && type === "lhrstep" && !disabled) && renderRefreshButton(refresh, disabled)}
  </Box>);

  const renderAutoCompleteTags = (value, getTagProps) => <FBMapWrapper<any[]> collection={value}>
    {(option, index) => {
      const isAlreadyApproved = workspaceState?.changeRequest?.approvals.find((e) =>
        (e.approver.id === get(option, "id")) && e.status === ApprovalStatus.Approved ) ? true : false;
      const isOptionDisabled = disableChipDelete && disabledOptions.includes(option.id);

      return (
        <StyledChip
          key={`fb-autocomplete-${get(option, optionLabelKey)}-${index}`}
          label={ <Box whiteSpace="normal" style={{ wordBreak: "break-word" }}>
            {getOptionLabel && getOptionLabel(option)} </Box> }
          style={{ minHeight: "32px", height: "auto" }}
          {...getTagProps({ index })}
          disabled={props.name === "approvers" ? isAlreadyApproved : isOptionDisabled || disabled}
        />
      ); }}
  </FBMapWrapper>;

  const isShowErrorMsg = () => {
    const outputDocumentType = get( workspaceState?.document?.formTemplate?.outputDocumentTypes[0], "label")
    || get( workspaceState?.document?.formTemplate?.outputDocumentTypes[0], "group");
    const documentType = workspaceState?.document?.document?.documentType?.group;
    if (dialogState?.open && documentType === DOC_TYPE_GROUP.LHRT &&
      (outputDocumentType === DOC_TYPE_GROUP.LHR || outputDocumentType === "Lot History Record")
    && (props.name === "lhr-selected-part" || props.name === "lhrstep-built-in")) {
      return false; }

    if (documentType === DOC_TYPE_GROUP.PART && !props.showErrorMsg) {
      return props.showErrorMsg;
    }
    return true;
  };

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
          {...{ multiple, defaultValue, loading, showErrorMsg: isShowErrorMsg() }}
          type="autocomplete"
          disabled={props.name === "approvers" ? false : disabled}
          labelProps={FBFontStyle.labelProps}
        >
          {/* hack for autocomplete, options are rendered after component is already shown */}
          {customStyles ? <StyledPopupAutoComplete
            {...{
              getOptionDisabled,
              getOptionLabel,
              renderOption,
              filterSelectedOptions,
              groupBy,
              multiple,
              defaultValue,
              freeSolo,
              filterOptions,
              disableClearable,
            }}
            classes={autoCompleteClasses}
            options={modifiedOptions}
            onInputChange={debounceFilterInput}
            ListboxComponent={groupByKey ? undefined : ListBoxComponent }
            renderInput={(params: RenderInputParams) => renderAutoCompleteInput(params)}
            renderTags={(value, getTagProps) => renderAutoCompleteTags(value, getTagProps)}
          /> : <StyledAutoComplete
            {...{
              getOptionDisabled,
              getOptionLabel,
              renderOption,
              filterSelectedOptions,
              groupBy,
              multiple,
              defaultValue,
              freeSolo,
              filterOptions,
              disableClearable,
            }}
            classes={autoCompleteClasses}
            options={modifiedOptions}
            onInputChange={debounceFilterInput}
            ListboxComponent={groupByKey ? undefined : ListBoxComponent }
            renderInput={(params: RenderInputParams) => renderAutoCompleteInput(params)}
            renderTags={(value, getTagProps) => renderAutoCompleteTags(value, getTagProps)}
            PopperComponent={(props) => (<Popper {...props} />)}
          />}
        </FBInput>}
      </Observer>
    </>
  );
};

export default withFBAutocomplete(FBAutocomplete);
