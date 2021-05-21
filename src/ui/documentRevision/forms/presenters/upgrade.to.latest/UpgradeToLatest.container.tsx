import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import UpgradeToLatestBanner from "./UpgradeToLatest.banner";
import UpgradeToLatestButton from "./UpgradeToLatest.button";

type DisplayType = "button" | "banner";

interface Props {
  formDocumentId?: string;
  docRevId?: string;
  type: DisplayType;
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
  setShouldDisplay?: (value: boolean) => void;
  shouldShowUpgrade: boolean;
}

const UpgradeToLatestContainer: React.FunctionComponent<Props> = ({
  formDocumentId = "",
  docRevId,
  type,
  bannerPortal,
  setShouldDisplay,
  shouldShowUpgrade,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (formDocumentId && !isEmpty(formDocumentId)) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const async = useAsync();
  const upgradeAction = useActionCreator(documentRevisionsActions.upgradeToReleasedForm);
  const onUpgradeClick = () => async.start(upgradeAction, docRevId, async);

  if (!shouldShowUpgrade) {
    return null;
  }

  return (
    <>
      {
        type === "button" &&
        <UpgradeToLatestButton {...{ onUpgradeClick, setShouldDisplay, shouldShowUpgrade }}/>
      }
      {
        type === "banner" &&
        <UpgradeToLatestBanner {...{ onUpgradeClick, shouldShowUpgrade, bannerPortal }} />
      }
    </>
  );
};

export default UpgradeToLatestContainer;
