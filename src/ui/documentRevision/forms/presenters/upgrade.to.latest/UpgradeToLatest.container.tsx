import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import RelatedEquipmentsState from '../related.equipments/state';
import UpgradeToLatestBanner from './UpgradeToLatest.banner';
import UpgradeToLatestButton from './UpgradeToLatest.button';

type DisplayType = 'button' | 'banner';

interface Props {
  documentRevision?: DocumentRevision
  formDocumentId?: string
  docRevId?: string
  type: DisplayType
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>
  setShouldDisplay?: (value: boolean) => void
  shouldShowUpgrade: boolean
  shouldShowSyncForRelatedEquipment?: boolean
  renderAsButton?: boolean
}

const UpgradeToLatestContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  formDocumentId = '',
  docRevId,
  type,
  bannerPortal,
  setShouldDisplay,
  shouldShowUpgrade,
  shouldShowSyncForRelatedEquipment,
  renderAsButton,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (formDocumentId && !isEmpty(formDocumentId)) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const async = useAsync();
  const upgradeAction = useActionCreator(documentRevisionsActions.upgradeToReleasedForm);
  const onFormUpgradeClick = () => async.start(upgradeAction, docRevId, async);

  const onRelatedEquipmentSyncClick = async () => {
    const relatedEquipmentState = new RelatedEquipmentsState({ parentSpecificationId: '' });
    await relatedEquipmentState.syncRelatedEquipment(
      documentRevision?.formInput?.equipmentSpecification?.relatedEquipmentId ?? '',
    );
    history.go(0);
  };

  const shouldShow = shouldShowUpgrade || shouldShowSyncForRelatedEquipment;

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {
        type === 'button'
        && <UpgradeToLatestButton {...{ onUpgradeClick: onFormUpgradeClick, setShouldDisplay, shouldShowUpgrade, renderAsButton }} />
      }
      {
        type === 'banner'
        && (
          <>
            {shouldShowUpgrade && (
              <UpgradeToLatestBanner {...{ shouldShowUpgrade, onUpgradeClick: onFormUpgradeClick, bannerPortal }} />
            )}
            {shouldShowSyncForRelatedEquipment && (
              <UpgradeToLatestBanner {...{ shouldShowSyncForRelatedEquipment, onUpgradeClick: onRelatedEquipmentSyncClick, bannerPortal }} />
            )}
          </>
        )
      }
    </>
  );
};

export default UpgradeToLatestContainer;
