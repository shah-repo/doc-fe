import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Attachment, AttachmentDownloadResponse, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody } from "../../../../state/ducks/attachments";
import { authSelectors } from "../../../../state/ducks/auth";
import { Nullable } from "../../../../state/ducks/common";
import { ApplicationState } from "../../../../state/reducers";
import { isOperator } from "../../../documentRevision/DocumentRevisionDisplay.container";
import { documentTypeContext, isOwnerContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
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
  const attachments = value || field?.value as Attachment[] || [];
  const [selectedFile, setSelectedFile] = useState<undefined | Attachment>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  SetFile = React.createContext(setSelectedFile);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const documentType = React.useContext(documentTypeContext);

  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_parent");
    },
  });
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

  const handleDownload = (attachment: Attachment, type?: AttachmentType) => () => {
    async.start(download, attachment, async, type);
  };

  const handleContextMenu = (file: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedFile(file);
    setAnchorEl(evt.currentTarget);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const handleViewFile = (attachment: Attachment) => () => {
    setSelectedFile(attachment);
    openFileView();
  };

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

  const openFileView = () => dialogHandler.open();

  const attachmentsRenderer = attachments.map((attachment) => {
    let showAttachment = true;
    let canDeleteFile = false;
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
          handleDownload,
          form,
          field,
          handleContextMenu,
          handleViewFile,
          canDeleteFile,
        }}
      />
    );
  });

  return (
    <Grid container={true} spacing={2}>
      <ViewFile
        isOpen={dialogHandler.isOpen}
        handleClose={dialogHandler.close}
        attachments={attachments}
        attachment={selectedFile}
      />
      <WatermarkContainer
        newWatermarkRequest={newWatermarkRequest}
        newWatermarkError={newWatermakrError}
      />
      <Menu
        handleDownload={handleDownload}
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedFile}
        openFileView={openFileView}
        handleWatermarkRequest={handleWatermarkRequest}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
