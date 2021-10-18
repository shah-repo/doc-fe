import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Permission } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import useGetHasPermission from "../../hooks/useGetHasPermission";
import Colors from "../../layout/theme/utils/colors";

const AutosaveToggle: React.FunctionComponent<any> = (

) => {
  const dispatch = useDispatch();

  const canToggleAutosave = useGetHasPermission(Permission.DEVELOPERS);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);

  if (!canToggleAutosave) {
    return null;
  }
  const style = {
    color: Colors.white,
    fontSize: "12px",
  };

  return (
    <FormControlLabel
      control={<Switch
        name="toggleAutosave"
        checked={autosaveEnabled}
        onChange={() => { dispatch(companyActions.autosaveConfig()); }}
      />}
      style={style}
      label="Toggle Autosave"
    />
  );
}
;

export default AutosaveToggle;
