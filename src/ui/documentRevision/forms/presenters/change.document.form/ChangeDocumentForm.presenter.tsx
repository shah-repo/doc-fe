import { Box, Button, Divider } from "@material-ui/core";
import { Form } from "formik";
import { isEmpty } from "lodash";
import React from "react";
import { DocumentTypeByIdForm } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { AsyncState } from "../../../../../state/types";
import CircularFormProgress from "../../../../components/forms/CircularFormProgress";
import AutocompleteField from "../../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../../components/Text";
import { FBSchemaProps } from "../../../../form.builder/FBSchema/FBSchema.types";
import { toFieldsOptions, toFormOptions } from "./utils/transform";

interface Props {
  availableForms: DocumentTypeByIdForm[];
  handleFormChange: (value) => void;
  availableFields: FBSchemaProps[];
  sourceSchema: FBSchemaProps[];
  updateFormAsyncState: AsyncState;
}

const ChangeDocumentFormPresenter: React.FunctionComponent<Props> = ({
  availableForms,
  handleFormChange,
  availableFields,
  sourceSchema,
  updateFormAsyncState,
}) => {
  const renderFields = () => availableFields.map((field) => <Box width={"200px"} key={field.name}>
    <AutocompleteField
      name={`${field.name}`}
      label={`${field.label}`}
      autocompleteProps={{
        id: "formMigrationField",
        isClearable: true,
      }}
      options={toFieldsOptions(field, sourceSchema)}
    />
  </Box>);

  return (
    <Form>
      <Box width={"200px"}>
        <AutocompleteField
          name="changeDocumentForm"
          size="sm"
          label="common.select.migration.form"
          autocompleteProps={{
            id: "changeDocumentForm",
          }}
          options={toFormOptions(availableForms)}
          onChange={(option) => handleFormChange(option)}
        />
      </Box>
      {!isEmpty(availableFields) && <Divider/>}
      {renderFields()}
      <Box display="flex" justifyContent="center" m={3}>
        <CircularFormProgress asyncState={updateFormAsyncState} />
      </Box>
      <Box display="flex" flexDirection="row-reverse">
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          data-cy="confirmButton"
        >
          <Text translation="document.action.confirm" />
        </Button>
      </Box>
    </Form>
  ); };

export default ChangeDocumentFormPresenter;
