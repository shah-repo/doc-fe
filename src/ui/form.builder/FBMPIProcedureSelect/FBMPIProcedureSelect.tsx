import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBMPIProcedureSelectProps, FBProcedureItemType, FBQuantityUnitField, FBTextField } from "..";
import { FBClasses } from "../defaults/layout";
import { withFBMPIProcedureSelect } from "./FBMPIProcedureSelect.wrap";

const FBMPIProcedureSelect: React.FunctionComponent<FBMPIProcedureSelectProps> = ({
  mpiProcedureSelectState,
  formState,
  children,
  initialValues,
  type,
}) => (
  <FBForm {...{ formState }} >
    <FBTextField name="title" label="form.builder.title" className={FBClasses.inputPreview}  />
    <Box fontWeight="fontWeightMedium" borderBottom={1} pb={0.5} mb={5}>
      {type === FBProcedureItemType.equipment ? "Equipment" : "Lot"}
    </Box>
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
                optionValueType="id"
              />
              <FBQuantityUnitField gutter={false} />
            </>
          )}
        </Observer>
      )
      : (
        <FBAutocompleteAsync
          label="form.builder.equipment"
          name="usedOverride"
          optionId={FBAutocompleteAsyncOption.equipment}
        />
      )}
    {children}
  </FBForm>
);

export default withFBMPIProcedureSelect(FBMPIProcedureSelect);
