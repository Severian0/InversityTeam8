import { DockPanel, DockPanelProps } from "solid-dockview";

interface NotepadPanelProps {
  customId?: string;
  passProps?: Partial<DockPanelProps>;
  saveNotepad?: (content: string) => void;
  initialContent?: string;
}

let NotepadPanel = (props: NotepadPanelProps) => {
  let { customId } = props;
  return (
    <DockPanel
      id={customId || "notepad-panel"}
      title="Notepad"
      closeable={false}
      {...props.passProps}
    >
      <div class="h-full p-5">
        <textarea
          id="notepad-textarea"
          rows={100}
          class="font-jetbrains h-full w-full bg-transparent focus:outline-none text-neutral-200 placeholder-neutral-300 rounded-lg p-2 transition duration-300 ease-in-out resize-none"
          placeholder="type your notes here..."
          onInput={(e) => {
            let textarea = e.target as HTMLTextAreaElement;
            if (props.saveNotepad) {
              props.saveNotepad(textarea.value);
            }
          }}
        >
          {props.initialContent || ""}
        </textarea>
      </div>
    </DockPanel>
  );
};

export default NotepadPanel;
