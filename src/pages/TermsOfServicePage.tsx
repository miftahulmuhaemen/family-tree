import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { TermsOfServiceContent } from '../components/legal/TermsOfServiceContent';

export function TermsOfServicePage() {
  return (
    <LegalPageLayout
      activeTab="tos"
      title="Terms of Service"
      subtitle="Terms governing the use of Sanak Studio open-source software, user responsibilities, and permissive MIT licensing."
      lastUpdated="October 11, 2026"
    >
      <TermsOfServiceContent />
    </LegalPageLayout>
  );
}

export default TermsOfServicePage;
