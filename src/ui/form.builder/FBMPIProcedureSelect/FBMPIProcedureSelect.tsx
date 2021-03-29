import { Observer } from "mobx-react";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBMPIProcedureSelectProps, FBProcedureItemType, FBQuantityUnitField } from "..";
import { withFBMPIProcedureSelect } from "./FBMPIProcedureSelect.wrap";

const FBMPIProcedureSelect: React.FunctionComponent<FBMPIProcedureSelectProps> = ({
  mpiProcedureSelectState,
  formState,
  children,
  unitDisabled = false,
  initialValues,
  type,
}) => (
  <FBForm {...{ formState }} >
    {type !== FBProcedureItemType.equipment
      ? (
        <Observer>
          {() => (
            <>
              <FBAutocomplete
                label="form.builder.lot.number"
                name="usedOverride"
                options={mpiProcedureSelectState?.lotsApi.data}
                loading={mpiProcedureSelectState?.lotsApi.loading}
                optionValueKey="id"
                optionLabelKey="document.docId"
                optionValueType="object"
                renderOption={(option) =>
                  `${option.document.docId} | ${option.precalc?.lot_part || ""} ${option.precalc?.revision || ""}`
                }
              />
              <FBQuantityUnitField gutter={false} {...{ initialValues, unitDisabled }} />
            </>
          )}
        </Observer>
      )
      : (
        <FBAutocompleteAsync
          label="form.builder.equipment"
          name="usedOverride"
          optionId={FBAutocompleteAsyncOption.releasedEquipment}
          optionValueKey="id"
          optionLabelKey="document.docId"
          optionValueType="id"
        />
      )}
    {children}
  </FBForm>
);

export default withFBMPIProcedureSelect(FBMPIProcedureSelect);
