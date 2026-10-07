import { GedcomEditorView } from './GedcomEditorView';

export interface YamlEditorViewProps {
  yaml: string;
  onYamlChange: (value: string) => void;
  isDarkMode: boolean;
  isLocked: boolean;
}

export function YamlEditorView({
  yaml,
  onYamlChange,
  isDarkMode,
  isLocked
}: YamlEditorViewProps) {
  return (
    <GedcomEditorView
      gedcom={yaml}
      onGedcomChange={onYamlChange}
      isDarkMode={isDarkMode}
      isLocked={isLocked}
    />
  );
}

export default YamlEditorView;
