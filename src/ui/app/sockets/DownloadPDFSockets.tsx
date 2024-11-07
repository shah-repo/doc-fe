import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import { toastError } from '../../components/notifications';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DownloadPDFSockets: React.FC = () => {
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const topic = React.useMemo(() => `${employeeId}/external_export_email/+/pdf`, [employeeId]);

  const loadData = useCallback((data) => {
    const clientUserAgent = navigator.userAgent;
    try {
      const parsedData = JSON.parse(data);
      const messageData = parsedData?.data?.message;
      const parsedMessage = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;

      if (parsedMessage.userAgent === clientUserAgent && parsedMessage?.url) {
        window.open(parsedMessage.url, '_parent');
      }
    } catch (error) {
      toastError(translate('share.download.fail.error'));
    }
  }, [employeeId]);

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
