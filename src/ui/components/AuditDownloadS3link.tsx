import { Link } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { attachmentsActions } from "../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../state/ducks/attachments/types";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import { toastError } from "./notifications";

interface Props {
  s3link: string;
}

const AuditDownloadS3link: React.FunctionComponent<Props> = ({
  s3link,
}) => {
  const intl = useIntl();
  const action = useActionCreator(attachmentsActions.getAssetUrl);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      window.open(downloadInfo?.url, "_parent");
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.audit.download.s3link.error" }));
    },
  });

  const handleClick = () => {
    async.start(action, s3link, async);
  };

  const generateFileName = (s3link: string) => s3link.substring(s3link.lastIndexOf("/") + 1);

  return (
    <Link href="#" data-cy="downloadS3link" onClick={handleClick} style={{ fontWeight: "bold" }}>
      {generateFileName(s3link)}
    </Link>

  );
};

export default AuditDownloadS3link;
