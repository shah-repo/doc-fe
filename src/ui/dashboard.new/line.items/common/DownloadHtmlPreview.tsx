import { Dialog } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ReactComponent as DownloadPdfSolidIcon } from "../../../../assets/images/download_pdf_solid.svg";
import { IotService } from "../../../../common/utils/iot/mqttClient";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import { authSelectors } from "../../../../state/ducks/auth";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import ViewFileContent from "../../../components/common/view.file/components/dialog.content";
import { styles } from "../../../components/common/view.file/utils/styles";
import { toastError, toastInfo } from "../../../components/notifications";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  id: string;
}
const DownloadHtmlPreview: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const [URL, setURL] = React.useState<string>("");
  const classes = styles({ isPDF: true });
  const dialog = useDialog();

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
      setURL(downloadInfo?.url || "");
      dialog.open();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.pdf.error" }));
    },
  });
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
      <DownloadPdfSolidIcon onClick={handleClick}/>
    </>
  );
};
export default DownloadHtmlPreview;
