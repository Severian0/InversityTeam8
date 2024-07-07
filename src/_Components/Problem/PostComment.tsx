import Mathematics from '@tiptap-pro/extension-mathematics';
import CharacterCount from '@tiptap/extension-character-count';
import StarterKit from '@tiptap/starter-kit';
import { createTiptapEditor } from 'solid-tiptap';
import '../../Styling/tiptap.css';
import Placeholder from '@tiptap/extension-placeholder';
import { Accessor, Match, Setter, Show, Switch, createSignal } from 'solid-js';
import { Comment } from './Panels/CommentsPanel';

const COMMENT_MAX_CHARS = 1000;

interface PostCommentProps {
    problemId: string;
    onCommentPost?: () => void;
    class?: string;
    focusedComment: Accessor<Comment | null>;
    setFocusedComment: Setter<Comment | null>;
    fetchComments: () => void;
}

let PostComment = (props: PostCommentProps) => {
    let editorRef!: HTMLDivElement;
    let titleEditorRef!: HTMLDivElement;
    let [status, setStatus] = createSignal<string>('');

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        extensions: [
            StarterKit,
            Mathematics,
            Placeholder.configure({
                placeholder: 'Type your $LaTeX$ comment here',
            }),
            CharacterCount.configure({
                limit: COMMENT_MAX_CHARS,
                mode: 'nodeSize',
            }),
        ],
    }));

    // api.post('/problem/:id/comment', async (c) => {
    //     const id = c.req.param('id');
    //     const user = c.get('user') as User;
    //     const link = `/problem/${id}`;

    //     if (userNeedsAuth(c)) return c.text('Please log in.', 401);

    //     // console.log(await c.req.text())
    //     let { commentText, parent } = await c.req.json();
    //     if (!commentText) return c.text('Comment text is required', 400); // Maybe remove the text later for some security through obscurity

    //     parent = Number.parseInt(parent) ?? null;
    //     if (isNaN(parent)) return c.text('Invalid parent', 400);
    //     if (parent) {
    //         const parentExists = await c.env.DB.prepare(
    //             'SELECT id FROM comments WHERE id = ?'
    //         )
    //             .bind(parent)
    //             .first('id');
    //         if (!parentExists) return c.text('Parent does not exist', 400);
    //     }

    //     try {
    //         console.log(link, user.id, commentText, parent);
    //         await c.env.DB.prepare(
    //             'INSERT INTO comments (problem_link, user_id, comment_text, parent_id, created) VALUES (?, ?, ?, ?, ?)'
    //         )
    //             .bind(link, user.id, commentText, parent, Date.now())
    //             .run();

    //         return c.text('OK');
    //     } catch (e) {
    //         console.error(e);
    //         return c.text('Internal Server Error', 500);
    //     }
    // });
    const postComment = async () => {
        let comment = editor()?.getText();
        if (!comment || comment.trim() === '') return;

        if (status() === 'posting') return;

        setStatus('posting');
        let req = await fetch(`/api/problem/${props.problemId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentText: comment,
                parent: props.focusedComment()?.id || null,
            }),
        });

        if (req.ok) {
            editor()?.commands.clearContent();
            props.onCommentPost?.();
            props.setFocusedComment(null);
            setStatus('posted');
        } else {
            setStatus('error');
        }
        props.fetchComments();
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div class={props.class || ''}>
            <Show when={props.focusedComment()}>
                <div
                    class="font-jetbrains whitespace-nowrap truncate mb-1 cursor-pointer hover:line-through"
                    onclick={() => props.setFocusedComment(null)}
                >
                    Replying to{' '}
                    <span class="font-bold text-white">
                        {(props.focusedComment() as Comment).user_id}
                    </span>
                    {' - '}
                    <span class="text-neutral text-neutral-600">
                        {(props.focusedComment() as any).comment_text}
                    </span>
                </div>
            </Show>
            <Show when={!props.focusedComment()}>
                <div class="font-jetbrains mb-1">Post a comment:</div>
            </Show>
            <div
                ref={editorRef}
                class="main-editor MRParent text-gray-400 font-jetbrains text-lg  text-wrap border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full p-2 h-fit overflow-y-auto"
            ></div>
            <button
                class="mt-4 mb-3 bg-neutral-700 bg-opacity-15 rounded-sm w-full select-none aria-hidden text-center text-neutral-300 h-[1.5rem] text-sm font-jetbrains hover:bg-opacity-20 transition-all cursor-pointer"
                onclick={postComment}
                classList={{
                    'cursor-not-allowed': status() === 'posting',
                    'text-red-500': status() === 'error',
                }}
            >
                <Switch>
                    <Match when={status() === ''}>Post</Match>
                    <Match when={status() === 'posting'}>Posting</Match>
                    <Match when={status() === 'posted'}>Posted</Match>
                    <Match when={status() === 'error'}>
                        Error posting comment
                    </Match>
                </Switch>
            </button>
        </div>
    );
};

export default PostComment;
