import KatexRenderer from "../../../Tools/KatexRenderer";
import { For, Show, createEffect, createSignal } from "solid-js";
import MarkdownRenderer from "../../../Tools/MarkdownRenderer";
import { DockPanel, DockPanelProps } from "solid-dockview";
import DateString from "../../../Tools/DateString";

interface Hint {
  id: string;
  name: string;
  content?: string;
  viewed: boolean;
}

interface HintsPanelProps {
  problemId: string;
  customId?: string;
  passProps?: Partial<DockPanelProps>;
}

let HintsPanel = (props: HintsPanelProps) => {
  let { customId, problemId } = props;
  let [reRender, setReRender] = createSignal(0);
  let [hints, setHints] = createSignal<Hint[]>([]);

  fetch(`/api/problem/${problemId}/hints`)
    .then((res) => res.json())
    .then(({ num_hints, viewed }) => {
      let hintsToSet = [];
      for (let i = 1; i <= num_hints; i++) {
        let match = viewed.find(
          (v: { hint_number: number; hint_text: string }) =>
            v.hint_number === i,
        );
        let hint: Hint = {
          id: i.toString(),
          name: `Hint ${i}`,
          content: match?.hint_text,
          viewed: !!match,
        };
        hintsToSet.push(hint);
      }
      setReRender((v) => v + 1);
      setHints(hintsToSet);
    });

  return (
    <DockPanel
      id={customId || "hints-panel"}
      title="Hints"
      class="flex flex-col my-5 md:my-11 md:mb-10 mb-5 mx-10 flex-grow"
      closeable={false}
      {...props.passProps}
    >
      <h1 class="text-3xl text-gray-200 mb-3">Hints:</h1>
      <Show when={hints().length === 0 && reRender()}>
        <div class="text-xl font-jetbrains text-orange-400">
          This problem has no hints <span class="text-nowrap">{":("}</span>
        </div>
      </Show>
      <For each={hints()}>
        {(hint) => (
          <div class="border border-neutral-600 rounded-md  hover:scale-[1.02] duration-300 transition-all ease-out mt-5">
            <button
              class="dropdown-button text-neutral-200 px-4 py-2 w-full text-left text-xl"
              onClick={() => {
                if (hint.viewed) return;
                fetch(`/api/problem/${problemId}/hints/${hint.id}`)
                  .then((res) => res.json())
                  .then((data) => {
                    hint.content = data.hint_text;
                    hint.viewed = true;
                    let index = hints().findIndex((h) => h.id === hint.id);
                    let newHints = hints();
                    newHints[index] = hint;
                    setHints(newHints);
                    setReRender((v) => v + 1);
                  });
              }}
            >
              Hint {hint.id}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6 ml-2 inline-block transition-transform duration-300 ease-out"
                style={{
                  transform:
                    reRender() && hint.viewed ? "rotate(0)" : "rotate(-90deg)",
                }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {reRender() && hint.viewed && (
              <div
                class="mt-1 px-2 py-2 text-neutral-200 opacity-0 transition-opacity duration-300 ease-in-out m-2 border-t border-dashed border-neutral-600"
                classList={{
                  "opacity-100": hint.viewed,
                }}
              >
                <MarkdownRenderer content={hint?.content as string} />
              </div>
            )}
          </div>
        )}
      </For>
    </DockPanel>
  );
};

export default HintsPanel;
