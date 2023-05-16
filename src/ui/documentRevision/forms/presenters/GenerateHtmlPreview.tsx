import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, IconButton } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { StyledMenuListIcon } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { attachmentsActions } from '../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../state/ducks/attachments/types';
import { authSelectors } from '../../../../state/ducks/auth';
import { Nullable } from '../../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import ViewFileContent from '../../../components/common/view.file/components/dialog.content';
import { styles } from '../../../components/common/view.file/utils/styles';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import useMqttSubscription from '../../../hooks/useMqttSubscription';

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
  const [URL, setURL] = React.useState<string>('');
  const classes = styles({ isPDF: true });

  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const templateAction = useActionCreator(documentRevisionsActions.getRenderTemplatePreview);
  const templateAsync = useAsync({
    onError: () => {
      toastError(intl.formatMessage({ id: 'document.revision.download.pdf.error' }));
    },
  });

  const handleClick = () => {
    setHtmlRequested(true);
    templateAsync.start(templateAction, id, templateAsync);
  };

  const callback = React.useCallback((message: string) => {
    const json = JSON.parse(message).data.message;
    const { url } = JSON.parse(json);
    assetAsync.start(assetAction, url, assetAsync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topic = React.useMemo(() =>
    `${employeeId}/document_revisions/${id}/pdf`
  , [employeeId, id]);

  useMqttSubscription(topic, callback);

  const assetAction = useActionCreator(attachmentsActions.getAssetUrl);
  const assetAsync = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setHtmlRequested(false);
      setURL(downloadInfo?.url || '');
      dialog.open();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'document.revision.download.pdf.error' }));
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
        maxWidth={'lg'}
        fullWidth={true}
      >
        <ViewFileContent
          asyncState={assetAsync.asyncState}
          url={URL}
          type={'PDF'}
          handleClose={dialog.close}
        />
      </Dialog>}
      <StyledMenuListItem button alignItems="flex-start" onClick={handleClick}>
        <StyledMenuListIcon>
          <FontAwesomeIcon icon={regular('file-lines')} className={classes.icon}/>
        </StyledMenuListIcon>
        <StyledMenuListItemText
          data-cy="downloadHtml"
          primary={<Text translation="common.view.pdf" />}
        />
      </StyledMenuListItem>
    </>
  );
};

export default GenerateHtmlPreview;
