import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../state/ducks/auth';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DownloadPDFSockets: React.FC = () => {
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const topic = React.useMemo(() => `${employeeId}/external_export_email/+/pdf`, [employeeId]);

  const loadData = useCallback(debounce((data) => {
    const clientUserAgent = navigator.userAgent;
    try {
      const parsedData = JSON.parse(data);
      const messageData = parsedData?.data?.message;
      const parsedMessage = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;

      if (parsedMessage.userAgent === clientUserAgent && parsedMessage?.url) {
        window.open(parsedMessage.url, '_parent');
      }
    } catch (error) {
      console.error('An error occurred during the attachment download', error);
    }
  }, 1000), [employeeId]);

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
