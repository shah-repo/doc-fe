import { Box, Button, Grid, InputLabel, TextareaAutosize } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentType, DOC_TYPE_GROUP, REVISION_STAGE_OPTIONS } from "../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import CheckboxField from "../../components/forms/fields/Checkbox";
import InputField from "../../components/forms/fields/Input";
import FormWrapper from "../../components/forms/FormWrapper";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import { enumToOptions, translatedOptions } from "../transform";
import styles from "./styles";

interface Props extends FormikProps<DocumentType> {
  handleTransition: () => void;
  transitionLabel: Translation;
}

export const DocumentTypeFormPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  handleTransition,
  transitionLabel,
  ...props
}) => {
  const classes = styles();
  const intl = useIntl();

  const autoSizerRenderer = (props) =>
    <Field name={props.name}>
      {({
        field,
      }) => (
        <>
          <InputLabel className={classes.label}>{props.label}</InputLabel>
          <TextareaAutosize
            rows={5}
            className={classes.textautosizer}
            {...field}
          />
        </>
      )}
    </Field>;

  return (
    <Grid container className={classes.gridWrapper}>
      <FormWrapper
        dirty={dirty}
        resetForm={resetForm}
        initialValues={initialValues}
      >
        <InputField
          name="documentTypeName"
          label="Document Type Name"
          inputProps={{ id: "documentTypeName" }}
        />
        <InputField
          name="documentTypeAcronym"
          label="Document Type Acronym"
          inputProps={{ id: "documentTypeAcronym" }}
        />
        <Grid item xs={12} className={classes.gridWrapper}>
          <CheckboxField
            name="privateNumberPool"
            label="Private Number Pool"
          />
          <CheckboxField
            name="canRedLine"
            label="RedLine"
          />
          <CheckboxField
            name="isQms"
            label="Qms"
          />
          <CheckboxField
            name="needsSignature"
            label="QMS Document"
          />
          <CheckboxField
            name="defaultTraining"
            label="Default Training"
          />
        </Grid>
        <InputField
          name="startingNumber"
          label="Starting Number"
          inputProps={{ id: "startingNumber", type: "number" }}
        />
        <AutocompleteField
          name="defaultRevStage"
          label="Default Revision Stage"
          autocompleteProps={{ id: "defaultRevStage" }}
          options={translatedOptions(intl, REVISION_STAGE_OPTIONS)}
        />
        <AutocompleteField
          name="hiddenForCreationForUsersWithoutTags"
          label="Hidden For Creation For Users Without Tags"
          autocompleteProps={{ id: "hiddenForCreationForUsersWithoutTags", isMulti: true }}
          options={enumToOptions(GroupTag)}
        />
        <AutocompleteField
          name="group"
          label="Group"
          autocompleteProps={{ id: "group" }}
          options={enumToOptions(DOC_TYPE_GROUP)}
        />
        <InputField
          name="category"
          label="Category"
          inputProps={{ id: "category" }}
        />
        {autoSizerRenderer({ label: "Schema", name: "schema" })}
        {autoSizerRenderer({ label: "Fields Config", name: "fieldsConfig" })}
        <Box display="flex" justifyContent="flex-end" mt={6}>
          <Button type="submit" variant="outlined">
            <Text translation={"common.save"} />
          </Button>
          <Button onClick={handleTransition} variant="outlined">
            <Text translation={transitionLabel} />
          </Button>
        </Box>
      </FormWrapper>
    </Grid>

  ); };

export default DocumentTypeFormPresenter;
