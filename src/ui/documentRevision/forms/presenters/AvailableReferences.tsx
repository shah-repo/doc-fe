/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, CircularProgress, TextField, Typography } from "@material-ui/core";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import { debounce, map, some } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { TypographyProps } from "../../../../state/ducks/common/types";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionsByIdState, Reference } from "../../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../../state/types";
import ListBoxComponent from "../../../components/common/autocomplete/ListBoxComponent";
import Field, { FieldOwnProps } from "../../../components/forms/fields/Field";
import { useFormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import { FB } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import { checkCanTypeCreateInspection, checkIsDocumentPart, checkIsTypeFaiInspection } from "../../helpers/checkDocumentGroup";
import { getHighestReleasedRevision, getHighestRevision } from "../transform";

interface AvailableReferencesProps extends FieldOwnProps {
  disabled?: boolean;
  availableReferences: {label: string; value: string; deleteDisabled?: boolean }[];
  documentReferences: Reference[];
  documentGroupOptions?: DocumentGroupOptionsType[];
}

type AvailableReferencesPropsWithFormik = AvailableReferencesProps &
FormikFieldProps &
Partial<TypographyProps>;

const getReferenceValues = (
  documentRevisions: DocumentRevision[],
  docRevsById: DocumentRevisionsByIdState) => {
  const highestRev = getHighestReleasedRevision(documentRevisions) || getHighestRevision(documentRevisions);
  const docType = docRevsById[highestRev?.id || ""]?.document?.documentType;
  const isReferencePart = checkIsDocumentPart(docType?.groupOptions);
  const canReferenceCreateInspection = checkCanTypeCreateInspection(docType?.groupOptions);
  return { highestRev, isReferencePart, canReferenceCreateInspection };
};

const AvailableReferences: React.FunctionComponent<AvailableReferencesPropsWithFormik> = ({
  availableReferences,
  disabled = false,
  documentReferences,
  documentGroupOptions,
  ...fieldProps
}) => {
  const intl = useIntl();
  const { submitForm } = useFormContext();
  const { workspaceState } = FB.useStores();
  const [value, setValue] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const loadAction =  useActionCreator(documentRevisionsActions.loadList);
  const loadAsyncState = useSelector(documentRevisionsSelectors.getLoadListAsyncState);
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);

  const onChange = (e, value) => {
    const {
      form: { setFieldValue, setFieldTouched, touched },
      field: { name },
    } = fieldProps;
    if (!touched[name]) {
      setFieldTouched(name, true);
    }
    setFieldValue(name, value);
    setValue(value);
    if (!workspaceState) { return; }
    workspaceState.referenceValue = map(value, (obj) => ({ id: obj.value }));
    submitForm();
  };

  const docRevsById = useSelector(documentRevisionsSelectors.byId);
  const isDocumentFai =
    checkIsTypeFaiInspection(documentGroupOptions);
  const canDocumentCreateInspection =
    checkCanTypeCreateInspection(documentGroupOptions);

  const options = some(documentReferences, (ref) => {
    if (!ref.documentRevisions) { return false; }
    const { isReferencePart, canReferenceCreateInspection } = getReferenceValues(ref.documentRevisions, docRevsById);

    return (isReferencePart && canDocumentCreateInspection) ||
        (canReferenceCreateInspection && isDocumentFai);
  })
    ? availableReferences.filter((ref) => !ref.deleteDisabled)
    : availableReferences;

  const defaultValue = (refs: Reference[] = []): any => refs?.map((ref) => {
    if (!ref.documentRevisions) { return { label: "", value: ref.id, deleteDisabled: false }; }
    const {
      highestRev,
      isReferencePart,
      canReferenceCreateInspection,
    } = getReferenceValues(ref.documentRevisions, docRevsById);

    return {
      label: `${ref.docId} - ${highestRev?.displayRevision} - ${highestRev?.name}`,
      value: ref.id,
      deleteDisabled: (isReferencePart && canDocumentCreateInspection) ||
        (canReferenceCreateInspection && isDocumentFai),
    };
  });


  useEffect(() => {
    const value = defaultValue(documentReferences);
    setValue(value);
    if (!workspaceState) { return; }
    workspaceState.referenceValue = map(value, (obj) => ({ id: obj.value }));
  }, [documentReferences]);

  const [ModifiedOptions, setModifiedOptions] = useState(options);

  useEffect(() => {
    if (loadAsyncState.status === "SUCCESS") {
      filterOptions(null, inputValue);
    }
  }, [loadAsyncState]);

  useEffect(() => {
    if (open) {
      loadAction();
    }
  }, [open]);

  const filterOptions = (event: any, inputVal: any) => {
    if (inputVal && inputVal.length > 2) {
      setInputValue(inputVal);
      const updatedOptions = options.filter(
        (o) => o.label.toLowerCase().includes(inputVal.toLowerCase())
      );
      setModifiedOptions(updatedOptions);
    } else if (!inputVal) {
      setInputValue(inputVal);
      setModifiedOptions(options);
    }
  };
  const debounceFunction = debounce(filterOptions, 1000);

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={0.3}>
        <Typography variant="h5">
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Autocomplete
        {...{ onChange, disabled }}
        value={value}
        options={ModifiedOptions}
        // disable filtering on client
        filterOptions={(x) => x}
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="referenceTo">
              <TextField
                placeholder={intl.formatMessage({
                  id: "common.search.label",
                })}
                {...params}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      { open && loading && (
                        <CircularProgress color="inherit" size={16} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { padding: "10.5px 0" },
                }}
              />
            </Box>
          </Box>
        )}
        renderOption={(option) => option.label}
        renderTags={(value, getTagProps) => (
          value?.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              style={{ minHeight: "32px", height: "auto" }}
              disabled={option.deleteDisabled}
            />
          ))
        )}
        onInputChange={debounceFunction}
        multiple
        disableClearable
        ListboxComponent={ListBoxComponent}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        loading={ !options.length && loading }
      />
    </Field>
  ); };

type AvailableReferencesFieldProps = AvailableReferencesProps &
FieldConfig &
Partial<TypographyProps>;

const AvailableReferencesField: React.FunctionComponent<
AvailableReferencesFieldProps
> = (props) => <FormikField component={AvailableReferences} {...props} />;

export default AvailableReferencesField;
