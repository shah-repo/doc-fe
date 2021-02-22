import { Box, Button } from "@material-ui/core";
import React from "react";
import { companyActions } from "../../../state/ducks/company";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface OwnProps {
  helloSignStatus: boolean;
}

type Props = OwnProps;

const HelloSignAccess: React.FunctionComponent<Props> = ({
  helloSignStatus,
}) => {
  const async = useAsync();
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const handleHelloSignAccess = (value: boolean) => {
    async.start(changeCompanyAction, { helloSignIntegrationEnabled: value }, async);
  };

  return (
    <Box mt={2}>
      <Button
        variant="outlined"
        color="primary"
        style={{ margin: "0px" }}
        onClick={() => handleHelloSignAccess(!helloSignStatus)}
        id="DialogContent-helloSignAccess"
      >
        <Text
          translation={!helloSignStatus ? "common.hello.sign.enable" : "common.hello.sign.disable"}
        />
      </Button>
    </Box>
  );
};

export default HelloSignAccess;
