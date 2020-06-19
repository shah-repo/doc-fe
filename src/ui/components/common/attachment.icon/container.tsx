import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Attachment, AttachmentDownloadResponse, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody } from "../../../../state/ducks/attachments";
import { authSelectors } from "../../../../state/ducks/auth";
import { Nullable } from "../../../../state/ducks/common";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncStatus } from "../../../../state/types";
import { isOperator } from "../../../documentRevision/DocumentRevisionDisplay.container";
import { documentRevisionStatusContextFromDocList } from "../../../documentRevision/DocumentRevisionsManager.container";
import { documentRevisionStatusContextFromCR } from "../../../documentRevision/DocumentRevisionUpdate.container";
import { documentTypeContext, isOwnerContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { useFormContext } from "../../forms/FormContext";
import { withFormik } from "../../hoc/formik";
import PasswordDialog from "../../password/dialog";
import { Password } from "../../password/types";
import Text from "../../Text";
import { AttachmentRedLineWarningDialog } from "../attachment.redline.warning/dialog";
import ViewFile from "../view.file/container";
import { checkIfFileIsViewable } from "../view.file/utils/helpers";
import Menu from "./menu";
import PresenterFactory from "./presenter.factory";
import { AttachmentIconContainerProps, AttachmentIconDispatchProps, PasswordSubmitActionType } from "./utils/types";
import WatermarkContainer from "./watermark/container";

type DispatchProps = AttachmentIconDispatchProps;

export let SetFile: React.Context<React.Dispatch<React.SetStateAction<Attachment | undefined>>>;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name = "",
  form,
  field,
  value,
  ...other
}) => {
  const dialogHandler = useDialog();
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();
  const attachments = value || field?.value as Attachment[] || [];
  const [newWatermarkRequest, setNewWatermarkRequest] = useState<Nullable<WatermarkRequest>>(null);
  const [newWatermakrError, setNewWatermarkError] = useState<string>("");
  const [selectedAttachment, setSelectedAttachment] = useState<undefined | Attachment>(undefined);
  const [password, setPassword] = useState<Password | undefined>();
  const [downloadType, setdownloadType] = useState<AttachmentType>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [PasswordSubmitAction, setPasswordSubmitAction] = useState<PasswordSubmitActionType>();
  const { submitForm } = useFormContext();
  const isCurrentUserOperator = React.useContext(isOperator);
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const documentType = React.useContext(documentTypeContext);
  const documentRevisionStatusFromDocList = React.useContext(documentRevisionStatusContextFromDocList);
  const documentRevisionStatusFromCR = React.useContext(documentRevisionStatusContextFromCR);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const downloadAttachment = useActionCreator(attachmentsActions.download);
  const downloadAttachmentPassword = useActionCreator(attachmentsActions.downloadRedLine);
  const requestWatermarkAction = useActionCreator(attachmentsActions.requestWatermarkedFile);

  const passwordState =  {
    status: AsyncStatus.Idle,
    message: "",
  };
  const warningState = {
    status: AsyncStatus.Idle,
    message: "",
  };

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
      setPassword(undefined);
    },
    onError: (message) => {
      alert(message);
      setPassword(undefined);
    },
  });

  SetFile = React.createContext(setSelectedAttachment);


  const docRevStatusRequiresPassword = (attachment: Attachment, attachmentType?: AttachmentType) => {
    const isRedline = attachmentType === AttachmentType.Attached && attachment.s3linkCleanCopy;

    return !![
      documentRevisionStatusFromDocList,
      documentRevisionStatusFromCR,
    ].find((state) => (
      !isRedline && [
        DocumentRevisionStatus.Deprecated,
        DocumentRevisionStatus.Obsolete,
      ].includes(state as DocumentRevisionStatus)
    ) || (
      isRedline && [
        DocumentRevisionStatus.Released,
        DocumentRevisionStatus.Deprecated,
        DocumentRevisionStatus.Obsolete,
      ].includes(state as DocumentRevisionStatus)
    ));
  };

  const handleDownload = (attachment: Attachment, type?: AttachmentType, password?: string) => {
    if (password) {
      async.start(downloadAttachmentPassword, attachment, async, type, password);
    } else {
      async.start(downloadAttachment, attachment, async, type);
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

  const startWaterMarkRequest  = (attachment: Attachment, attachmentType: AttachmentType) => {
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

  const handleWatermarkRequest = (attachment: Attachment, attachmentType: AttachmentType) => {
    setNewWatermarkError("");
    setNewWatermarkRequest(null);
    if (docRevStatusRequiresPassword(attachment, attachmentType)) {
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_WATER_MARK);
      openWarningDialog();
      closeContextMenu();
    } else {
      startWaterMarkRequest(attachment, attachmentType);
    }
    setdownloadType(attachmentType);
  };

  const passwordSubmit = (values: Password) => {
    passwordDialogHandler.close();
    switch (PasswordSubmitAction) {
      case PasswordSubmitActionType.OPEN_FILE_VIEW:
        setPassword(values);
        openFileView();
        break;

      case PasswordSubmitActionType.DOWNLOAD_FILE:
        if (selectedAttachment) {
          setPassword(values);
          handleDownload(
            selectedAttachment,
            downloadType,
            values.password,
          ); }
        break;

      case PasswordSubmitActionType.DOWNLOAD_WATER_MARK:
        if (selectedAttachment && downloadType) {
          startWaterMarkRequest(selectedAttachment, downloadType);
        }
        break;

      default:
        break;
    }

  };

  const warningSubmit = () => {
    redlineWarningDialogHandler.close();
    openPasswordDialog();
  };

  const noNeedPasswordHandler = (attachment: Attachment) => {
    if (checkIfFileIsViewable(attachment.type)) {
      openFileView();
      closeContextMenu();
    } else {
      handleDownload(attachment);
      closeContextMenu();
    }
  };

  const needPasswordHandler = (attachment: Attachment) => {
    if (checkIfFileIsViewable(attachment.type)) {
      setPasswordSubmitAction(PasswordSubmitActionType.OPEN_FILE_VIEW);
      openWarningDialog();
      closeContextMenu();
    } else {
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_FILE);
      openWarningDialog();
      closeContextMenu();
    }
  };

  const handleClick = (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    if (
      docRevStatusRequiresPassword(attachment)) {
      needPasswordHandler(attachment);
    } else {
      noNeedPasswordHandler(attachment);
    }
    setdownloadType(AttachmentType.Attached);
    setSelectedAttachment(attachment);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const openPasswordDialog = () => passwordDialogHandler.open();
  const openWarningDialog = () => redlineWarningDialogHandler.open();
  const openFileView = () => dialogHandler.open();

  const attachmentsRenderer = attachments.map((attachment) => {
    let showAttachment = true;
    let canDeleteFile = true;
    if (isCurrentUserOperator && (documentType === "LOT" || documentType === "EB")) {
      const isOwnerOfFile = attachment.owner?.id === currentEmployeeId;
      showAttachment = isOwnerOfFile;
      canDeleteFile = isOwnerOfFile;
    }
    if (isUserDocumentOwner) {
      showAttachment = true;
      canDeleteFile = true;
    }

    if (!showAttachment) {
      return null;
    }

    return (
      <PresenterFactory
        {...other}
        key={`attachment-${attachment.id}`}
        {...{
          name,
          attachment,
          handleRemove,
          form,
          field,
          handleContextMenu,
          handleIconClick: handleClick,
          canDeleteFile,
        }}
      />
    );
  });

  const isRedline = downloadType === AttachmentType.Attached && selectedAttachment?.s3linkCleanCopy;

  const docRevStatus =
    documentRevisionStatusFromDocList || documentRevisionStatusFromCR;
  const copy = isRedline ? (
    <Text translation="common.attachment.redline.warning.download.redline"/>
  ) : (
    (docRevStatus === DocumentRevisionStatus.Obsolete && <Text translation="common.attachment.redline.warning.download.obsoleted"/>) ||
    (docRevStatus === DocumentRevisionStatus.Deprecated && <Text translation="common.attachment.redline.warning.download.deprecated"/>)
  );

  return (
    <Grid container={true} spacing={2}>
      <AttachmentRedLineWarningDialog
        isDialogOpen = {redlineWarningDialogHandler.isOpen}
        onSubmit = {warningSubmit}
        closeDialog = {redlineWarningDialogHandler.close}
        asyncState = {warningState}
        copy={copy}
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
        handleIconClick = {handleClick}
        setSelectedAttachment = {setSelectedAttachment}
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedAttachment}
        openFileView={openFileView}
        download= {handleDownload}
        openWarningDialog = {openWarningDialog}
        setPasswordSubmitAction = {setPasswordSubmitAction}
        handleWatermarkRequest={handleWatermarkRequest}
        docRevStatusRequiresPassword = {docRevStatusRequiresPassword}
        setdownloadType = {setdownloadType}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
