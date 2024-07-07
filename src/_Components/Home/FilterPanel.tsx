import { For, createEffect, createResource, onCleanup } from "solid-js";
import SearchBox from "./SearchBox";

interface FilterPanelProps {
  className?: string;
  useTags?: string[];
  setFilterBy: (a: string[]) => void;
  filterBy: string[];
  initialSet?: string[];
  width?: number;
}

let FilterPanel = (props: FilterPanelProps) => {
  let { className, useTags, setFilterBy, initialSet } = props;

  let veto = false;

  createResource(
    () => props.filterBy,
    () => {
      if (veto) {
        veto = false;
        return;
      }
      document.querySelectorAll(".tag-clicked").forEach((tag) => {
        tag.classList.remove("tag-clicked");
      });
    },
  );

  createEffect(() => {
    // console.log('ran filter panel inital effect');
    document.querySelectorAll(".filter-selectable-tag").forEach((tag) => {
      let name = tag.textContent;
      if (!name) return;
      if (initialSet?.includes(name)) {
        tag.classList.add("tag-clicked");
      }
    });
    updateFilterTags();
  }, [initialSet]);

  let tagClick = (event: any) => {
    if (event.target.classList.contains("tag-clicked")) {
      event.target.classList.remove("tag-clicked");
    } else {
      event.target.classList.add("tag-clicked");
    }
    updateFilterTags();
  };

  let updateFilterTags = () => {
    // console.log(
    //     'settings tags to ',
    //     Array.from(document.querySelectorAll('.tag-clicked')).map(
    //         (el: any) => el.textContent
    //     ) as any
    // );
    veto = true;
    setFilterBy(
      Array.from(document.querySelectorAll(".tag-clicked")).map(
        (el: any) => el.textContent,
      ) as any,
    );
  };

  return (
    <div
      class={`flex flex-row flex-nowrap ${className}`}
      style={{
        width: (props.width + "px") as any,
        "max-width": (props.width + "px") as any,
      }}
    >
      <SearchBox />

      {useTags?.filter(Boolean).map((tag) => (
        <button
          tabIndex={-1}
          onClick={tagClick}
          class="mx-1 text-gray-400 opacity-90 hover:opacity-100 px-1 py-[0.5px] font-jetbrains text-sm border border-dotted border-neutral-500 hover:border-orange-500 hover:border-solid  rounded-md h-fit selectable-tag mt-auto cursor-pointer hover:underline underline-offset-2 mb-1 filter-selectable-tag transition-all duration-600 ease-in-out whitespace-nowrap text-nowrap"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
