import Editor from '@monaco-editor/react';

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
    <Editor
      height="100%"
      language="yaml"
      theme={isDarkMode ? "vs-dark" : "light"}
      value={yaml}
      onChange={(value) => onYamlChange(value || '')}
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
