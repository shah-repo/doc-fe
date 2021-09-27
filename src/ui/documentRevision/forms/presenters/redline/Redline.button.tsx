import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { companyActions } from "../../../../../state/ducks/company";
import Text from "../../../../components/Text";
import { FB } from "../../../../form.builder";

interface Props {
  isUserDocumentOwner: boolean;
  docTypeHasRedline: boolean;
}

const RedlineButton: React.FunctionComponent<Props> = ({
  isUserDocumentOwner,
  docTypeHasRedline,
}) => {
  const { workspaceState } = FB.useStores();
  const dispatch = useDispatch();

  const handleClick = () => {
    workspaceState?.setMode("formDesign");
    dispatch(companyActions.redlineConfig(true));
    dispatch(companyActions.autosaveConfig());
  };

  if (!isUserDocumentOwner || !docTypeHasRedline) {
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
