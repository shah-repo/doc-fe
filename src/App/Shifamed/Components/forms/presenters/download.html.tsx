import { Button } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { PDF } from "../../../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../../../state/types";
import { toastError } from "../../../../../ui/components/notifications";
import Text from "../../../../../ui/components/Text";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";

interface Props {
  pdf?: PDF;
}
const DownloadHTML: React.FunctionComponent<Props> = ({
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

  const isActive = async.asyncState.status === AsyncStatus.Active;
  return (
    <Button
      color="primary"
      data-cy="downloadHtml"
      onClick={handleClick}
      disabled={isActive}
    >
      <Text translation="common.download.html" />
    </Button>
  );

};

export default DownloadHTML;
