import React from "react";
import { Link } from "react-router-dom";
import { FBFieldName, FBMapWrapper, FBProcedureItemConfig, FBProcedureItemLocale, FBSection } from "..";
import { DOCUMENT_REVISION_LIST_URL } from "../../constants/urls";
import Colors from "../../layout/theme/utils/colors";
import { FBText } from "../FBText";
import { FBPartsItemProps } from "./FBPartsItem.types";
import { withFBPartsItem } from "./FBPartsItem.wrap";

const FBParts: React.FunctionComponent<FBPartsItemProps> = ({
  getItem,
  getLink,
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
        {(item: FBProcedureItemConfig, index) => getLink?.(item.title)
          ? (
            <Link
              to={`${DOCUMENT_REVISION_LIST_URL}/${getLink?.(item.title)}/version/${item.title}`}
              target="_blank"
              style={{
                textDecoration: "none",
                color: "initial",
                fontWeight: "bold",
              }}
            >
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
            </Link>
          )
          : (
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
