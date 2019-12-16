import { FBDialogProps } from "../dialog";

export type FBValidatorFormProps = Partial<FBDialogProps> & {
    validators?: React.ReactNode[];
    onCustomClick?: () => void;
};
