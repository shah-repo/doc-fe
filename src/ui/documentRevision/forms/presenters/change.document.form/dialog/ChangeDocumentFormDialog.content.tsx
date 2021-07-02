import { Box, Button, createStyles, DialogContent, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { documentTypeActions, documentTypeSelectors } from "../../../../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../../../../components/forms/fields/Autocomplete/Autocomplete";
import { FormContext } from "../../../../../components/forms/FormContext";
import Text from "../../../../../components/Text";
import useActionCreator from "../../../../../hooks/useActionCreator";
import useAsync from "../../../../../hooks/useAsync";
import { DialogHandler } from "../../../../../hooks/useDialog";
import { toOptions } from "../transform";

interface Props {
  documentTypeId: string;
  dialog: DialogHandler;
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
}) => {
  const async = useAsync();
  const classes = styles();
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const availableForms = useSelector(documentTypeSelectors.docRevTypeForms);

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
        initialValues={{ choschangeDocumentFormenFormId: "" }}
        onSubmit={() => { return; }}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default ChangeDocumentFormContent;
