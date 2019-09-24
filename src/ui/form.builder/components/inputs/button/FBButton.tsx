import { Button } from "@material-ui/core";
import Text from "../../../../components/Text";
import { withButtonDefaults } from "./utils/hoc";
import { FBButtonProps } from "./utils/types";

const FBButon: React.FunctionComponent<FBButtonProps> = ({
  label,
  ...props
}) => (
  <Button {...props}>
    <Text message={label} />
  </Button>
);

export default withButtonDefaults(FBButon);
