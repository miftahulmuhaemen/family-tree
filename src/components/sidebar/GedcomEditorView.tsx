import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { useNotifications } from '@/context/NotificationContext';
import { validateGedcomDetailed, type GedcomValidationResult } from '@/utils/gedcomValidation';

export interface GedcomEditorViewProps {
  gedcom: string;
  onGedcomChange: (value: string) => void;
  isDarkMode: boolean;
  isLocked: boolean;
  terms?: any;
}

export function GedcomEditorView({
  gedcom,
  onGedcomChange,
  isDarkMode,
  isLocked,
  terms
}: GedcomEditorViewProps) {
  const [code, setCode] = useState(gedcom);
  const [validationResult, setValidationResult] = useState<GedcomValidationResult>(() =>
    validateGedcomDetailed(gedcom)
  );
  const isNeu = useIsNeumorphic();
  const { notify } = useNotifications();
  const editorRef = useRef<any>(null);

  // Synchronize when external gedcom changes (e.g. file loaded or edited via forms)
  useEffect(() => {
    setCode(gedcom);
    setValidationResult(validateGedcomDetailed(gedcom));
  }, [gedcom]);

  const handleSaveAndValidate = () => {
    const result = validateGedcomDetailed(code);
    setValidationResult(result);
    if (result.isValid) {
      onGedcomChange(code);
      notify({
        title: terms?.gedcom_updated || "GEDCOM Diperbarui",
        message: terms?.gedcom_updated_desc || "Tampilan node keluarga berhasil disegarkan.",
        type: "success"
      });
    } else {
      notify({
        title: terms?.validation_failed || "Validasi GEDCOM Gagal",
        message: result.message.replace(/^Validation check, bad:\s*/, ''),
        type: "error"
      });
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    // Cmd+S or Ctrl+S keyboard shortcut inside Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveAndValidate();
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Validation & Save Toolbar (Below tabs, zero color indicator) */}
      <div className={cn(
        "shrink-0 px-3 py-2 border-b flex items-center justify-between gap-2 select-none",
        isNeu
          ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5"
          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
      )}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
            {validationResult.status === 'good' ? 'Validation check, good!' : 'Validation check, bad:'}
          </span>
          {validationResult.status === 'bad' && (
            <span
              className="text-xs text-zinc-600 dark:text-zinc-400 truncate cursor-default"
              title={validationResult.message}
            >
              {validationResult.message.replace(/^Validation check, bad:\s*/, '')}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSaveAndValidate}
          disabled={isLocked}
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-lg border transition-all shrink-0 cursor-pointer select-none",
            isNeu
              ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-900 dark:text-zinc-100 border-white/60 dark:border-white/5"
              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 shadow-xs",
            isLocked && "opacity-50 cursor-not-allowed"
          )}
          title="Save to refresh view nodes"
        >
          {terms?.save || "Save"}
        </button>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language="plaintext"
          theme={isDarkMode ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
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
      </div>
    </div>
  );
}

export default GedcomEditorView;
