import { Box, createStyles, makeStyles, Typography } from "@material-ui/core";
// import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import { debounce, map, some } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select, { components, createFilter } from "react-select";
import { SM } from "../../../../App";
import { ReactComponent as ArrowDownIcon } from "../../../../assets/images/arrow_down.svg";
import { TypographyProps } from "../../../../state/ducks/common/types";
import { documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, DocumentRevisionsByIdState, Reference } from "../../../../state/ducks/documentRevisions/types";
import Field, { FieldOwnProps } from "../../../components/forms/fields/Field.new";
import { useFormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
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

interface HandleChangeContextProps {
  itemToRemove: (value: any) => void;
}

const styles = makeStyles(() =>
  createStyles({
    label: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.almost_black,
    },
    customTextField: {
      "& input::placeholder": {
        fontFamily: "Sora",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        color: Colors.font_gray,
      },
    },
    autocompleteRootEle: {
      "&.MuiAutocomplete-root": {
        maxHeight: "40px",
      },
    },
  }));

export let HandleChangeContext = React.createContext<HandleChangeContextProps | undefined>(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  { itemToRemove: () => {} },
);

const AvailableReferences: React.FunctionComponent<AvailableReferencesPropsWithFormik> = ({
  availableReferences,
  disabled = false,
  documentReferences,
  documentGroupOptions,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();
  const { _documentRevisionFormState } = SM.useStores();
  const [value, setValue] = useState<any[]>([]);
  const classes = styles();
  let itemsRemove = false;
  const initialElements = { value: "", text: "", label: "" };
  const [accessElement, saveAccessElement] = React.useState(initialElements);
  const isGroup = some(documentReferences, {
    label: accessElement.label, text: accessElement.text, value: accessElement.value,
  });
  const onChange = (value) => {
    const {
      form: { setFieldValue, setFieldTouched, touched },
      field: { name },
    } = fieldProps;
    if (!touched[name]) {
      setFieldTouched(name, true);
    }
    let newValue = value;
    if (!itemsRemove) {
      newValue = options.filter((el) => el.value === value.value);
      if (_documentRevisionFormState) {
        newValue = [
          ...newValue,
          ...options.filter(
            (el) =>
              _documentRevisionFormState.referenceValue.filter(
                (ref) => ref.id === el.value
              ).length
          ),
        ];
      }
      itemsRemove = false;
      saveAccessElement(initialElements);
    }
    setFieldValue(name, newValue);
    setValue(newValue);
    if (!_documentRevisionFormState) { return; }
    _documentRevisionFormState.referenceValue = map(newValue, (obj) => ({ id: obj.value }));
    submitForm();
  };

  const itemToRemove = (item) => {
    const procesedData = value.filter((e) => e.value !== item.id);
    itemsRemove = true;
    onChange(procesedData);
  };

  HandleChangeContext = React.createContext<HandleChangeContextProps | undefined>({
    itemToRemove,
  });

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
    ? availableReferences
      .filter((ref) => !ref.deleteDisabled && !documentReferences.find((docRef) => docRef.id === ref.value))
      .map((el) => ({
        value: el.value,
        text: el.label,
        label: el.label,
      }))
    : availableReferences
      .filter((ref) => !ref.deleteDisabled && !documentReferences.find((docRef) => docRef.id === ref.value))
      .map((el) => ({
        value: el.value,
        text: el.label,
        label: el.label,
      }));

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

  const filterOptions = (inputVal) => {
    const updatedOptions = options.filter(
      (o) => o.label.toLowerCase().includes(inputVal.toLowerCase())
    );
    setModifiedOptions(updatedOptions);
  };
  const debounceFunction = debounce(filterOptions, 1000);

  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <ArrowDownIcon />
    </components.DropdownIndicator>
  );

  return (
    <Field {...fieldProps} label={undefined}>
      <Box mb={1.25}>
        <Typography variant="h5" className={classes.label}>
          <Text message={fieldProps.label} />
        </Typography>
      </Box>
      <Select
        filterOption={createFilter({ ignoreAccents: false })}
        options={ModifiedOptions}
        onInputChange={debounceFunction}
        onChange={onChange}
        placeholder={<Text message="Select" />}
        components={{
          DropdownIndicator,
          IndicatorSeparator: () => null,
        }}
        value={
          accessElement.value === "" || isGroup
            ? null
            : accessElement
        }
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
