import { find } from "lodash";
import { action, observable, set } from "mobx";
import { FBBookmarkItem } from "..";

export class FBBookmarkState {
  @observable public bookmarks?: FBBookmarkItem[];
  @observable public loading?: boolean;

  public clear = () => set(this, "bookmarks", undefined);

  @action public setLoading = (state: boolean) => set(this, "loading", state);

  @action public addBookmark = (bookmark?: FBBookmarkItem, at?: number) => {
    if (!bookmark) { return; }
    const { name } = bookmark;
    const bookmarkItem = find(this.bookmarks, { name });
    if (bookmarkItem) { return; }
    at = at || this.bookmarks?.length || 0;
    const newBookmarks = this.bookmarks?.slice(0) || [];
    newBookmarks?.splice(at, 0, bookmark);
    set(this, "bookmarks", newBookmarks);
  };
}

export default FBBookmarkState;

