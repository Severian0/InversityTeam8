import {
  createEffect,
  createSignal,
  onCleanup,
  createContext,
  useContext,
} from "solid-js";

interface MonthSliderProps {
  className?: string;
}

// Create a context to hold the shared state
const HighlightedMonthContext = createContext<[any, (a: any) => void]>([
  -1,
  () => {},
]);

const pureMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// const scrollToMonth = (index: number) => {
//     console.log("scroll to month called, scrolling to ", pureMonths[index])
//     let el = document .getElementById(`month-${pureMonths[index]}`)
//     el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
// };

const scrollToMonth = (index: number) => {
  let listItem = document.getElementById(
    `month-${pureMonths[index]}`,
  ) as HTMLElement;
  let listContainer = document.getElementById("Month-slider") as HTMLElement;
  let listItemCenterPosition =
    listItem.offsetTop -
    (listContainer.getBoundingClientRect().height -
      listItem.getBoundingClientRect().height) /
      2;

  listContainer.scrollTo({ top: listItemCenterPosition, behavior: "smooth" });
};

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

let MonthSlider = (props: MonthSliderProps) => {
  let addit = 4;
  let padding = Array.from({ length: addit }, (_, k) => (k + 1).toString());
  const months: string[] = [
    ...padding,
    ...pureMonths,
    ...padding.map((el) => (parseInt(el) * -1).toString()),
  ];

  let validRange = [addit, addit + 11];

  let [state, setState] = createSignal({
    biggestSeen: 0,
    smallestSeen: 9999,
  });

  let [middle, setMiddle] = createSignal(-1);

  function handleScroll() {
    const MonthScroller = document.getElementById(
      "Month-slider",
    ) as HTMLElement;
    const scrollTop = MonthScroller.scrollTop;
    const scrollHeight = MonthScroller.scrollHeight;
    const clientHeight = MonthScroller.clientHeight;

    const middlePosition = scrollTop + window.innerHeight / 2;

    const elements = MonthScroller.querySelectorAll(".month-item");
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

    if ((closestElement as any).textContent.length < 3) return;
    let mid = pureMonths.indexOf((closestElement as any).textContent);
    mid = Math.min(Math.max(validRange[0] + mid, validRange[0]), validRange[1]);
    setMiddle(mid);
  }

  createEffect(async () => {
    let MonthScroller = document.getElementById("Month-slider") as HTMLElement;

    setTimeout(() => scrollToMonth(new Date().getMonth()), 300);
    setTimeout(() => {
      // this refers to the `window` scroll stopping
      onScrollStop(() => {
        if (localStorage.getItem("newMonthTarget") == "true") {
          localStorage.setItem("newMonthTarget", "false");
          // console.log('detected change in (month) localStorage');
          scrollToMonth(
            parseInt(localStorage.getItem("monthTarget") as string),
          );
        }
      });
    }, 1000);

    MonthScroller.addEventListener("scroll", handleScroll);

    onCleanup(() => {
      MonthScroller.removeEventListener("scroll", handleScroll);
    });
  });

  let styleMonth = (month: string) => {
    let className = "font-medium text-neutral-500";
    let monthIndex = months.indexOf(month);
    let mid = middle();

    if (
      monthIndex === mid // ||
      // (mid < validRange[0] && monthIndex == validRange[0]) ||
      // (mid > validRange[1] && monthIndex == validRange[1])
    ) {
      // console.log('months styled colored', monthIndex);
      // console.log('setting mid to ', monthIndex, pureMonths[monthIndex]);
      className = `${className} text-2xl text-white month-item`;
    } else {
      className = `${className} text-lg month-item`;
      // console.log('month index', monthIndex, 'mid', mid);
    }

    if (!(validRange[0] <= monthIndex && monthIndex <= validRange[1]))
      className = `${className}  text-neutral-800 text-md opacity-0`;

    return (
      <div>
        <div
          id={`month-${month}`}
          class={`text-center transition-all duration-150 my-8   border-transparent transform rotate-90 border-6 py-2 ${className}`}
        >
          {month}
        </div>
      </div>
    );
  };

  // Provide the context value to the descendants
  return (
    <div
      class={`flex flex-col items-center overflow-hidden overflow-x-hidden max-h-screen-with-header scrollbar-hide touch-pan-y ${props.className}`}
      id="Month-slider"
    >
      {middle() && months.map((Month) => styleMonth(Month))}
    </div>
  );
};

export { MonthSlider };
