import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";

interface Props {
  supplierId: string;
}

export const POSupplier: React.FunctionComponent<Props> = ({
  supplierId,
}) => {
  const dispatch = useDispatch();
  const docRevById = useSelector(documentRevisionsSelectors.byId);
  useEffect(() => {
    if (!supplierId || docRevById[supplierId]) {
      return;
    }

    dispatch(documentRevisionsActions.load(supplierId));
  }, [supplierId, docRevById, dispatch]);

  return (
    <Box marginBottom="5px">
      <Box component="span" fontWeight="fontWeightBold">
        <Text translation="common.supplier" />
        {": "}
      </Box>
      <Box component="span">{docRevById[supplierId]?.name}</Box>
    </Box>
  );
};

export default POSupplier;

