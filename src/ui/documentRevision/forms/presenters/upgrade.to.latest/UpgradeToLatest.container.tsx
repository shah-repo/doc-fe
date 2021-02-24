import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useShouldUpgradeToLatest from "../../../../hooks/useShouldUpgradeToLatest";
import UpgradeToLatestBanner from "./UpgradeToLatest.banner";
import UpgradeToLatestButton from "./UpgradeToLatest.button";

type DisplayType = "button" | "banner";

interface Props {
  documentStatus?: DocumentRevisionStatus;
  formDocumentId?: string;
  docRevId?: string;
  formDocumentStatus?: DocumentRevisionStatus;
  type: DisplayType;
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
  setShouldDisplay?: (value: boolean) => void;
  shouldShowUpgradeBannerForRecord: boolean;
}

const UpgradeToLatestContainer: React.FunctionComponent<Props> = ({
  documentStatus,
  formDocumentId = "",
  docRevId,
  formDocumentStatus,
  type,
  bannerPortal,
  setShouldDisplay,
  shouldShowUpgradeBannerForRecord,
}) => {
  const dispatch = useDispatch();
  const showShouldUpgrade = useShouldUpgradeToLatest(documentStatus, formDocumentStatus, formDocumentId);

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const async = useAsync();
  const upgradeAction = useActionCreator(documentRevisionsActions.upgradeToReleasedForm);
  const onUpgradeClick = () => async.start(upgradeAction, docRevId, async);

  if (!showShouldUpgrade || !shouldShowUpgradeBannerForRecord) {
    return null;
  }

  return (
    <>
      {
        type === "button" &&
        <UpgradeToLatestButton {...{ onUpgradeClick, setShouldDisplay, showShouldUpgrade }}/>
      }
      {
        type === "banner" &&
        <UpgradeToLatestBanner {...{ onUpgradeClick, showShouldUpgrade, bannerPortal }} />
      }
    </>
  );
};

export default UpgradeToLatestContainer;
