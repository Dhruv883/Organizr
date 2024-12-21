export interface BaseBookmark {
  id: string;
  parentId: string;
  title: string;
}

export interface Bookmark extends BaseBookmark {
  url?: string;
}

export interface BookmarkGroup extends BaseBookmark {
  children?: Bookmark[] | BookmarkGroup[];
}

export interface BookmarkTreeProps {
  items: (Bookmark | BookmarkGroup)[];
  onDelete: (id: string) => void;
}

export interface TreeItemsProps {
  items: (Bookmark | BookmarkGroup)[];
  level: number;
  onDelete: (id: string) => void;
}

export interface TreeItemProps {
  item: Bookmark | BookmarkGroup;
  level: number;
  onDelete: (id: string) => void;
}
