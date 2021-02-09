import { Box } from "@material-ui/core";
import { cloneDeep, compact, concat, difference, filter, find, includes, isEmpty, last, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useMemo } from "react";
import { FB, FBApprover, FBApproversProps, FBApproversState, FBJoinedEmployee, FBOption, FBRequiredApprover } from "..";
import { checkIsDocumentPO } from "../../documentRevision/helpers/checkDocumentGroup";
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
    checkedGroups,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const schema = workspaceState?.getSchema();
    const { name: docRevName } = useMemo(() => find(schema, { type: "documentRevisions" }) || {}, [schema]);
    const docRevFormValue = formState?.getFieldValue(docRevName);
    const documentRevisions = useMemo(() => map(docRevFormValue, "proposedDocumentRevision.id"), [docRevFormValue]);
    const formValue = map(formState?.getFieldValue(name), "id");
    approversState = FB.useRef(FBApproversState, { documentRevisions, formValue });
    const isARforPO = Boolean(find(workspaceState?.changeRequest?.documentRevisions,
      (revision) => checkIsDocumentPO(revision.document?.documentType?.groupOptions)));

    React.useEffect(() => {
      reaction( // React on documentRevisions comp changes
        () => formState?.inputState.get(docRevName || "")?.value,
        (value) => getRequiredApprovers(cloneDeep(value)),
      );

      reaction( // React on approvers autocomplete changes
        () => formState?.inputState.get(name || "")?.value,
        (value) => {
          markGroupChecked(value);

          const approversWithSignatures = value?.map((approver) => ({
            approver: { id: approver.id || null },
            signatureGroupId: {
              id: find(approversState?.checkedGroups, (group) => group.groupApprover === approver.id)?.id || null,
            },
          })) || [];
          formState?.setFieldValue("approversWithSignatures", approversWithSignatures);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => approversState?.data,
        (response) => resetToInitialGroups(response),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetToInitialGroups = (requiredGroups) => {
      const initialApprovers = workspaceState?.changeRequest?.formInput?.approversWithSignatures;
      const initialIds = initialApprovers?.map((app) => app.signatureGroupId.id);
      const initialGroups = requiredGroups?.reduce((acc, group) => {
        if (includes(initialIds, group.id)) {
          acc.push({
            ...group,
            groupApprover: find(initialApprovers, (app) => app.signatureGroupId.id === group.id).approver.id,
          });
        }
        return acc;
      }, []);
      approversState?.setCheckedGroups(initialGroups || []);
    };

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

    isIncluded = (group: FBRequiredApprover): boolean => includes(map(approversState?.checkedGroups, "id"), group.id);

    /** Check/uncheck DAM/POAM required approval groups based on autocomplete selection
   * @selectedUsers Current autocomplete selection.
   */
    const markGroupChecked = (selectedUsers: FBOption[]) => {
      const previousSelectionIds = approversState?.value || [];
      const newSelectionIds = map(selectedUsers, "id");
      const requiredGroups = approversState?.data?.reverse();
      if (isARforPO) { // one user can fullfil only one signature requirement (POAM)
        if (!isEmpty(difference(newSelectionIds, previousSelectionIds))) { // user added
          const newUserId = last(difference(newSelectionIds, previousSelectionIds));
          const checkedGroup =
            find(requiredGroups, (group) =>
              includes(map((group.joinedEmployees as FBJoinedEmployee[]), "id"), newUserId)
              && !includes(approversState?.checkedGroups?.map((g) => g.id), group.id)) as FBRequiredApprover;
          if (!checkedGroup) {
            approversState?.setValue(newSelectionIds);
            return;
          }
          checkedGroup.groupApprover = newUserId;
          const newGroups = concat(approversState?.checkedGroups || [], checkedGroup);
          approversState?.setCheckedGroups(newGroups || []);
        } else if (!isEmpty(difference(previousSelectionIds, newSelectionIds))) { // user removed
          const removedUserId = last(difference(previousSelectionIds, newSelectionIds));
          const newGroups = approversState?.checkedGroups?.filter((group) => group.groupApprover !== removedUserId);
          approversState?.setCheckedGroups(newGroups || []);
        }
      } else { // user can fullfil all available signature requirements (DAM)
        const newGroups = filter(requiredGroups, (group) =>
          map((group.joinedEmployees as FBJoinedEmployee[]), "id").some((employee) => value?.includes(employee)));
        approversState?.setCheckedGroups(newGroups);
      }
      approversState?.setValue(newSelectionIds);
    };

    useObserver(() => {
      value = approversState?.value;
      groups = approversState?.groups;
      loading = approversState?.loading;
      checkedGroups = approversState?.checkedGroups;
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
