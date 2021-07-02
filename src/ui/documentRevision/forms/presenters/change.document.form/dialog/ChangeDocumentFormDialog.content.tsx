import { Box, Button, createStyles, DialogContent, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsActions } from "../../../../../../state/ducks/documentRevisions";
import { documentTypeActions, documentTypeSelectors } from "../../../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevision } from "../../../../../../state/ducks/documentRevisions/types";
import AutocompleteField from "../../../../../components/forms/fields/Autocomplete/Autocomplete";
import { FormContext } from "../../../../../components/forms/FormContext";
import Text from "../../../../../components/Text";
import useActionCreator from "../../../../../hooks/useActionCreator";
import useAsync from "../../../../../hooks/useAsync";
import { DialogHandler } from "../../../../../hooks/useDialog";
import { toOptions, toUpdateFormRequestBody } from "../transform";

interface Props {
  documentTypeId: string;
  dialog: DialogHandler;
  docRevId: string;
}

const styles = makeStyles(() =>
  createStyles({
    dialog: {
      overflowY: "unset",
    },
  },
  ));

const ChangeDocumentFormContent: React.FunctionComponent<Props> = ({
  documentTypeId,
  dialog,
  docRevId,
}) => {
  const async = useAsync();
  const updateFormAsync = useAsync({
    onSuccess: (data?: DocumentRevision) => {
      if (!data) {
        return;
      }
      window.open(
        `/document_revision/${data.document.id}/version/${data.id}`,
        "_self"
      );
    },
  }
  );

  const classes = styles();
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const updateFormAction = useActionCreator(documentRevisionsActions.updateForm);

  const availableForms = useSelector(documentTypeSelectors.docRevTypeForms);

  const onSubmit = (values) => {
    updateFormAsync.start(
      updateFormAction,
      docRevId,
      toUpdateFormRequestBody(values),
      updateFormAsync);
  };
  useEffect(() => {
    async.start(getDocRevByIds, documentTypeId, async);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypeId]);

  const renderForm = () => (
    <DialogContent classes={{ root: classes.dialog }}>
      <Form>
        <AutocompleteField
          name="changeDocumentForm"
          size="sm"
          label="common.choose.template"
          autocompleteProps={{ id: "FormList-changeDocumentForm" }}
          options={toOptions(availableForms)}
        />
        <Box>
          <Button
            variant="text"
            onClick={dialog.close}
            data-cy="cancelButton"
          >
            <Text translation="document.action.cancel"/>
          </Button>
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
    </DialogContent>
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={{ changeDocumentForm: { label: "", value: "" } }}
        // TO DO: connect with new EP
        // eslint-disable-next-line arrow-body-style
        onSubmit={onSubmit}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default ChangeDocumentFormContent;
