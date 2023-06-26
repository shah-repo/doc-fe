import { BasicButtonKinds, ButtonKindToVariantMap, ButtonVariantProps } from './Button.types';

const STYLE_PROPS: ButtonKindToVariantMap<BasicButtonKinds> = {
  primary: ['contained', 'primary'],
  secondary: ['contained', 'secondary'],
  outlined: ['outlined', 'primary'],
  ghost: ['text', 'primary'],
  white: ['text', 'secondary'],
};
const DEFAULT_PROPS: ButtonVariantProps = ['contained', 'primary'];

export const useButtonType = <T extends string | undefined>(kind?: string, additional?: ButtonKindToVariantMap<Exclude<T, undefined>>): ButtonVariantProps => {
  const allKinds = {
    ...STYLE_PROPS,
    ...additional,
  };
  return kind && allKinds[kind]
    ? allKinds[kind]
    : DEFAULT_PROPS;
};
