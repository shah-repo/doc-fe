import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import { FBApproversProps } from "./FBApprovers.types";


const FBApproversField: React.FunctionComponent<FBApproversProps> = ({
  disabled,
  ...props
}) =>  (
  <div>
    <React.Fragment>
      <FBAutocompleteAsync
        label="form.builder.approvers"
        name="approvers"
        placeholder="form.builder.approving.roles.placeholder"
        optionId={FBAutocompleteAsyncOption.approversByName}
        forceDefault = {true}
        optionValueType="id"
        multiple={true}
        defaultValue={[]}
        autosave={true}
        {...{ disabled }}
      />
    </React.Fragment>
  </div>
);

export default FBApproversField;
