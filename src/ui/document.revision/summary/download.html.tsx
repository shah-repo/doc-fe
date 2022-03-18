import React from "react";
import { useIntl } from "react-intl";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../state/ducks/attachments/types";
import { PDF } from "../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../state/types";
import AsyncButton from "../../components/AsyncButton";
import { toastError } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface Props {
  pdf?: PDF;
  newVariant?: boolean;
}
const DownloadHTML: React.FunctionComponent<Props> = ({
  pdf,
  newVariant = false,
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

  if (newVariant) {
    const isActive = async.asyncState.status === AsyncStatus.Active;
    return (
      <StyledButton
        color="primary"
        disabled={isActive}
        data-cy="downloadHtml"
        onClick={handleClick}
      >
        <Text translation="common.download.html" />
      </StyledButton>
    );
  }
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
