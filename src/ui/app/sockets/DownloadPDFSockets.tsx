import React, { useCallback, useMemo } from 'react';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface DownloadPDFSocketsProps {
  employeeId?: string
  pdfSocketReceived?: (url: string) => void
}

export const safeParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

const DownloadPDFSockets: React.FC<DownloadPDFSocketsProps> = ({
  employeeId,
  pdfSocketReceived,
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
      pdfSocketReceived?.(parsedMessage);
    },
    [employeeId],
  );

  useMqttSubscription(topic, loadData);
  return null;
};

export default DownloadPDFSockets;
