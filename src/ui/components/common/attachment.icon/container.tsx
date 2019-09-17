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
import { withFormik } from "../../hoc/formik";
import Presenter from "./presenter";
import {
  AttachmentIconContainerProps,
  AttachmentIconDispatchProps,
} from "./utils/types";
import Menu from "./menu";

type DispatchProps = AttachmentIconDispatchProps;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name,
  download,
  form,
  field,
  ...other
}) => {

  const [fileToDownload, setFileToDownload] = useState<undefined | Attachment>(undefined);
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
    setFileToDownload(file);
    setAnchorEl(evt.currentTarget);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const attachmentsRenderer = (field!.value as Attachment[] || []).map((attachment) => (
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
      <Menu
        handleDownload={handleDownload}
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={fileToDownload}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
