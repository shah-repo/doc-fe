import { Button, IconButton } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { IotService } from "../../../../common/utils/iot/mqttClient";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import { authSelectors } from "../../../../state/ducks/auth";
import { Nullable } from "../../../../state/ducks/common";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { toastError, toastInfo } from "../../../components/notifications";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

interface Props {
  id?: string;
  renderHTML?: Nullable<string>;
  showDownloadButton?: boolean;
}
const GenerateHtmlPreview: React.FunctionComponent<Props> = ({
  id,
  renderHTML,
  showDownloadButton = false,
}) => {
  const intl = useIntl();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const [htmlRequested, setHtmlRequested] = React.useState(false);

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
    setHtmlRequested(true);
    templateAsync.start(templateAction, id, templateAsync);
  };

  const iotService = IotService.getInstance();
  const subscribe = () => iotService.subscribeToTopic(`${employeeId}/document_revisions/${id}/pdf`, getAssetUrl);
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(`${employeeId}/document_revisions/${id}/pdf`);
    setHtmlRequested(false);
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
      setHtmlRequested(false);
      window.onbeforeunload = null;
      window.open(downloadInfo?.url, "_blank");
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.html.error" }));
    },
  });

  if (!renderHTML) {
    return null;
  }

  if (showDownloadButton) {
    return (
      <IconButton
        onClick={handleClick}
        disabled={htmlRequested}
        color="secondary"
      >
        <GetAppIcon />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      disabled={htmlRequested}
      color="secondary"
    >
      <Text translation="common.generate.pdf" />
    </Button>
  );
};

export default GenerateHtmlPreview;
