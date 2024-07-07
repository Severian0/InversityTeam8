import { createEffect, createSignal } from "solid-js";

interface TrackerCursorProps {
  className?: string;
  color?: string;
  visibleOverPx?: number;
}

function idleCallback(callback: any, idleTime: any) {
  let timer: any;

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, idleTime);
  }

  document.addEventListener("mousemove", resetTimer);

  // Initial setup to start the timer
  resetTimer();
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints;
}

let TrackerCursor = (props: TrackerCursorProps) => {
  if (isTouchDevice()) return null;

  let { className, visibleOverPx } = props;
  if (window.innerWidth < (visibleOverPx || 768)) return null;

  let [cursorX, setCursorX] = createSignal(0);
  let [cursorY, setCursorY] = createSignal(0);
  let [followX, setFollowX] = createSignal(0);
  let [followY, setFollowY] = createSignal(0);

  let [scrollX, setScrollX] = createSignal(0);
  let [scrollY, setScrollY] = createSignal(0);

  let [innerExtraStyles, setInnerExtraStyles] = createSignal("");
  let [outerExtraStyles, setOuterExtraStyles] = createSignal("");

  const checkHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.parentElement?.classList.contains("nav-links")) {
      setInnerExtraStyles("bg-gray-200 w-2 h-2");
      setOuterExtraStyles("w-10 h-10 border-gray-100");
      followOffset = 16;
      cursorOffset = 4;
    } else if (target.classList.contains("cursor-pointer")) {
      setInnerExtraStyles("bg-orange-500 w-2 h-2");
      setOuterExtraStyles("w-10 h-10 border-orange-500 border-opacity-80");
      followOffset = 16;
      cursorOffset = 4;
    } else if (
      target.tagName === "A" ||
      target.parentElement?.tagName === "A"
    ) {
      setInnerExtraStyles("bg-blue-400 w-2 h-2");
      setOuterExtraStyles("w-10 h-10 border-blue-400 border-opacity-80");
      followOffset = 16;
      cursorOffset = 4;
    } else {
      setInnerExtraStyles("w-[0.4rem] h-[0.4rem] bg-neutral-400");
      setOuterExtraStyles("w-8 h-8 border-neutral-400");
      followOffset = 13;
      cursorOffset = 2;
    }
  };

  let cursorOffset = 4;
  createEffect(() => {
    window.addEventListener("mousemove", (event: MouseEvent) => {
      let xPos = event.clientX - cursorOffset;
      let yPos = event.clientY - cursorOffset;
      setCursorX(xPos);
      setCursorY(yPos);
      setFollowX(xPos);
      setFollowY(yPos);
      checkHover(event);
    });
    window.addEventListener("scroll", () => {
      setScrollX(window.scrollX);
      setScrollY(window.scrollY);
    });
  });

  let followOffset = 12.5;
  return (
    <>
      <div
        class={`tracker-cursor-inner  rounded-full  absolute transition-colors z-10 ${innerExtraStyles()}`}
        style={{
          transform: `translate(${cursorX() + scrollX()}px, ${
            cursorY() + scrollY()
          }px)`,
          "pointer-events": "none",
        }}
      ></div>
      <div
        class={`tracker-cursor-outer  rounded-full border  absolute border-opacity-50 transition-all z-10 ${outerExtraStyles()}`}
        style={{
          transform: `translate(${
            followX() + scrollX() - followOffset
          }px, ${followY() + scrollY() - followOffset}px)`,
          "pointer-events": "none",
          transition: "transform 0.08s ease-out",
        }}
      ></div>
    </>
  );
};

export default TrackerCursor;
