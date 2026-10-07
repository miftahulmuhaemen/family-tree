import Editor from '@monaco-editor/react';

export interface GedcomEditorViewProps {
  gedcom: string;
  onGedcomChange: (value: string) => void;
  isDarkMode: boolean;
  isLocked: boolean;
}

export function GedcomEditorView({
  gedcom,
  onGedcomChange,
  isDarkMode,
  isLocked
}: GedcomEditorViewProps) {
  return (
    <Editor
      height="100%"
      language="plaintext"
      theme={isDarkMode ? "vs-dark" : "light"}
      value={gedcom}
      onChange={(value) => onGedcomChange(value || '')}
      options={{
        minimap: { enabled: true },
        fontSize: 13,
        wordWrap: 'on',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: isLocked
      }}
    />
  );
}

export default GedcomEditorView;
