import _ from "lodash";
import React, { useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Attachment, AttachmentDownloadResponse, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody } from "../../../../state/ducks/attachments";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import { authSelectors } from "../../../../state/ducks/auth";
import { Id, Nullable } from "../../../../state/ducks/common";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncStatus } from "../../../../state/types";
import { FormHeaderSummaryContext } from "../../../document.revision/header/SummaryHeader";
import { isOperator } from "../../../documentRevision/DocumentRevisionDisplay.container";
import { documentRevisionStatusContextFromDocList } from "../../../documentRevision/DocumentRevisionsManager.container";
import { documentRevisionStatusContextFromCR } from "../../../documentRevision/DocumentRevisionUpdate.container";
import { documentTypeContext, isOwnerContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { Translation } from "../../../translations/types";
import { useFormContext } from "../../forms/FormContext";
import { withFormik } from "../../hoc/formik";
import PasswordDialog from "../../password/dialog";
import { Password } from "../../password/types";
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
  isNewVersion,
  documentRevision,
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
  const [isWatermarking, setWatermark] = useState<boolean>(false);
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
  // const { documentRevision } = React.useContext(FormHeaderContext) || {};
  const { documentRevisionSummary } = React.useContext(FormHeaderSummaryContext) || {};

  const passwordState = {
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

  const redLineRequiresPassword = (attachment: Attachment) => {
    const hasPasswordRequiredStatusFromDocList = (
      documentRevisionStatusFromDocList === DocumentRevisionStatus.Released ||
      documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated ||
      documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete);
    const hasPasswordRequiredStatusFromCR = (
      documentRevisionStatusFromCR === DocumentRevisionStatus.Released ||
      documentRevisionStatusFromCR === DocumentRevisionStatus.Deprecated ||
      documentRevisionStatusFromCR === DocumentRevisionStatus.Obsolete);

    return (attachment.lineType === LINE_TYPES.RED_LINE)
      && (hasPasswordRequiredStatusFromCR || hasPasswordRequiredStatusFromDocList);
  };

  const cleanCopyRequiresPassword = (attachment: Attachment) => {
    const hasPasswordRequiredStatusFromDocList = (
      documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated ||
      documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete);

    const hasPasswordRequiredStatusFromCR = (
      documentRevisionStatusFromCR === DocumentRevisionStatus.Deprecated ||
      documentRevisionStatusFromCR === DocumentRevisionStatus.Obsolete);

    return (attachment.lineType === LINE_TYPES.CLEAN_COPY)
      && (hasPasswordRequiredStatusFromCR || hasPasswordRequiredStatusFromDocList);
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

  const startWaterMarkRequest  = (
    attachment: Attachment,
    attachmentType: AttachmentType,
    documentRevisionId?: string
  ) => {
    const pdfBody: WatermarkRequestBody = {
      attachment: {
        id: attachment.id,
      },
      type: attachmentType,
    };
    const watermarkBody: WatermarkRequestBody = {
      attachment: {
        id: attachment.id,
      },
      type: attachmentType,
      documentRevision: {
        id: documentRevisionId,
      } as Id,
    };
    const body = documentRevisionId ? watermarkBody : pdfBody;
    requestWatermarkAsync.start(
      requestWatermarkAction,
      body,
      requestWatermarkAsync,
    );
  };

  const handleWatermarkRequest = (
    attachment: Attachment,
    attachmentType: AttachmentType,
    documentRevisionId?: string) => {
    setNewWatermarkError("");
    setNewWatermarkRequest(null);

    if (documentRevisionId) {
      setWatermark(true);
    }
    if (cleanCopyRequiresPassword(attachment) || redLineRequiresPassword(attachment)) {
      setdownloadType(attachmentType);
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_WATER_MARK);
      openWarningDialog();
      closeContextMenu();
    }
    else {
      startWaterMarkRequest(attachment, attachmentType);
    }

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
            AttachmentType.Attached,
            values.password,
          );
        }
        break;

      case PasswordSubmitActionType.DOWNLOAD_WATER_MARK:
        if (selectedAttachment && downloadType) {
          const id = isWatermarking ? documentRevisionSummary?.id : undefined;
          startWaterMarkRequest(selectedAttachment, downloadType, id);
          setWatermark(false);
        }
        break;
      case PasswordSubmitActionType.DOWNLOAD_CLEAN_COPY_FILE:
        if (selectedAttachment) {
          setPassword(values);
          handleDownload(
            selectedAttachment,
            AttachmentType.CleanCopy,
            values.password,
          );
        }

      default:
        break;
    }

  };

  const warningPasswordText = (): Translation => {

    if (documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete) {
      return "common.attachment.redline.warning.download.obsoleted";
    }

    if (documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated) {
      return "common.attachment.redline.warning.download.deprecated";
    }

    if (documentRevisionStatusFromCR === DocumentRevisionStatus.Obsolete) {
      return "common.attachment.redline.warning.download.obsoleted";
    }

    if (documentRevisionStatusFromCR === DocumentRevisionStatus.Deprecated) {
      return "common.attachment.redline.warning.download.deprecated";
    }
    return "common.attachment.redline.warning.download.redline";
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
    if (redLineRequiresPassword(attachment)) {
      setSelectedAttachment(attachment);
      needPasswordHandler(attachment);
    } else if (cleanCopyRequiresPassword(attachment)) {
      setSelectedAttachment(attachment);
      needPasswordHandler(attachment);
    }
    else {
      setSelectedAttachment(attachment);
      noNeedPasswordHandler(attachment);
    }
  };

  const closeContextMenu = () => setAnchorEl(null);

  const openPasswordDialog = () => passwordDialogHandler.open();
  const openWarningDialog = () => redlineWarningDialogHandler.open();
  const openFileView = () => dialogHandler.open();

  const sortedAttachments = useMemo(() =>
    attachments
      .sort((a) => a.lineType === LINE_TYPES.CLEAN_COPY ? -1 : 0)
      .sort((a) => a.id === documentRevision?.primaryAttachment?.id ? -1 : 0)
  , [attachments, documentRevision]);
  const attachmentsRenderer = sortedAttachments.map((attachment) => {
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
          isNewVersion,
        }}
      />
    );
  });

  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginTop: "2rem" }}>
      <AttachmentRedLineWarningDialog
        isDialogOpen={redlineWarningDialogHandler.isOpen}
        onSubmit={warningSubmit}
        closeDialog={redlineWarningDialogHandler.close}
        asyncState={warningState}
        translationText={warningPasswordText()}
      />

      <PasswordDialog
        isDialogOpen={passwordDialogHandler.isOpen}
        onSubmit={passwordSubmit}
        closeDialog={passwordDialogHandler.close}
        asyncState={passwordState}
      />
      <ViewFile
        isOpen={dialogHandler.isOpen}
        handleClose={dialogHandler.close}
        password={password}
        attachments={attachments}
        attachment={selectedAttachment}
      />
      <WatermarkContainer
        newWatermarkRequest={newWatermarkRequest}
        newWatermarkError={newWatermakrError}
      />
      <Menu
        handleIconClick={handleClick}
        handleClose={closeContextMenu}
        attachment={selectedAttachment}
        download={handleDownload}
        {...{
          setSelectedAttachment,
          anchorEl,
          openFileView,
          openWarningDialog,
          setPasswordSubmitAction,
          handleWatermarkRequest,
          cleanCopyRequiresPassword,
          redLineRequiresPassword,
          documentRevision,
        }}
      />
      {attachmentsRenderer}
    </div>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
