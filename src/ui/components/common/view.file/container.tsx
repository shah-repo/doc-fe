import React, { useEffect, useState } from "react";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { Attachment, AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import ViewFilePresenter from "./presenter";
import { ViewFileContainerProps } from "./utils/types";

const ViewFileContainer: React.FunctionComponent<ViewFileContainerProps> = ({
  attachment = ({}) as Attachment,
  attachments,
  isOpen,
  handleClose,
  password,
}) => {
  const [signedUrl, setSignedUrl] = useState("");
  const download = useActionCreator(attachmentsActions.download);
  const downloadWithPassword = useActionCreator(attachmentsActions.downloadRedLine);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => downloadInfo && setSignedUrl(downloadInfo.url),
  });
  useEffect(() => {
    if (isOpen && password) {
      async.start(downloadWithPassword, attachment, async, undefined, password.password);
      return;
    } else if (isOpen && !password) {
      async.start(download, attachment, async, undefined);
      return;
    }
    setSignedUrl("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, attachment]);

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
