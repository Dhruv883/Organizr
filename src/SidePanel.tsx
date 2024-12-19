import { useEffect, useState } from "react";
import _ from "lodash";

interface BaseBookmark {
  id: string;
  parentId: string;
  title: string;
}

interface Bookmark extends BaseBookmark {
  url?: string;
}

interface BookmarkGroup extends BaseBookmark {
  children?: Bookmark[] | BookmarkGroup[];
}

function SidePanel() {
  const [allBookmarks, setAllBookmarks] = useState<BookmarkGroup>();
  const [groupedBookmarks, setGroupedBookmarks] = useState<BookmarkGroup[]>([]);
  const [flatBookmarks, setFlatBookmarks] = useState<Bookmark[]>([]);

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
    }
    fetchBookmarks();
  }, []);

  // console.log("All Bookmarks:", allBookmarks);
  // console.log("Flattened Bookmarks:", flatBookmarks);
  // console.log("Grouped Bookmarks:", groupedBookmarks);

  const reorganizedBookmarks = [
    {
      id: "blogs",
      parentId: "1",
      title: "Tech Blogs",
      children: [
        {
          id: "195",
          index: 0,
          parentId: "blogs",
          title: "The Node.js Event Loop",
          url: "https://blog.platformatic.dev/the-nodejs-event-loop",
        },
        {
          id: "208",
          index: 1,
          parentId: "blogs",
          title: "The Last Event Loop Guide",
          url: "https://dev.to/thevinitgupta/the-last-event-loop-guide-you-will-ever-need-2c94?ref=peerlist",
        },
        {
          id: "231",
          index: 2,
          parentId: "blogs",
          title: "JavaScript: .then() vs async/await",
          url: "https://nickk2305.hashnode.dev/asynchronous-javascript-asyncawait-vs-then",
        },
        {
          id: "196",
          index: 3,
          parentId: "blogs",
          title: "Build A Better Signal",
          url: "https://medium.com/the-mission/want-to-do-cool-stuff-build-a-better-signal-4a20f526122f",
        },
        {
          id: "206",
          index: 4,
          parentId: "blogs",
          title: "Web Storage Guide",
          url: "https://medium.com/@supraja_miryala/caching-vs-local-storage-vs-session-storage-vs-cookie-ef60fbb7aa71",
        },
        {
          id: "323",
          index: 5,
          parentId: "blogs",
          title: "Stand Out as SDE1",
          url: "https://x.com/_svs_/status/1716347991835984184",
        },
        {
          id: "334",
          index: 6,
          parentId: "blogs",
          title: "System Design Blogs List",
          url: "https://x.com/systemdesign42/status/1749431168364085258",
        },
      ],
    },
    {
      id: "resources",
      parentId: "1",
      title: "Learning Resources",
      children: [
        {
          id: "127",
          index: 0,
          parentId: "resources",
          title: "Git Cheatsheet",
          url: "https://eshantrivedi21.github.io/Git-CheatSheet/",
        },
        {
          id: "158",
          index: 1,
          parentId: "resources",
          title: "Microsoft C/C++ Docs",
          url: "https://learn.microsoft.com/en-us/cpp/?view=msvc-170",
        },
        {
          id: "204",
          index: 2,
          parentId: "resources",
          title: "Cpu Land",
          url: "",
        },
        {
          id: "204",
          index: 2,
          parentId: "resources",
          title: "CPU Land",
          url: "https://cpu.land/",
        },
        {
          id: "237",
          index: 3,
          parentId: "resources",
          title: "GitHub Student Pack",
          url: "https://education.github.com/pack/offers#frontendmasters",
        },
        {
          id: "314",
          index: 4,
          parentId: "resources",
          title: "Coding Challenges",
          url: "https://codingchallenges.fyi/",
        },
        {
          id: "330",
          index: 5,
          parentId: "resources",
          title: "System Design Guide",
          url: "https://github.com/karanpratapsingh/system-design",
        },
        {
          id: "337",
          index: 6,
          parentId: "resources",
          title: "TypeHero",
          url: "https://typehero.dev/",
        },
      ],
    },
    {
      id: "jobSearch",
      parentId: "1",
      title: "Job Search",
      children: [
        {
          id: "290",
          index: 0,
          parentId: "jobSearch",
          title: "Weekday",
          url: "https://www.weekday.works/candidates",
        },
        {
          id: "294",
          index: 1,
          parentId: "jobSearch",
          title: "Job Found",
          url: "https://jobfound.org/",
        },
        {
          id: "296",
          index: 2,
          parentId: "jobSearch",
          title: "Crossover",
          url: "https://www.crossover.com/job-roles/developer",
        },
        {
          id: "322",
          index: 3,
          parentId: "jobSearch",
          title: "Remote.com",
          url: "https://remote.com/jobs",
        },
        {
          id: "325",
          index: 4,
          parentId: "jobSearch",
          title: "Wellfound",
          url: "https://wellfound.com/jobs",
        },
        {
          id: "326",
          index: 5,
          parentId: "jobSearch",
          title: "RemoteOK",
          url: "https://remoteok.com/",
        },
        {
          id: "327",
          index: 6,
          parentId: "jobSearch",
          title: "FlexJobs",
          url: "https://www.flexjobs.com/",
        },
      ],
    },
    {
      id: "aiTools",
      parentId: "1",
      title: "AI Tools",
      children: [
        {
          id: "125",
          index: 0,
          parentId: "aiTools",
          title: "ChatGPT",
          url: "https://chat.openai.com/",
        },
        {
          id: "229",
          index: 1,
          parentId: "aiTools",
          title: "Claude",
          url: "https://claude.ai/",
        },
        {
          id: "202",
          index: 2,
          parentId: "aiTools",
          title: "Phind",
          url: "https://www.phind.com/agent?home=true",
        },
        {
          id: "233",
          index: 3,
          parentId: "aiTools",
          title: "Perplexity",
          url: "https://www.perplexity.ai/",
        },
        {
          id: "241",
          index: 4,
          parentId: "aiTools",
          title: "Gemini",
          url: "https://gemini.google.com/app",
        },
      ],
    },
    {
      id: "dsaCp",
      parentId: "1",
      title: "DSA / CP",
      children: [
        {
          id: "96",
          index: 0,
          parentId: "dsaCp",
          title: "LeetCode",
          url: "https://leetcode.com/problemset/all/",
        },
        {
          id: "131",
          index: 1,
          parentId: "dsaCp",
          title: "Codeforces",
          url: "https://codeforces.com/",
        },
        {
          id: "300",
          index: 2,
          parentId: "dsaCp",
          title: "Codechef",
          url: "https://www.codechef.com/dashboard",
        },
        {
          id: "108",
          index: 3,
          parentId: "dsaCp",
          title: "TUF",
          url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
        },
        {
          id: "166",
          index: 4,
          parentId: "dsaCp",
          title: "CP Sheet",
          url: "https://www.tle-eliminators.com/cp-sheet",
        },
        {
          id: "274",
          index: 5,
          parentId: "dsaCp",
          title: "CSES",
          url: "https://www.cses.fi/problemset/",
        },
        {
          id: "280",
          index: 6,
          parentId: "dsaCp",
          title: "DP Study Plan",
          url: "https://leetcode.com/studyplan/dynamic-programming/",
        },
        {
          id: "286",
          index: 7,
          parentId: "dsaCp",
          title: "USACO DSA",
          url: "https://usaco.guide/problems/",
        },
        {
          id: "298",
          index: 8,
          parentId: "dsaCp",
          title: "ProgVar.Fun",
          url: "https://progvar.fun/",
        },
      ],
    },
    {
      id: "systemDesign",
      parentId: "1",
      title: "System Design",
      children: [
        {
          id: "332",
          index: 0,
          parentId: "systemDesign",
          title: "Distributed Systems",
          url: "https://x.com/vaibhaw_vipul/status/1720056159875285220",
        },
        {
          id: "333",
          index: 1,
          parentId: "systemDesign",
          title: "40 System Design Concepts",
          url: "https://x.com/ashishps_1/status/1742765334145441906",
        },
        {
          id: "335",
          index: 2,
          parentId: "systemDesign",
          title: "System Design Course",
          url: "https://www.udemy.com/share/10c6Q13@98gnz4TPhYuuhhXNYu6FrbqueWvrve20Jdz7ChRlQ9c67lce9ZPPTpsV5nynaO-eqQ==/",
        },
      ],
    },
    {
      id: "interviewPrep",
      parentId: "1",
      title: "Interview Prep",
      children: [
        {
          id: "171",
          index: 0,
          parentId: "interviewPrep",
          title: "Intervue",
          url: "https://www.intervue.io/",
        },
        {
          id: "186",
          index: 1,
          parentId: "interviewPrep",
          title: "Interview Experiences",
          url: "https://maang.in/interview-prep",
        },
        {
          id: "226",
          index: 2,
          parentId: "interviewPrep",
          title: "GreatFrontEnd",
          url: "https://www.greatfrontend.com/prepare",
        },
        {
          id: "227",
          index: 3,
          parentId: "interviewPrep",
          title: "Tech Interview Handbook",
          url: "https://www.techinterviewhandbook.org/",
        },
        {
          id: "245",
          index: 4,
          parentId: "interviewPrep",
          title: "Google Interview Warmup",
          url: "https://grow.google/certificates/interview-warmup/",
        },
        {
          id: "319",
          index: 5,
          parentId: "interviewPrep",
          title: "Faang AI Interviewer",
          url: "https://www.faangai.com/",
        },
      ],
    },
    {
      id: "designTools",
      parentId: "1",
      title: "Design Tools",
      children: [
        {
          id: "387",
          index: 0,
          parentId: "designTools",
          title: "Khroma",
          url: "https://www.khroma.co/",
        },
        {
          id: "385",
          index: 1,
          parentId: "designTools",
          title: "Slant",
          url: "https://slantit.app/",
        },
        {
          id: "288",
          index: 2,
          parentId: "designTools",
          title: "Pika",
          url: "https://pika.style/",
        },
      ],
    },
  ];

  // console.log(reorganizedBookmarks);

  return <div className="w-screen min-h-screen rounded-2xl p-1">hereee</div>;
}

export default SidePanel;
