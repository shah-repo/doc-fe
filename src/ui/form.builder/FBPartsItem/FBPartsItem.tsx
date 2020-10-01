import React from "react";
import { FBFieldName, FBMapWrapper, FBProcedureItemConfig, FBProcedureItemLocale, FBSection } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBText } from "../FBText";
import { FBPartsItemProps } from "./FBPartsItem.types";
import { withFBPartsItem } from "./FBPartsItem.wrap";

const FBParts: React.FunctionComponent<FBPartsItemProps> = ({
  getItem,
  collection = [],
  loading,
  name,
  type,
}) => (
  <>
    <FBSection
      label={FBProcedureItemLocale[type]}
      name={`${FBFieldName.MaterialSection}${name}`}
      {...{ loading }}
    />
    {!loading && (
      <FBMapWrapper<FBProcedureItemConfig[]> {...{ collection }}>
        {(item: FBProcedureItemConfig, index) => (
          <FBText
            key={`fb-part-${type}-${item.title}-${index}`}
            locale={`form.builder.procedure.${type}.title`}
            values={{
              title: getItem?.(item.title),
              quantity: item.quantity,
              unit: item.unit,
            }}
            boxProps={{
              bgcolor: Colors.light_blue,
              borderColor: Colors.medium_blue,
              border: 1,
              borderRadius: 4,
              padding: 1,
              fontWeight: "bold",
              mb: 2,
            }}
          />
        )}
      </FBMapWrapper>
    )}
  </>
);

export default withFBPartsItem(FBParts);
