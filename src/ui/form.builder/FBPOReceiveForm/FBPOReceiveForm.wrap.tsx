
import { isString } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
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

    const intl = useIntl();
    const lfpoDocType = useGetDocTypeByAcronym("LFPO");
    const lotDocType = useGetDocTypeByAcronym("LOT");
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { lfpoDocType, lotDocType, groupOptions, item }
    );
    const { dialogState, formState } = FB.useStores();

    handleReceive = async () => {
      try {
        await poReceiveFormState?.submit(formState?.getValues());

        dialogState?.closeDialog();
      } catch (e) {
        if (isString(e.message)) {
          alert(intl.formatMessage({ id: e.message }));
        }
      }
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleReceive,
    });
  };

  return (props: T) => Comp(props);
};
