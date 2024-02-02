import React, { useRef } from 'react';
import { Attachment } from '../../../../state/ducks/attachments/types';

type AttachmentSliderMethod = React.Dispatch<React.SetStateAction<Attachment | undefined>>;

interface AttachmentSliderContextProps {
  setFile: AttachmentSliderMethod | undefined
  setAttachmentSlider: (sliderMethod: AttachmentSliderMethod) => void
}

export const AttachmentSliderContext = React.createContext<AttachmentSliderContextProps>({} as AttachmentSliderContextProps);

const AttachmentSlideProvider: React.FC = ({ children }) => {
  const attachmentSliderMethod = useRef <AttachmentSliderMethod>();
  const setAttachmentSlider = (sliderMethod: AttachmentSliderMethod) => {
    attachmentSliderMethod.current = sliderMethod;
  };
  return (
    <AttachmentSliderContext.Provider value={{ setFile: attachmentSliderMethod.current, setAttachmentSlider }}>
      {children}
    </AttachmentSliderContext.Provider>
  );
};

export default AttachmentSlideProvider;
