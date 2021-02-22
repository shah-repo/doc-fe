import { Box, Chip, TextField, Typography } from "@material-ui/core";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import { map, some } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TypographyProps } from "../../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionsByIdState, documentRevisionsSelectors, Reference } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType";
import Field, { FieldOwnProps } from "../../../components/forms/fields/Field";
import Text from "../../../components/Text";
import { FB } from "../../../form.builder";
import { checkCanTypeCreateInspection, checkIsDocumentPart, checkIsTypeFaiInspection } from "../../helpers/checkDocumentGroup";
import { getHighestReleasedRevision } from "../transform";

interface AvailableReferencesProps extends FieldOwnProps {
  disabled?: boolean;
  availableReferences: {label: string; value: string; deleteDisabled?: boolean }[];
  documentReferences: Reference[];
  documentGroupOptions?: DocumentGroupOptionsType[];
}

type AvailableReferencesPropsWithFormik = AvailableReferencesProps &
FormikFieldProps &
Partial<TypographyProps>;

const getReferenceValues = (documentRevisions: DocumentRevision[], docRevsById: DocumentRevisionsByIdState) => {
  const highestRev = getHighestReleasedRevision(documentRevisions);
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
  const { workspaceState } = FB.useStores();
  const [value, setValue] = useState<any[]>([]);
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

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={0.3}>
        <Typography variant="h5">
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Autocomplete
        {...{ onChange, options, disabled }}
        value={value}
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="referenceTo">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
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
        multiple
        disableClearable
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
