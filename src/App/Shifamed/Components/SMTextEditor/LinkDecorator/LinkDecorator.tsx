import { DraftDecorator } from 'draft-js';
import CustomLinkDecorator from './CustomLinkDecorator';

export const linkDecorator: DraftDecorator = {
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null
        && contentState.getEntity(entityKey).getType() === 'LINK'
      );
    }, callback);
  },
  component: CustomLinkDecorator,
};
