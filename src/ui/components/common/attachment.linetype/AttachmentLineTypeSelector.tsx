import { Box, Button, Dialog, DialogContent, Link, makeStyles } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { FieldInputProps, Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DOC_TYPE_GROUP_OPTION } from "../../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../../state/reducers";
import { changeRequestFormOnScreenContext } from "../../../change.request/form/ChangeRequestForm.container";
import { documentRevisionTypeGroupsFromDocListContext } from "../../../documentRevision/DocumentRevisionsManager.container";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import Colors from "../../../layout/theme/utils/colors";
import { FormContext, useFormContext } from "../../forms/FormContext";
import Text from "../../Text";
import { AttachmentStyleProps } from "../attachment.field/utils/types";
import AttachmentLineTypeForm from "./AttachmentLineTypeForm";

interface Props {
  upload: typeof attachmentsActions.upload;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  multiple?: boolean;
  name?: string;
  disabled?: boolean;
  onChange: (lineType: string, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => any;
  isField: boolean;
  isUploading: boolean;
}
const styles = makeStyles((theme) => ({
  dialogPaper: {
    overflowY: "unset",
  },
  dialogContent: {
    overflowY: "unset",
    maxWidth: 400,
  },
  root: ({ isField }: AttachmentStyleProps) => ({
    padding: isField ? theme.spacing(2, 1) : 0,
    backgroundColor: isField ? Colors.white : "transparent",
    borderRadius: isField ? "4px" : "none",
    border: isField ? `1px solid ${Colors.medium_gray}` : "none",
  }),
  link: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "flex" : "block",
  }),
  input: {
    display: "none",
  },
  icon: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "inherited" : "none",
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  }),
}));


const AttachmentLineTypeSelector: React.FunctionComponent<Props> = ({
  upload,
  multiple,
  isField,
  field,
  form,
  name,
  disabled,
  onChange,
  isUploading,
}) => {
  const { submitForm } = useFormContext();
  const classes = styles({ isField });
  const dialog = useDialog();
  const async = useAsync<any>({ onSuccess: dialog.close });
  const isChangeRequestFormOnScreenContext = React.useContext(changeRequestFormOnScreenContext);
  const documentRevisionTypeGroupFromDocList = React.useContext(documentRevisionTypeGroupsFromDocListContext);
  const isRecord = documentRevisionTypeGroupFromDocList === DOC_TYPE_GROUP_OPTION.RECORD;
  const documentTypeCanRedline = Boolean(useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, form.values.document.documentType.id))?.canRedLine);

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const closeDialog = () => {
    submitForm();
    dialog.close();
  };

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = () => (
    <AttachmentLineTypeForm
      {...{ field, upload, form, name, multiple, disabled, isUploading, onChange, documentTypeCanRedline }}
      onCancel= {closeDialog}
    />
  );

  return (
    <>
      { (isChangeRequestFormOnScreenContext || isRecord) &&
         <Box mt={1} className={classes.root} id="AttachmentFieldPresenter-field">
           <input
             accept="*"
             className={classes.input}
             id={`${name}-button-file`}
             multiple={multiple}
             type="file"
             onChange={onChange(LINE_TYPES.CLEAN_COPY, false)}
             onBlur={onChange(LINE_TYPES.CLEAN_COPY, false)}
             disabled={disabled}
           />
           <label htmlFor={`${name}-button-file`}>
             <Link
               component="span"
               variant="button"
               className={classes.link}
               id="AttachmentFieldPresenter-downloadAllButton"
             >
               <AttachFile className={classes.icon} />
               <Text translation="common.upload.files" />
             </Link>
           </label>
         </Box>
      }

      { (!isChangeRequestFormOnScreenContext && !isRecord) &&
      <Button
        color="primary"
        startIcon={<AttachFileIcon />}
        onClick={openDialog}
        id="AttachmentFieldPresenter-linkButton"
      >
        Upload Files
      </Button>
      }

      {
        dialog.isOpen &&
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={dialog.isOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
          id="UploadFile-dialog"
        >
          <DialogContent
            classes={{ root: classes.dialogContent }}
            id="UploadFile-content"
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={{ }}
                onSubmit={(values: any) => values}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      }
    </>
  );
};

export default AttachmentLineTypeSelector;
