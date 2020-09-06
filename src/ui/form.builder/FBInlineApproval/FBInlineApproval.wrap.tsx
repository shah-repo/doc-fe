import { map, unionBy } from "lodash";
import { autorun } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprover, FBGroup, FBInlineApprovalOptions, FBInlineApprovalOptionType, FBInlineApprovalProps, FBInlineApprovalState } from "..";

export const withFBInlineApproval = <T extends FBInlineApprovalProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    inlineApprovalState,
    options,
    defaultValue,
    defaultValue: { approvers, groups, roles } = {},
    ...props
  }: T) => {

    inlineApprovalState = FB.useRef(FBInlineApprovalState);

    React.useEffect(() => autorun(() => {
      const value = inlineApprovalState?.approversApi.sliceValue(approvers as string[]);
      concatOptions(value, "Approvers");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => autorun(() => {
      const value: FBGroup[] = inlineApprovalState?.groupsApi.sliceValue(groups as string[]);
      const options: FBApprover[] = map(value, "employees").reduce((c, v) => c.concat(v), []);
      concatOptions(options, "Groups");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => autorun(() => {
      const value = inlineApprovalState?.rolesApi.sliceValue(roles as string[]);
      const options: FBApprover[] = map(value, "joinedEmployees").reduce((c, v) => c.concat(v), []);
      concatOptions(options, "Roles");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    function concatOptions(approvers: FBApprover[], type: FBInlineApprovalOptionType) {
      let options = map(approvers, (o) => ({ ...o.user, type }));
      options = unionBy(inlineApprovalState?.options || [], options, "id");
      inlineApprovalState?.setOptions(options as FBInlineApprovalOptions[]);
    }

    useObserver(() => {
      options = inlineApprovalState?.options;
    });

    return Component({
      ...(props as T),
      options,
      defaultValue,
    });
  };

  Comp.displayName = "withFBInlineApproval";
  return Comp;
};
