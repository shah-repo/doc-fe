import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FBForm, FBPOReceiveCreateLotProps, FBTextField } from "..";
import { documentTypeActions, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import { FormContext } from "../../components/forms/FormContext";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FBAutocomplete from "../FBAutocomplete/FBAutocomplete";


const FBPOReceiveCreateLot: React.FunctionComponent<FBPOReceiveCreateLotProps> = ({
  children,
  item,
}) => {
  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
  const [formIds, setFormIds] = useState<any>([]);

  const idAsync = useAsync<DocumentTypeById>({
    onSuccess: (documents) => {
      setFormIds(documents?.forms);
      if (isEmpty(documents?.forms)) {
        return;
      }
    },
  });

  const categoryAsync = useAsync<DocumentType[]>({
    onSuccess: () => {
      if (documentTypes.length === 1) {
        idAsync.start(getDocRevByIds, documentTypes[0].id, idAsync);
        return;
      }
    },
  });

  const handleDocTypeSelection = (e, value) => {
    if (!value?.value) {
      return;
    }
    idAsync.start(getDocRevByIds, value?.value, idAsync);
  };

  useEffect(() => {
    categoryAsync.start(getDocTypesByCategory, { category: "Lot" }, categoryAsync);
  }, []);

  return (
    <FBForm>
      <FormContext.Provider value={{ submitOnChange: false }}>
        <FBTextField
          label="form.builder.field.part.number.or.service"
          defaultValue={item?.partNumberDocId || item?.serviceId}
          disabled={true}
          hidden={!(item?.partNumberDocId || item?.serviceId)}
        />
        <FBTextField
          label="form.builder.field.supplier.part.number"
          defaultValue={item?.supplierPartNumber}
          disabled={true}
          hidden={!item?.supplierPartNumber}
        />
        <FBTextField
          label="form.builder.description"
          defaultValue={item?.partNumberTitle || item?.description}
          disabled={true}
        />
        <FBTextField
          label="form.builder.field.ordered"
          defaultValue={item?.order}
          disabled={true}
        />
        <Box display="flex" justifyContent="space-between">
          <Box width="100%" marginRight="10px">
            <FBTextField
              inputProps={{ type: "number", min: "0" }}
              defaultValue={item?.received}
              label="form.builder.quantity.received"
              name="received"
              rules="required|min:1"
            />
          </Box>
          <Box width="100%" marginLeft="10px">
            <FBTextField
              label="form.builder.field.units"
              defaultValue={item?.units}
              disabled={true}
            />
          </Box>
        </Box>
        <FBAutocomplete
          name="Lot-Type"
          placeholder="supplier.select.type"
          options={documentTypes.map((docType) => ({
            text: docType.documentTypeName,
            value: docType.id,
          }))}
          rules="required"
          onChange={handleDocTypeSelection}
        />
        {formIds.length > 0 && <FBAutocomplete
          name="Lot-Form"
          placeholder="supplier.select.form"
          options={formIds.map((form) => ({
            text: form.name,
            value: form.id,
          }))}
          rules="required"
        />}
        {children}
      </FormContext.Provider>
    </FBForm>
  );
};

export default FBPOReceiveCreateLot;
