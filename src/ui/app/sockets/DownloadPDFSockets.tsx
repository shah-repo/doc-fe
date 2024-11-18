import React, { useCallback, useMemo } from 'react';
import { safeParse } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface DownloadPDFSocketsProps {
  employeeId?: string
  showNotificationAndDownloadPDF: (data: DownloadPDFSocketsData) => void
}

export interface DownloadPDFSocketsData {
  url: string
  message: string
}

const DownloadPDFSockets: React.FC<DownloadPDFSocketsProps> = ({
  employeeId,
  showNotificationAndDownloadPDF,
}) => {
  const topic = useMemo(
    () => `${employeeId}/external_export_email/+/pdf`,
    [employeeId],
  );

  const loadData = useCallback(
    (data) => {
      const parsedData = safeParse(data);
      const messageData = parsedData?.data?.message;
      const parsedMessage
        = typeof messageData === 'string' ? safeParse(messageData) : messageData;
      const clientUserAgent = navigator.userAgent;
      if (data.userAgent === clientUserAgent && parsedMessage.url) {
      showNotificationAndDownloadPDF?.(parsedMessage);
      }
    },
    [employeeId],
  );

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
