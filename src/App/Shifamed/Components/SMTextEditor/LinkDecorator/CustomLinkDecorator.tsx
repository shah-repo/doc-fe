import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContentState } from 'draft-js';
import React from 'react';
import { SMEditorStyles } from '../SMTextEditor.styles';

interface CustomLinkDecoratorProps {
  contentState: ContentState
  entityKey: string
  children: React.ReactNode
  readOnly?: boolean
}

const CustomLinkDecorator: React.FC<CustomLinkDecoratorProps> = ({
  contentState,
  entityKey,
  children,
}) => {
  const classes = SMEditorStyles();
  const { url, targetOption } = contentState.getEntity(entityKey).getData();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    window.open(url, '_blank');
  };

  return (
    <a
      href={url}
      className={classes.customLinkDecorator}
      target={targetOption}
    >
      {children}
      <span className={classes.rdwLinkDecoratorIcon} onClick={handleClick}>
        <FontAwesomeIcon icon={solid('arrow-up-right-from-square')} />
      </span>
    </a>
  );
};

export default CustomLinkDecorator;
