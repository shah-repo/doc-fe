import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../state/ducks/auth';
import { safeParse } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DownloadPDFSockets: React.FC = () => {
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const topic = React.useMemo(() => `${employeeId}/external_export_email/+/pdf`, [employeeId]);

  const loadData = useCallback((data) => {
    const clientUserAgent = navigator.userAgent;
    const parsedData = safeParse(data);
    const messageData = parsedData?.data?.message;
    const parsedMessage = typeof messageData === 'string' ? safeParse(messageData) : messageData;

    if (parsedMessage.userAgent === clientUserAgent && parsedMessage?.url) {
      window.open(parsedMessage.url, '_parent');
    }
  }, [employeeId]);

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
