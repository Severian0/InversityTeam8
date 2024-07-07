import {
  createEffect,
  createSignal,
  onCleanup,
  createContext,
  useContext,
} from "solid-js";

interface YearSliderProps {
  className?: string;
  targetDate?: number;
}

// Create a context to hold the shared state
const HighlightedYearContext = createContext<[any, (a: any) => void]>([
  -1,
  () => {},
]);

const onScrollStop = (callback: () => any) => {
  let isScrolling: number;
  window.addEventListener(
    "scroll",
    (e) => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        callback();
      }, 100);
    },
    false,
  );
};

// const scrollToYear = (year: number) => {
//     document
//         .getElementById(`date-${year}`)
//         ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
// };

let YearSlider = (props: YearSliderProps) => {
  let currentYear = new Date().getFullYear();
  let addit = 7;
  let startYear = 2005;
  const years = Array.from(
    { length: currentYear - startYear + addit * 2 + 1 },
    (_, index) => startYear - addit + index,
  ).reverse();
  let validRange = [startYear, currentYear];

  // Initialize the shared state with context
  let [state, setState] = createSignal({
    biggestSeen: 0,
    smallestSeen: 9999,
  });

  let [middle, setMiddle] = createSignal(-1);

  const scrollToYear = (year: number) => {
    year = Math.min(Math.max(year, validRange[0]), validRange[1]);
    let listItem = document.getElementById(`date-${year}`) as HTMLElement;
    let listContainer = document.getElementById("year-slider") as HTMLElement;
    let listItemCenterPosition =
      listItem.offsetTop -
      (listContainer.getBoundingClientRect().height -
        listItem.getBoundingClientRect().height) /
        2;

    listContainer.scrollTo({
      top: listItemCenterPosition,
      behavior: "smooth",
    });
  };

  function handleScroll() {
    const yearScroller = document.getElementById("year-slider") as HTMLElement;
    const scrollTop = yearScroller.scrollTop;
    const scrollHeight = yearScroller.scrollHeight;
    const clientHeight = yearScroller.clientHeight;

    const middlePosition = scrollTop + window.innerHeight / 2;

    // Find the element whose position is closest to the middle of the scrollable div
    const elements = yearScroller.querySelectorAll(".year-item");
    let closestElement: null | Element = null;
    let closestDistance = Infinity;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementPosition = rect.top + scrollTop;

      const distance = Math.abs(elementPosition - middlePosition);

      if (distance < closestDistance) {
        closestElement = element;
        closestDistance = distance;
      }
    });

    let mid = parseInt((closestElement as any)?.id.split("-")[1]);
    mid = Math.min(Math.max(mid, validRange[0]), validRange[1]);
    localStorage.setItem("middleYear", mid.toString());
    setMiddle(mid);
  }

  onCleanup(() => {
    const yearScroller = document.getElementById("year-slider") as HTMLElement;
    yearScroller.removeEventListener("scroll", handleScroll);
  });

  createEffect(() => {
    let yearScroller = document.getElementById("year-slider") as HTMLElement;

    setTimeout(() => scrollToYear(new Date().getFullYear()), 1200);

    // let delay = window.innerWidth >= 768 ? 400 : 100
    setTimeout(() => {
      window.addEventListener("scroll", () => {
        if (localStorage.getItem("newYearTarget") == "true") {
          localStorage.setItem("newYearTarget", "false");
          // console.log('detected change in (year) localStorage');
          scrollToYear(parseInt(localStorage.getItem("yearTarget") as string));
        }
      });
    }, 1100);

    yearScroller.addEventListener("scroll", handleScroll);

    onCleanup(() => {
      yearScroller.removeEventListener("scroll", handleScroll);
    });
  });

  let styleYear = (year: number) => {
    let className = "font-medium text-neutral-500";
    let mid = middle();
    let distance = Math.abs(year - mid);
    let opacity = 100 - distance * 10;

    if (
      year === mid ||
      (mid < validRange[0] && year == validRange[0]) ||
      (mid > validRange[1] && year == validRange[1])
    )
      className = `${className} text-3xl text-white my-8`;
    else className = `${className} text-xl`;

    if (!(validRange[0] <= year && year <= validRange[1]))
      className = `${className} text-neutral-800 text-lg`;

    let generic = (
      <div
        id={`date-${year}`}
        class={`year-item text-center transition-all duration-150  ${className} my-8`}
      >
        <div class={`transform  rotate-90`}>{year}</div>
      </div>
    );
    return generic;
  };

  // Provide the context value to the descendants
  return (
    <HighlightedYearContext.Provider value={[middle, setMiddle]}>
      <div
        class={`flex flex-col items-center overflow-hidden overflow-x-clip scrollbar-hide max-h-screen-with-header touch-pan-y ${props.className}`}
        id="year-slider"
      >
        {years.map((year) => styleYear(year))}
      </div>
    </HighlightedYearContext.Provider>
  );
};

// Create a custom hook to access the context

export { YearSlider, HighlightedYearContext };
