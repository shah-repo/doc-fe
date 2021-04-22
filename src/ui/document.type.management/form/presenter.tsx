import { Box, Button, Grid, InputLabel, TextareaAutosize } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentType, DOC_TYPE_GROUP, REVISION_STAGE_OPTIONS } from "../../../state/ducks/documentRevisions/documentType/types";
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
  disabled: boolean;
}

const DocumentTypeFormPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  handleTransition,
  transitionLabel,
  disabled,
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
          <InputLabel className={classes.label} disabled={props.disabled}>
            {intl.formatMessage({ id: props.label })}</InputLabel>
          <TextareaAutosize
            rows={5}
            disabled={props.disabled}
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
          label="common.document.type.name"
          inputProps={{ id: "documentTypeName", disabled }}
        />
        <InputField
          name="documentTypeAcronym"
          label="common.document.type.acronym"
          inputProps={{ id: "documentTypeAcronym", disabled }}
        />
        <Grid item xs={12} className={classes.gridWrapper}>
          <CheckboxField
            name="privateNumberPool"
            label="common.private.number.pool"
            checkboxProps={{ disabled }}
          />
          <CheckboxField
            name="canRedLine"
            label="common.redline"
            checkboxProps={{ disabled }}
          />
          <CheckboxField
            name="isQms"
            label="common.qms"
            checkboxProps={{ disabled }}
          />
          <CheckboxField
            name="needsSignature"
            label="form.builder.needsSignature"
            checkboxProps={{ disabled }}
          />
          <CheckboxField
            name="defaultTraining"
            label="common.default.training"
            checkboxProps={{ disabled }}
          />
        </Grid>
        <InputField
          name="startingNumber"
          label="common.starting.number"
          inputProps={{ id: "startingNumber", type: "number", disabled }}
        />
        <AutocompleteField
          name="defaultRevStage"
          label="common.default.rev.stage"
          autocompleteProps={{ id: "defaultRevStage" }}
          options={translatedOptions(intl, REVISION_STAGE_OPTIONS)}
          isDisabled={disabled}
        />
        <AutocompleteField
          name="hiddenForCreationForUsersWithoutTags"
          label= "common.hidden.message"
          autocompleteProps={{ id: "hiddenForCreationForUsersWithoutTags", isMulti: true }}
          options={enumToOptions(GroupTag)}
          isDisabled={disabled}
        />
        <AutocompleteField
          name="group"
          label="common.group"
          autocompleteProps={{ id: "group" }}
          options={enumToOptions(DOC_TYPE_GROUP)}
          isDisabled={disabled}
        />
        <InputField
          name="category"
          label="form.builder.category"
          inputProps={{ id: "category", disabled }}
        />
        {autoSizerRenderer({ label: "common.schema", name: "schema", disabled })}
        {autoSizerRenderer({ label: "common.fields.config", name: "fieldsConfig", disabled })}
        <Box display="flex" justifyContent="flex-end" mt={6}>
          <Button type="submit" variant="outlined" {...{ disabled }} >
            <Text translation="common.save" />
          </Button>
          <Button onClick={handleTransition} variant="outlined" {...{ disabled }}>
            <Text translation={transitionLabel} />
          </Button>
        </Box>
      </FormWrapper>
    </Grid>

  ); };

export default DocumentTypeFormPresenter;
