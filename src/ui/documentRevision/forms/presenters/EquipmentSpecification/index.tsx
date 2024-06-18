import { Box, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../../../common/utils/date';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import Text from '../../../../components/Text';
import { toastSuccess } from '../../../../components/notifications';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { isDocumentRevisionInDraft } from '../../../helpers/documentRevisionStatus';
import RelatedEquipmentsState from '../related.equipments/state';
import { styles } from '../styles/RevisionStage.styles';
import NeedSyncMessage from './components/NeedSyncMessage';
import SyncedSuccessMessage from './components/SyncedSuccessMessage';

interface FormInputEquipmentSpecification {
  id: string
  documentId: string
  docId: string
  displayRevision: string
  relatedEquipmentId: string
  releasedAt: string
}

interface Props {
  relatedDocumentRevision: DocumentRevision
}

const EquipmentSpecification: React.FC<Props> = (props) => {
  const { relatedDocumentRevision } = props;
  const classes = styles();

  const es = relatedDocumentRevision?.formInput?.equipmentSpecification as FormInputEquipmentSpecification;

  const showNeedSyncMessage = relatedDocumentRevision.needSync && !isDocumentRevisionInDraft(relatedDocumentRevision.status);
  const showSyncedSuccessMessage = !relatedDocumentRevision.needSync && relatedDocumentRevision?.needSyncedSuccessNotify;

  useEffect(() => {
    if (!showSyncedSuccessMessage) {
      return;
    }

    toastSuccess(
      <SyncedSuccessMessage parentDocId={es.docId} />,
      { closeButton: true },
    );

    const relatedEquipmentState = new RelatedEquipmentsState({ parentSpecificationId: es.id });
    relatedEquipmentState
      .deleteSyncedSuccessNotify(es.relatedEquipmentId)
      .then(() => {
        relatedDocumentRevision.needSyncedSuccessNotify = false;
      });
  }, [showSyncedSuccessMessage, es, relatedDocumentRevision]);
  return (
    <>
      <Box>
        <Typography variant="h6" className={classes.title}>
          <Text message="document.equipment.specification" />
        </Typography>
        <Box>
          <Link to={documentVersionPath(es.id, es.documentId)}>
            {translate('equipment.specification.displayRevision', {
              docId: es.docId,
              displayRevision: es.displayRevision,
            })}
          </Link>
        </Box>
      </Box>
      {showNeedSyncMessage && (
        <NeedSyncMessage
          parentDocId={es.docId}
          parentReleaseDate={getFormattedDateString(es.releasedAt, MomentFormats.MonthDateYearTwoDigit)}
          relatedDocId={relatedDocumentRevision?.document.docId}
        />
      )}
    </>
  );
};

export default React.memo(EquipmentSpecification);
