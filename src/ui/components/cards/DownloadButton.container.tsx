import React from "react";
import { connect } from "react-redux";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../state/ducks/attachments";
import { ApplicationState } from "../../../state/reducers";
import { AsyncStatus } from "../../../state/types";
import useAsync from "../../hooks/useAsync";
import DownloadButtonPresenter from "./DownloadButton.presenter";

interface DispatchProps {
  download: typeof attachmentsActions.download;
}

interface OwnProps {
  attachmentId: string;
}

export type DownloadButtonContainerProps = DispatchProps & OwnProps;

export const DownloadButtonContainer: React.FunctionComponent<DownloadButtonContainerProps> =
  ({ download, attachmentId }) => {
    const async = useAsync<AttachmentDownloadResponse>({
      onSuccess: (downloadInfo) => window.open(downloadInfo!.url, "_parent"),
    });
    const onClick = () => async.start(download, attachmentId, async);
    const isLoading = async.asyncState.status === AsyncStatus.Active;

    return (
      <DownloadButtonPresenter
        onClick={onClick}
        isLoading={isLoading}
      />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  download: attachmentsActions.download,
})(DownloadButtonContainer);
