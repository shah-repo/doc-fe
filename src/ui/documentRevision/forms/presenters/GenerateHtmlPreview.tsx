import { Button, Dialog, IconButton } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { IotService } from "../../../../common/utils/iot/mqttClient";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import { authSelectors } from "../../../../state/ducks/auth";
import { Nullable } from "../../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import ViewFileContent from "../../../components/common/view.file/components/dialog.content";
import { styles } from "../../../components/common/view.file/utils/styles";
import { toastError, toastInfo } from "../../../components/notifications";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  id?: string;
  renderHTMLDefined?: Nullable<boolean>;
  showDownloadButton?: boolean;
}
const GenerateHtmlPreview: React.FunctionComponent<Props> = ({
  id,
  renderHTMLDefined,
  showDownloadButton = false,
}) => {
  const intl = useIntl();
  const dialog = useDialog();
  const [htmlRequested, setHtmlRequested] = React.useState(false);
  const [URL, setURL] = React.useState<string>("");
  const classes = styles({ isPDF: true });

  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const templateAction = useActionCreator(documentRevisionsActions.getRenderTemplatePreview);
  const templateAsync = useAsync({
    onSuccess: () => {
      toastInfo(intl.formatMessage({ id: "document.revision.download.html.request" }));
    },
    onError: () => {
      unsubscribe();
      toastError(intl.formatMessage({ id: "document.revision.download.pdf.error" }));
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
      setURL(downloadInfo?.url || "");
      dialog.open();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.pdf.error" }));
    },
  });

  if (!renderHTMLDefined) {
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
    <>
      {dialog.isOpen && <Dialog
        onClose={dialog.close}
        open={dialog.isOpen}
        classes={{
          paper: classes.paper,
        }}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <ViewFileContent
          asyncState={assetAsync.asyncState}
          url={URL}
          type={"PDF"}
          handleClose={dialog.close}
        />
      </Dialog>}
      <Button
        onClick={handleClick}
        variant="contained"
        disabled={htmlRequested}
        color="secondary"
      >
        <Text translation="common.generate.pdf" />
      </Button>
    </>

  );
};

export default GenerateHtmlPreview;
