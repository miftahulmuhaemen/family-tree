import { useState } from 'react';
import FamilyTree from '@/components/FamilyTree';
import { EditorSidebar } from '@/components/EditorSidebar';
import { NotFound } from '@/components/NotFound';
import { WelcomeToast } from '@/components/WelcomeToast';
import { ControlPanel } from '@/components/ControlPanel';
import { PageModals } from './PageModals';
import { useTreeData } from '@/hooks/useTreeData';
import { useTreeRemote } from '@/hooks/useTreeRemote';
import { useTreeNavigation } from '@/hooks/useTreeNavigation';
import { useTreeModals } from '@/hooks/useTreeModals';
import { useDarkMode } from '@/hooks/useDarkMode';

export function FamilyTreePage() {
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [accent, setAccent] = useState<string>('Indonesian');
  const [viewMode, setViewMode] = useState<'editor' | 'public'>('editor');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const { gedcomContent, setGedcomContent, treeData, isValid, errorMsg, updateTreeState } = useTreeData('');
  const remote = useTreeRemote({
    gedcomContent,
    isValid,
    onGedcomLoaded: setGedcomContent
  });
  const nav = useTreeNavigation(treeData?.people[0]?.id);
  const modals = useTreeModals({
    treeData,
    updateTreeState,
    povId: nav.povId,
    setPovId: nav.setPovId
  });

  const isPublicPreview = viewMode === 'public' || remote.isReadOnly;

  if (!remote.isLoading && !treeData && (errorMsg || remote.remoteError)) {
    return <NotFound />;
  }

  return (
    <div className="flex w-screen h-[100dvh] bg-background overflow-hidden relative">
      <EditorSidebar
        gedcom={gedcomContent} onGedcomChange={setGedcomContent} isValid={isValid} errorMessage={errorMsg || remote.remoteError}
        onShare={remote.handleShareOrSave} isSharing={remote.isSharing} isReadOnly={isPublicPreview}
        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} currentId={remote.currentId}
        onLoad={remote.handleLoadId} editToken={remote.editToken} onUnlock={remote.setEditToken}
        lastSaved={remote.lastSaved} language={language} people={treeData?.people || []}
        relationships={treeData?.relationships || []} selectedPersonId={nav.povId}
        onSelectPerson={nav.setPovId}
        onAddPerson={isPublicPreview ? undefined : modals.openAddPerson}
        onEditPerson={isPublicPreview ? undefined : modals.handleSavePerson}
        onAddChildToRelationship={isPublicPreview ? undefined : modals.openAddRelationshipChild}
        isCollapsed={nav.isSidebarCollapsed} setIsCollapsed={nav.setIsSidebarCollapsed}
      />

      <div className="flex-1 h-full relative">
        <FamilyTree
          data={treeData} isLoading={remote.isLoading} language={language} accent={accent}
          povId={nav.povId} setPovId={nav.setPovId} isDarkMode={isDarkMode}
          onAddRelative={isPublicPreview ? undefined : modals.openAddRelative}
          onDeletePerson={isPublicPreview ? undefined : modals.handleDeletePerson}
          onAddDirectRelationship={isPublicPreview ? undefined : modals.handleAddDirectRelationship}
          onOpenDetail={nav.handleOpenDetail}
          onAddChildToRelationship={isPublicPreview ? undefined : modals.openAddRelationshipChild}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center animate-in slide-in-from-bottom-4 fade-in duration-500 pointer-events-auto">
          <ControlPanel
            language={language}
            setLanguage={setLanguage}
            accent={accent}
            setAccent={setAccent}
            mode={viewMode}
            setMode={setViewMode}
            canToggleMode={!remote.isReadOnly}
          />
        </div>
      </div>

      <WelcomeToast language={language} />

      <PageModals
        isPersonModalOpen={modals.isPersonModalOpen} closePersonModal={modals.closePersonModal}
        editingPerson={modals.editingPerson} handleSavePerson={modals.handleSavePerson}
        isRelativeModalOpen={modals.isRelativeModalOpen} closeRelativeModal={modals.closeRelativeModal}
        relativeTargetPerson={modals.relativeTargetPerson} secondParent={modals.secondParent}
        relativeType={modals.relativeType}
        treeData={treeData} targetSpouses={modals.targetSpouses} handleAddRelative={modals.handleAddRelative}
        showShareModal={remote.showShareModal} setShowShareModal={remote.setShowShareModal}
        shareData={remote.shareData} language={language}
      />
    </div>
  );
}
