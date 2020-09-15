import { Box, Chip, IconButton, TextField, Typography } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import Autocomplete, { createFilterOptions, RenderInputParams } from "@material-ui/lab/Autocomplete";
import { get } from "lodash";
import React from "react";
import { FB, FBAutocompleteProps, FBInput, FBMapWrapper } from "..";
import { ApprovalStatus } from "../../../state/ducks/documents";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  getOptionDisabled,
  getOptionLabel,
  renderOption,
  groupBy,
  refresh,
  filterSelectedOptions = false,
  freeSolo = false,
  multiple = false,
  options,
  defaultValue,
  includeQRScan,
  optionLabelKey = "",
  placeholder,
  disabled,
  loading,
  ...props
}) => {

  const { workspaceState } = FB.useStores();
  const stringify = (option: OptionType) => (getOptionLabel && getOptionLabel(option)) || "";
  const filterOptions = createFilterOptions({ ignoreAccents: false, stringify });
  return (
    <>
      {includeQRScan && (
        <Box display="flex" flexDirection="row-reverse" mb={-3}>
          <Typography variant="button" display="block" color="primary">
            <Text message="form.builder.scan.qr" />
          </Typography>
        </Box>
      )}
      <FBInput
        {...props}
        {...{ multiple, defaultValue, loading }}
        type="autocomplete"
        disabled={props.name === "approvers" ? false : disabled}
      >
        <Autocomplete
          {...{
            getOptionDisabled,
            getOptionLabel,
            renderOption,
            filterSelectedOptions,
            groupBy,
            options,
            multiple,
            defaultValue,
            freeSolo,
            filterOptions,
          }}
          renderInput={(params: RenderInputParams) => (
            <Box display="flex">
              <Box width="100%">
                <TextField
                  {...params}
                  {...!params.InputProps.startAdornment && { placeholder }}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    ...(refresh) && { style: { paddingRight: "33px" } },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    "style": { padding: "10.5px 0" },
                    "data-cy": props.name,
                  }}
                />
              </Box>
              {refresh && !freeSolo && (
                <Box ml={-4} display="flex" alignItems="center">
                  <IconButton size="small" onClick={refresh} {...{ disabled }}>
                    <CachedIcon fontSize="small" />
                  </ IconButton>
                </Box>
              )}
            </Box>
          )}
          renderTags={(value, getTagProps) => (
            <FBMapWrapper<any[]> collection={value}>
              {(option, index) => {
                const isAlreadyApproved = workspaceState?.changeRequest?.approvals.find((e) =>
                  (e.approver.id === get(option, "id")) && e.status === ApprovalStatus.Approved ) ? true : false;
                return (
                  <Chip
                    key={`fb-autocomplete-${get(option, optionLabelKey)}-${index}`}
                    label={<Box whiteSpace="normal">{get(option, optionLabelKey)}</Box>}
                    style={{ minHeight: "32px", height: "auto" }}
                    {...getTagProps({ index })}
                    disabled={props.name === "approvers" ? isAlreadyApproved : disabled}
                  />
                ); }}
            </FBMapWrapper>
          )}
        />
      </FBInput>
    </>
  );
};

export default withFBAutocomplete(FBAutocomplete);
