import React, { memo } from 'react';
import { FBAutocomplete, FBAutocompleteAsyncProps } from '..';
import { styles } from '../styles/FBAutocomplete.styles';
import { withFBAutocompleteAsync } from './FBAutocompleteAsync.wrap';
import ValueLinks from './components/ValueLinks';

const FBAutocompleteAsync: React.FC<FBAutocompleteAsyncProps> = ({
  options,
  defaultValue,
  forceNewRender,
  ...props
}) => {
  return (
    <>
      {!options && !forceNewRender && (
        <FBAutocomplete
          {...props}
          disabled={true}
          inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
          labelProps={styles.labelProps}
          inputPropStyleSize="small"
        />
      )}
      {!options && forceNewRender && (
        <FBAutocomplete
          {...props}
          disabled={true}
          inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
          labelProps={styles.labelProps}
          inputPropStyleSize="small"
        />
      )}
      {options && !forceNewRender && (
        <FBAutocomplete
          {...props}
          {...{ options, defaultValue }}
          inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
          labelProps={styles.labelProps}
          inputPropStyleSize="small"
        />
      )}
      {options && forceNewRender && (
        <FBAutocomplete
          {...props}
          {...{ options, defaultValue }}
          inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
          labelProps={styles.labelProps}
          inputPropStyleSize="small"
        />
      )}
      <ValueLinks
        name={props.name}
        optionId={props.optionId}
        state={props.autocompleteAsyncState}
      />
    </>
  );
};

export default memo(withFBAutocompleteAsync(FBAutocompleteAsync));
