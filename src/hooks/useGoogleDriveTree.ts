import { useState, useEffect, useCallback } from 'react';
import { googleDriveService } from '@/services/googleDriveService';
import { useNotifications } from '@/context/NotificationContext';

export interface UseGoogleDriveTreeProps {
  gedcomContent: string;
  isValid: boolean;
  onGedcomLoaded: (content: string) => void;
  configFailedMessage?: string;
}

export interface UseGoogleDriveTreeReturn {
  fileId: string | null;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  lastSaved: Date | null;
  lastAction: 'loaded' | 'saved';
  isSaving: boolean;
  isLoading: boolean;
  isReadOnly: boolean;
  errorMessage: string;
  shareUrl: string | null;
  showShareModal: boolean;
  setShowShareModal: (open: boolean) => void;
  handleSaveToDrive: () => Promise<void>;
  handleOpenPicker: () => Promise<void>;
  handleLoadDriveId: (id: string) => Promise<void>;
  handleLoadLocalGedcom: (content: string, name: string) => void;
  handleShareDriveFile: (role?: 'reader' | 'writer') => Promise<string | undefined>;
  handleNewProject: () => void;
  handleLoadExample: () => Promise<void>;
}

export const BLANK_GEDCOM = [
  '0 HEAD',
  '1 SOUR FamilyTree',
  '1 GEDC',
  '2 VERS 5.5.1',
  '2 FORM LINEAGE-LINKED',
  '1 CHAR UTF-8',
  '0 TRLR'
].join('\n');

export function useGoogleDriveTree({
  gedcomContent,
  isValid,
  onGedcomLoaded,
  configFailedMessage = "Gagal memuat konfigurasi dari Google Drive"
}: UseGoogleDriveTreeProps): UseGoogleDriveTreeReturn {
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setRawFileName] = useState<string | null>(null);

  const setFileName = useCallback((name: string | null) => {
    if (name === null) {
      setRawFileName(null);
    } else {
      setRawFileName(name.replace(/\.ged$/i, '').trim() || 'untitled');
    }
  }, []);

  const [lastSaved, setLastSaved] = useState<Date | null>(() => new Date());
  const [lastAction, setLastAction] = useState<'loaded' | 'saved'>('loaded');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReadOnly] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const { notify } = useNotifications();

  // Initial Data Load
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const driveId = params?.get('driveId') || params?.get('id');

      try {
        if (driveId) {
          if (isMounted) {
            setFileId(driveId);
            setIsLoading(true);
          }

          try {
            const text = await googleDriveService.loadFile(driveId);
            if (isMounted) {
              onGedcomLoaded(text);
              setLastSaved(new Date());
            }
          } catch (e: any) {
            console.warn("Could not load from Google Drive, falling back to blank project:", e);
            if (isMounted) {
              setErrorMessage(e.message || configFailedMessage);
              setFileName('untitled');
              onGedcomLoaded(BLANK_GEDCOM);
            }
          }
        } else {
          if (isMounted) {
            setFileName('untitled');
            setFileId(null);
            onGedcomLoaded(BLANK_GEDCOM);
          }
        }
      } catch (err: any) {
        console.error("Failed to load initial family tree data:", err);
        if (isMounted) {
          setErrorMessage(configFailedMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [onGedcomLoaded, configFailedMessage]);

  const handleLoadDriveId = useCallback(async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const text = await googleDriveService.loadFile(id);
      onGedcomLoaded(text);
      setFileId(id);
      setLastSaved(new Date());
      setLastAction('loaded');

      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?driveId=${encodeURIComponent(id)}`;
      window.history.pushState({ path: newUrl }, '', newUrl);

      notify({
        title: "Berkas Berhasil Dimuat",
        message: fileName || `Google Drive (${id.slice(0, 8)}...)`,
        type: "success"
      });
    } catch (e: any) {
      console.error("Failed to load file from Google Drive:", e);
      setErrorMessage(e.message || "Gagal memuat berkas");
      notify({
        title: "Gagal Memuat Berkas",
        message: e.message || "Gagal memuat berkas dari Google Drive",
        type: "error"
      });
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [onGedcomLoaded, fileName, notify]);

  const handleSaveToDrive = useCallback(async () => {
    if (!isValid || !gedcomContent) return;
    setIsSaving(true);
    setErrorMessage('');

    try {
      const base = (fileName && fileName.trim()) ? fileName.replace(/\.ged$/i, '').trim() : 'family';
      const targetName = `${base || 'family'}.ged`;
      const result = await googleDriveService.saveFile(targetName, gedcomContent, fileId || undefined);

      setFileId(result.id);
      setFileName(result.name);
      setLastSaved(new Date());
      setLastAction('saved');

      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?driveId=${encodeURIComponent(result.id)}`;
      window.history.pushState({ path: newUrl }, '', newUrl);

      notify({
        title: "Tersimpan ke Google Drive",
        message: base || 'family',
        type: "success"
      });

      // If first save, open the share modal automatically
      if (!fileId) {
        setShareUrl(newUrl);
        setShowShareModal(true);
      }
    } catch (e: any) {
      console.error("Failed to save file to Google Drive:", e);
      setErrorMessage(e.message || "Gagal menyimpan ke Google Drive");
      notify({
        title: "Gagal Menyimpan ke Google Drive",
        message: e.message || "Gagal menyimpan berkas ke Google Drive",
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }, [isValid, gedcomContent, fileName, fileId, notify]);

  const handleOpenPicker = useCallback(async () => {
    try {
      await googleDriveService.openPicker(async (selectedId, selectedName) => {
        setFileName(selectedName);
        await handleLoadDriveId(selectedId);
      });
    } catch (e: any) {
      console.error("Failed to open Google Drive picker:", e);
      alert(`Gagal membuka Google Drive: ${e.message}`);
    }
  }, [handleLoadDriveId]);

  const handleShareDriveFile = useCallback(async (role: 'reader' | 'writer' = 'reader') => {
    let currentTargetId = fileId;

    if (!currentTargetId) {
      if (!isValid || !gedcomContent) {
        alert("Konfigurasi belum valid untuk dibagikan");
        return undefined;
      }
      setIsSaving(true);
      try {
        const base = (fileName && fileName.trim()) ? fileName.replace(/\.ged$/i, '').trim() : 'family';
        const targetName = `${base || 'family'}.ged`;
        const result = await googleDriveService.saveFile(targetName, gedcomContent);
        currentTargetId = result.id;
        setFileId(result.id);
        setFileName(result.name);
        setLastSaved(new Date());
      } finally {
        setIsSaving(false);
      }
    }

    try {
      await googleDriveService.setPublicPermission(currentTargetId, role);
      const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?driveId=${encodeURIComponent(currentTargetId)}`;
      setShareUrl(url);
      setShowShareModal(true);
      return url;
    } catch (e: any) {
      console.error("Failed to set public permission on Google Drive:", e);
      alert(`Gagal membagikan berkas: ${e.message}`);
      return undefined;
    }
  }, [fileId, isValid, gedcomContent, fileName]);

  const handleLoadLocalGedcom = useCallback((content: string, name: string) => {
    setFileName(name);
    setFileId(null);
    setLastSaved(new Date());
    setLastAction('loaded');
    setErrorMessage('');
    onGedcomLoaded(content);

    notify({
      title: "Berkas Lokal Dimuat",
      message: name,
      type: "success"
    });

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('driveId');
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  }, [onGedcomLoaded, notify]);

  const handleNewProject = useCallback(() => {
    setFileId(null);
    setFileName('untitled');
    setShareUrl(null);
    setErrorMessage('');
    setLastSaved(new Date());
    setLastAction('loaded');
    onGedcomLoaded(BLANK_GEDCOM);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('driveId');
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }

    notify({
      title: "Proyek Baru",
      message: "Silsilah keluarga kosong siap diisi",
      type: "info"
    });
  }, [onGedcomLoaded, notify]);

  const handleLoadExample = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/family.ged');
      if (!response.ok) throw new Error('Gagal mengunduh berkas contoh');
      const text = await response.text();
      setFileId(null);
      setFileName('family');
      setLastSaved(new Date());
      setLastAction('loaded');
      onGedcomLoaded(text);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('driveId');
        url.searchParams.delete('id');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }

      notify({
        title: "Contoh Silsilah Dimuat",
        message: "family",
        type: "success"
      });
    } catch (e: any) {
      console.error("Failed to load example tree:", e);
      setErrorMessage(e.message || "Gagal memuat contoh silsilah");
      notify({
        title: "Gagal Memuat Contoh",
        message: e.message || "Gagal memuat berkas contoh",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [onGedcomLoaded, notify]);

  return {
    fileId,
    fileName,
    setFileName,
    lastSaved,
    lastAction,
    isSaving,
    isLoading,
    isReadOnly,
    errorMessage,
    shareUrl,
    showShareModal,
    setShowShareModal,
    handleSaveToDrive,
    handleOpenPicker,
    handleLoadDriveId,
    handleLoadLocalGedcom,
    handleShareDriveFile,
    handleNewProject,
    handleLoadExample
  };
}
