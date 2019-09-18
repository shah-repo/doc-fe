import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Attachment,
  AttachmentDownloadResponse,
  attachmentsActions,
  AttachmentType,
} from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { withFormik } from "../../hoc/formik";
import ViewFile from "../view.file/container";
import Menu from "./menu";
import Presenter from "./presenter";
import {
  AttachmentIconContainerProps,
  AttachmentIconDispatchProps,
} from "./utils/types";

type DispatchProps = AttachmentIconDispatchProps;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name,
  download,
  form,
  field,
  ...other
}) => {

  const dialogHandler = useDialog();
  const attachments = field!.value as Attachment[] || [];
  const [selectedFile, setSelectedFile] = useState<undefined | Attachment>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) =>
      window.open(downloadInfo!.url, "_parent"),
  });

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field!.value as Attachment[]).filter((a) => a.id !== attachment.id);
    form!.setFieldValue(name, filtered);
  };

  const handleDownload = (attachment: Attachment, type?: AttachmentType) => () => {
    if (attachment.s3link == null) { return; }
    async.start(download, attachment, async, type);
  };

  const handleContextMenu = (file: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    if (file.s3link == null) { return; }
    evt.preventDefault();
    setSelectedFile(file);
    setAnchorEl(evt.currentTarget);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const handleViewFile = (attachment: Attachment) => {
    dialogHandler.open();
  };

  const attachmentsRenderer = attachments.map((attachment) => (
    <Presenter
      {...other}
      key={`attachment-${attachment.id}`}
      name={name}
      attachment={attachment}
      handleRemove={handleRemove}
      handleDownload={handleDownload}
      handleContextMenu={handleContextMenu}
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
      <Menu
        handleDownload={handleDownload}
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedFile}
        handleViewFile={handleViewFile}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
