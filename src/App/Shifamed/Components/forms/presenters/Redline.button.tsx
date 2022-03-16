import React from "react";
import { useDispatch } from "react-redux";
import { SM } from "../../../../../App";
import { companyActions } from "../../../../../state/ducks/company";
import Text from "../../../../../ui/components/Text";
import { StyledButton } from "./StyledListButton";

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
    <StyledButton
      color="primary"
      data-cy="redlineButton"
      onClick={() => handleClick()}
      id="Redline"
    >
      <Text translation="common.redline"/>
    </StyledButton>
  );
};

export default RedlineButton;
