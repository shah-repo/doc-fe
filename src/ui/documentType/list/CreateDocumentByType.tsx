import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentTypeActions, DocumentTypeById, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import FormListDialog from "../FormListDialog/FormListDialog.presenter";
import { styles } from "./styles";

interface Props {
  documentTypeName: string;
  documentTypeId: string;
}

const CreateDocumentByType: React.FunctionComponent<Props> = ({
  documentTypeName,
  documentTypeId,
}) => {
  const history = useHistory();
  const dialog = useDialog();
  const classes = styles();
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.formIds);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const docRevId = useSelector(documentTypeSelectors.docRevTypeById);

  useEffect(() => {
    setErrorMessage(undefined);
  }, [documentTypeId]);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (formIds.length === 1) {
        history.push(`/document_revision/${formIds[0].document.id}/output_document/${docRevId}`);
        return;
      }
      if (isEmpty(formIds)) {
        setErrorMessage("missing.form.error");
        return;
      }
      toggleMultipleForm(true);
      dialog.open();
    },
    onError: (msg) => setErrorMessage(msg),
  });

  const openDocRev = () => {
    setErrorMessage(undefined);
    async.start(getDocRevByIds, documentTypeId, async);
  };

  const handleSelection = (selectedFormId) => {
    if (!selectedFormId) {
      return;
    }
    const form = formIds.find((form) => form.id === selectedFormId);
    const docId = form?.document.id;
    history.push(`/document_revision/${docId}/output_document/${selectedFormId}`);
  };

  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={openDocRev}
          id="DocumentByTypeListPresenter-openDocRev"
        >
          <Text
            translation="supplier.add.new"
            values={{ name: documentTypeName }}
          />
        </Button>
      </Grid>
      {
        errorMessage && (
          <div style={{ color: "red" }} id="DocumentByTypeListPresenter-showError">
            <Text
              message={errorMessage}
              values={{ name: documentTypeName }}
            />
          </div>
        )
      }
      {
        multipleForm &&
        <FormListDialog
          dialog={dialog}
          handleSelection={handleSelection}
          formIds={formIds}
        />
      }
    </>
  );
};

export default CreateDocumentByType;
