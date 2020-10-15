import { Box, Button, Grid, InputLabel, TextareaAutosize } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentType, DOC_GROUP_TYPE } from "../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import CheckboxField from "../../components/forms/fields/Checkbox";
import InputField from "../../components/forms/fields/Input";
import FormWrapper from "../../components/forms/FormWrapper";
import { enumToOptions } from "../transform";


interface Props extends FormikProps<DocumentType> {
  handleTransition: () => void;
  transitionLabel: string;
}

export const DocumentTypeFormPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  handleTransition,
  transitionLabel,
}) => (
  <Grid container style={{ display: "flex", justifyContent: "center" }}>
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
      <Grid item xs={12} style={{ display: "flex" }}>
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
          label="Needs Signature"
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
        name="hiddenForCreationForUsersWithoutTags"
        label="Hidden For Creation For Users Without Tags"
        autocompleteProps={{ id: "hiddenForCreationForUsersWithoutTags", isMulti: true }}
        options={enumToOptions(GroupTag)}
      />
      <AutocompleteField
        name="group"
        label="Group"
        autocompleteProps={{ id: "group" }}
        options={enumToOptions(DOC_GROUP_TYPE)}
      />
      <InputField
        name="category"
        label="Category"
        inputProps={{ id: "category" }}
      />
      <Grid container >
        <Grid item xs={6}>
          <InputLabel>Schema</InputLabel>
          <TextareaAutosize
            name="schema"
            rows={5}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Fields Config</InputLabel>
          <TextareaAutosize
            name="fieldsConfig"
            rows={5}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mr={6}>
        <Button type="submit" variant="outlined">
        Save
        </Button>
        <Button onClick={handleTransition} variant="outlined">
          {transitionLabel}
        </Button>
      </Box>

    </FormWrapper>
  </Grid>

);

export default DocumentTypeFormPresenter;
