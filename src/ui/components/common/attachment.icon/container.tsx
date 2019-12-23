import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Attachment,
  AttachmentDownloadResponse,
  attachmentsActions,
  AttachmentType,
  WatermarkedFile,
  WatermarkRequest,
} from "../../../../state/ducks/attachments";
import { Nullable } from "../../../../state/ducks/common";
import { ApplicationState } from "../../../../state/reducers";
import FBStore from "../../../form.builder/stores/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { withFormik } from "../../hoc/formik";
import ViewFile from "../view.file/container";
import Menu from "./menu";
import PresenterFactory from "./presenter.factory";
import {
  AttachmentIconContainerProps,
  AttachmentIconDispatchProps,
} from "./utils/types";
import WatermarkContainer from "./watermark/container";

type DispatchProps = AttachmentIconDispatchProps;

export let SetFile: React.Context<React.Dispatch<React.SetStateAction<Attachment | undefined>>>;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name = "",
  download,
  form,
  field,
  ...other
}) => {

  const [newWatermarkRequest, setNewWatermarkRequest] = useState<Nullable<WatermarkedFile>>(null);
  const [newWatermakrError, setNewWatermarkError] = useState<string>("");
  const dialogHandler = useDialog();
  const attachments = field!.value as Attachment[] || [];
  const [selectedFile, setSelectedFile] = useState<undefined | Attachment>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  SetFile = React.createContext(setSelectedFile);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      window.open(downloadInfo!.url, "_parent");
    },
  });
  const requestWatermarkAction = useActionCreator(attachmentsActions.requestWatermarkedFile);
  const requestWatermarkAsync = useAsync({
    onSuccess: (data: WatermarkedFile = {} as WatermarkedFile) => {
      setNewWatermarkRequest(data);
    },
    onError: (msg) => {
      setNewWatermarkError(msg!);
    },
  });

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field!.value as Attachment[]).filter((a) => a.id !== attachment.id);
    form!.setFieldValue(name, filtered);

    if (FBStore.mode === "form") {
      FBStore.setValues({
        ...FBStore.values,
        [name as string]: filtered,
      });
    }
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

  const handleWatermarkRequest = (attachment: Attachment) => {
    setNewWatermarkError("");
    setNewWatermarkRequest(null);

    const body: WatermarkRequest = {
      attachment: {
        id: attachment.id,
      },
      type: AttachmentType.Attached,
    };
    requestWatermarkAsync.start(
      requestWatermarkAction,
      body,
      requestWatermarkAsync,
    );
  };

  const openFileView = () => dialogHandler.open();

  const attachmentsRenderer = attachments.map((attachment) => (
    <PresenterFactory
      {...other}
      key={`attachment-${attachment.id}`}
      name={name}
      attachment={attachment}
      handleRemove={handleRemove}
      handleDownload={handleDownload}
      form={form}
      field={field}
      handleContextMenu={handleContextMenu}
      handleViewFile={handleViewFile}
    />
  ));

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
