import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YAML from 'yaml';
import FamilyTree from './components/FamilyTree';
import { EditorSidebar } from './components/EditorSidebar';
import DetailDrawer from './components/DetailDrawer';

import { ShareSuccessModal } from './components/ShareSuccessModal';
import { NotFound } from './components/NotFound';
import { WelcomeToast } from './components/WelcomeToast';
import { ControlPanel } from './components/ControlPanel';
import { TERMS } from './utils/i18n';

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Localization State
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [accent, setAccent] = useState<string>('Indonesian');

  const terms = TERMS[language];

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
        setErrorMsg(terms.config_failed);
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
        const now = new Date();
        setLastSaved(now); 
        
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
             console.log(terms.config_saved);
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

        // Try to get Last-Modified header
        const lastMod = response.headers.get('Last-Modified');
        if (lastMod) {
           setLastSaved(new Date(lastMod));
        } else {
           setLastSaved(null);
        }
        
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

  // State for Family Tree Interactions (Lifted)
  const [povId, setPovId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper for Drawer Logic
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => {
    if (window.innerWidth < 768) {
        setIsDrawerOpen(false);
    } else {
        setPovId(null);
        setIsDrawerOpen(false);
    }
  };

  const selectedPerson = treeData?.people.find((p: any) => p.id === povId) || null;


  if (!isLoading && !treeData && errorMsg === "Failed to load configuration") {
    return <NotFound />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-screen h-[100dvh] bg-background overflow-hidden relative">
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
            lastSaved={lastSaved}
            language={language}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 h-full relative">
            <FamilyTree 
              data={treeData} 
              isLoading={isLoading} 
              language={language} 
              accent={accent}
              povId={povId}
              setPovId={setPovId}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
        </div>

        {/* Unified Floating Controls Integration */}
         <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500 w-full pointer-events-none">
            {/* View Details Button (Mobile Only) */}
            {povId && !isDrawerOpen && (
              <div className="md:hidden pointer-events-auto">
                   <button
                      onClick={openDrawer}
                      className="bg-zinc-950/90 backdrop-blur-md text-zinc-200 border border-zinc-800/60 px-6 py-2 rounded-full shadow-xl font-semibold flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-700 active:scale-95 transition-all text-center"
                   >
                      <span>{terms.view_details}</span>
                   </button>
              </div>
            )}

            {/* Control Panel */}
            <div className="pointer-events-auto">
               <ControlPanel 
                  language={language} 
                  setLanguage={setLanguage}
                  accent={accent}
                  setAccent={setAccent}
                />
            </div>
         </div>
      </div>
      
      <WelcomeToast language={language} />

      <DetailDrawer
        isOpen={!!povId && isDrawerOpen}
        onClose={closeDrawer}
        person={selectedPerson}
        language={language}
      />

      <ShareSuccessModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        shareData={shareData}
        language={language}
      />
    </QueryClientProvider>
  );
}

export default App;
