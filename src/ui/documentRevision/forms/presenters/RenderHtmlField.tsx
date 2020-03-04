import { Box, Button } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { IotService } from "../../../../common/utils/iot/mqttClient";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import { authSelectors } from "../../../../state/ducks/auth";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import InputField from "../../../components/forms/fields/Input";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetHasPermission from "../../../hooks/useGetHasPermission";

export interface Props {
  id?: string;
}
const RenderHtmlField: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const [htmlRequested, setHtmlRequested] = React.useState(false);

  const templateAction = useActionCreator(documentRevisionsActions.getRenderTemplatePreview);
  const templateAsync = useAsync({
    onSuccess: () => {
      alert(intl.formatMessage({ id: "document.revision.download.html.request" }));
    },
    onError: () => {
      unsubscribe();
      alert(intl.formatMessage({ id: "document.revision.download.html.error" }));
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
      window.onbeforeunload = null;
      window.open(downloadInfo?.url, "_blank");
    },
    onError: () => {
      alert(intl.formatMessage({ id: "document.revision.download.html.error" }));
    },
  });

  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);

  if (!canUpdateHTML || !id) {
    return null;
  }

  return (
    <Box>
      <InputField
        name="renderHTML"
        label="common.renderHTML"
        inputProps={{ id: "RenderHTML", rows: 5, multiline: true }}
      />
      <Box textAlign="right">
        <Button
          onClick={handleClick}
          variant="contained"
          disabled={htmlRequested}
        >
          <Text message="Generate HTML preview" />
        </Button>
      </Box>
    </Box>
  );
};

export default RenderHtmlField;
