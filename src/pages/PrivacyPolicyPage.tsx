import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { PrivacyPolicyContent } from '../components/legal/PrivacyPolicyContent';

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      activeTab="policy"
      title="Privacy Policy"
      subtitle="Sanak Studio is designed around local computing and client ownership. Your family records and genealogical data remain exclusively on your device."
      lastUpdated="October 11, 2026"
    >
      <PrivacyPolicyContent />
    </LegalPageLayout>
  );
}

export default PrivacyPolicyPage;
