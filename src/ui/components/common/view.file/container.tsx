import React, { useEffect, useState } from "react";
import { Attachment, AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import ViewFilePresenter from "./presenter";
import { ViewFileContainerProps } from "./utils/types";
import { documentRevisionIdContext } from "../../../documentRevision/DocumentRevisionsManager.container";

const ViewFileContainer: React.FunctionComponent<ViewFileContainerProps> = ({
  attachment = ({}) as Attachment,
  attachments,
  isOpen,
  handleClose,
  password,
}) => {
  const [signedUrl, setSignedUrl] = useState("");
  const download = useActionCreator(attachmentsActions.download);
  const downloadRedLine = useActionCreator(attachmentsActions.downloadRedLine);
  const documentRevisionid = React.useContext(documentRevisionIdContext);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => downloadInfo && setSignedUrl(downloadInfo.url),
  });
  useEffect(() => {
    if (isOpen && !password) {
      async.start(download, attachment, async, undefined, documentRevisionid);
      return;
    } else if (isOpen && password) {
      async.start(downloadRedLine, attachment, async, undefined, password.password);
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
