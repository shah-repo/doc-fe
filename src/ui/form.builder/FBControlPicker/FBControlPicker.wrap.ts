import { cloneDeep, each, map } from "lodash";
import { toJS } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBControlPickerProps, FBControlPickerState } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBControlPicker = <T extends FBControlPickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    controlPickerState,
    pickers,
    ...props
  }: T) => {
    const intl = useIntl();
    const { workspaceState } = FB.useStores();
    controlPickerState = FB.useRef<FBControlPickerState>(FBControlPickerState, workspaceState);
    const translatedPickers = {};
    const statePickers = controlPickerState?.pickers;
    useObserver(() => {
      const favourites =  cloneDeep(toJS(controlPickerState?.data)?.results) || [];
      const favouriteKeyMapping = {};
      each(favourites, (favourite) => {
        favouriteKeyMapping[favourite.fbComponent] = favourite.id;
      });
      each(["favourites"], (value) => {
        if (favourites.length) {
          translatedPickers[value] = map(favourites, (item) => ({
            label: intl.formatMessage({ id: `form.builder.${item.fbComponent}` }),
            key: item.fbComponent,
            isFavorite: true,
            id: item.id,
          }));
        }
      });
      each(Object.keys(statePickers), (value) => {
        translatedPickers[value] = map(controlPickerState?.pickers[value], (item) => ({
          label: intl.formatMessage({ id: `form.builder.${item}` }),
          key: item,
          isFavorite: favouriteKeyMapping[item] ? true : false,
          id: favouriteKeyMapping[item],
        }));
      });
    });
    return Component({
      ...(props as T),
      controlPickerState,
      pickers: translatedPickers,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
