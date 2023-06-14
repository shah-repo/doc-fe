import { SMBoxProps } from '../../..';

export interface SMTemplateProps {
  /**
   * @cfg {Element | Element[]} Center panel.
   */
  children?: React.ReactNode | React.ReactNode[]
  /**
   * @cfg {Element} Top panel.
   */
  header?: React.ReactNode
  /**
   * @cfg {Element} LHR step panel.
   */
  lhrSteps?: React.ReactNode
  /**
   * @cfg {Element} Bottom panel.
   */
  footer?: React.ReactNode
  /**
   * @cfg {Element} Right panel.
   */
  rightSidebar?: React.ReactNode
  /**
   * @cfg {Element} Left panel.
   */
  leftSidebar?: React.ReactNode
  /**
   * @cfg {BoxProps} Box props for header container.
   */
  headerBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for footer container.
   */
  footerBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for left container.
   */
  leftSidebarBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for right container.
   */
  rightSidebarBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for content.
   */
  contentBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for template.
   */
  templateBoxProps?: SMBoxProps
  /**
   * @cfg {BoxProps} Box props for template.
   */
  boxProps?: SMBoxProps
}
