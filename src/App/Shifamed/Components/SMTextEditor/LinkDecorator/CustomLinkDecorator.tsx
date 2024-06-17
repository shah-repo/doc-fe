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

enum AnchorTarget {
  Self = '_self',
  Blank = '_blank',
  Parent = '_parent',
  Top = '_top',
}

const CustomLinkDecorator: React.FC<CustomLinkDecoratorProps> = ({
  contentState,
  entityKey,
  children,
}) => {
  const classes = SMEditorStyles();
  const { url, targetOption } = contentState.getEntity(entityKey).getData();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement, MouseEvent>,
    target?: AnchorTarget,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, target ?? AnchorTarget.Blank);
  };

  return (
    <a
      href={url}
      className={classes.customLinkDecorator}
      onClick={(evt) => handleClick(evt, targetOption)}
    >
      {children}
      <span className={classes.rdwLinkDecoratorIcon} onClick={handleClick}>
        <FontAwesomeIcon icon={solid('arrow-up-right-from-square')} />
      </span>
    </a>
  );
};

export default CustomLinkDecorator;
