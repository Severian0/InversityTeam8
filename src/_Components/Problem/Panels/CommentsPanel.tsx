import KatexRenderer from '../../../Tools/KatexRenderer';
import {
    Setter,
    For,
    Match,
    Show,
    Switch,
    createEffect,
    createSignal,
} from 'solid-js';
import MarkdownRenderer from '../../../Tools/MarkdownRenderer';
import { DockPanel, DockPanelProps } from 'solid-dockview';
import DateString from '../../../Tools/DateString';
import { format } from 'timeago.js';
import PostComment from '../PostComment';

interface CommentsPanelProps {
    customId?: string;
    problemId: string;
    locked?: string;
    passProps?: Partial<DockPanelProps>;
}

export interface Comment {
    id: number;
    comment_text: string | null;
    user_id: string;
    parent_id: number | null;
    created: number;
    spoiler: boolean;
    children: Comment[];
}

let CommentsPanel = (props: CommentsPanelProps) => {
    let { customId, problemId } = props;
    let [focusedComment, setFocusedComment] = createSignal<Comment | null>(
        null
    );

    let [comments, setComments] = createSignal<Comment[]>([]);

    const fetchComments = () => {
        fetch(`/api/problem/${problemId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
            });
    };
    fetchComments();

    return (
        <DockPanel
            id={customId || 'comments-panel'}
            title="Comments"
            class="flex flex-col mt-5 md:mt-11 none:md:mb-10 none:mb-5 mx-10 flex-grow"
            closeable={false}
            {...props.passProps}
        >
            <div class="group flex flex-row items-center">
                <h1 class="text-3xl">Comments:</h1>
                <button
                    class={`bg-neutral-700 bg-opacity-15 rounded-sm select-none aria-hidden text-center text-neutral-300 h-[1.5rem] text-sm font-jetbrains hover:bg-opacity-20 transition-all cursor-pointer px-1 mx-2 group-hover:opacity-100 opacity-0`}
                    onClick={() => setFocusedComment(null)}
                >
                    Reply
                </button>
            </div>

            <div class="min-h-screen">
                <Show when={comments().length}>
                    <div class="">
                        <RenderComments
                            comments={comments()}
                            firstLayer={true}
                            setFocusedComment={setFocusedComment}
                        />
                    </div>
                    <hr class="border-gray-500 my-5 opacity-80" />
                </Show>
                <Show when={!comments().length}>
                    <div class="text-gray-500 mt-3">No comments yet</div>
                </Show>
            </div>
            <PostComment
                problemId={problemId}
                class="sticky bottom-0 pt-2 bg-black/90 rounded-t-xl backdrop-blur-md"
                focusedComment={focusedComment as any}
                setFocusedComment={setFocusedComment as any}
                fetchComments={fetchComments}
            />
        </DockPanel>
    );
};

let RenderComments = (props: {
    comments: Comment[];
    firstLayer?: boolean;
    applySpoiler?: boolean;
    setFocusedComment: Setter<Comment | null>;
}) => {
    return (
        <For each={props.comments}>
            {(comment) => (
                <div
                    class={`flex flex-col mt-5 ${
                        props?.firstLayer ? '' : 'ml-5'
                    }`}
                >
                    <Comment
                        comment={comment}
                        setFocusedComment={props.setFocusedComment}
                    />
                </div>
            )}
        </For>
    );
};

export let Comment = (props: {
    comment: Comment;
    className?: string;
    setFocusedComment: Setter<Comment | null>;
}) => {
    const { comment, setFocusedComment } = props;
    let strId = comment.id
        .toString()
        .split('')
        .map((c) => 'abcdefghijklmnopqrstuvwxyz'.charAt(parseInt(c)))
        .join('');
    console.log(comment);
    return (
        <div>
            <div class={`group`}>
                <div class="flex">
                    <div class="font-bold text-lg">{comment.user_id}</div>
                    <div class="text-gray-500 ml-2">
                        {format(new Date(comment.created))}
                    </div>
                    <button
                        class={`bg-neutral-700 bg-opacity-15 rounded-sm  select-none aria-hidden text-center text-neutral-300 h-[1.5rem] text-sm font-jetbrains hover:bg-opacity-20 transition-all cursor-pointer px-1 mx-2 group-hover:opacity-100 opacity-0`}
                        onClick={() => setFocusedComment(comment)}
                    >
                        Reply
                    </button>
                </div>
                <div class="mt-2 group">
                    <Switch>
                        <Match when={comment.spoiler}>
                            <button class="bg-neutral-700 bg-opacity-10 rounded-sm w-full select-none aria-hidden text-center text-neutral-300 h-[1.5rem] text-sm font-jetbrains hover:bg-opacity-20  transition-all cursor-pointer">
                                Click to reveal spoiler
                            </button>
                        </Match>
                        <Match when={!comment.spoiler}>
                            <Show when={comment?.comment_text?.includes('$')}>
                                <KatexRenderer
                                    content={comment?.comment_text as string}
                                />
                            </Show>
                            <Show when={!comment?.comment_text?.includes('$')}>
                                <MarkdownRenderer
                                    content={comment?.comment_text as string}
                                />
                            </Show>
                        </Match>
                    </Switch>
                </div>
            </div>
            <RenderComments
                comments={comment.children.map((child) =>
                    comment.spoiler ? (child.spoiler = true) && child : child
                )}
                setFocusedComment={setFocusedComment}
            />
        </div>
    );
};

export default CommentsPanel;
