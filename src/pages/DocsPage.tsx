import { useState, useEffect } from 'react';
import {
  ALL_DOC_SECTION_IDS,
  getMajorSectionForSub,
  type DocMajorSectionId,
  type DocSectionId,
} from '../types/docs';
import { DocsHeader } from '../components/docs/DocsHeader';
import { DocsSidebar } from '../components/docs/DocsSidebar';
import { DocsToc } from '../components/docs/DocsToc';
import {
  HomeSection,
  AboutSection,
  FeaturesSection,
  GettingStartedSection,
  SecuritySection,
} from '../components/docs/sections';

export function DocsPage() {
  const [activeMajorId, setActiveMajorId] = useState<DocMajorSectionId>('home');
  const [activeSubId, setActiveSubId] = useState<DocSectionId>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const visibleMap = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleMap.set(entry.target.id, true);
          } else {
            visibleMap.delete(entry.target.id);
          }
        });
        const ids = ALL_DOC_SECTION_IDS.filter((id) => visibleMap.has(id));
        if (ids.length > 0) {
          const currentId = ids[ids.length - 1];
          setActiveSubId(currentId);
          setActiveMajorId(getMajorSectionForSub(currentId));
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );

    ALL_DOC_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelectMajor = (id: DocMajorSectionId) => {
    setActiveMajorId(id);
    setActiveSubId(id);
  };

  const handleSelectSub = (id: DocSectionId) => {
    setActiveSubId(id);
    setActiveMajorId(getMajorSectionForSub(id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <DocsHeader onToggleMobileMenu={() => setMobileOpen(true)} />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex-1 flex">
        <DocsSidebar
          activeMajorId={activeMajorId}
          onSelectMajorSection={handleSelectMajor}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="flex-1 min-w-0 py-6 md:px-8 max-w-4xl space-y-4">
          <HomeSection onNavigate={handleSelectSub} />
          <AboutSection />
          <FeaturesSection onNavigate={handleSelectSub} />
          <GettingStartedSection />
          <SecuritySection />
        </main>
        <DocsToc
          activeMajorId={activeMajorId}
          activeSubId={activeSubId}
          onSelectSubSection={handleSelectSub}
        />
      </div>
    </div>
  );
}

export default DocsPage;
