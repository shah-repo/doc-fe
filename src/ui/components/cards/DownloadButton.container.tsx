import React from "react";
import { connect } from "react-redux";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { Attachment, AttachmentDownloadResponse } from "../../../state/ducks/attachments/types";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import DownloadButtonPresenter from "./DownloadButton.presenter";

interface DispatchProps {
  download: typeof attachmentsActions.download;
}

interface OwnProps {
  attachment: Attachment;
}

export type DownloadButtonContainerProps = DispatchProps & OwnProps;

export const DownloadButtonContainer: React.FunctionComponent<DownloadButtonContainerProps> =
  ({ download, attachment }) => {
    const async = useAsync<AttachmentDownloadResponse>({
      onSuccess: (downloadInfo) => downloadInfo && window.open(downloadInfo.url, "_parent"),
    });
    const onClick = () => async.start(download, attachment, async);

    return (
      <DownloadButtonPresenter
        onClick={onClick}
        isLoading={attachment.isLoading || false}
      />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  download: attachmentsActions.download,
})(DownloadButtonContainer);
