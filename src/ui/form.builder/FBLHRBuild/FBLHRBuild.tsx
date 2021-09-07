import { Observer } from "mobx-react";
import React from "react";
import { FBData, FBLHRBuildProps } from "..";
import { SMDialogAction, SMText } from "../../../App";
import SMDialog from "../../../App/Shifamed/Components/SMDialog/SMDialog";
import FBRadioGroup from "../FBRadioGroup/FBRadioGroup";
import { withFBLHRBuild } from "./FBLHRBuild.wrap";

const FBLHRBuild: React.FunctionComponent<FBLHRBuildProps> = ({
  onDialogActionClick,
  lhrBuildState,
  name,
  ...props
}) => (
  <>
    <SMDialog
      title="form.builder.build.title"
      actions={[SMDialogAction.close, SMDialogAction.done]}
      {...{ onDialogActionClick }}
    >
      <SMText
        locale="form.builder.build.production.msg"
      />
    </SMDialog>
    <Observer>
      {() => (
        <FBRadioGroup
          type="lhrbuild"
          {...props }
          controlValue={lhrBuildState?.value}
          disabled={lhrBuildState?.disabled}
          label="form.builder.build.type"
          options={FBData.lhrBuildOptions}
        />
      )}
    </Observer>
  </>
);

export default withFBLHRBuild(FBLHRBuild);
