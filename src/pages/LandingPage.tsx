import { useLandingLocale } from '../hooks/useLandingLocale';
import { useDarkMode } from '../hooks/useDarkMode';
import { LandingHeaderBar } from '../components/landing/LandingHeaderBar';
import { BrutalistGrid } from '../components/landing/BrutalistGrid';
import { CursorFollower } from '../components/landing/CursorFollower';
import { FourCornerNav } from '../components/landing/FourCornerNav';
import { BottomLeftNav } from '../components/landing/BottomLeftNav';
import { HeroCrowdStand } from '../components/landing/hero/HeroCrowdStand';
import { StorytellingSection } from '../components/landing/story/StorytellingSection';
import { FocalMarquee } from '../components/landing/focal/FocalMarquee';
import { VideoDemoSection } from '../components/landing/VideoDemoSection';
import { FeaturesAccordionSection } from '../components/landing/features/FeaturesAccordionSection';
import { BrutalistFooter } from '../components/landing/BrutalistFooter';
import { ProgressiveBlur } from '../components/landing/ProgressiveBlur';

export function LandingPage() {
  const { locale, setLocale, t } = useLandingLocale();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-clip selection:bg-pink-500 selection:text-white">
      <LandingHeaderBar locale={locale} />
      <BrutalistGrid />
      <CursorFollower />
      <FourCornerNav
        locale={locale}
        onToggleLocale={() => setLocale(locale === 'en' ? 'id' : 'en')}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
      />
      <BottomLeftNav />

      <main className="relative z-10 flex flex-col">
        <HeroCrowdStand locale={locale} />
        <div className="py-16 md:py-20">
          <FocalMarquee type="tech" />
        </div>
        <StorytellingSection locale={locale} />
        <VideoDemoSection locale={locale} />
        <FeaturesAccordionSection t={t} />
        <div className="py-16 md:py-20">
          <FocalMarquee type="features" locale={locale} />
        </div>
        <BrutalistFooter locale={locale} />
      </main>

      {/* Optical Progressive Gaussian Blur Dock hovering over underlying scrolling elements */}
      <div className="fixed bottom-0 inset-x-0 h-28 pointer-events-none z-30">
        <ProgressiveBlur direction="bottom" className="h-full" />
      </div>
    </div>
  );
}

