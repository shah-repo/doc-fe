import { ButtonProps } from '@material-ui/core';

export type FBWorkspaceTplActionsProps =
& {
  handleCancel?: ButtonProps['onClick']
  handleTplName?: () => any
};
