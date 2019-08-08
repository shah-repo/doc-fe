import React from "react";
import { Attachment, AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import Presenter from "./presenter";
import { AttachmentIconContainerProps } from "./utils/types";
import useAsync from "../../../hooks/useAsync";
import { ApplicationState } from "../../../../state/reducers";
import { connect } from "react-redux";

interface OwnProps extends AttachmentIconContainerProps {};

interface DispatchProps {
  download: typeof attachmentsActions.download;
}

type Props = OwnProps & DispatchProps;

export const AttachmentIconContainer: React.FunctionComponent<Props> = ({
  name,
  form,
  field: { value },
  download,
  ...other
}) => {

  const handleRemove = (attachment: Attachment) => () => {
    const filtered = (value as Attachment[]).filter((a) => a.id !== attachment.id);
    form.setFieldValue(name, filtered);
  };

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => window.open(downloadInfo!.url, "_parent"),
  });

  const handleDownload = (attachmentId: string) => () => {
    async.start(download, attachmentId, async)
  };

  return <Presenter {...other} name={name} attachments={value as Attachment[]} handleRemove={handleRemove} handleDownload={handleDownload} />;
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  download: attachmentsActions.download,
})(AttachmentIconContainer);
