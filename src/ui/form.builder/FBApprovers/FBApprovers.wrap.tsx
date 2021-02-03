import { Box } from "@material-ui/core";
import { cloneDeep, compact, find, isEmpty, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useMemo } from "react";
import { FB, FBApprover, FBApproversProps, FBApproversState, FBRequiredApprover } from "..";
import { FBDocumentRevisionsValue } from "../FBDocumentRevisions";

export const withFBApprovers = <T extends FBApproversProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    renderOption,
    isIncluded,
    approversState,
    name,
    loading,
    value,
    groups,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const schema = workspaceState?.getSchema();
    const { name: docRevName } = useMemo(() => find(schema, { type: "documentRevisions" }) || {}, [schema]);
    const docRevFormValue = formState?.getFieldValue(docRevName);
    const documentRevisions = useMemo(() => map(docRevFormValue, "proposedDocumentRevision.id"), [docRevFormValue]);
    const formValue = map(formState?.getFieldValue(name), "id");
    approversState = FB.useRef(FBApproversState, { documentRevisions, formValue });

    React.useEffect(() => {
      reaction( // React on documentRevisions comp changes
        () => formState?.inputState.get(docRevName || "")?.value,
        (value) => getRequiredApprovers(cloneDeep(value)),
      );

      reaction( // React on approvers autocomplete changes
        () => formState?.inputState.get(name || "")?.value,
        (value) => {
          console.log(value);
          approversState?.setValue(map(value, "id"));
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getRequiredApprovers(documentRevisions: FBDocumentRevisionsValue[]) {
      const ids: string[] = map(documentRevisions, "proposedDocumentRevision.id");
      approversState?.fetchRequiredApprovers(ids);
    }

    function includesApprover(group: FBRequiredApprover, approver: string): boolean {
      return (group.joinedEmployees as string[]).includes(approver);
    }

    // eslint-disable-next-line react/display-name
    renderOption = (option: FBApprover) => {
      const requiredGroups: string [] =
        compact(map(groups, (group) => includesApprover(group, option.id) ? group.name : ""));
      return (
        <Box display="flex" key={`fb-required-approver-${option.id}`}>
          <b>{option.user?.name}</b>&nbsp; ({option.user?.email})
          {!isEmpty(requiredGroups) && (
            <Box>
              &nbsp;{`- ${requiredGroups.join(", ")}`}
            </Box>
          )}
        </Box>
      );
    };

    isIncluded = (group: FBRequiredApprover): boolean =>
      group.joinedEmployees.some((employee) => (value || []).includes(employee));

    useObserver(() => {
      value = approversState?.value;
      groups = approversState?.groups;
      loading = approversState?.loading;
    });

    return Component({
      ...(props as T),
      renderOption,
      isIncluded,
      loading,
      name,
      value,
      groups,
    });
  };

  Comp.displayName = "withFBApprovers";
  return Comp;
};
