import React from "react";
import { withFBSupplier } from "./FBSupplier.wrap";


const FBSupplier: React.FunctionComponent<any> = ({
}) => (
  <div>
    Supplier field
  </div>
);

export default withFBSupplier(FBSupplier);
