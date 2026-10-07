import { useState, useEffect, useCallback } from 'react';

export interface ShareResult {
  id: string;
  token: string;
  url: string;
}

export interface UseTreeRemoteProps {
  yamlContent: string;
  isValid: boolean;
  onYamlLoaded: (yaml: string) => void;
  configFailedMessage?: string;
}

export interface UseTreeRemoteReturn {
  currentId: string | null;
  editToken: string | null;
  lastSaved: Date | null;
  isReadOnly: boolean;
  isSharing: boolean;
  isLoading: boolean;
  remoteError: string;
  shareData: ShareResult | null;
  showShareModal: boolean;
  setShowShareModal: (val: boolean) => void;
  setEditToken: (token: string | null) => void;
  handleShareOrSave: () => Promise<void>;
  handleLoadId: (id: string, token?: string) => Promise<void>;
}

export function useTreeRemote({
  yamlContent,
  isValid,
  onYamlLoaded,
  configFailedMessage = "Gagal memuat konfigurasi"
}: UseTreeRemoteProps): UseTreeRemoteReturn {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [remoteError, setRemoteError] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareData, setShareData] = useState<ShareResult | null>(null);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const shareId = params?.get('id');
      const workerUrl = import.meta.env.VITE_WORKER_URL;

      try {
        if (shareId) {
          setIsReadOnly(true);
          setCurrentId(shareId);

          if (workerUrl) {
            const response = await fetch(`${workerUrl}/${shareId}`);
            if (!response.ok) throw new Error('Config not found');
            const text = await response.text();
            onYamlLoaded(text);
          } else {
            console.warn("VITE_WORKER_URL is not set. Falling back to default family.yaml for demo.");
            const response = await fetch('/family.yaml');
            const text = await response.text();
            onYamlLoaded(text);
          }
        } else {
          const response = await fetch('/family.yaml');
          const text = await response.text();
          onYamlLoaded(text);
        }
      } catch (e: any) {
        console.error("Failed to load family data", e);
        setRemoteError(configFailedMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShareOrSave = useCallback(async () => {
    if (!isValid || !yamlContent) return;
    setIsSharing(true);

    const workerUrl = import.meta.env.VITE_WORKER_URL;
    if (!workerUrl) {
      alert("Worker URL is not configured in .env");
      setIsSharing(false);
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'text/yaml' };
      if (editToken) {
        headers['X-Edit-Token'] = editToken;
      }

      let response: Response;
      if (currentId) {
        // SAVE (Update existing)
        response = await fetch(`${workerUrl}/${currentId}`, {
          method: 'PUT',
          headers,
          body: yamlContent
        });
      } else {
        // SHARE (Create new)
        response = await fetch(workerUrl, {
          method: 'POST',
          headers,
          body: yamlContent
        });
      }

      const status = response.status;
      if (status === 401 || status === 403) {
        alert("Unauthorized Update: Invalid or missing Edit Token.\nYou cannot overwrite this file without the correct token.");
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save config');
      }

      setLastSaved(new Date());

      if (!currentId) {
        const data = await response.json();
        setCurrentId(data.id);
        setEditToken(data.editToken);

        const newUrl = `${window.location.protocol}//${window.location.host}?id=${data.id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        setShareData({ id: data.id, token: data.editToken, url: newUrl });
        setShowShareModal(true);
      } else {
        alert("Konfigurasi berhasil disimpan!");
      }
    } catch (e: any) {
      console.error("Save/Share failed", e);
      if (e.message !== "Unauthorized") {
        alert(`Failed to save: ${e.message}`);
      }
    } finally {
      setIsSharing(false);
    }
  }, [isValid, yamlContent, currentId, editToken]);

  const handleLoadId = useCallback(async (id: string, token?: string) => {
    const workerUrl = import.meta.env.VITE_WORKER_URL;
    if (!workerUrl) {
      alert("Worker URL missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${workerUrl}/${id}`);
      if (!response.ok) throw new Error('Config not found or invalid ID');

      const text = await response.text();
      onYamlLoaded(text);
      setCurrentId(id);
      setEditToken(token || null);

      const lastMod = response.headers.get('Last-Modified');
      setLastSaved(lastMod ? new Date(lastMod) : null);

      const newUrl = `${window.location.protocol}//${window.location.host}?id=${id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [onYamlLoaded]);

  return {
    currentId,
    editToken,
    lastSaved,
    isReadOnly,
    isSharing,
    isLoading,
    remoteError,
    shareData,
    showShareModal,
    setShowShareModal,
    setEditToken,
    handleShareOrSave,
    handleLoadId
  };
}
