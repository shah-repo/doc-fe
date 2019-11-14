import { observer } from "mobx-react";
import React from "react";
import { getValidators } from "../../../app/RemoteValidators";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBTransportSchema from "../../components/custom/FBTransportSchema";
import FBForm from "../../components/form/FBForm";
import FBStore from "../../stores/FBStore";
import FBValidatorStore from "../../stores/FBValidatorStore";
import { FBValidatorGroup } from "../../types/editor";
import { FBTemplateSchema } from "../../types/store";
import { FBValidatorInstanceProps } from "../../types/validator";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";

const FBWorkspace: React.FunctionComponent<{}> = () => {
  const { schema, mode } = FBStore;
  const isStarter = (mode === "design") && (schema.length === 0);
  // validatorCollection.fetch();

  getValidators().then((available) => {
    const storeData: FBValidatorGroup[] = [];
    const validators = available.availableValidators;
    Object.keys(validators).map((k) => {
      storeData.push({
        name: k,
        fields: validators[k].fields.map((field: FBValidatorInstanceProps) => {
          return {
            type: field.type,
            ...field.props,
            metadata: field.validatorMetadata.fieldKey,
          } as Partial<FBTemplateSchema>;
        }),
      });
    });

    FBValidatorStore.validatorGroups = storeData;
  });

  return (
    <FBForm initialValues={FBStore.values}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && <FBSortableContainer items={schema} />}
      <FBTransportSchema />
      <FBEditorDialog />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default observer(FBWorkspace);
