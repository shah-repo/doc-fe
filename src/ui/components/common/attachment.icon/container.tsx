import { Grid } from "@material-ui/core";
import React from "react";
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

type DispatchProps = AttachmentIconDispatchProps;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name,
  download,
  form,
  field,
  ...other
}) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) =>
      window.open(downloadInfo!.url, "_parent"),
  });

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field!.value as Attachment[]).filter((a) => a.id !== attachment.id);
    form!.setFieldValue(name, filtered);
  };

  const handleDownload = (attachment: Attachment, type?: AttachmentType) => () =>
    async.start(download, attachment, async, type);

  const handleContextMenu = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setAnchorEl(evt.currentTarget);
  }

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
      closeContextMenu={closeContextMenu}
      anchorEl={anchorEl}
    />
  ));

  return <Grid container={true} spacing={2}>{attachmentsRenderer}</Grid>;
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
