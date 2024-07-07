import "katex/dist/katex.min.css";
import katex from "katex";
import { For } from "solid-js";

interface KatexRendererProps {
  content: string;
  displayMode?: boolean;
}

function parseMixed(
  text: string,
  parser: (text: string) => any,
  delimiter = "$",
) {
  let result: HTMLElement[] = [];
  let insideTag = false;
  let currentText = "";

  for (let char of text) {
    if (char === delimiter) {
      if (insideTag) {
        // End of tag
        result.push(parser(currentText));
        currentText = "";
      } else {
        // Start of tag
        result.push((<>{currentText}</>) as HTMLElement);
        currentText = "";
      }
      insideTag = !insideTag;
    } else {
      // Collect text inside tags
      currentText += char;
    }
  }

  // If text ends inside a tag
  if (insideTag) {
    result.push(parser(currentText));
  } else {
    result.push((<>{currentText}</>) as HTMLElement);
  }

  return result; // <For each={result}>{(el) => el}</For>;
}

let parser = ({ displayMode }: { displayMode: boolean }) => {
  return (text: string) => {
    let element = document.createElement("span");
    try {
      katex.render(text, element, {
        displayMode: displayMode || false,
        throwOnError: false,
      });
    } catch (e) {
      return <div class="text-red-700">Failed</div>;
    }
    return element;
  };
};

const KatexRenderer = (props: KatexRendererProps) => {
  return <>{parseMixed(props.content, parser(props as any))}</>;
};

export default KatexRenderer;
