import { format } from "timeago.js";
import KatexRenderer from "../../Tools/KatexRenderer";
import { CgMathMinus, CgMathPlus } from "solid-icons/cg";
import {
  HiOutlinePlusSmall,
  HiOutlineMinusSmall,
  HiOutlinePlus,
} from "solid-icons/hi";
import { clearAuthCache, getUserId } from "../../Tools/Auth";
import { Show, createSignal } from "solid-js";

interface BlogCardProps {
  title: string;
  full: string;
  score?: number;
  yourVote?: number;
  difficulty: number;
  commentCount?: number;
  date?: Date;
  className?: string;
  link?: string;
  tags?: string[];
  id?: string;
  disableVoting?: boolean;
}

export async function transformAllToBlogCards(cards: any[]) {
  let voteMap: { [key: string]: number } = {};
  if (getUserId() != null) {
    const ids = cards.map((card) => card.link.split("/").pop());
    let req = await fetch(`/api/vote/${ids.join(",")}/myVote`);
    if (req.status == 200) {
      voteMap = await req.json();
    } else if (req.status == 401) {
      voteMap = {};
      clearAuthCache();
    }
  }
  return cards.map((card) => (
    <BlogCard
      link={card.link}
      title={card.title}
      full={card.full}
      date={new Date(card.created * 1000)}
      commentCount={card.comment_count}
      difficulty={card.difficulty || 0}
      score={card.upvotes || 0}
      yourVote={voteMap[card.link]}
    ></BlogCard>
  ));
}

export function generateSkeletonBlogCard() {
  return (
    <div class="rounded-lg overflow-hidden border border-solid  border-gray-500 border-opacity-50 hover:border-opacity-100 shadow-md m-2 w-[320px] group max-w-xs max-h-fit cursor-pointer blog-card flex transition-all duration-700 ease-out aria-hidden animate-pulse select-none">
      <div class="p-4 flex flex-col flex-grow">
        <div class="">
          <div class="flex flex-center justify-between">
            <h2
              class={
                "text-lg text-gray-200 opacity-90 font-base mb-2 transition-colors max-h-fit max-w-fit font-plex group-hover:text-white duration-200 group-hover:hover:text-blue-400 blur-sm"
              }
            >
              This is the title. This is the title. title.
            </h2>
          </div>
        </div>
        <p class="text-sm max-h-min text-gray-400 mb-4 mt-1 blur-sm">
          {"This is a summary of the problem.".repeat(
            Math.ceil(Math.random() * 4),
          )}
        </p>

        <div class="flex flex-row items-center justify-between mt-auto">
          <div class="flex flex-row items-center">
            <div class="flex flex-row items-center ">
              <TextIcon />
              <span class="text-xs text-gray-500 ml-1 blur-sm">
                12 comments
              </span>
            </div>
          </div>
          <div
            class="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors duration-200 ease-out blur-sm"
            style={{
              color: interpolateColor(Math.random()),
            }}
          >
            0.012
          </div>
        </div>
      </div>
    </div>
  );
}

function formatUserLocaleDate(date: Date) {
  const userLocale =
    navigator.language || (navigator as any)?.userLanguage || "en-GB";
  return date.toLocaleDateString(userLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function getTagClass(tag: string) {
  return "tag-" + tag.replaceAll(" ", "-");
}

function TextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="lightgray"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}

function interpolateColor(value: number) {
  value = Math.max(0, Math.min(1, value));
  const green = [0, 255, 0];
  const yellow = [255, 255, 75];
  const red = [255, 0, 0];
  const interpolatedColor = [
    Math.round(green[0] + (yellow[0] - green[0]) * value),
    Math.round(green[1] + (yellow[1] - green[1]) * value),
    Math.round(green[2] + (yellow[2] - green[2]) * value),
  ];

  if (value > 0.5) {
    const additionalValue = 2 * (value - 0.5);
    interpolatedColor[0] += Math.round((red[0] - yellow[0]) * additionalValue);
    interpolatedColor[1] += Math.round((red[1] - yellow[1]) * additionalValue);
    interpolatedColor[2] += Math.round((red[2] - yellow[2]) * additionalValue);
  }

  return interpolatedColor.reduce(
    (acc, val) => acc + val.toString(16).padStart(2, "0"),
    "#",
  );
}

let BlogCard = (props: BlogCardProps) => {
  let {
    className,
    title,
    full,
    link,
    date,
    tags,
    id,
    difficulty,
    commentCount,
    disableVoting,
  } = props;

  const formattedDate = date ? format(date) : "";
  let tagClassString = tags ? tags.map(getTagClass).join(" ") : "";
  const [yourVote, setYourVote] = createSignal(props.yourVote || 0);
  const [score, setScore] = createSignal(props.score || 0);
  const postId = (link || "").split("/").pop();

  const upvoteClick = async () => {
    if (yourVote() === 1) {
      setYourVote(0);
      setScore((score) => score - 1);
      await fetch(`/api/vote/${postId}/reset`, {
        method: "POST",
      });
    } else {
      setScore((score) => score + 1);
      setYourVote(1);
      await fetch(`/api/vote/${postId}/up`, {
        method: "POST",
      });
    }
  };

  const downvoteClick = async () => {
    if (yourVote() === -1) {
      setYourVote(0);
      setScore((score) => score + 1);
      await fetch(`/api/vote/${postId}/reset`, {
        method: "POST",
      });
    } else {
      setScore((score) => score - 1);
      setYourVote(-1);
      await fetch(`/api/vote/${postId}/down`, {
        method: "POST",
      });
    }
  };

  return (
    <div
      class={`rounded-lg overflow-hidden border border-solid  border-gray-500 border-opacity-50 hover:border-opacity-100 shadow-md m-2 w-[320px] group max-w-xs max-h-fit ${className} ${tagClassString} cursor-pointer blog-card flex transition-all duration-300 ease-out`}
      id={id}
    >
      <div class="p-4 flex flex-col flex-grow">
        <div class="">
          <div class="flex flex-center justify-between">
            <a href={link}>
              <h2
                class={
                  "text-lg text-gray-200 opacity-90 font-base mb-2 transition-colors max-h-fit max-w-fit font-plex group-hover:text-white duration-200 group-hover:hover:text-blue-400"
                }
              >
                <KatexRenderer content={title} />
              </h2>
            </a>
            <div class="flex flex-center justify-end">
              <Show when={props.score}>
                <div class="ml-[1.5rem] font-extralight rounded-full border border-neutral-800 h-min px-[0.7rem] py-1 ">
                  {score()}
                </div>
              </Show>
              <Show when={!disableVoting}>
                <div class="flex-col flex m-1 mr-0 ml-2">
                  <svg
                    class="w-4 h-4 group/svg1 hover:scale-150 transition-all"
                    classList={{
                      "scale-125": yourVote() === 1,
                    }}
                    onclick={upvoteClick}
                    fill="none"
                    stroke-width="0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    style="overflow: visible; color: currentcolor; --darkreader-inline-color: currentcolor;"
                    height="1em"
                    width="1em"
                    data-darkreader-inline-color=""
                  >
                    <path
                      fill="currentColor"
                      d="M12 4a1 1 0 0 0-1 1v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5a1 1 0 0 0-1-1Z"
                      style="--darkreader-inline-fill: currentColor;"
                      data-darkreader-inline-fill=""
                      class="group-hover/svg1:fill-green-400 transition-all upvote-button"
                      classList={{
                        "fill-green-400": yourVote() === 1,
                      }}
                    ></path>
                  </svg>
                  <svg
                    class="w-4 h-4 group/svg2 hover:scale-150 transition-all"
                    classList={{
                      "scale-125": yourVote() === -1,
                    }}
                    onclick={downvoteClick}
                    fill="none"
                    stroke-width="0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    style="overflow: visible; color: currentcolor; --darkreader-inline-color: currentcolor;"
                    height="1em"
                    width="1em"
                    data-darkreader-inline-color=""
                  >
                    <path
                      fill="currentColor"
                      d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z"
                      style="--darkreader-inline-fill: currentColor;"
                      data-darkreader-inline-fill=""
                      class="group-hover/svg2:fill-red-400 transition-all upvote-button"
                      classList={{
                        "fill-red-400": yourVote() === -1,
                      }}
                    ></path>
                  </svg>
                </div>
              </Show>
            </div>
          </div>

          {/* {date && (
                        <div class="text-xs text-gray-500 mb-2 max-w-fit whitespace-nowrap -mt-1 group-hover:opacity-100">
                            {' '}
                            <span class="blog-card-date">
                                {formatUserLocaleDate(date)}
                            </span>
                            <span>
                                {' - '}
                                {formattedDate}
                            </span>
                        </div>
                    )} */}
        </div>
        <a href={link}>
          <p class="text-sm max-h-min text-gray-400 mb-4 mt-1 line-clamp-4">
            <KatexRenderer content={full.slice(0, 500)} />
          </p>
        </a>

        <div class="flex flex-row items-center justify-between mt-auto">
          <div class="flex flex-row items-center">
            <div class="flex flex-row items-center">
              <TextIcon />
              <Show when={commentCount !== undefined}>
                <span class="text-xs text-gray-500 ml-1">
                  {((commentCount as number) > 0 && commentCount) || "No"}{" "}
                  comments
                </span>
              </Show>
            </div>
          </div>
          <div
            class="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors duration-200 ease-out"
            style={{
              color: interpolateColor(difficulty),
            }}
          >
            {difficulty.toString().slice(1, 5)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
