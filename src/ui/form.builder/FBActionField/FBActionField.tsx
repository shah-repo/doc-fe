import React from 'react';
import { FBActionFieldProps, FBActionOptionProps, FBButton, FBDialog, FBMapWrapper, FBProvider } from '..';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBActionField } from './FBActionField.wrap';

const FBActionField: React.FunctionComponent<FBActionFieldProps> = ({
  handleAction,
  dialogState,
  options = [],
  disabled,
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBMapWrapper<FBActionOptionProps[]> collection={options}>
      {(action: FBActionOptionProps, index) => (
        <>
          {action && <FBButton
            key={`fb-action-option-${action?.name}-${index}`}
            label={action?.actionLabel}
            onClick={() => handleAction && handleAction(action)}
            {...{ disabled }}
            style={FBFontStyle.font}
          />}
        </>
      )}
    </FBMapWrapper>
  </FBProvider>
);

export default withFBActionField(FBActionField);
