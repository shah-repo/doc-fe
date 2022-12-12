import { cloneDeep, each, keys, map } from "lodash";
import { toJS } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBControlPickerProps, FBControlPickerState, FBInputType } from "..";
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
      const favouritePickers =  cloneDeep(toJS(controlPickerState?.data)?.results) || [];
      const favouriteKeyMapping = {};
      each(favouritePickers, (favouritePicker) => {
        favouriteKeyMapping[favouritePicker.fbComponent] = favouritePicker.id;
      });
      if (!controlPickerState?.loading && favouritePickers.length) {
        statePickers.favourites = keys(favouriteKeyMapping) as FBInputType[];
      }
      each(statePickers, (pickersList, pickerSection) => {
        translatedPickers[pickerSection] = map(pickersList, (pickerItem) => ({
          label: intl.formatMessage({ id: `form.builder.${pickerItem}` }),
          key: pickerItem,
          isFavorite: favouriteKeyMapping[pickerItem] ? true : false,
          id: favouriteKeyMapping[pickerItem],
        }));
      });
    });
    // Always show favourites on top and sort remaining sections
    let sortedSections = keys(translatedPickers);
    if (sortedSections.includes("favourites")) {
      sortedSections = [
        "favourites",
        ...sortedSections.filter((section) => section !== "favourites"),
      ];
    }
    const sortedPickers = {};
    each(sortedSections, (section) => {
      if (section) {
        sortedPickers[section] = translatedPickers[section];
      }
    });
    return Component({
      ...(props as T),
      controlPickerState,
      pickers: sortedPickers,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
