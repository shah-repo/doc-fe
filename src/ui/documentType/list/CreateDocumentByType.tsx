import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { isEmpty } from "lodash";
import React from "react";
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
  const [noForm, toggleNoForm] = React.useState(false);
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const [selectedFormId, saveSelectedFormId] = React.useState("");
  const [docId, setDocId] = React.useState("");
  const docRevId = useSelector(documentTypeSelectors.docRevTypeById);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (formIds.length === 1) {
        history.push(`/document_revision/${formIds[0].document.id}/output_document/${docRevId}`);
        return;
      }
      if (isEmpty(formIds)) {
        toggleNoForm(true);
        setTimeout(() => toggleNoForm(false), 1000);
        return;
      }
      toggleMultipleForm(true);
      dialog.open();
    },
  });

  const openDocRev = () => {
    async.start(getDocRevByIds, documentTypeId, async);
  };

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

  const handleSelection = (event) => {
    const form = formIds.find((form) => form.id === event.target.value);
    form && setDocId(form.document.id);
    saveSelectedFormId(event.target.value);
  };

  const redirectToForm = () => {
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
        noForm && (
          <div style={{ color: "red" }} id="DocumentByTypeListPresenter-showError">
            <Text
              translation="missing.form.error"
              values={{ name: documentTypeName }}
            />
          </div>
        )
      }
      {
        multipleForm &&
        <FormListDialog
          dialog={dialog}
          preventPropagation={preventPropagation}
          selectedFormId={selectedFormId}
          handleSelection={handleSelection}
          formIds={formIds}
          redirectToForm={redirectToForm}
        />
      }
    </>
  );
};

export default CreateDocumentByType;
