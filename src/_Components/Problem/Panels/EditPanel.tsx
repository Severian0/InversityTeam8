import { DockPanel, DockPanelProps } from "solid-dockview";

interface EditPanelProps {
  customId?: string;
  passProps?: Partial<DockPanelProps>;
}

let EditPanel = (props: EditPanelProps) => {
  let { customId } = props;
  return (
    <DockPanel
      id={customId || "edit-panel"}
      title="Edit Problem"
      closeable={false}
      {...props.passProps}
    >
      <div class="h-full p-5"></div>
    </DockPanel>
  );
};

export default EditPanel;
