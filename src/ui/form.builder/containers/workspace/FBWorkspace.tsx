import { Provider } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../state/ducks/company";
import useDialog from "../../../hooks/useDialog";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBTransportSchema from "../../components/custom/FBTransportSchema";
import FBButton from "../../components/inputs/FBButton";
import FBDialog from "../../FBDialog";
import FBFormMarkDown from "../../FBFormMarkDown";
import { withWorkspace } from "../../hocs/withWorkspace";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import editorStore from "../../stores/ui/FBEditorStore";
import FBStore from "../../stores/ui/FBStore";
import { FBWorkspaceProps } from "../../types/workspace";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";
import ViewValidatorPresenter from "./ViewValidator.presenter";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  includeTransport = true,
  dialogState,
  isStarter = true,
  schema = [],
  form,
}) => {
  const dialog = useDialog();
  const openDialog = () => dialog.open();
  const closeDialog = () => {
    FBStore.setMode("design");
    FBDynamicValidatorStore.helperText = {};
    form?.setValues({});
    FBStore.setValues({});
    FBStore.setSchema(schema);
    dialog.close();
  };
  const onClickView = () => {
    FBStore.setMode("form");
    openDialog();
    FBDynamicValidatorStore.registerValidators();
    FBDynamicValidatorStore.validate();
  };
  const isHelloSignIntegrationEnabled = useSelector(companySelectors.isHelloSignIntegrationEnabled);

  useEffect(() => {
    editorStore.isHelloSignIntegrationEnabled = isHelloSignIntegrationEnabled;
  }, [isHelloSignIntegrationEnabled]);

  return (
    <Provider {...{ dialogState }}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && <FBSortableContainer items={schema} />}
      {includeTransport && <FBTransportSchema />}
      {FBStore.mode === "design" && (
        <FBButton
          label="View"
          onClick={onClickView}
          id="FBWorkspace-clickView"
        />
      )}
      <ViewValidatorPresenter
        isOpen={dialog.isOpen}
        closeDialog={closeDialog}
        schema={schema}
      />
      <FBFormMarkDown />
      <FBEditorDialog />
      <FBDialog />
    </Provider>
  );
};

export default withWorkspace(FBWorkspace);
