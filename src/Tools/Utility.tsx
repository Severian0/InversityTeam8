export function observeElementCreation(
  targetNode: HTMLElement | Element,
  targetClass: string,
  callback: (element: HTMLElement) => void,
) {
  const observerOptions = {
    attributes: false,
    childList: true,
    subtree: true,
  };

  function handleMutations(mutationsList: any, observer: any) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const newElement = Array.from(mutation.addedNodes).find(
          (node: any) =>
            node.nodeType === 1 && node.classList.contains(targetClass),
        );

        if (newElement) {
          callback(newElement as any);
          observer.disconnect();
        }
      }
    }
  }

  const observer = new MutationObserver(handleMutations);
  observer.observe(targetNode, observerOptions);
}

export interface Problem {
  link: string;
  title: string;
  summary: string;
  timestamp: string;
  tags?: string[];
}

export function findMostCommonTags(data: Problem[]): string[] {
  const tagCount: Record<string, number> = {};

  // Count the occurrences of each tag
  data.forEach((item) => {
    if (item.tags) {
      item.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  // Find the most common tags
  const mostCommonTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  return mostCommonTags;
}

// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
