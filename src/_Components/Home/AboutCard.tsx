import { Show, createEffect, createSignal } from "solid-js";
import fm from "front-matter";
import MarkdownRenderer from "../../Tools/MarkdownRenderer";

interface AboutCardProps {
  title?: string;
  text?: string;
  link?: string;
  className?: string;
  width?: number;
}

let AboutCard = (props: AboutCardProps) => {
  let { className } = props;

  let [content, setContent] = createSignal(props.text);
  let [title, setTitle] = createSignal(props.title);
  let [link, setLink] = createSignal(props.link);

  return (
    <div
      style={{
        "max-width": props.width + "px",
        width: props.width + "px",
      }}
      class={` rounded-lg overflow-hidden border border-solid group duration-300 ease-out md:border-neutral-500 shadow-md m-2 border-orange-500 hover:border-orange-500 hover:shadow-xl transition-all group ${className}`}
    >
      <div class="p-4 flex flex-col">
        <div class="flex items-center justify-between basis-2/3">
          <a href={link()}>
            <h1
              class={
                "text-2xl opacity-90 mb-4 mt-2 transition-colors text-neutral-200  font-plex group-hover:text-white duration-300 ease-out  group-hover:hover:text-blue-400 text-glow"
              }
            >
              {title()}
            </h1>
          </a>
        </div>
        <div class="flex flex-col md:flex-row basis-1/3">
          <Show when={content()}>
            <MarkdownRenderer
              content={content() as string}
              className="text-sm mini-h-full text-gray-400 mb-2 flex-grow-1"
            />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default AboutCard;
