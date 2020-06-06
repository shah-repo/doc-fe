import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Attachment, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody } from "../../../../state/ducks/attachments";
import { Nullable } from "../../../../state/ducks/common";
import { ApplicationState } from "../../../../state/reducers";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { useFormContext } from "../../forms/FormContext";
import { withFormik } from "../../hoc/formik";
import ViewFile from "../view.file/container";
import Menu from "./menu";
import PresenterFactory from "./presenter.factory";
import { AttachmentIconContainerProps, AttachmentIconDispatchProps } from "./utils/types";
import WatermarkContainer from "./watermark/container";
import PasswordDialog from "../../password/dialog";
import { AsyncStatus } from "../../../../state/types";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import { Password } from "../../password/types";
import { AttachmentRedLineWarningDialog } from "../attachment.redline.warning/dialog";
import { isOperator } from "../../../documentRevision/DocumentRevisionDisplay.container";
import { isOwnerContext, documentTypeContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
import { authSelectors } from "../../../../state/ducks/auth";

type DispatchProps = AttachmentIconDispatchProps;

export let SetFile: React.Context<React.Dispatch<React.SetStateAction<Attachment | undefined>>>;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name = "",
  download,
  form,
  field,
  value,
  ...other
}) => {
  const { submitForm } = useFormContext();
  const [newWatermarkRequest, setNewWatermarkRequest] = useState<Nullable<WatermarkRequest>>(null);
  const [newWatermakrError, setNewWatermarkError] = useState<string>("");
  const dialogHandler = useDialog();
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();
  const attachments = value || field?.value as Attachment[] || [];
  const [selectedFile, setSelectedFile] = useState<undefined | Attachment>(undefined);
  const [password, setPassword] = useState<Password>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const documentType = React.useContext(documentTypeContext);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const passwordState =  {
    status: AsyncStatus.Idle,
    message: "",
  };
  const warningState = {
    status: AsyncStatus.Idle,
    message: "",
  };
  SetFile = React.createContext(setSelectedFile);


  const requestWatermarkAction = useActionCreator(attachmentsActions.requestWatermarkedFile);
  const requestWatermarkAsync = useAsync<WatermarkRequest>({
    onSuccess: (data = {} as WatermarkRequest) => {
      setNewWatermarkRequest(data);
    },
    onError: (msg = "Watermark error") => {
      setNewWatermarkError(msg);
    },
  });

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field.value as Attachment[]).filter((a) => a.id !== attachment.id);

    if (FBStore.mode === "form") {
      let values = {
        ...FBStore.values,
        [name]: filtered,
      };

      if (_.isEmpty(filtered)) {
        values = _.omit(values, name);
      }

      FBStore.setValues(values);
      FBDynamicValidatorStore.validate();
    }
    form.setFieldValue(name, filtered);
    submitForm();
  };

  const handleContextMenu = (file: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedFile(file);
    setAnchorEl(evt.currentTarget);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const handleWatermarkRequest = (attachment: Attachment, attachmentType: AttachmentType) => {
    setNewWatermarkError("");
    setNewWatermarkRequest(null);

    const body: WatermarkRequestBody = {
      attachment: {
        id: attachment.id,
      },
      type: attachmentType,
    };
    requestWatermarkAsync.start(
      requestWatermarkAction,
      body,
      requestWatermarkAsync,
    );
  };

  const passwordSubmit = (values: Password) => {
    setPassword(values);
    passwordDialogHandler.close();
    openFileView();
  };

  const warningSubmit = () => {
    redlineWarningDialogHandler.close();
    openPasswordDialog();
  };

  const handleIconClick = (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedFile(attachment);
    if (attachment.lineType === LINE_TYPES.RED_LINE) {
      openWarningDialog();
    } else {
      openFileView();
    }
  };

  const openPasswordDialog = () => passwordDialogHandler.open();
  const openWarningDialog = () => redlineWarningDialogHandler.open();
  const openFileView = () => dialogHandler.open();

  const attachmentsRenderer = attachments.map((attachment) => {
    if (isCurrentUserOperator && (documentType === "LOT" || "EB")) {
      const isOperatorOwner = attachment.owner?.id === currentEmployeeId;
      return isOperatorOwner && <PresenterFactory
        {...other}
        key={`attachment-${attachment.id}`}
        name={name}
        attachment={attachment}
        handleRemove={handleRemove}
        form={form}
        field={field}
        handleContextMenu={handleContextMenu}
        handleIconClick = {handleIconClick}
        canDeleteFile={false}
      />;
    }
    if (isUserDocumentOwner) { return <PresenterFactory
      {...other}
      key={`attachment-${attachment.id}`}
      name={name}
      attachment={attachment}
      handleRemove={handleRemove}
      form={form}
      field={field}
      handleContextMenu={handleContextMenu}
      handleIconClick = {handleIconClick}
    />; }
    return null;
  });



  return (
    <Grid container={true} spacing={2}>
      <AttachmentRedLineWarningDialog
        isDialogOpen = {redlineWarningDialogHandler.isOpen}
        onSubmit = {warningSubmit}
        closeDialog = {redlineWarningDialogHandler.close}
        asyncState = {warningState}
      />

      <PasswordDialog
        isDialogOpen = {passwordDialogHandler.isOpen}
        onSubmit = {passwordSubmit}
        closeDialog = {passwordDialogHandler.close}
        asyncState = {passwordState}
      />
      <ViewFile
        isOpen={dialogHandler.isOpen}
        handleClose={dialogHandler.close}
        password = {password}
        attachments={attachments}
        attachment={selectedFile}
      />
      <WatermarkContainer
        newWatermarkRequest={newWatermarkRequest}
        newWatermarkError={newWatermakrError}
      />
      <Menu
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedFile}
        openFileView={openFileView}
        download= {download}
        handleWatermarkRequest={handleWatermarkRequest}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
