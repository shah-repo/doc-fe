import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import PODetailItem from "./PODetailItem";

interface Props {
  supplierId: string;
}

const POSupplier: React.FunctionComponent<Props> = ({
  supplierId,
}) => {
  const dispatch = useDispatch();
  const docRevById = useSelector(documentRevisionsSelectors.byId);
  useEffect(() => {
    if (!supplierId || docRevById[supplierId]) {
      return;
    }

    dispatch(documentRevisionsActions.load(supplierId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId, dispatch]);

  return (
    <PODetailItem label="common.supplier" value={docRevById[supplierId]?.name} />
  );
};

export default POSupplier;

