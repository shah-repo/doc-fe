import React from "react";
import { Link } from "react-router-dom";
import {
  FBConditionalWrapper,
  FBFieldName,
  FBMapWrapper,


  FBPartItemStatusBg,

  FBPartItemStatusBorder, FBPartsItemProps, FBProcedureItemConfig,
  FBProcedureItemLocale,
  FBSection,
} from "..";
import { FBText } from "../FBText";
import { withFBPartsItem } from "./FBPartsItem.wrap";

const FBParts: React.FunctionComponent<FBPartsItemProps> = ({
  getItem,
  getItemUrl,
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
          <FBConditionalWrapper
            condition={Boolean(getItemUrl?.(item.title))}
            wrapper={(child) => (
              <Link
                to={getItemUrl?.(item.title) as string}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "initial",
                  fontWeight: "bold",
                }}
              >
                {child}
              </Link>
            )}
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
                bgcolor: FBPartItemStatusBg[(item.status || "none")],
                borderColor: FBPartItemStatusBorder[(item.status || "none")],
                border: 1,
                borderRadius: 4,
                padding: 1,
                fontWeight: "bold",
                mb: 2,
              }}
            />
          </FBConditionalWrapper>
        )}
      </FBMapWrapper>

    )}
  </>
);

export default withFBPartsItem(FBParts);
