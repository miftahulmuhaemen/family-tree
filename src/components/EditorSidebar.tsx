import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { TERMS, type Language } from '@/utils/i18n';
import type { Person, Relationship } from '@/types/family';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { useMemberFilters } from '@/hooks/useMemberFilters';
import { useSidebarResize } from '@/hooks/useSidebarResize';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarTabs, type SidebarTabType } from './sidebar/SidebarTabs';
import { PersonDetailView } from './sidebar/PersonDetailView';
import { MembersView } from './sidebar/MembersView';
import { GedcomEditorView } from './sidebar/GedcomEditorView';
import { NotificationsView } from './sidebar/NotificationsView';
import { useNotifications } from '@/context/NotificationContext';

gsap.registerPlugin(useGSAP);

export interface EditorSidebarProps {
  fileName?: string;
  onRenameFile?: (name: string) => void;
  gedcom?: string;
  onGedcomChange?: (value: string) => void;
  yaml?: string;
  onYamlChange?: (value: string) => void;
  isValid: boolean;
  errorMessage?: string;
  onShare: () => void;
  isSharing: boolean;
  isReadOnly?: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentId?: string | null;
  onLoad?: (id: string, token?: string) => Promise<void>;
  onOpenPicker?: () => void;
  onOpenLoadModal?: () => void;
  onNewTree?: () => void;
  editToken?: string | null;
  onUnlock?: (token: string) => void;
  lastSaved?: Date | null;
  language?: Language;
  people?: Person[];
  relationships?: Relationship[];
  selectedPersonId?: string | null;
  onSelectPerson?: (personId: string) => void;
  onAddPerson?: () => void;
  onEditPerson?: (person: Person) => void;
  onAddChildToRelationship?: (parent1: Person, parent2: Person) => void;
  onChangeRelationshipStatus?: (person1Id: string, person2Id: string, type: 'married' | 'divorced' | 'not_married') => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
}

export function EditorSidebar(props: EditorSidebarProps) {
  const {
    fileName, onRenameFile, gedcom, onGedcomChange, yaml, onYamlChange, isValid, errorMessage, onShare, isSharing,
    isReadOnly, isDarkMode, toggleDarkMode, currentId, onOpenPicker, onOpenLoadModal, onNewTree,
    lastSaved, language = 'id', people = [], relationships = [], selectedPersonId = null,
    onSelectPerson, onAddPerson, onEditPerson, onAddChildToRelationship, onChangeRelationshipStatus,
    isCollapsed: controlledIsCollapsed, setIsCollapsed: controlledSetIsCollapsed
  } = props;

  const isNeu = useIsNeumorphic();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(true);
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = controlledSetIsCollapsed || setInternalIsCollapsed;

  const activeGedcom = gedcom ?? yaml ?? '';
  const handleGedcomChange = onGedcomChange ?? onYamlChange ?? (() => {});
  const [activeTab, setActiveTab] = useState<SidebarTabType>('members');
  const { unseenCount } = useNotifications();

  const {
    searchQuery, setSearchQuery, filterGender, setFilterGender,
    filterStatus, setFilterStatus, filterYear, setFilterYear,
    availableBirthYears, filteredPeople
  } = useMemberFilters(people);

  const { width, isResizing, setIsResizing, sidebarRef } = useSidebarResize(440);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    const el = sidebarRef.current;
    if (!el) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(el, { width: isCollapsed ? 0 : width });
      return;
    }
    if (isResizing) {
      gsap.set(el, { width: isCollapsed ? 0 : width });
      return;
    }
    gsap.to(el, { width: isCollapsed ? 0 : width, duration: 0.3, ease: "power3.inOut" });
  }, { dependencies: [isCollapsed] });

  useEffect(() => {
    if (isResizing && sidebarRef.current && !isCollapsed) {
      sidebarRef.current.style.width = `${width}px`;
    }
  }, [width, isResizing, isCollapsed]);

  useEffect(() => {
    if (selectedPersonId) setActiveTab('detail');
  }, [selectedPersonId]);

  useEffect(() => {
    if (isReadOnly && (activeTab === 'gedcom' || activeTab === 'yaml')) {
      setActiveTab(selectedPersonId ? 'detail' : 'members');
    }
  }, [isReadOnly, activeTab, selectedPersonId]);

  const terms = TERMS[language];
  const selectedPerson = useMemo(() => {
    if (!selectedPersonId) return null;
    return people.find(p => p.id === selectedPersonId) || null;
  }, [selectedPersonId, people]);
  const isLocked = Boolean(isReadOnly);


  const handleDownloadLocalGedcom = () => {
    if (!activeGedcom) return;
    const blob = new Blob([activeGedcom], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const base = fileName ? fileName.replace(/\.ged$/i, '').trim() : 'family';
    a.download = `${base || 'family'}.ged`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Full-Height Collapsed Bar */}
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex items-center justify-center cursor-pointer group select-none",
          "w-6 sm:w-7 hover:w-8 sm:hover:w-9 transition-all duration-200 ease-out",
          isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-r border-white/60 dark:border-white/5 shadow-neu-raised-sm hover:brightness-105"
            : "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800",
          isDarkMode && "dark"
        )}
        title={terms.open_editor || "Buka Menu"}
        aria-label="Open Sidebar"
      >
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5",
          isNeu
            ? "text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
        )} />
      </button>

      {/* Sidebar Panel Wrapper */}
      <div
        ref={sidebarRef}
        className={cn(
          "h-full flex flex-row overflow-hidden shrink-0",
          "max-md:fixed max-md:top-0 max-md:left-0 max-md:z-[70] md:relative md:z-30",
          isCollapsed ? "max-md:-translate-x-full pointer-events-none" : "max-md:translate-x-0 pointer-events-auto",
          isDarkMode && "dark"
        )}
      >
        {/* Main Sidebar Content Container (completely isolated from the rail) */}
        <div
          className={cn(
            "flex-1 h-full flex flex-col overflow-hidden min-w-0",
            isNeu
              ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border-r border-white/60 dark:border-white/5"
              : "bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-xl"
          )}
        >
          <SidebarHeader
            fileName={fileName}
            onRenameFile={onRenameFile}
            currentId={currentId}
            onOpenPicker={onOpenPicker}
            onOpenLoadModal={onOpenLoadModal}
            onNewTree={onNewTree}
            onShare={onShare}
            onDownloadLocal={handleDownloadLocalGedcom}
            isSharing={isSharing}
            isValid={isValid}
            errorMessage={errorMessage}
            lastSaved={lastSaved}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onCollapse={() => setIsCollapsed(true)}
            terms={terms}
            isReadOnly={isReadOnly}
          />

          <SidebarTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasSelectedPerson={Boolean(selectedPerson)}
            peopleCount={people.length}
            terms={terms}
            isReadOnly={isReadOnly}
            unseenCount={unseenCount}
          />

          {/* Body Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {activeTab === 'detail' && selectedPerson ? (
              <PersonDetailView
                person={selectedPerson}
                people={people}
                relationships={relationships}
                onSelectPerson={onSelectPerson}
                onEditPerson={onEditPerson}
                onAddChildToRelationship={onAddChildToRelationship}
                onChangeRelationshipStatus={onChangeRelationshipStatus}
                language={language}
                terms={terms}
              />
            ) : activeTab === 'members' ? (
              <MembersView
                people={people}
                filteredPeople={filteredPeople}
                selectedPersonId={selectedPersonId}
                onSelectPerson={onSelectPerson}
                onAddPerson={onAddPerson}
                onSwitchToDetail={() => setActiveTab('detail')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterGender={filterGender}
                setFilterGender={setFilterGender}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                availableYears={availableBirthYears}
                terms={terms}
              />
            ) : activeTab === 'notifications' ? (
              <NotificationsView terms={terms} />
            ) : (
              <GedcomEditorView
                gedcom={activeGedcom}
                onGedcomChange={handleGedcomChange}
                isDarkMode={isDarkMode}
                isLocked={isLocked}
                terms={terms}
              />
            )}
          </div>
        </div>

        {/* Divider line between sidebar and shrinking button */}
        <div
          className={cn(
            "w-1.5 -mx-[3px] relative z-20 h-full shrink-0 cursor-col-resize select-none transition-colors",
            "hover:bg-zinc-400/40 dark:hover:bg-zinc-600/40 active:bg-zinc-500/60"
          )}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            setIsResizing(true);
          }}
          aria-label="Resize sidebar"
        />

        {/* Shrinking Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className={cn(
            "w-6 sm:w-7 hover:w-8 h-full shrink-0 flex items-center justify-center select-none group transition-all duration-200 cursor-pointer",
            isNeu
              ? "bg-[#e6e9ef] dark:bg-[#1c2027] border-r border-white/60 dark:border-white/5 shadow-neu-raised-sm hover:brightness-105"
              : "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
          aria-label="Collapse sidebar"
        >
          {/* Centered Chevron Icon */}
          <div
            className={cn(
              "p-1 rounded-md flex items-center justify-center transition-all",
              isNeu
                ? "text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-100"
            )}
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </div>
        </button>
      </div>
    </>
  );
}
