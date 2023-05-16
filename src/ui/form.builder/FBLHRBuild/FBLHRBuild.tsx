import { Observer } from 'mobx-react';
import React from 'react';
import { FBLHRBuildProps } from '..';
import { SMDialogAction, SMText } from '../../../App';
import SMDialog from '../../../App/Shifamed/Components/SMDialog/SMDialog';
import FBRadioGroup from '../FBRadioGroup/FBRadioGroup';
import { withFBLHRBuild } from './FBLHRBuild.wrap';

const FBLHRBuild: React.FunctionComponent<FBLHRBuildProps> = ({
  onDialogActionClick,
  lhrBuildState,
  name,
  buildValidationRules,
  ...props
}) => (
  <>
    <SMDialog
      title="form.builder.build.title"
      actions={[SMDialogAction.cancel, SMDialogAction.lhrBuildSwitch]}
      {...{ onDialogActionClick }}
    >
      <SMText
        label={{
          locale: 'form.builder.build.production.msg',
          values: {
            prod: 'form.builder.Production',
            rd: 'form.builder.R&D',
          },
        }}
      />
    </SMDialog>
    <Observer>
      {() => (
        <FBRadioGroup
          name={name}
          type="lhrbuild"
          controlValue={lhrBuildState?.value}
          disabled={lhrBuildState?.disabled}
          label="form.builder.build.type"
          options={lhrBuildState?.options}
          rules={buildValidationRules}
          {...props }
        />
      )}
    </Observer>
  </>
);

export default withFBLHRBuild(FBLHRBuild);
