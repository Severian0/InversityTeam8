import { DockPanel, DockView } from "solid-dockview";
import BlogCard from "../Home/BlogCard";
import ProblemPanel from "./Panels/ProblemPanel";
import { DockviewComponent, DockviewEvent, DockviewPanel } from "dockview-core";
import CommentsPanel from "./Panels/CommentsPanel";

import "../../index.css";
import "../../Styling/dockview.css";
import NotepadPanel from "./Panels/NotepadPanel";
import { createEffect, createSignal, onMount } from "solid-js";
import HintsPanel from "./Panels/HintsPanel";
import { Editor } from "@tiptap/core";
import EditPanel from "./Panels/EditPanel";
import { getUserId } from "../../Tools/Auth";

export type DVEvent = { dockview: DockviewComponent };
type DVWProps = { dockview: DockviewComponent; props: Object };

interface DVContainerProps {
  problemId: string;
}

let DVContainer = (props: DVContainerProps) => {
  let [authorId, setAuthorId] = createSignal<string>(null as any);
  let [userId, setUserId] = createSignal<string>(null as any);
  createEffect(async () => {
    setUserId(await getUserId());
  });

  return (
    <DockView
      class="dockview-theme-replit flex-grow mx-2 mb-2"
      onReady={onReady}
    >
      <ProblemPanel problemId={props.problemId} setAuthorId={setAuthorId} />
      <NotepadPanel
        passProps={{
          floating: {
            height: 300,
            width: 300,
            x: window.innerWidth - 350,
            y: window.innerHeight - 400,
          },
        }}
        initialContent={localStorage.getItem("notepad-content") || ""}
        saveNotepad={(content) => {
          localStorage.setItem("notepad-content", content);
        }}
      />
      <HintsPanel
        problemId={props.problemId}
        passProps={{
          position: {
            referencePanel: "problem-panel",
          },
        }}
      />
      {false && authorId() && userId() && authorId() === userId() && (
        <EditPanel
          passProps={{
            position: {
              referencePanel: "problem-panel",
            },
          }}
        />
      )}

      <CommentsPanel
        problemId={props.problemId}
        passProps={{
          position: {
            referencePanel: "problem-panel",
            direction: "right",
          },
        }}
      />
    </DockView>
  );
};

let onReady = (e: DVEvent) => {
  onMount(() => {
    let problemPanel = e.dockview.panels.find((p) => p.id === "problem-panel");
    let notepadPanel = e.dockview.panels.find((p) => p.id === "notepad-panel");
    let commentsPanel = e.dockview.panels.find(
      (p) => p.id === "comments-panel",
    );

    e.dockview.setActivePanel(problemPanel!);
    // e.dockview.addFloatingGroup(notepadPanel as DockviewPanel, {
    //     x: e.dockview.width - 330,
    //     y: e.dockview.height - 330,
    // });
    // console.log(e.dockview.toJSON())
  });
  // e.dockview.setActivePanel()
};

export default DVContainer;
