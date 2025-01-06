import { useEffect, useState } from "react";
import _ from "lodash";
import { BookmarkTree } from "@/components/BookmarkTree";

import { BookmarkGroup, Bookmark } from "@/types";
import { Chrome } from "lucide-react";

function SidePanel() {
  const [allBookmarks, setAllBookmarks] = useState<BookmarkGroup>();
  const [groupedBookmarks, setGroupedBookmarks] = useState<BookmarkGroup[]>([]);
  const [flatBookmarks, setFlatBookmarks] = useState<Bookmark[]>([]);

  const deleteBookmark = (id: string) => {
    console.log("Delete Bookmark:", id);
  };

  useEffect(() => {
    function flattenBookmarks(group: BookmarkGroup | Bookmark): Bookmark[] {
      if (!("children" in group)) {
        return [
          _.omit(group, [
            "dateAdded",
            "dateLastUsed",
            "dateGroupModified",
            "index",
          ]) as Bookmark,
        ];
      }

      const children = group.children || [];
      return _.flatMap(children, flattenBookmarks);
    }

    function groupBookmarks(group: BookmarkGroup): BookmarkGroup[] {
      if (!("children" in group)) return [];

      return (group.children || []).map((child) => {
        if ("children" in child) {
          return {
            ..._.omit(child, [
              "dateAdded",
              "dateLastUsed",
              "dateGroupModified",
              "index",
            ]),
            children: groupBookmarks(child),
          } as BookmarkGroup;
        }

        return _.omit(child, ["dateAdded", "dateLastUsed"]) as Bookmark;
      }) as BookmarkGroup[];
    }

    async function fetchBookmarks() {
      const bookmarks = await chrome.bookmarks.getTree();
      const rootGroup = bookmarks[0].children[0] as BookmarkGroup;
      setAllBookmarks(rootGroup);

      // Flatten nested bookmarks
      const flattenedBookmarks = flattenBookmarks(rootGroup);
      setFlatBookmarks(flattenedBookmarks);

      // Group bookmarks / Filter All Bookmarks
      const grouped = groupBookmarks(rootGroup);
      setGroupedBookmarks(grouped);

      // Store the original bookmarks only the first time
      const storedBookmarks = await chrome.storage.local.get("allBookmarks");
      if (!storedBookmarks.allBookmarks) {
        await chrome.storage.local.set({ allBookmarks: rootGroup });
      }
    }
    fetchBookmarks();
  }, []);

  useEffect(() => {
    async function fetchLocalBookmarks() {
      const storedBookmarks = await chrome.storage.local.get("allBookmarks");
      if (storedBookmarks.allBookmarks) {
        setAllBookmarks(storedBookmarks.allBookmarks);
      }
    }

    fetchLocalBookmarks();
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <BookmarkTree items={groupedBookmarks} onDelete={deleteBookmark} />
    </div>
  );
}

export default SidePanel;
