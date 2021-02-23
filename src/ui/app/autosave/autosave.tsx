import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupTag } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import useGetHasTag from "../../hooks/useGetHasTag";

const AutosaveToggle: React.FunctionComponent<any> = (

) => {
  const dispatch = useDispatch();

  // TODO: Change to correct tag when BE is done
  const canToggleAutosave = useGetHasTag(GroupTag.GROUP_MANAGEMENT);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);

  if (!canToggleAutosave) {
    return null;
  }

  return (
    <FormControlLabel
      control={<Switch
        name="toggleAutosave"
        checked={autosaveEnabled}
        onChange={() => { dispatch(companyActions.autosaveConfig()); }}
      />}
      label="Toggle Autosave"
    />
  );
}
;

export default AutosaveToggle;
