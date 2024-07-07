import {
  createSignal,
  createEffect,
  onCleanup,
  JSX,
  For,
  createResource,
  Show,
} from "solid-js";
import AboutCard from "./AboutCard";
import BlogCard from "./BlogCard";
import FilterPanel from "./FilterPanel";
import { observeElementCreation } from "../../Tools/Utility";
import { TransitionGroup } from "solid-transition-group";

let devRes: any = [
  {
    link: "/about",
    title: "Welcome to The Blackboard",
    summary:
      "Solve some problems, fail some problems. That's the blackboard way. Yadayadayada gotta fill this space. Fill this space, fill this space. What else can I say. Fill this space, fill this space. That's the blackboard way. \n",
    aboutMe: true,
  },
  {
    link: "/problem/1",
    title: "Differentiate $f(\\alpha)=\\alpha^3+7\\alpha-4$",
    summary:
      "What is the derivative of $f(\\alpha)=\\alpha^3+7\\alpha-4$, hence or otherwise find the stationary points of the function.",
    timestamp: "1569888000",
    tags: ["calculus", "differentiation", "stationary-points", "quick"],
  },
  {
    link: "/problem/2",
    title: "Evaluate $\\int e^x \\sin(x) \\,dx$",
    summary:
      "Compute the integral $\\int e^x \\sin(x) \\,dx$ with respect to $x$.",
    timestamp: "1643932800",
    tags: ["calculus", "integration", "trigonometry", "challenging"],
  },
  {
    link: "/problem/3",
    title: "Solve the differential equation $y' - 2y = 3e^{2x}$",
    summary:
      "Find the solution to the differential equation $y' - 2y = 3e^{2x}$.",
    timestamp: "1700128000",
    tags: [
      "calculus",
      "differential-equations",
      "exponential-functions",
      "advanced",
    ],
  },
  {
    link: "/problem/4",
    title: "Find the limit $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$",
    summary: "Determine the value of $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.",
    timestamp: "1777056000",
    tags: ["calculus", "limits", "trigonometry", "fundamental"],
  },
  {
    link: "/problem/5",
    title: "Differentiate $g(x) = \\ln(2x+1)$",
    summary:
      "Compute the derivative of $g(x) = \\ln(2x+1)$ with respect to $x$.",
    timestamp: "1853993600",
    tags: ["calculus", "differentiation", "natural-logarithm", "intermediate"],
  },
  {
    link: "/problem/6",
    title: "Evaluate $\\int \\frac{x^2 + 1}{x} \\,dx$",
    summary:
      "Calculate the integral $\\int \\frac{x^2 + 1}{x} \\,dx$ with respect to $x$.",
    timestamp: "1930931200",
    tags: ["calculus", "integration", "rational-functions", "intermediate"],
  },
  {
    link: "/problem/7",
    title: "Solve the equation $2^x = 8$",
    summary: "Find the value of $x$ that satisfies the equation $2^x = 8$.",
    timestamp: "2007868800",
    tags: ["algebra", "exponential-equations", "basic"],
  },
  {
    link: "/problem/8",
    title: "Find the derivative of $h(x) = \\sqrt{3x - 2}$",
    summary:
      "Determine the derivative of $h(x) = \\sqrt{3x - 2}$ with respect to $x$.",
    timestamp: "2084806400",
    tags: ["calculus", "differentiation", "square-root", "basic"],
  },
  {
    link: "/problem/9",
    title: "Evaluate $\\int_0^1 (4x^3 - 2x) \\,dx$",
    summary: "Compute the definite integral $\\int_0^1 (4x^3 - 2x) \\,dx$.",
    timestamp: "2161744000",
    tags: [
      "calculus",
      "definite-integration",
      "polynomial-functions",
      "intermediate",
    ],
  },
  {
    link: "/problem/10",
    title: "Solve the system of equations $2x + y = 5$ and $x - y = 1$",
    summary:
      "Find the values of $x$ and $y$ that satisfy the system of equations $2x + y = 5$ and $x - y = 1$.",
    timestamp: "2238681600",
    tags: [
      "algebra",
      "systems-of-equations",
      "linear-equations",
      "intermediate",
    ],
  },
  {
    link: "/problem/11",
    title: "Evaluate $\\int_1^2 \\frac{1}{x} \\,dx$",
    summary: "Compute the definite integral $\\int_1^2 \\frac{1}{x} \\,dx$.",
    timestamp: "2315619200",
    tags: [
      "calculus",
      "definite-integration",
      "reciprocal-function",
      "intermediate",
    ],
  },
  {
    link: "/problem/12",
    title: "Solve the equation $x^2 - 4x + 4 = 0$",
    summary: "Find the solutions to the quadratic equation $x^2 - 4x + 4 = 0$.",
    timestamp: "2392556800",
    tags: ["algebra", "quadratic-equations", "fundamental"],
  },
  {
    link: "/problem/13",
    title: "Differentiate $p(t) = e^{2t} \\cos(t)$",
    summary:
      "Calculate the derivative of $p(t) = e^{2t} \\cos(t)$ with respect to $t$.",
    timestamp: "2469494400",
    tags: [
      "calculus",
      "differentiation",
      "exponential-functions",
      "trigonometry",
      "intermediate",
    ],
  },
  {
    link: "/problem/14",
    title:
      "Find the limit $\\lim_{x \\to \\infty} \\frac{2x^2 - 3x + 1}{x^2 + 4}$",
    summary:
      "Determine the value of $\\lim_{x \\to \\infty} \\frac{2x^2 - 3x + 1}{x^2 + 4}$.",
    timestamp: "2546432000",
    tags: ["calculus", "limits", "rational-functions", "advanced"],
  },
  {
    link: "/problem/15",
    title: "Evaluate $\\int_0^\\pi \\sin^2(x) \\,dx$",
    summary: "Compute the definite integral $\\int_0^\\pi \\sin^2(x) \\,dx$.",
    timestamp: "2623369600",
    tags: ["calculus", "definite-integration", "trigonometry", "intermediate"],
  },
  {
    link: "/problem/16",
    title: "Solve the logarithmic equation $\\log_2(x) + \\log_2(8) = 6$",
    summary:
      "Find the value of $x$ that satisfies the logarithmic equation $\\log_2(x) + \\log_2(8) = 6$.",
    timestamp: "2700307200",
    tags: ["algebra", "logarithmic-equations", "intermediate"],
  },
  {
    link: "/problem/17",
    title: "Differentiate $q(x) = \\sqrt{4x - 1}$",
    summary:
      "Determine the derivative of $q(x) = \\sqrt{4x - 1}$ with respect to $x$.",
    timestamp: "2777244800",
    tags: ["calculus", "differentiation", "square-root", "intermediate"],
  },
  {
    link: "/problem/18",
    title: "Evaluate $\\int_1^3 (x^2 + 2x + 1) \\,dx$",
    summary: "Compute the definite integral $\\int_1^3 (x^2 + 2x + 1) \\,dx$.",
    timestamp: "2854182400",
    tags: [
      "calculus",
      "definite-integration",
      "polynomial-functions",
      "intermediate",
    ],
  },
  {
    link: "/problem/19",
    title: "Solve the system of equations $3y - x = 2$ and $2x + y = 5$",
    summary:
      "Find the values of $x$ and $y$ that satisfy the system of equations $3y - x = 2$ and $2x + y = 5$.",
    timestamp: "2931120000",
    tags: [
      "algebra",
      "systems-of-equations",
      "linear-equations",
      "intermediate",
    ],
  },
  {
    link: "/problem/20",
    title: "Find the derivative of $r(t) = \\frac{1}{2t+3}$",
    summary:
      "Determine the derivative of $r(t) = \\frac{1}{2t+3}$ with respect to $t$.",
    timestamp: "3008057600",
    tags: ["calculus", "differentiation", "rational-functions", "intermediate"],
  },
  {
    link: "/problem/21",
    title: "Evaluate $\\int \\frac{1}{1 + e^x} \\,dx$",
    summary:
      "Compute the indefinite integral $\\int \\frac{1}{1 + e^x} \\,dx$.",
    timestamp: "3084995200",
    tags: [
      "calculus",
      "indefinite-integration",
      "exponential-functions",
      "intermediate",
    ],
  },
  {
    link: "/problem/22",
    title: "Solve the equation $2^{3x - 1} = 8$",
    summary:
      "Find the value of $x$ that satisfies the equation $2^{3x - 1} = 8$.",
    timestamp: "3161932800",
    tags: ["algebra", "exponential-equations", "intermediate"],
  },
  {
    link: "/problem/23",
    title: "Differentiate $s(t) = \\cos^2(t) + 3\\sin(t)$",
    summary:
      "Calculate the derivative of $s(t) = \\cos^2(t) + 3\\sin(t)$ with respect to $t$.",
    timestamp: "3238870400",
    tags: ["calculus", "differentiation", "trigonometry", "intermediate"],
  },
  {
    link: "/problem/24",
    title: "Find the limit $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$",
    summary:
      "Determine the value of $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$.",
    timestamp: "3315808000",
    tags: ["calculus", "limits", "rational-functions", "intermediate"],
  },
  {
    link: "/problem/25",
    title: "Evaluate $\\int_0^{\\pi/2} \\tan(x) \\sec^2(x) \\,dx$",
    summary:
      "Compute the definite integral $\\int_0^{\\pi/2} \\tan(x) \\sec^2(x) \\,dx$.",
    timestamp: "3392745600",
    tags: ["calculus", "definite-integration", "trigonometry", "advanced"],
  },
  {
    link: "/problem/26",
    title: "Solve the logarithmic equation $3\\log_3(x) - 2 = 4$",
    summary:
      "Find the value of $x$ that satisfies the logarithmic equation $3\\log_3(x) - 2 = 4$.",
    timestamp: "3469683200",
    tags: ["algebra", "logarithmic-equations", "intermediate"],
  },
  {
    link: "/problem/27",
    title: "Differentiate $u(x) = e^x + \\ln(x)$",
    summary:
      "Find the derivative of $u(x) = e^x + \\ln(x)$ with respect to $x$.",
    timestamp: "3546620800",
    tags: [
      "calculus",
      "differentiation",
      "exponential-functions",
      "natural-logarithm",
      "intermediate",
    ],
  },
  {
    link: "/problem/28",
    title: "Evaluate $\\int_1^4 (2x^2 + 3x + 1) \\,dx$",
    summary: "Compute the definite integral $\\int_1^4 (2x^2 + 3x + 1) \\,dx$.",
    timestamp: "3623558400",
    tags: [
      "calculus",
      "definite-integration",
      "polynomial-functions",
      "intermediate",
    ],
  },
  {
    link: "/problem/29",
    title: "Solve the system of equations $4y - 2x = 1$ and $x + 2y = 5$",
    summary:
      "Find the values of $x$ and $y$ that satisfy the system of equations $4y - 2x = 1$ and $x + 2y = 5$.",
    timestamp: "3700496000",
    tags: [
      "algebra",
      "systems-of-equations",
      "linear-equations",
      "intermediate",
    ],
  },
  {
    link: "/problem/30",
    title: "Find the derivative of $v(t) = \\frac{3}{t+2}$",
    summary:
      "Determine the derivative of $v(t) = \\frac{3}{t+2}$ with respect to $t$.",
    timestamp: "3777433600",
    tags: ["calculus", "differentiation", "rational-functions", "intermediate"],
  },
];

function getTagClass(tag: string) {
  return "tag-" + tag.replaceAll(" ", "-");
}

function sortByFrequency(arr: any[], minFrequency: number = 0) {
  const frequencyMap = arr.reduce((map, element) => {
    map[element] = (map[element] || 0) + 1;
    return map;
  }, {});

  const uniqueElements = Array.from(
    new Set(arr.filter((el) => frequencyMap[el] >= minFrequency)),
  );
  uniqueElements.sort((a, b) => frequencyMap[b] - frequencyMap[a]);
  console.log(frequencyMap);

  return uniqueElements;
}

interface CardContainerProps {
  cards: JSX.Element[];
  cardHeights?: number[];

  className?: string;
  columns?: number;

  filterTagsList?: string[];

  showAboutCard?: boolean;
  aboutCardTitle?: string;
  aboutCardBody?: string;
  aboutCardLink?: string;
}

function getVisibleDivs(selector: string) {
  const elements = document.querySelectorAll(selector);
  const visibleDivs: Element[] = [];

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    // Check if the element is fully or partially visible
    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      visibleDivs.push(element);
    }
  });

  return visibleDivs;
}
const divConst = 390;

const CardContainer = (props: CardContainerProps) => {
  let [columns, setColumns] = createSignal(
    props.columns || Math.floor(window.innerWidth / divConst),
  );
  // let [cards, setCards] = createSignal(props.cards || []);
  let [filterTagsList, setFilterTagsList] = createSignal(
    props.filterTagsList || [],
  );
  let [filterBy, setFilterBy] = createSignal<string[]>([]);
  let [initialSet, setInitialSet] = createSignal<string[]>([]);
  let [blogCardsQuerySelected, setBlogCardsQuerySelected] =
    createSignal<NodeListOf<Element> | null>(null);

  let [aboutCardTitle, setAboutCardTitle] = createSignal(
    props.aboutCardTitle || "",
  );
  let [aboutCardBody, setAboutCardBody] = createSignal(
    props.aboutCardBody || "",
  );
  let [aboutCardLink, setAboutCardLink] = createSignal(
    props.aboutCardLink || "",
  );

  const handleResize = () => {
    let width = window.innerWidth;
    let modifier = 1;
    if (Math.abs(columns()) == 2 && width > 767) modifier = -1;
    setColumns((props.columns || Math.floor(width / divConst)) * modifier);
  };

  let updateSliderListener = () => {
    // scroll
  };

  createEffect(() => {
    setTimeout(() => {
      window.addEventListener("scroll", updateSliderListener);
    }, 5000);
  });

  let getMaxW = (x_col?: number) => {
    let x = x_col || (columns ? Math.abs(columns()) : 1);
    let width = 0;
    switch (x) {
      case 1:
        width = 337;
        break;
      case 2:
        // two columns and tailwind sm size
        // if (window.innerWidth < 767) width = 671;
        if (window.innerWidth < 767) width = 695;

        // two columns and tailwind md size
        if (window.innerWidth >= 767) {
          width = 693;
          // console.log('crossed boundary');
        }
        break;
      // case 3: //     width = 1027; //     break; // case 4: //     width = 1365; //     break; // case 5: //     width = 1700; //     break; // case 6: //     // width = 1844; //     width = 2032; //     break;
      default:
        // width = 1606.73 * x ** 0.406381 - 1450.38;
        width = 335 * x + 23.5;
        break;
    }

    return width;
  };

  createEffect(() => {
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  return (
    <>
      <div class={`flex flex-col flex-wrap ${props.className}`}>
        <div
          style={{
            "max-width": getMaxW() + "px",
            width: getMaxW() + "px",
          }}
          class="md:pl-5 md:mx-0 mx-auto mt-8 pickme flex items-stretch mb-3"
        >
          <FilterPanel
            useTags={filterTagsList()}
            setFilterBy={setFilterBy}
            filterBy={filterBy()}
            className="overflow-x-auto  scrollbar-hide mx-2"
          />
        </div>
        <CardRenderer
          cards={props.cards}
          showAboutCard={props.showAboutCard}
          aboutCardTitle={aboutCardTitle}
          aboutCardBody={aboutCardBody}
          aboutCardLink={aboutCardLink}
          columns={columns}
          cardHeights={props.cardHeights}
          getMaxW={getMaxW}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      </div>
    </>
  );
};

interface CardRendererProps {
  cards: JSX.Element[];
  cardHeights?: number[];
  showAboutCard?: boolean;
  aboutCardTitle: () => string;
  aboutCardBody: () => string;
  aboutCardLink: () => string;

  columns: () => number;
  getMaxW: (x_col?: number) => number;

  filterBy: () => string[];
  setFilterBy: (x: string[]) => void;
}

let CardRenderer: any = (props: CardRendererProps) => {
  createEffect(() => {});
  return () => {
    props.setFilterBy([]);
    let filteredCards = () => {
      let filterList = props.filterBy();
      let cardList = props.cards as JSX.Element[];
      if (!filterList.length) return cardList.filter(Boolean); // fixme: cardList randomly has a `false` value in it sometimes, which causes bugs, why is it there????
      let allowedMap: any = {};
      document.querySelectorAll(".blog-card").forEach((el) => {
        if (!el.id) return;
        let cardIndex = el.id.split("-")[1];
        let include = filterList.every((tag) => {
          return el.classList.contains(getTagClass(tag));
        });
        allowedMap[cardIndex] = include;
      });
      return cardList.filter((_, idx) => {
        return allowedMap[idx];
      });
    };

    let columnsArray = Array.from(
      { length: Math.abs(props.columns()) || 0 },
      () => createSignal<number[]>([]),
    );
    let columnsLengths = Array.from(
      { length: Math.abs(props.columns()) || 0 },
      () => 0,
    );

    let cardHeights =
      props.cardHeights || Array.from({ length: props.cards.length }, () => 1);

    let cardsToPromote = props.showAboutCard ? props.columns() - 2 : 0;
    for (let i = 0; i < props.cards.length; i++) {
      if (i < cardsToPromote) continue;

      let smallestStack = Math.min(...columnsLengths);
      let appendIndex = columnsLengths.indexOf(smallestStack);
      if (appendIndex == -1) appendIndex = 0;
      let height = cardHeights[i];

      columnsArray[appendIndex][1]((prev) => [...prev, i]);
      columnsLengths[appendIndex] += height;
      // console.log(i, columnsLengths, height);
    }
    return (
      <>
        {props.showAboutCard && (
          <div class="md:pl-5 md:mx-0 mx-auto mt-0 pickme grid grid-flow-col mb-0">
            <AboutCard
              width={(() => {
                let cols = Math.abs(props.columns());
                if (cols == 1) return props.getMaxW(1) - 15;
                // let two = props.getMaxW(2);
                // if (cols == 2) two -= 37;
                // if (cols == 3) two -= 36;
                // if (cols >= 2) two -= 37;
                return props.getMaxW(2) - 37;
              })()}
              title={props.aboutCardTitle()}
              text={props.aboutCardBody()}
              link={props.aboutCardLink()}
            />

            <For each={Array.from({ length: cardsToPromote }, (_, k) => k)}>
              {(i) => <>{props.cards[i]}</>}
            </For>
          </div>
        )}
        <div class="flex flex-1 max-w-fit md:mx-0 mx-auto">
          {(() => {
            let fCards = filteredCards();
            return (
              <For each={columnsArray}>
                {([column], column_idx) => (
                  <div>
                    <For each={column()}>
                      {(jdx, index) => (
                        <div
                          classList={{
                            "md:pl-5": column_idx() == 0,
                            "-mt-1": index() == 0,
                          }}
                        >
                          {fCards[jdx]}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            );
          })()}
        </div>
      </>
    );
  };
};
export default CardContainer;
