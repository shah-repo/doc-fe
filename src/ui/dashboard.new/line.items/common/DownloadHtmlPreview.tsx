import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ReactComponent as DownloadPdfSolidIcon } from "../../../../assets/images/download_pdf_solid.svg";
import { IotService } from "../../../../common/utils/iot/iotService";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import { authSelectors } from "../../../../state/ducks/auth";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { toastError, toastInfo } from "../../../components/notifications";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  id: string;
}
const DownloadHtmlPreview: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const templateAction = useActionCreator(documentRevisionsActions.getRenderTemplatePreview);
  const templateAsync = useAsync({
    onSuccess: () => {
      toastInfo(intl.formatMessage({ id: "document.revision.download.html.request" }));
    },
    onError: () => {
      unsubscribe();
      toastError(intl.formatMessage({ id: "document.revision.download.html.error" }));
    },
  });
  const handleClick = () => {
    subscribe();
    templateAsync.start(templateAction, id, templateAsync);
  };

  const iotService = IotService.getInstance();
  const subscribe = () => iotService.subscribeToTopic(`${employeeId}/document_revisions/${id}/pdf`, getAssetUrl);
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`${employeeId}/document_revisions/${id}/pdf`);
  };

  const getAssetUrl = (message: string) => {
    const json = JSON.parse(message).data.message;
    const { url } = JSON.parse(json);
    unsubscribe();
    assetAsync.start(assetAction, url, assetAsync);
  };

  const assetAction = useActionCreator(attachmentsActions.getAssetUrl);
  const assetAsync = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      window.open(downloadInfo?.url, "_blank");
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.html.error" }));
    },
  });
  return (
    <DownloadPdfSolidIcon onClick={handleClick}/>
  );
};
export default DownloadHtmlPreview;
