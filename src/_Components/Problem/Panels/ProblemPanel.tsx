import KatexRenderer from '../../../Tools/KatexRenderer';
import { Setter, Show, createEffect, createSignal } from 'solid-js';
import MarkdownRenderer from '../../../Tools/MarkdownRenderer';
import { DockPanel, DockPanelProps } from 'solid-dockview';
import DateString from '../../../Tools/DateString';
import MathInput from '../MathInput';
import { ComputeEngine } from '@cortex-js/compute-engine';

interface ProblemPanelProps {
    customId?: string;
    problemId: string;
    passProps?: Partial<DockPanelProps>;
    setAuthorId?: Setter<string>;
}

let number = 11;

let ProblemPanel = (props: ProblemPanelProps) => {
    let { customId, problemId } = props;

    let [title, setTitle] = createSignal<string>();
    let [full, setFull] = createSignal<string>();
    let [tags, setTags] = createSignal([]);
    let [authorUsername, setAuthorUsername] = createSignal<string>();
    let [created, setCreated] = createSignal<number>();

    const ce = new ComputeEngine();

    fetch(`/api/problem/${problemId}?includeUsername=true`)
        .then((res) => res.json())
        .then((problem) => {
            setTitle(problem.title);
            setFull(problem?.full); //!
            setAuthorUsername(problem.username);
            setCreated(problem.created);
            if (props.setAuthorId) props.setAuthorId(problem.author_id);
            for (let declaration of JSON.parse(problem.declarations || null) ||
                [])
                ce.assume(declaration);
        });

    fetch(`/api/problem/${problemId}/tags`)
        .then((res) => res.json())
        .then((tags) => {
            setTags(tags);
        });

    return (
        <DockPanel
            id={customId || 'problem-panel'}
            title="Problem"
            class="flex flex-col max-h-full items-center overflow-y-scroll w-full"
            closeable={false}
            {...props.passProps}
        >
            {/* ! Don't touch, this is the only way I could get it working without having a bunch of overflows when typing text */}
            <div class="my-5 md:my-11 md:mb-10 mb-5 max-w-4xl  w-full mx-0 px-0 overflow-x-clip">
                <div class="mx-10">
                    <div class="group mb-10">
                        <h1
                            class={
                                'text-3xl  text-white opacity-90 font-base transition-colors max-h-fit max-w-fit font-plex group-hover:text-white duration-200 group-hover:hover:text-blue-400 mb-1'
                            }
                        >
                            <span class="font-semibold">{number}. </span>
                            {title() && (
                                <KatexRenderer content={title() as string} />
                            )}
                        </h1>
                        {created() && (
                            <DateString
                                timestamp={new Date(
                                    created() as number
                                ).getTime()}
                                prepend={
                                    <span>
                                        <b>{authorUsername()}</b> submitted{' '}
                                    </span>
                                }
                            />
                        )}
                    </div>

                    <div>
                        <p class="MRParent text-gray-400 font-jetbrains text-lg text-wrap mb-8">
                            <style>{`.MRParent .katex { color: rgb(220 220 220);}`}</style>
                            {full() && (
                                <MarkdownRenderer content={full() as string} />
                            )}
                        </p>
                    </div>

                    <MathInput problemId={problemId} computeEngine={ce} />
                </div>
            </div>
            <Show when={true && tags().length > 0}>
                <div class="flex  justify-start items-center pb-3 absolute bottom-0 self-center flex-wrap">
                    {tags().map((tag) => (
                        <div class="mx-1 text-gray-400 px-1  font-jetbrains text-xs border border-dotted border-neutral-500 none:hover:border-white hover:border-solid rounded-md h-fit selectable-tag cursor-default mb-1 mt-auto flex-grow whitespace-nowrap text-center">
                            {tag}
                        </div>
                    ))}
                </div>
            </Show>
        </DockPanel>
    );
};

export default ProblemPanel;
