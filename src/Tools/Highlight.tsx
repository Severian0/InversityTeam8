import hljs from "highlight.js/lib/core";
import { Component, createMemo, mergeProps } from "solid-js";

import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("rust", rust);

import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", javascript);

import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);

type Props = {
  class?: string;
  language?: string;
  autoDetect?: boolean;
  ignoreIllegals?: boolean;
  children: any;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const Highlight: Component<Props> = (_props) => {
  const props = mergeProps(
    { autoDetect: true, ignoreIllegals: true, language: "" },
    _props,
  );

  const cannotDetectLanguage =
    !props.autoDetect && !props.language && !hljs.getLanguage(props.children);
  const className = cannotDetectLanguage ? "" : `hljs ${props.language}`;

  const getHighlightedCode = createMemo(() => {
    if (cannotDetectLanguage) {
      console.warn(
        `The language "${props.language}" you specified could not be found.`,
      );
      return escapeHtml(props.children);
    }

    if (props.autoDetect) {
      const result = hljs.highlightAuto(props.children);
      return result.value;
    } else {
      const result = hljs.highlight(props.children, {
        language: props.language,
        ignoreIllegals: props.ignoreIllegals,
      });
      return result.value;
    }
  });

  return (
    <pre>
      <code
        class={`${className} ${props.class || ""}`}
        innerHTML={getHighlightedCode()}
      />
    </pre>
  );
};

export default Highlight;
