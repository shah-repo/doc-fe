import React, { useCallback } from 'react';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const DownloadPDFSockets: React.FC = () => {
  const loadData = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      const messageData = parsedData?.data?.message;
      const parsedMessage = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;

      if (parsedMessage?.url) {
        window.open(parsedMessage.url, '_parent');
      }
    } catch (error) {
      console.error('An error occurred during the attachment download', error);
    }
  }, []);

  useMqttSubscription('+/external_export_email/+/pdf', loadData);
  return null;
};

export default DownloadPDFSockets;
