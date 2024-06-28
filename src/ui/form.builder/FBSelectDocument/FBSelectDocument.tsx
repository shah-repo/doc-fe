import React from 'react';
import { FB, FBAutocompleteAsync, FBInputProps } from '..';

const FBSelectDocument: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => {
  const { isOutput } = FB.useStores().workspaceState || {};
  return (
    <>
      {isOutput && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <FBAutocompleteAsync
          {...props}
          selectedOptions={options as string[]}
          multiple={true}
          optionId="1"
        />
      )}
      {!isOutput && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <FBAutocompleteAsync
          {...props}
          multiple={true}
          optionId="1"
          value={options}
          // defaultValue={options}
        />
      )}
    </>
  );
};

export default FBSelectDocument;
