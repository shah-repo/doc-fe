import { BoxProps } from "@material-ui/core";

export interface SMTemplateProps {
  /**
   * @cfg {Element | Element[]} Center panel.
   */
  children?: React.ReactNode | React.ReactNode[];
  /**
   * @cfg {Element} Top panel.
   */
  header?: React.ReactNode;
  /**
   * @cfg {Element} Bottom panel.
   */
  footer?: React.ReactNode;
  /**
   * @cfg {Element} Right panel.
   */
  rightSidebar?: React.ReactNode;
  /**
   * @cfg {Element} Left panel.
   */
  leftSidebar?: React.ReactNode;
  /**
   * @cfg {BoxProps} Box props for header container.
   */
  headerBoxProps?: BoxProps;
  /**
   * @cfg {BoxProps} Box props for left container.
   */
  leftSidebarBoxProps?: BoxProps;
}
