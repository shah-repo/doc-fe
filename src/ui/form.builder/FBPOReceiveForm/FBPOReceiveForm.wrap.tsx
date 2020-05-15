
import { isString } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { FB, FBPOReceiveFormProps } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import useGetDocTypeByAcronym from "../../hooks/useGetDocTypeByAcronym";
import FBStore from "../stores/ui/FBStore";
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

    const dispatch = useDispatch();
    const intl = useIntl();
    const lfpoDocType = useGetDocTypeByAcronym("LFPO");
    const lotDocType = useGetDocTypeByAcronym("LOT");
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { lfpoDocType, lotDocType, groupOptions, item }
    );
    const { dialogState, formState, poReceiveState } = FB.useStores();

    handleReceive = async () => {
      try {
        await poReceiveFormState?.submit(
          formState?.getValues(),
          poReceiveState?.poDocumentId,
        );

        dispatch(documentRevisionsActions.reload(FBStore.docId));
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
