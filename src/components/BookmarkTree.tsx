import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";

import {
  BookmarkGroup,
  BookmarkTreeProps,
  TreeItemsProps,
  TreeItemProps,
} from "@/types";

/*
function getFileIcon(item: Bookmark) {
  const url = item.url.toLowerCase()
  const title = item.title.toLowerCase()

  if (url.includes('github') || title.includes('code')) return FileCode
  if (url.includes('docs') || title.includes('doc')) return FileText
  if (url.includes('json') || title.includes('api')) return FileJson
  if (url.includes('blog') || title.includes('article')) return FilePen
  if (url.includes('download') || title.includes('download')) return FileArchive
  if (url.includes('type') || title.includes('type')) return FileType
  return FileText
}
*/

export function BookmarkTree({ items, onDelete }: BookmarkTreeProps) {
  return (
    <div className="w-full min-h-screen bg-[#1e1e1e] text-gray-300 p-2">
      <TreeItems items={items} level={0} onDelete={onDelete} />
    </div>
  );
}

function TreeItems({ items, level, onDelete }: TreeItemsProps) {
  return (
    <div className="space-y-[2px]">
      {items.map((item) => (
        <TreeItem key={item.id} item={item} level={level} onDelete={onDelete} />
      ))}
    </div>
  );
}

function TreeItem({ item, level, onDelete }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const hasChildren =
    "children" in item && item.children && item.children.length > 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      <div
        className={`
          relative flex items-center gap-1 px-2 py-1.5 rounded-sm select-none
          ${
            hasChildren
              ? "cursor-pointer hover:bg-gray-800/50"
              : "hover:bg-gray-800/30"
          }
          ${isExpanded && hasChildren ? "bg-gray-800/50" : ""}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5">
            {hasChildren ? (
              <button
                className="h-4 w-4 flex items-center justify-center hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}
            {hasChildren ? (
              <Folder className="h-4 w-4 text-gray-400 shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-gray-400 shrink-0" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {hasChildren ? (
              <span className="text-[13px] truncate">{item.title}</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[13px] truncate flex-1">
                  {item.title}
                </span>
                {isHovered && !hasChildren && (
                  <div className="flex items-center gap-1">
                    <a
                      href={"url" in item ? item.url : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-gray-700 rounded"
                      title="Visit URL"
                    >
                      <ExternalLink className="h-3 w-3 text-gray-400 hover:text-gray-200" />
                    </a>
                    <button
                      onClick={handleDelete}
                      className="p-1 hover:bg-gray-700 rounded group"
                      title="Delete bookmark"
                    >
                      <Trash2 className="h-3 w-3 text-gray-400 group-hover:text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <TreeItems
          items={(item as BookmarkGroup).children}
          level={level + 1}
          onDelete={onDelete}
        />
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-white mb-4">
              Are you sure you want to remove this bookmark?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
