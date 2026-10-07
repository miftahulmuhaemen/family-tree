import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
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
import { SidebarFooter } from './sidebar/SidebarFooter';

gsap.registerPlugin(useGSAP);

export interface EditorSidebarProps {
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
  currentId: string | null;
  onLoad: (id: string, token?: string) => Promise<void>;
  editToken: string | null;
  onUnlock: (token: string) => void;
  lastSaved: Date | null;
  language?: Language;
  people?: Person[];
  relationships?: Relationship[];
  selectedPersonId?: string | null;
  onSelectPerson?: (personId: string) => void;
  onAddPerson?: () => void;
  onEditPerson?: (person: Person) => void;
  onAddChildToRelationship?: (parent1: Person, parent2: Person) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
}

export function EditorSidebar(props: EditorSidebarProps) {
  const {
    gedcom, onGedcomChange, yaml, onYamlChange, isValid, errorMessage, onShare, isSharing,
    isReadOnly, isDarkMode, toggleDarkMode, currentId, onLoad, editToken, onUnlock,
    lastSaved, language = 'id', people = [], relationships = [], selectedPersonId = null,
    onSelectPerson, onAddPerson, onEditPerson, onAddChildToRelationship,
    isCollapsed: controlledIsCollapsed, setIsCollapsed: controlledSetIsCollapsed
  } = props;

  const isNeu = useIsNeumorphic();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(true);
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = controlledSetIsCollapsed || setInternalIsCollapsed;

  const activeGedcom = gedcom ?? yaml ?? '';
  const handleGedcomChange = onGedcomChange ?? onYamlChange ?? (() => {});
  const [activeTab, setActiveTab] = useState<SidebarTabType>('members');

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
  const isLocked = Boolean(currentId && !editToken);

  return (
    <>
      {/* Floating Toggle Button (Visible when collapsed) */}
      <div className={cn(
        "fixed top-4 left-4 z-40 transition-all duration-300",
        isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none",
        isDarkMode && "dark"
      )}>
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={cn(
            "px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer",
            isNeu
              ? "shadow-neu-raised-sm active:shadow-neu-pressed bg-[#e6e9ef] dark:bg-[#1c2027] text-zinc-700 dark:text-zinc-200 border border-white/60 dark:border-white/5 hover:text-indigo-600 dark:hover:text-indigo-400"
              : "bg-white/95 dark:bg-zinc-800/95 backdrop-blur shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
          )}
          title={terms.open_editor}
        >
          <ChevronRight className={cn("w-4 h-4", isNeu ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-200")} />
          <span>Menu</span>
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={cn(
          "h-full flex flex-col overflow-hidden shrink-0",
          isNeu
            ? "bg-[#e6e9ef] dark:bg-[#1c2027] shadow-neu-raised border-r border-white/60 dark:border-white/5"
            : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl",
          "max-md:fixed max-md:top-0 max-md:left-0 max-md:z-[70] md:relative md:z-30",
          isCollapsed ? "border-r-0 max-md:-translate-x-full" : "border-r max-md:translate-x-0",
          isDarkMode && "dark"
        )}
      >
        <SidebarHeader
          currentId={currentId}
          editToken={editToken}
          onUnlock={onUnlock}
          onLoad={onLoad}
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
          ) : (
            <GedcomEditorView
              gedcom={activeGedcom}
              onGedcomChange={handleGedcomChange}
              isDarkMode={isDarkMode}
              isLocked={isLocked}
            />
          )}
        </div>

        {!isReadOnly && (
          <SidebarFooter
            isValid={isValid}
            errorMessage={errorMessage}
            lastSaved={lastSaved}
            onShare={onShare}
            isSharing={isSharing}
            isLocked={isLocked}
            currentId={currentId}
            terms={terms}
          />
        )}

        {/* Drag Handle */}
        {!isCollapsed && (
          <div
            className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/50 transition-colors z-50 group"
            onMouseDown={() => setIsResizing(true)}
          >
             <div className="absolute right-0 top-0 w-1 h-full bg-transparent group-hover:bg-indigo-400/30 transition-colors" />
          </div>
        )}
      </div>
    </>
  );
}
