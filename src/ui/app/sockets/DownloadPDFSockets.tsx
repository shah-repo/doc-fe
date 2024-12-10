import React, { useCallback, useMemo } from 'react';
import { safeParse } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface DownloadPDFSocketsProps {
  employeeId?: string
  revId?: string
  showNotificationAndDownloadPDF: (data: DownloadPDFSocketsData) => void
}

export interface DownloadPDFSocketsData {
  url: string
  message: string
}

const DownloadPDFSockets: React.FC<DownloadPDFSocketsProps> = ({
  employeeId,
  revId,
  showNotificationAndDownloadPDF,
}) => {
  const topic = useMemo(
    () =>
      revId
        ? `${employeeId}/external_export_email/${revId}/pdf`
        : `${employeeId}/external_export_email/+/pdf`,
    [employeeId, revId],
  );

  const loadData = useCallback(
    (data) => {
      const parsedData = safeParse(data);
      const messageData = parsedData?.data?.message;
      const parsedMessage
        = typeof messageData === 'string' ? safeParse(messageData) : messageData;
      const clientUserAgent = navigator.userAgent;
      if (parsedMessage.userAgent === clientUserAgent && parsedMessage.url) {
      showNotificationAndDownloadPDF?.(parsedMessage);
      }
    },
    [employeeId, revId],
  );

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
