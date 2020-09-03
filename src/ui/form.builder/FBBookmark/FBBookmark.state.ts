import { filter, isUndefined } from "lodash";
import { action, observable, set } from "mobx";
import { FBBookmarkItem } from "..";

export class FBBookmarkState {
  @observable public bookmarks?: FBBookmarkItem[];
  @observable public loading?: boolean;

  @action public setLoading = (state: boolean) => set(this, "loading", state);

  @action public addBookmark = (bookmark?: FBBookmarkItem, at?: number) => {
    if (!bookmark) { return; }
    const { name } = bookmark;
    let newBookmarks = filter(this.bookmarks, (bookmark) => bookmark.name !== name);
    at = isUndefined(at) ? (newBookmarks.length || 0) : at;
    newBookmarks = newBookmarks.slice(0) || [];
    newBookmarks?.splice(at, 0, bookmark);
    set(this, "bookmarks", newBookmarks);
  };
}

export default FBBookmarkState;

