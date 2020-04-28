
import React from "react";
import { useSelector } from "react-redux";
import { FB, FBPOReceiveFormProps } from "..";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import useGetDocTypeByAcronym from "../../hooks/useGetDocTypeByAcronym";
import FBPOReceiveFormState from "./FBPOReceiveForm.state";

export const withFBPOReceiveForm = <T extends FBPOReceiveFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleReceive,
    item,
    ...props
  }: T) => {

    const docType = useGetDocTypeByAcronym("LFPO");
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { docType, groupOptions, item }
    );
    const { dialogState, formState } = FB.useStores();

    handleReceive = () => {
      try {
        // TODO: check why name is undefined
        poReceiveFormState?.submit(formState?.getValues());

        dialogState?.closeDialog();
      } catch {}
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleReceive,
    });
  };

  return (props: T) => Comp(props);
};
