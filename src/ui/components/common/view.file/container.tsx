import React, { useEffect, useState } from "react";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import ViewFilePresenter from "./presenter";
import { ViewFileContainerProps } from "./utils/types";

const ViewFileContainer: React.FunctionComponent<ViewFileContainerProps> = ({
  attachment,
  attachments,
  isOpen,
  handleClose,
}) => {
  const [signedUrl, setSignedUrl] = useState("");
  const download = useActionCreator(attachmentsActions.download);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => setSignedUrl(downloadInfo!.url),
  });
  useEffect(() => {
    if (isOpen) {
      async.start(download, attachment, async);
      return;
    }
    setSignedUrl("");
  }, [isOpen]);

  return (
    <ViewFilePresenter
      handleClose={handleClose}
      isOpen={isOpen}
      asyncState={async.asyncState}
      url={signedUrl}
      attachment={attachment}
      attachments={attachments}
    />
  );
};

export default ViewFileContainer;
