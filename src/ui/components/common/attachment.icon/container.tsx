import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Attachment, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody, AttachmentDownloadResponse } from "../../../../state/ducks/attachments";
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
import { PasswordSubmitActionType } from "./utils/types";

type DispatchProps = AttachmentIconDispatchProps;

export let SetFile: React.Context<React.Dispatch<React.SetStateAction<Attachment | undefined>>>;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name = "",
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
  const [selectedAttachment, setSelectedAttachment] = useState<undefined | Attachment>(undefined);
  const [password, setPassword] = useState<Password>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [PasswordSubmitAction, setPasswordSubmitAction] = useState<PasswordSubmitActionType>();
  const isCurrentUserOperator = React.useContext(isOperator);
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const documentType = React.useContext(documentTypeContext);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const downloadAttachment = useActionCreator(attachmentsActions.download);
  const downloadRedLineAttachment = useActionCreator(attachmentsActions.downloadRedLine);
  const passwordState =  {
    status: AsyncStatus.Idle,
    message: "",
  };
  const warningState = {
    status: AsyncStatus.Idle,
    message: "",
  };
  const requestWatermarkAction = useActionCreator(attachmentsActions.requestWatermarkedFile);
  const requestWatermarkAsync = useAsync<WatermarkRequest>({
    onSuccess: (data = {} as WatermarkRequest) => {
      setNewWatermarkRequest(data);
    },
    onError: (msg = "Watermark error") => {
      setNewWatermarkError(msg);
    },
  });
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_parent");
    },
  });

  SetFile = React.createContext(setSelectedAttachment);


  const handleDownload = (attachment: Attachment, type?: AttachmentType, password?: string) => {
    if (attachment.lineType === LINE_TYPES.CLEAN_COPY) {
      async.start(downloadAttachment, attachment, async, type);
    } else if (password) {
      async.start(downloadRedLineAttachment, attachment, async, undefined, password);
    }
  };

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
    setSelectedAttachment(file);
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
    switch (PasswordSubmitAction) {
      case PasswordSubmitActionType.OPEN_FILE_VIEW:
        openFileView();
        break;

      case PasswordSubmitActionType.DOWNLOAD_FILE:
        if (selectedAttachment) {
          handleDownload(
            selectedAttachment,
          selectedAttachment?.type === "CLEAN_COPY" ? AttachmentType.CleanCopy : AttachmentType.Attached,
          values.password,
          ); }
        break;

      default:
        break;
    }

  };

  const warningSubmit = () => {
    redlineWarningDialogHandler.close();
    openPasswordDialog();
  };

  const handleIconClick = (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedAttachment(attachment);
    if (attachment.lineType === LINE_TYPES.RED_LINE) {
      setPasswordSubmitAction(PasswordSubmitActionType.OPEN_FILE_VIEW);
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
        attachment={selectedAttachment}
      />
      <WatermarkContainer
        newWatermarkRequest={newWatermarkRequest}
        newWatermarkError={newWatermakrError}
      />
      <Menu
        setSelectedAttachment = {setSelectedAttachment}
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedAttachment}
        openFileView={openFileView}
        download= {handleDownload}
        openWarningDialog = {openWarningDialog}
        setPasswordSubmitAction = {setPasswordSubmitAction}
        handleWatermarkRequest={handleWatermarkRequest}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
