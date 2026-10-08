import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FamilyTree from '@/components/FamilyTree';
import { EditorSidebar } from '@/components/EditorSidebar';
import { NotFound } from '@/components/NotFound';
import { TopHeaderBar } from '@/components/TopHeaderBar';
import { ControlPanel } from '@/components/ControlPanel';
import { PageModals } from './PageModals';
import { useTreeData } from '@/hooks/useTreeData';
import { useGoogleDriveTree } from '@/hooks/useGoogleDriveTree';
import { useTreeNavigation } from '@/hooks/useTreeNavigation';
import { useTreeModals } from '@/hooks/useTreeModals';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTheme } from '@/hooks/useTheme';

export function FamilyTreePage() {
  const [language, setLanguageState] = useState<'id' | 'en'>(() => {
    const saved = localStorage.getItem('familytree_lang');
    return (saved === 'id' || saved === 'en') ? saved : 'en';
  });
  const setLanguage = (lang: 'id' | 'en') => {
    localStorage.setItem('familytree_lang', lang);
    setLanguageState(lang);
  };
  const [accent, setAccent] = useState<string>('Indonesian');
  const [viewMode, setViewMode] = useState<'editor' | 'public'>('editor');
  const [canvasMode, setCanvasMode] = useState<'pointer' | 'hand'>('hand');
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { theme, setTheme } = useTheme();

  const { gedcomContent, setGedcomContent, treeData, isValid, errorMsg, updateTreeState } = useTreeData('');
  const drive = useGoogleDriveTree({ gedcomContent, isValid, onGedcomLoaded: setGedcomContent });
  const nav = useTreeNavigation(treeData?.people[0]?.id);
  const modals = useTreeModals({ treeData, updateTreeState, povId: nav.povId, setPovId: nav.setPovId });

  const isPublicPreview = viewMode === 'public' || drive.isReadOnly;

  if (!drive.isLoading && !treeData && (errorMsg || drive.errorMessage)) {
    return <NotFound />;
  }

  return (
    <div className="flex w-screen h-[100dvh] bg-background overflow-hidden relative">
      <EditorSidebar
        fileName={drive.fileName ? drive.fileName.replace(/\.ged$/i, '').trim() : 'untitled'}
        onRenameFile={(name) => {
          const cleanName = name.replace(/\.ged$/i, '').trim();
          drive.setFileName(cleanName || 'untitled');
        }}
        gedcom={gedcomContent} onGedcomChange={setGedcomContent} isValid={isValid} errorMessage={errorMsg || drive.errorMessage}
        onShare={drive.handleSaveToDrive} isSharing={drive.isSaving} isReadOnly={isPublicPreview}
        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} currentId={drive.fileId}
        onLoad={drive.handleLoadDriveId} onOpenPicker={drive.handleOpenPicker}
        onOpenLoadModal={() => setIsLoadModalOpen(true)}
        onNewTree={drive.handleNewProject}
        lastSaved={drive.lastSaved} language={language} people={treeData?.people || []}
        relationships={treeData?.relationships || []} selectedPersonId={nav.povId}
        onSelectPerson={nav.setPovId}
        onAddPerson={isPublicPreview ? undefined : modals.openAddPerson}
        onEditPerson={isPublicPreview ? undefined : modals.handleSavePerson}
        onAddChildToRelationship={isPublicPreview ? undefined : modals.openAddRelationshipChild}
        onChangeRelationshipStatus={isPublicPreview ? undefined : modals.handleChangeRelationshipStatus}
        isCollapsed={nav.isSidebarCollapsed} setIsCollapsed={nav.setIsSidebarCollapsed}
      />

      <div className="flex-1 h-full flex flex-col relative overflow-hidden min-w-0">
        <TopHeaderBar language={language} />

        <div className="flex-1 w-full min-h-0 relative overflow-hidden">
          <ReactFlowProvider>
            <FamilyTree
              data={treeData} isLoading={drive.isLoading} language={language} accent={accent}
              povId={nav.povId} setPovId={nav.setPovId} isDarkMode={isDarkMode}
              canvasMode={canvasMode} onCanvasModeChange={setCanvasMode}
              onAddRelative={isPublicPreview ? undefined : modals.openAddRelative}
              onDeletePerson={isPublicPreview ? undefined : modals.openDeleteModal}
              onAddDirectRelationship={isPublicPreview ? undefined : modals.handleAddDirectRelationship}
              onChangeRelationshipStatus={isPublicPreview ? undefined : modals.handleChangeRelationshipStatus}
              onOpenDetail={nav.handleOpenDetail}
              onAddChildToRelationship={isPublicPreview ? undefined : modals.openAddRelationshipChild}
              onAddPerson={isPublicPreview ? undefined : modals.openAddPerson}
            />

            <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center animate-in slide-in-from-bottom-4 fade-in duration-500 pointer-events-auto">
              <ControlPanel
                language={language} setLanguage={setLanguage} accent={accent} setAccent={setAccent}
                mode={viewMode} setMode={setViewMode} canToggleMode={!drive.isReadOnly}
                theme={theme} setTheme={setTheme}
                canvasMode={canvasMode} onCanvasModeChange={setCanvasMode}
                fileStatus={drive.errorMessage ? 'failed' : drive.isSaving ? 'saving' : 'saved'}
                lastAction={drive.lastAction}
                lastSaved={drive.lastSaved}
                fileErrorMessage={drive.errorMessage}
              />
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <PageModals
        isPersonModalOpen={modals.isPersonModalOpen} closePersonModal={modals.closePersonModal}
        editingPerson={modals.editingPerson} handleSavePerson={modals.handleSavePerson}
        isRelativeModalOpen={modals.isRelativeModalOpen} closeRelativeModal={modals.closeRelativeModal}
        relativeTargetPerson={modals.relativeTargetPerson} secondParent={modals.secondParent}
        relativeType={modals.relativeType}
        treeData={treeData} targetSpouses={modals.targetSpouses} handleAddRelative={modals.handleAddRelative}
        showShareModal={drive.showShareModal} setShowShareModal={drive.setShowShareModal}
        shareData={drive.shareUrl && drive.fileId ? { id: drive.fileId, url: drive.shareUrl } : null} language={language}
        isDeleteModalOpen={modals.isDeleteModalOpen} closeDeleteModal={modals.closeDeleteModal}
        deletingPerson={modals.deletingPerson} deleteDependents={modals.deleteDependents}
        onConfirmDelete={modals.handleDeletePerson}
        isLoadModalOpen={isLoadModalOpen}
        closeLoadModal={() => setIsLoadModalOpen(false)}
        onSelectGoogleDrive={drive.handleOpenPicker}
        onSelectLocalFile={drive.handleLoadLocalGedcom}
        onLoadExample={drive.handleLoadExample}
      />
    </div>
  );
}
