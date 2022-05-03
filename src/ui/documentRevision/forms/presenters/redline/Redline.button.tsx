import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { SM } from "../../../../../App";
import { StyledButton } from "../../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
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
  const isNewLayout = SM.isNewLayout;
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
  if (isNewLayout) {
    return (
      <StyledButton
        color="primary"
        data-cy="redlineButton"
        onClick={() => handleClick()}
        id="Redline"
      >
        <Text translation="common.redline" />
      </StyledButton>
    );
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
