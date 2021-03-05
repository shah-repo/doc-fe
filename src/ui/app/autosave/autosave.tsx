import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Permission } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import useGetHasPermission from "../../hooks/useGetHasPermission";

const AutosaveToggle: React.FunctionComponent<any> = (

) => {
  const dispatch = useDispatch();

  const canToggleAutosave = useGetHasPermission(Permission.DEVELOPERS);
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
