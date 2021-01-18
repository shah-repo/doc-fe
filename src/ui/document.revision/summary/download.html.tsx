import React from "react";
import { useIntl } from "react-intl";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../state/ducks/attachments";
import { PDF } from "../../../state/ducks/documentRevisions";
import AsyncButton from "../../components/AsyncButton";
import { toastError } from "../../components/notifications";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface Props {
  pdf?: PDF;
}
export const DownloadHTML: React.FunctionComponent<Props> = ({
  pdf,
}) => {
  const intl = useIntl();
  const action = useActionCreator(attachmentsActions.getAssetUrl);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      window.open(downloadInfo?.url, "_blank");
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.html.error" }));
    },
  });

  if (!pdf) {
    return null;
  }

  const handleClick = () => {
    async.start(action, pdf.s3Url, async);
  };

  return (
    <AsyncButton
      label="common.download.html"
      data-cy="downloadHtml"
      onClick={handleClick}
      asyncState={async.asyncState}
      color="secondary"
      variant="outlined"
    />
  );
};

export default DownloadHTML;
