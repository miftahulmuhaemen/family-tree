import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YAML from 'yaml';
import FamilyTree from './components/FamilyTree';
import { EditorSidebar } from './components/EditorSidebar';

import { ShareSuccessModal } from './components/ShareSuccessModal';
import { NotFound } from './components/NotFound';

const queryClient = new QueryClient();

function App() {
  const [yamlContent, setYamlContent] = useState<string>('');
  const [treeData, setTreeData] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{id: string, token: string, url: string} | null>(null);

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams(window.location.search);
      const shareId = params.get('id');

      const workerUrl = import.meta.env.VITE_WORKER_URL;

      try {
        if (shareId) {
          // Read-Only mode: Fetch from R2
          setIsReadOnly(true);
          setCurrentId(shareId); // Track ID
          
          if (workerUrl) {
            const response = await fetch(`${workerUrl}/${shareId}`);
            if (!response.ok) throw new Error('Config not found');
            const text = await response.text();
            setYamlContent(text);
          } else {
             console.warn("VITE_WORKER_URL is not set. Falling back to default family.yaml for demo.");
             const response = await fetch('/family.yaml');
             const text = await response.text();
             setYamlContent(text);
          }
        } else {
          // Editor Mode: Load default
          const response = await fetch('/family.yaml');
          const text = await response.text();
          setYamlContent(text);
        }
      } catch (e) {
        console.error("Failed to load family data", e);
        setErrorMsg("Failed to load configuration");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Live Validation & Parsing
  useEffect(() => {
    if (!yamlContent) return;

    try {
      const parsed = YAML.parse(yamlContent);
      
      // Basic schema check
      if (parsed && Array.isArray(parsed.people) && Array.isArray(parsed.relationships)) {
        setTreeData(parsed);
        setIsValid(true);
        setErrorMsg('');
      } else {
        throw new Error("YAML must contain 'people' and 'relationships' arrays");
      }
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message || "Invalid YAML syntax");
    }
  }, [yamlContent]);

  const handleShareOrSave = async () => {
    if (!isValid || !yamlContent) return;
    setIsSharing(true);

    const workerUrl = import.meta.env.VITE_WORKER_URL;
    const apiToken = import.meta.env.VITE_API_TOKEN;

    if (!workerUrl) {
      alert("Worker URL is not configured in .env");
      setIsSharing(false);
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'text/yaml' };
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }
      if (editToken) {
        headers['X-Edit-Token'] = editToken;
      }

      let response;
      if (currentId) {
         // SAVE (Update existing)
         // Check if we have edit token
         if (!editToken) {
           alert("You are in Read-Only mode for this file (missing Edit Token).\n\nIf you created this file, please enter the Edit Token to unlock it.");
           setIsSharing(false);
           return;
         }

         response = await fetch(`${workerUrl}/${currentId}`, {
            method: 'PUT',
            body: yamlContent,
            headers
         });
      } else {
         // SHARE (Create new)
         response = await fetch(workerUrl, {
            method: 'POST',
            body: yamlContent,
            headers
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

      const data = await response.json();
      
      if (data.success && data.id) {
        setCurrentId(data.id); 
        
        // Update URL
        const newUrl = `${window.location.protocol}//${window.location.host}?id=${data.id}`;
        window.history.pushState({path: newUrl}, '', newUrl);

        // If it's a new file (has editToken), show the Modal
        if (data.editToken) {
           setEditToken(data.editToken);
           setShareData({
             id: data.id,
             token: data.editToken,
             url: newUrl
           });
           setShowShareModal(true);
        } else {
             // For standard updates (Save), just log or small toast (optional)
             console.log("Configuration Saved");
        }
      } else {
        throw new Error('Invalid response from worker');
      }
      
    } catch (e: any) {
      console.error("Save/Share failed", e);
      if (e.message !== "Unauthorized") {
         alert(`Failed to save: ${e.message}`);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleLoadId = async (id: string, token?: string) => {
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
        setYamlContent(text);
        setCurrentId(id);
        setEditToken(token || null); // Clear token unless provided (for future deep link handling)
        
        // Update URL
        const newUrl = `${window.location.protocol}//${window.location.host}?id=${id}`;
        window.history.pushState({path: newUrl}, '', newUrl);
        
     } catch (e) {
        console.error(e);
        throw e;
     } finally {
        setIsLoading(false);
     }
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(curr => !curr);
  };

  if (!isLoading && !treeData && errorMsg === "Failed to load configuration") {
    return <NotFound />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-screen h-screen bg-background overflow-hidden">
        {/* Editor Sidebar (only if not read-only) */}
        {!isReadOnly && (
          <EditorSidebar
            yaml={yamlContent}
            onYamlChange={setYamlContent}
            isValid={isValid}
            errorMessage={errorMsg}
            onShare={handleShareOrSave}
            isSharing={isSharing}
            isReadOnly={isReadOnly}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            currentId={currentId}
            onLoad={handleLoadId}
            editToken={editToken}
            onUnlock={setEditToken}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 h-full relative">
            <FamilyTree data={treeData} isLoading={isLoading} />
        </div>
      </div>

      <ShareSuccessModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        shareData={shareData} 
      />
    </QueryClientProvider>
  );
}

export default App;
