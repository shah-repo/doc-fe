import { FBButtonProps, FBHelloSignState, FBInputProps } from "..";

export interface FBHelloSignPayload {
  documentRevision: {
    id: string;
  };
}

export type FBHelloSignProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& Pick<FBButtonProps, "onClick">
& {
  helloSignState?: FBHelloSignState;
  buttonLabel?: string;
  waitOverlay?: boolean;
  loadingMessage?: string;
  signatureSent?: boolean;
  signatureSentMessage?: string;
};
