import React from 'react';
import { Attachment } from '../../../../state/ducks/attachments/types';

type AttachmentSliderMethod = React.Dispatch<React.SetStateAction<Attachment | undefined>>;

interface AttachmentSliderContextProps {
  setFile: AttachmentSliderMethod | undefined
}

interface Props {
  setSelectedAttachment: AttachmentSliderMethod
}

export const AttachmentSliderContext = React.createContext<AttachmentSliderContextProps>({} as AttachmentSliderContextProps);

const AttachmentSlideProvider: React.FC<Props> = ({ children, setSelectedAttachment }) =>
  (
    <AttachmentSliderContext.Provider value={{ setFile: setSelectedAttachment }}>
      {children}
    </AttachmentSliderContext.Provider>
  );

export default AttachmentSlideProvider;
