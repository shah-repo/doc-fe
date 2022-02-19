import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { SM } from "../../../../../App";
import { companyActions } from "../../../../../state/ducks/company";
import Text from "../../../../components/Text";

interface Props {
  isUserDocumentOwner: boolean;
  docTypeHasRedline: boolean;
  isLHRProductionBuild: boolean;
}

const RedlineButton: React.FunctionComponent<Props> = ({
  isUserDocumentOwner,
  docTypeHasRedline,
  isLHRProductionBuild,
}) => {
  const { _formState } = SM.useStores();
  const dispatch = useDispatch();

  const handleClick = () => {
    _formState?.setMode("formDesign");
    dispatch(companyActions.redlineConfig(true));
    dispatch(companyActions.autosaveConfig());
  };

  if (!isUserDocumentOwner || !docTypeHasRedline || isLHRProductionBuild) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleClick()}
        id="Redline"
      >
        <Text translation="common.redline"/>
      </Button>
    </>
  );
};

export default RedlineButton;
