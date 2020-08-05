import { Box, Chip, IconButton, TextField, Typography } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import React from "react";
import { FB, FBAutocompleteProps, FBInput, FBMapWrapper } from "..";
import { ApprovalStatus } from "../../../state/ducks/documents";
import Text from "../../components/Text";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  multiple = false,
  options = [],
  getOptionLabel,
  defaultValue,
  includeQRScan,
  optionLabelKey = "",
  placeholder,
  disabled,
  refresh,
  getOptionDisabled,
  loading,
  freeSolo = false,
  filterSelectedOptions = false,
  ...props
}) => {
  const { workspaceState } = FB.useStores();
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
            options,
            multiple,
            getOptionLabel,
            defaultValue,
            getOptionDisabled,
            freeSolo,
            filterSelectedOptions,
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
                  data-cy={props.name}
                  inputProps={{
                    ...params.inputProps,
                    style: { padding: "10.5px 0" },
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
                  (e.approver.id === _.get(option, "id")) && e.status === ApprovalStatus.Approved ) ? true : false;
                return (
                  <Chip
                    key={`fb-autocomplete-${_.get(option, optionLabelKey)}-${index}`}
                    label={<Box whiteSpace="normal">{_.get(option, optionLabelKey)}</Box>}
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
