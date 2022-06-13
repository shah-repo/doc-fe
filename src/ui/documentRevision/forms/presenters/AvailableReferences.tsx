/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, CircularProgress, createStyles, makeStyles, TextField, Typography } from "@material-ui/core";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import { debounce, map, some } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { SM } from "../../../../App";
import { TypographyProps } from "../../../../state/ducks/common/types";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { DocRevQueryParam, DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionsByIdState, DocumentRevisionStatus, Reference } from "../../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../../state/types";
import Field, { FieldOwnProps } from "../../../components/forms/fields/Field";
import { useFormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import { styles as FBAutoCompleteStyles } from "../../../form.builder/styles/FBAutocomplete.styles";
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

const styles = makeStyles(() =>
  createStyles({
    component: {
      "& .MuiInputBase-root": {
        padding: 2,
      },
    },
  }),
);

const AvailableReferences: React.FunctionComponent<AvailableReferencesPropsWithFormik> = ({
  availableReferences,
  disabled = false,
  documentReferences,
  documentGroupOptions,
  ...fieldProps
}) => {
  const intl = useIntl();
  const { submitForm } = useFormContext();
  const { _documentRevisionFormState } = SM.useStores();
  const [value, setValue] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const classes = styles();
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
    if (!_documentRevisionFormState) { return; }
    _documentRevisionFormState.referenceValue = map(value, (obj) => ({ id: obj.value }));
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
    if (!_documentRevisionFormState) { return; }
    _documentRevisionFormState.referenceValue = map(value, (obj) => ({ id: obj.value }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentReferences]);

  const [ModifiedOptions, setModifiedOptions] = useState(options);
  const [offset, setOffset] = React.useState(0);
  const limit = 25;
  const queryParams: DocRevQueryParam = {
    offset,
    limit,
    searchText: null,
    fields: "name,document.docId",
    status: [DocumentRevisionStatus.Released, DocumentRevisionStatus.PendingChange],
  };

  useEffect(() => {
    if (loadAsyncState.status === AsyncStatus.Success) {
      filterOptions();
    }
  }, [loadAsyncState]);

  const filterOptions = () => {
    if (inputValue) {
      const updatedOptions = options.filter(
        (o) => o.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setModifiedOptions(updatedOptions);
    } else {
      setModifiedOptions(options);
    }
  };

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
    if (inputVal && inputVal.length > 2) {
      setInputValue(inputVal);
      setOffset(0);
      queryApi(0, inputVal);
    } else if (!inputVal) {
      setInputValue(inputVal);
      setOffset(0);
      queryApi(0);
    }
  };

  const debounceFunction = debounce(onInputChange, 1000);

  const onScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      Math.ceil(listboxNode.scrollHeight - listboxNode.scrollTop) ===
      listboxNode.clientHeight
    ) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      queryApi(nextOffset, inputValue);
    }
  };

  const queryApi = (offset: number, searchText?: string) => {
    queryParams.offset = offset;
    queryParams.searchText = searchText || null;
    loadAction([], queryParams);
  };

  const onOpen = () => {
    setOpen(true);
    setOffset(0);
    queryApi(0);
  };

  return (
    <Field {...fieldProps} label={undefined}>
      <>
        <Typography variant="h5" style={FBAutoCompleteStyles.labelProps}>
          <Text message={fieldProps.label} />
        </Typography>
      </>
      <Autocomplete
        {...{ onChange, disabled }}
        className={classes.component}
        value={value}
        options={ModifiedOptions}
        // disable filtering on client
        filterOptions={(x) => x}
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="referenceTo">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder={intl.formatMessage({ id: "common.select.placeholder" })}
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
                  style: { padding: "10.5px 10px", fontSize: "14px" },
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
              style={{ minHeight: "32px" }}
              disabled={option.deleteDisabled}
            />
          ))
        )}
        onInputChange={debounceFunction}
        multiple
        disableClearable
        ListboxProps={{ onScroll }}
        open={open}
        onOpen={onOpen}
        onClose={() => {
          setOpen(false);
        }}
        loading={loading}
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
