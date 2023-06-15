import React, { useCallback } from 'react';
import FBEQMaintenanceState from '../../form.builder/FBEQMaintenance/FBEQMaintenance.state';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface DocumentRevisionSocketProps {
  docRevId: string
  eqMaintenanceState?: FBEQMaintenanceState
}

const DocumentRevSocket: React.FunctionComponent<
  DocumentRevisionSocketProps
> = ({ docRevId, eqMaintenanceState }) => {

  const loadData = useCallback(() => {
    eqMaintenanceState?.getAvailableMaintenanceForms();
    eqMaintenanceState?.getMaintenanceHistory(docRevId);
  }, []);

  useMqttSubscription('+/document_revisions/+/release', loadData);
  return null;
};

export default DocumentRevSocket;
